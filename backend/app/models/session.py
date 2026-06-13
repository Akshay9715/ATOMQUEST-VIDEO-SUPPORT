from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import DateTime
from sqlalchemy import ForeignKey

from datetime import datetime

from app.db.database import Base


class Session(Base):
    __tablename__ = "sessions"

    id = Column(Integer, primary_key=True, index=True)

    agent_id = Column(Integer, ForeignKey("users.id"))

    invite_token = Column(String, unique=True, nullable=False)

    status = Column(String, default="created")

    started_at = Column(DateTime, default=datetime.utcnow)

    ended_at = Column(DateTime, nullable=True)