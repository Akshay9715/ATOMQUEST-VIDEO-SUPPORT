from fastapi import APIRouter
from fastapi import UploadFile
from fastapi import File
from fastapi import Depends
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.db.session import get_db

from app.models.file import (
    FileUpload
)

import os
import uuid

router = APIRouter(
    prefix="/files",
    tags=["Files"]
)

UPLOAD_DIR = "uploads"

os.makedirs(
    UPLOAD_DIR,
    exist_ok=True
)

@router.post("/upload")
async def upload_file(
    session_id: int,
    sender_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):

    unique_name = (
        f"{uuid.uuid4()}_{file.filename}"
    )

    path = os.path.join(
        UPLOAD_DIR,
        unique_name
    )

    with open(path, "wb") as f:
        content = await file.read()
        f.write(content)

    uploaded = FileUpload(
        session_id=session_id,
        sender_id=sender_id,
        filename=file.filename,
        file_path=path
    )

    db.add(uploaded)
    db.commit()
    db.refresh(uploaded)

    return {
        "id": uploaded.id,
        "filename": uploaded.filename
    }

@router.get("/{file_id}")
def download_file(
    file_id: int,
    db: Session = Depends(get_db)
):

    file = (
        db.query(FileUpload)
        .filter(
            FileUpload.id == file_id
        )
        .first()
    )

    return FileResponse(
        file.file_path,
        filename=file.filename
    )