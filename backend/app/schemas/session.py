from pydantic import BaseModel


class SessionCreate(BaseModel):
    agent_id: int


class SessionResponse(BaseModel):
    id: int
    invite_token: str
    status: str

    class Config:
        from_attributes = True