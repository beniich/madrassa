// ============================================================================
// PAGE CALENDAR - SchoolGenius
// ============================================================================
// Fichier : src/pages/Calendar.tsx
// ============================================================================

import { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Plus,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Users,
  X,
  Edit,
  Trash2,
  Filter,
} from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  type: 'exam' | 'meeting' | 'holiday' | 'event' | 'class';
  location?: string;
  participants?: string[];
  color: string;
}

// ============================================================================
// DONNÉES DE DÉMONSTRATION
// ============================================================================

const DEMO_EVENTS: CalendarEvent[] = [
  {
    id: '1',
    title: 'Examen Mathématiques 5A',
    description: 'Examen de fin de trimestre',
    date: '2026-01-15',
    startTime: '09:00',
    endTime: '11:00',
    type: 'exam',
    location: 'Salle 12',
    participants: ['Classe 5A'],
    color: 'bg-red-500',
  },
  {
    id: '2',
    title: 'Réunion Parents-Professeurs',
    description: 'Rencontre trimestrielle',
    date: '2026-01-20',
    startTime: '18:00',
    endTime: '20:00',
    type: 'meeting',
    location: 'Salle de conférence',
    participants: ['Tous les parents'],
    color: 'bg-blue-500',
  },
  {
    id: '3',
    title: 'Sortie Scolaire',
    description: 'Visite du musée',
    date: '2026-01-25',
    startTime: '08:00',
    endTime: '17:00',
    type: 'event',
    location: 'Musée des Sciences',
    participants: ['Classes 4A, 4B'],
    color: 'bg-green-500',
  },
  {
    id: '4',
    title: 'Cours de Français',
    description: 'Cours régulier',
    date: '2026-01-08',
    startTime: '10:00',
    endTime: '11:00',
    type: 'class',
    location: 'Salle 5',
    participants: ['Classe 5A'],
    color: 'bg-purple-500',
  },
];

const EVENT_TYPES = [
  { value: 'exam', label: 'Examen', color: 'bg-red-500' },
  { value: 'meeting', label: 'Réunion', color: 'bg-blue-500' },
  { value: 'holiday', label: 'Vacances', color: 'bg-yellow-500' },
  { value: 'event', label: 'Événement', color: 'bg-green-500' },
  { value: 'class', label: 'Cours', color: 'bg-purple-500' },
];

// ============================================================================
// UTILITAIRES DATE
// ============================================================================

const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (year: number, month: number) => {
  return new Date(year, month, 1).getDay();
};

const MONTHS = [
  'Janvier',
  'Février',
  'Mars',
  'Avril',
  'Mai',
  'Juin',
  'Juillet',
  'Août',
  'Septembre',
  'Octobre',
  'Novembre',
  'Décembre',
];

const DAYS = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

// ============================================================================
// COMPOSANT MODAL ÉVÉNEMENT
// ============================================================================

