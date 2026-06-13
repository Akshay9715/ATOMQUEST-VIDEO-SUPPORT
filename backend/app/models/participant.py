from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import ForeignKey
from sqlalchemy import DateTime

from datetime import datetime

from app.db.database import Base


class Participant(Base):
    __tablename__ = "participants"

    id = Column(
        Integer,
        primary_key=True
    )

    session_id = Column(
        Integer,
        ForeignKey("sessions.id")
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    joined_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    left_at = Column(
        DateTime,
        nullable=True
    )