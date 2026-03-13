export type PaymentMethod = 'stripe' | 'paypal';

export interface PaymentState {
    selectedMethod: PaymentMethod;
    isProcessing: boolean;
    error: string | null;
}

export interface SubscriptionInfo {
    planId: string;
    billingCycle: 'monthly' | 'yearly';
    status: 'active' | 'cancelled' | 'past_due' | 'trialing';
    currentPeriodEnd: string;
    paymentMethod: PaymentMethod;
    customerId?: string;
    subscriptionId?: string;
}

export interface CheckoutResult {
    success: boolean;
    subscriptionId?: string;
    error?: string;
}
