import asyncio
import time

from app.core.reconnect_manager import (
    pending_disconnects
)

async def cleanup_disconnects():

    while True:

        now = time.time()
        expired = []

        for sid, timestamp in pending_disconnects.items():
            if now - timestamp > 30:
                expired.append(sid)

        for sid in expired:
            print(f"Expired disconnect: {sid}")
            del pending_disconnects[sid]

        await asyncio.sleep(5)