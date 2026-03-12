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
import Dashboard from '@/pages/Dashboard';
import Students from '@/pages/Students';
import Teachers from '@/pages/Teachers';
import Analytics from '@/pages/Analytics';
import Calendar from '@/pages/Calendar';
import Documents from '@/pages/Documents';
import Schedule from '@/pages/Schedule';
import Messages from '@/pages/Messages';
import Settings from '@/pages/Settings';
import Invoicing from '@/pages/Invoicing';
import Exams from '@/pages/Exams';
import Attendance from '@/pages/Attendance';
import Classes from '@/pages/Classes';
import Profile from '@/pages/Profile';
import NotFound from '@/pages/NotFound';

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
              <MainLayout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
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
                  <Route path="/profile" element={<Profile />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </MainLayout>
            </Router>
          </TooltipProvider>
        </AuthProvider>
      </ConfigProvider>
    </QueryClientProvider>
  );
}

export default App;

