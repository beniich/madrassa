/**
 * Tasks Service - Real API Backend
 * Tasks are stored via the generic sync endpoint /api/tasks.
 * Falls back gracefully if endpoint is unavailable.
 */

import { apiClient } from '@/lib/apiClient';
import { generateLocalId } from '@/lib/db';

export type TaskStatus = 'todo' | 'in-progress' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface SchoolTask {
    id: string;
    title: string;
    assignedTo: string[];
    dueDate: string;
    status: TaskStatus;
    priority: TaskPriority;
    category: string;
    description?: string;
}

class TasksService {
    private static instance: TasksService;

    private constructor() {}

    public static getInstance(): TasksService {
        if (!TasksService.instance) {
            TasksService.instance = new TasksService();
        }
        return TasksService.instance;
    }

    public async getTasks(): Promise<SchoolTask[]> {
        try {
            const raw = await apiClient.get<any[]>('/tasks');
            return raw.map((t) => ({
                id: t.localId ?? t.id,
                title: t.title ?? 'Sans titre',
                assignedTo: t.assignedTo ?? [],
                dueDate: t.dueDate ?? '',
                status: (t.status as TaskStatus) ?? 'todo',
                priority: (t.priority as TaskPriority) ?? 'medium',
                category: t.category ?? 'Général',
                description: t.description,
            }));
        } catch (err) {
            console.warn('[TasksService] Backend unavailable, returning empty list:', err);
            return [];
        }
    }

    public async createTask(task: Omit<SchoolTask, 'id'>): Promise<SchoolTask> {
        const localId = generateLocalId();
        const payload = { localId, ...task };

        try {
            await apiClient.post('/tasks', payload);
        } catch (err) {
            console.warn('[TasksService] Failed to persist task:', err);
        }

        return { id: localId, ...task };
    }

    public async updateTask(id: string, updates: Partial<SchoolTask>): Promise<void> {
        try {
            await apiClient.put(`/tasks/${id}`, updates);
        } catch (err) {
            console.warn('[TasksService] Failed to update task:', err);
        }
    }

    public async deleteTask(id: string): Promise<void> {
        try {
            await apiClient.delete(`/tasks/${id}`);
        } catch (err) {
            console.warn('[TasksService] Failed to delete task:', err);
        }
    }
}

export const tasksService = TasksService.getInstance();
