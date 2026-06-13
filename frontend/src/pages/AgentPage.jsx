import { useState } from "react";
import axios from "axios";

import VideoRoom from "../components/VideoRoom";
import Chat from "../components/Chat";
import Recorder from "../components/Recorder";
import RecordingList from "../components/RecordingList";

export default function AgentPage() {
  const [sessionId, setSessionId] = useState(null);
  const [inviteToken, setInviteToken] = useState("");
  const [videoToken, setVideoToken] = useState(null);

  const createSession = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/sessions",
        {
          agent_id: 1,
        }
      );

      setSessionId(response.data.id);
      setInviteToken(response.data.invite_token);

      alert("Session created successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to create session");
    }
  };

  const joinCall = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/video/token",
        {
          user_id: 1,
          session_id: sessionId,
        }
      );

      setVideoToken(response.data.token);
    } catch (error) {
      console.error(error);
      alert("Failed to join call");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">

      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          Agent Support Console
        </h1>

        <p className="text-slate-400">
          Live customer support session
        </p>
      </div>

      {/* BEFORE SESSION CREATION */}

      {!sessionId && (
        <div className="bg-slate-800 rounded-2xl p-8">

          <h2 className="text-2xl font-semibold mb-4">
            Create New Support Session
          </h2>

          <button
            onClick={createSession}
            className="
              bg-blue-600
              px-6
              py-3
              rounded-lg
              font-semibold
            "
          >
            Create Session
          </button>

        </div>
      )}

      {/* AFTER SESSION CREATION */}

      {sessionId && !videoToken && (
        <div className="bg-slate-800 rounded-2xl p-8">

          <h2 className="text-2xl font-semibold mb-4">
            Session Created
          </h2>

          <p className="mb-4">
            Session ID:
            <span className="font-bold ml-2">
              {sessionId}
            </span>
          </p>

          <p className="mb-6 break-all">
            Invite Token:
            <span className="font-bold ml-2">
              {inviteToken}
            </span>
          </p>

          <button
            onClick={joinCall}
            className="
              bg-green-600
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

      {/* AFTER JOINING CALL */}

      {videoToken && (
        <>
          <div className="bg-slate-800 rounded-2xl p-4 mb-6">

            <div className="mb-4">
              <p>
                Session ID:
                <span className="font-bold ml-2">
                  {sessionId}
                </span>
              </p>

              <p className="break-all">
                Invite Token:
                <span className="font-bold ml-2">
                  {inviteToken}
                </span>
              </p>
            </div>

            <VideoRoom token={videoToken} />
          </div>

          <div className="grid grid-cols-2 gap-6">

            <div className="bg-slate-800 rounded-2xl p-4">

              <h2 className="text-xl font-semibold mb-4">
                Chat
              </h2>

              <Chat
                sessionId={sessionId}
                userId={1}
              />

            </div>

            <div className="bg-slate-800 rounded-2xl p-4">

              <h2 className="text-xl font-semibold mb-4">
                Session Resources
              </h2>

              <Recorder
                sessionId={sessionId}
              />

              <RecordingList
                sessionId={sessionId}
              />

            </div>

          </div>
        </>
      )}

    </div>
  );
}