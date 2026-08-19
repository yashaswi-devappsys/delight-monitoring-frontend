import { type SubmitEvent, useEffect, useState } from "react";
import { Eye, EyeOff, KeyRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import loginPoster from "../../assets/login-poster.jpg";
import zeissLogo from "../../assets/zeiss-logo-rgb.png";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { toast } from "../../components/ui/sonner";
import { useAppDispatch, useAppSelector } from "../../hooks/useRedux";
import { resetResetPasswordForm, updateResetPasswordField } from "../../redux/slice/user/userSlice";
import { resetPassword } from "../../redux/slice/user/userThunk";
import type { ChangePasswordField } from "../../redux/slice/user/userType";
import { ROUTE_PATHS } from "../../routes/routePaths";
import { getPasswordValidationMessage } from "../../utils/passwordValidation";

interface PasswordInputProps {
  id: string;
  label: string;
  field: ChangePasswordField;
  value: string;
  validationMessage?: string;
  onChange: (field: ChangePasswordField, value: string) => void;
}

const PasswordInput = ({ id, label, field, value, validationMessage, onChange }: PasswordInputProps) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-slate-700">{label}</Label>
      <div className="relative">
        <Input
          id={id}
          type={visible ? "text" : "password"}
          autoComplete={field === "currentPassword" ? "current-password" : "new-password"}
          value={value}
          required
          minLength={field === "currentPassword" ? undefined : 8}
          className="bg-white pr-11 text-slate-950 caret-blue-600 placeholder:text-slate-400 dark:bg-white dark:text-slate-950"
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
        <p id={`${id}-validation`} className="text-xs text-red-600" role="alert">
          {validationMessage}
        </p>
      )}
    </div>
  );
};

const ResetPasswordPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isResettingPassword, resetPasswordError, resetPasswordForm } = useAppSelector(
    (state) => state.user,
  );
  const validationMessage = resetPasswordForm.newPassword
    ? getPasswordValidationMessage(resetPasswordForm.newPassword)
    : "";

  useEffect(
    () => () => {
      dispatch(resetResetPasswordForm());
    },
    [dispatch],
  );

  const handleChange = (field: ChangePasswordField, value: string) => {
    dispatch(updateResetPasswordField({ field, value }));
  };

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = await dispatch(resetPassword(resetPasswordForm));

    if (resetPassword.fulfilled.match(result)) {
      toast.success(result.payload.message);
      navigate(ROUTE_PATHS.dashboard, { replace: true });
    }
  };

  return (
    <main className="min-h-svh w-full bg-white [color-scheme:light] lg:grid lg:h-svh lg:min-h-0 lg:grid-cols-[auto_minmax(28rem,1fr)] lg:overflow-hidden">
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
            Secure your account before continuing.
          </p>
        </div>
      </div>

      <div className="flex min-h-svh items-center px-6 py-9 sm:px-10 sm:py-12 lg:h-full lg:min-h-0 lg:overflow-y-auto lg:px-14">
        <form className="mx-auto w-full max-w-sm" onSubmit={handleSubmit}>
          <img src={zeissLogo} alt="ZEISS" className="h-12 w-auto" />

          <div className="mt-8">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
                Set a new password
              </h1>
              <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-700">
                <KeyRound className="size-5" />
              </div>
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Your temporary password must be replaced before you can continue to the dashboard.
            </p>
          </div>

          <div className="mt-8 space-y-4">
            <PasswordInput id="reset-current-password" label="Current password" field="currentPassword"
              value={resetPasswordForm.currentPassword} onChange={handleChange} />
            <PasswordInput id="reset-new-password" label="New password" field="newPassword"
              value={resetPasswordForm.newPassword} validationMessage={validationMessage} onChange={handleChange} />
            <PasswordInput id="reset-confirm-password" label="Confirm password" field="confirmPassword"
              value={resetPasswordForm.confirmPassword} onChange={handleChange} />

            {resetPasswordError && (
              <p className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700" role="alert">
                {resetPasswordError}
              </p>
            )}

            <Button
              type="submit"
              className="w-full bg-blue-600 font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:ring-blue-600/25 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-700"
              size="lg"
              disabled={isResettingPassword || Boolean(validationMessage)}
            >
              {isResettingPassword ? "Resetting…" : "Reset password"}
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default ResetPasswordPage;
