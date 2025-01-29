import os
import json
import uuid
import httpx
import logging
import requests
import dataclasses
from openai import APIError
from typing import AsyncGenerator
from datetime import datetime, timedelta

from quart import (
    jsonify,
    request,
    Blueprint,
    make_response,
)

from approaches.approach import Approach
from routes.temp.manufacturingapproach import ManufacturingApproach

from azure.storage.blob.aio import BlobServiceClient
from azure.core.exceptions import ResourceNotFoundError
from azure.storage.blob import BlobSasPermissions, generate_blob_sas

ERROR_MESSAGE = """The app encountered an error processing your request.
If you are an administrator of the app, view the full error in the logs. See aka.ms/appservice-logs for more information.\n
{error_message} \n
"""
ERROR_MESSAGE_FILTER = """Your message contains content that was flagged by the OpenAI content filter."""


bp = Blueprint("temp_route", __name__)


class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if dataclasses.is_dataclass(o):
            return dataclasses.asdict(o)
        return super().default(o)


async def format_as_ndjson(r: AsyncGenerator[dict, None]) -> AsyncGenerator[str, None]:
    try:
        async for event in r:
            yield json.dumps(event, ensure_ascii=False, cls=JSONEncoder) + "\n"
    except Exception as error:
        logging.exception(
            "Exception while generating response stream: %s", error)
        yield json.dumps(error_dict(error))


def error_dict(error: Exception) -> dict:
    if isinstance(error, APIError) and error.code == "content_filter":
        return {"error": ERROR_MESSAGE_FILTER}

    error_message = error.args[0] if error.args else str(error)
    return {"error": ERROR_MESSAGE.format(error_message=error_message)}


def error_response(error: Exception, route: str, status_code: int = 500):
    logging.exception("Exception in %s: %s", route, error)
    if isinstance(error, APIError) and error.code == "content_filter":
        status_code = 400
    return jsonify(error_dict(error)), status_code


# ----------------------------------------------------------


@bp.route("/perplexity", methods=["POST"])
async def perplexity():
    try:
        if not request.is_json:
            return jsonify({"error": "request must be json"}), 415

        request_json = await request.get_json()

        url = request_json['endpoint']
        headers = {
            'Accept': 'text/event-stream',
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {request_json["key"]}',
        }
        data = {
            'question': request_json['query'],
            'chat_history': [],
        }
        
        if 'customer_id' in request_json:
            data['customer_id'] = request_json['customer_id']

        async def fetch_data(url, headers, data):
            async with httpx.AsyncClient(timeout=180.0) as client:
                async with client.stream('POST', url, headers=headers, json=data) as response:
                    async for chunk in response.aiter_text():
                        yield chunk

        async def generate():
            try:
                async for chunk in fetch_data(url, headers, data):
                    yield chunk
            except Exception as e:
                yield f"Error: {str(e)}\n"
            finally:
                # Ensure the final 0-sized chunk is sent
                yield ''

        response = await make_response(format_as_ndjson(generate()))
        response.headers['Content-Type'] = 'text/event-stream'
        return response
    except ResourceNotFoundError:
        return jsonify({"message": "Not found", "success": False}), 404
    except httpx.ReadTimeout:
        return jsonify({"message": "Request timed out", "success": False}), 408


@bp.route("/perplexity/start", methods=["POST"])
async def perplexity_start():
    try:
        if not request.is_json:
            return jsonify({"error": "request must be json"}), 415

        request_json = await request.get_json()

        url = request_json['endpoint']
        headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {request_json["key"]}',
        }
        payload = {
            'question': "hello",
        }

        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(url, headers=headers, data=json.dumps(payload))
            return response.text
    except ResourceNotFoundError:
        return jsonify({"message": "Not found", "success": False}), 404


# ----------------------------------------------------------


@bp.route("/translate/text", methods=["POST"])
async def translate_text():
    try:
        if not request.is_json:
            return jsonify({"error": "request must be json"}), 415

        request_json = await request.get_json()

        key = request_json['key']
        endpoint = request_json['endpoint']

        location = "eastus"

        path = '/translate'
        constructed_url = endpoint + path

        params = {
            "api-version": "3.0",
            "from": request_json['sourceLang'],
            "to": [request_json['targetLang']]
        }

        headers = {
            'Ocp-Apim-Subscription-Key': key,
            # location required if you're using a multi-service or regional (not global) resource.
            'Ocp-Apim-Subscription-Region': location,
            'Content-type': 'application/json',
            'X-ClientTraceId': str(uuid.uuid4())
        }

        body = [{
            'text': request_json['sourceText']
        }]

        result = requests.post(constructed_url, params=params,
                               headers=headers, json=body)
        response = result.json()

        return json.dumps(response, sort_keys=True,  ensure_ascii=False, indent=4, separators=(',', ': '))
    except ResourceNotFoundError:
        return jsonify({"message": "Not found", "success": False}), 404


