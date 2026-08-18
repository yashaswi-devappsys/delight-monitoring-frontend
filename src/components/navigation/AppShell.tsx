import { Suspense, useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import type { NavigationItem } from "../../config/navigation";
import { cn } from "../../lib/utils";
import { PageContentSkeleton } from "../common/PageContentSkeleton";
import { AppHeader } from "./AppHeader";
import { Breadcrumbs } from "./Breadcrumbs";

export const AppShell = ({ navigation }: { navigation: NavigationItem[] }) => {
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const updateScrolled = () => setScrolled(window.scrollY > 4);
    updateScrolled();
    window.addEventListener("scroll", updateScrolled, { passive: true });
    return () => window.removeEventListener("scroll", updateScrolled);
  }, []);

  return (
    <div className="min-h-screen bg-muted/40">
      <div
        className={cn(
          "sticky top-0 z-40 border-b border-transparent transition-shadow duration-200",
          scrolled && "border-border shadow-sm",
        )}
      >
        <AppHeader navigation={navigation} />
        <Breadcrumbs navigation={navigation} />
      </div>

      <main className="mx-auto w-full max-w-screen-2xl p-4 sm:p-6">
        <Suspense fallback={<PageContentSkeleton />}>
          <div key={pathname} className="animate-in fade-in duration-200">
            <Outlet />
          </div>
        </Suspense>
      </main>
    </div>
  );
};
