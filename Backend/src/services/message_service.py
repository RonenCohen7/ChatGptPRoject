import collections
from datetime import datetime

from utils.dal import dal


class MessageService:
    
    #Add new message
    @staticmethod
    def add_message(conversation_id: str, content:str, role:str):
        collection = dal.get_collection("message")

        message ={
            "conversation_id": conversation_id,
            "content": content,
            "role": role,
            "create_at":datetime.utcnow()
        }

        result = collection.insert_one(message)

        message["_id"] = str(result.inserted_id)

        return message
    


    #Get Messages
    @staticmethod
    def get_messages_by_conversation(conversation_id:str):
        collection = dal.get_collection("message")
        messages = list(
            collection.find({
                "conversation_id":conversation_id
            }).sort("create_at", 1)
        )
        for message in messages:
            message["_id"] = str(message["_id"])
            message["create_at"] = str(message["create_at"])
        return messages


    #Delete Message
    @staticmethod
    def delete_message_by_conversation(conversation_id: str):
        collection = dal.get_collection("message")

        result = collection.delete_many({
            "conversation_id":conversation_id
        })
        return result.deleted_count