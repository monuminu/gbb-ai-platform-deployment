import io
import os
import jwt
import json
import logging
import mimetypes
import dataclasses
from pathlib import Path
from typing import AsyncGenerator, cast

from azure.core.exceptions import ResourceNotFoundError
from azure.identity.aio import DefaultAzureCredential
from azure.monitor.opentelemetry import configure_azure_monitor
from azure.storage.blob.aio import BlobServiceClient
from openai import APIError
from opentelemetry.instrumentation.aiohttp_client import AioHttpClientInstrumentor
from opentelemetry.instrumentation.asgi import OpenTelemetryMiddleware
from opentelemetry.instrumentation.httpx import HTTPXClientInstrumentor
from quart import (
    Quart,
    abort,
    jsonify,
    request,
    send_file,
    Blueprint,
    current_app,
    make_response,
    send_from_directory,
)
from quart_cors import cors
from routes.temp import temp_route
from routes import post_route, tool_route, knowledge_route, applications_route, documentation_route

from approaches.approach import Approach
from approaches.chatwithexternalaoai import ChatWithExternalAoai
from approaches.chatreadretrieveread import ChatReadRetrieveReadApproach

from core.authentication import AuthenticationHelper

CONFIG_AOAI_APPROACH = "aoai_approach"
CONFIG_CHAT_APPROACH = "chat_approach"
CONFIG_BLOB_CONTAINER_CLIENT = "blob_container_client"
CONFIG_AUTH_CLIENT = "auth_client"
# ERROR_MESSAGE = """The app encountered an error processing your request.
# If you are an administrator of the app, view the full error in the logs. See aka.ms/appservice-logs for more information.
# Error type: {error_type}
# """
ERROR_MESSAGE = """The app encountered an error processing your request.
If you are an administrator of the app, view the full error in the logs. See aka.ms/appservice-logs for more information.\n
{error_message} \n
"""
ERROR_MESSAGE_FILTER = """Your message contains content that was flagged by the OpenAI content filter."""


bp = Blueprint("routes", __name__, static_folder="static")

# Fix Windows registry issue with mimetypes
mimetypes.add_type("application/javascript", ".js")
mimetypes.add_type("text/css", ".css")


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


# Function executed before processing a request
@bp.before_request
# @temp_route.bp.before_request
@post_route.bp.before_request
@tool_route.bp.before_request
@knowledge_route.bp.before_request
@applications_route.bp.before_request
@documentation_route.bp.before_request
def authenticate():
    if request.method == 'OPTIONS':
        return {}, 200

    auth_helper = current_app.config[CONFIG_AUTH_CLIENT]
    if not auth_helper.require_access_control:
        return None  # No authentication required

    # no auth endpoints
    allowed_endpoints = ['/test', '/redirect', '/get_token',
                         '/assets/', '/content/', '/auth_setup']

    # Check if authentication is needed
    if request.endpoint and any(request.path.startswith(endpoint) for endpoint in allowed_endpoints):
        return None  # Allow login requests without authentication logic
    else:
        # Authentication logic here
        auth = request.headers.get("Authorization")

        if auth is None or len(auth) == 0:
            return jsonify({'error': 'No Authentication, Please login first.'}), 401

        if auth:
            parts = auth.split()

            if parts[0].lower() != "bearer":
                return jsonify({'error': 'Authorization header must start with Bearer'}), 401
            elif len(parts) == 1:
                return jsonify({'error': 'Token not found'}), 401
            elif len(parts) > 2:
                return jsonify({'error': 'Authorization header must be Bearer token'}), 401

            auth_token = parts[1]

            validResultFlag = auth_helper.validate_access_token_payload(
                auth_token)

            if not validResultFlag:
                return jsonify({'error': 'Authentication failed'}), 403


@bp.route("/get_token/<client_id>", methods=["GET"])
async def get_token(client_id: str, scope: str = None):
    auth_helper = current_app.config[CONFIG_AUTH_CLIENT]

    user_token = request.headers.get('Authorization').replace("Bearer ", "", 1)

    payload = jwt.decode(user_token, options={"verify_signature": False})

    # check if the token is valid
    if payload.get("appid") != client_id or payload.get("tid") != auth_helper.tenant_id:
        return jsonify({"error": "Invalid token"}), 401
    else:
        # get the client secret
        client_secret = auth_helper.client_app_secret
        if scope is None:
            scope = f"api://{auth_helper.server_app_id}/.default"

        # get the access token
        return auth_helper.get_token(client_id, client_secret, scope)