const EventModal = ({
  event,
  onClose,
  onSave,
  onDelete,
}: {
  event?: CalendarEvent;
  onClose: () => void;
  onSave: (event: CalendarEvent) => void;
  onDelete?: (id: string) => void;
}) => {
  const [formData, setFormData] = useState<Partial<CalendarEvent>>(
    event || {
      title: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      startTime: '09:00',
      endTime: '10:00',
      type: 'class',
      location: '',
      color: 'bg-purple-500',
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: event?.id || Date.now().toString(),
      ...formData,
    } as CalendarEvent);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {event ? 'Modifier l\'événement' : 'Nouvel événement'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Titre */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Titre *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Titre de l'événement"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Description de l'événement"
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Type *
            </label>
            <select
              required
              value={formData.type}
              onChange={(e) => {
                const selectedType = EVENT_TYPES.find(
                  (t) => t.value === e.target.value
                );
                setFormData({
                  ...formData,
                  type: e.target.value as CalendarEvent['type'],
                  color: selectedType?.color || 'bg-purple-500',
                });
              }}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {EVENT_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Date et horaires */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Date *
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Début *
              </label>
              <input
                type="time"
                required
                value={formData.startTime}
                onChange={(e) =>
                  setFormData({ ...formData, startTime: e.target.value })
                }
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Fin *
              </label>
              <input
                type="time"
                required
                value={formData.endTime}
                onChange={(e) =>
                  setFormData({ ...formData, endTime: e.target.value })
                }
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Lieu */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Lieu
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Lieu de l'événement"
            />
          </div>

          {/* Boutons */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div>
              {event && onDelete && (
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Supprimer cet événement ?')) {
                      onDelete(event.id);
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
                {event ? 'Modifier' : 'Créer'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

// ============================================================================
// PAGE PRINCIPALE
// ============================================================================

export const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>(DEMO_EVENTS);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  // Naviguer entre les mois
  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Obtenir les événements d'un jour
  const getEventsForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(
      day
    ).padStart(2, '0')}`;
    return events.filter(
      (event) =>
        event.date === dateStr &&
        (filterType === 'all' || event.type === filterType)
    );
  };

  // Sauvegarder un événement
  const handleSaveEvent = (event: CalendarEvent) => {
    if (selectedEvent) {
      setEvents(events.map((e) => (e.id === event.id ? event : e)));
    } else {
      setEvents([...events, event]);
    }
  };

  // Supprimer un événement
  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter((e) => e.id !== id));
  };

  // Générer les jours du calendrier
  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Calendrier</h1>
          <p className="text-gray-600 mt-1">
            Gérez les événements et l'emploi du temps
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedEvent(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nouvel Événement
        </button>
      </div>

      {/* Navigation et filtres */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={prevMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h2 className="text-xl font-bold text-gray-900 min-w-[200px] text-center">
              {MONTHS[month]} {year}
            </h2>
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-600" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">Tous les types</option>
              {EVENT_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Calendrier */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 overflow-x-auto">
        <div className="min-w-[700px]">
          {/* En-têtes jours */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {DAYS.map((day) => (
              <div
                key={day}
                className="text-center font-semibold text-gray-600 text-sm py-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Jours du mois */}
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((day, index) => {
              const dayEvents = day ? getEventsForDay(day) : [];
              const isToday =
                day === new Date().getDate() &&
                month === new Date().getMonth() &&
                year === new Date().getFullYear();

              return (
                <div
                  key={index}
                  className={`min-h-[100px] p-2 border border-gray-200 rounded-lg ${
                    day ? 'bg-white hover:bg-gray-50' : 'bg-gray-50'
                  } ${isToday ? 'ring-2 ring-purple-500' : ''}`}
                >
                  {day && (
                    <>
                      <div
                        className={`text-sm font-semibold mb-2 ${
                          isToday
                            ? 'text-purple-600'
                            : 'text-gray-900'
                        }`}
                      >
                        {day}
                      </div>
                      <div className="space-y-1">
                        {dayEvents.slice(0, 2).map((event) => (
                          <div
                            key={event.id}
                            onClick={() => {
                              setSelectedEvent(event);
                              setShowModal(true);
                            }}
                            className={`${event.color} text-white text-xs p-1 rounded cursor-pointer hover:opacity-80 transition-opacity`}
                          >
                            <div className="font-medium truncate">
                              {event.title}
                            </div>
                            <div className="text-white/80 truncate">
                              {event.startTime}
                            </div>
                          </div>
                        ))}
                        {dayEvents.length > 2 && (
                          <div className="text-xs text-gray-500 font-medium">
                            +{dayEvents.length - 2} autre(s)
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Liste des prochains événements */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Prochains événements
        </h3>
        <div className="space-y-3">
          {events
            .filter((e) => new Date(e.date) >= new Date())
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .slice(0, 5)
            .map((event) => (
              <div
                key={event.id}
                className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() => {
                  setSelectedEvent(event);
                  setShowModal(true);
                }}
              >
                <div className={`w-1 h-full ${event.color} rounded-full`} />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{event.title}</h4>
                  <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="w-4 h-4" />
                      {new Date(event.date).toLocaleDateString('fr-FR')}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {event.startTime} - {event.endTime}
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {event.location}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <EventModal
          event={selectedEvent || undefined}
          onClose={() => {
            setShowModal(false);
            setSelectedEvent(null);
          }}
          onSave={handleSaveEvent}
          onDelete={selectedEvent ? handleDeleteEvent : undefined}
        />
      )}
    </div>
  );
};

export default Calendar;
