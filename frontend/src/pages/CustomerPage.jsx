import { useState } from "react";
import axios from "axios";

import VideoRoom from "../components/VideoRoom";
import Chat from "../components/Chat";

export default function CustomerPage() {
  const [customerId, setCustomerId] = useState("");

  const [inviteToken, setInviteToken] = useState("");

  const [sessionId, setSessionId] = useState(null);

  const [videoToken, setVideoToken] = useState(null);

  const [error, setError] = useState("");

  const [joining, setJoining] = useState(false);

  const joinSession = async () => {
    if (!customerId.trim()) {
      setError("Please enter Customer ID");
      return;
    }

    if (!inviteToken.trim()) {
      setError("Please enter Invite Token");
      return;
    }

    try {
      setJoining(true);
      setError("");

      const joinResponse = await axios.post(
        "http://localhost:8000/participants/join",
        {
          user_id: Number(customerId),
          invite_token: inviteToken,
        },
      );

      const joinedSessionId = joinResponse.data.session_id;

      setSessionId(joinedSessionId);

      const videoResponse = await axios.post(
        "http://localhost:8000/video/token",
        {
          user_id: Number(customerId),
          session_id: joinedSessionId,
        },
      );

      setVideoToken(videoResponse.data.token);
    } catch (error) {
      console.error(error);

      setError("Invalid Invite Token or Customer ID");
    } finally {
      setJoining(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      {!videoToken && (
        <div className="max-w-xl mx-auto mt-20 bg-slate-800 rounded-2xl p-8">
          <h1 className="text-3xl font-bold mb-2">Customer Support Session</h1>

          <p className="text-slate-400 mb-6">
            Enter your Customer ID and Invite Token provided by the support
            agent.
          </p>

          <input
            type="number"
            placeholder="Customer ID"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
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

          <input
            type="text"
            placeholder="Invite Token"
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
              hover:bg-blue-700
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

      {videoToken && (
        <>
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Customer Support Session</h1>

            <p className="text-slate-400">Connected to Session #{sessionId}</p>

            <p className="text-slate-400">
              Customer ID:
              <span className="font-bold ml-2">{customerId}</span>
            </p>
          </div>

          <div className="bg-slate-800 rounded-2xl p-4 mb-6">
            <VideoRoom token={videoToken} />
          </div>

          <div className="bg-slate-800 rounded-2xl p-4">
            <h2 className="text-xl font-semibold mb-4">Chat</h2>

            <Chat sessionId={sessionId} userId={Number(customerId)} />
          </div>
        </>
      )}
    </div>
  );
}
