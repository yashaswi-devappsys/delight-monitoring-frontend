import { type FormEvent, useEffect } from "react";
import { CheckCircle2, Clipboard, KeyRound, UserPlus, UserRound } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../hooks/useRedux";
import { createNewUser } from "../../redux/slice/user/userThunk";
import {
  resetCreateUserForm,
  updateCreateUserName,
} from "../../redux/slice/user/userSlice";
import { Button } from "../../components/ui/button";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { toast } from "../../components/ui/sonner";

const CreateNewUserPage = () => {
  const dispatch = useAppDispatch();
  const {
    createUserName,
    isCreatingUser,
    createUserError,
    createUserFieldErrors,
    createdUser,
  } = useAppSelector((state) => state.user);

  useEffect(
    () => () => {
      dispatch(resetCreateUserForm());
    },
    [dispatch],
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = await dispatch(createNewUser({ name: createUserName }));
    if (createNewUser.fulfilled.match(result)) toast.success(result.payload.message);
  };

  const copyCredentials = async () => {
    if (!createdUser) return;

    const credentials = [
      `Name: ${createdUser.name}`,
      `Username: ${createdUser.username}`,
      `Temporary password: ${createdUser.password}`,
    ].join("\n");

    await navigator.clipboard.writeText(credentials);
    toast.success("User credentials copied.");
  };

  const nameError = createUserFieldErrors.find((error) => error.field === "name")?.message;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Card className="gap-0 overflow-hidden rounded-2xl py-0">
        <div className="h-24 bg-linear-to-r from-primary/15 via-primary/5 to-transparent" />
        <CardContent className="px-5 pb-6 sm:px-7">
          <div className="-mt-8 flex items-end gap-4 sm:-mt-10">
            <Avatar className="size-16 rounded-2xl border-4 border-card shadow-sm sm:size-20">
              <AvatarFallback className="bg-primary text-primary-foreground">
                <UserPlus className="size-5 sm:size-6" />
              </AvatarFallback>
            </Avatar>
            <div className="pb-1">
              <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl lg:text-[1.625rem]">
                Create new user
              </h1>
              <p className="text-xs text-muted-foreground sm:text-sm">Account administration</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-start gap-3">
            <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary sm:size-9">
              <UserPlus className="size-3.5 sm:size-4" />
            </div>
            <div className="grid gap-1.5">
              <CardTitle className="text-sm sm:text-base">User information</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Enter the user’s full name to generate their account.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid items-start gap-2 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-4">
              <Label htmlFor="new-user-name" className="text-xs sm:pt-3 sm:text-sm">Full name</Label>
              <div>
                <Input
                  id="new-user-name"
                  name="name"
                  autoComplete="name"
                  placeholder="Enter full name"
                  required
                  aria-invalid={Boolean(nameError)}
                  aria-describedby={nameError ? "new-user-name-error" : undefined}
                  value={createUserName}
                  onChange={(event) => dispatch(updateCreateUserName(event.target.value))}
                />
                {nameError && (
                  <p id="new-user-name-error" className="mt-1.5 text-xs text-destructive">
                    {nameError}
                  </p>
                )}
              </div>
            </div>

            {createUserError && !nameError && (
              <p className="rounded-lg bg-destructive/10 px-3 py-2.5 text-xs text-destructive sm:text-sm" role="alert">
                {createUserError}
              </p>
            )}

            <div className="flex justify-end">
              <Button type="submit" disabled={isCreatingUser || !createUserName.trim()}>
                <UserPlus className="size-4" />
                {isCreatingUser ? "Creating…" : "Create user"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {createdUser && (
        <Card className="border-emerald-500/30">
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div className="flex min-w-0 items-start gap-3">
              <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-emerald-600 sm:size-4 dark:text-emerald-400" />
              <div className="min-w-0 grid gap-1.5">
                <CardTitle className="text-sm sm:text-base">User created successfully</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Credentials for {createdUser.name}. The temporary password is shown only once.
                </CardDescription>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="shrink-0"
              onClick={() => void copyCredentials()}
            >
              <Clipboard className="size-4" />
              <span className="hidden sm:inline">Copy credentials</span>
              <span className="sm:hidden">Copy</span>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-3 rounded-xl bg-muted/60 p-4 sm:grid-cols-[9rem_minmax(0,1fr)] sm:items-center">
              <span className="flex items-center gap-2 text-xs font-medium text-muted-foreground sm:text-sm">
                <UserRound className="size-3 sm:size-3.5" /> Username
              </span>
              <code className="break-all bg-transparent p-0 text-xs font-semibold text-foreground sm:text-sm">
                {createdUser.username}
              </code>
            </div>

            <div className="grid gap-3 rounded-xl bg-muted/60 p-4 sm:grid-cols-[9rem_minmax(0,1fr)] sm:items-center">
              <span className="flex items-center gap-2 text-xs font-medium text-muted-foreground sm:text-sm">
                <KeyRound className="size-3 sm:size-3.5" /> Temporary password
              </span>
              <code className="break-all bg-transparent p-0 text-xs font-semibold text-foreground sm:text-sm">
                {createdUser.password}
              </code>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CreateNewUserPage;
