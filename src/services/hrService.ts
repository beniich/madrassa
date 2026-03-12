/**
 * HR Service - Gestion des Ressources Humaines
 * Gère les enseignants et le personnel via l'endpoint /api/hr.
 */

import { apiClient } from '@/lib/apiClient';
import { generateLocalId } from '@/lib/db';

export interface HRMember {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    subject: string;
    classes: string[];
    experience: number;
    students: number;
    hoursPerWeek: number;
    status: 'active' | 'onLeave' | 'inactive';
    hireDate: string;
    photo?: string;
}

class HRService {
    private static instance: HRService;

    private constructor() {}

    public static getInstance(): HRService {
        if (!HRService.instance) {
            HRService.instance = new HRService();
        }
        return HRService.instance;
    }

    public async getHRMembers(): Promise<HRMember[]> {
        try {
            const raw = await apiClient.get<any[]>('/hr');
            return raw.map((t) => ({
                id: t.localId ?? t.id,
                firstName: t.firstName ?? '',
                lastName: t.lastName ?? '',
                email: t.email ?? '',
                phone: t.phone ?? '',
                subject: t.subject ?? '',
                classes: t.classes ?? [],
                experience: t.experience ?? 0,
                students: t.students ?? 0,
                hoursPerWeek: t.hoursPerWeek ?? 0,
                status: t.status ?? 'active',
                hireDate: t.hireDate ?? '',
                photo: t.photo,
            }));
        } catch (err) {
            console.warn('[HRService] Backend unavailable, returning empty list:', err);
            return [];
        }
    }

    public async createHRMember(member: Omit<HRMember, 'id'>): Promise<HRMember> {
        const localId = generateLocalId();
        const payload = { localId, ...member };

        try {
            await apiClient.post('/hr', payload);
        } catch (err) {
            console.warn('[HRService] Failed to persist member:', err);
        }

        return { id: localId, ...member };
    }

    public async updateHRMember(id: string, updates: Partial<HRMember>): Promise<void> {
        try {
            await apiClient.put(`/hr/${id}`, updates);
        } catch (err) {
            console.warn('[HRService] Failed to update member:', err);
        }
    }

    public async deleteHRMember(id: string): Promise<void> {
        try {
            await apiClient.delete(`/hr/${id}`);
        } catch (err) {
            console.warn('[HRService] Failed to delete member:', err);
        }
    }
}

export const hrService = HRService.getInstance();
