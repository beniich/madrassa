
import { SchoolFile, SchoolFolder } from '../types/school-365';

class DocumentsService {
    private static instance: DocumentsService;

    private constructor() { }

    public static getInstance(): DocumentsService {
        if (!DocumentsService.instance) {
            DocumentsService.instance = new DocumentsService();
        }
        return DocumentsService.instance;
    }

    public async getFolders(parentId: string | null = null): Promise<SchoolFolder[]> {
        // Structure initiale
        if (parentId === null) {
            return [
                { id: 'f-eco', name: 'École', parentId: null, itemCount: 12 },
                { id: 'f-cla', name: 'Classes', parentId: null, itemCount: 45 },
                { id: 'f-ele', name: 'Élèves', parentId: null, itemCount: 150 },
            ];
        }

        // Sous-dossiers exemple pour 'Classes'
        if (parentId === 'f-cla') {
            return [
                { id: 'f-cla-4b', name: 'Classe 4B', parentId: 'f-cla', itemCount: 15 },
                { id: 'f-cla-3a', name: 'Classe 3A', parentId: 'f-cla', itemCount: 10 },
            ];
        }

        return [];
    }

    public async getFiles(parentId: string): Promise<SchoolFile[]> {
        if (parentId === 'f-eco') {
            return [
                { id: 'file-1', name: 'Procédures_Rentrée.pdf', type: 'pdf', size: '1.2 MB', updatedAt: '2024-12-01', owner: 'Admin', parentId },
                { id: 'file-2', name: 'Planning_Annuel.xlsx', type: 'xlsx', size: '450 KB', updatedAt: '2024-11-20', owner: 'Direction', parentId },
            ];
        }

        if (parentId === 'f-cla-4b') {
            return [
                { id: 'file-3', name: 'Support_Cours_Maths.pdf', type: 'pdf', size: '2.5 MB', updatedAt: '2024-12-15', owner: 'M. Martin', parentId },
                { id: 'file-4', name: 'Devoir_Maison_1.docx', type: 'docx', size: '120 KB', updatedAt: '2024-12-18', owner: 'M. Martin', parentId },
            ];
        }

        return [];
    }
}

export const documentsService = DocumentsService.getInstance();
