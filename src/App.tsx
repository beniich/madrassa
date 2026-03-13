// src/App.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider, Outlet, useLocation } from 'react-router-dom';
import { AuthProvider } from "@/contexts/AuthContext";
import { ConfigProvider } from "@/contexts/ConfigContext";
import { MainLayout } from '@/components/layout/MainLayout';
import { CustomCursor } from '@/components/common/CustomCursor';
import { Suspense, lazy } from 'react';
import { Loader2 } from 'lucide-react';
import { TopBarProgress } from '@/components/common/TopBarProgress';

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

const PageLoader = () => (
  <div className="flex h-screen w-full items-center justify-center bg-background/50 backdrop-blur-sm fixed inset-0 z-50">
    <Loader2 className="h-10 w-10 animate-spin text-primary" />
  </div>
);

const AppLayout = () => {
  return (
    <>
      <TopBarProgress />
      <Suspense fallback={<PageLoader />}>
        <Outlet />
      </Suspense>
    </>
  );
};

const ProtectedLayout = () => {
  return (
    <MainLayout>
      <Suspense fallback={<PageLoader />}>
        <Outlet />
      </Suspense>
    </MainLayout>
  );
};

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      // Public Routes
      { path: "/", element: <Index /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "/pricing", element: <Pricing /> },
      { path: "/checkout", element: <Checkout /> },
      { path: "/about", element: <About /> },
      { path: "/contact", element: <Contact /> },
      { path: "/features", element: <Features /> },
      { path: "/blog", element: <Blog /> },
      { path: "/documentation", element: <Documentation /> },
      
      // Protected Routes Wrapper
      {
        element: <ProtectedLayout />,
        children: [
          { path: "/dashboard", element: <Dashboard /> },
          { path: "/students", element: <Students /> },
          { path: "/teachers", element: <Teachers /> },
          { path: "/classes", element: <Classes /> },
          { path: "/analytics", element: <Analytics /> },
          { path: "/calendar", element: <Calendar /> },
          { path: "/attendance", element: <Attendance /> },
          { path: "/exams", element: <Exams /> },
          { path: "/invoicing", element: <Invoicing /> },
          { path: "/documents", element: <Documents /> },
          { path: "/schedule", element: <Schedule /> },
          { path: "/messages", element: <Messages /> },
          { path: "/settings", element: <Settings /> },
          { path: "/admin/settings", element: <AdminSettings /> },
          { path: "/admin/palette", element: <SchoolPalette /> },
          { path: "/powerbi", element: <PowerBIDashboard /> },
          { path: "/hr-management", element: <HRManagement /> },
          { path: "/googlesheets", element: <GoogleSheetsPage /> },
          { path: "/profile", element: <Profile /> },
          { path: "*", element: <NotFound /> },
        ]
      }
    ]
  }
]);

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
            <RouterProvider router={router} />
          </TooltipProvider>
        </AuthProvider>
      </ConfigProvider>
    </QueryClientProvider>
  );
}

export default App;
