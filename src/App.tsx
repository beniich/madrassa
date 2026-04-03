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
import { AIChatPanel } from '@/components/ai/AIChatPanel';
import { Suspense, lazy } from 'react';
import { Loader2 } from 'lucide-react';

// Lazy Loading des pages pour une navigation instantanée
const Index = lazy(() => import('@/pages/Index'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Students = lazy(() => import('@/pages/Students'));
const Teachers = lazy(() => import('@/pages/Teachers'));
const Analytics = lazy(() => import('@/pages/Analytics'));
const Calendar = lazy(() => import('@/pages/Calendar'));
const Messages = lazy(() => import('@/pages/Messages'));
const Settings = lazy(() => import('@/pages/Settings'));
const Invoicing = lazy(() => import('@/pages/Invoicing'));
const Exams = lazy(() => import('@/pages/Exams'));
const Attendance = lazy(() => import('@/pages/Attendance'));
const Classes = lazy(() => import('@/pages/Classes'));
const Profile = lazy(() => import('@/pages/Profile'));
const Documents = lazy(() => import('@/pages/Documents'));
const AdminSettings = lazy(() => import('@/pages/AdminSettings'));
const SchoolPalette = lazy(() => import('@/pages/SchoolPalette'));
const PowerBIDashboard = lazy(() => import('@/pages/PowerBIDashboard'));
const HRManagement = lazy(() => import('@/pages/HRManagement'));
const GoogleSheetsPage = lazy(() => import('@/pages/GoogleSheetsPage'));
const Schedule = lazy(() => import('@/pages/Schedule'));
const DbDashboard = lazy(() => import('@/components/advanced-ui/DbDashboard'));
const NotFound = lazy(() => import('@/pages/NotFound'));
const Login = lazy(() => import('@/pages/Login'));
const Register = lazy(() => import('@/pages/Register'));
const Pricing = lazy(() => import('@/pages/Pricing'));
const Checkout = lazy(() => import('@/pages/Checkout'));
const About = lazy(() => import('@/pages/About'));
const Contact = lazy(() => import('@/pages/Contact'));
const Features = lazy(() => import('@/pages/Features'));
const Blog = lazy(() => import('@/pages/Blog'));
const Documentation = lazy(() => import('@/pages/Documentation'));
const AIAssistant = lazy(() => import('@/pages/AIAssistant'));

const PageLoader = () => (
  <div className="flex h-screen w-full items-center justify-center bg-background/50 backdrop-blur-sm fixed inset-0 z-50">
    <Loader2 className="h-10 w-10 animate-spin text-primary" />
  </div>
);

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
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  {/* Route publique sans MainLayout */}
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/pricing" element={<Pricing />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/features" element={<Features />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/documentation" element={<Documentation />} />
                  
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
                        <Route path="/db-admin" element={<DbDashboard />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/ai-assistant" element={<AIAssistant />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                      <AIChatPanel />
                    </MainLayout>
                  } />
                </Routes>
              </Suspense>
            </Router>
          </TooltipProvider>
        </AuthProvider>
      </ConfigProvider>
    </QueryClientProvider>
  );
}

export default App;
