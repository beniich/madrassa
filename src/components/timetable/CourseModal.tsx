import { useState, useEffect } from 'react';
import { X, Trash2 } from 'lucide-react';

export interface ScheduleSlot {
    id: string;
    day: number; // 0-4 (Lundi-Vendredi)
    hour: string;
    subject: string;
    teacher: string;
    room: string;
    class: string;
    color: string;
}

export const SUBJECTS = [
    { name: 'Mathématiques', color: 'bg-blue-500' },
    { name: 'Français', color: 'bg-green-500' },
    { name: 'Histoire-Géo', color: 'bg-purple-500' },
    { name: 'Anglais', color: 'bg-yellow-500' },
    { name: 'Sciences', color: 'bg-red-500' },
    { name: 'EPS', color: 'bg-orange-500' },
    { name: 'Arts Plastiques', color: 'bg-pink-500' },
    { name: 'Musique', color: 'bg-indigo-500' },
];

export const HOURS = [
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

export const DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];

interface CourseModalProps {
    slot?: ScheduleSlot;
    day?: number;
    hour?: string;
    onClose: () => void;
    onSave: (slot: ScheduleSlot) => void;
    onDelete?: (id: string) => void;
}

export const CourseModal = ({
    slot,
    day,
    hour,
    onClose,
    onSave,
    onDelete,
}: CourseModalProps) => {
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
