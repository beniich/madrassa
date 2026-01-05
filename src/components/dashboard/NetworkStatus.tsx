/**
 * SchoolGenius - Indicateur de statut réseau et synchronisation
 */

import { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw, Check, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { usePendingSyncCount } from '@/hooks/useOfflineData';
import { syncEngine } from '@/lib/syncEngine';
import { cn } from '@/lib/utils';

type SyncStatus = 'idle' | 'syncing' | 'success' | 'error';

const NetworkStatus = () => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
    const pendingCount = usePendingSyncCount();

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const handleSync = async () => {
        if (!isOnline) return;

        setSyncStatus('syncing');
        try {
            const result = await syncEngine.syncNow();
            setSyncStatus(result.success ? 'success' : 'error');

            // Reset après 3 secondes
            setTimeout(() => setSyncStatus('idle'), 3000);
        } catch {
            setSyncStatus('error');
            setTimeout(() => setSyncStatus('idle'), 3000);
        }
    };

    const getStatusIcon = () => {
        switch (syncStatus) {
            case 'syncing':
                return <RefreshCw className="h-4 w-4 animate-spin" />;
            case 'success':
                return <Check className="h-4 w-4 text-green-500" />;
            case 'error':
                return <AlertTriangle className="h-4 w-4 text-destructive" />;
            default:
                return isOnline ? (
                    <Wifi className="h-4 w-4 text-green-500" />
                ) : (
                    <WifiOff className="h-4 w-4 text-destructive" />
                );
        }
    };

    const getStatusText = () => {
        if (syncStatus === 'syncing') return 'Synchronisation...';
        if (syncStatus === 'success') return 'Synchronisé !';
        if (syncStatus === 'error') return 'Erreur de sync';
        return isOnline ? 'En ligne' : 'Hors ligne';
    };

    return (
        <div className="flex items-center gap-2">
            {/* Badge avec compteur si hors ligne ou actions en attente */}
            {(!isOnline || (pendingCount && pendingCount > 0)) && (
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Badge
                            variant="outline"
                            className={cn(
                                'gap-1',
                                isOnline
                                    ? 'border-yellow-500/50 text-yellow-600'
                                    : 'border-destructive/50 text-destructive'
                            )}
                        >
                            {!isOnline && <WifiOff className="h-3 w-3" />}
                            {pendingCount && pendingCount > 0 ? `${pendingCount} en attente` : 'Hors ligne'}
                        </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                        {!isOnline
                            ? 'Vous êtes hors ligne. Les modifications seront synchronisées au retour de la connexion.'
                            : `${pendingCount} modification(s) en attente de synchronisation`}
                    </TooltipContent>
                </Tooltip>
            )}

            {/* Bouton de sync */}
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleSync}
                        disabled={!isOnline || syncStatus === 'syncing'}
                        className="h-8 w-8"
                    >
                        {getStatusIcon()}
                    </Button>
                </TooltipTrigger>
                <TooltipContent>{getStatusText()}</TooltipContent>
            </Tooltip>
        </div>
    );
};

export default NetworkStatus;
