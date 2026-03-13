import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const stripe = useStripe();
  const elements = useElements();
  
  const [schoolName, setSchoolName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const getPlanDetails = () => {
    switch (plan) {
      case 'pro': return { 
        id: 'price_pro', 
        name: t('pricing.pro.name'), 
        price: t('pricing.pro.price'), 
        features: t('pricing.pro.features', { returnObjects: true }) as string[] 
      };
      case 'enterprise': return { 
        id: 'price_enterprise', 
        name: t('pricing.enterprise.name'), 
        price: t('pricing.enterprise.price'), 
        features: t('pricing.enterprise.features', { returnObjects: true }) as string[] 
      };
      default: return { 
        id: 'price_free', 
        name: t('pricing.starter.name'), 
        price: t('pricing.starter.price'), 
        features: t('pricing.starter.features', { returnObjects: true }) as string[] 
      };
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
          throw new Error(t('checkout.errors.initFailed'));
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
          setError(stripeError.message || t('checkout.errors.paymentFailed'));
          setIsLoading(false);
          return;
        }

        if (paymentIntent?.status === 'succeeded') {
            await paymentService.processPayment({
                planId: details.id,
                paymentIntentId: paymentIntent.id,
                schoolName
            });
            localStorage.setItem('schoolgenius_plan', details.id);
        }
      } else {
        // Free migration
        await paymentService.processPayment({
            planId: details.id,
            schoolName
        });
        localStorage.setItem('schoolgenius_plan', details.id);
      }

      toast({
        title: t('checkout.success.title'),
        description: t('checkout.success.description', { schoolName }),
      });
      navigate('/dashboard');

    } catch (err: unknown) {
      const error = err as { message?: string };
      setError(error.message || t('checkout.errors.generic'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Checkout Form */}
      <Card className="bg-white border-none shadow-2xl rounded-3xl overflow-hidden order-2 md:order-1">
        <CardHeader className="pt-8 pb-4">
          <CardTitle className="text-3xl font-black italic tracking-tighter text-gray-900 border-b-4 border-primary inline-block pb-2">{t('checkout.title')}</CardTitle>
          <CardDescription className="text-gray-500 font-bold uppercase tracking-widest text-xs mt-2">
            {t('checkout.subtitle')}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8 space-y-6 text-gray-900">
          <form onSubmit={handlePayment} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="schoolName" className="font-black text-xs uppercase tracking-widest text-gray-400">{t('checkout.schoolName')}</Label>
              <Input 
                id="schoolName" 
                required 
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                className="bg-gray-50 border-gray-200 focus:border-primary focus:ring-primary rounded-xl transition-all" 
                placeholder={t('checkout.schoolPlaceholder')} 
              />
            </div>
            
            {error && (
              <div className="bg-rose-50 border border-rose-100 text-rose-600 px-4 py-3 rounded-xl flex items-center gap-2 text-sm font-bold">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}
            
            <div className="bg-orange-50 border border-orange-200 text-orange-700 px-4 py-3 rounded-xl flex items-start gap-3 text-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                    <strong className="block font-black uppercase tracking-widest text-[10px] mb-1">Mode Démonstration</strong>
                    Les paiements sont actuellement simulés. Aucune carte réelle ne sera débitée. Utilisez la carte de test Stripe standard (ex: 4242 4242...).
                </div>
            </div>

            {isPaid && (
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <Label className="font-black text-xs uppercase tracking-widest text-gray-400">{t('checkout.paymentInfo')}</Label>
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
              {isLoading ? t('checkout.processing') : (isPaid ? t('checkout.payAmount', { price: details.price }) : t('checkout.validate'))}
              {!isLoading && <ArrowRight className="ml-2 w-5 h-5 text-primary" />}
            </Button>

            <div className="flex items-center justify-center gap-2 mt-4 text-xs font-bold text-gray-400">
              <ShieldCheck className="w-4 h-4 text-green-500" />
              {t('checkout.securePayment')}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Order Summary */}
      <div className="order-1 md:order-2 space-y-6">
        <Card className="bg-[#111111] border-2 border-primary shadow-2xl rounded-3xl overflow-hidden relative">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary to-orange-400" />
          <CardHeader className="border-b border-white/10 pb-6">
            <CardDescription className="text-gray-400 font-bold uppercase tracking-widest text-xs">{t('checkout.summary.title')}</CardDescription>
            <CardTitle className="text-3xl font-black text-white mt-2">{t('checkout.summary.plan', { name: details.name })}</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="flex items-end gap-2 text-white">
              <span className="text-5xl font-black italic tracking-tighter">{details.price}</span>
              <span className="text-gray-400 text-sm font-bold mb-2">{t('pricing.starter.unit')}</span>
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
