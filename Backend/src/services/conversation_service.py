from datetime import datetime
from bson import ObjectId
from services.message_service import MessageService
from utils.dal import dal


class ConversationService:

    @staticmethod
    def create_conversation(title: str):
        collection = dal.get_collection("conversation")

        conversation = {
            "title": title,
            "create_at": datetime.utcnow()
        }

        result = collection.insert_one(conversation)
        conversation["_id"] = str(result.inserted_id)

        return conversation

    @staticmethod
    def get_all_conversation():
        collection = dal.get_collection("conversation")
        conversations = list(collection.find())

        for conversation in conversations:
            conversation["_id"] = str(conversation["_id"])

        return conversations

    @staticmethod
    def get_one_conversation(_id: str):
        collection = dal.get_collection("conversation")

        conversation = collection.find_one({
            "_id": ObjectId(_id)
        })

        if conversation:
            conversation["_id"] = str(conversation["_id"])

        return conversation

    @staticmethod
    def delete_conversation(_id: str):
        MessageService.delete_message_by_conversation(_id)

        collection = dal.get_collection("conversation")
        result = collection.delete_one({
            "_id": ObjectId(_id)
        })

        return result.deleted_count
