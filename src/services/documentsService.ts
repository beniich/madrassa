/**
 * Documents Service - Real API Backend
 * Replaces hardcoded mock data with live calls to /api/documents
 */

import { apiClient } from '@/lib/apiClient';

export interface SchoolFolder {
    id: string;
    name: string;
    parentId: string | null;
    itemCount: number;
}

export interface SchoolFile {
    id: string;
    name: string;
    type: string;
    size: string;
    updatedAt: string;
    owner: string;
    parentId: string;
    url?: string;
}

class DocumentsService {
    private static instance: DocumentsService;

    private constructor() {}

    public static getInstance(): DocumentsService {
        if (!DocumentsService.instance) {
            DocumentsService.instance = new DocumentsService();
        }
        return DocumentsService.instance;
    }

    /**
     * Return all documents grouped as virtual folders by category.
     * Falls back to empty array if backend is unavailable.
     */
    public async getFolders(parentId: string | null = null): Promise<SchoolFolder[]> {
        try {
            const docs = await apiClient.get<any[]>('/documents');

            // Build virtual folders from category field
            const categories = new Map<string, number>();
            for (const doc of docs) {
                const cat = doc.category ?? 'Général';
                categories.set(cat, (categories.get(cat) ?? 0) + 1);
            }

            const allFolders: SchoolFolder[] = Array.from(categories.entries()).map(([cat, count]) => ({
                id: `folder-${cat.toLowerCase().replace(/\s+/g, '-')}`,
                name: cat,
                parentId: null,
                itemCount: count,
            }));

            if (parentId === null) return allFolders;

            // Virtual sub-folder navigation not supported yet — return empty
            return [];
        } catch (err) {
            console.error('[DocumentsService] getFolders error:', err);
            return [];
        }
    }

    /**
     * Return documents that belong to a given virtual folder (by category slug).
     */
    public async getFiles(parentId: string): Promise<SchoolFile[]> {
        try {
            const docs = await apiClient.get<any[]>('/documents');
            const folderName = parentId.replace('folder-', '').replace(/-/g, ' ');

            return docs
                .filter((d) => (d.category ?? 'général').toLowerCase() === folderName)
                .map((d) => ({
                    id: d.localId,
                    name: d.name,
                    type: d.type ?? 'other',
                    size: d.size ?? '—',
                    updatedAt: d.uploadedAt?.substring(0, 10) ?? '',
                    owner: d.uploadedBy ?? 'Inconnu',
                    parentId,
                    url: d.fileUrl ?? undefined,
                }));
        } catch (err) {
            console.error('[DocumentsService] getFiles error:', err);
            return [];
        }
    }

    /**
     * Upload a new document.
     */
    public async uploadDocument(doc: Omit<SchoolFile, 'id'>): Promise<void> {
        await apiClient.post('/documents', doc);
    }

    /**
     * Delete a document by its localId.
     */
    public async deleteDocument(localId: string): Promise<void> {
        await apiClient.delete(`/documents/${localId}`);
    }
}

export const documentsService = DocumentsService.getInstance();
