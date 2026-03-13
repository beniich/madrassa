import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { Loader2 } from 'lucide-react';

interface PayPalPaymentProps {
    amount: number;
    planId: string;
    billingCycle: 'monthly' | 'yearly';
    onSuccess: (orderId: string) => void;
    onError: (error: string) => void;
}

export const PayPalPayment = ({
    amount,
    planId,
    billingCycle,
    onSuccess,
    onError,
}: PayPalPaymentProps) => {
    const [{ isPending, isRejected }] = usePayPalScriptReducer();

    if (isPending) {
        return (
            <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground">Chargement de PayPal...</span>
            </div>
        );
    }

    if (isRejected) {
        return (
            <div className="text-center py-8 text-destructive">
                <p>Impossible de charger PayPal. Veuillez réessayer.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <PayPalButtons
                style={{
                    layout: 'vertical',
                    color: 'blue',
                    shape: 'rect',
                    label: 'pay',
                    height: 48,
                }}
                createOrder={(data, actions) => {
                    return actions.order.create({
                        intent: 'CAPTURE',
                        purchase_units: [{
                            amount: {
                                value: amount.toString(),
                                currency_code: 'EUR',
                            },
                            description: `Cloud Industrie - Plan ${planId} (${billingCycle})`,
                        }],
                    });
                }}
                onApprove={async (data, actions) => {
                    if (actions.order) {
                        const details = await actions.order.capture();
                        console.log('PayPal order captured:', details);
                        onSuccess(details.id || data.orderID || 'demo-order');
                    } else {
                        onSuccess(data.orderID || 'demo-order');
                    }
                }}
                onError={(err) => {
                    console.error('PayPal error:', err);
                    onError('Erreur PayPal. Veuillez réessayer.');
                }}
                onCancel={() => {
                    console.log('PayPal cancelled');
                }}
            />
            <p className="text-xs text-center text-muted-foreground">
                Vous serez redirigé vers PayPal pour compléter le paiement
            </p>
        </div>
    );
};
