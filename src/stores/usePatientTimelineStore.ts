import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Types for Medical Events
export type MedicalEventType =
    | 'admission'
    | 'consultation'
    | 'exam'
    | 'prescription'
    | 'alert'
    | 'discharge'
    | 'note'
    | 'surgery'
    | 'lab_result';

export interface MedicalEventAuthor {
    id: string;
    name: string;
    role: 'doctor' | 'nurse' | 'admin' | 'secretary' | 'system';
}

export interface MedicalEvent {
    id: string;
    patientId: string;
    type: MedicalEventType;
    title: string;
    description?: string;
    author: MedicalEventAuthor;
    timestamp: string; // ISO string
    data?: Record<string, any>;
    severity?: 'info' | 'warning' | 'critical';
}

interface PatientTimelineState {
    events: MedicalEvent[];

    // Actions
    addEvent: (event: Omit<MedicalEvent, 'id' | 'timestamp'>) => void;
    getPatientEvents: (patientId: string) => MedicalEvent[];
    getEventsByType: (patientId: string, type: MedicalEventType) => MedicalEvent[];
    removeEvent: (eventId: string) => void;
    clearPatientEvents: (patientId: string) => void;
}

// Mock initial events for demonstration
const INITIAL_EVENTS: MedicalEvent[] = [
    {
        id: 'evt-001',
        patientId: 'pat-001',
        type: 'admission',
        title: 'Admission aux urgences',
        description: 'Patient admis pour douleurs thoraciques sévères.',
        author: { id: 'staff-1', name: 'Dr. Gregory House', role: 'doctor' },
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        severity: 'warning'
    },
    {
        id: 'evt-002',
        patientId: 'pat-001',
        type: 'exam',
        title: 'ECG réalisé',
        description: 'Électrocardiogramme effectué. Résultats normaux.',
        author: { id: 'staff-3', name: 'Inf. Marie Curie', role: 'nurse' },
        timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        severity: 'info'
    },
    {
        id: 'evt-003',
        patientId: 'pat-001',
        type: 'lab_result',
        title: 'Résultats analyse sanguine',
        description: 'Taux de cholestérol élevé. Glycémie normale.',
        author: { id: 'system', name: 'Laboratoire', role: 'system' },
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        data: { cholesterol: 2.8, glucose: 1.1 },
        severity: 'warning'
    },
    {
        id: 'evt-004',
        patientId: 'pat-001',
        type: 'consultation',
        title: 'Consultation cardiologie',
        description: 'Consultation de suivi avec Dr. Wilson. Prescription de statines.',
        author: { id: 'staff-2', name: 'Dr. James Wilson', role: 'doctor' },
        timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        severity: 'info'
    },
    {
        id: 'evt-005',
        patientId: 'pat-001',
        type: 'prescription',
        title: 'Ordonnance émise',
        description: 'Atorvastatine 20mg - 1 comprimé/jour pendant 3 mois.',
        author: { id: 'staff-2', name: 'Dr. James Wilson', role: 'doctor' },
        timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000 + 3600000).toISOString(),
        data: { medication: 'Atorvastatine', dosage: '20mg', frequency: '1x/jour' },
        severity: 'info'
    },
    {
        id: 'evt-006',
        patientId: 'pat-001',
        type: 'alert',
        title: '⚠️ Allergie détectée',
        description: 'Patient allergique à la Pénicilline. Mise à jour du dossier.',
        author: { id: 'staff-1', name: 'Dr. Gregory House', role: 'doctor' },
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        severity: 'critical'
    },
    {
        id: 'evt-007',
        patientId: 'pat-001',
        type: 'note',
        title: 'Note de suivi',
        description: 'Patient stable. Sortie prévue demain matin.',
        author: { id: 'staff-3', name: 'Inf. Marie Curie', role: 'nurse' },
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        severity: 'info'
    },
];

export const usePatientTimelineStore = create<PatientTimelineState>()(
    persist(
        (set, get) => ({
            events: INITIAL_EVENTS,

            addEvent: (eventData) => {
                const newEvent: MedicalEvent = {
                    ...eventData,
                    id: `evt-${Date.now()}`,
                    timestamp: new Date().toISOString(),
                };
                set((state) => ({
                    events: [...state.events, newEvent].sort(
                        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
                    ),
                }));
            },

            getPatientEvents: (patientId) => {
                return (get().events || [])
                    .filter((e) => e.patientId === patientId)
                    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
            },

            getEventsByType: (patientId, type) => {
                return (get().events || [])
                    .filter((e) => e.patientId === patientId && e.type === type)
                    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
            },

            removeEvent: (eventId) => {
                set((state) => ({
                    events: state.events.filter((e) => e.id !== eventId),
                }));
            },

            clearPatientEvents: (patientId) => {
                set((state) => ({
                    events: state.events.filter((e) => e.patientId !== patientId),
                }));
            },
        }),
        {
            name: 'patient-timeline-store',
        }
    )
);

// Helper to get event icon and color
export const getEventStyle = (type: MedicalEventType) => {
    const styles: Record<MedicalEventType, { icon: string; color: string; bgColor: string }> = {
        admission: { icon: '🟢', color: 'text-green-600', bgColor: 'bg-green-100 dark:bg-green-900/30' },
        consultation: { icon: '🩺', color: 'text-blue-600', bgColor: 'bg-blue-100 dark:bg-blue-900/30' },
        exam: { icon: '🧪', color: 'text-purple-600', bgColor: 'bg-purple-100 dark:bg-purple-900/30' },
        prescription: { icon: '💊', color: 'text-orange-600', bgColor: 'bg-orange-100 dark:bg-orange-900/30' },
        alert: { icon: '⚠️', color: 'text-red-600', bgColor: 'bg-red-100 dark:bg-red-900/30' },
        discharge: { icon: '🚪', color: 'text-gray-600', bgColor: 'bg-gray-100 dark:bg-gray-900/30' },
        note: { icon: '📝', color: 'text-slate-600', bgColor: 'bg-slate-100 dark:bg-slate-900/30' },
        surgery: { icon: '🔪', color: 'text-pink-600', bgColor: 'bg-pink-100 dark:bg-pink-900/30' },
        lab_result: { icon: '🔬', color: 'text-cyan-600', bgColor: 'bg-cyan-100 dark:bg-cyan-900/30' },
    };
    return styles[type] || styles.note;
};
