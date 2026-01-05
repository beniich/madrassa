/**
 * SchoolGenius - Hooks pour les données offline avec Multi-Tenancy
 * Utilisation avec React et Dexie
 */

import { useLiveQuery } from 'dexie-react-hooks';
import { useAuth } from '../contexts/AuthContext';
import {
    db,
    Student,
    Teacher,
    SchoolClass,
    Attendance,
    Grade,
    AIAlert,
    Timetable,
    Message,
    Exam,
    Document,
    Invoice,
    SchoolProfile,
    generateLocalId,
    getCurrentTimestamp
} from '../lib/db';
import { syncEngine } from '../lib/syncEngine';

// ============================================
// STUDENTS HOOKS
// ============================================

export function useStudents(classId?: string) {
    const { user } = useAuth();
    const schoolId = user?.schoolId || '';

    return useLiveQuery(
        () => {
            if (!schoolId) return [];
            const query = db.students.where('schoolId').equals(schoolId);
            if (classId) {
                return query.filter(s => s.classId === classId).toArray();
            }
            return query.toArray();
        },
        [schoolId, classId]
    );
}

export function useStudent(localId: string) {
    return useLiveQuery(
        () => db.students.where('localId').equals(localId).first(),
        [localId]
    );
}

export function useStudentCount() {
    const { user } = useAuth();
    const schoolId = user?.schoolId || '';

    return useLiveQuery(() => {
        if (!schoolId) return 0;
        return db.students.where('schoolId').equals(schoolId).and(s => s.status === 'active').count();
    }, [schoolId]);
}

export async function addStudent(data: Omit<Student, 'id' | 'localId' | 'syncStatus' | 'createdAt' | 'updatedAt'>) {
    const student: Student = {
        ...data,
        schoolId: data.schoolId || 'demo_school',
        localId: generateLocalId(),
        syncStatus: 'pending',
        createdAt: getCurrentTimestamp(),
        updatedAt: getCurrentTimestamp(),
    };

    const id = await db.students.add(student);
    await syncEngine.queueAction('CREATE', 'student', student.localId, student, student.schoolId);
    return { ...student, id };
}

export async function deleteStudent(localId: string) {
    const student = await db.students.where('localId').equals(localId).first();
    if (student) {
        await db.students.delete(student.id!);
        await syncEngine.queueAction('DELETE', 'student', localId, null, student.schoolId);
    }
}

// ============================================
// TEACHERS HOOKS
// ============================================

export function useTeachers() {
    const { user } = useAuth();
    const schoolId = user?.schoolId || '';

    return useLiveQuery(() => {
        if (!schoolId) return [];
        return db.teachers.where('schoolId').equals(schoolId).toArray();
    }, [schoolId]);
}

export async function addTeacher(data: Omit<Teacher, 'id' | 'localId' | 'syncStatus' | 'createdAt' | 'updatedAt'>) {
    const teacher: Teacher = {
        ...data,
        schoolId: data.schoolId || 'demo_school',
        localId: generateLocalId(),
        syncStatus: 'pending',
        createdAt: getCurrentTimestamp(),
        updatedAt: getCurrentTimestamp(),
    };

    const id = await db.teachers.add(teacher);
    await syncEngine.queueAction('CREATE', 'teacher', teacher.localId, teacher, teacher.schoolId);
    return { ...teacher, id };
}

// ============================================
// CLASSES HOOKS
// ============================================

export function useClasses() {
    const { user } = useAuth();
    const schoolId = user?.schoolId || '';

    return useLiveQuery(() => {
        if (!schoolId) return [];
        return db.classes.where('schoolId').equals(schoolId).toArray();
    }, [schoolId]);
}

export function useClassCount() {
    const { user } = useAuth();
    const schoolId = user?.schoolId || '';

    return useLiveQuery(() => {
        if (!schoolId) return 0;
        return db.classes.where('schoolId').equals(schoolId).count();
    }, [schoolId]);
}

export async function addClass(data: Omit<SchoolClass, 'id' | 'localId' | 'syncStatus' | 'createdAt' | 'updatedAt'>) {
    const schoolClass: SchoolClass = {
        ...data,
        schoolId: data.schoolId || 'demo_school',
        localId: generateLocalId(),
        syncStatus: 'pending',
        createdAt: getCurrentTimestamp(),
        updatedAt: getCurrentTimestamp(),
    };

    const id = await db.classes.add(schoolClass);
    await syncEngine.queueAction('CREATE', 'class', schoolClass.localId, schoolClass, schoolClass.schoolId);
    return { ...schoolClass, id };
}

// ============================================
// ATTENDANCE HOOKS
// ============================================

