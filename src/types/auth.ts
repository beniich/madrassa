export type UserRole = 'direction' | 'admin' | 'teacher' | 'parent' | 'student';

export type Permission =
    | 'view_all_students' | 'edit_students'
    | 'view_all_teachers' | 'edit_teachers'
    | 'view_all_classes' | 'edit_classes'
    | 'mark_attendance' | 'view_attendance'
    | 'add_grades' | 'view_all_grades'
    | 'send_messages' | 'view_ai_alerts'
    | 'access_admin'
    | 'view_own_students' | 'view_own_classes' | 'view_own_children' | 'view_own_grades';

export interface User {
    id: string;
    email: string;
    token: string;
    schoolId: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    avatar?: string;
    permissions: Permission[];
}

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
    direction: [
        'view_all_students', 'edit_students',
        'view_all_teachers', 'edit_teachers',
        'view_all_classes', 'edit_classes',
        'mark_attendance', 'view_attendance',
        'add_grades', 'view_all_grades',
        'send_messages', 'view_ai_alerts', 'access_admin',
    ],
    admin: [
        'view_all_students', 'edit_students',
        'view_all_teachers',
        'view_all_classes', 'edit_classes',
        'view_attendance', 'view_all_grades',
        'send_messages', 'access_admin',
    ],
    teacher: [
        'view_own_students', 'view_all_teachers', 'view_own_classes',
        'mark_attendance', 'view_attendance',
        'add_grades', 'view_all_grades',
        'send_messages', 'view_ai_alerts',
    ],
    parent: [
        'view_own_children', 'view_own_grades', 'view_attendance',
    ],
    student: [
        'view_own_grades', 'view_attendance',
    ],
};

export const STORAGE_KEY = 'sg_user';
