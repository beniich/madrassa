import { useEffect } from 'react';
import { useEventStore, AppEvent } from '@/stores/useEventStore';
import { useNotificationStore } from '@/stores/useNotificationStore';

export function useAutomation() {
    const { events } = useEventStore();
    const { addNotification } = useNotificationStore();

    // Effect qui écoute les changements dans events
    // TODO: Optimiser pour ne pas re-scanner tous les events, juste le dernier
    const lastEvent = events.length > 0 ? events[0] : null;

    useEffect(() => {
        if (!lastEvent) return;

        // --- RULE 1: If PATIENT_MOVED to 'step-done' -> Notification "Facturation"
        if (lastEvent.type === 'PATIENT_MOVED' && !lastEvent.metadata?.isRead) {
            const { toStepId } = lastEvent.payload;

            if (toStepId === 'step-done') {
                addNotification({
                    title: "Dossier Patient Clôturé",
                    message: "Le patient a été déplacé vers 'Terminé'. Prêt pour facturation.",
                    type: "success",
                    read: false,
                    timestamp: Date.now()
                });
                console.log("[Automation] Triggered: Facturation Notification");
            }
            // --- RULE 2: If PATIENT_MOVED to 'step-emergency' -> Notification "URGENCE"
            else if (toStepId === 'step-emergency') {
                addNotification({
                    title: "ALERTE URGENCE",
                    message: "Un patient a été transféré au service d'urgence !",
                    type: "warning",
                    read: false,
                    timestamp: Date.now()
                });
                console.log("[Automation] Triggered: Urgence Notification");
            }
        }

    }, [lastEvent, addNotification]);
}
