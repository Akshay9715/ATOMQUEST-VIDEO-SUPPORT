import { useEffect, useState } from "react";
import axios from "axios";

import VideoRoom from "../components/VideoRoom";
import Chat from "../components/Chat";
import Recorder from "../components/Recorder";
import RecordingList from "../components/RecordingList";

export default function AgentPage() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    fetchToken();
  }, []);

  const fetchToken = async () => {
    try {
      const response = await axios.post("http://localhost:8000/video/token", {
        user_id: 1,
        session_id: 1,
      });

      setToken(response.data.token);
    } catch (error) {
      console.error(error);
    }
  };

  if (!token) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Agent Support Console</h1>

        <p className="text-slate-400">Live customer support session</p>
      </div>

      <div className="bg-slate-800 rounded-2xl p-4 mb-6">
        <VideoRoom token={token} />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-slate-800 rounded-2xl p-4">
          <h2 className="text-xl font-semibold mb-4">Chat</h2>

          <Chat sessionId={1} userId={1} />
        </div>

        <div className="bg-slate-800 rounded-2xl p-4">
          <h2 className="text-xl font-semibold mb-4">Session Resources</h2>

          <Recorder />

          <RecordingList />
        </div>
      </div>
    </div>
  );
}
