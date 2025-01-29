import sys
import json
from azure.cosmos import CosmosClient


#  connection information
endpoint = sys.argv[1]
key = sys.argv[2]
database_name = sys.argv[3]
container_name = sys.argv[4]

# Initialize the Cosmos client
client = CosmosClient(endpoint, key)

# Get database and container references
database = client.get_database_client(database_name)
container = database.get_container_client(container_name)

# Define the item to be inserted
items = [
    {
        "id": "80b4b928-95e3-46f1-a7e7-b10cdcbdfbeb",
        "source": "built-in",
        "category": "Text",
        "content": "",
        "cover": "/static/mock-images/ml-apps/product_9.jpg",
        "dateCreated": "2023-07-10 14:39:56",
        "dateModified": "2023-09-01 12:26:44",
        "maintainers": [],
        "scenarios": [
            {
                "color": "primary",
                "title": "Copilot"
            }
        ],
        "title": "AOAI Workbench",
        "type": "Text"
    },
    {
        "id": "sty779a5-0ad5-4ebc-a9d0-l232314ds73c",
        "category": "Text",
        "content": "",
        "source": "built-in",
        "cover": "/static/mock-images/ml-apps/product_12.jpg",
        "dateCreated": "2023-07-10 14:39:56",
        "dateModified": "2023-09-01 12:26:44",
        "maintainers": [
            {
                "avatar": "/assets/avatars/avatar_1.jpg",
                "email": "admin@gbb_ai.com",
                "name": "Lei",
                "permission": "view"
            }
        ],
        "rating": 5,
        "scenario": "Copilot",
        "scenarios": [
            {
                "color": "primary",
                "title": "Copilot"
            }
        ],
        "title": "TV Copilot",
        "type": "Text"
    },
    {
        "id": "d1122888-ff2e-4bd3-864b-15b35616d893",
        "category": "Text",
        "content": "https://<CHAT_DA_URL_PLACEHOLDER>/api/gpt_da",
        "source": "built-in",
        "cover": "/static/mock-images/ml-apps/product_2.jpg",
        "dateCreated": "2024-04-11 14:39:56",
        "dateModified": "2024-04-11 17:26:44",
        "maintainers": [
            {
                "avatar": "/assets/avatars/avatar_1.jpg",
                "email": "admin@gbb_ai.com",
                "name": "Lei",
                "permission": "view"
            }
        ],
        "scenarios": [
            {
                "color": "primary",
                "title": "Copilot"
            }
        ],
        "title": "AI Data Analyzer",
        "type": "Text"
    },
    {
        "id": "09ed6b84-6919-400c-b909-6a013e4368f4",
        "category": "Text",
        "content": "<AI-SEARCH-INDEX-PLACEHOLDER>",
        "source": "built-in",
        "cover": "/static/mock-images/ml-apps/product_8.jpg",
        "dateCreated": "2024-10-11 06:39:56",
        "dateModified": "2024-10-11 07:26:44",
        "maintainers": [
            {
                "avatar": "/assets/avatars/avatar_1.jpg",
                "email": "admin@gbb_ai.com",
                "name": "Lei",
                "permission": "view"
            }
        ],
        "scenarios": [
            {
                "color": "primary",
                "title": "Copilot"
            }
        ],
        "title": "Manufacturing Copilot",
        "type": "Text",
    }
]

# Insert the item into the container
for item in items:
    container.create_item(body=item)
