import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import UserLayout from "../layouts/UserLayout";
import ProtectedRoute from "./ProtectedRoute";
import { ROUTE_PATHS } from "./routePaths";

const LoginPage = lazy(() => import("../pages/auth/LoginPage"));
const ResetPasswordPage = lazy(() => import("../pages/auth/ResetPasswordPage"));
const DashboardPage = lazy(() => import("../pages/user/DashboardPage"));
const NotFoundPage = lazy(() => import("../pages/errors/NotFoundPage"));
const UnauthorizedPage = lazy(() => import("../pages/errors/UnauthorizedPage"));

const AppRoutes = () => (
  <Routes>
    <Route element={<AuthLayout />}>
      <Route path={ROUTE_PATHS.login} element={<LoginPage />} />
      <Route path={ROUTE_PATHS.resetPassword} element={<ResetPasswordPage />} />
    </Route>

    <Route element={<ProtectedRoute />}>
      <Route element={<UserLayout />}>
        <Route path={ROUTE_PATHS.dashboard} element={<DashboardPage />} />
      </Route>
    </Route>

    <Route path={ROUTE_PATHS.home} element={<Navigate to={ROUTE_PATHS.dashboard} replace />} />
    <Route path={ROUTE_PATHS.unauthorized} element={<UnauthorizedPage />} />
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);

export default AppRoutes;
