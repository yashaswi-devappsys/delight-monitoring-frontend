import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../hooks/useRedux";
import { ROUTE_PATHS } from "./routePaths";

const ProtectedRoute = () => {
  const { isAuthenticated, resetPasswordRequired } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={ROUTE_PATHS.login} replace state={{ from: location }} />;
  }

  if (resetPasswordRequired) {
    return <Navigate to={ROUTE_PATHS.resetPassword} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
