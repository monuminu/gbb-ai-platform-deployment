import os

from azure.cosmos import CosmosClient

from quart import (Blueprint,  jsonify)


bp = Blueprint("post_route", __name__)

client = CosmosClient(
    os.environ["AZURE_COSMOS_ENDPOINT"], os.environ["AZURE_COSMOS_KEY"])

cosmosDB = client.get_database_client(os.environ["AZURE_COSMOS_DB_PREFIX"])
cosmosContainer = cosmosDB.get_container_client("Posts")


@bp.route("/post/list", methods=["GET"])
def list_posts():
    item_list = list(cosmosContainer.read_all_items(max_item_count=10))
    return jsonify(item_list), 200


@bp.route("/post/details/<id>", methods=["GET"])
def get_post_details(id: str):
    try:
        item = cosmosContainer.read_item(item=id, partition_key=id)
        return jsonify(item), 200
    except Exception as e:
        return jsonify({"message": str(e), "success": False}), 200
