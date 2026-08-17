import { Outlet } from "react-router-dom";

const UserLayout = () => (
  <div className="min-h-screen bg-background">
    <header className="border-b px-6 py-4 font-semibold">Delight Monitoring</header>
    <main className="mx-auto w-full max-w-7xl p-6">
      <Outlet />
    </main>
  </div>
);

export default UserLayout;
