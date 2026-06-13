import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";
const socket = io("http://localhost:8000");

export default function Chat({ sessionId, userId }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    socket.emit("join_room", {
      session_id: sessionId,
    });

    socket.on("new_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("new_message");
    };
  }, [sessionId]);

  const sendMessage = () => {
    if (!message.trim()) return;

    socket.emit("send_message", {
      session_id: sessionId,
      sender_id: userId,
      message,
    });

    setMessage("");
  };
  const uploadFile = async () => {
    if (!selectedFile) return;

    const formData = new FormData();

    formData.append("file", selectedFile);

    const response = await axios.post(
      `http://localhost:8000/files/upload?session_id=${sessionId}&sender_id=${userId}`,
      formData,
    );

    socket.emit("send_message", {
      session_id: sessionId,
      sender_id: userId,
      message: `[FILE]${response.data.id}:${response.data.filename}`,
    });
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
            <b>{msg.sender_id}</b>:{" "}
            {msg.message.startsWith("[FILE]")
              ? (() => {
                  const fileInfo = msg.message.replace("[FILE]", "");

                  const [fileId, filename] = fileInfo.split(":");

                  return (
                    <a
                      href={`http://localhost:8000/files/${fileId}`}
                      target="_blank"
                    >
                      📎 {filename}
                    </a>
                  );
                })()
              : msg.message}
          </div>
        ))}
      </div>

      <input value={message} onChange={(e) => setMessage(e.target.value)} />
      <input type="file" onChange={(e) => setSelectedFile(e.target.files[0])} />
      <button onClick={uploadFile}>Upload File</button>

      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
