import { Menu } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/zeiss-logo-rgb.png";
import { canAccessNavigationItem, type NavigationItem } from "../../config/navigation";
import { useAppSelector } from "../../hooks/useRedux";
import { ROUTE_PATHS } from "../../routes/routePaths";
import { DesktopNavigation } from "./DesktopNavigation";
import { MobileNavigation } from "./MobileNavigation";
import { UserMenu } from "./UserMenu";

export const AppHeader = ({ navigation }: { navigation: NavigationItem[] }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const user = useAppSelector((state) => state.auth.user);
  const closeMobileNavigation = useCallback(() => setMobileOpen(false), []);
  const visibleNavigation = useMemo(
    () =>
      navigation
        .filter((item) => item.showInMenu !== false && canAccessNavigationItem(item, user?.role))
        .map((item) => ({
          ...item,
          children: item.children?.filter((child) => canAccessNavigationItem(child, user?.role)),
        })),
    [navigation, user?.role],
  );

  return (
    <>
      <header className="h-16 bg-background/95 px-4 backdrop-blur supports-backdrop-filter:bg-background/85 sm:px-6">
        <div className="mx-auto flex h-full max-w-screen-2xl items-center gap-2 sm:gap-4">
          <button type="button" aria-label="Open navigation"
            className="grid size-9 shrink-0 place-items-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:hidden"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="size-5" />
          </button>

          <Link className="flex shrink-0 items-center gap-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            to={ROUTE_PATHS.dashboard}            
          >
            <img src={logo} alt="ZEISS" className="size-9 object-contain" />
            <span className="hidden whitespace-nowrap text-sm font-semibold text-foreground sm:block xl:text-base">
              Delight Monitoring
            </span>
          </Link>

          <DesktopNavigation items={visibleNavigation} />
          <UserMenu />
        </div>
      </header>

      <MobileNavigation items={visibleNavigation} open={mobileOpen} onClose={closeMobileNavigation} />
    </>
  );
};
