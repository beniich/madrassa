import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
    Cloud,
    Server,
    Cpu,
    HardDrive,
    Database,
    Wifi,
    Puzzle,
    CreditCard,
    Check,
    ArrowRight,
    Sparkles,
    Loader2,
    ExternalLink,
    Shield,
    Zap,
    Globe
} from "lucide-react";
import { Button } from "@/components/ui-1cc/button";
import { Input } from "@/components/ui-1cc/input";
import { Textarea } from "@/components/ui-1cc/textarea";
import { Label } from "@/components/ui-1cc/label";
import { Slider } from "@/components/ui-1cc/slider";
import { Switch } from "@/components/ui-1cc/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui-1cc/card";
import { Separator } from "@/components/ui-1cc/separator";
import { Badge } from "@/components/ui-1cc/badge";
import { toast } from "sonner";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

// Schema de validation Zod
const subscriptionSchema = z.object({
    hostname: z.string().min(3, "Le hostname doit contenir au moins 3 caractères").max(50),
    logo_desc: z.string().min(10, "La description doit contenir au moins 10 caractères").max(500),
    ram: z.number().min(8).max(128),
    cpu: z.number().min(2).max(32),
    nvme: z.number().min(50).max(2000),
    db: z.boolean(),
    bandwidth: z.number().min(100).max(10000),
    addon_backup: z.boolean(),
    addon_monitoring: z.boolean(),
    addon_ssl: z.boolean(),
    addon_cdn: z.boolean(),
});

type SubscriptionFormData = z.infer<typeof subscriptionSchema>;

// Prix par composant (en euros/mois)
const PRICING = {
    ram_per_gb: 0.75, // €/GB
    cpu_per_core: 3, // €/core
    nvme_per_100gb: 2, // €/100GB
    database: 10, // €/mois
    bandwidth_per_1000gb: 5, // €/1000GB
    addon_backup: 15, // €/mois
    addon_monitoring: 8, // €/mois
    addon_ssl: 0, // Gratuit
    addon_cdn: 12, // €/mois
};

