import{u as r}from"./tool-f255544f.js";const o=["Bing search","Customs declaration","Image creator","Video retrieval","Calculator","Get weather","Get stock data","Sales trend"],n=["Searches bing to get up to date information from the web.","Declare goods that are being imported or exported.","Uses Dall-E to draw an image based on user's prompt.","Retives a video from the database based on the given location.","An application that is used to perform mathematical calculations.","Acquire information about the current weather conditions in your area.","The process involves obtaining data related to the stock market",""],i=[["openai==1.3.4","pandas","seaborn","requests","dotenv","azure-search-documents==11.4.0b8"],["json","pandas"],["openai==1.3.4","pandas","dotenv"],["openai==1.3.4","pandas","seaborn","requests","dotenv","azure-search-documents==11.4.0b8"],["openai==1.3.4","pandas","seaborn","requests","dotenv","azure-search-documents==11.4.0b8"],["openai==1.3.4","pandas","seaborn","requests","dotenv","azure-search-documents==11.4.0b8"],["openai==1.3.4","pandas","yfinance"],["openai==1.3.4","pandas","seaborn","requests","dotenv","azure-search-documents==11.4.0b8"]],s=[...Array(20)].map((t,e)=>({id:`person-${e}`,name:`Admin ${e+1}`,email:`admin${e+1}@gbb-ai.com`,avatarUrl:`/assets/avatars/avatar_${e+1}.jpg`,permission:e%2?"view":"edit"})),p=[["Search"],["Design"],["Security"],["Assistant"],["Assistant"],["Stock"],["Sales"],["Fitness"],["Nature"],["Business"]],d=[`import requests

def search_bing(query) -> str:
    bing_search_url = "https://api.bing.microsoft.com/v7.0/search"
    bing_search_subscription_key = os.environ["BING_SEARCH_SUBSCRIPTION_KEY"]
    headers = {"Ocp-Apim-Subscription-Key": bing_search_subscription_key}
    params = {"q": query, "textDecorations": False}
    response = requests.get(bing_search_url, headers=headers, params=params)
    response.raise_for_status()
    search_results = response.json()
    
    output = []
    
    for result in search_results['webPages']['value']:
        output.append({
            'title': result['name'],
            'link': result['url'],
            'snippet': result['snippet']
        })
    
    return json.dumps(output)`,`import json
    
def customs_declaration(item):
    try:
        itemContent = item
        info1 = json.loads(item)
        if 'item' in info1.keys():
            info2 = json.loads(info1['item'])
            if 'Item Information' in info2.keys():
                itemContent = info2['Item Information']
        elif 'Item Information' in info1.keys():
            itemContent = info1['Item Information']
        return json.dumps({
            "item": itemContent,
            "description": "Your item is currently undergoing customs clearance. We appreciate your patience during this process."
        })
    except:
        return json.dumps({
            "item": item,
            "description": "Your item is currently undergoing customs clearance. We appreciate your patience during this process."
        })`,`from openai import AzureOpenAI
  
def draw(prompt) -> str:
    dalle_endpoint = os.environ["AZURE_DALLE_ENDPOINT"]
    dalle_key = os.environ["AZURE_DALLE_KEY"]
    client = AzureOpenAI(
        api_version="2023-12-01-preview",
        azure_endpoint=dalle_endpoint,
        api_key=dalle_key,
    )

    result = client.images.generate(
        model="Dalle3",  # the name of your DALL-E 3 deployment
        prompt=prompt,
        n=1
    )

    return json.dumps({
        'original_prompt': prompt,
        'revised_prompt': result.data[0].revised_prompt,
        'image_url': result.data[0].url
    })`,"","","",`import yfinance as yf
  
def get_stock_data(stock_code, start_date, end_date):
    # Retrieve stock data
    stock_data = yf.download(stock_code, start=start_date, end=end_date)
    stock_data_dict = json.loads(stock_data.to_json(orient='table'))
    stock_data_dict['title'] = f'Stock prices for {stock_code} from {start_date} to {end_date}'

    return json.dumps(stock_data_dict)`,"",""],c=[`{
    "name": "search_bing",
    "description": "Searches bing to get up to date information from the web",
    "parameters": {
        "type": "object",
        "properties": {
            "query": {
                "type": "string",
                "description": "The search query"
            }
        },
        "required": ["query"]
    }
}`,"","","","","","","",""],u=t=>t===0&&s.slice(0,5)||t===1&&s.slice(5,9)||t===2&&s.slice(9,11)||t===3&&s.slice(11,12)||[];o.map((t,e)=>({id:`func_${e+1}`,name:t,url:"",code:d[e],size:0,shared:u(e),description:n[e],dependencies:i[e],meta:c[e],params:[],tags:p[e],createdAt:new Date,modifiedAt:new Date,type:`${t.split(".").pop()}`,status:e%3?"published":"draft",isFavorited:!0,entryFunction:"",envVars:[],response:"",cover:"",apiAuth:null}));const S=["draft","published"],m=["文案大师","HR Helpdesk","Listing Writer","解题小助手","Paint Guru","Insurance product assistant"],l=["提供创意文案生成、编辑和优化工具，帮助用户提高文案质量，增强吸引力。适用于营销、广告、社交媒体等多领域，支持多种语言，简化创意流程，提升内容效果。","HR Helpdesk 是一个定制的人力资源辅助工具，旨在解答员工关于公司福利政策的疑问。它提供快速、准确的答案，涵盖假期、保险、退休等主题，以提高员工满意度并优化HR流程。 ","Listing Writer is your AI-powered assistant for crafting compelling and detailed listings for products, properties, and services. Streamline content creation with optimized, engaging descriptions that attract and convert.","您的AI学习伴侣，帮助您解决数学、物理和编程等各学科的复杂问题，提供清晰、步骤分明的解答。","A GPT specialized in generating and refining images with a mix of professional and friendly tone.","Provide insurance product information"],_=[["query","user_id"],["item"],["customer_id","order_id"],["time_filter","location"],["num1","num2","operator"],["location"],["stock_code","start_date","end_date"],["time"]],f=[["openai==1.3.4","pandas","seaborn","requests","dotenv","azure-search-documents==11.4.0b8"],["json","pandas"],["openai==1.3.4","pandas","dotenv"],["openai==1.3.4","pandas","seaborn","requests","dotenv","azure-search-documents==11.4.0b8"],["openai==1.3.4","pandas","seaborn","requests","dotenv","azure-search-documents==11.4.0b8"],["openai==1.3.4","pandas","seaborn","requests","dotenv","azure-search-documents==11.4.0b8"],["openai==1.3.4","pandas","yfinance"],["openai==1.3.4","pandas","seaborn","requests","dotenv","azure-search-documents==11.4.0b8"]],a=[...Array(20)].map((t,e)=>({id:r(),name:`Admin ${e+1}`,email:`admin${e+1}@gbb-ai.com`,avatarUrl:`/assets/avatars/avatar_${e+1}.jpg`,permission:e%2?"view":"edit"})),h=[["Search"],["Design"],["Security"],["Assistant"],["Assistant"],["Stock"],["Sales"],["Fitness"],["Nature"],["Business"]],g=[`import requests

def search_bing(query) -> str:
    bing_search_url = "https://api.bing.microsoft.com/v7.0/search"
    bing_search_subscription_key = os.environ["BING_SEARCH_SUBSCRIPTION_KEY"]
    headers = {"Ocp-Apim-Subscription-Key": bing_search_subscription_key}
    params = {"q": query, "textDecorations": False}
    response = requests.get(bing_search_url, headers=headers, params=params)
    response.raise_for_status()
    search_results = response.json()
    
    output = []
    
    for result in search_results['webPages']['value']:
        output.append({
            'title': result['name'],
            'link': result['url'],
            'snippet': result['snippet']
        })
    
    return json.dumps(output)`,`import json
    
def customs_declaration(item):
    try:
        itemContent = item
        info1 = json.loads(item)
        if 'item' in info1.keys():
            info2 = json.loads(info1['item'])
            if 'Item Information' in info2.keys():
                itemContent = info2['Item Information']
        elif 'Item Information' in info1.keys():
            itemContent = info1['Item Information']
        return json.dumps({
            "item": itemContent,
            "description": "Your item is currently undergoing customs clearance. We appreciate your patience during this process."
        })
    except:
        return json.dumps({
            "item": item,
            "description": "Your item is currently undergoing customs clearance. We appreciate your patience during this process."
        })`,`from openai import AzureOpenAI
  
def draw(prompt) -> str:
    dalle_endpoint = os.environ["AZURE_DALLE_ENDPOINT"]
    dalle_key = os.environ["AZURE_DALLE_KEY"]
    client = AzureOpenAI(
        api_version="2023-12-01-preview",
        azure_endpoint=dalle_endpoint,
        api_key=dalle_key,
    )

    result = client.images.generate(
        model="Dalle3",  # the name of your DALL-E 3 deployment
        prompt=prompt,
        n=1
    )

    return json.dumps({
        'original_prompt': prompt,
        'revised_prompt': result.data[0].revised_prompt,
        'image_url': result.data[0].url
    })`,"","","",`import yfinance as yf
  
def get_stock_data(stock_code, start_date, end_date):
    # Retrieve stock data
    stock_data = yf.download(stock_code, start=start_date, end=end_date)
    stock_data_dict = json.loads(stock_data.to_json(orient='table'))
    stock_data_dict['title'] = f'Stock prices for {stock_code} from {start_date} to {end_date}'

    return json.dumps(stock_data_dict)`,"",""],y=[`{
    "name": "search_bing",
    "description": "Searches bing to get up to date information from the web",
    "parameters": {
        "type": "object",
        "properties": {
            "query": {
                "type": "string",
                "description": "The search query"
            }
        },
        "required": ["query"]
    }
}`,"","","","","","","",""],b=t=>t===0&&a.slice(0,5)||t===1&&a.slice(5,9)||t===2&&a.slice(9,11)||t===3&&a.slice(11,12)||[],v=()=>{const t=["healthy","warning","healthy"],e=Math.floor(Math.random()*t.length);return t[e]},A=t=>Array.from({length:t},()=>Math.floor(Math.random()*151));m.map((t,e)=>({id:`func_${e+1}`,name:t,url:"",code:g[e],size:0,shared:b(e),description:l[e],dependencies:f[e],meta:y[e],params:_[e],tags:h[e],createdAt:new Date,modifiedAt:new Date,type:`${t.split(".").pop()}`,status:v(),isFavorited:!0,activity:A(5),entryFunction:"",envVars:[],response:"",cover:"",apiAuth:null}));[...Array(20)].map((t,e)=>({id:e,name:"x",email:"xxx@x.com",avatarUrl:"",permission:"view"}));const k=["folder","txt","zip","audio","image","video","word","excel","powerpoint","pdf","photoshop","illustrator"],E=["Uploading...","Uploaded","Preparing...","Indexing...","Indexed","Failed"];export{k as F,E as S,S as T};
