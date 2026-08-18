import { useEffect, useState } from "react";
import {
  BarChart3, Boxes, CalendarDays, Clock3, Cpu, FlaskConical, Glasses, Globe2,
  PackageCheck, RefreshCw, ScanEye, Ship, ShoppingCart, Store,
  type LucideIcon,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../hooks/useRedux";
import { fetchDashboardKpis } from "../../redux/slice/dashboard/dashboardThunk";
import type {
  DashboardKpiAccent,
  DashboardKpiCard,
  DashboardKpiIcon,
} from "../../redux/slice/dashboard/dashboardType";
import { cn } from "../../lib/utils";
import { Skeleton } from "../ui/skeleton";

const iconRegistry: Record<DashboardKpiIcon, LucideIcon> = {
  "total-orders": BarChart3,
  "stock-lens": PackageCheck,
  "prescription-lens": Glasses,
  lab: FlaskConical,
  optician: Store,
  suprol: Boxes,
  techtran: Cpu,
  tokorx: ScanEye,
  yash: ShoppingCart,
  china: Ship,
  global: Globe2,
};

const countFormatter = new Intl.NumberFormat();

const getLocalDateValue = () => {
  const today = new Date();
  const localTime = new Date(today.getTime() - today.getTimezoneOffset() * 60_000);
  return localTime.toISOString().slice(0, 10);
};

const timeFormatter = new Intl.DateTimeFormat(undefined, {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

const accentStyles: Record<DashboardKpiAccent, string> = {
  total: "bg-[#EAF3FF] text-[#0068E8] dark:bg-primary/15 dark:text-primary",
  stock: "bg-[#E8F3FF] text-[#1677D2] dark:bg-muted dark:text-foreground",
  prescription: "bg-[#EDE9FE] text-[#7C3AED] dark:bg-muted dark:text-foreground",
  iopl: "bg-[#E0F2FE] text-[#0284C7] dark:bg-muted dark:text-foreground",
  optician: "bg-[#F3E8FF] text-[#9333EA] dark:bg-muted dark:text-foreground",
  suprol: "bg-[#DCFCE7] text-[#16A34A] dark:bg-muted dark:text-foreground",
  techtran: "bg-[#FEF3C7] text-[#D97706] dark:bg-muted dark:text-foreground",
  tokorx: "bg-[#FFEDD5] text-[#EA580C] dark:bg-muted dark:text-foreground",
  yash: "bg-[#CCFBF1] text-[#0F766E] dark:bg-muted dark:text-foreground",
  china: "bg-[#FCE7F3] text-[#DB2777] dark:bg-muted dark:text-foreground",
  global: "bg-[#E0E7FF] text-[#4F46E5] dark:bg-muted dark:text-foreground",
};

const accentBorderStyles: Record<DashboardKpiAccent, string> = {
  total: "border-l-[#0068E8] dark:border-l-primary",
  stock: "border-l-[#1677D2] dark:border-l-foreground",
  prescription: "border-l-[#7C3AED] dark:border-l-foreground",
  iopl: "border-l-[#0284C7] dark:border-l-foreground",
  optician: "border-l-[#9333EA] dark:border-l-foreground",
  suprol: "border-l-[#16A34A] dark:border-l-foreground",
  techtran: "border-l-[#D97706] dark:border-l-foreground",
  tokorx: "border-l-[#EA580C] dark:border-l-foreground",
  yash: "border-l-[#0F766E] dark:border-l-foreground",
  china: "border-l-[#DB2777] dark:border-l-foreground",
  global: "border-l-[#4F46E5] dark:border-l-foreground",
};

const KpiCard = ({ item }: { item: DashboardKpiCard }) => {
  const Icon = iconRegistry[item.icon];

  return (
    <article
      className={cn(
        "group relative flex min-w-0 items-center gap-4 overflow-hidden rounded-xl border border-l-4 border-border bg-card p-5 text-card-foreground shadow-sm transition-[transform,box-shadow,border-color] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md",
        accentBorderStyles[item.accent],
      )}
    >
      <div className={cn("grid size-12 shrink-0 place-items-center rounded-xl", accentStyles[item.accent])}>
        <Icon className="size-5.5" aria-hidden="true" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="truncate text-sm font-medium text-muted-foreground" title={item.title}>
            {item.title}
          </h3>
          {item.status && (
            <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[0.6875rem] font-medium capitalize text-muted-foreground">
              {item.status}
            </span>
          )}
        </div>
        <p className="mt-0.5 text-3xl font-semibold leading-none tracking-tight text-foreground">
          {countFormatter.format(item.count)}
        </p>
        {item.percentage !== undefined && (
          <p className="mt-1.5 text-xs text-muted-foreground">
            {item.percentage}% of total
          </p>
        )}
      </div>
    </article>
  );
};

const KpiGridSkeleton = () => (
  <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,14rem),1fr))] gap-4" aria-hidden="true">
    {Array.from({ length: 8 }, (_, index) => (
      <div key={index} className="flex items-center gap-4 rounded-xl border bg-card p-5 shadow-sm">
        <Skeleton className="size-12 shrink-0 rounded-xl" />
        <div className="min-w-0 flex-1">
          <Skeleton className="h-4 w-32 max-w-full" />
          <Skeleton className="mt-2 h-8 w-20" />
          <Skeleton className="mt-2 h-3 w-24" />
        </div>
      </div>
    ))}
  </div>
);

