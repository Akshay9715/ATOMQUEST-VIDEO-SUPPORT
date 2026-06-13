from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from app.db.session import get_db

from app.models.chat_message import (
    ChatMessage
)

router = APIRouter(
    prefix="/chat",
    tags=["Chat"]
)

@router.get("/{session_id}")
def get_chat_history(
    session_id: int,
    db: Session = Depends(get_db)
):

    return (db.query(ChatMessage).filter(ChatMessage.session_id == session_id).all())