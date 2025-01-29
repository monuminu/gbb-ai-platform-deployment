import os
import json
import base64
from datetime import datetime, timedelta

from azure.cosmos import CosmosClient
from azure.storage.queue import QueueServiceClient
from azure.storage.blob.aio import BlobServiceClient
from azure.core.exceptions import ResourceNotFoundError
from azure.storage.blob import BlobSasPermissions, generate_blob_sas

from quart import (Blueprint,  jsonify, request)

from component import knowledge_component


bp = Blueprint("knowledge_route", __name__)

client = CosmosClient(
    os.environ["AZURE_COSMOS_ENDPOINT"], os.environ["AZURE_COSMOS_KEY"])
COSMOS_DB_ID = f'{os.environ["AZURE_COSMOS_DB_PREFIX"]}KnowledgeBases'
cosmosDB = client.get_database_client(COSMOS_DB_ID)
cosmosContainer = cosmosDB.get_container_client("Catalog")

connection_string = os.environ["AZURE_STORAGE_CONNECTION_STRING"]
queue_name = os.environ["AZURE_STORAGE_QUEUE_NAME"]

AZURE_STORAGE_ACCOUNT = os.environ["AZURE_STORAGE_ACCOUNT"]
AZURE_STORAGE_CONTAINER = os.environ["AZURE_STORAGE_CONTAINER"]
blob_client = BlobServiceClient.from_connection_string(
    os.environ["AZURE_STORAGE_CONNECTION_STRING"])
blob_container_client = blob_client.get_container_client(
    AZURE_STORAGE_CONTAINER)

ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'json', 'jpeg', 'png', 'gif', 'md',
                      'html', 'htm', 'xlsx', 'csv', 'doc', 'docx', 'ppt', 'pptx'}


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def generate_sas_url(blob_client):
    sas_token = generate_blob_sas(
        blob_client.account_name,
        blob_client.container_name,
        blob_client.blob_name,
        account_key=blob_client.credential.account_key,
        permission=BlobSasPermissions(read=True),
        expiry=datetime.utcnow() + timedelta(hours=8)
    )

    sas_url = f"https://{blob_client.account_name}.blob.core.windows.net/{blob_client.container_name}/{blob_client.blob_name}?{sas_token}"

    return sas_url


@bp.route("/kmm/sources", methods=["POST"])
async def list_sources():
    try:
        request_data = await request.get_json()
        citation = request_data.get("citation", '')

        if len(citation) > 0:
            comps = citation.split('/')
            blob_name = citation
            if len(comps) > 1:
                blob_name = f'{comps[-2]}/{comps[-1]}'

            try:
                blob_client = blob_container_client.get_blob_client(blob_name)
            except ResourceNotFoundError as e:
                return jsonify({"message": str(e), "success": False}), 500

            sas_url = generate_sas_url(blob_client)

        return jsonify({"url": sas_url}), 200
    except Exception as e:
        return jsonify({"message": str(e), "success": False}), 500


@bp.route("/kmm/list", methods=["GET"])
def list_kmm():
    item_list = list(cosmosContainer.read_all_items(max_item_count=10))
    return jsonify(item_list), 200


@bp.route("/kmm/kb/create", methods=["POST"])
async def create_kb():
    try:
        request_data = await request.get_json()
        kb_id = request_data.get("kbId", '')
        kb_name = request_data.get("kbName", '')
        index_name = request_data.get("indexName", '')
        tags = request_data.get("tags", [])
        shared = request_data.get("shared", [])
        if kb_name.strip() == '' or index_name.strip() == '':
            return jsonify({"message": "Missing required parameters", "success": False}), 400

        msg = await knowledge_component.create_kb(kb_id, kb_name, index_name, tags, shared)
        if msg['success']:
            return jsonify({"message": "Created successfully", "success": True}), 200
        else:
            return jsonify(msg), 400
    except Exception as e:
        return jsonify({"message": str(e), "success": False}), 500


