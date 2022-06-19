export type googleIdentityData = {
  avatar_url: string;
  email: string;
  full_name: string;
  picture: string;
};

export type Player = {
  id: string;
  last_seen?: Date;
  playback_id?: string;
  listen_to?: string;
};

export type Users = {
  id: string;
  // details: User;
};
