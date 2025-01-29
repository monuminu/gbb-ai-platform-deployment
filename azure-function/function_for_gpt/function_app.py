import azure.functions as func
import os
import json
import math
import pytz
import json
import random
import logging
import requests
import pandas as pd
import yfinance as yf
from datetime import datetime
from openai import AzureOpenAI

app = func.FunctionApp(http_auth_level=func.AuthLevel.ANONYMOUS)


def get_current_time(location):
    try:
        # Get the timezone for the city
        timezone = pytz.timezone(location)
        print("hello")

        # Get the current time in the timezone
        now = datetime.now(timezone)
        current_time = now.strftime("%I:%M:%S %p")

        return current_time
    except:
        return "Sorry, I couldn't find the timezone for that location."


def calculator(num1, num2, operator):
    if operator == '+':
        return str(num1 + num2)
    elif operator == '-':
        return str(num1 - num2)
    elif operator == '*':
        return str(num1 * num2)
    elif operator == '/':
        return str(num1 / num2)
    elif operator == '**':
        return str(num1 ** num2)
    elif operator == 'sqrt':
        return str(math.sqrt(num1))
    else:
        return "Invalid operator"


def get_stock_market_data(index):
    available_indices = ["S&P 500", "NASDAQ Composite",
                         "Dow Jones Industrial Average", "Financial Times Stock Exchange 100 Index"]

    if index not in available_indices:
        return "Invalid index. Please choose from 'S&P 500', 'NASDAQ Composite', 'Dow Jones Industrial Average', 'Financial Times Stock Exchange 100 Index'."

    # Read the CSV file
    data = pd.read_csv('stock_data.csv')

    # Filter data for the given index
    data_filtered = data[data['Index'] == index]

    # Remove 'Index' column
    data_filtered = data_filtered.drop(columns=['Index'])

    # Convert the DataFrame into a dictionary
    hist_dict = data_filtered.to_dict()

    for key, value_dict in hist_dict.items():
        hist_dict[key] = {k: v for k, v in value_dict.items()}

    return json.dumps(hist_dict)


def get_sales_data():
    data = {
        "categories": [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec',
        ],
        "series": [
            {
                "type": 'Total Sales',
                "data": [
                    {
                        "name": '2023',
                        "data": [10, 41, 35, 51, 49, 62, 69, 91, 148, 35, 51, 49],
                    },
                    {
                        "name": '2022',
                        "data": [10, 34, 13, 56, 77, 88, 99, 77, 45, 13, 56, 77],
                    },
                ],
            },
            {
                "type": 'Total Inventory',
                "data": [
                    {
                        "name": '2023',
                        "data": [51, 35, 41, 10, 91, 69, 62, 148, 91, 69, 62, 49],
                    },
                    {
                        "name": '2022',
                        "data": [56, 13, 34, 10, 77, 99, 88, 45, 77, 99, 88, 77],
                    },
                ],
            },
        ],
    }

    return json.dumps(data)


def get_sales_data_chabaidao():
    data = {
        "categories": [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec',
        ],
        "series": [
            {
                "type": 'Total Sales',
                "data": [
                    {
                        "name": '2023',
                        "data": [10, 41, 35, 51, 49, 62, 69, 91, 148, 35, 51, 49],
                    },
                    {
                        "name": '2022',
                        "data": [10, 34, 13, 56, 77, 88, 99, 77, 45, 13, 56, 77],
                    },
                ],
            },
            {
                "type": 'Total Inventory',
                "data": [
                    {
                        "name": '2023',
                        "data": [51, 35, 41, 10, 91, 69, 62, 148, 91, 69, 62, 49],
                    },
                    {
                        "name": '2022',
                        "data": [56, 13, 34, 10, 77, 99, 88, 45, 77, 99, 88, 77],
                    },
                ],
            },
        ],
    }

    return json.dumps(data)


def search_bing(query) -> str:
    bing_search_url = "https://api.bing.microsoft.com/v7.0/search"
    bing_search_subscription_key = os.environ["BING_SEARCH_SUBSCRIPTION_KEY"]
    headers = {"Ocp-Apim-Subscription-Key": bing_search_subscription_key}
    params = {"q": query, "textDecorations": False, "count": 5}
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

    return json.dumps(output)


def video_retrieve(location):
    if 'street' in location or '街' in location:
        return json.dumps({
            "video_title": "/assets/mock/1064002762-preview.mp4"
        })
    elif 'cross' in location or '十字' in location:
        return json.dumps({
            "video_title": "/assets/mock/1101572605-preview.mp4"
        })


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
    })


def get_stock_data(stock_code, start_date, end_date):
    # Retrieve stock data
    stock_data = yf.download(stock_code, start=start_date, end=end_date)
    stock_data_dict = json.loads(stock_data.to_json(orient='table'))
    stock_data_dict['title'] = f'Stock prices for {stock_code} from {start_date} to {end_date}'

    return json.dumps(stock_data_dict)


