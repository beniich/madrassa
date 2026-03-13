import { useState } from 'react';
import { Card, CardContent } from '@/components/ui-1cc/card';
import { Label } from '@/components/ui-1cc/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui-1cc/radio-group';
import { CreditCard } from 'lucide-react';
import type { PaymentMethod } from '@/types/paymentTypes';

interface PaymentMethodSelectorProps {
    selectedMethod: PaymentMethod;
    onMethodChange: (method: PaymentMethod) => void;
    stripeAvailable?: boolean;
    paypalAvailable?: boolean;
}

export const PaymentMethodSelector = ({
    selectedMethod,
    onMethodChange,
    stripeAvailable = true,
    paypalAvailable = true,
}: PaymentMethodSelectorProps) => {
    return (
        <div className="space-y-3">
            <Label className="text-base font-semibold">Mode de paiement</Label>
            <RadioGroup
                value={selectedMethod}
                onValueChange={(value) => onMethodChange(value as PaymentMethod)}
                className="grid grid-cols-2 gap-4"
            >
                {/* Stripe / Card */}
                <div>
                    <RadioGroupItem
                        value="stripe"
                        id="stripe"
                        className="peer sr-only"
                        disabled={!stripeAvailable}
                    />
                    <Label
                        htmlFor="stripe"
                        className={`
              flex flex-col items-center justify-center rounded-lg border-2 p-4 cursor-pointer
              transition-all duration-200
              peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5
              hover:bg-muted/50
              ${!stripeAvailable ? 'opacity-50 cursor-not-allowed' : ''}
            `}
                    >
                        <div className="p-2 rounded-lg bg-[#635BFF]/10 mb-2">
                            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="#635BFF">
                                <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z" />
                            </svg>
                        </div>
                        <span className="font-medium text-sm">Carte bancaire</span>
                        <span className="text-xs text-muted-foreground">Visa, Mastercard...</span>
                    </Label>
                </div>

                {/* PayPal */}
                <div>
                    <RadioGroupItem
                        value="paypal"
                        id="paypal"
                        className="peer sr-only"
                        disabled={!paypalAvailable}
                    />
                    <Label
                        htmlFor="paypal"
                        className={`
              flex flex-col items-center justify-center rounded-lg border-2 p-4 cursor-pointer
              transition-all duration-200
              peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5
              hover:bg-muted/50
              ${!paypalAvailable ? 'opacity-50 cursor-not-allowed' : ''}
            `}
                    >
                        <div className="p-2 rounded-lg bg-[#003087]/10 mb-2">
                            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="#003087">
                                <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.59 3.025-2.566 6.082-8.558 6.082h-2.19c-1.717 0-3.146 1.27-3.402 2.997L5.23 22.54c-.072.45.264.86.72.86h4.247c.508 0 .94-.368 1.02-.867l.03-.162.788-4.99.051-.276a1.028 1.028 0 0 1 1.015-.866h.64c4.149 0 7.394-1.686 8.342-6.561.28-1.44.209-2.593-.861-3.76z" />
                            </svg>
                        </div>
                        <span className="font-medium text-sm">PayPal</span>
                        <span className="text-xs text-muted-foreground">Paiement sécurisé</span>
                    </Label>
                </div>
            </RadioGroup>
        </div>
    );
};
