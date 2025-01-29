import os
from datetime import datetime


def form_kb_item(id: str, fileName: str, fileSize: int, status: str = "Uploaded"):
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
            "tags": [],
            "shared": [
                {
                    "id": "1",
                    "name": "Lei",
                    "email": "lei@gbb-ai.com",
                    "avatarUrl": "/assets/avatars/avatar_1.jpg",
                    "permission": "edit"
                }
            ],
            "isFavorited": False
        }

        return data
    except Exception as e:
        return {
            "success": False,
            "message": str(e)
        }
