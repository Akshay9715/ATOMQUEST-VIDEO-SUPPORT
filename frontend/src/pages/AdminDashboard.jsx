import { useEffect, useState } from "react";

import axios from "axios";

export default function AdminDashboard() {
  const [overview, setOverview] = useState(null);

  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    loadDashboard();
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
    <div>
      <h1>Admin Dashboard</h1>

      <h3>
        Total Sessions:
        {overview.total_sessions}
      </h3>

      <h3>
        Active Sessions:
        {overview.active_sessions}
      </h3>

      <h3>
        Participants:
        {overview.participants}
      </h3>

      <hr />

      <h2>Sessions</h2>

      {sessions.map((session) => (
        <div key={session.id}>
          Session #{session.id}
          {" | "}
          {session.status}
        </div>
      ))}
    </div>
  );
}
