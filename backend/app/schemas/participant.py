from pydantic import BaseModel


class JoinSessionRequest(BaseModel):
    user_id: int
    invite_token: str


class ParticipantResponse(BaseModel):
    id: int
    session_id: int
    user_id: int

    class Config:
        from_attributes = True