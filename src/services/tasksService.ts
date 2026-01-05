
import { SchoolTask } from '../types/school-365';

class TasksService {
    private static instance: TasksService;

    private constructor() { }

    public static getInstance(): TasksService {
        if (!TasksService.instance) {
            TasksService.instance = new TasksService();
        }
        return TasksService.instance;
    }

    public async getTasks(): Promise<SchoolTask[]> {
        return [
            { id: 't-1', title: 'Préparer réunion parents 4B', assignedTo: ['user-1'], dueDate: '2024-12-22', status: 'todo', priority: 'high', category: 'Administratif' },
            { id: 't-2', title: 'Corriger copies Mathématiques', assignedTo: ['user-1'], dueDate: '2024-12-24', status: 'in-progress', priority: 'medium', category: 'Pédagogique' },
            { id: 't-3', title: 'Saisir notes trimestre 1', assignedTo: ['user-1'], dueDate: '2024-12-20', status: 'completed', priority: 'high', category: 'Notation' },
        ];
    }
}

export const tasksService = TasksService.getInstance();
