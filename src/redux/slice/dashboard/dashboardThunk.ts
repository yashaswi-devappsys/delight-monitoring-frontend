import { createAsyncThunk } from "@reduxjs/toolkit";
import type { DashboardKpiCard, DashboardKpiQuery } from "./dashboardType";

// Replace this list with the dashboard service response when the API is ready.
const mockDashboardKpis: DashboardKpiCard[] = [
  { id: "total-live-orders", title: "Total Live Orders", count: 247, percentage: 100, icon: "total-orders", accent: "total" },
  { id: "stock-lens", title: "Stock Lens", count: 58, percentage: 24, icon: "stock-lens", accent: "stock" },
  { id: "prescription-lens", title: "Prescription Lens", count: 42, percentage: 17, icon: "prescription-lens", accent: "prescription" },
  { id: "iopl-lab", title: "IOPL Lab", count: 19, percentage: 8, icon: "lab", accent: "iopl" },
  { id: "rakesh-opticians-lab", title: "Rakesh Opticians Lab", count: 14, percentage: 6, icon: "optician", accent: "optician" },
  { id: "suprol", title: "Suprol", count: 21, percentage: 9, icon: "suprol", accent: "suprol" },
  { id: "trading-techtran", title: "Trading - Techtran", count: 18, percentage: 7, icon: "techtran", accent: "techtran" },
  { id: "trading-tokorx", title: "Trading - TokoRx", count: 16, percentage: 7, icon: "tokorx", accent: "tokorx" },
  { id: "trading-yash", title: "Trading - Yash", count: 12, percentage: 4, icon: "yash", accent: "yash" },
  { id: "trading-lens-china", title: "Trading Lens - China", count: 25, percentage: 10, icon: "china", accent: "china" },
  { id: "trading-lens-global", title: "Trading Lens - Global", count: 22, percentage: 8, icon: "global", accent: "global" },
];

export const fetchDashboardKpis = createAsyncThunk<
  DashboardKpiCard[],
  DashboardKpiQuery,
  { rejectValue: string }
>("dashboard/fetchKpis", async ({ orderDate }, { rejectWithValue }) => {
  try {
    // Later: return await DashboardService.getLiveOrderKpis({ orderDate });
    void orderDate;
    return await Promise.resolve(mockDashboardKpis);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load live order counts";
    return rejectWithValue(message);
  }
});
