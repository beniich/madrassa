import React, { useState } from 'react';
import { PowerBIEmbed } from 'powerbi-client-react';
import { models } from 'powerbi-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface PowerBIReportProps {
    reportId: string;
    embedUrl: string;
    accessToken: string;
}

const PowerBIReport: React.FC<PowerBIReportProps> = ({ reportId, embedUrl, accessToken }) => {
    const [loading, setLoading] = useState(true);

    return (
        <Card className="w-full h-[800px] flex flex-col">
            <CardHeader>
                <CardTitle>Rapport Power BI</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-0 relative min-h-[600px]">
                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10">
                        <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    </div>
                )}
                <div className="h-full w-full">
                    <PowerBIEmbed
                        embedConfig={{
                            type: 'report',
                            id: reportId,
                            embedUrl: embedUrl,
                            accessToken: accessToken,
                            tokenType: models.TokenType.Embed,
                            settings: {
                                panes: {
                                    filters: {
                                        expanded: false,
                                        visible: true
                                    }
                                },
                                background: models.BackgroundType.Transparent,
                            }
                        }}
                        eventHandlers={
                            new Map([
                                ['loaded', function () { setLoading(false); console.log('Report loaded'); }],
                                ['rendered', function () { console.log('Report rendered'); }],
                                ['error', function (event) { console.log('Error', event); setLoading(false); }]
                            ])
                        }
                        cssClassName={"h-full w-full"}
                        getEmbeddedComponent={(embeddedReport) => {
                            // You can access the embedded report object here
                            // window.report = embeddedReport;
                        }}
                    />
                </div>
            </CardContent>
        </Card>
    );
};

export default PowerBIReport;
