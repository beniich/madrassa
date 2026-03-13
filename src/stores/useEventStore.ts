import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type EventType =
    | 'PATIENT_ADMITTED'
    | 'PATIENT_MOVED'
    | 'PATIENT_DISCHARGED'
    | 'VITALS_LOGGED'
    | 'NOTE_ADDED'
    | 'MEDICATION_PRESCRIBED'
    | 'ALERT_TRIGGERED'
    | 'TASK_CREATED'
    | 'TASK_COMPLETED';

export interface AppEvent {
    id: string;
    type: EventType;
    timestamp: number; // Unix timestamp
    actorId: string; // User ID
    workspaceId: string;
    patientId?: string; // Optional context
    payload: Record<string, any>; // Flexible data
    metadata?: {
        severity?: 'info' | 'warning' | 'error' | 'critical';
        channel?: 'system' | 'email' | 'whatsapp' | 'sms';
        isRead?: boolean;
    };
}

interface EventState {
    events: AppEvent[];

    // Actions
    publishEvent: (event: Omit<AppEvent, 'id' | 'timestamp'>) => void;
    markAsRead: (eventId: string) => void;
    clearEvents: (workspaceId: string) => void;

    // Selectors
    getWorkspaceEvents: (workspaceId: string) => AppEvent[];
    getPatientEvents: (patientId: string) => AppEvent[];
}

export const useEventStore = create<EventState>()(
    persist(
        (set, get) => ({
            events: [],

            publishEvent: (eventData) => {
                const newEvent: AppEvent = {
                    ...eventData,
                    id: `evt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    timestamp: Date.now(),
                };

                console.log(`[EventBus] Published: ${newEvent.type}`, newEvent);

                set((state) => ({
                    events: [newEvent, ...state.events].slice(0, 1000) // Keep last 1000 events
                }));

                // --- AUTOMATION ENGINE HOOK (Simplifié pour l'instant) ---
                // Ici on pourrait appeler un service externe, mais pour la démo on le fait "in-store"
                // Exemple : Si patient critique -> Créer alerte
                if (newEvent.type === 'ALERT_TRIGGERED' && newEvent.metadata?.severity === 'critical') {
                    // Trigger side effects here if needed
                }
            },

            markAsRead: (eventId) => set((state) => ({
                events: state.events.map(e => e.id === eventId ? { ...e, metadata: { ...e.metadata, isRead: true } } : e)
            })),

            clearEvents: (workspaceId) => set((state) => ({
                events: state.events.filter(e => e.workspaceId !== workspaceId)
            })),

            getWorkspaceEvents: (workspaceId) => {
                return get().events.filter(e => e.workspaceId === workspaceId);
            },

            getPatientEvents: (patientId) => {
                return get().events.filter(e => e.patientId === patientId);
            }
        }),
        {
            name: 'medflow-event-storage',
        }
    )
);
