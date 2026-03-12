import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, Check, ArrowRight, ShieldCheck } from "lucide-react";

export const Checkout: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const plan = searchParams.get('plan') || 'starter';
  const [isLoading, setIsLoading] = useState(false);

  const getPlanDetails = () => {
    switch (plan) {
      case 'pro': return { name: 'Pro', price: '499 MAD', features: ['Élèves illimités', 'IA avancée', 'Support prioritaire'] };
      case 'enterprise': return { name: 'Institution', price: 'Sur devis', features: ['Multi-établissements', 'Dev sur-mesure', 'Support 24/7'] };
      default: return { name: 'Starter', price: '0 MAD', features: ['Jusqu\'à 100 élèves', 'Gestion des absences', 'Notes et bulletins'] };
    }
  };

  const details = getPlanDetails();

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate payment
    setTimeout(() => {
      setIsLoading(false);
      navigate('/login'); // After successful subscription, send them to login
    }, 2000);
  };

  // If enterprise or starter, maybe no credit card needed immediately, but for demo we show a form
  const isPaid = plan === 'pro';

  return (
    <div className="min-h-screen bg-[#222222] py-20 px-4 font-sans text-white flex items-center justify-center">
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
                <Input id="schoolName" required className="bg-gray-50 border-gray-200 focus:border-primary focus:ring-primary rounded-xl transition-all" placeholder="École Internationale" />
              </div>
              
              {isPaid && (
                <>
                  <div className="space-y-2 pt-4 border-t border-gray-100">
                    <Label htmlFor="card" className="font-black text-xs uppercase tracking-widest text-gray-400">Numéro de carte</Label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input id="card" required className="pl-10 bg-gray-50 border-gray-200 focus:border-primary focus:ring-primary rounded-xl transition-all" placeholder="0000 0000 0000 0000" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry" className="font-black text-xs uppercase tracking-widest text-gray-400">Expiration</Label>
                      <Input id="expiry" required placeholder="MM/AA" className="bg-gray-50 border-gray-200 focus:border-primary focus:ring-primary rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvc" className="font-black text-xs uppercase tracking-widest text-gray-400">CVC</Label>
                      <Input id="cvc" required placeholder="123" className="bg-gray-50 border-gray-200 focus:border-primary focus:ring-primary rounded-xl" />
                    </div>
                  </div>
                </>
              )}

              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full mt-6 h-14 bg-[#222222] hover:bg-black text-white rounded-xl font-black uppercase tracking-widest shadow-lg transition-transform hover:-translate-y-1"
              >
                {isLoading ? 'Traitement en cours...' : (isPaid ? `Payer ${details.price}` : 'Valider mon inscription')}
                {!isLoading && <ArrowRight className="ml-2 w-5 h-5 text-primary" />}
              </Button>

              <div className="flex items-center justify-center gap-2 mt-4 text-xs font-bold text-gray-400">
                <ShieldCheck className="w-4 h-4 text-green-500" />
                Paiement 100% sécurisé
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
    </div>
  );
};

export default Checkout;
