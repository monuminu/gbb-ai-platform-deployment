import azure.functions as func
import io
import os
import json
import uuid
import logging
import mimetypes
from openai import AzureOpenAI
from azure.cosmos import CosmosClient
from azure.search.documents import SearchClient
from azure.storage.blob import BlobServiceClient
from azure.core.credentials import AzureKeyCredential
from langchain.text_splitter import MarkdownHeaderTextSplitter
from langchain.text_splitter import RecursiveCharacterTextSplitter
from azure.ai.documentintelligence import DocumentIntelligenceClient
from azure.ai.documentintelligence.models import ContentFormat, AnalyzeResult
import azure.ai.documentintelligence


app = func.FunctionApp()


@app.queue_trigger(arg_name="azqueue", queue_name="ragdataprocessing",
                   connection="AzureWebJobsStorage")
def indexing_trigger(azqueue: func.QueueMessage):
    msg = azqueue.get_body().decode('utf-8')
    payload = json.loads(msg)
    logging.info(azure.ai.documentintelligence.__version__)
    try:
        update_status_in_cosmosdb(
            payload['kbId'], payload['id'], "Indexing...")
        splits = generate_splits(
            payload['containerName'], payload['filePrefix'])
        documents = generate_documents(splits, payload['filePrefix'])
        upload_documents(documents, payload['indexName'])
        update_status_in_cosmosdb(
            payload['kbId'], payload['id'], "Indexed", len(documents))

        print(f'Generated {len(documents)} documents')
    except Exception as e:
        logging.error(f'Error: {e}')
        save_error_to_cosmosdb(payload['kbId'], payload['id'], f'{e}')

    logging.info('Python Queue trigger processed a message: %s',
                 azqueue.get_body().decode('utf-8'))


