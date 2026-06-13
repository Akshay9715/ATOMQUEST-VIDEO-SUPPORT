import { useState } from "react";
import axios from "axios";

import VideoRoom from "../components/VideoRoom";
import Chat from "../components/Chat";

export default function CustomerPage() {
  const [inviteToken, setInviteToken] = useState("");

  const [sessionId, setSessionId] = useState(null);

  const [videoToken, setVideoToken] = useState(null);

  const [error, setError] = useState("");

  const [joining, setJoining] = useState(false);

  const joinSession = async () => {
    if (!inviteToken.trim()) {
      setError("Please enter an invite token");
      return;
    }

    try {
      setJoining(true);
      setError("");

      const joinResponse = await axios.post(
        "http://localhost:8000/participants/join",
        {
          user_id: 4,
          invite_token: inviteToken,
        },
      );

      const joinedSessionId = joinResponse.data.session_id;

      setSessionId(joinedSessionId);

      const videoResponse = await axios.post(
        "http://localhost:8000/video/token",
        {
          user_id: 4,
          session_id: joinedSessionId,
        },
      );

      setVideoToken(videoResponse.data.token);
    } catch (error) {
      console.error(error);

      setError("Invalid invite token or session does not exist.");
    } finally {
      setJoining(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      {/* BEFORE JOINING */}

      {!videoToken && (
        <div className="max-w-xl mx-auto mt-20 bg-slate-800 rounded-2xl p-8">
          <h1 className="text-3xl font-bold mb-2">Customer Support Session</h1>

          <p className="text-slate-400 mb-6">
            Enter the invite token provided by the support agent.
          </p>

          <input
            type="text"
            placeholder="Enter Invite Token"
            value={inviteToken}
            onChange={(e) => setInviteToken(e.target.value)}
            className="
              w-full
              bg-slate-900
              border
              border-slate-700
              rounded-lg
              p-3
              mb-4
            "
          />

          {error && <div className="mb-4 text-red-400">{error}</div>}

          <button
            onClick={joinSession}
            disabled={joining}
            className="
              bg-blue-600
              px-6
              py-3
              rounded-lg
              font-semibold
              w-full
            "
          >
            {joining ? "Joining..." : "Join Session"}
          </button>
        </div>
      )}

      {/* AFTER JOINING */}

      {videoToken && (
        <>
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Customer Support Session</h1>

            <p className="text-slate-400">Connected to Session #{sessionId}</p>
          </div>

          <div className="bg-slate-800 rounded-2xl p-4 mb-6">
            <VideoRoom token={videoToken} />
          </div>

          <div className="bg-slate-800 rounded-2xl p-4">
            <h2 className="text-xl font-semibold mb-4">Chat</h2>

            <Chat sessionId={sessionId} userId={4} />
          </div>
        </>
      )}
    </div>
  );
}
