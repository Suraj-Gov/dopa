import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "firebase/auth";

const initialUserState = {
  user: null as User | null,
  rUser: null as User | null,
};

export type userStateT = typeof initialUserState;

export const userSlice = createSlice({
  name: "user",
  initialState: initialUserState,
  reducers: {
    onLogin: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    onLogout: (state) => {
      state.user = null;
    },
    setRUser: (state, action: PayloadAction<User>) => {
      state.rUser = action.payload;
    },
  },
});

export const userActions = userSlice.actions;
export default userSlice.reducer;
