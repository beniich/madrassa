import React, { useState } from 'react';
import PowerBIReport from '@/components/powerbi/PowerBIReport';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const PowerBIDashboard: React.FC = () => {
    // Using placeholders or local state for testing
    // In a real app, these would come from an API/backend
    const [reportId, setReportId] = useState('');
    const [embedUrl, setEmbedUrl] = useState('');
    const [accessToken, setAccessToken] = useState('');
    const [showReport, setShowReport] = useState(false);

    const handleLoadReport = () => {
        if (reportId && embedUrl && accessToken) {
            setShowReport(true);
        }
    };

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Tableau de bord Power BI</h1>

            {!showReport ? (
                <div className="max-w-md space-y-4 p-4 border rounded-lg bg-card text-card-foreground">
                    <h2 className="text-xl font-semibold">Configuration du rapport</h2>
                    <div className="space-y-2">
                        <Label htmlFor="reportId">ID du Rapport</Label>
                        <Input
                            id="reportId"
                            value={reportId}
                            onChange={(e) => setReportId(e.target.value)}
                            placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="embedUrl">URL d'intégration</Label>
                        <Input
                            id="embedUrl"
                            value={embedUrl}
                            onChange={(e) => setEmbedUrl(e.target.value)}
                            placeholder="https://app.powerbi.com/reportEmbed?..."
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="accessToken">Jeton d'accès (Embed Token)</Label>
                        <Input
                            id="accessToken"
                            value={accessToken}
                            onChange={(e) => setAccessToken(e.target.value)}
                            placeholder="Eym..."
                            type="password"
                        />
                    </div>
                    <Button onClick={handleLoadReport} className="w-full">
                        Charger le rapport
                    </Button>
                </div>
            ) : (
                <div className="space-y-4">
                    <Button variant="outline" onClick={() => setShowReport(false)}>
                        Retour à la configuration
                    </Button>
                    <PowerBIReport
                        reportId={reportId}
                        embedUrl={embedUrl}
                        accessToken={accessToken}
                    />
                </div>
            )}
        </div>
    );
};

export default PowerBIDashboard;
