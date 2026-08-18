import { matchPath } from "react-router-dom";
import type { NavigationItem } from "../config/navigation";

export interface BreadcrumbItem {
  label: string;
  path: string;
}

const findTrail = (
  pathname: string,
  items: NavigationItem[],
  parents: NavigationItem[] = [],
): NavigationItem[] | null => {
  for (const item of items) {
    const trail = [...parents, item];
    const match = matchPath({ path: item.path, end: true }, pathname);
    if (match) return trail;

    if (item.children) {
      const childTrail = findTrail(pathname, item.children, trail);
      if (childTrail) return childTrail;
    }
  }

  return null;
};

export const getBreadcrumbs = (
  pathname: string,
  navigation: NavigationItem[],
): BreadcrumbItem[] => {
  const trail = findTrail(pathname, navigation);
  if (!trail) return [];

  const breadcrumbs = trail.map((item) => {
    const match = matchPath({ path: item.path, end: true }, pathname);
    const params = Object.fromEntries(
      Object.entries(match?.params ?? {}).filter((entry): entry is [string, string] => Boolean(entry[1])),
    );
    const label =
      typeof item.breadcrumbLabel === "function"
        ? item.breadcrumbLabel(params)
        : item.breadcrumbLabel;

    return { label, path: item.path };
  });

  const dashboard = navigation.find((item) => item.path === "/dashboard");
  if (dashboard && breadcrumbs[0]?.path !== dashboard.path) {
    breadcrumbs.unshift({
      label:
        typeof dashboard.breadcrumbLabel === "string"
          ? dashboard.breadcrumbLabel
          : dashboard.menuLabel,
      path: dashboard.path,
    });
  }

  return breadcrumbs;
};

export const isNavigationItemActive = (pathname: string, item: NavigationItem) =>
  pathname === item.path || item.children?.some((child) => pathname === child.path) === true;
