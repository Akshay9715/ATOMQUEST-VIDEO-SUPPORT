from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.db.session import get_db

from app.models.user import User
from app.models.session import Session as CallSession

from datetime import datetime

from app.schemas.session import (
    SessionCreate,
    SessionResponse
)

from app.utils.token import (
    generate_invite_token
)

router = APIRouter(
    prefix="/sessions",
    tags=["Sessions"]
)

@router.post(
    "",
    response_model=SessionResponse
)
def create_session(
    payload: SessionCreate,
    db: Session = Depends(get_db)
):

    agent = (
        db.query(User)
        .filter(User.id == payload.agent_id)
        .first()
    )

    if not agent:
        raise HTTPException(
            status_code=404,
            detail="Agent not found"
        )

    if agent.role != "agent":
        raise HTTPException(
            status_code=403,
            detail="Only agents can create sessions"
        )

    session = CallSession(
        agent_id=agent.id,
        invite_token=generate_invite_token(),
        status="created"
    )

    db.add(session)
    db.commit()
    db.refresh(session)

    return session


@router.get("")
def get_sessions(
    db: Session = Depends(get_db)
):

    sessions = (
        db.query(CallSession)
        .all()
    )

    return sessions



@router.get("/active")
def active_sessions(
    db: Session = Depends(get_db)
):

    sessions = (
        db.query(CallSession)
        .filter(CallSession.status == "active").all())

    return sessions

@router.get("/{session_id}")
def get_session(session_id: int,db: Session = Depends(get_db)):
    session = (
        db.query(CallSession)
        .filter(
            CallSession.id == session_id
        )
        .first()
    )

    if not session:
        raise HTTPException(
            status_code=404,
            detail="Session not found"
        )

    return session



@router.post("/{session_id}/end")
def end_session(session_id: int, db: Session = Depends(get_db)):

    session = (
        db.query(CallSession)
        .filter(
            CallSession.id == session_id
        )
        .first()
    )

    if not session:
        raise HTTPException(
            status_code=404,
            detail="Session not found"
        )

    session.status = "ended"
    session.ended_at = datetime.utcnow()

    db.commit()

    return {
        "message": "Session ended"
    }

