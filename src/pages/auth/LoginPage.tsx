import { type FormEvent, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/useRedux";
import { authenticateUser } from "../../redux/slice/auth/authThunk";
import { ROUTE_PATHS } from "../../routes/routePaths";

interface LoginLocationState {
  from?: { pathname?: string };
}

const LoginPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading, error } = useAppSelector((state) => state.auth);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = await dispatch(authenticateUser({ username: username.trim(), password }));

    if (authenticateUser.fulfilled.match(result)) {
      const state = location.state as LoginLocationState | null;
      navigate(state?.from?.pathname ?? ROUTE_PATHS.dashboard, { replace: true });
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold">Sign in</h1>
      <p className="mt-1 text-sm text-muted-foreground">Access Delight Monitoring.</p>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <label className="block text-sm font-medium">
          Username
          <input className="mt-1 w-full rounded-md border bg-background px-3 py-2" autoComplete="username" required value={username} onChange={(event) => setUsername(event.target.value)} />
        </label>
        <label className="block text-sm font-medium">
          Password
          <input className="mt-1 w-full rounded-md border bg-background px-3 py-2" type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} />
        </label>
        {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
        <button className="w-full rounded-md bg-primary px-4 py-2 text-primary-foreground disabled:opacity-60" type="submit" disabled={isLoading}>
          {isLoading ? "Signing in…" : "Sign in"}
        </button>
      </form>
      <Link className="mt-4 inline-block text-sm underline" to={ROUTE_PATHS.resetPassword}>Forgot password?</Link>
    </div>
  );
};

export default LoginPage;
