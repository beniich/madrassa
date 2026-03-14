import { Card } from "@/components/ui-1cc/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui-1cc/tabs";
import { Input } from "@/components/ui-1cc/input";
import { Label } from "@/components/ui-1cc/label";
import { Button } from "@/components/ui-1cc/button";
import { Switch } from "@/components/ui-1cc/switch";
import { Separator } from "@/components/ui-1cc/separator";
import { User, Bell, Shield, Palette, Database, CreditCard, ImageIcon, Upload, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks-1cc/use-toast";
import { usePaymentSettingsStore } from "@/stores/usePaymentSettingsStore";
import { useBrandingStore, DEFAULT_BRANDING_CONFIG } from "@/stores/useBrandingStore";
import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

const Settings = () => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const { settings, updateSettings } = usePaymentSettingsStore();

  // Local state for form inputs
  const [stripePublishableKey, setStripePublishableKey] = useState(settings.stripePublishableKey);
  const [stripeSecretKey, setStripeSecretKey] = useState(settings.stripeSecretKey);
  const [stripeWebhookSecret, setStripeWebhookSecret] = useState(settings.stripeWebhookSecret);
  const [stripeTestMode, setStripeTestMode] = useState(settings.stripeTestMode);

  const [paypalClientId, setPaypalClientId] = useState(settings.paypalClientId);
  const [paypalClientSecret, setPaypalClientSecret] = useState(settings.paypalClientSecret);
  const [paypalSandboxMode, setPaypalSandboxMode] = useState(settings.paypalSandboxMode);

  // Branding state
  const { appName, headerTitle, logoUrl, faviconUrl, iconUrl, footerText, updateBranding, resetToDefaults } = useBrandingStore();
  const [brandAppName, setBrandAppName] = useState(appName);
  const [brandHeaderTitle, setBrandHeaderTitle] = useState(headerTitle);
  const [brandLogoUrl, setBrandLogoUrl] = useState(logoUrl || '');
  const [brandFaviconUrl, setBrandFaviconUrl] = useState(faviconUrl || '');
  const [brandIconUrl, setBrandIconUrl] = useState(iconUrl || '');
  const [brandFooterText, setBrandFooterText] = useState(footerText);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);
  const iconInputRef = useRef<HTMLInputElement>(null);

  // Sync branding state with store
  useEffect(() => {
    setBrandAppName(appName);
    setBrandHeaderTitle(headerTitle);
    setBrandLogoUrl(logoUrl || '');
    setBrandFaviconUrl(faviconUrl || '');
    setBrandIconUrl(iconUrl || '');
    setBrandFooterText(footerText);
  }, [appName, headerTitle, logoUrl, faviconUrl, iconUrl, footerText]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setter(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveBranding = () => {
    updateBranding({
      appName: brandAppName,
      headerTitle: brandHeaderTitle,
      logoUrl: brandLogoUrl || null,
      faviconUrl: brandFaviconUrl || null,
      iconUrl: brandIconUrl || null,
      footerText: brandFooterText,
    });
    toast({
      title: "Personnalisation sauvegardée",
      description: "Votre marque a été mise à jour avec succès.",
    });
  };

  const handleResetBranding = () => {
    resetToDefaults();
    toast({
      title: "Valeurs par défaut restaurées",
      description: "Les paramètres de marque ont été réinitialisés.",
    });
  };

  const handleSaveStripe = () => {
    updateSettings({
      stripePublishableKey,
      stripeSecretKey,
      stripeWebhookSecret,
      stripeTestMode,
    });
    toast({
      title: "Configuration Stripe sauvegardée",
      description: "Vos clés API Stripe ont été enregistrées.",
    });
  };

  const handleSavePayPal = () => {
    updateSettings({
      paypalClientId,
      paypalClientSecret,
      paypalSandboxMode,
    });
    toast({
      title: "Configuration PayPal sauvegardée",
      description: "Vos clés API PayPal ont été enregistrées.",
    });
  };

  const handleExportData = () => {
    toast({
      title: "Export en cours",
      description: "Vos données sont en cours de préparation. Vous recevrez un email une fois l'export terminé.",
    });
  };

  const handleDeleteAccount = () => {
    toast({
      title: "Action impossible",
      description: "La suppression de compte est désactivée dans cette version de démonstration.",
      variant: "destructive",
    });
  };

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('settings.title')}</h1>
          <p className="text-muted-foreground mt-2">
            {t('settings.subtitle')}
          </p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="w-full flex flex-wrap lg:grid lg:grid-cols-7 h-auto gap-2">
            <TabsTrigger value="profile" className="gap-2 flex-1">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">{t('settings.profile')}</span>
            </TabsTrigger>
            <TabsTrigger value="branding" className="gap-2 flex-1">
              <ImageIcon className="h-4 w-4" />
              <span className="hidden sm:inline">{t('settings.branding')}</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2 flex-1">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">{t('settings.notifications')}</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2 flex-1">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">{t('settings.security')}</span>
            </TabsTrigger>
            <TabsTrigger value="integrations" className="gap-2 flex-1">
              <CreditCard className="h-4 w-4" />
              <span className="hidden sm:inline">{t('settings.integrations')}</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="gap-2 flex-1">
              <Palette className="h-4 w-4" />
              <span className="hidden sm:inline">{t('settings.appearance')}</span>
            </TabsTrigger>
            <TabsTrigger value="data" className="gap-2 flex-1">
              <Database className="h-4 w-4" />
              <span className="hidden sm:inline">{t('settings.data')}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">{t('settings.personalInfo')}</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">{t('settings.firstName')}</Label>
                    <Input id="firstName" placeholder="Jean" />
                  </div>
                  <div>
                    <Label htmlFor="lastName">{t('settings.lastName')}</Label>
                    <Input id="lastName" placeholder="Dupont" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="jean.dupont@example.com" />
                </div>
                <div>
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input id="phone" type="tel" placeholder="+33 6 12 34 56 78" />
                </div>
                <div>
                  <Label htmlFor="company">Entreprise</Label>
                  <Input id="company" placeholder="Mon Entreprise" />
                </div>
                <Button>Sauvegarder</Button>
              </div>
            </Card>
          </TabsContent>

          {/* Onglet Personnalisation de la Marque */}
          <TabsContent value="branding" className="space-y-4">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold">{t('settings.brandingTitle')}</h3>
                  <p className="text-sm text-muted-foreground">{t('settings.brandingSubtitle')}</p>
                </div>
                <Button variant="outline" size="sm" onClick={handleResetBranding} className="gap-2">
                  <RotateCcw className="h-4 w-4" />
                  {t('settings.resetToDefaults')}
                </Button>
              </div>

              <div className="space-y-6">
                {/* Nom de l'application */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="appName">{t('settings.appName')}</Label>
                    <Input
                      id="appName"
                      placeholder="CRM Pro"
                      value={brandAppName}
                      onChange={(e) => setBrandAppName(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground mt-1">{t('settings.displayedInSidebar')}</p>
                  </div>
                  <div>
                    <Label htmlFor="headerTitle">{t('settings.headerTitle')}</Label>
                    <Input
                      id="headerTitle"
                      placeholder="Cloud Industrie"
                      value={brandHeaderTitle}
                      onChange={(e) => setBrandHeaderTitle(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground mt-1">{t('settings.displayedInPageTitle')}</p>
                  </div>
                </div>

                {/* Texte du pied de page */}
                <div>
                  <Label htmlFor="footerText">{t('settings.footerText')}</Label>
                  <Input
                    id="footerText"
                    placeholder="Cloudindustry LTD"
                    value={brandFooterText}
                    onChange={(e) => setBrandFooterText(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">{t('settings.displayedAtBottom')}</p>
                </div>

                <Separator />

                {/* Upload du Logo */}
                <div className="grid grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <Label>{t('settings.mainLogo')}</Label>
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 rounded-lg border-2 border-dashed border-border flex items-center justify-center bg-muted/30 overflow-hidden">
                        {brandLogoUrl ? (
                          <img src={brandLogoUrl} alt="Logo" className="h-full w-full object-cover" />
                        ) : (
                          <ImageIcon className="h-6 w-6 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1">
                        <input
                          type="file"
                          ref={logoInputRef}
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, setBrandLogoUrl)}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full gap-2"
                          onClick={() => logoInputRef.current?.click()}
                        >
                          <Upload className="h-4 w-4" />
                          {t('common.upload')}
                        </Button>
                        {brandLogoUrl && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full mt-1 text-destructive"
                            onClick={() => setBrandLogoUrl('')}
                          >
                            {t('common.delete')}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Upload Favicon */}
                  <div className="space-y-3">
                    <Label>{t('settings.favicon')}</Label>
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 rounded-lg border-2 border-dashed border-border flex items-center justify-center bg-muted/30 overflow-hidden">
                        {brandFaviconUrl ? (
                          <img src={brandFaviconUrl} alt="Favicon" className="h-full w-full object-cover" />
                        ) : (
                          <ImageIcon className="h-6 w-6 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1">
                        <input
                          type="file"
                          ref={faviconInputRef}
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, setBrandFaviconUrl)}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full gap-2"
                          onClick={() => faviconInputRef.current?.click()}
                        >
                          <Upload className="h-4 w-4" />
                          {t('common.upload')}
                        </Button>
                        {brandFaviconUrl && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full mt-1 text-destructive"
                            onClick={() => setBrandFaviconUrl('')}
                          >
                            {t('common.delete')}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Upload Icône Sidebar */}
                  <div className="space-y-3">
                    <Label>{t('settings.sidebarIcon')}</Label>
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 rounded-lg border-2 border-dashed border-border flex items-center justify-center bg-muted/30 overflow-hidden">
                        {brandIconUrl ? (
                          <img src={brandIconUrl} alt="Icon" className="h-full w-full object-cover" />
                        ) : (
                          <ImageIcon className="h-6 w-6 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1">
                        <input
                          type="file"
                          ref={iconInputRef}
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, setBrandIconUrl)}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full gap-2"
                          onClick={() => iconInputRef.current?.click()}
                        >
                          <Upload className="h-4 w-4" />
                          {t('common.upload')}
                        </Button>
                        {brandIconUrl && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full mt-1 text-destructive"
                            onClick={() => setBrandIconUrl('')}
                          >
                            {t('common.delete')}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <Button onClick={handleSaveBranding} className="w-full">
                  {t('settings.saveChanges')}
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Préférences de Notifications</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Recommandations IA</p>
                    <p className="text-sm text-muted-foreground">Recevez des notifications pour les nouvelles recommandations</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Nouvelles Opportunités</p>
                    <p className="text-sm text-muted-foreground">Alertes pour les nouvelles opportunités</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Rapports Hebdomadaires</p>
                    <p className="text-sm text-muted-foreground">Résumé hebdomadaire de votre activité</p>
                  </div>
                  <Switch />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Notifications Email</p>
                    <p className="text-sm text-muted-foreground">Recevez des notifications par email</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Sécurité du Compte</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                  <Input id="currentPassword" type="password" />
                </div>
                <div>
                  <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                  <Input id="newPassword" type="password" />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                  <Input id="confirmPassword" type="password" />
                </div>
                <Button>Changer le mot de passe</Button>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Authentification à deux facteurs</h3>
              <p className="text-muted-foreground mb-4">
                Ajoutez une couche de sécurité supplémentaire à votre compte
              </p>
              <Button variant="outline">Activer 2FA</Button>
            </Card>
          </TabsContent>

          <TabsContent value="integrations" className="space-y-4">
            {/* Stripe Integration */}
            <Card className="p-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 rounded-xl bg-[#635BFF]/10">
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="#635BFF">
                    <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    Stripe
                    <span className="text-xs px-2 py-0.5 rounded-full bg-success/10 text-success">Recommandé</span>
                  </h3>
                  <p className="text-sm text-muted-foreground">Acceptez les paiements par carte bancaire en toute sécurité</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="stripe-pk">Clé publique (Publishable Key)</Label>
                  <Input
                    id="stripe-pk"
                    placeholder="pk_live_..."
                    className="font-mono text-sm"
                    value={stripePublishableKey}
                    onChange={(e) => setStripePublishableKey(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="stripe-sk">Clé secrète (Secret Key)</Label>
                  <Input
                    id="stripe-sk"
                    type="password"
                    placeholder="sk_live_..."
                    className="font-mono text-sm"
                    value={stripeSecretKey}
                    onChange={(e) => setStripeSecretKey(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">Ne partagez jamais votre clé secrète</p>
                </div>
                <div>
                  <Label htmlFor="stripe-webhook">Webhook Secret</Label>
                  <Input
                    id="stripe-webhook"
                    type="password"
                    placeholder="whsec_..."
                    className="font-mono text-sm"
                    value={stripeWebhookSecret}
                    onChange={(e) => setStripeWebhookSecret(e.target.value)}
                  />
                </div>
                <div className="flex items-center justify-between pt-2">
                  <div>
                    <p className="font-medium">Mode Test</p>
                    <p className="text-sm text-muted-foreground">Utilisez les clés de test pour les développements</p>
                  </div>
                  <Switch checked={stripeTestMode} onCheckedChange={setStripeTestMode} />
                </div>
                <Button className="w-full" onClick={handleSaveStripe}>Sauvegarder la configuration Stripe</Button>
              </div>
            </Card>

            {/* WooCommerce Integration */}
            <Card className="p-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 rounded-xl bg-[#96588A]/10">
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="#96588A">
                    <path d="M2.227 4.857A2.228 2.228 0 000 7.094v7.457c0 1.236 1.001 2.227 2.227 2.227h3.986l-.552 3.29 4.092-3.29h11.02c1.235 0 2.227-.992 2.227-2.227V7.094c0-1.236-.992-2.237-2.227-2.237H2.227zm.56 1.509h18.398c.43 0 .76.33.77.769v7.038c0 .439-.34.779-.77.779H9.202l-2.424 1.946.33-1.946H2.787c-.44 0-.78-.34-.78-.779V7.135c0-.44.34-.769.78-.769zM5.8 8.063c-.56 0-.91.309-1.06.589-.38.7-.7 1.909-.97 3.62-.13.87-.28 1.471-.38 1.8-.11.311-.21.481-.31.481-.16 0-.28-.16-.38-.47-.22-.769-.39-1.74-.53-2.91-.04-.34-.22-.509-.52-.509s-.47.26-.49.779c-.06 1.201-.19 2.211-.4 3.031-.05.189-.16.279-.31.279-.18 0-.34-.229-.5-.69-.23-.62-.35-1.71-.35-3.27 0-.58-.2-.87-.55-.87-.24 0-.41.14-.49.42-.1.351-.16.741-.19 1.171-.03.33-.21.5-.52.5-.36 0-.56-.25-.56-.741 0-.649.19-1.359.54-2.129.38-.84.83-1.261 1.35-1.261.49 0 .85.32 1.08.96a12 12 0 01.43 2.051c.09.54.23 1.05.39 1.529.27-.909.5-1.979.68-3.21.08-.53.35-.8.8-.8zm4.13.82c-.8 0-1.42.471-1.85 1.42-.38.83-.56 1.771-.56 2.811 0 .71.12 1.26.38 1.66.28.42.66.63 1.15.63.79 0 1.4-.47 1.84-1.42.38-.83.57-1.779.57-2.819 0-.71-.13-1.261-.38-1.661-.28-.41-.66-.621-1.15-.621zm6.05.009c-.29 0-.54.11-.75.34-.2.221-.33.521-.39.9a12.81 12.81 0 00-.13 1.78c0 .949.11 1.79.32 2.519.04.13.05.25.05.37 0 .199-.07.359-.2.489-.13.13-.29.19-.49.19-.33 0-.59-.199-.79-.599-.19-.41-.29-.91-.29-1.5 0-.83.09-1.621.26-2.371.17-.74.27-1.14.3-1.209a.548.548 0 01.52-.35c.31 0 .47.17.47.51 0 .09-.01.17-.04.23-.08.28-.17.76-.26 1.45.24-.681.53-1.211.89-1.591.37-.39.78-.59 1.22-.59.28 0 .5.101.68.31.18.199.27.459.27.779 0 .37-.09.67-.28.91-.15.19-.33.279-.52.279-.2 0-.38-.119-.51-.359-.13-.23-.2-.359-.2-.389 0-.03-.04-.04-.12-.04-.2 0-.44.2-.72.6-.35.479-.62 1.099-.79 1.859-.1.441-.16.89-.16 1.35 0 .291.02.551.04.791.04.3-.1.449-.36.449-.29 0-.48-.129-.56-.389-.06-.2-.1-.51-.1-.93 0-.66.06-1.35.19-2.06.13-.729.3-1.359.51-1.899.19-.5.46-.75.81-.75zm-6.05.661c.19 0 .32.18.41.539.08.34.12.75.12 1.231 0 .63-.09 1.24-.28 1.83-.22.67-.5 1-.84 1-.18 0-.32-.18-.41-.531-.09-.34-.13-.75-.13-1.229 0-.631.1-1.24.28-1.831.22-.67.5-1.009.85-1.009z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">WooCommerce</h3>
                  <p className="text-sm text-muted-foreground">Synchronisez vos produits et commandes avec votre boutique WordPress</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="woo-url">URL de la boutique</Label>
                  <Input id="woo-url" placeholder="https://votreboutique.com" />
                </div>
                <div>
                  <Label htmlFor="woo-key">Consumer Key</Label>
                  <Input id="woo-key" placeholder="ck_..." className="font-mono text-sm" />
                </div>
                <div>
                  <Label htmlFor="woo-secret">Consumer Secret</Label>
                  <Input id="woo-secret" type="password" placeholder="cs_..." className="font-mono text-sm" />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Synchronisation automatique</p>
                    <p className="text-sm text-muted-foreground">Synchronisez les produits toutes les heures</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Importer les commandes</p>
                    <p className="text-sm text-muted-foreground">Récupérez les nouvelles commandes automatiquement</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Button className="w-full">Sauvegarder la configuration WooCommerce</Button>
              </div>
            </Card>

            {/* PayPal Integration */}
            <Card className="p-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 rounded-xl bg-[#003087]/10">
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="#003087">
                    <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.59 3.025-2.566 6.082-8.558 6.082h-2.19c-1.717 0-3.146 1.27-3.402 2.997L5.23 22.54c-.072.45.264.86.72.86h4.247c.508 0 .94-.368 1.02-.867l.03-.162.788-4.99.051-.276a1.028 1.028 0 0 1 1.015-.866h.64c4.149 0 7.394-1.686 8.342-6.561.28-1.44.209-2.593-.861-3.76z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    PayPal
                  </h3>
                  <p className="text-sm text-muted-foreground">Acceptez les paiements via PayPal</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="paypal-client-id">Client ID</Label>
                  <Input
                    id="paypal-client-id"
                    placeholder="AaBbCc..."
                    className="font-mono text-sm"
                    value={paypalClientId}
                    onChange={(e) => setPaypalClientId(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="paypal-secret">Client Secret</Label>
                  <Input
                    id="paypal-secret"
                    type="password"
                    placeholder="EIDkPnPt..."
                    className="font-mono text-sm"
                    value={paypalClientSecret}
                    onChange={(e) => setPaypalClientSecret(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">Ne partagez jamais votre secret</p>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <div>
                    <p className="font-medium">Mode Sandbox</p>
                    <p className="text-sm text-muted-foreground">Utilisez l'environnement de test PayPal</p>
                  </div>
                  <Switch checked={paypalSandboxMode} onCheckedChange={setPaypalSandboxMode} />
                </div>
                <Button className="w-full" onClick={handleSavePayPal}>Sauvegarder la configuration PayPal</Button>
              </div>
            </Card>

            {/* Other Integrations */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Autres intégrations</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#1A1F71]/10">
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="#1A1F71">
                        <path d="M20.033 11h1.967v2h-1.967v-2zm-2.725 4.548c-.128.246-.396.452-.852.452h-1.491V9h1.491c.456 0 .724.206.852.452h1.725c-.171-1.231-1.154-2.452-2.577-2.452H13v10h2.456c1.423 0 2.406-1.221 2.577-2.452h-1.725zM9 17V9h2v8H9zm-5-6h2v2H4v-2z" />
                      </svg>
                    </div>
                    <span className="font-medium">Visa Direct</span>
                  </div>
                  <Button variant="outline" size="sm">Bientôt</Button>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#FF5F00]/10">
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="#FF5F00">
                        <circle cx="7" cy="12" r="7" fill="#EB001B" />
                        <circle cx="17" cy="12" r="7" fill="#F79E1B" />
                      </svg>
                    </div>
                    <span className="font-medium">Mastercard</span>
                  </div>
                  <Button variant="outline" size="sm">Via Stripe</Button>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Apparence</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Mode Sombre</p>
                    <p className="text-sm text-muted-foreground">Activer le thème sombre</p>
                  </div>
                  <Switch />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Animations</p>
                    <p className="text-sm text-muted-foreground">Activer les animations d'interface</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div>
                  <Label>Langue</Label>
                  <select className="w-full mt-2 p-2 rounded-md border bg-background">
                    <option>Français</option>
                    <option>English</option>
                    <option>Español</option>
                  </select>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="data" className="space-y-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Gestion des Données</h3>
              <div className="space-y-4">
                <div>
                  <p className="font-medium mb-2">Exporter vos données</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Téléchargez une copie de toutes vos données
                  </p>
                  <Button variant="outline" onClick={handleExportData}>Exporter les données</Button>
                </div>
                <Separator />
                <div>
                  <p className="font-medium mb-2 text-destructive">Zone de danger</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Actions irréversibles sur votre compte
                  </p>
                  <Button variant="destructive" onClick={handleDeleteAccount}>Supprimer mon compte</Button>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Settings;
