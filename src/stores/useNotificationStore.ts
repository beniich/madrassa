import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type NotificationType =
    | 'appointment_reminder'
    | 'patient_alert'
    | 'schedule_change'
    | 'lab_result'
    | 'message'
    | 'system';

export interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    timestamp: string;
    read: boolean;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    link?: string;
    data?: Record<string, any>;
}

interface NotificationState {
    notifications: Notification[];
    unreadCount: number;

    // Actions
    addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    removeNotification: (id: string) => void;
    clearAll: () => void;
}

// Mock initial notifications
const INITIAL_NOTIFICATIONS: Notification[] = [
    {
        id: 'notif-001',
        type: 'appointment_reminder',
        title: 'RDV dans 30 minutes',
        message: 'Consultation avec Jean Dupont - Salle 3',
        timestamp: new Date().toISOString(),
        read: false,
        priority: 'high',
        link: '/schedule',
    },
    {
        id: 'notif-002',
        type: 'patient_alert',
        title: '⚠️ Patient Critique',
        message: 'Marie Martin - Résultats labo anormaux',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        read: false,
        priority: 'urgent',
        link: '/patients/pat-002',
    },
    {
        id: 'notif-003',
        type: 'lab_result',
        title: 'Résultats Disponibles',
        message: 'Analyse sanguine - Patient #pat-001',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        read: true,
        priority: 'medium',
        link: '/patients/pat-001',
    },
    {
        id: 'notif-004',
        type: 'schedule_change',
        title: 'Modification Planning',
        message: 'RDV de 14h déplacé à 15h30',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        read: true,
        priority: 'low',
    },
];

export const useNotificationStore = create<NotificationState>()(
    persist(
        (set, get) => ({
            notifications: INITIAL_NOTIFICATIONS,
            unreadCount: INITIAL_NOTIFICATIONS.filter(n => !n.read).length,

            addNotification: (notificationData) => {
                const newNotification: Notification = {
                    ...notificationData,
                    id: `notif-${Date.now()}`,
                    timestamp: new Date().toISOString(),
                    read: false,
                };
                set((state) => ({
                    notifications: [newNotification, ...state.notifications],
                    unreadCount: state.unreadCount + 1,
                }));
            },

            markAsRead: (id) => {
                set((state) => {
                    const notification = state.notifications.find(n => n.id === id);
                    if (notification && !notification.read) {
                        return {
                            notifications: state.notifications.map(n =>
                                n.id === id ? { ...n, read: true } : n
                            ),
                            unreadCount: Math.max(0, state.unreadCount - 1),
                        };
                    }
                    return state;
                });
            },

            markAllAsRead: () => {
                set((state) => ({
                    notifications: state.notifications.map(n => ({ ...n, read: true })),
                    unreadCount: 0,
                }));
            },

            removeNotification: (id) => {
                set((state) => {
                    const notification = state.notifications.find(n => n.id === id);
                    return {
                        notifications: state.notifications.filter(n => n.id !== id),
                        unreadCount: notification && !notification.read
                            ? Math.max(0, state.unreadCount - 1)
                            : state.unreadCount,
                    };
                });
            },

            clearAll: () => {
                set({ notifications: [], unreadCount: 0 });
            },
        }),
        {
            name: 'notification-store',
        }
    )
);

// Helper to get notification style
export const getNotificationStyle = (type: NotificationType) => {
    const styles: Record<NotificationType, { icon: string; color: string }> = {
        appointment_reminder: { icon: '📅', color: 'text-blue-500' },
        patient_alert: { icon: '⚠️', color: 'text-red-500' },
        schedule_change: { icon: '🔄', color: 'text-orange-500' },
        lab_result: { icon: '🧪', color: 'text-purple-500' },
        message: { icon: '💬', color: 'text-green-500' },
        system: { icon: '🔔', color: 'text-gray-500' },
    };
    return styles[type] || styles.system;
};

export const getPriorityStyle = (priority: Notification['priority']) => {
    const styles = {
        low: 'bg-gray-100 dark:bg-gray-800',
        medium: 'bg-blue-50 dark:bg-blue-900/20',
        high: 'bg-orange-50 dark:bg-orange-900/20 border-l-2 border-orange-500',
        urgent: 'bg-red-50 dark:bg-red-900/20 border-l-2 border-red-500',
    };
    return styles[priority];
};
