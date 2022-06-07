import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialPlaybackState = {
  current: null as string | null,
  playbackIdArr: [] as string[],
  isPlaying: false,
  playSource: null as string | null,
};

export const playbackActionTypes = {
  PLAY_NOW: "PLAY_NOW",
};

export type playbackStateT = typeof initialPlaybackState;

export const playbackSlice = createSlice({
  name: "playback",
  initialState: initialPlaybackState,
  reducers: {
    // https://stackoverflow.com/questions/53662208/types-from-both-keys-and-values-of-object-in-typescript
    unqueue: (state, action: PayloadAction<boolean | undefined>) => {
      const [firstItem, ...rest] = state.playbackIdArr;
      if (action.payload) {
        state.current = firstItem;
        state.isPlaying = true;
      }
      state.playbackIdArr = rest ?? [];
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
