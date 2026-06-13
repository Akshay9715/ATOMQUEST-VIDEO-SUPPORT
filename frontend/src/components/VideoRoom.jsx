import { LiveKitRoom, VideoConference } from "@livekit/components-react";

import "../../node_modules/@livekit/components-styles/dist/general/index.css";

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
