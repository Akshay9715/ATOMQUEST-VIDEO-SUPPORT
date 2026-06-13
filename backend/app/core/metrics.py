from prometheus_client import Counter
from prometheus_client import Gauge

active_sessions = Gauge(
    "active_sessions",
    "Currently active sessions"
)

connected_participants = Gauge(
    "connected_participants",
    "Connected participants"
)

messages_sent = Counter(
    "messages_sent_total",
    "Messages sent"
)

recordings_uploaded = Counter(
    "recordings_uploaded_total",
    "Recordings uploaded"
)