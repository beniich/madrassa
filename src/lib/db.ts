/**
 * SchoolGenius - Base de données IndexedDB avec Dexie
 * Architecture Offline-First pour écoles rurales
 */

import Dexie, { type Table } from 'dexie';

// ============================================
// TYPES - Modèles de données
// ============================================

export interface Student {
    id?: number;
    localId: string; // UUID local pour sync
    schoolId: string; // Separation des données par établissement
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    classId: string;
    parentPhone?: string;
    parentEmail?: string;
    address?: string;
    photo?: string;
    enrollmentDate: string;
    status: 'active' | 'inactive' | 'transferred';
    syncStatus: 'pending' | 'synced' | 'error';
    createdAt: string;
    updatedAt: string;
}

export interface Teacher {
    id?: number;
    localId: string;
    schoolId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    subjects: string[];
    classIds: string[];
    hireDate: string;
    status: 'active' | 'inactive';
    syncStatus: 'pending' | 'synced' | 'error';
    createdAt: string;
    updatedAt: string;
}

export interface SchoolClass {
    id?: number;
    localId: string;
    schoolId: string;
    name: string; // Ex: "4B", "6A"
    level: string; // Ex: "4ème", "6ème"
    academicYear: string;
    mainTeacherId?: string;
    capacity: number;
    syncStatus: 'pending' | 'synced' | 'error';
    createdAt: string;
    updatedAt: string;
}

export interface Subject {
    id?: number;
    localId: string;
    schoolId: string;
    name: string;
    code: string;
    coefficient: number;
    syncStatus: 'pending' | 'synced' | 'error';
}

export interface Attendance {
    id?: number;
    localId: string;
    schoolId: string;
    studentId: string;
    classId: string;
    date: string;
    status: 'present' | 'absent' | 'late' | 'excused';
    reason?: string;
    markedBy: string; // teacherId
    markedAt: string;
    syncStatus: 'pending' | 'synced' | 'error';
}

export interface Grade {
    id?: number;
    localId: string;
    schoolId: string;
    studentId: string;
    subjectId: string;
    classId: string;
    value: number; // Sur 20
    maxValue: number;
    type: 'exam' | 'quiz' | 'homework' | 'project';
    name: string; // Ex: "Devoir 1", "Examen Trimestriel"
    term: 'T1' | 'T2' | 'T3';
    date: string;
    teacherId: string;
    comments?: string;
    syncStatus: 'pending' | 'synced' | 'error';
    createdAt: string;
}

export interface Timetable {
    id?: number;
    localId: string;
    schoolId: string;
    classId: string;
    dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6;
    startTime: string; // "08:00"
    endTime: string; // "09:00"
    subjectId: string;
    teacherId: string;
    room?: string;
    syncStatus: 'pending' | 'synced' | 'error';
}

export interface Message {
    id?: number;
    localId: string;
    schoolId: string;
    senderId: string;
    senderRole: 'direction' | 'teacher' | 'parent';
    recipientType: 'all' | 'class' | 'individual';
    recipientId?: string;
    subject: string;
    content: string;
    priority: 'low' | 'normal' | 'high' | 'urgent';
    readBy: string[];
    sentAt: string;
    syncStatus: 'pending' | 'synced' | 'error';
}

export interface Exam {
    id?: number;
    localId: string;
    schoolId: string;
    name: string;
    classId: string;
    subjectId: string;
    date: string;
    maxScore: number;
    weight: number;
    term: 'T1' | 'T2' | 'T3';
    syncStatus: 'pending' | 'synced' | 'error';
    createdAt: string;
}

export interface Document {
    id?: number;
    localId: string;
    schoolId: string;
    name: string;
    type: 'curriculum' | 'report' | 'official' | 'other';
    fileUrl: string; // Base64 for offline
    category: string;
    classId?: string;
    uploadedBy: string;
    uploadedAt: string;
    syncStatus: 'pending' | 'synced' | 'error';
}

