from fastapi import APIRouter
from fastapi import UploadFile
from fastapi import File
from fastapi import Depends
from fastapi.responses import FileResponse

from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.recording import Recording

import os
import uuid

router = APIRouter(
    prefix="/recordings",
    tags=["Recordings"]
)

RECORDING_DIR = "recordings"

os.makedirs(
    RECORDING_DIR,
    exist_ok=True
)

@router.post("/upload")
async def upload_recording(
    session_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):

    filename = (
        f"{uuid.uuid4()}.webm"
    )

    filepath = os.path.join(
        RECORDING_DIR,
        filename
    )

    with open(
        filepath,
        "wb"
    ) as f:
        content = await file.read()
        f.write(content)

    recording = Recording(
        session_id=session_id,
        status="ready",
        file_path=filepath
    )

    db.add(recording)
    db.commit()
    db.refresh(recording)

    return {
        "recording_id": recording.id,
        "file_path": filepath
    }

@router.get("/{recording_id}")
def download_recording(
    recording_id: int,
    db: Session = Depends(get_db)
):

    recording = (
        db.query(Recording)
        .filter(
            Recording.id == recording_id
        )
        .first()
    )

    if not recording:
        return {
            "error": "Not found"
        }

    return FileResponse(
        recording.file_path
    )


@router.get("/session/{session_id}")
def get_recordings(
    session_id: int,
    db: Session = Depends(get_db)
):

    recordings = (
        db.query(Recording)
        .filter(
            Recording.session_id == session_id
        )
        .all()
    )

    return recordings