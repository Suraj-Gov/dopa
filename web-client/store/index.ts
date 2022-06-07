import { configureStore } from "@reduxjs/toolkit";
import playbackReducer from "../slices/playbackSlice";

export const playbackStore = configureStore({
  reducer: {
    playback: playbackReducer,
  },
});

export type playbackStoreStateT = ReturnType<typeof playbackStore.getState>;
export type playbackStoreDispatchT = typeof playbackStore.dispatch;
