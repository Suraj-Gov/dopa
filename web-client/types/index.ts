import { User } from "firebase/auth";
import Peer from "peerjs";

export type googleIdentityData = {
  avatar_url: string;
  email: string;
  full_name: string;
  picture: string;
};

export type Users = {
  id: string;
  last_seen?: Date;
  playback_id?: string;
  listen_to?: string[];
  listeners?: string[];
  userData: User;
};

export type playbackPayloadDataT = {
  id?: string | null;
  tz: number;
  isPlaying: boolean;
  uid?: string;
};

export type StreamPayloadT = {
  message: "init";
  playbackPayloadData: playbackPayloadDataT;
};

export interface PeerJS extends Peer {}
