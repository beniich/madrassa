// Placeholder hook for offline data access
// Provides mock data; replace with real API/IndexedDB integration later.

import { useState } from 'react';

// ── Types ────────────────────────────────────────────────────────────────────

export interface Student {
  id: string;
  name: string;
  grade: string;
  status: 'active' | 'inactive';
}

export interface Teacher {
  id: string;
  name: string;
  subject: string;
  status: 'active' | 'inactive';
}

export interface SchoolProfile {
  id: string;
  name: string;
  logo?: string;
  address?: string;
  phone?: string;
  email?: string;
}

// ── Mock data ────────────────────────────────────────────────────────────────

const mockStudents: Student[] = [
  { id: '1', name: 'Ahmed Ben Ali', grade: '3A', status: 'active' },
  { id: '2', name: 'Fatima Zahra', grade: '2B', status: 'active' },
  { id: '3', name: 'Youssef Khalil', grade: '1C', status: 'active' },
];

const mockTeachers: Teacher[] = [
  { id: '1', name: 'M. Dupont', subject: 'Mathématiques', status: 'active' },
  { id: '2', name: 'Mme Martin', subject: 'Français', status: 'active' },
];

const mockSchoolProfile: SchoolProfile = {
  id: 'school-1',
  name: 'SchoolGenius',
  logo: undefined,
  address: '1 Rue de l\'École',
  phone: '+33 1 23 45 67 89',
  email: 'contact@schoolgenius.app',
};

// ── Hooks ────────────────────────────────────────────────────────────────────

export function useStudents() {
  const [students] = useState<Student[]>(mockStudents);
  return { students, loading: false, error: null };
}

export function useTeachers() {
  const [teachers] = useState<Teacher[]>(mockTeachers);
  return { teachers, loading: false, error: null };
}

export function useSchoolProfile(): SchoolProfile | null {
  return mockSchoolProfile;
}

export function usePendingSyncCount(): { count: number; isSyncing: boolean } {
  return { count: 0, isSyncing: false };
}

export function useStudentCount(): number {
  return mockStudents.length;
}

export function useAttendanceRate(): number {
  // Mock: 92% attendance
  return 92;
}

export function useAverageGrade(): number {
  // Mock: average grade out of 20
  return 13.4;
}

export function useUnhandledAlertCount(): number {
  // Mock: no unhandled alerts
  return 0;
}
