import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui-1cc/button';
import { Label } from '@/components/ui-1cc/label';
import { Loader2, Lock } from 'lucide-react';
import { useState } from 'react';

interface StripePaymentProps {
    amount: number;
    currency?: string;
    onSuccess: (paymentIntentId: string) => void;
    onError: (error: string) => void;
    disabled?: boolean;
}

export const StripePayment = ({
    amount,
    currency = 'eur',
    onSuccess,
    onError,
    disabled = false,
}: StripePaymentProps) => {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async () => {
        if (!stripe || !elements) {
            onError('Stripe n\'est pas encore chargé');
            return;
        }

        setIsProcessing(true);

        try {
            const cardElement = elements.getElement(CardElement);
            if (!cardElement) {
                throw new Error('Élément de carte non trouvé');
            }

            // Create payment method
            const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({
                type: 'card',
                card: cardElement,
            });

            if (pmError) {
                throw new Error(pmError.message);
            }

            // In production, you would send paymentMethod.id to your backend
            // which would create a PaymentIntent and return the client_secret
            // For demo, we simulate success

            // Simulated success for demo purposes
            // In production: const { clientSecret } = await createPaymentIntent(amount, currency, paymentMethod.id);
            // const { error: confirmError } = await stripe.confirmCardPayment(clientSecret);

            console.log('Payment method created:', paymentMethod.id);

            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            onSuccess(paymentMethod.id);
        } catch (error) {
            onError((error as Error).message || 'Erreur lors du paiement');
        } finally {
            setIsProcessing(false);
        }
    };

    const cardElementOptions = {
        style: {
            base: {
                fontSize: '16px',
                color: 'hsl(var(--foreground))',
                '::placeholder': {
                    color: 'hsl(var(--muted-foreground))',
                },
                backgroundColor: 'transparent',
            },
            invalid: {
                color: 'hsl(var(--destructive))',
            },
        },
        hidePostalCode: true,
    };

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label>Informations de carte</Label>
                <div className="p-4 border rounded-lg bg-background">
                    <CardElement options={cardElementOptions} />
                </div>
                <p className="text-xs text-muted-foreground">
                    Utilisez la carte de test: 4242 4242 4242 4242
                </p>
            </div>

            <Button
                className="w-full h-12 text-base"
                onClick={handleSubmit}
                disabled={!stripe || isProcessing || disabled}
            >
                {isProcessing ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                    <Lock className="mr-2 h-5 w-5" />
                )}
                {isProcessing ? 'Traitement...' : `Payer ${amount}€`}
            </Button>
        </div>
    );
};
