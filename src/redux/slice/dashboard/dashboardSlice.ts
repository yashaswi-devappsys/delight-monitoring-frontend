import { createSlice } from "@reduxjs/toolkit";
import { fetchDashboardKpis } from "./dashboardThunk";
import type { DashboardState } from "./dashboardType";

const initialState: DashboardState = {
  kpis: [],
  isLoading: false,
  hasLoaded: false,
  lastUpdated: null,
  error: null,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    clearDashboardError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardKpis.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDashboardKpis.fulfilled, (state, action) => {
        state.kpis = action.payload;
        state.isLoading = false;
        state.hasLoaded = true;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchDashboardKpis.rejected, (state, action) => {
        state.isLoading = false;
        state.hasLoaded = true;
        state.error = action.payload ?? action.error.message ?? "Unable to load live order counts";
      });
  },
});

export const { clearDashboardError } = dashboardSlice.actions;
export default dashboardSlice.reducer;
