import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, Check, ArrowRight, ShieldCheck, AlertCircle } from "lucide-react";
import { paymentService } from "@/lib/paymentService";
import { useToast } from "@/hooks/use-toast";
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { StripeProvider } from "@/components/payment/StripeProvider";

const CheckoutForm: React.FC<{ plan: string }> = ({ plan }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const stripe = useStripe();
  const elements = useElements();
  
  const [schoolName, setSchoolName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const getPlanDetails = () => {
    switch (plan) {
      case 'pro': return { id: 'price_pro', name: 'Pro', price: '499 $', features: ['Élèves illimités', 'IA avancée', 'Support prioritaire'] };
      case 'enterprise': return { id: 'price_enterprise', name: 'Institution', price: 'Sur devis', features: ['Multi-établissements', 'Dev sur-mesure', 'Support 24/7'] };
      default: return { id: 'price_free', name: 'Starter', price: '0 $', features: ['Jusqu\'à 100 élèves', 'Gestion des absences', 'Notes et bulletins'] };
    }
  };

  const details = getPlanDetails();
  const isPaid = plan === 'pro';

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    
    setError(null);
    setIsLoading(true);

    try {
      if (isPaid) {
        // 1. Create Payment Intent on backend
        const { clientSecret } = await paymentService.createPaymentIntent(details.id);

        if (!clientSecret) {
          throw new Error("Impossible d'initialiser le paiement");
        }

        // 2. Confirm payment with Stripe
        const cardElement = elements.getElement(CardElement);
        if (!cardElement) return;

        const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: schoolName,
            },
          },
        });

        if (stripeError) {
          setError(stripeError.message || "Une erreur est survenue lors du paiement.");
          setIsLoading(false);
          return;
        }

        if (paymentIntent?.status === 'succeeded') {
            await paymentService.processPayment({
                planId: details.id,
                paymentIntentId: paymentIntent.id,
                schoolName
            });
        }
      } else {
        // Free migration
        await paymentService.processPayment({
            planId: details.id,
            schoolName
        });
      }

      toast({
        title: "Inscription réussie",
        description: `Bienvenue ! Votre établissement ${schoolName} est maintenant configuré.`,
      });
      navigate('/dashboard');

    } catch (err: any) {
      setError(err.message || "Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Checkout Form */}
      <Card className="bg-white border-none shadow-2xl rounded-3xl overflow-hidden order-2 md:order-1">
        <CardHeader className="pt-8 pb-4">
          <CardTitle className="text-3xl font-black italic tracking-tighter text-gray-900 border-b-4 border-primary inline-block pb-2">Paiement</CardTitle>
          <CardDescription className="text-gray-500 font-bold uppercase tracking-widest text-xs mt-2">
            Complétez votre inscription
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8 space-y-6 text-gray-900">
          <form onSubmit={handlePayment} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="schoolName" className="font-black text-xs uppercase tracking-widest text-gray-400">Nom de l'établissement</Label>
              <Input 
                id="schoolName" 
                required 
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                className="bg-gray-50 border-gray-200 focus:border-primary focus:ring-primary rounded-xl transition-all" 
                placeholder="École Internationale" 
              />
            </div>
            
            {error && (
              <div className="bg-rose-50 border border-rose-100 text-rose-600 px-4 py-3 rounded-xl flex items-center gap-2 text-sm font-bold">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            {isPaid && (
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <Label className="font-black text-xs uppercase tracking-widest text-gray-400">Informations de paiement</Label>
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl focus-within:border-primary transition-all">
                  <CardElement options={{
                    style: {
                      base: {
                        fontSize: '16px',
                        color: '#111827',
                        '::placeholder': { color: '#9ca3af' },
                      },
                      invalid: { color: '#ef4444' },
                    },
                  }} />
                </div>
              </div>
            )}

            <Button 
              type="submit" 
              disabled={isLoading || (isPaid && !stripe)}
              className="w-full mt-6 h-14 bg-[#222222] hover:bg-black text-white rounded-xl font-black uppercase tracking-widest shadow-lg transition-transform hover:-translate-y-1"
            >
              {isLoading ? 'Traitement en cours...' : (isPaid ? `Payer ${details.price}` : 'Valider mon inscription')}
              {!isLoading && <ArrowRight className="ml-2 w-5 h-5 text-primary" />}
            </Button>

            <div className="flex items-center justify-center gap-2 mt-4 text-xs font-bold text-gray-400">
              <ShieldCheck className="w-4 h-4 text-green-500" />
              Paiement 100% sécurisé via Stripe
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Order Summary */}
      <div className="order-1 md:order-2 space-y-6">
        <Card className="bg-[#111111] border-2 border-primary shadow-2xl rounded-3xl overflow-hidden relative">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary to-orange-400" />
          <CardHeader className="border-b border-white/10 pb-6">
            <CardDescription className="text-gray-400 font-bold uppercase tracking-widest text-xs">Résumé de la commande</CardDescription>
            <CardTitle className="text-3xl font-black text-white mt-2">Plan <span className="text-primary uppercase tracking-tight italic">{details.name}</span></CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="flex items-end gap-2 text-white">
              <span className="text-5xl font-black italic tracking-tighter">{details.price}</span>
              <span className="text-gray-400 text-sm font-bold mb-2">/mois</span>
            </div>
            
            <ul className="space-y-4 pt-4 border-t border-white/10">
              {details.features.map((feature, i) => (
                <li key={i} className="flex items-center font-medium text-gray-300">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center mr-3 shrink-0">
                    <Check className="w-3 h-3 text-primary font-black" />
                  </div>
                  {feature}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export const Checkout: React.FC = () => {
  const [searchParams] = useSearchParams();
  const plan = searchParams.get('plan') || 'starter';

  return (
    <div className="min-h-screen bg-[#222222] py-20 px-4 font-sans text-white flex items-center justify-center">
      <StripeProvider>
        <CheckoutForm plan={plan} />
      </StripeProvider>
    </div>
  );
};

export default Checkout;
