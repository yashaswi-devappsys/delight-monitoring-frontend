import { ChevronRight, Home } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import type { NavigationItem } from "../../config/navigation";
import { getBreadcrumbs } from "../../routes/navigationUtils";
import { ROUTE_PATHS } from "../../routes/routePaths";

export const Breadcrumbs = ({ navigation }: { navigation: NavigationItem[] }) => {
  const { pathname } = useLocation();
  const breadcrumbs = getBreadcrumbs(pathname, navigation);

  if (!breadcrumbs.length || pathname === ROUTE_PATHS.dashboard) return null;

  return (
    <nav aria-label="Breadcrumb" className="border-b bg-background/95 px-4 sm:px-6">
      <ol className="mx-auto flex h-10 max-w-screen-2xl items-center gap-1 overflow-hidden text-xs sm:text-sm">
        {breadcrumbs.map((item, index) => {
          const current = index === breadcrumbs.length - 1;
          return (
            <li key={item.path} className="flex min-w-0 items-center gap-1">
              {index > 0 && <ChevronRight className="size-3.5 shrink-0 text-muted-foreground/70" />}
              {current ? (
                <span aria-current="page" className="truncate font-medium text-foreground">
                  {index === 0 && <Home className="mr-1.5 inline size-3.5" />}
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.path}
                  className="truncate text-muted-foreground transition-colors hover:text-primary focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {index === 0 && <Home className="mr-1.5 inline size-3.5" />}
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
