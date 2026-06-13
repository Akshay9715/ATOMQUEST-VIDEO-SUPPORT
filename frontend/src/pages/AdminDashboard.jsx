import { useEffect, useState, useRef } from "react";
import axios from "axios";

export default function AdminDashboard() {
  const [overview, setOverview] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [users, setUsers] = useState([]);

  const [selectedSession, setSelectedSession] = useState(null);

  const [chatHistory, setChatHistory] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [recordings, setRecordings] = useState([]);

  const detailsRef = useRef(null);

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "customer",
  });

  useEffect(() => {
    loadDashboard();

    const interval = setInterval(loadDashboard, 5000);

    return () => clearInterval(interval);
  }, []);

  const loadDashboard = async () => {
    try {
      const [overviewResponse, sessionsResponse, usersResponse] =
        await Promise.all([
          axios.get("http://localhost:8000/admin/overview"),
          axios.get("http://localhost:8000/sessions"),
          axios.get("http://localhost:8000/users"),
        ]);

      setOverview(overviewResponse.data);
      setSessions(sessionsResponse.data);
      setUsers(usersResponse.data);
    } catch (error) {
      console.error(error);
    }
  };

  const createUser = async () => {
    try {
      await axios.post("http://localhost:8000/users", newUser);

      alert("User created successfully");

      setNewUser({
        name: "",
        email: "",
        role: "customer",
      });

      loadDashboard();
    } catch (error) {
      console.error(error);
      alert("Failed to create user");
    }
  };

  const loadSessionDetails = async (sessionId) => {
    try {
      setSelectedSession(sessionId);

      const [chatResponse, participantResponse, recordingResponse] =
        await Promise.all([
          axios.get(`http://localhost:8000/chat/${sessionId}`),
          axios.get(`http://localhost:8000/participants/session/${sessionId}`),
          axios.get(`http://localhost:8000/recordings/session/${sessionId}`),
        ]);

      setChatHistory(chatResponse.data);
      setParticipants(participantResponse.data);
      setRecordings(recordingResponse.data);

      setTimeout(() => {
        detailsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    } catch (error) {
      console.error(error);
    }
  };

  if (!overview) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Admin Dashboard</h1>

        <p className="text-slate-400 mt-2">
          Real-Time Support Platform Monitoring
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-slate-800 rounded-2xl p-6">
          <h2 className="text-slate-400 text-sm uppercase">Total Sessions</h2>

          <p className="text-5xl font-bold mt-2">{overview.total_sessions}</p>
        </div>

        <div className="bg-slate-800 rounded-2xl p-6">
          <h2 className="text-slate-400 text-sm uppercase">Active Sessions</h2>

          <p className="text-5xl font-bold mt-2">{overview.active_sessions}</p>
        </div>

        <div className="bg-slate-800 rounded-2xl p-6">
          <h2 className="text-slate-400 text-sm uppercase">Participants</h2>

          <p className="text-5xl font-bold mt-2">{overview.participants}</p>
        </div>
      </div>

      <div className="bg-slate-800 rounded-2xl p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Session History</h2>

        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left py-3">Session</th>

              <th className="text-left py-3">Status</th>

              <th className="text-left py-3">Agent</th>

              <th className="text-left py-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {sessions.map((session) => (
              <tr key={session.id} className="border-b border-slate-700">
                <td className="py-4">#{session.id}</td>

                <td>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      session.status === "active"
                        ? "bg-green-600"
                        : "bg-red-600"
                    }`}
                  >
                    {session.status}
                  </span>
                </td>

                <td>{session.agent_id}</td>

                <td>
                  <button
                    onClick={() => loadSessionDetails(session.id)}
                    className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-slate-800 rounded-2xl p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Users</h2>

        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700">
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-slate-700">
                <td className="py-3">{user.id}</td>

                <td>{user.name}</td>

                <td>{user.email}</td>

                <td>{user.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-slate-800 rounded-2xl p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Create User</h2>

        <div className="flex flex-wrap gap-4">
          <input
            type="text"
            placeholder="Name"
            value={newUser.name}
            onChange={(e) =>
              setNewUser({
                ...newUser,
                name: e.target.value,
              })
            }
            className="bg-slate-700 p-2 rounded"
          />

          <input
            type="email"
            placeholder="Email"
            value={newUser.email}
            onChange={(e) =>
              setNewUser({
                ...newUser,
                email: e.target.value,
              })
            }
            className="bg-slate-700 p-2 rounded"
          />

          <select
            value={newUser.role}
            onChange={(e) =>
              setNewUser({
                ...newUser,
                role: e.target.value,
              })
            }
            className="bg-slate-700 p-2 rounded"
          >
            <option value="agent">Agent</option>

            <option value="customer">Customer</option>
          </select>

          <button
            onClick={createUser}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
          >
            Create User
          </button>
        </div>
      </div>

      {selectedSession && (
        <div ref={detailsRef} className="bg-slate-800 rounded-2xl p-6">
          <h2 className="text-3xl font-bold mb-6">
            Session #{selectedSession}
          </h2>

          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-3">Participants</h3>

            {participants.length === 0 ? (
              <p>No participants found</p>
            ) : (
              participants.map((participant) => (
                <div
                  key={participant.id}
                  className="border-b border-slate-700 py-2"
                >
                  User ID:
                  {participant.user_id}
                  <br />
                  Joined:
                  {participant.joined_at}
                  <br />
                  Left:
                  {participant.left_at || "Still Connected"}
                </div>
              ))
            )}
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-3">Recordings</h3>

            {recordings.length === 0 ? (
              <p>No recordings</p>
            ) : (
              recordings.map((recording) => (
                <div
                  key={recording.id}
                  className="border-b border-slate-700 py-3"
                >
                  <strong>Recording #{recording.id}</strong>
                  <br />
                  Status:
                  {recording.status}
                  <br />
                  <button
                    onClick={() =>
                      window.open(
                        `http://localhost:8000/recordings/${recording.id}`,
                        "_blank",
                      )
                    }
                    className="mt-2 bg-green-600 hover:bg-green-700 px-3 py-1 rounded"
                  >
                    Download Recording
                  </button>
                </div>
              ))
            )}
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Chat History</h3>

            <div className="max-h-96 overflow-y-auto">
              {chatHistory.length === 0 ? (
                <p>No messages</p>
              ) : (
                chatHistory.map((message) => (
                  <div
                    key={message.id}
                    className="border-b border-slate-700 py-3"
                  >
                    <strong>User {message.sender_id}</strong>

                    {message.message.startsWith("[FILE]") ? (
                      <div>
                        <p className="text-yellow-400">{message.message}</p>

                        <button
                          onClick={() => {
                            const fileId = message.message
                              .replace("[FILE]", "")
                              .split(":")[0];

                            window.open(
                              `http://localhost:8000/files/${fileId}`,
                              "_blank",
                            );
                          }}
                          className="mt-2 bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded"
                        >
                          Download File
                        </button>
                      </div>
                    ) : (
                      <p>{message.message}</p>
                    )}

                    <small className="text-slate-400">
                      {message.created_at}
                    </small>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
