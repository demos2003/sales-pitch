import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  user: any | null;
  token: string | null;
  isAuthenticated: boolean;
}

/** Get token from sessionStorage first (session-only), then localStorage (remember me). */
export const getStoredToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem("token") || localStorage.getItem("token");
};

/** Get user from the same storage as token: session first, then local. */
export const getStoredUser = (): any | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem("user") || localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    console.error("Invalid user data in storage:", err);
    sessionStorage.removeItem("user");
    localStorage.removeItem("user");
    return null;
  }
};

const initialState: AuthState = {
  user: getStoredUser(),
  token: getStoredToken(),
  isAuthenticated: typeof window !== "undefined" ? !!getStoredToken() : false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: any; token: string; remember?: boolean }>
    ) => {
      const { user, token, remember = true } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;

      if (remember) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
      } else {
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("user", JSON.stringify(user));
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;