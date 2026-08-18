import { type SubmitEvent, useEffect, useState } from "react";
import { BadgeCheck, Eye, EyeOff, KeyRound, Mail, ShieldCheck, UserRound, X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../hooks/useRedux";
import { changePassword } from "../../redux/slice/user/userThunk";
import {
    closeChangePasswordForm,
    openChangePasswordForm,
    updateChangePasswordField,
} from "../../redux/slice/user/userSlice";
import type { ChangePasswordField } from "../../redux/slice/user/userType";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { toast } from "../../components/ui/sonner";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { getPasswordValidationMessage } from "../../utils/passwordValidation";

const getInitials = (name: string) =>
    name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("") || "U";

interface PasswordFieldProps {
    id: string;
    label: string;
    field: ChangePasswordField;
    value: string;
    autoComplete: "current-password" | "new-password";
    onChange: (field: ChangePasswordField, value: string) => void;
    validationMessage?: string;
}

const PasswordField = ({ id, label, field, value, autoComplete, onChange, validationMessage }: PasswordFieldProps) => {
    const [visible, setVisible] = useState(false);

    return (
        <div className="grid grid-cols-[7.5rem_minmax(0,1fr)] items-center gap-3 sm:grid-cols-[10rem_minmax(0,1fr)]">
            <Label htmlFor={id} className="text-xs sm:text-sm">{label}</Label>
            <div className="min-w-0">
                <div className="relative">
                    <Input
                        id={id}
                        type={visible ? "text" : "password"}
                        autoComplete={autoComplete}
                        minLength={field === "currentPassword" ? undefined : 8}
                        required
                        value={value}
                        className="pr-11"
                        aria-invalid={Boolean(validationMessage)}
                        aria-describedby={validationMessage ? `${id}-validation` : undefined}
                        onChange={(event) => onChange(field, event.target.value)}
                    />
                    <Button type="button" variant="ghost" size="icon"
                        aria-label={visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
                        className="absolute inset-y-0 right-0 h-11 w-11 rounded-l-none text-muted-foreground hover:text-foreground"
                        onClick={() => setVisible((value) => !value)}
                    >
                        {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </Button>
                </div>
                {validationMessage && (
                    <p id={`${id}-validation`} className="mt-1.5 text-xs text-destructive" role="alert">
                        {validationMessage}
                    </p>
                )}
            </div>
        </div>
    );
};

const ProfilePage = () => {
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.auth.user);
    const {
        isChangingPassword,
        changePasswordError,
        isChangePasswordFormOpen,
        changePasswordForm,
    } = useAppSelector((state) => state.user);
    const displayName = user?.name || user?.username || "User";
    const newPasswordValidationMessage = changePasswordForm.newPassword
        ? getPasswordValidationMessage(changePasswordForm.newPassword)
        : "";

    useEffect(
        () => () => {
            dispatch(closeChangePasswordForm());
        },
        [dispatch],
    );

    const handleFieldChange = (field: ChangePasswordField, value: string) => {
        dispatch(updateChangePasswordField({ field, value }));
    };

    const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();
        const result = await dispatch(
            changePassword(changePasswordForm),
        );

        if (changePassword.fulfilled.match(result)) {
            toast.success(result.payload.message);
        }
    };

    const details = [
        { label: "Full name", value: user?.name, icon: UserRound },
        { label: "Username", value: user?.username, icon: BadgeCheck },
        { label: "Email address", value: user?.email, icon: Mail },
        {
            label: "Role",
            value: user?.role !== undefined ? `Role ${user.role}` : undefined,
            icon: ShieldCheck,
        },
    ];

    return (
        <div className="mx-auto max-w-4xl space-y-6">
            <Card className="gap-0 overflow-hidden rounded-2xl py-0">
                <div className="h-24 bg-linear-to-r from-primary/15 via-primary/5 to-transparent" />
                <CardContent className="px-5 pb-6 sm:px-7">
                    <div className="-mt-8 flex flex-wrap items-end justify-between gap-4 sm:-mt-10">
                        <div className="flex items-end gap-4">
                            <Avatar className="size-16 rounded-2xl border-4 border-card shadow-sm sm:size-20">
                                <AvatarFallback className="bg-primary text-xl font-semibold text-primary-foreground">
                                    {getInitials(displayName)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="pb-1">
                                <h1 className="text-xl font-semibold tracking-tight sm:text-2xl lg:text-[1.625rem]">{displayName}</h1>
                                <p className="text-xs text-muted-foreground sm:text-sm">Account profile</p>
                            </div>
                        </div>

                        {!isChangePasswordFormOpen && (
                            <Button type="button" size="sm"
                                onClick={() => {
                                    dispatch(openChangePasswordForm());
                                }}
                            >
                                <KeyRound className="size-4" /> Change password
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>

            <Card className="rounded-2xl">
                <CardHeader className="px-5 sm:px-6">
                    <CardTitle className="text-sm sm:text-base">Personal information</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 px-5 sm:grid-cols-2 sm:px-6">
                    {details.map(({ label, value, icon: Icon }) => (
                        <div key={label} className="flex items-start gap-3 rounded-xl bg-muted/60 p-4">
                            <div className="grid size-7 shrink-0 place-items-center rounded-lg bg-background text-muted-foreground sm:size-8">
                                <Icon className="size-3 sm:size-3.5" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-[0.6875rem] font-medium text-muted-foreground sm:text-xs">{label}</p>
                                <p className="mt-1 truncate text-xs font-medium sm:text-sm" title={value || "Not provided"}>
                                    {value || "Not provided"}
                                </p>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {isChangePasswordFormOpen && (
                <Card className="rounded-2xl">
                    <CardHeader className="flex flex-row items-start justify-between gap-4 px-5 sm:px-6">
                        <div className="grid gap-1.5">
                            <CardTitle className="text-sm sm:text-base">Change password</CardTitle>
                        </div>
                        <Button type="button" variant="ghost" size="icon-sm"
                            aria-label="Close change password form"
                            className="text-muted-foreground hover:text-foreground"
                            onClick={() => dispatch(closeChangePasswordForm())}
                        >
                            <X className="size-4" />
                        </Button>
                    </CardHeader>

                    <CardContent className="px-5 sm:px-6">
                        <form className="max-w-2xl space-y-4" onSubmit={handleSubmit}>
                            <PasswordField
                                id="current-password"
                                label="Current password"
                                field="currentPassword"
                                value={changePasswordForm.currentPassword}
                                autoComplete="current-password"
                                onChange={handleFieldChange}
                            />
                            <PasswordField
                                id="new-password"
                                label="New password"
                                field="newPassword"
                                value={changePasswordForm.newPassword}
                                autoComplete="new-password"
                                onChange={handleFieldChange}
                                validationMessage={newPasswordValidationMessage}
                            />
                            <PasswordField
                                id="confirm-password"
                                label="Confirm password"
                                field="confirmPassword"
                                value={changePasswordForm.confirmPassword}
                                autoComplete="new-password"
                                onChange={handleFieldChange}
                            />

                            {changePasswordError && (
                                <p className="rounded-lg bg-destructive/10 px-3 py-2.5 text-xs text-destructive sm:text-sm" role="alert">
                                    {changePasswordError}
                                </p>
                            )}
                            <div className="flex flex-wrap justify-end gap-3 pt-1">
                                <Button type="button" variant="outline" size="sm"
                                    onClick={() => dispatch(closeChangePasswordForm())}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" size="sm"
                                    disabled={isChangingPassword}
                                >
                                    {isChangingPassword ? "Updating…" : "Update password"}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default ProfilePage;
