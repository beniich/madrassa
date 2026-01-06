// ============================================================================
// PAGE SCHEDULE - Emploi du Temps - SchoolGenius
// ============================================================================
// Fichier : src/pages/Schedule.tsx
// ============================================================================

import { useState } from 'react';
import {
  Clock,
  Calendar,
  Download,
  Plus,
  Edit,
  Trash2,
  X,
  Users,
  MapPin,
  Book,
  AlertCircle,
  Filter,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

interface ScheduleSlot {
  id: string;
  day: number; // 0-4 (Lundi-Vendredi)
  hour: string;
  subject: string;
  teacher: string;
  room: string;
  class: string;
  color: string;
}

interface Conflict {
  type: 'teacher' | 'room' | 'class';
  message: string;
  slots: string[];
}

// ============================================================================
// DONNÉES DE DÉMONSTRATION
// ============================================================================

const HOURS = [
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
];

const DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];

const DEMO_SCHEDULE: ScheduleSlot[] = [
  {
    id: '1',
    day: 0,
    hour: '08:00',
    subject: 'Mathématiques',
    teacher: 'Sophie Laurent',
    room: 'Salle 12',
    class: '5A',
    color: 'bg-blue-500',
  },
  {
    id: '2',
    day: 0,
    hour: '09:00',
    subject: 'Français',
    teacher: 'Thomas Dubois',
    room: 'Salle 5',
    class: '5A',
    color: 'bg-green-500',
  },
  {
    id: '3',
    day: 0,
    hour: '10:00',
    subject: 'Histoire-Géo',
    teacher: 'Marie Petit',
    room: 'Salle 8',
    class: '5A',
    color: 'bg-purple-500',
  },
  {
    id: '4',
    day: 1,
    hour: '08:00',
    subject: 'Anglais',
    teacher: 'Jean Martin',
    room: 'Salle 3',
    class: '5A',
    color: 'bg-yellow-500',
  },
  {
    id: '5',
    day: 1,
    hour: '10:00',
    subject: 'Sciences',
    teacher: 'Paul Bernard',
    room: 'Labo 1',
    class: '5A',
    color: 'bg-red-500',
  },
  {
    id: '6',
    day: 2,
    hour: '09:00',
    subject: 'EPS',
    teacher: 'Claire Durand',
    room: 'Gymnase',
    class: '5A',
    color: 'bg-orange-500',
  },
  {
    id: '7',
    day: 3,
    hour: '08:00',
    subject: 'Mathématiques',
    teacher: 'Sophie Laurent',
    room: 'Salle 12',
    class: '5A',
    color: 'bg-blue-500',
  },
  {
    id: '8',
    day: 4,
    hour: '09:00',
    subject: 'Arts Plastiques',
    teacher: 'Luc Moreau',
    room: 'Salle 20',
    class: '5A',
    color: 'bg-pink-500',
  },
];

const SUBJECTS = [
  { name: 'Mathématiques', color: 'bg-blue-500' },
  { name: 'Français', color: 'bg-green-500' },
  { name: 'Histoire-Géo', color: 'bg-purple-500' },
  { name: 'Anglais', color: 'bg-yellow-500' },
  { name: 'Sciences', color: 'bg-red-500' },
  { name: 'EPS', color: 'bg-orange-500' },
  { name: 'Arts Plastiques', color: 'bg-pink-500' },
  { name: 'Musique', color: 'bg-indigo-500' },
];

// ============================================================================
// COMPOSANT MODAL COURS
// ============================================================================

