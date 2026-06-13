import { useEffect, useState } from "react";
import axios from "axios";

import VideoRoom from "../components/VideoRoom";
import Chat from "../components/Chat";

export default function CustomerPage() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    fetchToken();
  }, []);

  const fetchToken = async () => {
    try {
      const response = await axios.post("http://localhost:8000/video/token", {
        user_id: 2,
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
        <h1 className="text-3xl font-bold">Customer Support Session</h1>
      </div>

      <div className="bg-slate-800 rounded-2xl p-4 mb-6">
        <VideoRoom token={token} />
      </div>

      <div className="bg-slate-800 rounded-2xl p-4">
        <Chat sessionId={1} userId={2} />
      </div>
    </div>
  );
}
