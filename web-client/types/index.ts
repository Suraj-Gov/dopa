import { User } from "firebase/auth";

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
