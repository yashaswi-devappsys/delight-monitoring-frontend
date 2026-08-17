import { Link } from "react-router-dom";
import { ROUTE_PATHS } from "../../routes/routePaths";

const NotFoundPage = () => (
  <main className="grid min-h-screen place-items-center p-6 text-center">
    <div><p className="text-sm font-medium">404</p><h1 className="text-3xl font-semibold">Page not found</h1><Link className="mt-4 inline-block underline" to={ROUTE_PATHS.home}>Go home</Link></div>
  </main>
);

export default NotFoundPage;
