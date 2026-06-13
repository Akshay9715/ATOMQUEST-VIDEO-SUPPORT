import { useEffect, useState } from "react";

import axios from "axios";

export default function AdminDashboard() {
  const [overview, setOverview] = useState(null);

  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    loadDashboard();

    const interval = setInterval(loadDashboard, 5000);

    return () => clearInterval(interval);
  }, []);

  const loadDashboard = async () => {
    const overviewResponse = await axios.get(
      "http://localhost:8000/admin/overview",
    );

    const sessionsResponse = await axios.get("http://localhost:8000/sessions");

    setOverview(overviewResponse.data);

    setSessions(sessionsResponse.data);
  };

  if (!overview) {
    return <div>Loading...</div>;
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
        <div className="bg-slate-800 rounded-2xl p-6 shadow-lg">
          <h2 className="text-slate-400 text-sm uppercase">Total Sessions</h2>

          <p className="text-5xl font-bold mt-2">{overview.total_sessions}</p>
        </div>

        <div className="bg-slate-800 p-4 rounded-xl">
          <h2 className="text-slate-400 text-sm uppercase">Active Sessions</h2>
          <p className="text-5xl font-bold mt-2">{overview.active_sessions}</p>
        </div>

        <div className="bg-slate-800 p-4 rounded-xl">
          <h2 className="text-slate-400 text-sm uppercase">Participants</h2>
          <p className="text-5xl font-bold mt-2">{overview.participants}</p>
        </div>
      </div>

      <hr />

      <h2>Sessions</h2>

      <div className="bg-slate-800 rounded-2xl p-6 shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Session History</h2>

        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left py-3">Session</th>
              <th className="text-left py-3">Status</th>
              <th className="text-left py-3">Agent</th>
            </tr>
          </thead>

          <tbody>
            {sessions.map((session) => (
              <tr key={session.id} className="border-b border-slate-700">
                <td className="py-4">#{session.id}</td>
                <td className="py-4">
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
