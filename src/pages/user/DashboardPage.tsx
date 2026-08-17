import { useAppDispatch, useAppSelector } from "../../hooks/useRedux";
import { logoutUser } from "../../redux/slice/auth/authThunk";

const DashboardPage = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  return (
    <section>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome, {user?.name ?? user?.username ?? "user"}.</p>
        </div>
        <button className="rounded-md border px-4 py-2" type="button" onClick={() => void dispatch(logoutUser())}>Sign out</button>
      </div>
    </section>
  );
};

export default DashboardPage;
