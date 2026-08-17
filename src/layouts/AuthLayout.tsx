import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../hooks/useRedux";
import { ROUTE_PATHS } from "../routes/routePaths";

const AuthLayout = () => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  if (isAuthenticated) return <Navigate to={ROUTE_PATHS.dashboard} replace />;

  return (
    <main className="grid min-h-screen place-items-center bg-linear-to-br from-slate-50 via-white to-blue-50 p-4 sm:p-6 lg:p-10">
      <section className="w-full max-w-5xl">
        <Outlet />
      </section>
    </main>
  );
};

export default AuthLayout;
