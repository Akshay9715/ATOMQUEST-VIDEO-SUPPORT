import { useState } from "react";
import axios from "axios";

import VideoRoom from "../components/VideoRoom";
import Chat from "../components/Chat";
import Recorder from "../components/Recorder";
import RecordingList from "../components/RecordingList";

export default function AgentPage() {
  const [agentId, setAgentId] = useState("");

  const [existingSessionId, setExistingSessionId] = useState("");

  const [sessionId, setSessionId] = useState(null);

  const [inviteToken, setInviteToken] = useState("");

  const [videoToken, setVideoToken] = useState(null);

  const createSession = async () => {
    try {
      if (!agentId) {
        alert("Enter Agent ID");
        return;
      }

      const response = await axios.post("http://localhost:8000/sessions", {
        agent_id: Number(agentId),
      });

      setSessionId(response.data.id);

      setInviteToken(response.data.invite_token);

      alert("Session created successfully");
    } catch (error) {
      console.error(error);
      alert("Failed to create session");
    }
  };

  const loadExistingSession = async () => {
    try {
      if (!existingSessionId) {
        alert("Enter Session ID");
        return;
      }

      const response = await axios.get(
        `http://localhost:8000/sessions/${existingSessionId}`,
      );

      setSessionId(response.data.id);

      setInviteToken(response.data.invite_token);

      alert("Session loaded");
    } catch (error) {
      console.error(error);

      alert("Session not found");
    }
  };

  const joinCall = async () => {
    try {
      const response = await axios.post("http://localhost:8000/video/token", {
        user_id: Number(agentId),
        session_id: sessionId,
      });

      setVideoToken(response.data.token);
    } catch (error) {
      console.error(error);

      alert("Failed to join call");
    }
  };

  const endSession = async () => {
    try {
      await axios.post(`http://localhost:8000/sessions/${sessionId}/end`);

      alert("Session Ended");

      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Agent Support Console</h1>

        <p className="text-slate-400">Live customer support session</p>
      </div>

      {!sessionId && (
        <div className="bg-slate-800 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold mb-6">Agent Setup</h2>

          <input
            type="number"
            placeholder="Agent ID"
            value={agentId}
            onChange={(e) => setAgentId(e.target.value)}
            className="
              w-full
              bg-slate-700
              rounded
              p-3
              mb-4
            "
          />

          <button
            onClick={createSession}
            className="
              bg-blue-600
              hover:bg-blue-700
              px-6
              py-3
              rounded-lg
              font-semibold
              mr-4
            "
          >
            Create Session
          </button>

          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-3">
              Join Existing Session
            </h3>

            <input
              type="number"
              placeholder="Session ID"
              value={existingSessionId}
              onChange={(e) => setExistingSessionId(e.target.value)}
              className="
                w-full
                bg-slate-700
                rounded
                p-3
                mb-4
              "
            />

            <button
              onClick={loadExistingSession}
              className="
                bg-purple-600
                hover:bg-purple-700
                px-6
                py-3
                rounded-lg
                font-semibold
              "
            >
              Load Session
            </button>
          </div>
        </div>
      )}

      {sessionId && !videoToken && (
        <div className="bg-slate-800 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold mb-4">Session Ready</h2>

          <p className="mb-3">
            Session ID:
            <span className="font-bold ml-2">{sessionId}</span>
          </p>

          <p className="mb-6 break-all">
            Invite Token:
            <span className="font-bold ml-2">{inviteToken}</span>
          </p>

          <button
            onClick={joinCall}
            className="
              bg-green-600
              hover:bg-green-700
              px-6
              py-3
              rounded-lg
              font-semibold
            "
          >
            Join Call
          </button>
        </div>
      )}

      {videoToken && (
        <>
          <div className="bg-slate-800 rounded-2xl p-4 mb-6">
            <div className="mb-4">
              <p>
                Session ID:
                <span className="font-bold ml-2">{sessionId}</span>
              </p>

              <p className="break-all">
                Invite Token:
                <span className="font-bold ml-2">{inviteToken}</span>
              </p>

              <button
                onClick={endSession}
                className="
                  mt-3
                  bg-red-600
                  hover:bg-red-700
                  px-4
                  py-2
                  rounded
                "
              >
                End Session
              </button>
            </div>

            <VideoRoom token={videoToken} />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-slate-800 rounded-2xl p-4">
              <h2 className="text-xl font-semibold mb-4">Chat</h2>

              <Chat sessionId={sessionId} userId={Number(agentId)} />
            </div>

            <div className="bg-slate-800 rounded-2xl p-4">
              <h2 className="text-xl font-semibold mb-4">Session Resources</h2>

              <Recorder sessionId={sessionId} />

              <RecordingList sessionId={sessionId} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
