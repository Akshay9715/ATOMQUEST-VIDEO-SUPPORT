from fastapi import FastAPI

from app.db import create_tables

from app.api.user import router as user_router

from app.api.session import (
    router as session_router
)

app = FastAPI()


@app.on_event("startup")
def startup():
    create_tables()


app.include_router(user_router)


app.include_router(session_router)

@app.get("/")
def home():
    return {
        "message": "Backend Running"
    }

