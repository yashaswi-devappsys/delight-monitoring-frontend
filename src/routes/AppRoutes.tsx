import { Fragment, lazy, Suspense, type ReactNode } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { canAccessNavigationItem, userNavigation, type NavigationItem } from "../config/navigation";
import { useAppSelector } from "../hooks/useRedux";
import AuthLayout from "../layouts/AuthLayout";
import UserLayout from "../layouts/UserLayout";
import ProtectedRoute from "./ProtectedRoute";
import PasswordResetRoute from "./PasswordResetRoute";
import { ROUTE_PATHS } from "./routePaths";

const LoginPage = lazy(() => import("../pages/auth/LoginPage"));
const ResetPasswordPage = lazy(() => import("../pages/auth/ResetPasswordPage"));
const NotFoundPage = lazy(() => import("../pages/errors/NotFoundPage"));
const UnauthorizedPage = lazy(() => import("../pages/errors/UnauthorizedPage"));

const PublicPage = ({ children }: { children: ReactNode }) => (
  <Suspense fallback={<div className="grid min-h-screen place-items-center text-sm text-muted-foreground">Loading…</div>}>
    {children}
  </Suspense>
);

const ConfiguredPage = ({ item }: { item: NavigationItem }) => {
  const user = useAppSelector((state) => state.auth.user);
  if (!canAccessNavigationItem(item, user?.role, user?.permissions)) {
    return <Navigate to={ROUTE_PATHS.unauthorized} replace />;
  }

  const Page = item.page;
  return Page ? <Page title={item.pageTitle} /> : null;
};

const createNavigationRoutes = (items: NavigationItem[]): ReactNode[] =>
  items.map((item) => (
    <Fragment key={item.path}>
      <Route
        path={item.path}
        element={
          item.children?.length ? (
            <Navigate to={item.children[0].path} replace />
          ) : (
            <ConfiguredPage item={item} />
          )
        }
      />
      {item.children && createNavigationRoutes(item.children)}
    </Fragment>
  ));

const AppRoutes = () => (
  <Routes>
    <Route element={<AuthLayout />}>
      <Route path={ROUTE_PATHS.login} element={<PublicPage><LoginPage /></PublicPage>} />
    </Route>

    <Route element={<PasswordResetRoute />}>
      <Route path={ROUTE_PATHS.resetPassword} element={<PublicPage><ResetPasswordPage /></PublicPage>} />
    </Route>

    <Route element={<ProtectedRoute />}>
      <Route element={<UserLayout />}>
        {createNavigationRoutes(userNavigation)}
      </Route>
    </Route>

    <Route path={ROUTE_PATHS.home} element={<Navigate to={ROUTE_PATHS.dashboard} replace />} />
    <Route path={ROUTE_PATHS.unauthorized} element={<PublicPage><UnauthorizedPage /></PublicPage>} />
    <Route path="*" element={<PublicPage><NotFoundPage /></PublicPage>} />
  </Routes>
);

export default AppRoutes;
