import { useEffect, useCallback } from 'react';
import { toast } from 'sonner';

// Types pour les événements en temps réel
export interface RealtimeEvent<T = unknown> {
    eventType: 'INSERT' | 'UPDATE' | 'DELETE';
    table: string;
    new?: T;
    old?: T;
}

type EventHandler<T> = (payload: RealtimeEvent<T>) => void;

// Stockage des listeners
const eventListeners: Map<string, Set<EventHandler<unknown>>> = new Map();

// Simuler les événements en temps réel (en mode local)
// En production, cela utiliserait Supabase Realtime
const STORAGE_KEY = 'cloud_industrie_data';
let lastData: string | null = null;

const checkForChanges = () => {
    const currentData = localStorage.getItem(STORAGE_KEY);

    if (lastData !== null && currentData !== lastData) {
        // Des changements ont été détectés
        try {
            const prev = JSON.parse(lastData);
            const curr = JSON.parse(currentData || '{}');

            // Vérifier chaque table
            ['tasks', 'deals', 'products', 'customers', 'sales', 'recommendations'].forEach(table => {
                const prevItems = prev[table] || [];
                const currItems = curr[table] || [];

                // Détecter les ajouts
                if (currItems.length > prevItems.length) {
                    const newItem = currItems[currItems.length - 1];
                    notifyListeners(table, {
                        eventType: 'INSERT',
                        table,
                        new: newItem
                    });
                }

                // Détecter les suppressions
                if (currItems.length < prevItems.length) {
                    notifyListeners(table, {
                        eventType: 'DELETE',
                        table,
                        old: prevItems.find((p: { id: string }) =>
                            !currItems.some((c: { id: string }) => c.id === p.id)
                        )
                    });
                }

                // Détecter les modifications
                currItems.forEach((currItem: { id: string; updated_at?: string }) => {
                    const prevItem = prevItems.find((p: { id: string }) => p.id === currItem.id);
                    if (prevItem && prevItem.updated_at !== currItem.updated_at) {
                        notifyListeners(table, {
                            eventType: 'UPDATE',
                            table,
                            new: currItem,
                            old: prevItem
                        });
                    }
                });
            });
        } catch (error) {
            console.error('Error detecting realtime changes:', error);
        }
    }

    lastData = currentData;
};

const notifyListeners = (table: string, event: RealtimeEvent) => {
    const listeners = eventListeners.get(table);
    if (listeners) {
        listeners.forEach(handler => {
            try {
                handler(event);
            } catch (error) {
                console.error('Realtime handler error:', error);
            }
        });
    }
};

// Démarrer la vérification périodique
let pollInterval: number | null = null;

const startPolling = () => {
    if (pollInterval === null) {
        lastData = localStorage.getItem(STORAGE_KEY);
        pollInterval = window.setInterval(checkForChanges, 1000); // Vérifier toutes les secondes
    }
};

const stopPolling = () => {
    if (pollInterval !== null) {
        clearInterval(pollInterval);
        pollInterval = null;
    }
};

/**
 * Hook pour écouter les changements en temps réel sur une table
 * @param table - Nom de la table à écouter
 * @param handler - Fonction appelée lors d'un changement
 */
export const useRealtimeSubscription = <T>(
    table: string,
    handler: EventHandler<T>
) => {
    useEffect(() => {
        // Ajouter le listener
        if (!eventListeners.has(table)) {
            eventListeners.set(table, new Set());
        }
        eventListeners.get(table)!.add(handler as EventHandler<unknown>);

        // Démarrer le polling si nécessaire
        startPolling();

        return () => {
            // Retirer le listener
            eventListeners.get(table)?.delete(handler as EventHandler<unknown>);

            // Arrêter le polling si plus aucun listener
            const hasListeners = Array.from(eventListeners.values()).some(set => set.size > 0);
            if (!hasListeners) {
                stopPolling();
            }
        };
    }, [table, handler]);
};

/**
 * Hook pour afficher des notifications toast sur les changements
 * @param table - Nom de la table à écouter
 * @param labels - Labels pour les notifications (singular, insert, update, delete)
 */
export const useRealtimeNotifications = (
    table: string,
    labels: {
        singular: string;
        insert?: string;
        update?: string;
        delete?: string;
    }
) => {
    const handler = useCallback((event: RealtimeEvent) => {
        const itemName = (event.new as { title?: string; name?: string })?.title ||
            (event.new as { name?: string })?.name ||
            labels.singular;

        switch (event.eventType) {
            case 'INSERT':
                toast.success(labels.insert || `Nouveau ${labels.singular} ajouté`, {
                    description: itemName,
                });
                break;
            case 'UPDATE':
                toast.info(labels.update || `${labels.singular} mis à jour`, {
                    description: itemName,
                });
                break;
            case 'DELETE':
                toast.warning(labels.delete || `${labels.singular} supprimé`, {
                    description: itemName,
                });
                break;
        }
    }, [labels]);

    useRealtimeSubscription(table, handler);
};

/**
 * Hook pour obtenir les données en temps réel d'une table
 * @param table - Nom de la table
 * @param initialData - Données initiales
 * @returns [data, setData] - Données actuelles et fonction de mise à jour
 */
export const useRealtimeData = <T extends { id: string }>(
    table: string,
    initialData: T[]
): [T[], (data: T[]) => void] => {
    const [data, setData] = useState(initialData);

    const handler = useCallback((event: RealtimeEvent<T>) => {
        switch (event.eventType) {
            case 'INSERT':
                if (event.new) {
                    setData(prev => [...prev, event.new as T]);
                }
                break;
            case 'UPDATE':
                if (event.new) {
                    setData(prev => prev.map(item =>
                        item.id === (event.new as T).id ? (event.new as T) : item
                    ));
                }
                break;
            case 'DELETE':
                if (event.old) {
                    setData(prev => prev.filter(item => item.id !== (event.old as T).id));
                }
                break;
        }
    }, []);

    useRealtimeSubscription(table, handler);

    return [data, setData];
};

import { useState } from 'react';