@bp.route("/translate/document", methods=["POST"])
async def translate_document():
    try:
        AZURE_STORAGE_ACCOUNT = 'xleazureailang'
        AZURE_STORAGE_CONTAINER = 'doc'
        blob_client = BlobServiceClient.from_connection_string(
            os.environ["AZURE_TRANSLATION_STORAGE_CONNECTION_STRING"])
        blob_container_client = blob_client.get_container_client(
            AZURE_STORAGE_CONTAINER)

        files = await request.files
        form_data = await request.form
        file = files['file']
        key = form_data.get('key')
        endpoint = form_data.get('endpoint')
        targetLang = form_data.get('targetLang')
        targetFileName = form_data.get('targetFileName')

        await blob_container_client.upload_blob(name=file.filename, data=file, overwrite=True)

        source_url = f"https://{AZURE_STORAGE_ACCOUNT}.blob.core.windows.net/{AZURE_STORAGE_CONTAINER}/{file.filename}"
        target_url = f"https://{AZURE_STORAGE_ACCOUNT}.blob.core.windows.net/{AZURE_STORAGE_CONTAINER}/{targetFileName}"

        headers = {
            'Ocp-Apim-Subscription-Key': key,
            'Content-Type': 'application/json'
        }

        body = {
            "inputs": [
                {
                    "name": targetFileName,
                    "source": {
                        "sourceUrl": source_url,
                    },
                    "sourceUrl": source_url,
                    "targets": [
                        {
                            "targetUrl": target_url,
                            "language": targetLang
                        }
                    ],
                    "storageType": "File",
                }
            ]
        }

        # Send the translation request
        translation_response = requests.post(
            f"{endpoint}/translator/text/batch/v1.0/batches", headers=headers, json=body)

        if translation_response.status_code == 202:
            return jsonify({"message": "Job submitted", "success": True}), 200
        else:
            return jsonify({"message": "Not found", "success": False}), 404
    except ResourceNotFoundError:
        return jsonify({"message": "Not found", "success": False}), 404


@bp.route("/translate/status", methods=["POST"])
async def translate_status():
    try:
        if not request.is_json:
            return jsonify({"error": "request must be json"}), 415

        request_json = await request.get_json()

        file_name = request_json['fileName']

        AZURE_STORAGE_CONTAINER = 'doc'
        AZURE_STORAGE_ACCOUNT_NAME = 'xleazureailang'
        blob_service_client = BlobServiceClient.from_connection_string(
            os.environ["AZURE_TRANSLATION_STORAGE_CONNECTION_STRING"])

        blob_client = blob_service_client.get_blob_client(
            container=AZURE_STORAGE_CONTAINER, blob=file_name)

        # Check if the blob exists
        blob_exists = await blob_client.exists()

        blob_url_with_sas = ''
        if blob_exists:
            # Generate SAS token for the blob
            sas_token = generate_blob_sas(account_name=AZURE_STORAGE_ACCOUNT_NAME,
                                          container_name=AZURE_STORAGE_CONTAINER,
                                          blob_name=file_name,
                                          account_key=blob_client.credential.account_key,
                                          permission=BlobSasPermissions(
                                              read=True),
                                          expiry=datetime.utcnow() + timedelta(hours=1))  # Token valid for 1 hour
            blob_url_with_sas = f"https://{AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net/{AZURE_STORAGE_CONTAINER}/{file_name}?{sas_token}"

        return jsonify({"message": blob_exists, "blobUrl": blob_url_with_sas, "success": True}), 200
    except ResourceNotFoundError:
        return jsonify({"message": "Not found", "success": False}), 404


# ----------------------------------------------------------


@bp.route("/manufacturing_copilot", methods=["POST"])
async def chat():
    if not request.is_json:
        return jsonify({"error": "request must be json"}), 415
    request_json = await request.get_json()
    context = request_json.get("context", {})
    try:
        # auth_helper = current_app.config[CONFIG_AUTH_CLIENT]
        # context["auth_claims"] = await auth_helper.get_auth_claims_if_enabled(request.headers)
        approach: Approach = ManufacturingApproach(
            sourcepage_field="sourcepage",
            content_field="content",
            query_language="en-us",
            query_speller="lexicon",
        )

        aoai_config = request_json.get("aoai_config", {})
        ai_search_config = request_json.get("ai_search_config", {})
        embedding_config = request_json.get("embedding_config", {})
        result = await approach.run(
            request_json["messages"],
            stream=request_json.get("stream", False),
            context=context,
            session_state=request_json.get("session_state"),
            aoai_config=aoai_config,
            ai_search_config=ai_search_config,
            embedding_config=embedding_config
        )
        if isinstance(result, dict):
            return jsonify(result)
        else:
            response = await make_response(format_as_ndjson(result))
            response.timeout = None  # type: ignore
            response.mimetype = "application/json-lines"
            return response
    except Exception as error:
        return error_response(error, "/chat")
