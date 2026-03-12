// src/App.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from "@/contexts/AuthContext";
import { ConfigProvider } from "@/contexts/ConfigContext";
import { MainLayout } from '@/components/layout/MainLayout';
import { CustomCursor } from '@/components/common/CustomCursor';

// Import TOUTES les pages
import Index from '@/pages/Index';
import Dashboard from '@/pages/Dashboard';
import Students from '@/pages/Students';
import Teachers from '@/pages/Teachers';
import Analytics from '@/pages/Analytics';
import Calendar from '@/pages/Calendar';
import Messages from '@/pages/Messages';
import Settings from '@/pages/Settings';
import Invoicing from '@/pages/Invoicing';
import Exams from '@/pages/Exams';
import Attendance from '@/pages/Attendance';
import Classes from '@/pages/Classes';
import Profile from '@/pages/Profile';
import Documents from '@/pages/Documents';
import AdminSettings from '@/pages/AdminSettings';
import SchoolPalette from '@/pages/SchoolPalette';
import PowerBIDashboard from '@/pages/PowerBIDashboard';
import HRManagement from '@/pages/HRManagement';
import GoogleSheetsPage from '@/pages/GoogleSheetsPage';
import NotFound from '@/pages/NotFound';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Pricing from '@/pages/Pricing';
import Checkout from '@/pages/Checkout';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider>
        <AuthProvider>
          <TooltipProvider>
            <CustomCursor />
            <Toaster />
            <Sonner />
            <Router>
              <Routes>
                {/* Route publique sans MainLayout */}
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/checkout" element={<Checkout />} />
                
                {/* Routes protégées avec MainLayout */}
                <Route path="/*" element={
                  <MainLayout>
                    <Routes>
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/students" element={<Students />} />
                      <Route path="/teachers" element={<Teachers />} />
                      <Route path="/classes" element={<Classes />} />
                      <Route path="/analytics" element={<Analytics />} />
                      <Route path="/calendar" element={<Calendar />} />
                      <Route path="/attendance" element={<Attendance />} />
                      <Route path="/exams" element={<Exams />} />
                      <Route path="/invoicing" element={<Invoicing />} />
                      <Route path="/documents" element={<Documents />} />
                      <Route path="/schedule" element={<Schedule />} />
                      <Route path="/messages" element={<Messages />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route path="/admin/settings" element={<AdminSettings />} />
                      <Route path="/admin/palette" element={<SchoolPalette />} />
                      <Route path="/powerbi" element={<PowerBIDashboard />} />
                      <Route path="/hr-management" element={<HRManagement />} />
                      <Route path="/googlesheets" element={<GoogleSheetsPage />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </MainLayout>
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
