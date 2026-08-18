// src/redux/store.ts

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/auth/authSlice";
import dashboardReducer from "./slice/dashboard/dashboardSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
