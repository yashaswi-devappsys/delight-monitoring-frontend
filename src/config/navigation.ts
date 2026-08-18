import { lazy, type ComponentType, type LazyExoticComponent } from "react";
import type { LucideProps } from "lucide-react";
import {
  Activity,
  ClipboardList,
  Gauge,
  Glasses,
  History,
  RadioTower,
  ScrollText,
  Timer,
  Truck,
  UserRound,
  UserPlus,
} from "lucide-react";

export type AppLayout = "user" | "admin";
export type BreadcrumbLabel = string | ((params: Record<string, string>) => string);
export interface RoutePageProps {
  title?: string;
}

const DashboardPage = lazy(() => import("../pages/user/DashboardPage"));
const FeaturePage = lazy(() => import("../pages/user/FeaturePage"));
const ProfilePage = lazy(() => import("../pages/auth/ProfilePage"));
const CreateNewUserPage = lazy(() => import("../pages/auth/CreateNewUserPage"));

export interface NavigationItem {
  path: string;
  menuLabel: string;
  pageTitle: string;
  breadcrumbLabel: BreadcrumbLabel;
  icon?: ComponentType<LucideProps>;
  children?: NavigationItem[];
  roles?: number[];
  permissions?: string[];
  layout: AppLayout;
  showInMenu?: boolean;
  page?: LazyExoticComponent<ComponentType<RoutePageProps>>;
}

export const userNavigation: NavigationItem[] = [
  {
    path: "/dashboard",
    menuLabel: "Dashboard",
    pageTitle: "Dashboard",
    breadcrumbLabel: "Dashboard",
    icon: Gauge,
    layout: "user",
    showInMenu: false,
    page: DashboardPage,
  },
  {
    path: "/profile",
    menuLabel: "Profile",
    pageTitle: "Profile",
    breadcrumbLabel: "Profile",
    icon: UserRound,
    layout: "user",
    showInMenu: false,
    page: ProfilePage,
  },
  {
    path: "/users/new",
    menuLabel: "Create new user",
    pageTitle: "Create new user",
    breadcrumbLabel: "Create new user",
    icon: UserPlus,
    roles: [1],
    layout: "user",
    showInMenu: false,
    page: CreateNewUserPage,
  },
  {
    path: "/orders",
    menuLabel: "Orders",
    pageTitle: "Orders",
    breadcrumbLabel: "Orders",
    icon: ClipboardList,
    layout: "user",
    children: [
      {
        path: "/orders/live",
        menuLabel: "Live Orders",
        pageTitle: "Live Orders",
        breadcrumbLabel: "Live Orders",
        icon: Activity,
        layout: "user",
        page: FeaturePage,
      },
      {
        path: "/orders/pending",
        menuLabel: "Pending Orders",
        pageTitle: "Pending Orders",
        breadcrumbLabel: "Pending Orders",
        icon: Timer,
        layout: "user",
        page: FeaturePage,
      },
      {
        path: "/orders/history",
        menuLabel: "Order History",
        pageTitle: "Order History",
        breadcrumbLabel: "Order History",
        icon: History,
        layout: "user",
        page: FeaturePage,
      },
    ],
  },
  {
    path: "/monitoring",
    menuLabel: "Monitoring",
    pageTitle: "Monitoring",
    breadcrumbLabel: "Monitoring",
    icon: RadioTower,
    layout: "user",
    children: [
      {
        path: "/monitoring/mojro",
        menuLabel: "Mojro",
        pageTitle: "Mojro Monitoring",
        breadcrumbLabel: "Mojro",
        icon: Truck,
        layout: "user",
        page: FeaturePage,
      },
      {
        path: "/monitoring/cef",
        menuLabel: "CEF",
        pageTitle: "CEF Monitoring",
        breadcrumbLabel: "CEF",
        icon: Glasses,
        layout: "user",
        page: FeaturePage,
      },
    ],
  },
  {
    path: "/reports",
    menuLabel: "Reports",
    pageTitle: "Reports",
    breadcrumbLabel: "Reports",
    icon: ScrollText,
    layout: "user",
    page: FeaturePage,
  },

];

// Admin navigation can evolve independently while using the same app shell.
export const adminNavigation: NavigationItem[] = [];

export const canAccessNavigationItem = (
  item: NavigationItem,
  role?: number,
  permissions: string[] = [],
) => {
  const hasRole = !item.roles?.length || (role !== undefined && item.roles.includes(role));
  const hasPermissions =
    !item.permissions?.length || item.permissions.every((permission) => permissions.includes(permission));

  return hasRole && hasPermissions;
};
