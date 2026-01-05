// ============================================================================
// PAGE ENSEIGNANTS - SchoolGenius
// ============================================================================
// Fichier : src/pages/Teachers.tsx
// ============================================================================

import { useState } from 'react';
import {
  GraduationCap,
  UserPlus,
  Search,
  Filter,
  Download,
  Mail,
  Phone,
  Calendar,
  BookOpen,
  Clock,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Award,
  Users,
} from 'lucide-react';

interface Teacher {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subject: string;
  classes: string[];
  experience: number;
  students: number;
  hoursPerWeek: number;
  status: 'active' | 'onLeave' | 'inactive';
  hireDate: string;
  photo?: string;
}

const DEMO_TEACHERS: Teacher[] = [
  {
    id: '1',
    firstName: 'Sophie',
    lastName: 'Laurent',
    email: 'sophie.laurent@school.com',
    phone: '+33 6 12 34 56 78',
    subject: 'Mathématiques',
    classes: ['5A', '5B', '4A'],
    experience: 8,
    students: 72,
    hoursPerWeek: 18,
    status: 'active',
    hireDate: '2016-09-01',
  },
  {
    id: '2',
    firstName: 'Thomas',
    lastName: 'Dubois',
    email: 'thomas.dubois@school.com',
    phone: '+33 6 23 45 67 89',
    subject: 'Français',
    classes: ['5A', '4B'],
    experience: 12,
    students: 48,
    hoursPerWeek: 15,
    status: 'active',
    hireDate: '2012-09-01',
  },
  {
    id: '3',
    firstName: 'Marie',
    lastName: 'Petit',
    email: 'marie.petit@school.com',
    phone: '+33 6 34 56 78 90',
    subject: 'Histoire-Géographie',
    classes: ['5B', '4A', '4B'],
    experience: 5,
    students: 68,
    hoursPerWeek: 16,
    status: 'active',
    hireDate: '2019-09-01',
  },
];

const TeacherStats = ({ teachers }: { teachers: Teacher[] }) => {
  const totalTeachers = teachers.length;
  const activeTeachers = teachers.filter((t) => t.status === 'active').length;
  const totalStudents = teachers.reduce((sum, t) => sum + t.students, 0);
  const avgExperience = (
    teachers.reduce((sum, t) => sum + t.experience, 0) / teachers.length
  ).toFixed(1);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <GraduationCap className="w-8 h-8" />
        </div>
        <p className="text-3xl font-bold mb-1">{totalTeachers}</p>
        <p className="text-blue-100 text-sm">Total Enseignants</p>
      </div>

      <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <Users className="w-8 h-8" />
        </div>
        <p className="text-3xl font-bold mb-1">{activeTeachers}</p>
        <p className="text-green-100 text-sm">Enseignants Actifs</p>
      </div>

      <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <BookOpen className="w-8 h-8" />
        </div>
        <p className="text-3xl font-bold mb-1">{totalStudents}</p>
        <p className="text-purple-100 text-sm">Élèves Encadrés</p>
      </div>

      <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <Award className="w-8 h-8" />
        </div>
        <p className="text-3xl font-bold mb-1">{avgExperience}</p>
        <p className="text-orange-100 text-sm">Années d'Expérience Moy.</p>
      </div>
    </div>
  );
};

const TeacherCard = ({
  teacher,
  onView,
  onEdit,
  onDelete,
}: {
  teacher: Teacher;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'onLeave':
        return 'bg-yellow-100 text-yellow-700';
      case 'inactive':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Actif';
      case 'onLeave':
        return 'En congé';
      case 'inactive':
        return 'Inactif';
      default:
        return status;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xl font-bold">
            {teacher.firstName[0]}
            {teacher.lastName[0]}
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-900">
              {teacher.firstName} {teacher.lastName}
            </h3>
            <p className="text-sm text-gray-600 mt-0.5">{teacher.subject}</p>
            <span
              className={`inline-block px-2 py-1 rounded-full text-xs font-semibold mt-2 ${getStatusBadge(
                teacher.status
              )}`}
            >
              {getStatusLabel(teacher.status)}
            </span>
          </div>
        </div>

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
                    onView(teacher.id);
                    setShowMenu(false);
                  }}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 w-full text-left"
                >
                  <Eye className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-gray-700">Voir détails</span>
                </button>
                <button
                  onClick={() => {
                    onEdit(teacher.id);
                    setShowMenu(false);
                  }}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 w-full text-left"
                >
                  <Edit className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-700">Modifier</span>
                </button>
                <button
                  onClick={() => {
                    onDelete(teacher.id);
                    setShowMenu(false);
                  }}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 w-full text-left border-t"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                  <span className="text-sm text-red-600">Supprimer</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Mail className="w-4 h-4" />
          <span>{teacher.email}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Phone className="w-4 h-4" />
          <span>{teacher.phone}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <BookOpen className="w-4 h-4" />
          <span>Classes: {teacher.classes.join(', ')}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="w-4 h-4" />
          <span>{teacher.hoursPerWeek}h/semaine</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900">{teacher.students}</p>
          <p className="text-xs text-gray-600">Élèves</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900">{teacher.classes.length}</p>
          <p className="text-xs text-gray-600">Classes</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900">{teacher.experience}</p>
          <p className="text-xs text-gray-600">Ans</p>
        </div>
      </div>
    </div>
  );
};

export const Teachers = () => {
  const [teachers, setTeachers] = useState<Teacher[]>(DEMO_TEACHERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSubject, setFilterSubject] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const filteredTeachers = teachers.filter((teacher) => {
    const matchesSearch =
      teacher.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.subject.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSubject =
      filterSubject === 'all' || teacher.subject === filterSubject;

    return matchesSearch && matchesSubject;
  });

  const handleView = (id: string) => {
    alert(`Voir détails de l'enseignant ${id}`);
  };

  const handleEdit = (id: string) => {
    alert(`Modifier l'enseignant ${id}`);
  };

  const handleDelete = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet enseignant ?')) {
      setTeachers(teachers.filter((t) => t.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Enseignants</h1>
          <p className="text-gray-600 mt-1">
            Gérez votre corps enseignant efficacement
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
          <UserPlus className="w-5 h-5" />
          Nouvel Enseignant
        </button>
      </div>

      {/* Statistiques */}
      <TeacherStats teachers={teachers} />

      {/* Filtres */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un enseignant..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-600" />
            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Toutes les matières</option>
              <option value="Mathématiques">Mathématiques</option>
              <option value="Français">Français</option>
              <option value="Histoire-Géographie">Histoire-Géographie</option>
              <option value="Sciences">Sciences</option>
            </select>
          </div>

          <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-5 h-5 text-gray-600" />
            Exporter
          </button>
        </div>
      </div>

      {/* Liste des enseignants */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeachers.map((teacher) => (
          <TeacherCard
            key={teacher.id}
            teacher={teacher}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default Teachers;
