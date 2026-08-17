import { type FormEvent, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import loginPoster from "../assets/login-poster.jpg";
import zeissLogo from "../assets/zeiss-logo-rgb.png";
import { useAppDispatch, useAppSelector } from "../hooks/useRedux";
import { authenticateUser } from "../redux/slice/auth/authThunk";
import { ROUTE_PATHS } from "../routes/routePaths";

interface LoginLocationState {
  from?: { pathname?: string };
}

const inputClassName =
  "h-11 w-full rounded-lg border border-slate-300 bg-white px-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-3 focus:ring-blue-100";

export const LoginForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading, error } = useAppSelector((state) => state.auth);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const result = await dispatch(
      authenticateUser({ username: username.trim(), password }),
    );

    if (authenticateUser.fulfilled.match(result)) {
      const state = location.state as LoginLocationState | null;
      navigate(state?.from?.pathname ?? ROUTE_PATHS.dashboard, {
        replace: true,
      });
    }
  };

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-[0_24px_70px_-24px_rgba(30,64,175,0.35)] lg:grid lg:min-h-155 lg:grid-cols-2">
      <div className="relative hidden min-h-155 overflow-hidden lg:block">
        <img
          src={loginPoster}
          alt="Delight Monitoring workspace"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-blue-950/65 via-blue-900/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 hidden p-8 text-white lg:block">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-100">
            Delight Monitoring
          </p>
          <p className="mt-3 max-w-sm text-2xl font-semibold leading-tight">
            Clear insight for confident daily decisions.
          </p>
        </div>
      </div>

      <div className="flex items-center px-6 py-9 sm:px-10 sm:py-12 lg:px-14">
        <form className="mx-auto w-full max-w-sm" onSubmit={handleSubmit}>
          <img src={zeissLogo} alt="ZEISS" className="h-12 w-auto" />

          <div className="mt-8">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
              Welcome back
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Sign in to your Delight Monitoring account.
            </p>
          </div>

          <div className="mt-8 space-y-5">
            <label className="block" htmlFor="username">
              <span className="mb-2 block text-sm font-medium text-slate-700">
                Username
              </span>
              <input
                id="username"
                name="username"
                className={inputClassName}
                autoComplete="username"
                placeholder="Enter your username"
                required
                value={username}
                onChange={(event) => setUsername(event.target.value)}
              />
            </label>

            <label className="block" htmlFor="password">
              <span className="mb-2 flex items-center justify-between gap-4">
                <span className="text-sm font-medium text-slate-700">Password</span>
                <Link
                  className="text-sm font-medium text-blue-700 hover:text-blue-800 hover:underline"
                  to={ROUTE_PATHS.resetPassword}
                >
                  Forgot password?
                </Link>
              </span>
              <input
                id="password"
                name="password"
                className={inputClassName}
                type="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </label>
          </div>

          {error && (
            <p
              className="mt-5 rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700"
              role="alert"
            >
              {error}
            </p>
          )}

          <button
            className="mt-7 flex h-11 w-full items-center justify-center rounded-lg bg-blue-700 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-60"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Signing in…" : "Sign in"}
          </button>

          <p className="mt-8 text-center text-xs leading-5 text-slate-400">
            Secure access for authorized users only.
          </p>
        </form>
      </div>
    </div>
  );
};
