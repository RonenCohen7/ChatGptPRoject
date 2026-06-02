
from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional


class Conversation(BaseModel):
    _id: Optional[str] = None
    title: str = Field(
                    min_length=3,
                    max_length=100,
                    description="Conversation title")
    
    created_at: datetime = Field(
                            default_factory=datetime.now,
                            description="Conversation creation date")


