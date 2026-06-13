import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:8000");

export default function Chat({
  sessionId,
  userId,
}) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {

    socket.emit("join_room", {
      session_id: sessionId,
    });

    socket.on(
      "new_message",
      (data) => {
        setMessages((prev) => [
          ...prev,
          data,
        ]);
      }
    );

    return () => {
      socket.off("new_message");
    };

  }, [sessionId]);

  const sendMessage = () => {

    if (!message.trim()) return;

    socket.emit(
      "send_message",
      {
        session_id: sessionId,
        sender_id: userId,
        message,
      }
    );

    setMessage("");
  };

  return (
    <div>

      <h3>Chat</h3>

      <div
        style={{
          height: "200px",
          overflowY: "scroll",
          border: "1px solid black",
          padding: "10px",
        }}
      >
        {messages.map((msg, index) => (
          <div key={index}>
            <b>{msg.sender_id}</b>:
            {" "}
            {msg.message}
          </div>
        ))}
      </div>

      <input
        value={message}
        onChange={(e) =>
          setMessage(e.target.value)
        }
      />

      <button onClick={sendMessage}>
        Send
      </button>

    </div>
  );
}