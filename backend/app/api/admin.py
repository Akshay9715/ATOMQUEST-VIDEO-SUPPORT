from fastapi import APIRouter
from fastapi import Depends

from datetime import datetime

from sqlalchemy.orm import Session

from app.db.session import get_db

from app.models.participant import (
    Participant
)

from app.models.session import (
    Session as CallSession
)

router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)

@router.get("/active")
def active_sessions(
    db: Session = Depends(get_db)
):

    sessions = (
        db.query(CallSession)
        .filter(
            CallSession.status == "active"
        )
        .all()
    )

    return sessions


@router.get("/overview")
def dashboard_overview(
    db: Session = Depends(get_db)
):

    total_sessions = (
        db.query(CallSession)
        .count()
    )

    active_sessions = (
        db.query(CallSession)
        .filter(
            CallSession.status == "active"
        )
        .count()
    )

    participants = (
        db.query(Participant)
        .count()
    )

    return {
        "total_sessions":
            total_sessions,

        "active_sessions":
            active_sessions,

        "participants":
            participants
    }