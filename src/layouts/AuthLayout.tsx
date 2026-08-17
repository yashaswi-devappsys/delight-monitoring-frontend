import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../hooks/useRedux";
import { ROUTE_PATHS } from "../routes/routePaths";

const AuthLayout = () => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  if (isAuthenticated) return <Navigate to={ROUTE_PATHS.dashboard} replace />;

  return (
    <main className="grid min-h-screen place-items-center bg-muted/30 p-4">
      <section className="w-full max-w-md rounded-xl border bg-card p-6 shadow-sm">
        <Outlet />
      </section>
    </main>
  );
};

export default AuthLayout;
