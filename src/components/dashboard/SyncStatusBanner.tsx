import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { CloudOff, RefreshCw, CheckCircle2 } from 'lucide-react';
import { syncEngine } from '@/lib/syncEngine';
import { db } from '@/lib/db';
import { useLiveQuery } from 'dexie-react-hooks';
import { cn } from '@/lib/utils';

export const SyncStatusBanner: React.FC = () => {
    const [isSyncing, setIsSyncing] = useState(false);
    
    const pendingActionsCount = useLiveQuery(
        () => db.syncActions.where('status').anyOf(['pending', 'error']).count()
    ) || 0;

    const handleSync = async () => {
        if (isSyncing) return;
        setIsSyncing(true);
        try {
            await syncEngine.syncNow();
        } finally {
            setIsSyncing(false);
        }
    };

    if (pendingActionsCount === 0) return null;

    return (
        <div className={cn(
            "fixed bottom-4 right-4 z-[100] flex items-center gap-3 p-3 rounded-lg shadow-2xl border transition-all duration-300 animate-in fade-in slide-in-from-bottom-4",
            pendingActionsCount > 0 ? "bg-amber-50 border-amber-200 text-amber-800" : "bg-green-50 border-green-200 text-green-800"
        )}>
            <div className="flex items-center gap-2">
                <CloudOff className="w-4 h-4" />
                <span className="text-sm font-medium">
                    {pendingActionsCount} modification{pendingActionsCount > 1 ? 's' : ''} non synchronisée{pendingActionsCount > 1 ? 's' : ''}
                </span>
            </div>
            
            <Button 
                size="sm" 
                variant="outline" 
                onClick={handleSync}
                disabled={isSyncing}
                className="bg-white hover:bg-amber-100 border-amber-300 text-amber-900 h-8 gap-2"
            >
                <RefreshCw className={cn("w-3.5 h-3.5", isSyncing && "animate-spin")} />
                {isSyncing ? 'Sync...' : 'Synchroniser'}
            </Button>
        </div>
    );
};
