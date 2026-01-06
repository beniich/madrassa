// ============================================================================
// TABLEAU DE BORD AMÉLIORÉ - SchoolGenius
// ============================================================================
// Fichier : src/pages/Dashboard.tsx
// ============================================================================

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

// ============================================================================
// COMPOSANTS DE CARTES STATISTIQUES
// ============================================================================

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
    purple: {
      bg: 'bg-purple-50',
      iconBg: 'bg-purple-100',
      icon: 'text-purple-600',
      text: 'text-purple-600',
    },
    green: {
      bg: 'bg-green-50',
      iconBg: 'bg-green-100',
      icon: 'text-green-600',
      text: 'text-green-600',
    },
    yellow: {
      bg: 'bg-yellow-50',
      iconBg: 'bg-yellow-100',
      icon: 'text-yellow-600',
      text: 'text-yellow-600',
    },
    red: {
      bg: 'bg-red-50',
      iconBg: 'bg-red-100',
      icon: 'text-red-600',
      text: 'text-red-600',
    },
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
          {isPositive ? (
            <ArrowUp className="w-4 h-4" />
          ) : (
            <ArrowDown className="w-4 h-4" />
          )}
          <span className="text-sm font-semibold">
            {isPositive ? '+' : ''}{change}%
          </span>
          <span className="text-xs text-gray-500 ml-1">{changeLabel}</span>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// COMPOSANT ACTION CARD
// ============================================================================

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

// ============================================================================
// PAGE DASHBOARD
// ============================================================================

export const Dashboard = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord</h1>
          <p className="text-gray-600 mt-1">
            Vue d'ensemble de votre établissement • {new Date().toLocaleDateString('fr-FR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
          <Bot className="w-5 h-5" />
          <span className="font-medium">Scanner anomalies (IA Offline)</span>
        </button>
      </div>

      {/* Statistics Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Élèves"
          value="0"
          subtitle="Classes actives"
          change={12}
          changeLabel="vs mois dernier"
          icon={Users}
          color="purple"
        />
        
        <StatCard
          title="Taux de Présence"
          value="0%"
          subtitle="Aujourd'hui"
          change={2.3}
          changeLabel="vs mois dernier"
          icon={TrendingUp}
          color="green"
        />
        
        <StatCard
          title="Moyenne Générale"
          value="13.4/20"
          subtitle="Trimestre en cours"
          change={0.8}
          changeLabel="vs mois dernier"
          icon={Award}
          color="yellow"
        />
        
        <StatCard
          title="Alertes IA"
          value="0"
          subtitle="À traiter localement"
          change={0}
          changeLabel="aucune nouvelle"
          icon={AlertTriangle}
          color="red"
        />
      </div>

      {/* Quick Actions Section */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Actions Rapides</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <ActionCard
            title="Nouvel Élève"
            icon={UserPlus}
            color="bg-purple-50 text-purple-700 hover:bg-purple-100"
          />
          <ActionCard
            title="Ajouter Note"
            icon={FileText}
            color="bg-green-50 text-green-700 hover:bg-green-100"
          />
          <ActionCard
            title="Créer Séance"
            icon={Calendar}
            color="bg-blue-50 text-blue-700 hover:bg-blue-100"
          />
          <ActionCard
            title="Envoyer Annonce"
            icon={Send}
            color="bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
          />
          <ActionCard
            title="Demander à l'IA"
            icon={Bot}
            color="bg-orange-50 text-orange-700 hover:bg-orange-100"
          />
          <ActionCard
            title="Voir Rapports"
            icon={BarChart3}
            color="bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
          />
        </div>
      </div>

      {/* Charts Section - Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1 */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Évolution de la Présence</h3>
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
            <p className="text-gray-400">Graphique à venir</p>
          </div>
        </div>

        {/* Chart 2 */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Répartition des Notes</h3>
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
            <p className="text-gray-400">Graphique à venir</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Activité Récente</h3>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900">Action {i}</p>
                <p className="text-sm text-gray-600">Description de l'activité</p>
                <p className="text-xs text-gray-400 mt-1">Il y a {i * 15} minutes</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
