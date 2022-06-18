import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../slices/userSlice";
import playbackReducer from "../slices/playbackSlice";

export const store = configureStore({
  reducer: {
    playback: playbackReducer,
    user: userReducer,
  },
});

export type storeStateT = ReturnType<typeof store.getState>;
export type storeDispatchT = typeof store.dispatch;