@bp.route("/test")
async def test():
    return "Hello, Azure"


@bp.route("/redirect")
async def redirect():
    return ""


@bp.route("/assets/<path:path>")
async def assets(path):
    return await send_from_directory(Path(__file__).resolve().parent / "static" / "assets", path)


# Serve content files from blob storage from within the app to keep the example self-contained.
# *** NOTE *** this assumes that the content files are public, or at least that all users of the app
# can access all the files. This is also slow and memory hungry.
@bp.route("/content/<path>")
async def content_file(path: str):
    if path.find("#page=") > 0:
        path_parts = path.rsplit("#page=", 1)
        path = path_parts[0]
    logging.info("Opening file %s at page %s", path)
    blob_container_client = current_app.config[CONFIG_BLOB_CONTAINER_CLIENT]
    try:
        blob = await blob_container_client.get_blob_client(path).download_blob()
    except ResourceNotFoundError:
        logging.exception("Path not found: %s", path)
        abort(404)
    if not blob.properties or not blob.properties.has_key("content_settings"):
        abort(404)
    mime_type = blob.properties["content_settings"]["content_type"]
    if mime_type == "application/octet-stream":
        mime_type = mimetypes.guess_type(path)[0] or "application/octet-stream"
    blob_file = io.BytesIO()
    await blob.readinto(blob_file)
    blob_file.seek(0)
    return await send_file(blob_file, mimetype=mime_type, as_attachment=False, attachment_filename=path)


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


