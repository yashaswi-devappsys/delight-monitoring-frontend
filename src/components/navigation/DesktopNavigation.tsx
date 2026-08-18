import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import type { NavigationItem } from "../../config/navigation";
import { isNavigationItemActive } from "../../routes/navigationUtils";
import { cn } from "../../lib/utils";

interface DesktopNavigationProps {
  items: NavigationItem[];
}

export const DesktopNavigation = ({ items }: DesktopNavigationProps) => {
  const { pathname } = useLocation();
  const [openPath, setOpenPath] = useState<string | null>(null);
  const navigationRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setOpenPath(null);
  }, [pathname]);

  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!navigationRef.current?.contains(event.target as Node)) setOpenPath(null);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenPath(null);
    };

    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  return (
    <nav ref={navigationRef} aria-label="Primary navigation" className="hidden min-w-0 items-center gap-0.5 lg:flex xl:gap-1">
      {items.map((item) => {
        const active = isNavigationItemActive(pathname, item);

        if (!item.children?.length) {
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                "whitespace-nowrap px-2.5 py-2 text-sm font-medium transition-colors focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring xl:px-3",
                active
                  ? "text-navigation-active"
                  : "text-muted-foreground hover:text-navigation-active",
              )}
            >
              {item.menuLabel}
            </NavLink>
          );
        }

        const expanded = openPath === item.path;
        return (
          <div key={item.path} className="relative">
            <button
              type="button"
              aria-expanded={expanded}
              aria-haspopup="menu"
              className={cn(
                "flex items-center gap-1 whitespace-nowrap px-2.5 py-2 text-sm font-medium transition-colors focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring xl:px-3",
                active
                  ? "text-navigation-active"
                  : "text-muted-foreground hover:text-navigation-active",
              )}
              onClick={() => setOpenPath(expanded ? null : item.path)}
            >
              {item.menuLabel}
              <ChevronDown className={cn("size-3.5 transition-transform", expanded && "rotate-180")} />
            </button>

            {expanded && (
              <div
                role="menu"
                className="absolute left-0 top-full z-50 min-w-56 border-x border-b border-border bg-popover py-1 text-popover-foreground shadow-sm"
              >
                {item.children.map((child) => {
                  const Icon = child.icon;
                  return (
                    <NavLink
                      key={child.path}
                      role="menuitem"
                      to={child.path}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center gap-3 border-l-2 border-transparent px-4 py-2.5 text-sm outline-none transition-colors focus-visible:bg-accent/60 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
                          isActive
                            ? "border-l-navigation-active bg-accent/40 font-semibold text-navigation-active"
                            : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
                        )
                      }
                    >
                      {Icon && <Icon className="size-4 text-foreground" />}
                      {child.menuLabel}
                    </NavLink>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
};
