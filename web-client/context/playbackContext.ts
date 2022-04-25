import { createContext, Dispatch, SetStateAction } from "react";

export interface playbackContextStateI {
  isPlaying: boolean;
  playbackId: string | null;
}

export interface playbackContextI {
  playbackContext: playbackContextStateI;
  setPlaybackContext: Dispatch<SetStateAction<playbackContextStateI>>;
}

// @ts-ignore
const PlaybackContext = createContext<playbackContextI>(null);
export default PlaybackContext;
