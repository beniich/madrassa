// ============================================================================
// PAGE ANALYTICS - SchoolGenius
// ============================================================================
// Fichier : src/pages/Analytics.tsx
// ============================================================================

import { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Download,
  Calendar,
  Users,
  Award,
  Clock,
  Filter,
  RefreshCw,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

interface AnalyticsData {
  period: string;
  students: number;
  attendance: number;
  average: number;
  newEnrollments: number;
}

interface SubjectPerformance {
  subject: string;
  average: number;
  students: number;
  change: number;
}

interface ClassPerformance {
  class: string;
  students: number;
  average: number;
  attendance: number;
  rank: number;
}

// ============================================================================
// DONNÉES DE DÉMONSTRATION
// ============================================================================

const DEMO_ANALYTICS: AnalyticsData[] = [
  { period: 'Sept', students: 245, attendance: 92, average: 13.2, newEnrollments: 45 },
  { period: 'Oct', students: 248, attendance: 94, average: 13.5, newEnrollments: 3 },
  { period: 'Nov', students: 250, attendance: 91, average: 13.8, newEnrollments: 2 },
  { period: 'Déc', students: 252, attendance: 88, average: 14.1, newEnrollments: 2 },
  { period: 'Jan', students: 255, attendance: 95, average: 14.3, newEnrollments: 3 },
  { period: 'Fév', students: 258, attendance: 93, average: 14.0, newEnrollments: 3 },
];

const SUBJECT_PERFORMANCE: SubjectPerformance[] = [
  { subject: 'Mathématiques', average: 14.2, students: 255, change: 2.5 },
  { subject: 'Français', average: 13.8, students: 255, change: 1.2 },
  { subject: 'Histoire-Géo', average: 15.1, students: 255, change: 3.1 },
  { subject: 'Sciences', average: 13.5, students: 255, change: -0.5 },
  { subject: 'Anglais', average: 14.8, students: 255, change: 1.8 },
  { subject: 'EPS', average: 16.2, students: 255, change: 0.3 },
];

const CLASS_PERFORMANCE: ClassPerformance[] = [
  { class: '5A', students: 28, average: 15.2, attendance: 96, rank: 1 },
  { class: '5B', students: 27, average: 14.8, attendance: 94, rank: 2 },
  { class: '4A', students: 26, average: 14.5, attendance: 93, rank: 3 },
  { class: '4B', students: 25, average: 13.9, attendance: 91, rank: 4 },
  { class: '3A', students: 29, average: 13.2, attendance: 89, rank: 5 },
];

// ============================================================================
// COMPOSANT STATISTIQUES CLÉS
// ============================================================================

const KeyMetrics = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <Users className="w-6 h-6 text-purple-600" />
          </div>
          <div className="flex items-center gap-1 text-green-600">
            <ArrowUp className="w-4 h-4" />
            <span className="text-sm font-semibold">+3.2%</span>
          </div>
        </div>
        <p className="text-3xl font-bold text-gray-900 mb-1">258</p>
        <p className="text-sm text-gray-600">Élèves Totaux</p>
        <p className="text-xs text-gray-500 mt-2">vs mois dernier</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-green-600" />
          </div>
          <div className="flex items-center gap-1 text-green-600">
            <ArrowUp className="w-4 h-4" />
            <span className="text-sm font-semibold">+2.1%</span>
          </div>
        </div>
        <p className="text-3xl font-bold text-gray-900 mb-1">93%</p>
        <p className="text-sm text-gray-600">Taux de Présence</p>
        <p className="text-xs text-gray-500 mt-2">Moyenne mensuelle</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Award className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex items-center gap-1 text-green-600">
            <ArrowUp className="w-4 h-4" />
            <span className="text-sm font-semibold">+0.3</span>
          </div>
        </div>
        <p className="text-3xl font-bold text-gray-900 mb-1">14.0<span className="text-lg text-gray-500">/20</span></p>
        <p className="text-sm text-gray-600">Moyenne Générale</p>
        <p className="text-xs text-gray-500 mt-2">Toutes classes</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
            <Clock className="w-6 h-6 text-orange-600" />
          </div>
          <div className="flex items-center gap-1 text-red-600">
            <ArrowDown className="w-4 h-4" />
            <span className="text-sm font-semibold">-1.5%</span>
          </div>
        </div>
        <p className="text-3xl font-bold text-gray-900 mb-1">12</p>
        <p className="text-sm text-gray-600">Absences/Jour</p>
        <p className="text-xs text-gray-500 mt-2">Moyenne hebdo</p>
      </div>
    </div>
  );
};

// ============================================================================
// COMPOSANT GRAPHIQUE DE PRÉSENCE (Simplifié)
// ============================================================================