@bp.route("/aoai", methods=["POST"])
async def aoai():
    if not request.is_json:
        return jsonify({"error": "request must be json"}), 415
    request_json = await request.get_json()
    context = request_json.get("context", {})

    try:
        # auth_helper = current_app.config[CONFIG_AUTH_CLIENT]
        # context["auth_claims"] = await auth_helper.get_auth_claims_if_enabled(request.headers)
        approach: Approach = cast(
            Approach, current_app.config[CONFIG_AOAI_APPROACH])

        aoai_config = request_json.get("aoai_config", {})
        result = await approach.run(
            request_json["messages"],
            stream=request_json.get("stream", False),
            context=context,
            session_state=request_json.get("session_state"),
            aoai_config=aoai_config,
            ai_search_config={},
            embedding_config={}
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


@bp.route("/chat", methods=["POST"])
async def chat():
    if not request.is_json:
        return jsonify({"error": "request must be json"}), 415
    request_json = await request.get_json()
    context = request_json.get("context", {})
    try:
        # auth_helper = current_app.config[CONFIG_AUTH_CLIENT]
        # context["auth_claims"] = await auth_helper.get_auth_claims_if_enabled(request.headers)
        approach: Approach = cast(
            Approach, current_app.config[CONFIG_CHAT_APPROACH])

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


# Send MSAL.js settings to the client UI
@bp.route("/auth_setup", methods=["GET"])
def auth_setup():
    auth_helper = current_app.config[CONFIG_AUTH_CLIENT]
    return jsonify(auth_helper.get_auth_setup_for_client())


@bp.before_app_serving
async def setup_clients():
    # Replace these with your own values, either in environment variables or directly here
    AZURE_STORAGE_ACCOUNT = os.environ["AZURE_STORAGE_ACCOUNT"]
    AZURE_STORAGE_CONTAINER = os.environ["AZURE_STORAGE_CONTAINER"]

    AZURE_TENANT_ID = os.getenv("AZURE_TENANT_ID")
    AZURE_USE_AUTHENTICATION = os.getenv(
        "AZURE_USE_AUTHENTICATION", "").lower() == "true"
    AZURE_ENFORCE_ACCESS_CONTROL = os.getenv(
        "AZURE_ENFORCE_ACCESS_CONTROL", "").lower() == "true"
    AZURE_SERVER_APP_ID = os.getenv("AZURE_SERVER_APP_ID")
    AZURE_CLIENT_APP_SECRET = os.getenv("AZURE_CLIENT_APP_SECRET")
    AZURE_CLIENT_APP_ID = os.getenv("AZURE_CLIENT_APP_ID")

    KB_FIELDS_CONTENT = os.getenv("KB_FIELDS_CONTENT", "content")
    KB_FIELDS_SOURCEPAGE = os.getenv("KB_FIELDS_SOURCEPAGE", "sourcepage")

    AZURE_SEARCH_QUERY_LANGUAGE = os.getenv(
        "AZURE_SEARCH_QUERY_LANGUAGE", "en-us")
    AZURE_SEARCH_QUERY_SPELLER = os.getenv(
        "AZURE_SEARCH_QUERY_SPELLER", "lexicon")

    # Use the current user identity to authenticate with Azure OpenAI, AI Search and Blob Storage (no secrets needed,
    # just use 'az login' locally, and managed identity when deployed on Azure). If you need to use keys, use separate AzureKeyCredential instances with the
    # keys for each service
    # If you encounter a blocking error during a DefaultAzureCredential resolution, you can exclude the problematic credential by using a parameter (ex. exclude_shared_token_cache_credential=True)
    azure_credential = DefaultAzureCredential(
        exclude_shared_token_cache_credential=True)

    # Set up clients for AI Search and Storage
    blob_client = BlobServiceClient(
        account_url=f"https://{AZURE_STORAGE_ACCOUNT}.blob.core.windows.net", credential=azure_credential
    )
    blob_container_client = blob_client.get_container_client(
        AZURE_STORAGE_CONTAINER)

    # Set up authentication helper
    auth_helper = AuthenticationHelper(
        use_authentication=AZURE_USE_AUTHENTICATION,
        server_app_id=AZURE_SERVER_APP_ID,
        client_app_secret=AZURE_CLIENT_APP_SECRET,
        client_app_id=AZURE_CLIENT_APP_ID,
        tenant_id=AZURE_TENANT_ID,
        require_access_control=AZURE_ENFORCE_ACCESS_CONTROL,
    )

    current_app.config[CONFIG_BLOB_CONTAINER_CLIENT] = blob_container_client
    current_app.config[CONFIG_AUTH_CLIENT] = auth_helper

    # Various approaches to integrate GPT and external knowledge, most applications will use a single one of these patterns
    # or some derivative, here we include several for exploration purposes
    current_app.config[CONFIG_CHAT_APPROACH] = ChatReadRetrieveReadApproach(
        auth_helper=auth_helper,
        sourcepage_field=KB_FIELDS_SOURCEPAGE,
        content_field=KB_FIELDS_CONTENT,
        query_language=AZURE_SEARCH_QUERY_LANGUAGE,
        query_speller=AZURE_SEARCH_QUERY_SPELLER,
    )

    current_app.config[CONFIG_AOAI_APPROACH] = ChatWithExternalAoai(
        auth_helper=auth_helper,
        sourcepage_field=KB_FIELDS_SOURCEPAGE,
        content_field=KB_FIELDS_CONTENT,
        query_language=AZURE_SEARCH_QUERY_LANGUAGE,
        query_speller=AZURE_SEARCH_QUERY_SPELLER,
    )


@bp.after_app_serving
async def close_clients():
    await current_app.config[CONFIG_BLOB_CONTAINER_CLIENT].close()


def create_app():
    app = Quart(__name__)
    app.register_blueprint(bp)
    app.register_blueprint(post_route.bp)
    app.register_blueprint(temp_route.bp)
    app.register_blueprint(tool_route.bp)
    app.register_blueprint(knowledge_route.bp)
    app.register_blueprint(applications_route.bp)
    app.register_blueprint(documentation_route.bp)

    if os.getenv("APPLICATIONINSIGHTS_CONNECTION_STRING"):
        configure_azure_monitor()
        # This tracks HTTP requests made by aiohttp:
        AioHttpClientInstrumentor().instrument()
        # This tracks HTTP requests made by httpx/openai:
        HTTPXClientInstrumentor().instrument()
        # This middleware tracks app route requests:
        app.asgi_app = OpenTelemetryMiddleware(
            app.asgi_app)  # type: ignore[method-assign]

    # Level should be one of https://docs.python.org/3/library/logging.html#logging-levels
    default_level = "INFO"  # In development, log more verbosely

    if os.getenv("WEBSITE_HOSTNAME"):  # In production, don't log as heavily
        default_level = "WARNING"

    logging.basicConfig(level=os.getenv("APP_LOG_LEVEL", default_level))

    app.config['MAX_CONTENT_LENGTH'] = 100 * 1024 * 1024

    cors(app, allow_origin='*', allow_methods=["GET", "POST"])

    if allowed_origin := os.getenv("ALLOWED_ORIGIN"):
        app.logger.info("CORS enabled for %s", allowed_origin)

        cors(app, allow_origin=allowed_origin,
             allow_methods=["GET", "POST"])

    return app
