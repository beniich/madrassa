// Placeholder hook for offline data access (students, teachers, sync state)
// This provides mock data to unblock the build; implement with real data fetching later.

import { useState } from 'react';

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

const mockStudents: Student[] = [
  { id: '1', name: 'Ahmed Ben Ali', grade: '3A', status: 'active' },
  { id: '2', name: 'Fatima Zahra', grade: '2B', status: 'active' },
];

const mockTeachers: Teacher[] = [
  { id: '1', name: 'M. Dupont', subject: 'Mathématiques', status: 'active' },
  { id: '2', name: 'Mme Martin', subject: 'Français', status: 'active' },
];

export function useStudents() {
  const [students] = useState<Student[]>(mockStudents);
  return { students, loading: false, error: null };
}

export function useTeachers() {
  const [teachers] = useState<Teacher[]>(mockTeachers);
  return { teachers, loading: false, error: null };
}

export function usePendingSyncCount() {
  return { count: 0, isSyncing: false };
}

export default { useStudents, useTeachers, usePendingSyncCount };
