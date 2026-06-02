

from datetime import datetime
from bson import ObjectId
from models.conversation_model import Conversation
from utils.dal import dal


class ConversationService:

    # Create Conversation
    @staticmethod
    def create_conversation(title:str):
        collections = dal.get_collection("conversation")

        conversation = {
            "title": title,
            "create_at": datetime.utcnow()
        }

        result = collections.insert_one(conversation)
        conversation["_id"] = str(result.inserted_id)

        return conversation
    
    # Get All Conversations
    @staticmethod
    def get_all_conversation():
        collections = dal.get_collection("conversation")
        conversations = list(collections.find())

        for conversation in conversations:
            conversation["_id"] = str(conversation["_id"])

        return conversations
    

    # Get One Conversation
    @staticmethod
    def get_one_conversation(_id: str):
        collection = dal.get_collection("conversation")
        conversation = collection.find_one({
            "_id": ObjectId(_id)
        })
        if conversation:
            conversation["_id"] = str(conversation["_id"])
        return conversation


    #Delete Conversation
    @staticmethod
    def delete_conversation(_id:str):
        collection = dal.get_collection("conversation")
        result = collection.delete_one({"_id": ObjectId(_id)})
        return result.deleted_count