const AttendanceChart = () => {
  const maxAttendance = Math.max(...DEMO_ANALYTICS.map((d) => d.attendance));

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900">Évolution de la Présence</h3>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <RefreshCw className="w-4 h-4 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Download className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {DEMO_ANALYTICS.map((data) => (
          <div key={data.period} className="flex items-center gap-4">
            <span className="w-12 text-sm font-medium text-gray-600">
              {data.period}
            </span>
            <div className="flex-1 bg-gray-100 rounded-full h-8 relative overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-end pr-3 rounded-full transition-all duration-500"
                style={{ width: `${(data.attendance / maxAttendance) * 100}%` }}
              >
                <span className="text-xs font-semibold text-white">
                  {data.attendance}%
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 w-16">
              {data.attendance >= 90 ? (
                <TrendingUp className="w-4 h-4 text-green-600" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-600" />
              )}
              <span className="text-sm font-medium text-gray-700">
                {data.students}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// COMPOSANT PERFORMANCE PAR MATIÈRE
// ============================================================================

const SubjectPerformanceChart = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-6">
        Performance par Matière
      </h3>

      <div className="space-y-4">
        {SUBJECT_PERFORMANCE.map((subject) => (
          <div key={subject.subject} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                {subject.subject}
              </span>
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-gray-900">
                  {subject.average}/20
                </span>
                <div
                  className={`flex items-center gap-1 ${
                    subject.change >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {subject.change >= 0 ? (
                    <ArrowUp className="w-4 h-4" />
                  ) : (
                    <ArrowDown className="w-4 h-4" />
                  )}
                  <span className="text-sm font-semibold">
                    {Math.abs(subject.change)}%
                  </span>
                </div>
              </div>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  subject.average >= 14
                    ? 'bg-green-500'
                    : subject.average >= 12
                    ? 'bg-blue-500'
                    : 'bg-yellow-500'
                }`}
                style={{ width: `${(subject.average / 20) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// COMPOSANT CLASSEMENT DES CLASSES
// ============================================================================

const ClassRanking = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-6">
        Classement des Classes
      </h3>

      <div className="space-y-3">
        {CLASS_PERFORMANCE.map((classData) => (
          <div
            key={classData.class}
            className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                classData.rank === 1
                  ? 'bg-yellow-500'
                  : classData.rank === 2
                  ? 'bg-gray-400'
                  : classData.rank === 3
                  ? 'bg-orange-500'
                  : 'bg-gray-300'
              }`}
            >
              {classData.rank}
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-gray-900">{classData.class}</span>
                <span className="text-lg font-bold text-gray-900">
                  {classData.average}/20
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>{classData.students} élèves</span>
                <span>•</span>
                <span>{classData.attendance}% présence</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// PAGE PRINCIPALE
// ============================================================================

export const Analytics = () => {
  const [period, setPeriod] = useState('month');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Statistiques & Analytics
          </h1>
          <p className="text-gray-600 mt-1">
            Analyse détaillée des performances de l'établissement
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg p-1">
            <button
              onClick={() => setPeriod('week')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                period === 'week'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Semaine
            </button>
            <button
              onClick={() => setPeriod('month')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                period === 'month'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Mois
            </button>
            <button
              onClick={() => setPeriod('year')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                period === 'year'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Année
            </button>
          </div>

          <button className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            <Download className="w-5 h-5" />
            Exporter Rapport
          </button>
        </div>
      </div>

      {/* Métriques Clés */}
      <KeyMetrics />

      {/* Graphiques Principaux */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AttendanceChart />
        <SubjectPerformanceChart />
      </div>

      {/* Classement et Détails */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ClassRanking />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Alertes</h3>
          <div className="space-y-4">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2" />
                <div>
                  <p className="font-semibold text-red-900 text-sm">
                    Baisse de performance
                  </p>
                  <p className="text-sm text-red-700 mt-1">
                    Classe 3A : -2.3 points en Mathématiques
                  </p>
                  <p className="text-xs text-red-600 mt-2">Il y a 2 heures</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2" />
                <div>
                  <p className="font-semibold text-yellow-900 text-sm">
                    Absentéisme élevé
                  </p>
                  <p className="text-sm text-yellow-700 mt-1">
                    5 élèves absents 3+ jours consécutifs
                  </p>
                  <p className="text-xs text-yellow-600 mt-2">Aujourd'hui</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                <div>
                  <p className="font-semibold text-green-900 text-sm">
                    Excellente progression
                  </p>
                  <p className="text-sm text-green-700 mt-1">
                    Classe 5A : +3.1 points en moyenne générale
                  </p>
                  <p className="text-xs text-green-600 mt-2">Cette semaine</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
