import os

from azure.cosmos import CosmosClient

from quart import (Blueprint,  jsonify)


bp = Blueprint("documentation_route", __name__)

client = CosmosClient(
    os.environ["AZURE_COSMOS_ENDPOINT"], os.environ["AZURE_COSMOS_KEY"])

cosmosDB = client.get_database_client(os.environ["AZURE_COSMOS_DB_PREFIX"])
cosmosFaqContainer = cosmosDB.get_container_client("DocumentationFaqs")
cosmosContentContainer = cosmosDB.get_container_client("DocumentationContents")


@bp.route("/documentation/faqs", methods=["GET"])
def list_faqs():
    item_list = list(cosmosFaqContainer.read_all_items(max_item_count=10))
    return jsonify(item_list), 200


@bp.route("/documentation/contents/<id>", methods=["GET"])
def get_contents(id: str):
    try:
        item = cosmosContentContainer.read_item(item=id, partition_key=id)
        return jsonify(item), 200
    except Exception as e:
        return jsonify({"message": str(e), "success": False}), 200
