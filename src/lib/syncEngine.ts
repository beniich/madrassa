/**
 * SchoolGenius - Sync Engine
 * Gestion de la synchronisation offline/online avec support Multi-Tenancy
 */

import { db, SyncAction, generateLocalId, getCurrentTimestamp } from './db';

// ============================================
// TYPES
// ============================================

type EntityType = 'student' | 'teacher' | 'class' | 'attendance' | 'grade' | 'message' | 'exam' | 'invoice' | 'document';
type ActionType = 'CREATE' | 'UPDATE' | 'DELETE';

interface SyncResult {
    success: boolean;
    syncedCount: number;
    failedCount: number;
    errors: string[];
}

// ============================================
// SYNC ENGINE CLASS
// ============================================

class SyncEngine {
    private isSyncing = false;
    private apiBaseUrl = '/api'; // À configurer selon le backend
    private maxRetries = 3;

    // ==========================================
    // QUEUE MANAGEMENT - File d'actions locales
    // ==========================================

    /**
     * Ajoute une action à la file de synchronisation
     */
    async queueAction(
        type: ActionType,
        entity: EntityType,
        entityId: string,
        payload: any,
        schoolId: string
    ): Promise<void> {
        const action: SyncAction = {
            actionId: generateLocalId(),
            schoolId, // Separation au niveau de la sync
            type,
            entity,
            entityId,
            payload: JSON.stringify(payload),
            status: 'pending',
            retryCount: 0,
            createdAt: getCurrentTimestamp(),
        };

        await db.syncActions.add(action);
        console.log(`[SyncEngine] Action queued [${schoolId}]: ${type} ${entity} ${entityId}`);

        // Tenter une sync immédiate si online
        if (navigator.onLine) {
            this.syncNow();
        }
    }

    /**
     * Récupère les actions en attente
     */
    async getPendingActions(): Promise<SyncAction[]> {
        return db.syncActions
            .where('status')
            .anyOf(['pending', 'error'])
            .and((action) => action.retryCount < this.maxRetries)
            .toArray();
    }

    // ==========================================
    // SYNCHRONIZATION
    // ==========================================

    /**
     * Lance la synchronisation
     */
    async syncNow(): Promise<SyncResult> {
        if (this.isSyncing) {
            return { success: false, syncedCount: 0, failedCount: 0, errors: ['Sync in progress'] };
        }

        if (!navigator.onLine) {
            return { success: false, syncedCount: 0, failedCount: 0, errors: ['Offline'] };
        }

        this.isSyncing = true;
        const result: SyncResult = { success: true, syncedCount: 0, failedCount: 0, errors: [] };

        try {
            const pendingActions = await this.getPendingActions();

            for (const action of pendingActions) {
                try {
                    await this.processSyncAction(action);
                    result.syncedCount++;
                } catch (error) {
                    result.failedCount++;
                    result.errors.push(`${action.entity}/${action.entityId}: ${error}`);
                }
            }

            console.log(`[SyncEngine] Sync complete: ${result.syncedCount} synced, ${result.failedCount} failed`);
        } catch (error) {
            result.success = false;
            result.errors.push(`Sync error: ${error}`);
        } finally {
            this.isSyncing = false;
        }

        return result;
    }

    /**
     * Traite une action de synchronisation
     */
    private async processSyncAction(action: SyncAction): Promise<void> {
        await db.syncActions.update(action.id!, { status: 'syncing' });

        try {
            const payload = JSON.parse(action.payload);
            const endpoint = this.getEndpoint(action.entity);

            let response: Response;

            // Inclure schoolId dans les headers pour le backend
            const headers = {
                'Content-Type': 'application/json',
                'X-School-Id': action.schoolId
            };

            switch (action.type) {
                case 'CREATE':
                    response = await fetch(`${this.apiBaseUrl}${endpoint}`, {
                        method: 'POST',
                        headers,
                        body: JSON.stringify(payload),
                    });
                    break;

                case 'UPDATE':
                    response = await fetch(`${this.apiBaseUrl}${endpoint}/${action.entityId}`, {
                        method: 'PUT',
                        headers,
                        body: JSON.stringify(payload),
                    });
                    break;

                case 'DELETE':
                    response = await fetch(`${this.apiBaseUrl}${endpoint}/${action.entityId}`, {
                        method: 'DELETE',
                        headers,
                    });
                    break;

                default:
                    throw new Error(`Unknown action type: ${action.type}`);
            }

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            await db.syncActions.update(action.id!, {
                status: 'synced',
                syncedAt: getCurrentTimestamp(),
            });

            await this.updateEntitySyncStatus(action.entity, action.entityId, 'synced');

        } catch (error) {
            await db.syncActions.update(action.id!, {
                status: 'error',
                retryCount: action.retryCount + 1,
                errorMessage: String(error),
            });
            throw error;
        }
    }

    private getEndpoint(entity: EntityType): string {
        const endpoints: Record<EntityType, string> = {
            student: '/students',
            teacher: '/teachers',
            class: '/classes',
            attendance: '/attendance',
            grade: '/grades',
            message: '/messages',
            exam: '/exams',
            invoice: '/invoices',
            document: '/documents'
        };
        return endpoints[entity];
    }

    private async updateEntitySyncStatus(
        entity: EntityType,
        localId: string,
        status: 'pending' | 'synced' | 'error'
    ): Promise<void> {
        const tableMap: any = {
            student: db.students,
            teacher: db.teachers,
            class: db.classes,
            attendance: db.attendance,
            grade: db.grades,
            message: db.messages,
            exam: db.exams,
            invoice: db.invoices,
            document: db.documents
        };

        const table = tableMap[entity];
        if (table) {
            const record = await table.where('localId').equals(localId).first();
            if (record) {
                await table.update(record.id!, { syncStatus: status });
            }
        }
    }

    initNetworkListeners(): void {
        window.addEventListener('online', () => this.syncNow());
    }
}

export const syncEngine = new SyncEngine();

if (typeof window !== 'undefined') {
    syncEngine.initNetworkListeners();
}
