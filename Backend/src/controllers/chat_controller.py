

from fastapi import APIRouter
from pydantic import BaseModel
from services.message_service import MessageService
from services.service_openai import OpenAiService


router = APIRouter()

class ChatSchema(BaseModel):
    conversation_id:str
    content: str
   

@router.post("/api/chat")
def ask_chat_gpt(chat_schema: ChatSchema):
    old_messages = MessageService.get_messages_by_conversation(
        chat_schema.conversation_id
    )
    history = []
    for message in old_messages:
        history.append({
            "role":message["role"],
            "content":message["content"]
        })
   

    user_message = MessageService.add_message(
        conversation_id=chat_schema.conversation_id,
        content = chat_schema.content,
        role="user"
    )

    history.append({
        "role":"user",
        "content": chat_schema.content
    })

    print("HISTORY")
    print(history)

    answer = OpenAiService.ask_chatGpt(history)

    assistant_message= MessageService.add_message(
        conversation_id=chat_schema.conversation_id,
        content=answer,
        role="assistant"
    )


    print("HISTORY")
    print(history)

    return {
        "user_message":user_message,
        "assistant_message":assistant_message
    }



@router.get("/api/chat/{_id}")
def get_chat_messages(_id:str):
    return MessageService.get_messages_by_conversation(_id)