def generate_splits(containerName: str, file_prefix: str):
    blob_client = BlobServiceClient.from_connection_string(
        os.getenv("AzureWebJobsStorage"))
    blob_container_client = blob_client.get_container_client(containerName)
    blob = blob_container_client.get_blob_client(file_prefix).download_blob()
    mime_type = blob.properties["content_settings"]["content_type"]

    if mime_type == "application/octet-stream":
        mime_type = mimetypes.guess_type(
            file_prefix)[0] or "application/octet-stream"

    blob_file = io.BytesIO()
    blob.readinto(blob_file)
    blob_file.seek(0)
    content = blob_file.read()
    content_str = ''

    file_extension = file_prefix.split('.')[-1].lower()
    if file_extension == "pdf":
        content_str = parseFile(content, "application/pdf")
    elif file_extension == "docx" or file_extension == "doc":
        content_str = parseFile(
            content, "application/vnd.openxmlformats-officedocument.wordprocessingml.document")
    elif file_extension == "pptx" or file_extension == "ppt":
        content_str = parseFile(
            content, "application/vnd.openxmlformats-officedocument.presentationml.presentation")
    elif file_extension == "xlsx" or file_extension == "xls":
        content_str = parseFile(
            content, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    elif file_extension == "png" or file_extension == "jpg" or file_extension == "jpeg":
        content_str = parseFile(
            content, f"image/{file_extension}")
    elif file_extension == "html" or file_extension == "htm":
        content_str = parseFile(
            content, f"text/{file_extension}")
    else:
        content_str = content.decode('utf-8', errors='ignore')

    headers_to_split_on = [
        ("#", "Header 1"),
        ("##", "Header 2"),
        ("###", "Header 3"),
    ]
    md_splitter = MarkdownHeaderTextSplitter(
        headers_to_split_on=headers_to_split_on, strip_headers=False)

    md_header_splits = md_splitter.split_text(content_str)

    chunk_size = 512
    chunk_overlap = 50
    text_splitter = RecursiveCharacterTextSplitter.from_tiktoken_encoder(
        model_name="gpt-4",
        chunk_size=chunk_size, 
        chunk_overlap=chunk_overlap
    )
    
    splits = text_splitter.split_documents(md_header_splits)

    return splits


def parseFile(content: bytes, mime_type: str):
    logging.info(mime_type)
    doc_intelligence_endpoint = os.getenv(
        "AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT")
    doc_intelligence_key = os.getenv("AZURE_DOCUMENT_INTELLIGENCE_KEY")

    document_intelligence_client = DocumentIntelligenceClient(
        endpoint=doc_intelligence_endpoint, credential=AzureKeyCredential(doc_intelligence_key))

    poller = document_intelligence_client.begin_analyze_document(
        "prebuilt-layout",
        analyze_request=content,
        content_type=mime_type,
        output_content_format=ContentFormat.MARKDOWN)

    result: AnalyzeResult = poller.result()
    return result.content


def generate_documents(splits: list, file_prefix: str):
    if splits == None or len(splits) == 0:
        return

    model = os.getenv("AZURE_OPENAI_EMBEDDING_DEPLOYMENT")
    client = AzureOpenAI(
        api_key=os.getenv("AZURE_OPENAI_API_KEY"),
        api_version="2023-05-15",
        azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT")
    )

    batch_inputs = [splits[i].page_content for i in range(len(splits))]

    BATCH_SIZE = 1000  # you can submit up to 2048 embedding inputs per request

    embeddings = []
    for batch_start in range(0, len(batch_inputs), BATCH_SIZE):
        batch_end = batch_start + BATCH_SIZE
        batch = batch_inputs[batch_start: batch_end]
        response = client.embeddings.create(input=batch, model=model)
        for i, be in enumerate(response.data):
            # double check embeddings are in same order as input
            assert i == be.index
        batch_embeddings = [e.embedding for e in response.data]
        embeddings.extend(batch_embeddings)

    documents = []
    counter = 0
    for item in splits:
        file_name = file_prefix.split('.')[0]
        documents.append({
            'id': str(uuid.uuid4()),
            'title':  item.metadata.get('Header 1', file_name),
            'content': item.page_content,
            'category': item.metadata.get('Header 2', file_name),
            'source': file_prefix,
            'contentVector': embeddings[counter]
        })
        counter += 1

    logging.info(f'{len(documents)} documents generated')
    return documents


def upload_documents(documents: list, indexName: str):
    if documents == None or len(documents) == 0:
        return

    endpoint = os.getenv("AZURE_SEARCH_ENDPOINT")
    admin_key = os.getenv("AZURE_SEARCH_ADMIN_KEY")
    credential = AzureKeyCredential(admin_key)
    client = SearchClient(endpoint=endpoint,
                          index_name=indexName,
                          credential=credential,)
    client.upload_documents(documents)
    logging.info(f"Uploaded {len(documents)} documents in total")


def update_status_in_cosmosdb(kbId: str, id: str, status: str, chunks: int = None):
    endpoint = os.getenv("AZURE_COSMOS_ENDPOINT")
    key = os.getenv("AZURE_COSMOS_KEY")
    client = CosmosClient(endpoint, key)
    database_name = os.getenv("AZURE_COSMOS_DATABASE")
    database = client.get_database_client(database_name)
    container_name = f'Kb-{kbId}'
    container = database.get_container_client(container_name)

    read_item = container.read_item(item=id, partition_key=id)
    read_item['status'] = status
    if chunks != None:
        read_item['chunks'] = chunks
    container.replace_item(item=read_item, body=read_item)


def save_error_to_cosmosdb(kbId: str, id: str, error: str = None):
    endpoint = os.getenv("AZURE_COSMOS_ENDPOINT")
    key = os.getenv("AZURE_COSMOS_KEY")
    client = CosmosClient(endpoint, key)
    database_name = os.getenv("AZURE_COSMOS_DATABASE")
    database = client.get_database_client(database_name)
    container_name = f'Kb-{kbId}'
    container = database.get_container_client(container_name)

    read_item = container.read_item(item=id, partition_key=id)
    read_item['status'] = "Failed"
    if error != None:
        read_item['error'] = error
    container.replace_item(item=read_item, body=read_item)
