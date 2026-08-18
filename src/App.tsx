import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { Toaster } from "./components/ui/sonner";
import AxiosInterceptor from "./network/AxiosInterceptor";
import AppRoutes from "./routes/AppRoutes";

const App = () => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange storageKey="delight-monitoring-theme">
      <AxiosInterceptor>
        <BrowserRouter>
          <div className="min-h-screen min-w-full bg-background">
            <AppRoutes />
            <Toaster position="top-right" richColors closeButton />
          </div>
        </BrowserRouter>
      </AxiosInterceptor>
    </ThemeProvider>
  );
};

export default App;
