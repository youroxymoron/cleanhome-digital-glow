import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DehydratedState, HydrationBoundary, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, StaticRouter } from "react-router-dom";
import { EditModeProvider } from "@/contexts/EditModeContext";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import ServicesPage from "./pages/ServicesPage";
import ServicePage from "./pages/ServicePage";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Offer from "./pages/Offer";
import AdminPage from "./pages/AdminPage";
import AuthPage from "./pages/AuthPage";
import NotFound from "./pages/NotFound";
import YandexMetrika from "@/components/YandexMetrika";

const browserQueryClient = new QueryClient();

interface AppProps {
  location?: string;
  queryClient?: QueryClient;
  dehydratedState?: DehydratedState;
}

const App = ({ location, queryClient = browserQueryClient, dehydratedState }: AppProps) => {
  const Router = location ? StaticRouter : BrowserRouter;

  return (
  <QueryClientProvider client={queryClient}>
    <HydrationBoundary state={dehydratedState}>
    <TooltipProvider>
      <AuthProvider>
        <EditModeProvider>
          <Toaster />
          <Sonner />
          <Router {...(location ? { location } : {})}>
            <YandexMetrika />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/services/:id" element={<ServicePage />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/offer" element={<Offer />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminPage />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </EditModeProvider>
      </AuthProvider>
    </TooltipProvider>
    </HydrationBoundary>
  </QueryClientProvider>
  );
};

export default App;
