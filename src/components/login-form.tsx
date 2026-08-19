import { type SubmitEvent, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import loginPoster from "../assets/login-poster.jpg";
import zeissLogo from "../assets/zeiss-logo-rgb.png";
import { useAppDispatch, useAppSelector } from "../hooks/useRedux";
import { authenticateUser } from "../redux/slice/auth/authThunk";
import { ROUTE_PATHS } from "../routes/routePaths";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface LoginLocationState {
  from?: { pathname?: string };
}

const loginInputClassName =
  "bg-white text-slate-950 caret-blue-600 placeholder:text-slate-400 dark:bg-white dark:text-slate-950 dark:placeholder:text-slate-400";

export const LoginForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading, error } = useAppSelector((state) => state.auth);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const result = await dispatch(
      authenticateUser({ username: username.trim(), password }),
    );

    if (authenticateUser.fulfilled.match(result)) {
      if (result.payload.resetPasswordRequired) {
        navigate(ROUTE_PATHS.resetPassword, { replace: true });
        return;
      }
      const state = location.state as LoginLocationState | null;
      navigate(state?.from?.pathname ?? ROUTE_PATHS.dashboard, {
        replace: true,
      });
    }
  };

  return (
    <div className="min-h-svh w-full bg-white scheme-light lg:grid lg:h-svh lg:min-h-0 lg:grid-cols-[auto_minmax(28rem,1fr)] lg:overflow-hidden">
      <div className="relative hidden h-svh max-w-[calc(100vw-28rem)] overflow-hidden bg-blue-950 lg:block">
        <img
          src={loginPoster}
          alt="Delight Monitoring workspace"
          className="h-full w-auto max-w-full object-contain"
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

      <div className="flex min-h-svh items-center px-6 py-9 sm:px-10 sm:py-12 lg:h-full lg:min-h-0 lg:overflow-y-auto lg:px-14">
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
            <div>
              <Label className="mb-2 block text-slate-700" htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                autoComplete="username"
                placeholder="Enter your username"
                className={loginInputClassName}
                required
                value={username}
                onChange={(event) => setUsername(event.target.value)}
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between gap-4">
                <Label className="text-slate-700" htmlFor="password">Password</Label>
                <Link
                  className="text-sm font-medium text-blue-700 hover:text-blue-800 hover:underline dark:text-blue-700 dark:hover:text-blue-800"
                  to={ROUTE_PATHS.forgotPassword}
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                className={loginInputClassName}
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>
          </div>

          {error && (
            <p
              className="mt-5 rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700"
              role="alert"
            >
              {error}
            </p>
          )}

          <Button
            className="mt-7 w-full bg-blue-600 font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:ring-blue-600/25 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-700"
            size="lg"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Signing in…" : "Sign in"}
          </Button>

          <p className="mt-8 text-center text-xs leading-5 text-slate-400">
            Secure access for authorized users only.
          </p>
        </form>
      </div>
    </div>
  );
};
