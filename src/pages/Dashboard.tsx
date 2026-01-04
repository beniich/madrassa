import { Routes, Route } from "react-router-dom";
import OutlookLayout from "@/components/dashboard/OutlookLayout";
import DashboardHome from "./DashboardHome";
import StudentsModule from "./modules/StudentsModule";
import TeachersModule from "./modules/TeachersModule";
import ClassesModule from "./modules/ClassesModule";
import TimetableModule from "./modules/TimetableModule";
import ExamsModule from "./modules/ExamsModule";
import AttendanceModule from "./modules/AttendanceModule";
import CommunicationModule from "./modules/CommunicationModule";
import DocumentsModule from "./modules/DocumentsModule";
import FinanceModule from "./modules/FinanceModule";
import TasksModule from "./modules/TasksModule";
import SettingsModule from "./modules/SettingsModule";
import AIAssistantModule from "./modules/AIAssistantModule";
import { useAuth } from "@/contexts/AuthContext";

const Dashboard = () => {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent shadow-lg"></div>
          <p className="text-muted-foreground font-medium animate-pulse">Initialisation de SchoolGenius...</p>
        </div>
      </div>
    );
  }

  return (
    <OutlookLayout>
      <Routes>
        <Route path="/" element={<DashboardHome />} />
        <Route path="/home" element={<DashboardHome />} />
        <Route path="/students/*" element={<StudentsModule />} />
        <Route path="/teachers/*" element={<TeachersModule />} />
        <Route path="/classes/*" element={<ClassesModule />} />
        <Route path="/timetable/*" element={<TimetableModule />} />
        <Route path="/exams/*" element={<ExamsModule />} />
        <Route path="/attendance/*" element={<AttendanceModule />} />
        <Route path="/communication/*" element={<CommunicationModule />} />
        <Route path="/documents/*" element={<DocumentsModule />} />
        <Route path="/finance/*" element={<FinanceModule />} />
        <Route path="/tasks/*" element={<TasksModule />} />
        <Route path="/settings/*" element={<SettingsModule />} />
        <Route path="/ai-assistant/*" element={<AIAssistantModule />} />
        <Route path="*" element={<DashboardHome />} />
      </Routes>
    </OutlookLayout>
  );
};

export default Dashboard;
