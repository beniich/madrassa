import React, { useState } from 'react';
import GoogleSheetEmbed from '@/components/googlesheets/GoogleSheetEmbed';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileSpreadsheet } from 'lucide-react';

const GoogleSheetsPage: React.FC = () => {
    const [sheetUrl, setSheetUrl] = useState('');
    const [activeSheetUrl, setActiveSheetUrl] = useState('');

    const handleLoadSheet = () => {
        if (sheetUrl.trim()) {
            setActiveSheetUrl(sheetUrl);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleLoadSheet();
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center gap-3">
                <FileSpreadsheet className="h-8 w-8 text-green-600" />
                <h1 className="text-3xl font-bold tracking-tight">Google Sheets</h1>
            </div>

            <Card className="max-w-2xl">
                <CardHeader>
                    <CardTitle>Intégrer une feuille Google</CardTitle>
                    <CardDescription>
                        Collez l'URL de votre Google Sheet ci-dessous. Assurez-vous que la feuille soit partagée publiquement ou que vous ayez les permissions d'accès.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="sheetUrl">URL de la feuille Google</Label>
                        <Input
                            id="sheetUrl"
                            value={sheetUrl}
                            onChange={(e) => setSheetUrl(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="https://docs.google.com/spreadsheets/d/..."
                            className="font-mono text-sm"
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button onClick={handleLoadSheet} className="flex-1">
                            Charger la feuille
                        </Button>
                        {activeSheetUrl && (
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setActiveSheetUrl('');
                                    setSheetUrl('');
                                }}
                            >
                                Réinitialiser
                            </Button>
                        )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                        <p className="font-semibold mb-2">💡 Comment obtenir l'URL :</p>
                        <ol className="list-decimal list-inside space-y-1">
                            <li>Ouvrez votre Google Sheet</li>
                            <li>Cliquez sur "Partager" en haut à droite</li>
                            <li>Activez "Toute personne disposant du lien"</li>
                            <li>Copiez le lien et collez-le ici</li>
                        </ol>
                    </div>
                </CardContent>
            </Card>

            {activeSheetUrl && (
                <div className="space-y-4">
                    <GoogleSheetEmbed sheetUrl={activeSheetUrl} />
                </div>
            )}
        </div>
    );
};

export default GoogleSheetsPage;
