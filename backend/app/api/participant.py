from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.db.session import get_db

from app.models.user import User
from app.models.session import Session as CallSession
from app.models.participant import Participant

from app.schemas.participant import (
    JoinSessionRequest,
    ParticipantResponse
)
from app.core.metrics import connected_participants

from datetime import datetime

router = APIRouter(
    prefix="/participants",
    tags=["Participants"]
)

@router.post(
    "/join",
    response_model=ParticipantResponse
)
def join_session(payload: JoinSessionRequest, db: Session = Depends(get_db)):

    user = (db.query(User).filter(User.id == payload.user_id).first())

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    session = (
        db.query(CallSession).filter(CallSession.invite_token== payload.invite_token).first())

    if not session:
        raise HTTPException(
            status_code=404,
            detail="Invalid invite token"
        )

    if session.status == "ended":
        raise HTTPException(
            status_code=400,
            detail="Session already ended"
        )

    existing = (
        db.query(Participant).filter(
            Participant.session_id == session.id,
            Participant.user_id == user.id,
            Participant.left_at == None
        ).first())

    if existing:
        return existing

    participant = Participant(
        session_id=session.id,
        user_id=user.id
    )

    db.add(participant)

    if session.status == "created":
        session.status = "active"

    db.commit()
    db.refresh(participant)

    connected_participants.inc()

    return participant

@router.post("/leave/{participant_id}")
def leave_session(participant_id: int,db: Session = Depends(get_db)):

    participant = (db.query(Participant).filter(
            Participant.id == participant_id
        )
        .first()
    )

    if not participant:
        raise HTTPException(
            status_code=404,
            detail="Participant not found"
        )

    participant.left_at = datetime.utcnow()

    db.commit()
    connected_participants.dec()

    return {
        "message": "Left session"
    }

@router.get("/session/{session_id}")
def get_session_participants(session_id: int,db: Session = Depends(get_db)):

    participants = (
        db.query(Participant).filter(Participant.session_id == session_id).all())

    return participants