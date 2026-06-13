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
    <>
      <VideoRoom token={token} />
      <Recorder />

      <RecordingList />

      <Chat sessionId={1} userId={1} />
    </>
  );
}
