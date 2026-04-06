import { db, SyncAction } from '@/lib/db';
import { apiClient } from '@/lib/apiClient';

class DbSyncService {
    private isSyncing = false;
    private maxRetries = 5;

    constructor() {
        if (typeof window !== 'undefined') {
            // Reprendre la synchro dès le retour en ligne
            window.addEventListener('online', this.triggerSync.bind(this));
            
            // Lancer également un balayage périodique (toutes les 5 minutes)
            setInterval(() => {
                if (navigator.onLine) {
                    this.triggerSync();
                }
            }, 5 * 60 * 1000);
        }
    }

    /**
     * Save une nouvelle action de synchronisation locale
     */
    async addAction(action: Omit<SyncAction, 'id' | 'status' | 'retryCount' | 'createdAt'>) {
        await db.syncActions.add({
            ...action,
            status: 'pending',
            retryCount: 0,
            createdAt: new Date().toISOString()
        });
        
        // Tenter une synchro immédiate si en ligne
        if (typeof navigator !== 'undefined' && navigator.onLine) {
            this.triggerSync();
        }
    }

    /**
     * Pousse toutes les données en attente vers le backend
     */
    async triggerSync() {
        if (this.isSyncing || typeof navigator === 'undefined' || !navigator.onLine) return;
        this.isSyncing = true;

        try {
            // Récupérer les actions 'pending' et 'error' (avec un droit au retry)
            const actionsToSync = await db.syncActions
                .where('status')
                .anyOf(['pending', 'error'])
                .filter(action => action.retryCount < this.maxRetries)
                .toArray();

            if (actionsToSync.length === 0) {
                this.isSyncing = false;
                return;
            }

            // Mettre à jour l'état visuel/interne "en cours de synchro"
            const actionIds = actionsToSync.map(a => a.id!);
            await Promise.all(
                actionIds.map(id => db.syncActions.update(id, { status: 'syncing' }))
            );

            console.log(`[SyncService] Pushing ${actionsToSync.length} actions to Cloud...`);

            // ⚠️ On suppose ici que le backend expose un endpoint '/sync/batch'
            // En attendant que ce Endpoint soit implémenté côté Drizzle, la requête s'exécute.
            const response = await apiClient.post<{ success: boolean; errors?: any[] }>('/sync/batch', {
                actions: actionsToSync
            });

            if (response.success) {
                // Success -> On supprime la queue pour éviter le gommage de l'espace local
                await db.syncActions.bulkDelete(actionIds);
                console.log(`[SyncService] Success de synchronisation de ${actionIds.length} objets.`);
            } else {
                throw new Error("Batch sync returned partial or full failure.");
            }
        } catch (error) {
            console.error('[SyncService] Échec synchronisation:', error);
            
            // Revert 'syncing' to 'error' and increment retry counters
            const syncingActions = await db.syncActions.where('status').equals('syncing').toArray();
            await Promise.all(syncingActions.map(action => 
                db.syncActions.update(action.id!, {
                    status: 'error',
                    retryCount: (action.retryCount || 0) + 1,
                    errorMessage: (error as Error).message
                })
            ));
        } finally {
            this.isSyncing = false;
        }
    }

    /**
     * Stats actuelles de l'Offline Queue
     */
    async getSyncStatus() {
        const pendingCount = await db.syncActions.where('status').equals('pending').count();
        const errorCount = await db.syncActions.where('status').equals('error').count();
        
        return { 
            pendingCount, 
            errorCount, 
            isOnline: typeof navigator !== 'undefined' ? navigator.onLine : false,
            totalQueued: pendingCount + errorCount
        };
    }
}

export const syncService = new DbSyncService();