def register_user(user_id, email):
    return json.dumps({
        "user_info": {"user_id": user_id, "email": email},
        "description": "Registration successful."
    })


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
        })


def get_football_match_data(localTeam, visitorTeam, date):
    data = {
        "local team": {
            "name": localTeam,
            "score": "2",
            "image": "https://ssl.gstatic.com/onebox/media/sports/logos/Th4fAVAZeCJWRcKoLW7koA_96x96.png"
        },
        "visitor team": {
            "name": visitorTeam,
            "score": "1",
            "image": "https://ssl.gstatic.com/onebox/media/sports/logos/paYnEE8hcrP96neHRNofhQ_96x96.png"
        },
        "date": date,
        "statistics": {
            "shots": {localTeam: "13", visitorTeam: "15"},
            "shots on target": {localTeam: "4", visitorTeam: "3"},
            "possession": {localTeam: "48%", visitorTeam: "52%"},
            "passes": {localTeam: "507", visitorTeam: "546"},
            "pass accuracy": {localTeam: "89%", visitorTeam: "86%"},
            "fouls": {localTeam: "15", visitorTeam: "15"},
            "yellow cards": {localTeam: "1", visitorTeam: "2"},
            "red cards": {localTeam: "0", visitorTeam: "0"},
            "offsides": {localTeam: "0", visitorTeam: "1"},
            "corners": {localTeam: "3", visitorTeam: "6"},
        }
    }
    return json.dumps(data)


def send_emails(names, date):
    data = []
    for i in range(len(names)):
        data.append({
            "name": names[i],
            "date": date,
        })

    return json.dumps(data)


def get_resturant_list(category):
    titles = ["海天壹号特色餐厅", "WANG STEAK王品", "Le Living",
              "GEMINIS Coffee&Eastery wine bar", "牛三德牛排饭"]
    addresses = ["湛山/太平角", "万象城", "万象城",  "云霄路", "湛山/太平角"]
    images = ["https://canadianfoodfocus.org/wp-content/uploads/2021/03/cultural-cuisine-1024x576.jpg",
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfNQWct96NCaKXzlleDIfy_Lq6LfwTGlxtHYTw7ei9hmvIViX7AybkX-Bse-tgIhdbObI&usqp=CAU",
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYHq4rF4sgBIApicpmxkI1nUvbmwLBwOD3FleX-k9whz0T5XSMUnEmfXm3BjG7pVlcELE&usqp=CAU",
              "https://secretnyc.co/wp-content/uploads/2018/12/New-Project-11.png",
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTv6d3ZR86AqO-i2c8dkx0S9FTwBm-shEpqVg&usqp=CAU",
              "https://i.insider.com/5e4efe32f0201416265717e3?width=700",
              "https://s3.ezordernow.com/RE1588823991/background_images/0.jpeg"
              ]
    data = []
    for i in range(5):
        data.append({
            "title": titles[i],
            "category": category,
            "address": addresses[i],
            "distance": f"{random.randint(200, 800)}m",
            "rating": round(random.uniform(3, 5), 1),
            "reviews": random.randint(100, 5000),
            "perCapitaConsumption": random.randint(100, 500),
            "image": images[i]
        })

    return json.dumps(data)


def book_resturant(category, id):
    # titles = ["懒人业余餐厅", "猫猫餐吧", "燃扒房 Steakhouse", "有料小聚",
    #           "BON YAKI modern izakaya", "北村韩食", "MONY CC 莫莉西西"]
    # addresses = ["福田中心-岗厦", "福田中心/会展中心", "新城市广场",
    #              "福田中心/会展中心", "华强北", "福田中心-岗厦", "车公庙"]
    titles = ["海天壹号特色餐厅", "WANG STEAK王品", "Le Living",
              "GEMINIS Coffee&Eastery wine bar", "牛三德牛排饭"]
    addresses = ["湛山/太平角", "万象城", "万象城",  "云霄路", "湛山/太平角"]
    images = ["https://canadianfoodfocus.org/wp-content/uploads/2021/03/cultural-cuisine-1024x576.jpg",
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfNQWct96NCaKXzlleDIfy_Lq6LfwTGlxtHYTw7ei9hmvIViX7AybkX-Bse-tgIhdbObI&usqp=CAU",
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYHq4rF4sgBIApicpmxkI1nUvbmwLBwOD3FleX-k9whz0T5XSMUnEmfXm3BjG7pVlcELE&usqp=CAU",
              "https://secretnyc.co/wp-content/uploads/2018/12/New-Project-11.png",
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTv6d3ZR86AqO-i2c8dkx0S9FTwBm-shEpqVg&usqp=CAU",
              "https://i.insider.com/5e4efe32f0201416265717e3?width=700",
              "https://s3.ezordernow.com/RE1588823991/background_images/0.jpeg"
              ]
    data = []
    for i in range(5):
        data.append({
            "title": titles[i],
            "category": category,
            "address": addresses[i],
            "distance": f"{random.randint(200, 800)}m",
            "rating": round(random.uniform(3, 5), 1),
            "reviews": random.randint(100, 5000),
            "perCapitaConsumption": random.randint(100, 500),
            "image": images[i]
        })

    return json.dumps(data[int(id)-1])


