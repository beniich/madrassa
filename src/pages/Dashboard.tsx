
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Users,
  TrendingUp,
  Award,
  AlertTriangle,
  UserPlus,
  FileText,
  Calendar,
  Send,
  Bot,
  BarChart3,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TimetableView } from '@/components/timetable/TimetableView';
import AIDocuments from '@/pages/AIDocuments';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  change: number;
  changeLabel: string;
  icon: React.ElementType;
  color: 'purple' | 'green' | 'yellow' | 'red';
}

const StatCard = ({ title, value, subtitle, change, changeLabel, icon: Icon, color }: StatCardProps) => {
  const colorClasses = {
    purple: { bg: 'bg-purple-50', iconBg: 'bg-purple-100', icon: 'text-purple-600', text: 'text-purple-600' },
    green: { bg: 'bg-green-50', iconBg: 'bg-green-100', icon: 'text-green-600', text: 'text-green-600' },
    yellow: { bg: 'bg-yellow-50', iconBg: 'bg-yellow-100', icon: 'text-yellow-600', text: 'text-yellow-600' },
    red: { bg: 'bg-red-50', iconBg: 'bg-red-100', icon: 'text-red-600', text: 'text-red-600' },
  };

  const colors = colorClasses[color];
  const isPositive = change > 0;

  return (
    <div className={`${colors.bg} rounded-xl p-6 border border-${color}-200`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`${colors.iconBg} p-3 rounded-lg`}>
          <Icon className={`w-6 h-6 ${colors.icon}`} />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">{subtitle}</p>
        <div className={`flex items-center gap-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
          <span className="text-sm font-semibold">{isPositive ? '+' : ''}{change}%</span>
          <span className="text-xs text-gray-500 ml-1">{changeLabel}</span>
        </div>
      </div>
    </div>
  );
};

interface ActionCardProps {
  title: string;
  icon: React.ElementType;
  color: string;
  onClick?: () => void;
}

const ActionCard = ({ title, icon: Icon, color, onClick }: ActionCardProps) => {
  return (
    <button
      onClick={onClick}
      className={`${color} p-6 rounded-xl hover:shadow-lg transition-all duration-300 flex flex-col items-center gap-3 w-full`}
    >
      <div className="p-3 bg-white/50 rounded-lg">
        <Icon className="w-6 h-6" />
      </div>
      <span className="font-semibold text-sm text-center">{title}</span>
    </button>
  );
};

export const Dashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [isTimetableOpen, setIsTimetableOpen] = useState(false);

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px] mb-6">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="ai-documents">Documents IA</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Header Placeholder - restoring existing logic if any */}

          {/* Quick Actions Section */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{t('dashboard.quickActions')}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <ActionCard
                title={t('dashboard.newStudent')}
                icon={UserPlus}
                color="bg-purple-50 text-purple-700 hover:bg-purple-100"
              />
              <ActionCard
                title={t('dashboard.addGrade')}
                icon={FileText}
                color="bg-green-50 text-green-700 hover:bg-green-100"
              />

              {/* Modified Action Card for Timetable */}
              <ActionCard
                title="EMPLOI DU TEMPS (TEST)"
                icon={Calendar}
                color="bg-blue-50 text-blue-700 hover:bg-blue-100"
                onClick={() => setIsTimetableOpen(true)}
              />

              <ActionCard
                title={t('dashboard.sendAnnouncement')}
                icon={Send}
                color="bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
              />

              {/* Switch to AI Documents tab instead of navigation */}
              <ActionCard
                title="Documents IA"
                icon={Bot}
                color="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-xl"
                onClick={() => setActiveTab("ai-documents")}
              />

              <ActionCard
                title={t('dashboard.viewReports')}
                icon={BarChart3}
                color="bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
              />
            </div>
          </div>

          {/* Timetable Modal */}
          <Dialog open={isTimetableOpen} onOpenChange={setIsTimetableOpen}>
            <DialogContent className="max-w-[95vw] w-full h-[90vh] overflow-y-auto sm:max-w-7xl">
              <div className="p-2">
                <h2 className="text-2xl font-bold mb-4">Emploi du Temps</h2>
                <TimetableView />
              </div>
            </DialogContent>
          </Dialog>
        </TabsContent>

        <TabsContent value="ai-documents">
          <AIDocuments />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
