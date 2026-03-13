import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SubscriptionInfo } from '@/types/paymentTypes';

interface SubscriptionStore {
    subscription: SubscriptionInfo | null;
    setSubscription: (subscription: SubscriptionInfo) => void;
    clearSubscription: () => void;
    isSubscribed: () => boolean;
    isPlanActive: (planId: string) => boolean;
}

export const useSubscriptionStore = create<SubscriptionStore>()(
    persist(
        (set, get) => ({
            subscription: null,

            setSubscription: (subscription) => set({ subscription }),

            clearSubscription: () => set({ subscription: null }),

            isSubscribed: () => {
                const { subscription } = get();
                return subscription !== null &&
                    (subscription.status === 'active' || subscription.status === 'trialing');
            },

            isPlanActive: (planId) => {
                const { subscription } = get();
                return subscription !== null &&
                    subscription.planId === planId &&
                    (subscription.status === 'active' || subscription.status === 'trialing');
            },
        }),
        {
            name: 'cloud-industrie-subscription',
        }
    )
);