const Subscriptions = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [step, setStep] = useState(1);

    const form = useForm<SubscriptionFormData>({
        resolver: zodResolver(subscriptionSchema),
        defaultValues: {
            hostname: "",
            logo_desc: "",
            ram: 16,
            cpu: 4,
            nvme: 200,
            db: true,
            bandwidth: 1000,
            addon_backup: true,
            addon_monitoring: false,
            addon_ssl: true,
            addon_cdn: false,
        },
    });

    const watchedValues = form.watch();

    // Calcul du prix en temps réel
    const calculatedPrice = useMemo(() => {
        const ramCost = watchedValues.ram * PRICING.ram_per_gb;
        const cpuCost = watchedValues.cpu * PRICING.cpu_per_core;
        const nvmeCost = (watchedValues.nvme / 100) * PRICING.nvme_per_100gb;
        const dbCost = watchedValues.db ? PRICING.database : 0;
        const bandwidthCost = (watchedValues.bandwidth / 1000) * PRICING.bandwidth_per_1000gb;
        const addonsCost =
            (watchedValues.addon_backup ? PRICING.addon_backup : 0) +
            (watchedValues.addon_monitoring ? PRICING.addon_monitoring : 0) +
            (watchedValues.addon_ssl ? PRICING.addon_ssl : 0) +
            (watchedValues.addon_cdn ? PRICING.addon_cdn : 0);

        const subtotal = ramCost + cpuCost + nvmeCost + dbCost + bandwidthCost + addonsCost;
        const tax = subtotal * 0.20; // TVA 20%
        const total = subtotal + tax;

        return {
            ram: ramCost,
            cpu: cpuCost,
            nvme: nvmeCost,
            db: dbCost,
            bandwidth: bandwidthCost,
            addons: addonsCost,
            subtotal,
            tax,
            total,
            annual: total * 12 * 0.85, // 15% réduction annuelle
        };
    }, [watchedValues]);

    const onSubmit = async (data: SubscriptionFormData) => {
        setIsSubmitting(true);

        try {
            // Simuler l'appel API WooCommerce (en mode local/mock)
            // En production, cela appellerait une Edge Function Supabase
            await new Promise((resolve) => setTimeout(resolve, 2000));

            const productData = {
                name: `Cloud Server - ${data.hostname}`,
                type: "subscription",
                regular_price: calculatedPrice.total.toFixed(2),
                description: `
          Configuration Cloud:
          - RAM: ${data.ram}GB
          - CPU: ${data.cpu} cores
          - NVMe: ${data.nvme}GB
          - Database: ${data.db ? "Incluse" : "Non"}
          - Bandwidth: ${data.bandwidth}GB
          - Logo/Description: ${data.logo_desc}
          
          Add-ons:
          - Backup automatique: ${data.addon_backup ? "Oui" : "Non"}
          - Monitoring 24/7: ${data.addon_monitoring ? "Oui" : "Non"}
          - SSL Premium: ${data.addon_ssl ? "Oui" : "Non"}
          - CDN Global: ${data.addon_cdn ? "Oui" : "Non"}
        `,
                status: "pending",
            };

            console.log("Produit WooCommerce créé:", productData);

            toast.success("Abonnement créé avec succès!", {
                description: `Votre serveur ${data.hostname} est en cours de provisionnement.`,
                action: {
                    label: "Voir le dashboard",
                    onClick: () => window.location.href = "/dashboard",
                },
            });

            // Reset form et retour à l'étape 1
            form.reset();
            setStep(1);
        } catch (error) {
            console.error("Erreur création abonnement:", error);
            toast.error("Erreur lors de la création de l'abonnement", {
                description: "Veuillez réessayer ou contacter le support.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const nextStep = () => {
        if (step === 1) {
            const { hostname, logo_desc } = form.getValues();
            if (!hostname || hostname.length < 3) {
                form.setError("hostname", { message: "Le hostname est requis (min 3 caractères)" });
                return;
            }
            if (!logo_desc || logo_desc.length < 10) {
                form.setError("logo_desc", { message: "La description est requise (min 10 caractères)" });
                return;
            }
        }
        setStep(step + 1);
    };

    const prevStep = () => setStep(step - 1);

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <main className="container mx-auto px-4 py-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <Badge className="mb-4 bg-amber-500/10 text-amber-400 border-amber-500/20">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Configuration Cloud
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                        Créez votre{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-400">
                            Serveur Cloud
                        </span>
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Configurez votre infrastructure cloud sur mesure avec notre assistant intelligent.
                        Choisissez vos ressources et payez uniquement ce dont vous avez besoin.
                    </p>
                </motion.div>

                {/* Progress Steps */}
                <div className="max-w-3xl mx-auto mb-8">
                    <div className="flex items-center justify-between">
                        {[
                            { num: 1, label: "Informations" },
                            { num: 2, label: "Ressources" },
                            { num: 3, label: "Add-ons" },
                            { num: 4, label: "Confirmation" },
                        ].map((s, i) => (
                            <div key={s.num} className="flex items-center">
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${step >= s.num
                                        ? "bg-gradient-to-r from-amber-500 to-orange-400 text-foreground"
                                        : "bg-muted text-muted-foreground"
                                        }`}
                                >
                                    {step > s.num ? <Check className="w-5 h-5" /> : s.num}
                                </div>
                                <span
                                    className={`ml-2 text-sm hidden sm:block ${step >= s.num ? "text-foreground" : "text-muted-foreground"
                                        }`}
                                >
                                    {s.label}
                                </span>
                                {i < 3 && (
                                    <div
                                        className={`w-12 sm:w-24 h-1 mx-2 rounded ${step > s.num ? "bg-gradient-to-r from-amber-500 to-orange-400" : "bg-muted"
                                            }`}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {/* Form Section */}
                    <div className="lg:col-span-2">
                        <Card className="bg-card border-border backdrop-blur-xl">
                            <CardHeader>
                                <CardTitle className="text-foreground flex items-center gap-2">
                                    {step === 1 && <><Server className="w-5 h-5 text-amber-400" /> Informations du serveur</>}
                                    {step === 2 && <><Cpu className="w-5 h-5 text-amber-400" /> Configuration des ressources</>}
                                    {step === 3 && <><Puzzle className="w-5 h-5 text-amber-400" /> Add-ons et services</>}
                                    {step === 4 && <><CreditCard className="w-5 h-5 text-amber-400" /> Confirmation et paiement</>}
                                </CardTitle>
                                <CardDescription className="text-muted-foreground">
                                    {step === 1 && "Définissez le nom et la description de votre serveur"}
                                    {step === 2 && "Choisissez les ressources adaptées à vos besoins"}
                                    {step === 3 && "Ajoutez des services supplémentaires"}
                                    {step === 4 && "Vérifiez votre configuration et validez"}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                    <AnimatePresence mode="wait">
                                        {/* Step 1: Informations */}
                                        {step === 1 && (
                                            <motion.div
                                                key="step1"
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                className="space-y-6"
                                            >
                                                <div className="space-y-2">
                                                    <Label htmlFor="hostname" className="text-foreground">Hostname</Label>
                                                    <Input
                                                        id="hostname"
                                                        {...form.register("hostname")}
                                                        placeholder="ex: mon-serveur-prod"
                                                        className="bg-muted/50 border-border text-foreground"
                                                    />
                                                    {form.formState.errors.hostname && (
                                                        <p className="text-red-400 text-sm">{form.formState.errors.hostname.message}</p>
                                                    )}
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="logo_desc" className="text-foreground">Description du projet</Label>
                                                    <Textarea
                                                        id="logo_desc"
                                                        {...form.register("logo_desc")}
                                                        placeholder="Décrivez votre projet, son utilisation et vos besoins spécifiques..."
                                                        className="bg-muted/50 border-border text-foreground min-h-32"
                                                    />
                                                    {form.formState.errors.logo_desc && (
                                                        <p className="text-red-400 text-sm">{form.formState.errors.logo_desc.message}</p>
                                                    )}
                                                </div>
                                            </motion.div>
                                        )}

                                        {/* Step 2: Resources */}
                                        {step === 2 && (
                                            <motion.div
                                                key="step2"
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                className="space-y-8"
                                            >
                                                {/* RAM */}
                                                <div className="space-y-4">
                                                    <div className="flex justify-between items-center">
                                                        <Label className="text-foreground flex items-center gap-2">
                                                            <Server className="w-4 h-4 text-amber-400" />
                                                            RAM
                                                        </Label>
                                                        <Badge variant="outline" className="text-amber-400 border-amber-400/30">
                                                            {watchedValues.ram} GB
                                                        </Badge>
                                                    </div>
                                                    <Slider
                                                        value={[watchedValues.ram]}
                                                        onValueChange={([val]) => form.setValue("ram", val)}
                                                        min={8}
                                                        max={128}
                                                        step={8}
                                                        className="py-4"
                                                    />
                                                    <div className="flex justify-between text-xs text-muted-foreground">
                                                        <span>8 GB</span>
                                                        <span>128 GB</span>
                                                    </div>
                                                </div>

                                                {/* CPU */}
                                                <div className="space-y-4">
                                                    <div className="flex justify-between items-center">
                                                        <Label className="text-foreground flex items-center gap-2">
                                                            <Cpu className="w-4 h-4 text-amber-400" />
                                                            CPU Cores
                                                        </Label>
                                                        <Badge variant="outline" className="text-amber-400 border-amber-400/30">
                                                            {watchedValues.cpu} cores
                                                        </Badge>
                                                    </div>
                                                    <Slider
                                                        value={[watchedValues.cpu]}
                                                        onValueChange={([val]) => form.setValue("cpu", val)}
                                                        min={2}
                                                        max={32}
                                                        step={2}
                                                        className="py-4"
                                                    />
                                                    <div className="flex justify-between text-xs text-muted-foreground">
                                                        <span>2 cores</span>
                                                        <span>32 cores</span>
                                                    </div>
                                                </div>

                                                {/* NVMe Storage */}
                                                <div className="space-y-4">
                                                    <div className="flex justify-between items-center">
                                                        <Label className="text-foreground flex items-center gap-2">
                                                            <HardDrive className="w-4 h-4 text-amber-400" />
                                                            Stockage NVMe
                                                        </Label>
                                                        <Badge variant="outline" className="text-amber-400 border-amber-400/30">
                                                            {watchedValues.nvme} GB
                                                        </Badge>
                                                    </div>
                                                    <Slider
                                                        value={[watchedValues.nvme]}
                                                        onValueChange={([val]) => form.setValue("nvme", val)}
                                                        min={50}
                                                        max={2000}
                                                        step={50}
                                                        className="py-4"
                                                    />
                                                    <div className="flex justify-between text-xs text-muted-foreground">
                                                        <span>50 GB</span>
                                                        <span>2 TB</span>
                                                    </div>
                                                </div>

                                                {/* Bandwidth */}
                                                <div className="space-y-4">
                                                    <div className="flex justify-between items-center">
                                                        <Label className="text-foreground flex items-center gap-2">
                                                            <Wifi className="w-4 h-4 text-amber-400" />
                                                            Bande passante
                                                        </Label>
                                                        <Badge variant="outline" className="text-amber-400 border-amber-400/30">
                                                            {watchedValues.bandwidth} GB/mois
                                                        </Badge>
                                                    </div>
                                                    <Slider
                                                        value={[watchedValues.bandwidth]}
                                                        onValueChange={([val]) => form.setValue("bandwidth", val)}
                                                        min={100}
                                                        max={10000}
                                                        step={100}
                                                        className="py-4"
                                                    />
                                                    <div className="flex justify-between text-xs text-muted-foreground">
                                                        <span>100 GB</span>
                                                        <span>10 TB</span>
                                                    </div>
                                                </div>

                                                {/* Database */}
                                                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                                                    <div className="flex items-center gap-3">
                                                        <Database className="w-5 h-5 text-amber-400" />
                                                        <div>
                                                            <Label className="text-foreground">Base de données PostgreSQL</Label>
                                                            <p className="text-sm text-muted-foreground">Inclut backup automatique</p>
                                                        </div>
                                                    </div>
                                                    <Switch
                                                        checked={watchedValues.db}
                                                        onCheckedChange={(checked) => form.setValue("db", checked)}
                                                    />
                                                </div>
                                            </motion.div>
                                        )}

                                        {/* Step 3: Add-ons */}
                                        {step === 3 && (
                                            <motion.div
                                                key="step3"
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                className="space-y-4"
                                            >
                                                {[
                                                    {
                                                        id: "addon_backup",
                                                        icon: Shield,
                                                        title: "Backup automatique",
                                                        desc: "Sauvegardes quotidiennes avec rétention 30 jours",
                                                        price: PRICING.addon_backup,
                                                    },
                                                    {
                                                        id: "addon_monitoring",
                                                        icon: Zap,
                                                        title: "Monitoring 24/7",
                                                        desc: "Alertes en temps réel et dashboard de performance",
                                                        price: PRICING.addon_monitoring,
                                                    },
                                                    {
                                                        id: "addon_ssl",
                                                        icon: Shield,
                                                        title: "SSL Premium Wildcard",
                                                        desc: "Certificat SSL pour tous vos sous-domaines",
                                                        price: PRICING.addon_ssl,
                                                        free: true,
                                                    },
                                                    {
                                                        id: "addon_cdn",
                                                        icon: Globe,
                                                        title: "CDN Global",
                                                        desc: "Réseau de distribution mondial pour vos assets",
                                                        price: PRICING.addon_cdn,
                                                    },
                                                ].map((addon) => (
                                                    <div
                                                        key={addon.id}
                                                        className={`flex items-center justify-between p-4 rounded-lg border transition-all ${watchedValues[addon.id as keyof SubscriptionFormData]
                                                            ? "bg-amber-500/10 border-amber-500/30"
                                                            : "bg-muted/30 border-border"
                                                            }`}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className={`p-2 rounded-lg ${watchedValues[addon.id as keyof SubscriptionFormData]
                                                                ? "bg-amber-500/20"
                                                                : "bg-border/50"
                                                                }`}>
                                                                <addon.icon className={`w-5 h-5 ${watchedValues[addon.id as keyof SubscriptionFormData]
                                                                    ? "text-amber-400"
                                                                    : "text-muted-foreground"
                                                                    }`} />
                                                            </div>
                                                            <div>
                                                                <Label className="text-foreground">{addon.title}</Label>
                                                                <p className="text-sm text-muted-foreground">{addon.desc}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            {addon.free ? (
                                                                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                                                                    Gratuit
                                                                </Badge>
                                                            ) : (
                                                                <span className="text-foreground font-medium">{addon.price}€/mois</span>
                                                            )}
                                                            <Switch
                                                                checked={watchedValues[addon.id as keyof SubscriptionFormData] as boolean}
                                                                onCheckedChange={(checked) => form.setValue(addon.id as keyof SubscriptionFormData, checked as never)}
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                            </motion.div>
                                        )}

                                        {/* Step 4: Confirmation */}
                                        {step === 4 && (
                                            <motion.div
                                                key="step4"
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                className="space-y-6"
                                            >
                                                <div className="bg-muted/30 rounded-lg p-6">
                                                    <h3 className="text-lg font-semibold text-foreground mb-4">Récapitulatif de votre configuration</h3>

                                                    <div className="space-y-3">
                                                        <div className="flex justify-between text-muted-foreground">
                                                            <span>Hostname</span>
                                                            <span className="text-foreground font-medium">{watchedValues.hostname || "Non défini"}</span>
                                                        </div>
                                                        <Separator className="bg-border" />
                                                        <div className="flex justify-between text-muted-foreground">
                                                            <span>RAM ({watchedValues.ram} GB)</span>
                                                            <span className="text-foreground">{calculatedPrice.ram.toFixed(2)}€</span>
                                                        </div>
                                                        <div className="flex justify-between text-muted-foreground">
                                                            <span>CPU ({watchedValues.cpu} cores)</span>
                                                            <span className="text-foreground">{calculatedPrice.cpu.toFixed(2)}€</span>
                                                        </div>
                                                        <div className="flex justify-between text-muted-foreground">
                                                            <span>NVMe ({watchedValues.nvme} GB)</span>
                                                            <span className="text-foreground">{calculatedPrice.nvme.toFixed(2)}€</span>
                                                        </div>
                                                        <div className="flex justify-between text-muted-foreground">
                                                            <span>Bande passante ({watchedValues.bandwidth} GB)</span>
                                                            <span className="text-foreground">{calculatedPrice.bandwidth.toFixed(2)}€</span>
                                                        </div>
                                                        {watchedValues.db && (
                                                            <div className="flex justify-between text-muted-foreground">
                                                                <span>Base de données PostgreSQL</span>
                                                                <span className="text-foreground">{calculatedPrice.db.toFixed(2)}€</span>
                                                            </div>
                                                        )}
                                                        {calculatedPrice.addons > 0 && (
                                                            <div className="flex justify-between text-muted-foreground">
                                                                <span>Add-ons</span>
                                                                <span className="text-foreground">{calculatedPrice.addons.toFixed(2)}€</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-lg p-6 border border-amber-500/20">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <span className="text-muted-foreground">Sous-total</span>
                                                        <span className="text-foreground">{calculatedPrice.subtotal.toFixed(2)}€</span>
                                                    </div>
                                                    <div className="flex justify-between items-center mb-3">
                                                        <span className="text-muted-foreground">TVA (20%)</span>
                                                        <span className="text-foreground">{calculatedPrice.tax.toFixed(2)}€</span>
                                                    </div>
                                                    <Separator className="bg-border my-3" />
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-xl font-bold text-foreground">Total mensuel</span>
                                                        <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
                                                            {calculatedPrice.total.toFixed(2)}€/mois
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground mt-2">
                                                        ou <span className="text-green-400 font-medium">{calculatedPrice.annual.toFixed(2)}€/an</span> (économisez 15%)
                                                    </p>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Navigation buttons */}
                                    <div className="flex justify-between pt-6">
                                        {step > 1 ? (
                                            <Button type="button" variant="outline" onClick={prevStep} className="border-border text-muted-foreground hover:bg-muted">
                                                Précédent
                                            </Button>
                                        ) : (
                                            <div />
                                        )}

                                        {step < 4 ? (
                                            <Button type="button" onClick={nextStep} className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
                                                Suivant
                                                <ArrowRight className="w-4 h-4 ml-2" />
                                            </Button>
                                        ) : (
                                            <Button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 min-w-40"
                                            >
                                                {isSubmitting ? (
                                                    <>
                                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                        Création...
                                                    </>
                                                ) : (
                                                    <>
                                                        <CreditCard className="w-4 h-4 mr-2" />
                                                        Confirmer l'abonnement
                                                    </>
                                                )}
                                            </Button>
                                        )}
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Pricing Summary Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24">
                            <Card className="bg-card border-border backdrop-blur-xl">
                                <CardHeader>
                                    <CardTitle className="text-foreground flex items-center gap-2">
                                        <Cloud className="w-5 h-5 text-amber-400" />
                                        Estimation en temps réel
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="text-center py-4">
                                        <motion.div
                                            key={calculatedPrice.total}
                                            initial={{ scale: 0.9, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400"
                                        >
                                            {calculatedPrice.total.toFixed(2)}€
                                        </motion.div>
                                        <span className="text-muted-foreground">/mois TTC</span>
                                    </div>

                                    <Separator className="bg-muted" />

                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between text-muted-foreground">
                                            <span>RAM</span>
                                            <span className="text-foreground">{watchedValues.ram} GB</span>
                                        </div>
                                        <div className="flex justify-between text-muted-foreground">
                                            <span>CPU</span>
                                            <span className="text-foreground">{watchedValues.cpu} cores</span>
                                        </div>
                                        <div className="flex justify-between text-muted-foreground">
                                            <span>Stockage</span>
                                            <span className="text-foreground">{watchedValues.nvme} GB NVMe</span>
                                        </div>
                                        <div className="flex justify-between text-muted-foreground">
                                            <span>Bande passante</span>
                                            <span className="text-foreground">{watchedValues.bandwidth} GB</span>
                                        </div>
                                    </div>

                                    <Separator className="bg-muted" />

                                    <div className="flex items-center gap-2 text-green-400 text-sm">
                                        <Check className="w-4 h-4" />
                                        <span>Support technique 24/7</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-green-400 text-sm">
                                        <Check className="w-4 h-4" />
                                        <span>SLA 99.99% garanti</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-green-400 text-sm">
                                        <Check className="w-4 h-4" />
                                        <span>Migration gratuite</span>
                                    </div>

                                    <Button variant="link" className="w-full text-amber-400 hover:text-amber-300">
                                        <ExternalLink className="w-4 h-4 mr-2" />
                                        Voir les détails complets
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Subscriptions;
