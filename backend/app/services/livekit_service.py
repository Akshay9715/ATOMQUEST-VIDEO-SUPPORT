from livekit import api

from app.core.livekit_config import (
    LIVEKIT_API_KEY,
    LIVEKIT_API_SECRET,
)

def generate_token(
    identity: str,
    room_name: str,
):
    
    token = (
        api.AccessToken(
            LIVEKIT_API_KEY,
            LIVEKIT_API_SECRET
        )
        .with_identity(identity)
        .with_grants(
            api.VideoGrants(
                room_join=True,
                room=room_name
            )
        )
        .to_jwt()
    )

    return token