export function useAttendanceToday(classId?: string) {
    const { user } = useAuth();
    const schoolId = user?.schoolId || '';
    const today = new Date().toISOString().split('T')[0];

    return useLiveQuery(
        () => {
            if (!schoolId) return [];
            const query = db.attendance.where('schoolId').equals(schoolId).and(a => a.date === today);
            if (classId) {
                return query.and(a => a.classId === classId).toArray();
            }
            return query.toArray();
        },
        [schoolId, classId, today]
    );
}

export async function markAttendance(
    schoolId: string,
    studentId: string,
    classId: string,
    status: 'present' | 'absent' | 'late' | 'excused',
    markedBy: string,
    reason?: string
) {
    const today = new Date().toISOString().split('T')[0];
    const existing = await db.attendance
        .where('studentId').equals(studentId)
        .and(a => a.date === today && a.schoolId === schoolId)
        .first();

    const attendance: Attendance = {
        localId: existing?.localId || generateLocalId(),
        schoolId,
        studentId,
        classId,
        date: today,
        status,
        reason,
        markedBy,
        markedAt: getCurrentTimestamp(),
        syncStatus: 'pending',
    };

    if (existing) {
        await db.attendance.update(existing.id!, attendance);
        await syncEngine.queueAction('UPDATE', 'attendance', attendance.localId, attendance, schoolId);
    } else {
        await db.attendance.add(attendance);
        await syncEngine.queueAction('CREATE', 'attendance', attendance.localId, attendance, schoolId);
    }
}

// ============================================
// GRADES HOOKS
// ============================================

export function useGrades(classId?: string) {
    const { user } = useAuth();
    const schoolId = user?.schoolId || '';

    return useLiveQuery(() => {
        if (!schoolId) return [];
        const query = db.grades.where('schoolId').equals(schoolId);
        if (classId) return query.filter(g => g.classId === classId).toArray();
        return query.toArray();
    }, [schoolId, classId]);
}

export function useAverageGrade() {
    const { user } = useAuth();
    const schoolId = user?.schoolId || '';

    return useLiveQuery(async () => {
        if (!schoolId) return 0;
        const grades = await db.grades.where('schoolId').equals(schoolId).toArray();
        if (grades.length === 0) return 0;
        const total = grades.reduce((sum, g) => sum + (g.value / g.maxValue) * 20, 0);
        return Math.round((total / grades.length) * 10) / 10;
    }, [schoolId]);
}

export function useAttendanceRate() {
    const { user } = useAuth();
    const schoolId = user?.schoolId || '';
    const today = new Date().toISOString().split('T')[0];

    return useLiveQuery(async () => {
        if (!schoolId) return 0;
        const attendance = await db.attendance.where('schoolId').equals(schoolId).and(a => a.date === today).toArray();
        if (attendance.length === 0) return 0;
        const present = attendance.filter(a => a.status === 'present' || a.status === 'late').length;
        return Math.round((present / attendance.length) * 100);
    }, [schoolId, today]);
}

// ============================================
// TIMETABLE & OTHER HOOKS
// ============================================

export function useTimetable(classId?: string) {
    const { user } = useAuth();
    const schoolId = user?.schoolId || '';

    return useLiveQuery(() => {
        if (!schoolId) return [];
        const query = db.timetable.where('schoolId').equals(schoolId);
        if (classId) return query.filter(t => t.classId === classId).toArray();
        return query.toArray();
    }, [schoolId, classId]);
}

export function useExams(classId?: string) {
    const { user } = useAuth();
    const schoolId = user?.schoolId || '';

    return useLiveQuery(() => {
        if (!schoolId) return [];
        const query = db.exams.where('schoolId').equals(schoolId);
        if (classId) return query.filter(e => e.classId === classId).toArray();
        return query.toArray();
    }, [schoolId, classId]);
}

export function useInvoices() {
    const { user } = useAuth();
    const schoolId = user?.schoolId || '';

    return useLiveQuery(() => {
        if (!schoolId) return [];
        return db.invoices.where('schoolId').equals(schoolId).toArray();
    }, [schoolId]);
}

export function useDocuments() {
    const { user } = useAuth();
    const schoolId = user?.schoolId || '';

    return useLiveQuery(() => {
        if (!schoolId) return [];
        return db.documents.where('schoolId').equals(schoolId).toArray();
    }, [schoolId]);
}

export function useMessages() {
    const { user } = useAuth();
    const schoolId = user?.schoolId || '';

    return useLiveQuery(async () => {
        if (!schoolId) return [];
        const msgs = await db.messages.where('schoolId').equals(schoolId).toArray();
        return msgs.sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());
    }, [schoolId]);
}

export async function sendMessage(data: Omit<Message, 'id' | 'localId' | 'syncStatus' | 'sentAt'>) {
    const message: Message = {
        ...data,
        schoolId: data.schoolId || 'demo_school',
        localId: generateLocalId(),
        sentAt: getCurrentTimestamp(),
        syncStatus: 'pending',
    };

    await db.messages.add(message);
    await syncEngine.queueAction('CREATE', 'message', message.localId, message, message.schoolId);
}