def get_popular_commodities(category, topK="3"):
    if category == "tent":
        data = [
            {
                "description": "2-Person Camping Tent – Includes Rain Fly and Carrying Bag – Lightweight Outdoor Tent for Backpacking, Hiking, or Beach by Wakeman Outdoors",
                "image": "https://rukminim1.flixcart.com/image/850/1000/kkbh8cw0/tent/o/a/e/4-person-tent-for-camping-waterproof-outdoor-tent-tent-house-original-imafzpagtyfftgvg.jpeg?q=20"
            },
            {
                "description": "4M Fire Retardant Bell Tent with Stove Hole - Ideal size for a family of 3 or couple with plenty of space, 320gsm fire retardant 100% cotton canvas, with stove hole.",
                "image": "https://lifeundercanvas.co.uk/wp-content/uploads/2018/02/Life-Under-Canvas-21-2000px.jpg"
            },
            {
                "description": "Outdoor Camping Tent with Sleeping Bag And Air Mattress",
                "image": "https://assets.wfcdn.com/im/00101746/resize-h800-w800%5Ecompr-r85/2160/216005645/Outdoor+Camping+Tent+with+Sleeping+Bag+And+Air+Mattress.jpg"
            },
            {
                "description": "CANVAS A-FRAME TENT - THE SCOUT ABOUT™ - Outdoor adventures will never be the same with our Scout About A-frame style canvas camping tent! This portable, easy-to-set-up tent is the perfect sidekick for any camping adventure - and even better, it easily fits 4 sleeping bags and features two doors for easy access and great ventilation.",
                "image": "https://www.lifeintents.com/cdn/shop/products/A-frametentincampground-946447_5000x.jpg?v=1682563191"
            },
            {
                "description": "5M OUTBACK DELUXE - Our 5 metre Outback Deluxe is our best-selling tent in New Zealand and comes after many, many requests for a tent that is suitable for our climate.",
                "image": "https://lotusbelle.co.nz/cdn/shop/products/2_8ed7418f-8b8f-42f8-9f20-6b4bf24979c6_1024x1024.jpg?v=1613964841"
            }
        ]
    elif category == "skirt":
        data = [
            {
                "description": "2023气质最新款女装西格丽春季通勤淑女单件大码春装圆领",
                "image": "https://img0.baidu.com/it/u=3402373855,2884907726&fm=253&fmt=auto&app=138&f=JPEG?w=400&h=400"
            },
            {
                "description": "2023新款连衣裙白色蕾丝连衣裙搭配 - 流行搭配",
                "image": "https://img1.baidu.com/it/u=149425881,2091696797&fm=253&fmt=auto&app=138&f=JPEG?w=482&h=500"
            },
            {
                "description": "2023气质最新款女装西格丽春季通勤淑女单件大码春装圆领",
                "image": "https://img0.baidu.com/it/u=3402373855,2884907726&fm=253&fmt=auto&app=138&f=JPEG?w=400&h=400"
            },
            {
                "description": "2023新款连衣裙白色蕾丝连衣裙搭配 - 流行搭配",
                "image": "https://img1.baidu.com/it/u=149425881,2091696797&fm=253&fmt=auto&app=138&f=JPEG?w=482&h=500"
            },
            {
                "description": "2023气质最新款女装西格丽春季通勤淑女单件大码春装圆领",
                "image": "https://img0.baidu.com/it/u=3402373855,2884907726&fm=253&fmt=auto&app=138&f=JPEG?w=400&h=400"
            },
            {
                "description": "2023新款连衣裙白色蕾丝连衣裙搭配 - 流行搭配",
                "image": "https://img1.baidu.com/it/u=149425881,2091696797&fm=253&fmt=auto&app=138&f=JPEG?w=482&h=500"
            }
        ]

    count = min(int(topK), 5)

    return json.dumps(data[:count])


