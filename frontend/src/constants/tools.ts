const FUNCTIONS = [
  'Bing search',
  'Customs declaration',
  'Image creator',
  'Video retrieval',
  'Calculator',
  'Get weather',
  'Get stock data',
  'Sales trend',
];

const CODE_DESCRIPTIONS = [
  'Searches bing to get up to date information from the web.',
  `Declare goods that are being imported or exported.`,
  `Uses Dall-E to draw an image based on user's prompt.`,
  'Retives a video from the database based on the given location.',
  'An application that is used to perform mathematical calculations.',
  'Acquire information about the current weather conditions in your area.',
  'The process involves obtaining data related to the stock market',
  '',
];

const DEPENDENCIES = [
  ['openai==1.3.4', 'pandas', 'seaborn', 'requests', 'dotenv', 'azure-search-documents==11.4.0b8'],
  ['json', 'pandas'],
  ['openai==1.3.4', 'pandas', 'dotenv'],
  ['openai==1.3.4', 'pandas', 'seaborn', 'requests', 'dotenv', 'azure-search-documents==11.4.0b8'],
  ['openai==1.3.4', 'pandas', 'seaborn', 'requests', 'dotenv', 'azure-search-documents==11.4.0b8'],
  ['openai==1.3.4', 'pandas', 'seaborn', 'requests', 'dotenv', 'azure-search-documents==11.4.0b8'],
  ['openai==1.3.4', 'pandas', 'yfinance'],
  ['openai==1.3.4', 'pandas', 'seaborn', 'requests', 'dotenv', 'azure-search-documents==11.4.0b8'],
];

const SHARED_PERSONS = [...Array(20)].map((_, index) => ({
  id: `person-${index}`,
  name: `Admin ${index + 1}`,
  email: `admin${index + 1}@gbb-ai.com`,
  avatarUrl: `/assets/avatars/avatar_${index + 1}.jpg`,
  permission: index % 2 ? 'view' : 'edit',
}));

const tags = [
  ['Search'],
  ['Design'],
  ['Security'],
  ['Assistant'],
  ['Assistant'],
  ['Stock'],
  ['Sales'],
  ['Fitness'],
  ['Nature'],
  ['Business'],
];

const CODES = [
  `import requests

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
    
    return json.dumps(output)`,
  `import json
    
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
        })`,
  `from openai import AzureOpenAI
  
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
    })`,
  '',
  '',
  '',
  `import yfinance as yf
  
def get_stock_data(stock_code, start_date, end_date):
    # Retrieve stock data
    stock_data = yf.download(stock_code, start=start_date, end=end_date)
    stock_data_dict = json.loads(stock_data.to_json(orient='table'))
    stock_data_dict['title'] = f'Stock prices for {stock_code} from {start_date} to {end_date}'

    return json.dumps(stock_data_dict)`,
  '',
  '',
];

const FUNCTION_META = [
  `{
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
}`,
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
];

// ----------------------------------------------------------------------

const shared = (index: number) =>
  (index === 0 && SHARED_PERSONS.slice(0, 5)) ||
  (index === 1 && SHARED_PERSONS.slice(5, 9)) ||
  (index === 2 && SHARED_PERSONS.slice(9, 11)) ||
  (index === 3 && SHARED_PERSONS.slice(11, 12)) ||
  [];

export const _allFunctions = FUNCTIONS.map((name, index) => ({
  id: `func_${index + 1}`,
  name,
  url: '',
  code: CODES[index],
  size: 0,
  shared: shared(index),
  description: CODE_DESCRIPTIONS[index],
  dependencies: DEPENDENCIES[index],
  meta: FUNCTION_META[index],
  params: [],
  tags: tags[index],
  createdAt: new Date(),
  modifiedAt: new Date(),
  type: `${name.split('.').pop()}`,
  status: index % 3 ? 'published' : 'draft',
  isFavorited: true,
  entryFunction: '',
  envVars: [],
  response: '',
  cover: '',
  apiAuth: null,
}));

export const TOOL_STATUS_OPTIONS = ['draft', 'published'];