// ============================================
// OFFLINE AI ALERTS GENERATION
// ============================================

export async function generateOfflineAlerts(): Promise<AIAlert[]> {
    const students = await db.students.toArray();
    const attendance = await db.attendance.toArray();
    const grades = await db.grades.toArray();
    
    const alerts: AIAlert[] = [];
    const schoolId = students[0]?.schoolId || 'demo_school';
    
    // Check for students with repeated absences
    const studentAbsences: Record<string, number> = {};
    attendance.forEach(a => {
        if (a.status === 'absent') {
            studentAbsences[a.studentId] = (studentAbsences[a.studentId] || 0) + 1;
        }
    });
    
    for (const [studentId, count] of Object.entries(studentAbsences)) {
        if (count >= 3) {
            const student = students.find(s => s.localId === studentId);
            if (student) {
                alerts.push({
                    localId: generateLocalId(),
                    schoolId,
                    type: 'absence',
                    severity: 'warning',
                    title: 'Absences répétées détectées',
                    description: `${student.firstName} ${student.lastName} a ${count} absences ce mois.`,
                    studentId,
                    isRead: false,
                    isHandled: false,
                    generatedAt: getCurrentTimestamp(),
                    generatedOffline: true,
                    syncStatus: 'pending',
                });
            }
        }
    }
    
    // Check for declining grades
    const studentGrades: Record<string, number[]> = {};
    grades.forEach(g => {
        if (!studentGrades[g.studentId]) studentGrades[g.studentId] = [];
        studentGrades[g.studentId].push((g.value / g.maxValue) * 20);
    });
    
    for (const [studentId, gradeList] of Object.entries(studentGrades)) {
        if (gradeList.length >= 2) {
            const recent = gradeList.slice(-2);
            if (recent[1] < recent[0] - 3) {
                const student = students.find(s => s.localId === studentId);
                if (student) {
                    alerts.push({
                        localId: generateLocalId(),
                        schoolId,
                        type: 'grade_drop',
                        severity: 'warning',
                        title: 'Baisse de notes significative',
                        description: `${student.firstName} ${student.lastName} montre une baisse de performance.`,
                        studentId,
                        isRead: false,
                        isHandled: false,
                        generatedAt: getCurrentTimestamp(),
                        generatedOffline: true,
                        syncStatus: 'pending',
                    });
                }
            }
        }
    }
    
    // Save alerts to database
    for (const alert of alerts) {
        await db.aiAlerts.add(alert);
    }
    
    return alerts;
}

// ============================================
// AI ALERTS HOOKS
// ============================================

export function useAIAlerts() {
    const { user } = useAuth();
    const schoolId = user?.schoolId || '';

    return useLiveQuery(() => {
        if (!schoolId) return [];
        return db.aiAlerts.where('schoolId').equals(schoolId).toArray();
    }, [schoolId]);
}

export function useUnhandledAlertCount() {
    const { user } = useAuth();
    const schoolId = user?.schoolId || '';

    return useLiveQuery(() => {
        if (!schoolId) return 0;
        return db.aiAlerts.where('schoolId').equals(schoolId).and(a => !a.isHandled).count();
    }, [schoolId]);
}

// ============================================
// SYNC STATUS HOOKS
// ============================================

export function usePendingSyncCount() {
    const { user } = useAuth();
    const schoolId = user?.schoolId || '';

    return useLiveQuery(() => {
        if (!schoolId) return 0;
        return db.syncActions.where('schoolId').equals(schoolId).and(a => a.status === 'pending').count();
    }, [schoolId]);
}

export function useIsOnline() {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
}

// ============================================
// SCHOOL PROFILE HOOKS
// ============================================

export function useSchoolProfile() {
    const { user } = useAuth();
    const schoolId = user?.schoolId || '';

    return useLiveQuery(
        () => {
            if (!schoolId) return null;
            return db.schoolProfile.where('localId').equals(schoolId).first();
        },
        [schoolId]
    );
}

export async function updateSchoolProfile(schoolId: string, data: Partial<SchoolProfile>) {
    const existing = await db.schoolProfile.where('localId').equals(schoolId).first();

    const profile: SchoolProfile = {
        localId: schoolId,
        name: data.name || '',
        address: data.address || '',
        phone: data.phone || '',
        email: data.email || '',
        logo: data.logo || '',
        updatedAt: getCurrentTimestamp(),
    };

    if (existing) {
        await db.schoolProfile.update(existing.id!, profile);
    } else {
        await db.schoolProfile.add(profile);
    }

    // Sync via dedicated school profile endpoint
    await syncEngine.queueAction('UPDATE', 'school_profile' as any, schoolId, profile, schoolId);
}