const CourseModal = ({
  slot,
  day,
  hour,
  onClose,
  onSave,
  onDelete,
}: {
  slot?: ScheduleSlot;
  day?: number;
  hour?: string;
  onClose: () => void;
  onSave: (slot: ScheduleSlot) => void;
  onDelete?: (id: string) => void;
}) => {
  const [formData, setFormData] = useState<Partial<ScheduleSlot>>(
    slot || {
      day: day ?? 0,
      hour: hour ?? '08:00',
      subject: '',
      teacher: '',
      room: '',
      class: '5A',
      color: 'bg-blue-500',
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedSubject = SUBJECTS.find((s) => s.name === formData.subject);
    onSave({
      id: slot?.id || Date.now().toString(),
      ...formData,
      color: selectedSubject?.color || 'bg-blue-500',
    } as ScheduleSlot);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-lg w-full">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {slot ? 'Modifier le cours' : 'Nouveau cours'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Matière */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Matière *
            </label>
            <select
              required
              value={formData.subject}
              onChange={(e) =>
                setFormData({ ...formData, subject: e.target.value })
              }
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Sélectionner...</option>
              {SUBJECTS.map((subject) => (
                <option key={subject.name} value={subject.name}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>

          {/* Enseignant */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Enseignant *
            </label>
            <input
              type="text"
              required
              value={formData.teacher}
              onChange={(e) =>
                setFormData({ ...formData, teacher: e.target.value })
              }
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Nom de l'enseignant"
            />
          </div>

          {/* Salle */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Salle *
            </label>
            <input
              type="text"
              required
              value={formData.room}
              onChange={(e) =>
                setFormData({ ...formData, room: e.target.value })
              }
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Numéro de salle"
            />
          </div>

          {/* Classe */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Classe *
            </label>
            <select
              required
              value={formData.class}
              onChange={(e) =>
                setFormData({ ...formData, class: e.target.value })
              }
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="5A">5A</option>
              <option value="5B">5B</option>
              <option value="4A">4A</option>
              <option value="4B">4B</option>
              <option value="3A">3A</option>
            </select>
          </div>

          {/* Jour et heure */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Jour *
              </label>
              <select
                required
                value={formData.day}
                onChange={(e) =>
                  setFormData({ ...formData, day: Number(e.target.value) })
                }
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {DAYS.map((day, index) => (
                  <option key={index} value={index}>
                    {day}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Heure *
              </label>
              <select
                required
                value={formData.hour}
                onChange={(e) =>
                  setFormData({ ...formData, hour: e.target.value })
                }
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {HOURS.map((hour) => (
                  <option key={hour} value={hour}>
                    {hour}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Boutons */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div>
              {slot && onDelete && (
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Supprimer ce cours ?')) {
                      onDelete(slot.id);
                      onClose();
                    }
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Supprimer
                </button>
              )}
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                {slot ? 'Modifier' : 'Ajouter'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

// ============================================================================
// COMPOSANT CARTE COURS
// ============================================================================

const CourseCard = ({
  slot,
  onClick,
}: {
  slot: ScheduleSlot;
  onClick: () => void;
}) => {
  return (
    <div
      onClick={onClick}
      className={`${slot.color} text-white p-3 rounded-lg cursor-pointer hover:opacity-90 transition-all shadow-sm hover:shadow-md h-full`}
    >
      <div className="flex items-start justify-between mb-2">
        <p className="font-bold text-sm">{slot.subject}</p>
        <Edit className="w-3.5 h-3.5 opacity-70" />
      </div>
      <div className="space-y-1 text-xs">
        <div className="flex items-center gap-1.5 opacity-90">
          <Users className="w-3 h-3" />
          <span>{slot.teacher}</span>
        </div>
        <div className="flex items-center gap-1.5 opacity-90">
          <MapPin className="w-3 h-3" />
          <span>{slot.room}</span>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// PAGE PRINCIPALE
// ============================================================================

export const Schedule = () => {
  const [schedule, setSchedule] = useState<ScheduleSlot[]>(DEMO_SCHEDULE);
  const [selectedClass, setSelectedClass] = useState('5A');
  const [showModal, setShowModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<ScheduleSlot | null>(null);
  const [modalDay, setModalDay] = useState<number>();
  const [modalHour, setModalHour] = useState<string>();
  const [viewMode, setViewMode] = useState<'teacher' | 'class'>('class');

  // Filtrer par classe
  const filteredSchedule = schedule.filter(
    (slot) => slot.class === selectedClass
  );

  // Obtenir le cours pour un créneau
  const getSlot = (day: number, hour: string) => {
    return filteredSchedule.find((s) => s.day === day && s.hour === hour);
  };

  // Détecter les conflits
  const detectConflicts = (): Conflict[] => {
    const conflicts: Conflict[] = [];
    const grouped = new Map<string, ScheduleSlot[]>();

    schedule.forEach((slot) => {
      const key = `${slot.day}-${slot.hour}`;
      if (!grouped.has(key)) {
        grouped.set(key, []);
      }
      grouped.get(key)!.push(slot);
    });

    grouped.forEach((slots, key) => {
      if (slots.length > 1) {
        // Conflit enseignant
        const teacherMap = new Map<string, ScheduleSlot[]>();
        slots.forEach((slot) => {
          if (!teacherMap.has(slot.teacher)) {
            teacherMap.set(slot.teacher, []);
          }
          teacherMap.get(slot.teacher)!.push(slot);
        });
        teacherMap.forEach((tSlots, teacher) => {
          if (tSlots.length > 1) {
            conflicts.push({
              type: 'teacher',
              message: `${teacher} a ${tSlots.length} cours en même temps`,
              slots: tSlots.map((s) => s.id),
            });
          }
        });

        // Conflit salle
        const roomMap = new Map<string, ScheduleSlot[]>();
        slots.forEach((slot) => {
          if (!roomMap.has(slot.room)) {
            roomMap.set(slot.room, []);
          }
          roomMap.get(slot.room)!.push(slot);
        });
        roomMap.forEach((rSlots, room) => {
          if (rSlots.length > 1) {
            conflicts.push({
              type: 'room',
              message: `${room} utilisée ${rSlots.length} fois`,
              slots: rSlots.map((s) => s.id),
            });
          }
        });
      }
    });

    return conflicts;
  };

  const conflicts = detectConflicts();

  // Statistiques
  const totalHours = filteredSchedule.length;
  const uniqueSubjects = new Set(filteredSchedule.map((s) => s.subject)).size;
  const uniqueTeachers = new Set(filteredSchedule.map((s) => s.teacher)).size;

  const handleSaveSlot = (slot: ScheduleSlot) => {
    if (selectedSlot) {
      setSchedule(schedule.map((s) => (s.id === slot.id ? slot : s)));
    } else {
      setSchedule([...schedule, slot]);
    }
  };

  const handleDeleteSlot = (id: string) => {
    setSchedule(schedule.filter((s) => s.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Emploi du Temps</h1>
          <p className="text-gray-600 mt-1">
            Gérez les cours et horaires de l'établissement
          </p>
        </div>
        <div className="flex gap-3">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="5A">Classe 5A</option>
            <option value="5B">Classe 5B</option>
            <option value="4A">Classe 4A</option>
            <option value="4B">Classe 4B</option>
            <option value="3A">Classe 3A</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-5 h-5 text-gray-600" />
            Exporter PDF
          </button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalHours}</p>
              <p className="text-sm text-gray-600">Heures/Semaine</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Book className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {uniqueSubjects}
              </p>
              <p className="text-sm text-gray-600">Matières</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {uniqueTeachers}
              </p>
              <p className="text-sm text-gray-600">Enseignants</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {conflicts.length}
              </p>
              <p className="text-sm text-gray-600">Conflits</p>
            </div>
          </div>
        </div>
      </div>

      {/* Alertes conflits */}
      {conflicts.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-red-900 mb-2">
                {conflicts.length} conflit(s) détecté(s)
              </h3>
              <ul className="space-y-1">
                {conflicts.slice(0, 3).map((conflict, index) => (
                  <li key={index} className="text-sm text-red-700">
                    • {conflict.message}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Grille emploi du temps */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-4 text-left font-bold text-gray-900 sticky left-0 bg-gray-50 z-10">
                  Horaires
                </th>
                {DAYS.map((day) => (
                  <th
                    key={day}
                    className="p-4 text-left font-bold text-gray-900"
                  >
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {HOURS.map((hour) => (
                <tr key={hour} className="border-b border-gray-200">
                  <td className="p-4 font-semibold text-gray-700 sticky left-0 bg-white z-10">
                    {hour}
                  </td>
                  {DAYS.map((_, dayIndex) => {
                    const slot = getSlot(dayIndex, hour);
                    return (
                      <td
                        key={`${hour}-${dayIndex}`}
                        className="p-2 border-l border-gray-200"
                      >
                        {slot ? (
                          <CourseCard
                            slot={slot}
                            onClick={() => {
                              setSelectedSlot(slot);
                              setShowModal(true);
                            }}
                          />
                        ) : (
                          <button
                            onClick={() => {
                              setSelectedSlot(null);
                              setModalDay(dayIndex);
                              setModalHour(hour);
                              setShowModal(true);
                            }}
                            className="w-full h-full min-h-[80px] border-2 border-dashed border-gray-200 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-all flex items-center justify-center group"
                          >
                            <Plus className="w-5 h-5 text-gray-400 group-hover:text-purple-600" />
                          </button>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Légende */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-bold text-gray-900 mb-4">Légende des matières</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {SUBJECTS.map((subject) => (
            <div key={subject.name} className="flex items-center gap-2">
              <div className={`w-4 h-4 ${subject.color} rounded`} />
              <span className="text-sm text-gray-700">{subject.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <CourseModal
          slot={selectedSlot || undefined}
          day={modalDay}
          hour={modalHour}
          onClose={() => {
            setShowModal(false);
            setSelectedSlot(null);
            setModalDay(undefined);
            setModalHour(undefined);
          }}
          onSave={handleSaveSlot}
          onDelete={selectedSlot ? handleDeleteSlot : undefined}
        />
      )}
    </div>
  );
};

export default Schedule;
