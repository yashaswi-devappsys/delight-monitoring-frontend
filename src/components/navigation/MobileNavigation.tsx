import { ChevronDown, X } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import type { NavigationItem } from "../../config/navigation";
import { cn } from "../../lib/utils";

interface MobileNavigationProps {
  items: NavigationItem[];
  open: boolean;
  onClose: () => void;
}

export const MobileNavigation = ({ items, open, onClose }: MobileNavigationProps) => {
  const { pathname } = useLocation();
  const [expandedPaths, setExpandedPaths] = useState<string[]>([]);

  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [onClose, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <button
        type="button"
        aria-label="Close navigation"
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        className="relative h-full w-[min(86vw,22rem)] overflow-y-auto border-r bg-background p-4 shadow-xl"
      >
        <div className="mb-5 flex items-center justify-between border-b pb-4">
          <span className="font-semibold text-foreground">Navigation</span>
          <button
            type="button"
            aria-label="Close navigation"
            className="grid size-9 place-items-center rounded-md hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            onClick={onClose}
          >
            <X className="size-5" />
          </button>
        </div>

        <nav aria-label="Mobile navigation" className="space-y-1">
          {items.map((item) => {
            const Icon = item.icon;
            if (!item.children?.length) {
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium",
                      isActive
                        ? "font-semibold text-navigation-active"
                        : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
                    )
                  }
                >
                  {Icon && <Icon className="size-4.5" />}
                  {item.menuLabel}
                </NavLink>
              );
            }

            const expanded = expandedPaths.includes(item.path);
            return (
              <div key={item.path}>
                <button
                  type="button"
                  aria-expanded={expanded}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-muted-foreground hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  onClick={() =>
                    setExpandedPaths((paths) =>
                      expanded ? paths.filter((path) => path !== item.path) : [...paths, item.path],
                    )
                  }
                >
                  {Icon && <Icon className="size-4.5" />}
                  <span className="flex-1">{item.menuLabel}</span>
                  <ChevronDown className={cn("size-4 transition-transform", expanded && "rotate-180")} />
                </button>
                {expanded && (
                  <div className="ml-5 space-y-1 border-l pl-3">
                    {item.children.map((child) => (
                      <NavLink
                        key={child.path}
                        to={child.path}
                        className={({ isActive }) =>
                          cn(
                            "block rounded-md px-3 py-2 text-sm",
                            isActive
                              ? "font-semibold text-navigation-active"
                              : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
                          )
                        }
                      >
                        {child.menuLabel}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </aside>
    </div>
  );
};
