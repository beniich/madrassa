// ============================================================================
// PAGE ÉLÈVES COMPLÈTE - SchoolGenius
// ============================================================================
// Fichier : src/pages/Students.tsx
// ============================================================================

import { useState } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Download,
  Upload,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Mail,
  Phone,
  Calendar,
  Award,
  TrendingUp,
  AlertCircle,
  Check,
  X,
} from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  grade: string;
  class: string;
  average: number;
  attendance: number;
  status: 'active' | 'inactive' | 'suspended';
  photo?: string;
  address: string;
  parentName: string;
  parentPhone: string;
  enrollmentDate: string;
}

// ============================================================================
// DONNÉES DE DÉMONSTRATION
// ============================================================================

const DEMO_STUDENTS: Student[] = [
  {
    id: '1',
    firstName: 'Marie',
    lastName: 'Dubois',
    email: 'marie.dubois@email.com',
    phone: '+33 6 12 34 56 78',
    dateOfBirth: '2010-03-15',
    grade: '5ème',
    class: '5A',
    average: 15.5,
    attendance: 95,
    status: 'active',
    address: '12 Rue de la Paix, Paris',
    parentName: 'Jean Dubois',
    parentPhone: '+33 6 98 76 54 32',
    enrollmentDate: '2023-09-01',
  },
  {
    id: '2',
    firstName: 'Lucas',
    lastName: 'Martin',
    email: 'lucas.martin@email.com',
    phone: '+33 6 23 45 67 89',
    dateOfBirth: '2011-07-22',
    grade: '4ème',
    class: '4B',
    average: 12.8,
    attendance: 88,
    status: 'active',
    address: '45 Avenue Victor Hugo, Lyon',
    parentName: 'Sophie Martin',
    parentPhone: '+33 6 87 65 43 21',
    enrollmentDate: '2023-09-01',
  },
  {
    id: '3',
    firstName: 'Emma',
    lastName: 'Bernard',
    email: 'emma.bernard@email.com',
    phone: '+33 6 34 56 78 90',
    dateOfBirth: '2010-11-08',
    grade: '5ème',
    class: '5A',
    average: 17.2,
    attendance: 98,
    status: 'active',
    address: '78 Boulevard Saint-Michel, Marseille',
    parentName: 'Pierre Bernard',
    parentPhone: '+33 6 76 54 32 10',
    enrollmentDate: '2023-09-01',
  },
];

// ============================================================================
// COMPOSANT STATISTIQUES ÉLÈVES
// ============================================================================

const StudentStats = ({ students }: { students: Student[] }) => {
  const totalStudents = students.length;
  const activeStudents = students.filter((s) => s.status === 'active').length;
  const avgGrade = (
    students.reduce((sum, s) => sum + s.average, 0) / students.length
  ).toFixed(1);
  const avgAttendance = (
    students.reduce((sum, s) => sum + s.attendance, 0) / students.length
  ).toFixed(0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <Users className="w-8 h-8" />
          <TrendingUp className="w-5 h-5 opacity-70" />
        </div>
        <p className="text-3xl font-bold mb-1">{totalStudents}</p>
        <p className="text-purple-100 text-sm">Total Élèves</p>
      </div>

      <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <Check className="w-8 h-8" />
          <TrendingUp className="w-5 h-5 opacity-70" />
        </div>
        <p className="text-3xl font-bold mb-1">{activeStudents}</p>
        <p className="text-green-100 text-sm">Élèves Actifs</p>
      </div>

      <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <Award className="w-8 h-8" />
          <TrendingUp className="w-5 h-5 opacity-70" />
        </div>
        <p className="text-3xl font-bold mb-1">{avgGrade}/20</p>
        <p className="text-blue-100 text-sm">Moyenne Générale</p>
      </div>

      <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <Calendar className="w-8 h-8" />
          <TrendingUp className="w-5 h-5 opacity-70" />
        </div>
        <p className="text-3xl font-bold mb-1">{avgAttendance}%</p>
        <p className="text-yellow-100 text-sm">Taux de Présence</p>
      </div>
    </div>
  );
};

// ============================================================================
// COMPOSANT LIGNE TABLEAU
// ============================================================================

