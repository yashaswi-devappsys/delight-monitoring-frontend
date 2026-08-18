import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../hooks/useRedux";
import { ROUTE_PATHS } from "./routePaths";

const PasswordResetRoute = () => {
  const { isAuthenticated, resetPasswordRequired } = useAppSelector((state) => state.auth);

  if (!isAuthenticated) return <Navigate to={ROUTE_PATHS.login} replace />;
  if (!resetPasswordRequired) return <Navigate to={ROUTE_PATHS.dashboard} replace />;

  return <Outlet />;
};

export default PasswordResetRoute;
