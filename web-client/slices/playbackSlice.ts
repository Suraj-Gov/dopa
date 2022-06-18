import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialPlaybackState = {
  current: null as string | null,
  playbackIdArr: [] as string[],
  isPlaying: false,
  playSource: null as string | null,
  songQueuePos: 0,
};

export const playbackActionTypes = {
  PLAY_NOW: "PLAY_NOW",
};

export type playbackStateT = typeof initialPlaybackState;

export const playbackSlice = createSlice({
  name: "playback",
  initialState: initialPlaybackState,
  reducers: {
    audioLoaded: (state) => {
      state.isPlaying = true;
    },
    play: (
      state,
      action: PayloadAction<
        | {
            offset: number;
            atIdx?: number;
          }
        | undefined
      >
    ) => {
      state.isPlaying = false;
      const newSongQueuePos =
        (action.payload?.atIdx ?? state.songQueuePos) +
        (action.payload?.offset ?? 0);

      const item = state.playbackIdArr[newSongQueuePos];
      if (!item) {
        state = initialPlaybackState;
      } else {
        state.songQueuePos = newSongQueuePos;
        state.current = item ?? null;
      }
    },
    enqueue: (state, action: PayloadAction<string>) => {
      state.playbackIdArr.splice(state.songQueuePos, 0, action.payload);
    },
    setQueue: (
      state,
      action: PayloadAction<
        {
          sourceId: string;
          songs: string[];
        },
        string
      >
    ) => {
      state.playbackIdArr = action.payload.songs;
      state.playSource = action.payload.sourceId;
    },
    toggle: (state, action: PayloadAction<boolean | undefined>) => {
      if (typeof action.payload === "boolean") {
        state.isPlaying = action.payload;
      } else {
        state.isPlaying = !state.isPlaying;
      }
    },
  },
});

export const playbackActions = playbackSlice.actions;

export default playbackSlice.reducer;
