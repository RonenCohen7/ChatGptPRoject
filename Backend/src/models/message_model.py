
from pydantic import BaseModel, Field
from datetime import datetime
from typing import Literal, Optional


class Message(BaseModel):
    _id: Optional[str] = None
    conversation_id: str = Field(
                    ...,
                    min_length=1,
                    description="Conversation ID",
    )
    role:Literal["user", "assistant"] = Field(
        ...,
        description="Message sender"
    )
    content: str = Field(
        ...,
        min_length=1,
        max_length=5000,
        description="Message content"
    )
    content_type: Literal["text", "image", "video"] = Field(
        default="text",
        description="Message content type"
    )
    create_at: datetime = Field(
        default_factory=datetime.now,
        description="Message creation date"
    )