@app.route(route="HttpExample")
def HttpExample(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')

    try:
        body = req.get_json()

        action = body.get('action')
        if action == 'get_current_time':
            location = body.get("params").get('location')
            return func.HttpResponse(get_current_time(location))
        elif action == 'calculator':
            num1 = body.get("params").get('num1')
            num2 = body.get("params").get('num2')
            operator = body.get("params").get('operator')
            return func.HttpResponse(calculator(num1, num2, operator))
        elif action == 'get_stock_market_data':
            index = body.get("params").get('index')
            return func.HttpResponse(get_stock_market_data(index))
        elif action == 'search_bing':
            query = body.get("params").get('query')
            return func.HttpResponse(search_bing(query))
        elif action == 'get_sales_data':
            return func.HttpResponse(get_sales_data())
        elif action == 'get_sales_data_chabaidao':
            return func.HttpResponse(get_sales_data_chabaidao())
        elif action == 'draw':
            prompt = body.get("params").get('prompt')
            return func.HttpResponse(draw(prompt))
        elif action == 'video_retrieve':
            location = body.get("params").get('location')
            return func.HttpResponse(video_retrieve(location))
        elif action == 'get_stock_data':
            stock_code = body.get("params").get('stock_code')
            start_date = body.get("params").get('start_date')
            end_date = body.get("params").get('end_date')
            return func.HttpResponse(get_stock_data(stock_code, start_date, end_date))
        elif action == 'register_user':
            user_id = body.get("params").get('user_id')
            email = body.get("params").get('email')
            return func.HttpResponse(register_user(user_id, email))
        elif action == 'get_popular_commodities':
            category = body.get("params").get('category')
            topK = body.get("params").get('topK')
            return func.HttpResponse(get_popular_commodities(category, topK))
        elif action == 'customs_declaration':
            item = body.get("params").get('item')
            return func.HttpResponse(customs_declaration(item))
        elif action == 'get_football_match_data':
            localTeam = body.get("params").get('localTeam')
            visitorTeam = body.get("params").get('visitorTeam')
            date = body.get("params").get('date')
            return func.HttpResponse(get_football_match_data(localTeam, visitorTeam, date))
        elif action == 'get_resturant_list':
            category = body.get("params").get('category')
            return func.HttpResponse(get_resturant_list(category))
        elif action == 'send_emails':
            nameStr = body.get("params").get('names')
            date = body.get("params").get('date')
            names = nameStr.split(',')
            return func.HttpResponse(send_emails(names, date))
        elif action == 'book_resturant':
            category = body.get("params").get('category')
            id = body.get("params").get('id')
            return func.HttpResponse(book_resturant(category, id))
        else:
            return func.HttpResponse(
                "This HTTP triggered function executed successfully. Pass an action in the request body for a personalized response.",
                status_code=200
            )
    except ValueError:
        pass


@app.route(route="bing_search")
def BingSearch(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')

    try:
        body = req.get_json()

        query = body.get("query")
        if query:
            return func.HttpResponse(search_bing(query))
        else:
            return func.HttpResponse(
                "The HTTP triggered function failed to execute. Please provide the required parameters.",
                status_code=200
            )
    except ValueError:
        return func.HttpResponse(
            "The HTTP triggered function failed to execute. Please provide the required parameters.",
            status_code=200
        )


@app.route(route="dalle")
def DallE(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')

    try:
        body = req.get_json()
        prompt = body.get('prompt')
        if prompt:
            return func.HttpResponse(draw(prompt))
        else:
            return func.HttpResponse(
                "The HTTP triggered function failed to execute. Please provide the required parameters.",
                status_code=200
            )
    except ValueError:
        return func.HttpResponse(
            "The HTTP triggered function failed to execute. Please provide the required parameters.",
            status_code=200
        )


@app.route(route="get_stock_data")
def GetStockData(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')

    try:
        body = req.get_json()

        stock_code = body.get("stock_code")
        start_date = body.get("start_date")
        end_date = body.get("end_date")

        if stock_code and start_date and end_date:
            return func.HttpResponse(get_stock_data(stock_code, start_date, end_date))
        else:
            return func.HttpResponse(
                "The HTTP triggered function failed to execute. Please provide the required parameters.",
                status_code=200
            )
    except ValueError:
        return func.HttpResponse(
            "The HTTP triggered function failed to execute. Please provide the required parameters.",
            status_code=200
        )


@app.route(route="send_emails")
def SendEmails(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')

    try:
        body = req.get_json()

        nameStr = body.get('names')
        date = body.get('date')
        names = nameStr.split(',')
        return func.HttpResponse(send_emails(names, date))
    except ValueError:
        return func.HttpResponse(
            "The HTTP triggered function failed to execute. Please provide the required parameters.",
            status_code=200
        )


@app.route(route="register_user")
def RegisterUser(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')

    try:
        body = req.get_json()

        user_id = body.get('user_id')
        email = body.get('email')
        return func.HttpResponse(register_user(user_id, email))
    except ValueError:
        return func.HttpResponse(
            "The HTTP triggered function failed to execute. Please provide the required parameters.",
            status_code=200
        )
