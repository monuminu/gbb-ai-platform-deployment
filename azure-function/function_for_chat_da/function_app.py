import azure.functions as func
import logging

import os
import json
import tempfile
import pandas as pd
from pandasai.llm import AzureOpenAI
from pandasai import SmartDatalake, SmartDataframe

app = func.FunctionApp(http_auth_level=func.AuthLevel.ANONYMOUS)


def create_df(file, config, sheet_name: str = None):

    file_name, ext = os.path.splitext(file.filename)

    if ext.endswith(".csv"):
        df = pd.read_csv(file)
    elif ext.endswith(".parquet"):
        df = pd.read_parquet(file)
    elif ext.endswith(".txt"):
        try:
            df = pd.read_csv(file, sep=",|\t|\|", engine='python')
        except pd.errors.ParserError:
            raise ValueError(f"Unsupported file type: {file_name}")
    elif ext.endswith(".tsv"):
        df = pd.read_csv(file, sep="\t")
    elif ext.endswith(".xlsx"):
        if sheet_name is None:
            xls = pd.ExcelFile(file)
            sheet_name = xls.sheet_names[0]
        logging.info(sheet_name)
        df = pd.read_excel(file, sheet_name=sheet_name)
    else:
        raise ValueError(f"Unsupported file type: {file_name}")

    sdf = SmartDataframe(df, name=file_name, config=config)

    return sdf


def parse_data(query: str, aoai, files):

    tmp_dir = tempfile.gettempdir()
    logging.info(tmp_dir)
    os.chdir(tmp_dir)

    llm = AzureOpenAI(
        api_token=aoai["api_key"],
        azure_endpoint=aoai["azure_endpoint"],
        api_version=aoai["api_version"],
        deployment_name=aoai["deployment"]
    )

    config = {
        "llm": llm,
        "enable_cache": False,
        "save_charts_path": tempfile.gettempdir()
    }

    sdf_list = [create_df(file, config) for file in files]

    if len(sdf_list) == 1:
        sdf = sdf_list[0]
    else:
        sdf = SmartDatalake(sdf_list, config=config)

    response = sdf.chat(query)
    code = sdf.last_code_executed

    if type(response).__name__ == "DataFrame":
        response.reset_index(drop=True, inplace=True)
        response = response.to_dict()

    logging.info(f"Response: {response}")
    res = {
        "query": query,
        "response": response,
        "response_type": type(response).__name__,
        "code": code
    }

    return res


@app.route(route="gpt_da")
def gpt_da(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')

    files = []
    for filename, file in req.files.items():
        logging.info(filename)
        files.append(file)

    if len(files) == 0:
        return func.HttpResponse(
            "No files found",
            status_code=400
        )

    form_data = req.form
    query = form_data.get('query')
    logging.info(query)

    aoai = json.loads(form_data.get('aoai'))

    if query:
        res = parse_data(query, aoai, files)
        return func.HttpResponse(json.dumps(res))
    else:
        return func.HttpResponse(
            "This HTTP triggered function executed successfully. Pass a queryfor a personalized response.",
            status_code=200
        )
