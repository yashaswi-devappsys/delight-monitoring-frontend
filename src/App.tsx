import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import AxiosInterceptor from "./network/AxiosInterceptor";
import AppRoutes from "./routes/AppRoutes";

const App = () => {
  return (
    <AxiosInterceptor>
      <BrowserRouter>
        <div className="min-h-screen min-w-full bg-background">
          <AppRoutes />
          <Toaster position="top-right" richColors closeButton />
        </div>
      </BrowserRouter>
    </AxiosInterceptor>
  );
};

export default App;
