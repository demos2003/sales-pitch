import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./apiSlice";
import authReducer, { AuthState } from "./features/auth/authSlice"
import { projectsStateReducer } from "./features/projects/projectsSlice";

export interface RootState {
  auth: AuthState;
  projectsState: any;
  [apiSlice.reducerPath]: ReturnType<typeof apiSlice.reducer>;
}

export const store = configureStore({
  reducer: {
    auth: authReducer,
    projectsState: projectsStateReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export type AppDispatch = typeof store.dispatch;

