import os
import json
import logging
import requests
from datetime import datetime
from azure.cosmos import CosmosClient
import azure.cosmos.exceptions as exceptions
from azure.cosmos.partition_key import PartitionKey
from azure.core.credentials import AzureKeyCredential
from azure.search.documents.indexes.aio import SearchIndexClient


cosmos_client = CosmosClient(
    os.environ["AZURE_COSMOS_ENDPOINT"], os.environ["AZURE_COSMOS_KEY"])
COSMOS_DB_ID = f'{ os.environ["AZURE_COSMOS_DB_PREFIX"]}KnowledgeBases'

cosmosDB = cosmos_client.get_database_client(COSMOS_DB_ID)
kbCatalogContainer = cosmosDB.get_container_client("Catalog")

AZURE_SEARCH_SERVICE = os.environ["AZURE_SEARCH_SERVICE"]
AZURE_SEARCH_API_KEY = os.environ["AZURE_SEARCH_KEY"]
AZURE_SEARCH_ENDPOINT = f'https://{AZURE_SEARCH_SERVICE}.search.windows.net'
AZURE_SEARCH_API_VERSION = "2023-11-01"

search_index_client = SearchIndexClient(
    endpoint=AZURE_SEARCH_ENDPOINT,
    credential=AzureKeyCredential(AZURE_SEARCH_API_KEY),
)


def form_kb_item(id: str, fileName: str, fileSize: int, status: str = "Uploaded", tags=[], shared=[]):
    try:
        date = datetime.now()
        date_string = date.strftime("%Y-%m-%d %H:%M:%S")
        data = {
            "id": id,
            "name": fileName,
            "storage": {
                "account": os.environ["AZURE_STORAGE_ACCOUNT"],
                "container": os.environ["AZURE_STORAGE_CONTAINER"]
            },
            "url": "",
            "createdAt": date_string,
            "modifiedAt": date_string,
            "type": fileName.split(".")[-1],
            "status": status,
            "size": fileSize,
            "chunks": 0,
            "tags": tags,
            "shared": shared,
            "isFavorited": False
        }

        return data
    except Exception as e:
        return {
            "success": False,
            "message": str(e)
        }


def update_status_in_cosmosdb(kbId: str, id: str, status: str):
    container_name = f'Kb-{kbId}'
    container = cosmosDB.get_container_client(container_name)

    read_item = container.read_item(item=id, partition_key=id)
    read_item['status'] = status
    container.replace_item(item=read_item, body=read_item)


def create_or_update_index(index_name):
    # load index definition and parse into Fields object
    script_dir = os.path.dirname(os.path.realpath(__file__))
    file_path = os.path.join(script_dir, "hybrid-index.json")
    with open(file_path, 'r') as f:
        index_schema = json.load(f)

    index_schema['name'] = index_name
    url = f'{AZURE_SEARCH_ENDPOINT}/indexes/{index_name}?api-version={AZURE_SEARCH_API_VERSION}'
    headers = {'Content-Type': 'application/json',
               'api-key': AZURE_SEARCH_API_KEY}
    result = requests.put(url, headers=headers, json=index_schema)
    if result.status_code <= 204:
        print(f'Created (or updated) index "{index_name}" successfully')
        return True
    else:
        print('Failed to create (or update) index')
        print(result.text)
        return False


def create_cosmosdb_container(database_id, container_id):
    try:
        database = cosmos_client.create_database_if_not_exists(
            id=database_id)
        container = database.create_container(
            id=container_id, partition_key=PartitionKey(path='/id'))
        print(f'Created container: {container}')
    except Exception as e:
        logging.error(e.args)


def gen_date_string():
    date = datetime.now()

    # Convert the date to a string in the desired format
    date_string = date.strftime("%Y-%m-%d %H:%M:%S")
    return date_string


def update_kb_catlog(kb_name: str, index_name: str, container_id: str, tags=[], shared=[]):
    try:
        date_str = gen_date_string()

        data = {
            "id": container_id,
            "name": kb_name,
            "tags": tags,
            "index": index_name,
            "createdAt": date_str,
            "modifiedAt": date_str,
            "type": "KB",
            "size": 0,
            "status": "published",
            "isFavorited": False,
            "shared": shared
        }
        kbCatalogContainer.upsert_item(body=data)
    except Exception as e:
        logging.error(e.args)


async def create_kb(kb_id: str, kb_name: str, index_name: str, tags=[], shared=[]):
    try:
        index_name_existed = False
        async for index in search_index_client.list_indexes():
            if index_name == index.name:
                index_name_existed = True
                break

        if not index_name_existed:
            create_or_update_index(index_name)
            create_cosmosdb_container(COSMOS_DB_ID, f'Kb-{kb_id}')
            update_kb_catlog(kb_name, index_name, kb_id, tags, shared)
            return ({"message": f"The index '{index_name}' created successfully.", "success": True})
        else:
            return ({"message": f"The index '{index_name}' is already in use.", "success": False})

    except Exception as e:
        logging.error(e.args)
        return ({"message": "Creation failed", "success": False})


def del_cosmosdb_container(container_id):
    try:
        cosmosDB.delete_container(container_id)
    except exceptions.CosmosResourceNotFoundError:
        print('A container with id \'{0}\' does not exist'.format(id))


def del_from_kb_catlog(doc_id: str):
    try:
        kbCatalogContainer.delete_item(
            item=doc_id, partition_key=doc_id)
    except Exception as e:
        logging.error(e.args)


async def delete_knowledge(kb_id: str, index_name: str):
    try:
        if index_name.strip() != "":
            await search_index_client.delete_index(index_name)

        del_cosmosdb_container(f'Kb-{kb_id}')

        del_from_kb_catlog(kb_id)

        return ({"message": f"Deleted successfully", "success": True})
    except Exception as ex:
        print(ex)
        return ({"message": "Failed to delete", "success": False})
