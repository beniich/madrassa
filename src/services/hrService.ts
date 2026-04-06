/**
 * HR Service - Human Resources Management
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
    address?: string;
    contractType?: string;
}

export interface LeaveRequest {
    id: string;
    employee: string;
    type: string;
    startDate: string;
    endDate: string;
    days: number;
    status: 'pending' | 'approved' | 'rejected';
    department: string;
}

interface RawHRMember {
    localId?: string;
    id: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    subject?: string;
    classes?: string[];
    experience?: number;
    students?: number;
    hoursPerWeek?: number;
    status?: 'active' | 'onLeave' | 'inactive';
    hireDate?: string;
    photo?: string;
    address?: string;
    contractType?: string;
}

interface RawLeaveRequest {
    localId?: string;
    id: string;
    employee?: string;
    type?: string;
    startDate?: string;
    endDate?: string;
    days?: number;
    status?: 'pending' | 'approved' | 'rejected';
    department?: string;
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
            const raw = await apiClient.get<RawHRMember[]>('/hr');
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
                address: t.address,
                contractType: t.contractType,
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

    public async getLeaveRequests(): Promise<LeaveRequest[]> {
        try {
            const raw = await apiClient.get<RawLeaveRequest[]>('/hr/leaves');
            return raw.map((r) => ({
                id: r.localId ?? r.id,
                employee: r.employee ?? '',
                type: r.type ?? '',
                startDate: r.startDate ?? '',
                endDate: r.endDate ?? '',
                days: r.days ?? 0,
                status: r.status ?? 'pending',
                department: r.department ?? '',
            }));
        } catch (err) {
            console.warn('[HRService] Failed to fetch leave requests:', err);
            return [];
        }
    }

    public async updateLeaveStatus(id: string, status: 'approved' | 'rejected'): Promise<void> {
        try {
            await apiClient.put(`/hr/leaves/${id}`, { status });
        } catch (err) {
            console.warn('[HRService] Failed to update leave status:', err);
        }
    }
}

export const hrService = HRService.getInstance();
