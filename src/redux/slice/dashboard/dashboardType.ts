export type DashboardKpiIcon =
  | "total-orders"
  | "stock-lens"
  | "prescription-lens"
  | "lab"
  | "optician"
  | "suprol"
  | "techtran"
  | "tokorx"
  | "yash"
  | "china"
  | "global";

export type DashboardKpiStatus = "neutral" | "healthy" | "attention";
export type DashboardKpiAccent =
  | "total"
  | "stock"
  | "prescription"
  | "iopl"
  | "optician"
  | "suprol"
  | "techtran"
  | "tokorx"
  | "yash"
  | "china"
  | "global";

export interface DashboardKpiCard {
  id: string;
  title: string;
  count: number;
  icon: DashboardKpiIcon;
  accent: DashboardKpiAccent;
  percentage?: number;
  status?: DashboardKpiStatus;
}

export interface DashboardKpiQuery {
  orderDate: string;
}

export interface DashboardState {
  kpis: DashboardKpiCard[];
  isLoading: boolean;
  hasLoaded: boolean;
  lastUpdated: string | null;
  error: string | null;
}
