from fastapi import APIRouter, HTTPException
from models.conversation_model import Conversation
from services.conversation_service import ConversationService



router = APIRouter()


# Create Conversation
@router.post("/api/conversation")
def create_conversation(conversation: Conversation):
    return ConversationService.create_conversation(conversation.title)


@router.get("/api/conversation")
def get_all_conversation():
    return ConversationService.get_all_conversation()


@router.get("/api/conversation/{_id}")
def get_one_conversation(_id: str):
    conversation = ConversationService.get_one_conversation(_id)
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation Not Found")
    
    return conversation


@router.delete("/api/conversation/{_id}")
def delete_conversation(_id:str):
    deleted_count = ConversationService.delete_conversation(_id)

    if deleted_count == 0:
        raise HTTPException(status_code=404, detail="Conversation Not Found")
    return { "Message": "Conversation deleted successfully" }

    

