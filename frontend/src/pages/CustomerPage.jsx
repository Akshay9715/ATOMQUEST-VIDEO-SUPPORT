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
    <>
      <VideoRoom token={token} />
      <Chat sessionId={1} userId={2} />
    </>
  );
}
