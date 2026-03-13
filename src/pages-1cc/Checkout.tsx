import { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui-1cc/button";
import { Input } from "@/components/ui-1cc/input";
import { Label } from "@/components/ui-1cc/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui-1cc/card";
import { Separator } from "@/components/ui-1cc/separator";
import { Badge } from "@/components/ui-1cc/badge";
import { useToast } from "@/hooks-1cc/use-toast";
import {
    Cloud,
    Check,
    CreditCard,
    Shield,
    Lock,
    ArrowLeft,
    Sparkles,
    Zap,
    Building2,
    Crown,
    Loader2,
    Mail
} from "lucide-react";

import { StripePayment, PayPalPayment, PaymentMethodSelector } from "@/components/payment";
import { useSubscriptionStore } from "@/stores/useSubscriptionStore";
import { usePaymentSettingsStore } from "@/stores/usePaymentSettingsStore";
import type { PaymentMethod, SubscriptionInfo } from "@/types/paymentTypes";

// Plans data
const plansData = {
    free: {
        name: "Free",
        description: "Idéal pour découvrir la plateforme",
        monthlyPrice: 0,
        yearlyPrice: 0,
        icon: Sparkles,
        features: ["Chat IA limité (50 requêtes/mois)", "1 utilisateur", "Accès aux processus de base"],
    },
    pro: {
        name: "Pro",
        description: "Pour les équipes de production",
        monthlyPrice: 49,
        yearlyPrice: 39,
        icon: Zap,
        features: ["Chat IA illimité", "GPT-4 / Claude / Gemini", "5 utilisateurs inclus", "Support prioritaire"],
    },
    business: {
        name: "Business",
        description: "Solution multi-sites complète",
        monthlyPrice: 129,
        yearlyPrice: 99,
        icon: Building2,
        features: ["Tout le plan Pro", "Multi-usines illimitées", "Maintenance prédictive IA", "API illimitée"],
    },
    enterprise: {
        name: "Enterprise",
        description: "Solution sur-mesure",
        monthlyPrice: null,
        yearlyPrice: null,
        icon: Crown,
        features: ["Tout le plan Business", "IA personnalisée", "Support 24/7 dédié", "SLA garantie 99.9%"],
    },
};

type PlanId = keyof typeof plansData;

const Checkout = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { toast } = useToast();

    const planId = (searchParams.get("plan") || "pro") as PlanId;
    const billingCycle = (searchParams.get("billing") || "yearly") as 'monthly' | 'yearly';

    const [step, setStep] = useState<"auth" | "payment" | "success">("auth");
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [isLogin, setIsLogin] = useState(true);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("stripe");

    const plan = plansData[planId] || plansData.pro;
    const price = billingCycle === "yearly" ? plan.yearlyPrice : plan.monthlyPrice;
    const PlanIcon = plan.icon;

    // Get payment settings
    const { getActiveStripeKey, getActivePayPalClientId } = usePaymentSettingsStore();
    const { setSubscription } = useSubscriptionStore();

    // Initialize Stripe
    const stripeKey = getActiveStripeKey();
    const stripePromise = useMemo(() => {
        if (stripeKey) {
            return loadStripe(stripeKey);
        }
        // Use a test key for demo purposes
        return loadStripe('pk_test_demo');
    }, [stripeKey]);

    // PayPal options
    const paypalClientId = getActivePayPalClientId();
    const paypalOptions = {
        clientId: paypalClientId || 'test',
        currency: 'EUR',
        intent: 'subscription',
    };

    const stripeAvailable = true; // Always show for demo
    const paypalAvailable = true; // Always show for demo

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                setUser(session.user);
                setStep("payment");
            }
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (session?.user) {
                setUser(session.user);
                setStep("payment");
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleGoogleSignIn = async () => {
        setLoading(true);
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/checkout?plan=${planId}&billing=${billingCycle}`,
                }
            } as any);
            if (error) throw error;
        } catch (error) {
            toast({
                title: "Erreur",
                description: (error as Error).message,
                variant: "destructive",
            });
            setLoading(false);
        }
    };

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
            } else {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: `${window.location.origin}/checkout?plan=${planId}&billing=${billingCycle}`,
                        data: { full_name: fullName },
                    } as any
                });
                if (error) throw error;
                toast({
                    title: "Compte créé !",
                    description: "Vous pouvez maintenant continuer.",
                });
            }
        } catch (error) {
            toast({
                title: "Erreur",
                description: (error as Error).message,
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handlePaymentSuccess = (transactionId: string) => {
        // Create subscription record
        const subscriptionInfo: SubscriptionInfo = {
            planId,
            billingCycle,
            status: 'active',
            currentPeriodEnd: new Date(Date.now() + (billingCycle === 'yearly' ? 365 : 30) * 24 * 60 * 60 * 1000).toISOString(),
            paymentMethod,
            subscriptionId: transactionId,
        };

        setSubscription(subscriptionInfo);

        toast({
            title: "Paiement réussi !",
            description: `Votre abonnement ${plan.name} est maintenant actif.`,
        });

        setStep("success");
    };

    const handlePaymentError = (error: string) => {
        toast({
            title: "Erreur de paiement",
            description: error,
            variant: "destructive",
        });
    };

    // For free plan, skip payment
    const handleFreePlan = () => {
        const subscriptionInfo: SubscriptionInfo = {
            planId: 'free',
            billingCycle: 'monthly',
            status: 'active',
            currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
            paymentMethod: 'stripe',
        };

        setSubscription(subscriptionInfo);

        toast({
            title: "Bienvenue !",
            description: "Votre compte gratuit est activé.",
        });

        setStep("success");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10">
            {/* Header */}
            <header className="border-b border-border bg-background/80 backdrop-blur-lg">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Link to="/" className="flex items-center gap-2">
                            <Cloud className="h-6 w-6 text-primary" />
                            <span className="font-bold text-xl text-foreground">Cloud Industrie</span>
                        </Link>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Lock className="h-4 w-4" />
                            <span>Paiement sécurisé</span>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-12">
                <Button variant="ghost" asChild className="mb-8">
                    <Link to="/pricing">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Retour aux tarifs
                    </Link>
                </Button>

                <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
                    {/* Left: Checkout Form */}
                    <div className="space-y-8">
                        {/* Progress Steps */}
                        <div className="flex items-center gap-4">
                            {[
                                { id: "auth", label: "Compte" },
                                { id: "payment", label: "Paiement" },
                                { id: "success", label: "Confirmation" },
                            ].map((s, i) => (
                                <div key={s.id} className="flex items-center">
                                    <div className={`
                                        w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                                        ${step === s.id || (step === "payment" && i === 0) || step === "success"
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-muted text-muted-foreground"
                                        }
                                    `}>
                                        {step === "success" || (step === "payment" && i === 0) ? (
                                            <Check className="h-4 w-4" />
                                        ) : (
                                            i + 1
                                        )}
                                    </div>
                                    <span className="ml-2 text-sm font-medium text-foreground hidden sm:block">
                                        {s.label}
                                    </span>
                                    {i < 2 && (
                                        <div className={`w-12 h-0.5 mx-3 ${(step === "payment" && i === 0) || step === "success"
                                            ? "bg-primary"
                                            : "bg-muted"
                                            }`} />
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Step: Auth */}
                        {step === "auth" && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Créez votre compte</CardTitle>
                                        <CardDescription>
                                            Connectez-vous ou inscrivez-vous pour continuer
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        {/* Google Button */}
                                        <Button
                                            variant="outline"
                                            className="w-full h-12 text-base"
                                            onClick={handleGoogleSignIn}
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                            ) : (
                                                <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
                                                    <path
                                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                                        fill="#4285F4"
                                                    />
                                                    <path
                                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                                        fill="#34A853"
                                                    />
                                                    <path
                                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                                        fill="#FBBC05"
                                                    />
                                                    <path
                                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                                        fill="#EA4335"
                                                    />
                                                </svg>
                                            )}
                                            Continuer avec Google
                                        </Button>

                                        <div className="relative">
                                            <div className="absolute inset-0 flex items-center">
                                                <Separator />
                                            </div>
                                            <div className="relative flex justify-center text-xs uppercase">
                                                <span className="bg-card px-2 text-muted-foreground">
                                                    Ou avec votre email
                                                </span>
                                            </div>
                                        </div>

                                        {/* Email Form */}
                                        <form onSubmit={handleEmailAuth} className="space-y-4">
                                            {!isLogin && (
                                                <div className="space-y-2">
                                                    <Label htmlFor="fullName">Nom complet</Label>
                                                    <Input
                                                        id="fullName"
                                                        value={fullName}
                                                        onChange={(e) => setFullName(e.target.value)}
                                                        placeholder="Jean Dupont"
                                                        required={!isLogin}
                                                    />
                                                </div>
                                            )}
                                            <div className="space-y-2">
                                                <Label htmlFor="email">Email professionnel</Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    placeholder="vous@entreprise.com"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="password">Mot de passe</Label>
                                                <Input
                                                    id="password"
                                                    type="password"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    placeholder="••••••••"
                                                    required
                                                    minLength={6}
                                                />
                                            </div>
                                            <Button type="submit" className="w-full" disabled={loading}>
                                                {loading ? (
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                ) : (
                                                    <Mail className="mr-2 h-4 w-4" />
                                                )}
                                                {isLogin ? "Se connecter" : "Créer mon compte"}
                                            </Button>
                                        </form>

                                        <p className="text-center text-sm text-muted-foreground">
                                            {isLogin ? "Pas encore de compte ?" : "Déjà un compte ?"}{" "}
                                            <button
                                                type="button"
                                                onClick={() => setIsLogin(!isLogin)}
                                                className="text-primary hover:underline font-medium"
                                            >
                                                {isLogin ? "S'inscrire" : "Se connecter"}
                                            </button>
                                        </p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}

                        {/* Step: Payment */}
                        {step === "payment" && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <CreditCard className="h-5 w-5 text-primary" />
                                            Informations de paiement
                                        </CardTitle>
                                        <CardDescription>
                                            Connecté en tant que {user?.email}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        {/* Free plan - no payment needed */}
                                        {planId === 'free' ? (
                                            <div className="text-center py-4">
                                                <p className="text-muted-foreground mb-4">
                                                    Le plan Free ne nécessite pas de paiement.
                                                </p>
                                                <Button
                                                    className="w-full h-12 text-base"
                                                    onClick={handleFreePlan}
                                                >
                                                    <Check className="mr-2 h-5 w-5" />
                                                    Activer mon compte gratuit
                                                </Button>
                                            </div>
                                        ) : (
                                            <>
                                                {/* Payment Method Selector */}
                                                <PaymentMethodSelector
                                                    selectedMethod={paymentMethod}
                                                    onMethodChange={setPaymentMethod}
                                                    stripeAvailable={stripeAvailable}
                                                    paypalAvailable={paypalAvailable}
                                                />

                                                <Separator />

                                                {/* Payment Form based on selected method */}
                                                {paymentMethod === 'stripe' ? (
                                                    <Elements stripe={stripePromise}>
                                                        <StripePayment
                                                            amount={price || 0}
                                                            onSuccess={handlePaymentSuccess}
                                                            onError={handlePaymentError}
                                                        />
                                                    </Elements>
                                                ) : (
                                                    <PayPalScriptProvider options={paypalOptions}>
                                                        <PayPalPayment
                                                            amount={price || 0}
                                                            planId={planId}
                                                            billingCycle={billingCycle}
                                                            onSuccess={handlePaymentSuccess}
                                                            onError={handlePaymentError}
                                                        />
                                                    </PayPalScriptProvider>
                                                )}
                                            </>
                                        )}

                                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                            <Shield className="h-5 w-5 text-success" />
                                            <span>Vos données sont chiffrées et sécurisées (SSL 256-bit)</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}

                        {/* Step: Success */}
                        {step === "success" && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                            >
                                <Card className="text-center">
                                    <CardContent className="pt-12 pb-8 space-y-6">
                                        <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto">
                                            <Check className="h-10 w-10 text-success" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-foreground mb-2">
                                                Bienvenue dans Cloud Industrie !
                                            </h2>
                                            <p className="text-muted-foreground">
                                                Votre abonnement {plan.name} est maintenant actif.
                                            </p>
                                        </div>
                                        <Button size="lg" asChild>
                                            <Link to="/dashboard">
                                                Accéder au Dashboard
                                            </Link>
                                        </Button>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}
                    </div>

                    {/* Right: Order Summary */}
                    <div className="lg:sticky lg:top-24 h-fit">
                        <Card>
                            <CardHeader>
                                <CardTitle>Récapitulatif</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Plan Info */}
                                <div className="flex items-start gap-4">
                                    <div className="p-3 rounded-xl bg-primary/10">
                                        <PlanIcon className="h-6 w-6 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-foreground">{plan.name}</h3>
                                        <p className="text-sm text-muted-foreground">{plan.description}</p>
                                        <Badge variant="secondary" className="mt-2">
                                            Facturation {billingCycle === "yearly" ? "annuelle" : "mensuelle"}
                                        </Badge>
                                    </div>
                                </div>

                                <Separator />

                                {/* Features */}
                                <div className="space-y-3">
                                    <p className="text-sm font-medium text-foreground">Inclus dans ce plan :</p>
                                    {plan.features.map((feature, i) => (
                                        <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Check className="h-4 w-4 text-success flex-shrink-0" />
                                            <span>{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                <Separator />

                                {/* Pricing */}
                                <div className="space-y-3">
                                    {price !== null ? (
                                        <>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">Prix mensuel</span>
                                                <span className="text-foreground">{price}€</span>
                                            </div>
                                            {billingCycle === "yearly" && (
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-muted-foreground">Réduction annuelle</span>
                                                    <span className="text-success">-20%</span>
                                                </div>
                                            )}
                                            <Separator />
                                            <div className="flex justify-between font-semibold text-lg">
                                                <span>Total</span>
                                                <span className="text-primary">
                                                    {billingCycle === "yearly"
                                                        ? `${price * 12}€/an`
                                                        : `${price}€/mois`
                                                    }
                                                </span>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-center py-4">
                                            <p className="text-lg font-semibold text-foreground">Sur devis</p>
                                            <p className="text-sm text-muted-foreground">
                                                Notre équipe vous contactera
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Trust Badges */}
                                <div className="flex items-center justify-center gap-6 pt-4 border-t">
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                        <Shield className="h-4 w-4" />
                                        <span>SSL Sécurisé</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                        <Lock className="h-4 w-4" />
                                        <span>Paiement crypté</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Checkout;
