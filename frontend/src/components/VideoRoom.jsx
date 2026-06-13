import { LiveKitRoom, VideoConference } from "@livekit/components-react";

export default function VideoRoom({ token }) {
  return (
    <LiveKitRoom
      token={token}
      serverUrl="ws://localhost:7880"
      connect={true}
      audio={true}
      video={true}
    >
      <VideoConference />
    </LiveKitRoom>
  );
}