const StudentRow = ({
  student,
  onView,
  onEdit,
  onDelete,
}: {
  student: Student;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'inactive':
        return 'bg-gray-100 text-gray-700';
      case 'suspended':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Actif';
      case 'inactive':
        return 'Inactif';
      case 'suspended':
        return 'Suspendu';
      default:
        return status;
    }
  };

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-semibold">
            {student.firstName[0]}
            {student.lastName[0]}
          </div>
          <div>
            <p className="font-semibold text-gray-900">
              {student.firstName} {student.lastName}
            </p>
            <p className="text-sm text-gray-500">{student.email}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 text-gray-700">{student.class}</td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-yellow-500" />
          <span className="font-semibold text-gray-900">{student.average}/20</span>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="w-full max-w-[100px] bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                student.attendance >= 90
                  ? 'bg-green-500'
                  : student.attendance >= 75
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
              }`}
              style={{ width: `${student.attendance}%` }}
            />
          </div>
          <span className="text-sm font-medium text-gray-700">
            {student.attendance}%
          </span>
        </div>
      </td>
      <td className="px-6 py-4">
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(
            student.status
          )}`}
        >
          {getStatusLabel(student.status)}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <MoreVertical className="w-5 h-5 text-gray-600" />
          </button>

          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-20">
                <button
                  onClick={() => {
                    onView(student.id);
                    setShowMenu(false);
                  }}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 w-full text-left transition-colors"
                >
                  <Eye className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-gray-700">Voir détails</span>
                </button>
                <button
                  onClick={() => {
                    onEdit(student.id);
                    setShowMenu(false);
                  }}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 w-full text-left transition-colors"
                >
                  <Edit className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-700">Modifier</span>
                </button>
                <button
                  onClick={() => {
                    onDelete(student.id);
                    setShowMenu(false);
                  }}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 w-full text-left transition-colors border-t"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                  <span className="text-sm text-red-600">Supprimer</span>
                </button>
              </div>
            </>
          )}
        </div>
      </td>
    </tr>
  );
};

// ============================================================================
// PAGE PRINCIPALE
// ============================================================================

export const Students = () => {
  const [students, setStudents] = useState<Student[]>(DEMO_STUDENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterClass, setFilterClass] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Filtrage
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesClass = filterClass === 'all' || student.class === filterClass;

    return matchesSearch && matchesClass;
  });

  // Actions
  const handleView = (id: string) => {
    alert(`Voir détails de l'élève ${id}`);
  };

  const handleEdit = (id: string) => {
    alert(`Modifier l'élève ${id}`);
  };

  const handleDelete = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet élève ?')) {
      setStudents(students.filter((s) => s.id !== id));
    }
  };

  const handleExport = () => {
    alert('Exportation en cours...');
  };

  const handleImport = () => {
    alert('Importation en cours...');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Élèves</h1>
          <p className="text-gray-600 mt-1">
            Gérez tous vos élèves en un seul endroit
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
        >
          <UserPlus className="w-5 h-5" />
          Nouvel Élève
        </button>
      </div>

      {/* Statistiques */}
      <StudentStats students={students} />

      {/* Filtres et Actions */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Recherche */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un élève..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Filtre Classe */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-600" />
            <select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">Toutes les classes</option>
              <option value="5A">5A</option>
              <option value="5B">5B</option>
              <option value="4A">4A</option>
              <option value="4B">4B</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={handleImport}
              className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Upload className="w-5 h-5 text-gray-600" />
              <span className="hidden sm:inline">Importer</span>
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download className="w-5 h-5 text-gray-600" />
              <span className="hidden sm:inline">Exporter</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tableau */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Élève
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Classe
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Moyenne
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Présence
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Statut
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <StudentRow
                    key={student.id}
                    student={student}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 font-medium">Aucun élève trouvé</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Essayez de modifier vos critères de recherche
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Affichage de {filteredStudents.length} sur {students.length} élèves
        </p>
        <div className="flex gap-2">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50">
            Précédent
          </button>
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            1
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            2
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            Suivant
          </button>
        </div>
      </div>
    </div>
  );
};

export default Students;
