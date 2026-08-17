import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../hooks/useRedux";
import type { TUser } from "../constants/model/user";
import { ROUTE_PATHS } from "./routePaths";

interface RoleRouteProps {
  allowedRoles: Array<NonNullable<TUser["role"]>>;
  children: ReactNode;
}

const RoleRoute = ({ allowedRoles, children }: RoleRouteProps) => {
  const role = useAppSelector((state) => state.auth.user?.role);

  if (role === undefined || !allowedRoles.includes(role)) {
    return <Navigate to={ROUTE_PATHS.unauthorized} replace />;
  }

  return children;
};

export default RoleRoute;
