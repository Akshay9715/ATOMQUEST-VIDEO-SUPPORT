from pydantic import BaseModel
from typing import Literal


class UserCreate(BaseModel):
    name: str
    email: str
    role: Literal["agent", "customer"]


class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str

    class Config:
        from_attributes = True