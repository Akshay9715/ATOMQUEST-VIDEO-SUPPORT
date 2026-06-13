import socketio
from app.db.database import SessionLocal

from app.models.chat_message import (
    ChatMessage
)

sio = socketio.AsyncServer(
    async_mode="asgi",
    cors_allowed_origins="*"
)

@sio.event
async def connect(sid, environ):
    print(f"Connected: {sid}")

@sio.event
async def disconnect(sid):
    print(f"Disconnected: {sid}")


@sio.event
async def join_room(
    sid,
    data
):
    room = f"session_{data['session_id']}"

    await sio.enter_room(
        sid,
        room
    )

    await sio.emit(
        "participant_joined",
        {
            "message": "Participant joined"
        },
        room=room
    )

@sio.event
async def leave_room(
    sid,
    data
):
    room = f"session_{data['session_id']}"

    await sio.leave_room(
        sid,
        room
    )

    await sio.emit(
        "participant_left",
        {
            "message": "Participant left"
        },
        room=room
    )


@sio.event
async def send_message(
    sid,
    data
):

    db = SessionLocal()

    try:

        message = ChatMessage(
            session_id=data["session_id"],
            sender_id=data["sender_id"],
            message=data["message"]
        )

        db.add(message)
        db.commit()

    finally:
        db.close()

    room = f"session_{data['session_id']}"

    await sio.emit(
        "new_message",
        {
            "sender_id": data["sender_id"],
            "message": data["message"]
        },
        room=room
    )