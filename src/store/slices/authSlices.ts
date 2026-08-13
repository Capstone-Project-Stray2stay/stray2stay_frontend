import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  authorized: boolean;
  firstname: string | null;
  coverImage: string | null;
}

const initialState: AuthState = {
  authorized: false,
  firstname: null,
  coverImage: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth(
      state,
      action: PayloadAction<{ authorized: boolean; firstname: string; coverImage: string | null }>
    ) {
      state.authorized = action.payload.authorized;
      state.firstname = action.payload.firstname;
      state.coverImage = action.payload.coverImage;
    },
    logout(state) {
      state.authorized = false;
      state.firstname = null;
      state.coverImage = null;
    },
  },
});

export const { setAuth, logout } = authSlice.actions;
export default authSlice.reducer;