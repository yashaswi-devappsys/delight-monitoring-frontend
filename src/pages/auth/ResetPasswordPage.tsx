import { Link } from "react-router-dom";
import { ROUTE_PATHS } from "../../routes/routePaths";

const ResetPasswordPage = () => (
  <div>
    <h1 className="text-2xl font-semibold">Reset password</h1>
    <p className="mt-2 text-sm text-muted-foreground">Password recovery will be connected to the recovery API here.</p>
    <Link className="mt-6 inline-block text-sm underline" to={ROUTE_PATHS.login}>Return to sign in</Link>
  </div>
);

export default ResetPasswordPage;
