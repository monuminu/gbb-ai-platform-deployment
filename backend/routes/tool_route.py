import os
import json
from datetime import datetime, timedelta
from quart import (abort, jsonify, request, Blueprint)

from azure.cosmos import CosmosClient
from azure.storage.blob.aio import BlobServiceClient
from azure.core.exceptions import ResourceNotFoundError
from azure.storage.blob import BlobSasPermissions, generate_blob_sas


bp = Blueprint("tools_route", __name__)

client = CosmosClient(os.environ["AZURE_COSMOS_ENDPOINT"],
                      os.environ["AZURE_COSMOS_KEY"])

cosmosDB = client.get_database_client(os.environ["AZURE_COSMOS_DB_PREFIX"])
cosmosContainer = cosmosDB.get_container_client("Tools")

blob_client = BlobServiceClient.from_connection_string(
    os.environ["AZURE_STORAGE_CONNECTION_STRING"])
blob_container_client = blob_client.get_container_client("tools")

ALLOWED_EXTENSIONS = {'jpg', 'jpeg', 'png', 'bmp'}


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


@bp.route("/tools/test", methods=["GET"])
def upsert_ml_app():
    return "Hello, Tools!"


@bp.route("/tools", methods=["GET"])
def list_tools():
    item_list = list(cosmosContainer.read_all_items(max_item_count=10))

    for item in item_list:
        cover = item.get('cover')
        if cover and cover.find("/static/mock-images/") < 0:
            try:
                blob_client = blob_container_client.get_blob_client(cover)
            except ResourceNotFoundError:
                continue

            sas_url = generate_sas_url(blob_client)
            item['cover'] = sas_url

    return jsonify(item_list), 200


@bp.route("/tools/<id>", methods=["GET"])
def get_tool(id: str):
    item = cosmosContainer.read_item(item=id, partition_key=id)

    cover = item.get('cover')
    if cover and cover.find("/static/mock-images/") < 0:
        try:
            blob_client = blob_container_client.get_blob_client(cover)
        except ResourceNotFoundError:
            pass

        sas_url = generate_sas_url(blob_client)
        item['cover'] = sas_url

    return jsonify(item), 200


@bp.route("/tools/create", methods=["POST"])
async def create_tool():
    try:
        files = await request.files
        form_data = await request.form
        tool_data = json.loads(form_data.get('toolData'))

        item = ''
        cover_sas_url = ''

        if len(files) == 0:
            res = cosmosContainer.upsert_item(tool_data)
            if res['id'] == tool_data['id']:
                item = tool_data

                if tool_data['cover'] != "":
                    try:
                        blob_client = blob_container_client.get_blob_client(
                            tool_data['cover'])
                        cover_sas_url = generate_sas_url(blob_client)
                        if cover_sas_url != '':
                            item['cover'] = cover_sas_url
                    except ResourceNotFoundError:
                        pass
        else:
            for file_key in files.keys():
                if file_key == 'file':
                    file = files['file']
                    if allowed_file(file.filename):
                        await blob_container_client.upload_blob(name=tool_data['cover'], data=file, overwrite=True)
                        try:
                            blob_client = blob_container_client.get_blob_client(
                                tool_data['cover'])
                            cover_sas_url = generate_sas_url(blob_client)
                        except ResourceNotFoundError:
                            pass
                    else:
                        return jsonify({'message': 'Cover image not supported', "success": False}), 400

            print("tool_data: ", tool_data)
            res = cosmosContainer.upsert_item(tool_data)
            print("tool_data upserted: ")
            if res['id'] == tool_data['id']:
                item = tool_data
                if cover_sas_url != '':
                    item['cover'] = cover_sas_url

        return jsonify({'message': 'Tool uploaded', 'item': item, "success": True}), 200
    except Exception as e:
        return jsonify({"message": str(e), "success": False}), 500


@bp.route("/tools/delete", methods=["POST"])
async def delete_tool():
    try:
        request_data = await request.get_json()
        tool_id = request_data.get("toolId", '')
        if tool_id.strip() == '':
            return jsonify({"message": "Missing required parameters", "success": False}), 400

        cosmosContainer.delete_item(item=tool_id, partition_key=tool_id)

        return jsonify({"message": "Deleted successfully", "success": True}), 200
    except Exception as e:
        return jsonify({"message": str(e), "success": False}), 500
