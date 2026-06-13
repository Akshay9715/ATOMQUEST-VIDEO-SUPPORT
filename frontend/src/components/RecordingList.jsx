import { useEffect, useState } from "react";
import axios from "axios";

export default function RecordingList() {
  const [recordings, setRecordings] = useState([]);

  useEffect(() => {
    loadRecordings();
  }, []);

  const loadRecordings = async () => {
    const response = await axios.get(
      "http://localhost:8000/recordings/session/1",
    );

    setRecordings(response.data);
  };

  return (
    <div>
      <h3>Recordings</h3>

      {recordings.map((recording) => (
        <div key={recording.id}>
          Recording #{recording.id}
          <a
            href={`http://localhost:8000/recordings/${recording.id}`}
            target="_blank"
          >
            Download
          </a>
        </div>
      ))}
    </div>
  );
}
