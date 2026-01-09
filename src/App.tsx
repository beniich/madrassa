// src/App.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from "@/contexts/AuthContext";
import { ConfigProvider } from "@/contexts/ConfigContext";
import { MainLayout } from '@/components/layout/MainLayout';

// Import TOUTES les pages
import Dashboard from '@/pages/Dashboard';
import Students from '@/pages/Students';
import Teachers from '@/pages/Teachers';
import Analytics from '@/pages/Analytics';
import Calendar from '@/pages/Calendar';
import AIDocuments from '@/pages/AIDocuments';
import Schedule from '@/pages/Schedule';
import Messages from '@/pages/Messages';
import Settings from '@/pages/Settings';
import PowerBIDashboard from '@/pages/PowerBIDashboard';
import GoogleSheetsPage from '@/pages/GoogleSheetsPage';
import UserProfile from '@/pages/UserProfile';
import HRManagement from '@/pages/HRManagement';
import Login from '@/pages/Login';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import NotFound from '@/pages/NotFound';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Router>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="*" element={
                  <ProtectedRoute>
                    <MainLayout>
                      <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/students" element={<Students />} />
                        <Route path="/teachers" element={<Teachers />} />
                        <Route path="/analytics" element={<Analytics />} />
                        <Route path="/calendar" element={<Calendar />} />
                        <Route path="/schedule" element={<Schedule />} />
                        <Route path="/messages" element={<Messages />} />
                        <Route path="/powerbi" element={<PowerBIDashboard />} />
                        <Route path="/googlesheets" element={<GoogleSheetsPage />} />
                        <Route path="/profile" element={<UserProfile />} />
                        <Route path="/hr-management" element={<HRManagement />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </MainLayout>
                  </ProtectedRoute>
                } />
              </Routes>
            </Router>
          </TooltipProvider>
        </AuthProvider>
      </ConfigProvider>
    </QueryClientProvider>
  );
}

export default App;
