from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.db.session import get_db

from app.models.user import User
from app.models.session import Session as CallSession

from app.schemas.livekit import (
    TokenRequest,
    TokenResponse
)

from app.services.livekit_service import (
    generate_token
)

router = APIRouter(
    prefix="/video",
    tags=["Video"]
)

@router.post(
    "/token",
    response_model=TokenResponse
)
def create_video_token(
    payload: TokenRequest,
    db: Session = Depends(get_db)
):

    user = (
        db.query(User)
        .filter(
            User.id == payload.user_id
        )
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    session = (
        db.query(CallSession)
        .filter(
            CallSession.id == payload.session_id
        )
        .first()
    )

    if not session:
        raise HTTPException(
            status_code=404,
            detail="Session not found"
        )

    room_name = f"session_{session.id}"

    token = generate_token(
        identity=f"user_{user.id}",
        room_name=room_name
    )

    return {
        "token": token,
        "room_name": room_name
    }