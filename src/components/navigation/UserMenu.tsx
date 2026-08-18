import { Check, ChevronDown, LogOut, Monitor, Moon, Sun, UserPlus, UserRound } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/useRedux";
import { logoutUser } from "../../redux/slice/auth/authThunk";
import { ROUTE_PATHS } from "../../routes/routePaths";
import { cn } from "../../lib/utils";

const themes = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
] as const;

const getInitials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "U";

export const UserMenu = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const { theme = "system", setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const displayName = user?.name || user?.username || "User";

  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  return (
    <div ref={menuRef} className="relative ml-auto shrink-0">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={`Open menu for ${displayName}`}
        className="flex h-10 items-center gap-2 rounded-lg px-1.5 text-sm font-medium transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:px-2"
        onClick={() => setOpen((value) => !value)}
      >
        <span className="grid size-8 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
          {getInitials(displayName)}
        </span>
        <span className="hidden max-w-36 truncate text-foreground sm:block">{displayName}</span>
        <ChevronDown className={cn("hidden size-3.5 text-muted-foreground transition-transform sm:block", open && "rotate-180")} />
      </button>

      {open && (
        <div role="menu" className="absolute right-0 top-full z-50 mt-2 w-64 rounded-lg border bg-popover p-1.5 text-popover-foreground shadow-lg">
          <div className="border-b px-3 py-2.5">
            <p className="truncate text-sm font-medium">{displayName}</p>
            {user?.email && <p className="truncate text-xs text-muted-foreground">{user.email}</p>}
          </div>

          <Link
            role="menuitem"
            to={ROUTE_PATHS.profile}
            className="mt-1 flex items-center gap-2.5 rounded-md px-3 py-2 text-sm hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            onClick={() => setOpen(false)}
          >
            <UserRound className="size-4" /> Profile
          </Link>

          {user?.role === 1 && (
            <Link
              role="menuitem"
              to={ROUTE_PATHS.createUser}
              className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              onClick={() => setOpen(false)}
            >
              <UserPlus className="size-4" /> Create new user
            </Link>
          )}

          <div className="my-1 border-y py-1" role="group" aria-label="Theme">
            <p className="px-3 py-1.5 text-xs font-medium text-muted-foreground">Theme</p>
            {themes.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.value}
                  type="button"
                  role="menuitemradio"
                  aria-checked={theme === item.value}
                  className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  onClick={() => setTheme(item.value)}
                >
                  <Icon className="size-4" />
                  <span className="flex-1">{item.label}</span>
                  {theme === item.value && <Check className="size-4 text-primary" />}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            role="menuitem"
            className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm text-destructive hover:bg-destructive/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            onClick={() => void dispatch(logoutUser())}
          >
            <LogOut className="size-4" /> Logout
          </button>
        </div>
      )}
    </div>
  );
};