export const LiveOrderKpiSection = () => {
  const dispatch = useAppDispatch();
  const { kpis, isLoading, hasLoaded, lastUpdated, error } = useAppSelector((state) => state.dashboard);
  const [orderDate, setOrderDate] = useState(getLocalDateValue);

  useEffect(() => {
    if (!hasLoaded && !isLoading) void dispatch(fetchDashboardKpis({ orderDate }));
  }, [dispatch, hasLoaded, isLoading, orderDate]);

  const handleOrderDateChange = (value: string) => {
    setOrderDate(value);
    if (value) void dispatch(fetchDashboardKpis({ orderDate: value }));
  };

  return (
    <section aria-labelledby="live-order-count-title">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <h2 id="live-order-count-title" className="shrink-0 text-xl font-semibold tracking-tight text-foreground">
          Live Order Count
        </h2>

        <div className="flex min-w-0 flex-wrap items-center gap-y-2 text-xs text-muted-foreground sm:text-sm">
          <label className="flex min-w-0 items-center gap-2 pr-3 sm:pr-4">
            <CalendarDays className="size-4 shrink-0" aria-hidden="true" />
            <span className="whitespace-nowrap font-medium text-foreground">Order Date:</span>
            <input
              type="date"
              value={orderDate}
              onChange={(event) => handleOrderDateChange(event.target.value)}
              className="min-w-0 bg-transparent text-muted-foreground outline-none focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Order date"
            />
          </label>

          <span className="hidden h-5 w-px bg-border sm:block" aria-hidden="true" />

          <div className="flex items-center gap-2 px-3 sm:px-4">
            <Clock3 className="size-4 shrink-0" aria-hidden="true" />
            <span className="whitespace-nowrap">
              <span className="font-medium text-foreground">Last updated:</span>{" "}
              {lastUpdated ? timeFormatter.format(new Date(lastUpdated)) : "—"}
            </span>
          </div>

          <span className="hidden h-5 w-px bg-border sm:block" aria-hidden="true" />

          <button
            type="button"
            aria-label="Refresh live order counts"
            title="Refresh live order counts"
            className="ml-1 grid size-8 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isLoading}
            onClick={() => void dispatch(fetchDashboardKpis({ orderDate }))}
          >
            <RefreshCw className={cn("size-4", isLoading && "animate-spin")} aria-hidden="true" />
          </button>
        </div>
      </div>

      {isLoading && !kpis.length ? (
        <KpiGridSkeleton />
      ) : error ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-5">
          <p className="text-sm text-destructive" role="alert">{error}</p>
          <button
            type="button"
            className="mt-3 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            onClick={() => void dispatch(fetchDashboardKpis({ orderDate }))}
          >
            Try again
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,14rem),1fr))] gap-4">
          {kpis.map((item) => <KpiCard key={item.id} item={item} />)}
        </div>
      )}
    </section>
  );
};
