import { type SubmitEvent, useEffect, useState } from "react";
import { ArrowLeft, Eye, EyeOff, KeyRound } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import loginPoster from "../../assets/login-poster.jpg";
import zeissLogo from "../../assets/zeiss-logo-rgb.png";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { toast } from "../../components/ui/sonner";
import { useAppDispatch, useAppSelector } from "../../hooks/useRedux";
import { resetForgotPasswordForm, updateForgotPasswordField } from "../../redux/slice/auth/authSlice";
import { forgotPassword } from "../../redux/slice/auth/authThunk";
import type { ForgotPasswordField } from "../../redux/slice/auth/authType";
import { ROUTE_PATHS } from "../../routes/routePaths";
import { getPasswordValidationMessage } from "../../utils/passwordValidation";

const inputClassName =
  "bg-white text-slate-950 caret-blue-600 placeholder:text-slate-400 dark:bg-white dark:text-slate-950 dark:placeholder:text-slate-400";

interface PasswordFieldProps {
  id: string;
  label: string;
  field: "newPassword" | "confirmPassword";
  value: string;
  validationMessage?: string;
  onChange: (field: ForgotPasswordField, value: string) => void;
}

const PasswordField = ({ id, label, field, value, validationMessage, onChange }: PasswordFieldProps) => {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <Label className="mb-2 block text-slate-700" htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          type={visible ? "text" : "password"}
          autoComplete="new-password"
          className={`${inputClassName} pr-11`}
          value={value}
          minLength={8}
          required
          aria-invalid={Boolean(validationMessage)}
          aria-describedby={validationMessage ? `${id}-validation` : undefined}
          onChange={(event) => onChange(field, event.target.value)}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute inset-y-0 right-0 rounded-l-none bg-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:bg-transparent dark:text-slate-500 dark:hover:bg-slate-100 dark:hover:text-slate-900"
          aria-label={visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
          onClick={() => setVisible((current) => !current)}
        >
          {visible ? <EyeOff /> : <Eye />}
        </Button>
      </div>
      {validationMessage && (
        <p id={`${id}-validation`} className="mt-1.5 text-xs text-red-600" role="alert">
          {validationMessage}
        </p>
      )}
    </div>
  );
};

const ForgotPassword = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { forgotPasswordForm, forgotPasswordError, isResettingForgotPassword } = useAppSelector(
    (state) => state.auth,
  );
  const validationMessage = forgotPasswordForm.newPassword
    ? getPasswordValidationMessage(forgotPasswordForm.newPassword)
    : "";

  useEffect(
    () => () => {
      dispatch(resetForgotPasswordForm());
    },
    [dispatch],
  );

  const handleChange = (field: ForgotPasswordField, value: string) => {
    dispatch(updateForgotPasswordField({ field, value }));
  };

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = await dispatch(forgotPassword(forgotPasswordForm));

    if (forgotPassword.fulfilled.match(result)) {
      toast.success(result.payload.message);
      navigate(ROUTE_PATHS.login, { replace: true });
    }
  };

  return (
    <div className="min-h-svh w-full bg-white [color-scheme:light] lg:grid lg:h-svh lg:min-h-0 lg:grid-cols-[auto_minmax(28rem,1fr)] lg:overflow-hidden">
      <div className="relative hidden h-svh max-w-[calc(100vw-28rem)] overflow-hidden bg-blue-950 lg:block">
        <img src={loginPoster} alt="Delight Monitoring workspace" className="h-full w-auto max-w-full object-contain" />
        <div className="absolute inset-0 bg-linear-to-t from-blue-950/65 via-blue-900/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 hidden p-8 text-white lg:block">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-100">Delight Monitoring</p>
          <p className="mt-3 max-w-sm text-2xl font-semibold leading-tight">Restore secure access to your account.</p>
        </div>
      </div>

      <div className="flex min-h-svh items-center px-6 py-9 sm:px-10 sm:py-12 lg:h-full lg:min-h-0 lg:overflow-y-auto lg:px-14">
        <form className="mx-auto w-full max-w-sm" onSubmit={handleSubmit}>
          <img src={zeissLogo} alt="ZEISS" className="h-12 w-auto" />
          <div className="mt-8">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-semibold tracking-tight text-slate-950">Forgot password</h1>
              <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-700">
                <KeyRound className="size-5" />
              </div>
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-500">Confirm your account details and create a new password.</p>
          </div>

          <div className="mt-8 space-y-5">
            <div>
              <Label className="mb-2 block text-slate-700" htmlFor="forgot-name">Name</Label>
              <Input id="forgot-name" autoComplete="name" placeholder="Enter your full name" className={inputClassName}
                value={forgotPasswordForm.name} required onChange={(event) => handleChange("name", event.target.value)} />
            </div>
            <div>
              <Label className="mb-2 block text-slate-700" htmlFor="forgot-username">Username</Label>
              <Input id="forgot-username" autoComplete="username" placeholder="Enter your username" className={inputClassName}
                value={forgotPasswordForm.username} required onChange={(event) => handleChange("username", event.target.value)} />
            </div>
            <PasswordField id="forgot-new-password" label="New password" field="newPassword"
              value={forgotPasswordForm.newPassword} validationMessage={validationMessage} onChange={handleChange} />
            <PasswordField id="forgot-confirm-password" label="Confirm password" field="confirmPassword"
              value={forgotPasswordForm.confirmPassword} onChange={handleChange} />
          </div>

          {forgotPasswordError && (
            <p className="mt-5 rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700" role="alert">
              {forgotPasswordError}
            </p>
          )}

          <Button type="submit" size="lg"
            className="mt-7 w-full bg-blue-600 font-semibold text-white shadow-sm hover:bg-blue-700 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-700"
            disabled={isResettingForgotPassword || Boolean(validationMessage)}>
            {isResettingForgotPassword ? "Resetting…" : "Reset password"}
          </Button>

          <Link
            to={ROUTE_PATHS.login}
            className="mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-lg text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-blue-600/20 dark:text-slate-600 dark:hover:bg-slate-100 dark:hover:text-slate-950 sm:h-11"
          >
            <ArrowLeft className="size-3.5" /> Back to login
          </Link>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
