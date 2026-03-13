import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, ArrowRight } from "lucide-react";

export const Pricing: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleSelectPlan = (plan: string) => {
    navigate(`/checkout?plan=${plan}`);
  };

  return (
    <div className="min-h-screen bg-[#222222] py-20 px-4 font-sans text-white flex items-center">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16 space-y-4">
            <h1 className="text-5xl font-black tracking-tighter italic text-white" dangerouslySetInnerHTML={{ __html: t('pricing.title').replace('Simples', '<span class="text-primary">Simples</span>').replace('Simple', '<span class="text-primary">Simple</span>') }} />
            <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">
              {t('pricing.subtitle')}
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Starter Plan */}
          <Card className="bg-white border-none shadow-xl rounded-3xl overflow-hidden hover:-translate-y-2 transition-transform duration-300">
            <CardHeader className="text-center pt-10 pb-6 border-b border-gray-100 bg-gray-50">
              <CardTitle className="text-2xl font-black uppercase tracking-tight text-gray-900">{t('pricing.starter.name')}</CardTitle>
              <CardDescription className="text-gray-500 font-bold text-xs uppercase tracking-widest mt-2">{t('pricing.starter.description')}</CardDescription>
              <div className="mt-6 flex justify-center items-baseline text-gray-900">
                <span className="text-5xl font-black italic tracking-tighter">{t('pricing.starter.price')}</span>
                <span className="text-gray-500 ml-1 text-sm font-bold">{t('pricing.starter.unit')}</span>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <ul className="space-y-4">
                {(t('pricing.starter.features', { returnObjects: true }) as string[]).map((feature, i) => (
                  <li key={i} className="flex items-center text-gray-700 font-medium">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mr-3 shrink-0">
                      <Check className="w-3 h-3 text-green-600 font-black" />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="p-8 pt-0">
              <Button onClick={() => handleSelectPlan('starter')} className="w-full bg-gray-900 hover:bg-black text-white rounded-xl h-12 font-black uppercase tracking-widest">
                {t('pricing.starter.cta')} <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardFooter>
          </Card>

          {/* Pro Plan - Highlighted */}
          <Card className="bg-[#111111] border-2 border-primary shadow-2xl shadow-primary/20 rounded-3xl overflow-hidden transform md:-translate-y-4 hover:-translate-y-6 transition-transform duration-300 relative">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary to-orange-400" />
            <div className="absolute top-4 right-4 bg-primary text-[#222222] font-black uppercase tracking-widest text-[10px] px-3 py-1 rounded-full">
              {t('pricing.pro.popular')}
            </div>
            
            <CardHeader className="text-center pt-10 pb-6 border-b border-white/10">
              <CardTitle className="text-2xl font-black uppercase tracking-tight text-white">{t('pricing.pro.name')}</CardTitle>
              <CardDescription className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-2">{t('pricing.pro.description')}</CardDescription>
              <div className="mt-6 flex justify-center items-baseline text-white">
                <span className="text-5xl font-black italic tracking-tighter text-primary">{t('pricing.pro.price')}</span>
                <span className="text-gray-400 ml-1 text-sm font-bold">{t('pricing.pro.unit')}</span>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-6 text-gray-300">
              <ul className="space-y-4">
                {(t('pricing.pro.features', { returnObjects: true }) as string[]).map((feature, i) => (
                  <li key={i} className="flex items-center font-medium">
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center mr-3 shrink-0">
                      <Check className="w-3 h-3 text-primary font-black" />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="p-8 pt-0">
              <Button onClick={() => handleSelectPlan('pro')} className="w-full bg-primary hover:bg-yellow-500 text-[#222222] rounded-xl h-12 font-black uppercase tracking-widest shadow-lg shadow-primary/25">
                {t('pricing.pro.cta')} <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardFooter>
          </Card>

          {/* Enterprise Plan */}
          <Card className="bg-white border-none shadow-xl rounded-3xl overflow-hidden hover:-translate-y-2 transition-transform duration-300">
            <CardHeader className="text-center pt-10 pb-6 border-b border-gray-100 bg-gray-50">
              <CardTitle className="text-2xl font-black uppercase tracking-tight text-gray-900">{t('pricing.enterprise.name')}</CardTitle>
              <CardDescription className="text-gray-500 font-bold text-xs uppercase tracking-widest mt-2">{t('pricing.enterprise.description')}</CardDescription>
              <div className="mt-6 flex justify-center items-baseline text-gray-900">
                <span className="text-5xl font-black italic tracking-tighter">{t('pricing.enterprise.price')}</span>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <ul className="space-y-4">
                {(t('pricing.enterprise.features', { returnObjects: true }) as string[]).map((feature, i) => (
                  <li key={i} className="flex items-center text-gray-700 font-medium">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mr-3 shrink-0">
                      <Check className="w-3 h-3 text-green-600 font-black" />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="p-8 pt-0">
              <Button onClick={() => handleSelectPlan('enterprise')} className="w-full bg-gray-900 hover:bg-black text-white rounded-xl h-12 font-black uppercase tracking-widest">
                {t('pricing.enterprise.cta')} <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardFooter>
          </Card>

        </div>
      </div>
    </div>
  );
};

export default Pricing;
