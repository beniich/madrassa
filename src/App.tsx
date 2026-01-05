// src/App.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import DashboardNew from "./pages/DashboardNew";
import Students from "./pages/Students";
import Teachers from "./pages/Teachers";
import Analytics from "./pages/Analytics";
import Calendar from "./pages/Calendar";
import Documents from "./pages/Documents";
import Schedule from "./pages/Schedule";
import Messages from "./pages/Messages";
import Settings from "./pages/Settings";
import MainLayout from "./components/layout/MainLayout";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <MainLayout>
            <Routes>
              {/* Redirect root to dashboard */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />

              {/* Dashboard Route */}
              <Route path="/dashboard" element={<DashboardNew />} />

              {/* Placeholder routes for other sidebar items to avoid 404s for now */}
              {/* Main Modules */}
              <Route path="/students" element={<Students />} />
              <Route path="/teachers" element={<Teachers />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/documents" element={<Documents />} />
              <Route path="/schedule" element={<Schedule />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/settings" element={<Settings />} />

              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </MainLayout>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