@bp.route("/kmm/delete", methods=["POST"])
async def delete_kb():
    try:
        request_data = await request.get_json()
        kb_id = request_data.get("kbId", '')
        index_name = request_data.get("indexName", '')
        if kb_id.strip() == '':
            return jsonify({"message": "Missing required parameters", "success": False}), 400

        msg = await knowledge_component.delete_knowledge(kb_id, index_name)
        if msg['success']:
            return jsonify(msg), 200
        else:
            return jsonify(msg), 400
    except Exception as e:
        return jsonify({"message": str(e), "success": False}), 500


@bp.route("/kmm/<id>", methods=["GET"])
def get_kb(id: str):
    item = cosmosContainer.read_item(item=id, partition_key=id)

    return jsonify(item), 200


@bp.route("/kmm/<id>/items", methods=["GET"])
def get_kb_items(id: str):
    kbContainer = cosmosDB.get_container_client(f'Kb-{id}')
    item_list = list(kbContainer.read_all_items(max_item_count=10))
    return jsonify(item_list), 200


@bp.route("/kmm/<kbId>/items/<id>", methods=["GET"])
def get_kb_item(kbId: str, id: str):
    kbContainer = cosmosDB.get_container_client(f'Kb-{kbId}')
    item = kbContainer.read_item(item=id, partition_key=id)
    return jsonify(item), 200


@bp.route("/kmm/kb/<id>/create", methods=["POST"])
async def add_kb_item(id: str):
    try:
        request_data = await request.get_json()
        kbContainer = cosmosDB.get_container_client(f'Kb-{id}')
        kbContainer.upsert_item(body=request_data)
        return jsonify({"message": "Created successfully", "success": True}), 200
    except Exception as e:
        return jsonify({"message": str(e), "success": False}), 500


@bp.route("/kmm/kb/<id>/upload", methods=["POST"])
async def upload_file(id: str):
    try:
        files = await request.files
        form_data = await request.form
        additional_data = json.loads(form_data.get('additionalData'))

        file = files['file']

        if not file:
            return jsonify({'message': 'No file part'}), 400

        kbContainer = cosmosDB.get_container_client(f'Kb-{id}')

        tags = additional_data.get("tags", [])
        shared = additional_data.get("shared", [])

        item = ''
        if allowed_file(file.filename):
            await blob_container_client.upload_blob(name=file.filename, data=file, overwrite=True)
            dbItem = knowledge_component.form_kb_item(additional_data['id'],
                                                      file.filename,
                                                      additional_data['size'],
                                                      tags=tags,
                                                      shared=shared)
            res = kbContainer.upsert_item(dbItem)
            if res['id'] == dbItem['id']:
                item = dbItem
        else:
            return jsonify({'message': f'"{file.filename}" file format is not supported.', "success": False}), 400

        return jsonify({'message': 'File uploaded', 'item': item, "success": True}), 200
    except Exception as e:
        return jsonify({"message": str(e), "success": False}), 500


@bp.route("/kmm/kb/<kbId>/index/<id>", methods=["POST"])
async def start_indexing(kbId: str, id: str):
    try:
        request_json = await request.get_json()
        indexName = request_json.get("indexName", '')
        filePrefix = request_json.get("filePrefix", '')
        containerName = request_json.get("containerName", '')

        if not indexName or not filePrefix or not containerName:
            return jsonify({"message": "Missing required parameters", "success": False}), 400

        knowledge_component.update_status_in_cosmosdb(kbId, id, "Preparing...")

        payload = {
            'containerName': containerName,
            'filePrefix': filePrefix,
            'indexName': indexName,
            'kbId': kbId,
            'id': id,
        }

        message = json.dumps(payload)

        message_bytes = message.encode('utf-8')
        base64_bytes = base64.b64encode(message_bytes)
        base64_message = base64_bytes.decode('utf-8')

        # Create a QueueServiceClient object
        queue_service_client = QueueServiceClient.from_connection_string(
            connection_string)

        # Get a reference to the queue
        queue_client = queue_service_client.get_queue_client(queue_name)

        # Send the message to the queue
        res = queue_client.send_message(base64_message)

        if res.id is not None:
            return jsonify({"message": "Job sent successfully", "success": True}), 200

        return jsonify({"message": "Creation Failed", "success": False}), 400
    except Exception as e:
        return jsonify({"message": str(e), "success": False}), 500
