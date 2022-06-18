import { User } from "@supabase/supabase-js";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialUserState = {
  user: null as User | null,
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
  },
});

export const userActions = userSlice.actions;
export default userSlice.reducer;
