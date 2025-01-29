import os
import json
from datetime import datetime, timedelta
from quart import (jsonify, request, Blueprint)

from azure.cosmos import CosmosClient
from azure.storage.blob.aio import BlobServiceClient
from azure.core.exceptions import ResourceNotFoundError
from azure.storage.blob import BlobSasPermissions, generate_blob_sas


bp = Blueprint("applications_route", __name__)

client = CosmosClient(os.environ["AZURE_COSMOS_ENDPOINT"],
                      os.environ["AZURE_COSMOS_KEY"])

cosmosDB = client.get_database_client(os.environ["AZURE_COSMOS_DB_PREFIX"])
cosmosContainer = cosmosDB.get_container_client("Apps")

blob_client = BlobServiceClient.from_connection_string(
    os.environ["AZURE_STORAGE_CONNECTION_STRING"])
blob_container_client = blob_client.get_container_client("apps")

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


@bp.route("/apps/test", methods=["GET"])
def upsert_ml_app():
    return "Hello, Applications!"


@bp.route("/apps", methods=["GET"])
def list_apps():
    item_list = list(cosmosContainer.read_all_items(max_item_count=10))

    for item in item_list:
        if item.get('source') == 'custom':
            cover = item.get('cover')
            if cover:
                try:
                    blob_client = blob_container_client.get_blob_client(cover)
                except ResourceNotFoundError:
                    continue

                sas_url = generate_sas_url(blob_client)
                item['cover'] = sas_url

    return jsonify(item_list), 200


@bp.route("/apps/custom-gpt/create", methods=["POST"])
async def create_custom_gpt():
    try:
        files = await request.files
        form_data = await request.form
        app_data = json.loads(form_data.get('appData'))

        item = ''
        cover_sas_url = ''

        if len(files) == 0:
            res = cosmosContainer.upsert_item(app_data)
            if res['id'] == app_data['id']:
                item = app_data
        else:
            for file_key in files.keys():
                if file_key == 'file':
                    file = files['file']
                    if allowed_file(file.filename):
                        await blob_container_client.upload_blob(name=app_data['cover'], data=file, overwrite=True)
                        try:
                            blob_client = blob_container_client.get_blob_client(
                                app_data['cover'])
                            cover_sas_url = generate_sas_url(blob_client)
                        except ResourceNotFoundError:
                            pass
                    else:
                        return jsonify({'message': 'Cover image not supported', "success": False}), 400
                elif file_key.startswith("prompt"):
                    file = files[file_key]
                    reformed_file_name = f'{app_data["id"]}-{file_key}.{file.filename.split(".")[-1]}'
                    # print(reformed_file_name)
                    await blob_container_client.upload_blob(name=reformed_file_name, data=files[file_key], overwrite=True)

            res = cosmosContainer.upsert_item(app_data)
            if res['id'] == app_data['id']:
                item = app_data
                if cover_sas_url != '':
                    item['cover'] = cover_sas_url

        return jsonify({'message': 'Custom GPT uploaded', 'item': item, "success": True}), 200
    except Exception as e:
        return jsonify({"message": str(e), "success": False}), 500


@bp.route("/apps/custom-gpt/delete", methods=["POST"])
async def delete_custom_gpt():
    try:
        request_data = await request.get_json()
        gpt_id = request_data.get("gptId", '')
        if gpt_id.strip() == '':
            return jsonify({"message": "Missing required parameters", "success": False}), 400

        cosmosContainer.delete_item(item=gpt_id, partition_key=gpt_id)

        return jsonify({"message": "Deleted successfully", "success": True}), 200
    except Exception as e:
        return jsonify({"message": str(e), "success": False}), 500


@bp.route("/apps/custom-gpt/<id>")
async def cover_image(id: str):
    try:
        blob_client = blob_container_client.get_blob_client(id)
    except ResourceNotFoundError:
        return jsonify({"message": "Not found", "success": False}), 404

    sas_url = generate_sas_url(blob_client)

    return jsonify({'message': 'CustomGPT created', 'coverUrl': sas_url, "success": True}), 200


@bp.route("/apps/custom-gpt/sas/<file_name>", methods=["GET"])
def get_sas(file_name: str):
    print('file_name: ', file_name)
    try:
        blob_client = blob_container_client.get_blob_client(file_name)
    except ResourceNotFoundError:
        return jsonify({"message": "Not found", "success": False}), 404

    sas_url = generate_sas_url(blob_client)

    return jsonify({'message': 'Sas created', 'sas': sas_url, "success": True}), 200

# @bp.route("/apps/custom-gpt/<id>")
# async def cover_image(id: str):
#     try:
#         blob = await blob_container_client.get_blob_client(id).download_blob()
#     except ResourceNotFoundError:
#         abort(404)
#     if not blob.properties or not blob.properties.has_key("content_settings"):
#         abort(404)
#     mime_type = blob.properties["content_settings"]["content_type"]
#     if mime_type == "application/octet-stream":
#         mime_type = mimetypes.guess_type(id)[0] or "application/octet-stream"
#     blob_file = io.BytesIO()
#     await blob.readinto(blob_file)
#     blob_file.seek(0)
#     return await send_file(blob_file, mimetype=mime_type, as_attachment=False, attachment_filename=id)