export interface Invoice {
    id?: number;
    localId: string;
    schoolId: string;
    studentId: string;
    amount: number;
    status: 'paid' | 'unpaid' | 'overdue';
    dueDate: string;
    paidDate?: string;
    items: { description: string, amount: number }[];
    syncStatus: 'pending' | 'synced' | 'error';
    createdAt: string;
}

export interface AIAlert {
    id?: number;
    localId: string;
    schoolId: string;
    type: 'absence' | 'grade_drop' | 'risk' | 'recommendation';
    severity: 'info' | 'warning' | 'danger';
    studentId?: string;
    classId?: string;
    title: string;
    description: string;
    suggestedAction?: string;
    isRead: boolean;
    isHandled: boolean;
    generatedAt: string;
    generatedOffline: boolean;
    syncStatus: 'pending' | 'synced' | 'error';
}

// File de synchronisation
export interface SyncAction {
    id?: number;
    actionId: string;
    schoolId: string; // Pour synchroniser avec le bon établissement
    type: 'CREATE' | 'UPDATE' | 'DELETE';
    entity: 'student' | 'teacher' | 'class' | 'attendance' | 'grade' | 'message' | 'exam' | 'invoice' | 'document';
    entityId: string;
    payload: string; // JSON stringified
    status: 'pending' | 'syncing' | 'synced' | 'error';
    retryCount: number;
    errorMessage?: string;
    createdAt: string;
    syncedAt?: string;
}

export interface AppConfig {
    id?: number;
    key: string;
    value: string;
    updatedAt: string;
}

// Profil de l'établissement local
export interface SchoolProfile {
    id?: number;
    localId: string;
    name: string;
    address?: string;
    phone?: string;
    email?: string;
    logo?: string;
    updatedAt: string;
}

// ============================================
// DATABASE CLASS
// ============================================

export class SchoolDatabase extends Dexie {
    students!: Table<Student>;
    teachers!: Table<Teacher>;
    classes!: Table<SchoolClass>;
    subjects!: Table<Subject>;
    attendance!: Table<Attendance>;
    grades!: Table<Grade>;
    exams!: Table<Exam>;
    invoices!: Table<Invoice>;
    documents!: Table<Document>;
    timetable!: Table<Timetable>;
    messages!: Table<Message>;
    aiAlerts!: Table<AIAlert>;
    syncActions!: Table<SyncAction>;
    appConfig!: Table<AppConfig>;
    schoolProfile!: Table<SchoolProfile>;

    constructor() {
        super('SchoolGeniusDB');

        // Version 2 avec schoolId pour le multi-tenancy
        this.version(2).stores({
            students: '++id, localId, schoolId, classId, lastName, status, syncStatus',
            teachers: '++id, localId, schoolId, email, status, syncStatus',
            classes: '++id, localId, schoolId, name, academicYear, syncStatus',
            subjects: '++id, localId, schoolId, code, syncStatus',
            attendance: '++id, localId, schoolId, studentId, classId, date, status, syncStatus',
            grades: '++id, localId, schoolId, studentId, subjectId, classId, date, term, syncStatus',
            exams: '++id, localId, schoolId, classId, subjectId, date, term, syncStatus',
            invoices: '++id, localId, schoolId, studentId, status, dueDate, syncStatus',
            documents: '++id, localId, schoolId, type, category, classId, syncStatus',
            timetable: '++id, localId, schoolId, classId, dayOfWeek, syncStatus',
            messages: '++id, localId, schoolId, senderId, sentAt, syncStatus',
            aiAlerts: '++id, localId, schoolId, type, severity, studentId, isHandled, syncStatus',
            syncActions: '++id, actionId, schoolId, type, entity, status, createdAt',
            appConfig: '++id, key',
            schoolProfile: '++id, localId',
        });
    }
}

// Instance singleton
export const db = new SchoolDatabase();

// ============================================
// HELPERS - Générateurs d'ID local
// ============================================

export const generateLocalId = (): string => {
    return `local_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
};

export const getCurrentTimestamp = (): string => {
    return new Date().toISOString();
};
