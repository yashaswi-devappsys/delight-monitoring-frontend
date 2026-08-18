// src/redux/store.ts

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/auth/authSlice";
import dashboardReducer from "./slice/dashboard/dashboardSlice";
import userReducer from "./slice/user/userSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
