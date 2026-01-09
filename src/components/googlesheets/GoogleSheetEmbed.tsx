import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface GoogleSheetEmbedProps {
    sheetUrl: string;
}

const GoogleSheetEmbed: React.FC<GoogleSheetEmbedProps> = ({ sheetUrl }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Convertir l'URL Google Sheets en URL d'intégration
    const getEmbedUrl = (url: string): string | null => {
        try {
            // Format: https://docs.google.com/spreadsheets/d/SHEET_ID/edit#gid=0
            // Converti en: https://docs.google.com/spreadsheets/d/SHEET_ID/edit?rm=minimal&output=embed

            if (url.includes('docs.google.com/spreadsheets')) {
                const sheetIdMatch = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
                if (sheetIdMatch) {
                    const sheetId = sheetIdMatch[1];

                    // Extraire le gid si présent
                    const gidMatch = url.match(/[#&]gid=([0-9]+)/);
                    const gid = gidMatch ? gidMatch[1] : '0';

                    return `https://docs.google.com/spreadsheets/d/${sheetId}/edit?rm=minimal&gid=${gid}&output=embed`;
                }
            }

            return null;
        } catch (err) {
            console.error('Erreur lors de la conversion de l\'URL:', err);
            return null;
        }
    };

    const embedUrl = getEmbedUrl(sheetUrl);

    const handleLoad = () => {
        setLoading(false);
        setError(null);
    };

    const handleError = () => {
        setLoading(false);
        setError('Impossible de charger la feuille. Assurez-vous que la feuille est partagée publiquement.');
    };

    if (!embedUrl) {
        return (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                    URL invalide. Veuillez fournir une URL Google Sheets valide.
                </AlertDescription>
            </Alert>
        );
    }

    return (
        <Card className="w-full h-[800px] flex flex-col">
            <CardHeader>
                <CardTitle>Google Sheet</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-0 relative min-h-[600px]">
                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10">
                        <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    </div>
                )}
                {error && (
                    <div className="absolute inset-0 flex items-center justify-center p-4 z-10">
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    </div>
                )}
                <iframe
                    src={embedUrl}
                    className="w-full h-full border-0"
                    onLoad={handleLoad}
                    onError={handleError}
                    title="Google Sheet"
                    allow="clipboard-read; clipboard-write"
                />
            </CardContent>
        </Card>
    );
};

export default GoogleSheetEmbed;
