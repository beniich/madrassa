import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PaymentSettings {
    // Stripe
    stripePublishableKey: string;
    stripeSecretKey: string;
    stripeWebhookSecret: string;
    stripeTestMode: boolean;

    // PayPal
    paypalClientId: string;
    paypalClientSecret: string;
    paypalSandboxMode: boolean;

    // General
    defaultPaymentMethod: 'stripe' | 'paypal';
}

interface PaymentSettingsStore {
    settings: PaymentSettings;
    updateSettings: (settings: Partial<PaymentSettings>) => void;
    getActiveStripeKey: () => string;
    getActivePayPalClientId: () => string;
}

const defaultSettings: PaymentSettings = {
    stripePublishableKey: '',
    stripeSecretKey: '',
    stripeWebhookSecret: '',
    stripeTestMode: true,
    paypalClientId: '',
    paypalClientSecret: '',
    paypalSandboxMode: true,
    defaultPaymentMethod: 'stripe',
};

export const usePaymentSettingsStore = create<PaymentSettingsStore>()(
    persist(
        (set, get) => ({
            settings: defaultSettings,

            updateSettings: (newSettings) =>
                set((state) => ({
                    settings: { ...state.settings, ...newSettings }
                })),

            getActiveStripeKey: () => {
                const { settings } = get();
                // Use env variable as fallback, then stored key
                return settings.stripePublishableKey ||
                    import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ||
                    '';
            },

            getActivePayPalClientId: () => {
                const { settings } = get();
                // Use env variable as fallback, then stored key
                return settings.paypalClientId ||
                    import.meta.env.VITE_PAYPAL_CLIENT_ID ||
                    '';
            },
        }),
        {
            name: 'cloud-industrie-payment-settings',
        }
    )
);
