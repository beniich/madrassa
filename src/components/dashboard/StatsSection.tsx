import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
    Users, TrendingUp, GraduationCap, Zap, 
    ArrowUp, ArrowDown 
} from 'lucide-react';
import { Card } from "@/components/ui/card";
import { useStudents, useTeachers } from '@/hooks/useOfflineData';

interface StatCardProps {
  title: string;
  value: string | number;
  sub: string;
  change: number;
  up: boolean;
  icon: React.ElementType;
  color: string;
}

const StatCard = ({ title, value, sub, change, up, icon: Icon, color }: StatCardProps) => {
  return (
    <Card className="relative overflow-hidden border-none shadow-lg bg-white p-6 group hover:translate-y-[-5px] transition-all duration-300">
      <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${color} opacity-[0.03] rounded-bl-[100px] group-hover:opacity-[0.07] transition-opacity`}></div>
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl bg-gradient-to-br ${color} text-white shadow-lg`}>
          <Icon className="h-6 w-6" />
        </div>
        <div className={`flex items-center gap-1 font-black text-xs ${up ? 'text-green-500' : 'text-red-500'}`}>
          {up ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
          {change}%
        </div>
      </div>
      <p className="text-3xl font-black text-gray-900 tracking-tighter">{value}</p>
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{title}</p>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-[10px] font-bold text-gray-400 italic">{sub}</span>
        <div className="h-1 w-12 bg-gray-100 rounded-full overflow-hidden">
            <div className={`h-full bg-gradient-to-r ${color} w-3/4`}></div>
        </div>
      </div>
    </Card>
  );
};

export const StatsSection = () => {
    const students = useStudents() || [];
    const teachers = useTeachers() || [];
    const totalStudents = students.length;
    const activeTeachers = teachers.filter(t => t.status === 'active').length;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
                title="ÉLÈVES ACTIFS" 
                value={totalStudents} 
                sub="Session 2024-2025" 
                change={12} 
                up={true} 
                icon={Users} 
                color="from-primary to-orange-400" 
            />
            <StatCard 
                title="PRÉSENCE MOY." 
                value="94.2%" 
                sub="Flux de fréquentation" 
                change={2.3} 
                up={true} 
                icon={TrendingUp} 
                color="from-[#222222] to-gray-600" 
            />
            <StatCard 
                title="CORPS ENSEIGNANT" 
                value={activeTeachers} 
                sub="Postes opérationnels" 
                change={4} 
                up={true} 
                icon={GraduationCap} 
                color="from-primary to-orange-400" 
            />
            <StatCard 
                title="REVENUS ESTIMÉS" 
                value="12.5k $" 
                sub="Balance financière" 
                change={15} 
                up={false} 
                icon={Zap} 
                color="from-[#222222] to-gray-600" 
            />
        </div>
    );
};

// Default export for lazy loading
export default StatsSection;
