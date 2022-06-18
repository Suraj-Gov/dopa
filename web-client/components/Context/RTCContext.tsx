import { createContext } from "react";

export const serverConfig = {
  iceServers: [
    {
      urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
    },
  ],
  iceCandidatePoolSize: 10,
};

const RTCContext = createContext(
  null as null | {
    pConn: RTCPeerConnection | null;
    localStream: MediaStreamTrack | null;
    remoteStream: MediaStreamTrack | null;
  }
);

export default RTCContext;
