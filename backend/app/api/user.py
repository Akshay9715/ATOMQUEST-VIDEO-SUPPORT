from fastapi import APIRouter
from fastapi import Depends
from sqlalchemy.orm import Session

from app.db.session import get_db

from app.models.user import User

from app.schemas.user import (
    UserCreate,
    UserResponse
)

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)

@router.post(
    "",
    response_model=UserResponse
)
def create_user(
    payload: UserCreate,
    db: Session = Depends(get_db)
):

    user = User(
        name=payload.name,
        email=payload.email,
        role=payload.role
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user

@router.get("")
def get_users(
    db: Session = Depends(get_db)
):
    return db.query(User).all()