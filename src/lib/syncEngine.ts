/**
 * SchoolGenius - Sync Engine
 * Gestion de la synchronisation offline/online avec support Multi-Tenancy
 * Mode: PRODUCTION — synchronise avec le backend JWT sur port 5000
 */

import { db, SyncAction, generateLocalId, getCurrentTimestamp } from './db';
import { API_BASE_URL } from './apiClient';

// ============================================
// TYPES
// ============================================

export type EntityType = 'student' | 'teacher' | 'class' | 'subject' | 'attendance' | 'grade' | 'message' | 'exam' | 'invoice' | 'document' | 'schoolProfile';
type ActionType = 'CREATE' | 'UPDATE' | 'DELETE';

interface SyncResult {
    success: boolean;
    syncedCount: number;
    failedCount: number;
    errors: string[];
}

type DexieTable = {
    where: (key: string) => { equals: (val: string) => { first: () => Promise<any> } };
    update: (id: number, changes: object) => Promise<number>;
    add: (data: any) => Promise<any>;
};

// ============================================
// SYNC ENGINE CLASS
// ============================================

class SyncEngine {
    private isSyncing = false;
    private maxRetries = 3;

    // ==========================================
    // TOKEN RESOLUTION
    // ==========================================

    private getToken(): string | null {
        const raw = localStorage.getItem('sg_user');
        if (!raw) return null;
        try {
            return JSON.parse(raw)?.token ?? null;
        } catch {
            return null;
        }
    }

    private buildHeaders(schoolId: string): Record<string, string> {
        const token = this.getToken();
        return {
            'Content-Type': 'application/json',
            'X-School-Id': schoolId,
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };
    }

    // ==========================================
    // QUEUE MANAGEMENT
    // ==========================================

    async queueAction(
        type: ActionType,
        entity: EntityType,
        entityId: string,
        payload: unknown,
        schoolId: string
    ): Promise<void> {
        const action: SyncAction = {
            actionId: generateLocalId(),
            schoolId,
            type,
            entity,
            entityId,
            payload: JSON.stringify(payload),
            status: 'pending',
            retryCount: 0,
            createdAt: getCurrentTimestamp(),
        };

        await db.syncActions.add(action);
        console.log(`[SyncEngine] Queued [${schoolId}]: ${type} ${entity} ${entityId}`);

        if (navigator.onLine) {
            this.syncNow();
        }
    }

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

    private async processSyncAction(action: SyncAction): Promise<void> {
        await db.syncActions.update(action.id!, { status: 'syncing' });

        try {
            const payload = JSON.parse(action.payload);
            const endpoint = this.getEndpoint(action.entity);
            const headers = this.buildHeaders(action.schoolId);

            let response: Response;

            switch (action.type) {
                case 'CREATE':
                    response = await fetch(`${API_BASE_URL}${endpoint}`, {
                        method: 'POST',
                        headers,
                        body: JSON.stringify(payload),
                    });
                    break;

                case 'UPDATE':
                    response = await fetch(`${API_BASE_URL}${endpoint}/${action.entityId}`, {
                        method: 'PUT',
                        headers,
                        body: JSON.stringify(payload),
                    });
                    break;

                case 'DELETE':
                    response = await fetch(`${API_BASE_URL}${endpoint}/${action.entityId}`, {
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
            subject: '/subjects',
            attendance: '/attendance',
            grade: '/grades',
            message: '/messages',
            exam: '/exams',
            invoice: '/invoices',
            document: '/documents',
            schoolProfile: '/school-profile',
        };
        return endpoints[entity];
    }

    private async updateEntitySyncStatus(
        entity: EntityType,
        localId: string,
        status: 'pending' | 'synced' | 'error'
    ): Promise<void> {
        const tableMap: Record<EntityType, DexieTable> = {
            student: db.students as unknown as DexieTable,
            teacher: db.teachers as unknown as DexieTable,
            class: db.classes as unknown as DexieTable,
            subject: db.subjects as unknown as DexieTable,
            attendance: db.attendance as unknown as DexieTable,
            grade: db.grades as unknown as DexieTable,
            message: db.messages as unknown as DexieTable,
            exam: db.exams as unknown as DexieTable,
            invoice: db.invoices as unknown as DexieTable,
            document: db.documents as unknown as DexieTable,
            schoolProfile: db.schoolProfile as unknown as DexieTable,
        };

        const table = tableMap[entity];
        if (!table) return;

        const record = await table.where('localId').equals(localId).first();
        if (record) {
            await table.update(record.id!, { syncStatus: status });
        }
    }

    // ==========================================
    // PULL SYNCHRONIZATION (Server -> Local)
    // ==========================================

    /**
     * Pulls all records for a specific entity type and updates local DB.
     */
    async pullEntity(entity: EntityType, schoolId: string): Promise<void> {
        const token = this.getToken();
        if (!token || !navigator.onLine) return;

        try {
            const endpoint = this.getEndpoint(entity);
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'GET',
                headers: this.buildHeaders(schoolId),
            });

            if (!response.ok) throw new Error(`Pull ${entity} failed: ${response.status}`);

            const remoteData = await response.json();
            if (!Array.isArray(remoteData)) return;

            const tableMap: Record<EntityType, DexieTable> = {
                student: db.students as unknown as DexieTable,
                teacher: db.teachers as unknown as DexieTable,
                class: db.classes as unknown as DexieTable,
                subject: db.subjects as unknown as DexieTable,
                attendance: db.attendance as unknown as DexieTable,
                grade: db.grades as unknown as DexieTable,
                message: db.messages as unknown as DexieTable,
                exam: db.exams as unknown as DexieTable,
                invoice: db.invoices as unknown as DexieTable,
                document: db.documents as unknown as DexieTable,
                schoolProfile: db.schoolProfile as unknown as DexieTable,
            };

            const table = tableMap[entity];
            if (!table) return;

            for (const item of remoteData) {
                const localId = item.localId;
                if (!localId) continue;

                const existing = await table.where('localId').equals(localId).first();
                if (existing) {
                    await table.update(existing.id!, { ...item, syncStatus: 'synced' });
                } else {
                    await table.add({ ...item, syncStatus: 'synced' });
                }
            }
            console.log(`[SyncEngine] Successfully pulled ${remoteData.length} ${entity}s`);
        } catch (error) {
            console.error(`[SyncEngine] Error pulling ${entity}:`, error);
        }
    }

    /**
     * Pulls everything for the current school.
     */
    async pullAll(schoolId: string): Promise<void> {
        console.log(`[SyncEngine] Starting full pull for school: ${schoolId}`);
        const entities: EntityType[] = ['class', 'teacher', 'student', 'subject', 'attendance', 'grade', 'message', 'exam', 'invoice', 'document'];
        
        await Promise.allSettled(entities.map(e => this.pullEntity(e, schoolId)));
        console.log(`[SyncEngine] Full pull completed.`);
    }

    initNetworkListeners(): void {
        window.addEventListener('online', () => {
            console.log('[SyncEngine] Back online — starting sync...');
            this.syncNow();
        });
        window.addEventListener('offline', () => {
            console.log('[SyncEngine] Offline — queuing changes locally.');
        });
    }
}

export const syncEngine = new SyncEngine();

if (typeof window !== 'undefined') {
    syncEngine.initNetworkListeners();
}
