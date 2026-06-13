import { useRef } from "react";
import axios from "axios";

export default function Recorder() {

  const mediaRecorderRef =
    useRef(null);

  const chunksRef =
    useRef([]);

  const startRecording =
    async () => {

      const stream =
        await navigator.mediaDevices
          .getDisplayMedia({
            video: true,
            audio: true,
          });

      const recorder =
        new MediaRecorder(
          stream
        );

      mediaRecorderRef.current =
        recorder;

      chunksRef.current = [];

      recorder.ondataavailable =
        (event) => {

          if (
            event.data.size > 0
          ) {
            chunksRef.current.push(
              event.data
            );
          }
        };

      recorder.start();
    };

  const stopRecording =
    async () => {

      const recorder =
        mediaRecorderRef.current;

      recorder.stop();

      recorder.onstop =
        async () => {

          const blob =
            new Blob(
              chunksRef.current,
              {
                type:
                  "video/webm",
              }
            );

          const formData =
            new FormData();

          formData.append(
            "file",
            blob,
            "meeting.webm"
          );

          await axios.post(
            "http://localhost:8000/recordings/upload?session_id=1",
            formData
          );

          alert(
            "Recording Uploaded"
          );
        };
    };

      return (
    <div>

      <button
        onClick={
          startRecording
        }
      >
        Start Recording
      </button>

      <button
        onClick={
          stopRecording
        }
      >
        Stop Recording
      </button>

    </div>
  );
}