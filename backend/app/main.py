from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db import create_tables

from app.api.user import router as user_router

from app.api.session import (
    router as session_router
)
from app.api.participant import (
    router as participant_router
)
from fastapi import FastAPI
import socketio
from app.api.chat import (
    router as chat_router
)

from app.sockets.socket_manager import sio
from app.api.livekit import (
    router as livekit_router
)



fastapi_app = FastAPI()


fastapi_app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          # Allow all origins (for testing)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

fastapi_app.include_router(
    livekit_router
)

@fastapi_app.on_event("startup")
def startup():
    create_tables()



fastapi_app.include_router(
    chat_router
)

fastapi_app.include_router(user_router)

fastapi_app.include_router(participant_router)
fastapi_app.include_router(session_router)

@fastapi_app.get("/")
def home():
    return {
        "message": "Backend Running"
    }


app = socketio.ASGIApp(
    socketio_server=sio,
    other_asgi_app=fastapi_app
)
