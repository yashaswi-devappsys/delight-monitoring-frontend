import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../hooks/useRedux";
import { ROUTE_PATHS } from "../routes/routePaths";

const AuthLayout = () => {
  const { isAuthenticated, resetPasswordRequired } = useAppSelector((state) => state.auth);

  if (isAuthenticated) {
    return <Navigate to={resetPasswordRequired ? ROUTE_PATHS.resetPassword : ROUTE_PATHS.dashboard} replace />;
  }

  return (
    <main className="min-h-svh w-full bg-white">
      <section className="min-h-svh w-full">
        <Outlet />
      </section>
    </main>
  );
};

export default AuthLayout;
