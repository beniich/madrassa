import { create } from 'zustand';
import { mockPatients, mockDepartments, mockHospitalBeds } from '@/lib/mockData';
import { addHours, startOfDay } from 'date-fns';

// Types
export interface Patient {
    id: string;
    first_name: string;
    last_name: string;
    dob: string;
    gender: 'M' | 'F';
    status: 'admitted' | 'outpatient' | 'discharged';
    last_visit: string;
    diagnosis: string;
    // Risk Score for prioritization
    riskScore?: 'low' | 'medium' | 'high' | 'critical';
    workflowStepId?: string; // ID of the current workflow step
    // New Detailed Fields
    socialSecurityNumber?: string;
    phone?: string;
    email?: string;
    address?: string;
    admissionReason?: string;
    allergies?: string[];
    medicalHistory?: string[];
    insuranceProvider?: string;
    treatingDoctorId?: string;
}

export interface Staff {
    id: string;
    name: string;
    role: string;
    specialty?: string;
    status: 'on_duty' | 'off_duty' | 'on_call';
    email: string;
    phone: string;
    avatar: string;
    // HR Details
    address?: string;
    socialSecurityNumber?: string;
    dateOfBirth?: string;
    joinDate?: string;
    emergencyContact?: {
        name: string;
        relation: string;
        phone: string;
    };
    bankInfo?: {
        iban: string;
        bic: string;
    };
    contracts?: {
        id: string;
        type: 'CDI' | 'CDD' | 'Stage' | 'Vacation';
        startDate: string;
        endDate?: string;
        status: 'active' | 'terminated' | 'expired';
        salary: number;
    }[];
    documents?: {
        id: string;
        name: string;
        type: 'pdf' | 'img' | 'doc';
        uploadDate: string;
        size: string;
    }[];
    // Shift Management
    shiftStart?: string;
    shiftEnd?: string;
}

export interface Service {
    id: string;
    name: string;
    floor: string;
    color: string;
}

export interface Bed {
    id: string;
    deptId: string;
    number: string;
    status: 'available' | 'occupied' | 'cleaning' | 'maintenance';
    patient: {
        name: string;
        condition: string;
        admissionTime: string;
    } | null;
}

export interface Appointment {
    id: string | number;
    title: string;
    type: 'surgery' | 'consultation' | 'urgent' | 'meeting' | 'google' | 'exam' | 'followup';
    start: Date;
    duration: number; // in hours
    doctor: string; // name or id
    room: string;
    source?: 'Internal' | 'Google';
    // HIL - Intelligent Scheduling Fields
    patientId?: string;
    urgency?: 'low' | 'normal' | 'high' | 'critical';
    equipment?: string[]; // Required equipment for the appointment
    constraints?: string[]; // Special constraints (e.g., "needs wheelchair access")
    status?: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
}

export interface LeaveRequest {
    id: string;
    staffId: string;
    staffName: string;
    type: 'CP' | 'RTT' | 'Maladie' | 'Sans Solde' | 'Formation';
    startDate: string;
    endDate: string;
    days: number;
    status: 'pending' | 'approved' | 'rejected';
    reason?: string;
    managerComment?: string;
    createdAt: string;
}

export interface TimeEntry {
    id: string;
    staffId: string;
    staffName: string;
    date: string;
    checkIn: string;
    checkOut?: string;
    totalHours?: number;
    overtimeHours?: number;
    status: 'present' | 'absent' | 'late' | 'half-day';
    notes?: string;
}

export interface PayrollItem {
    id: string;
    staffId: string;
    staffName: string;
    month: string;
    baseSalary: number;
    bonuses: { type: string; amount: number; description: string; }[];
    deductions: { type: string; amount: number; description: string; }[];
    overtimePay: number;
    netSalary: number;
    status: 'draft' | 'validated' | 'paid';
    paymentDate?: string;
}

export interface Training {
    id: string;
    staffId: string;
    name: string;
    type: 'mandatory' | 'optional' | 'certification';
    startDate: string;
    endDate: string;
    status: 'planned' | 'in-progress' | 'completed' | 'expired';
    expiryDate?: string;
    provider?: string;
    cost?: number;
}

export interface Performance {
    id: string;
    staffId: string;
    date: string;
    type: 'annual' | 'mid-year' | 'probation';
    overallRating: number;
    strengths: string[];
    areasForImprovement: string[];
    goals: string[];
    managerComments: string;
    employeeComments?: string;
    status: 'scheduled' | 'completed';
}


interface HospitalState {
    patients: Patient[];
    staff: Staff[];
    services: Service[];
    beds: Bed[];
    appointments: Appointment[];
    leaveRequests: LeaveRequest[];
    timeEntries: TimeEntry[];
    payrollItems: PayrollItem[];
    trainings: Training[];
    performances: Performance[];

    // Actions
    addPatient: (patient: Omit<Patient, 'id'>) => void;
    updatePatient: (id: string, updates: Partial<Patient>) => void;

    addStaff: (staff: Omit<Staff, 'id'>) => void;
    updateStaff: (id: string, updates: Partial<Staff>) => void;
    removeStaff: (id: string) => void;
    updateStaffStatus: (id: string, status: Staff['status']) => void;

    addService: (service: Omit<Service, 'id'>) => void;
    addBed: (bed: Omit<Bed, 'id'>) => void;
    removeBed: (id: string) => void;
    updateBedStatus: (bedId: string, status: Bed['status'], patientInfo?: Bed['patient']) => void;

    addAppointment: (appointment: Appointment) => void;
    updateAppointment: (id: string | number, updates: Partial<Appointment>) => void;

    // Leave Management
    addLeaveRequest: (request: Omit<LeaveRequest, 'id' | 'createdAt'>) => void;
    updateLeaveRequest: (id: string, updates: Partial<LeaveRequest>) => void;
    approveLeaveRequest: (id: string, managerComment?: string) => void;
    rejectLeaveRequest: (id: string, managerComment?: string) => void;

    // Time Tracking
    addTimeEntry: (entry: Omit<TimeEntry, 'id'>) => void;
    updateTimeEntry: (id: string, updates: Partial<TimeEntry>) => void;
    checkOut: (id: string, checkOutTime: string) => void;

    // Payroll
    addPayrollItem: (item: Omit<PayrollItem, 'id'>) => void;
    updatePayrollItem: (id: string, updates: Partial<PayrollItem>) => void;
    validatePayroll: (id: string) => void;

    // Training & Performance
    addTraining: (training: Omit<Training, 'id'>) => void;
    updateTraining: (id: string, updates: Partial<Training>) => void;
    addPerformance: (performance: Omit<Performance, 'id'>) => void;
    updatePerformance: (id: string, updates: Partial<Performance>) => void;
}

// Initial Mock Data Loading
// We cast the mock data to our stricter types where necessary or ensure mockData.ts complies
const initialPatients: Patient[] = mockPatients.map(p => ({
    ...p,
    gender: p.gender as 'M' | 'F',
    status: p.status as 'admitted' | 'outpatient' | 'discharged',
    diagnosis: p.diagnosis || "Observation"
}));

const initialStaff: Staff[] = [
    {
        id: '1', name: 'Dr. Gregory House', role: 'Doctor', specialty: 'Diagnosticien', status: 'on_duty',
        email: 'g.house@cloud-hopital.fr', phone: '+33 6 12 34 56 78', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=House'
    },
    {
        id: '2', name: 'Dr. James Wilson', role: 'Doctor', specialty: 'Oncologie', status: 'on_call',
        email: 'j.wilson@cloud-hopital.fr', phone: '+33 6 98 76 54 32', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Wilson'
    },
    // ... we can add more from the StaffPage mock later or consolidate
];

// Combine mock beds with correct typing
const initialBeds: Bed[] = mockHospitalBeds.map(b => ({
    ...b,
    status: b.status as Bed['status']
}));

const initialAppointments: Appointment[] = [
    { id: 1, title: 'Chirurgie Cardiaque - M. Dupont', type: 'surgery', start: addHours(startOfDay(new Date()), 9), duration: 2, doctor: 'Dr. House', room: 'Bloc A' },
    { id: 2, title: 'Consultation Suivi - Mme. Petit', type: 'consultation', start: addHours(startOfDay(new Date()), 11), duration: 0.5, doctor: 'Dr. Wilson', room: 'Cab. 12' },
    { id: 3, title: 'Urgence - Arrivée SAMU', type: 'urgent', start: addHours(startOfDay(new Date()), 14), duration: 1.5, doctor: 'Dr. Cuddy', room: 'Urgences' },
    { id: 4, title: 'Staff Meeting', type: 'meeting', start: addHours(startOfDay(new Date()), 8), duration: 1, doctor: 'Tous', room: 'Salle Conf.' },
];

const initialLeaveRequests: LeaveRequest[] = [
    {
        id: 'leave-1',
        staffId: '1',
        staffName: 'Dr. Gregory House',
        type: 'CP',
        startDate: '2024-08-15',
        endDate: '2024-08-30',
        days: 15,
        status: 'approved',
        reason: 'Vacances été',
        createdAt: new Date().toISOString()
    }
];

const initialTimeEntries: TimeEntry[] = [
    {
        id: 'time-1',
        staffId: '1',
        staffName: 'Dr. Gregory House',
        date: new Date().toISOString().split('T')[0],
        checkIn: '08:00',
        checkOut: '17:30',
        totalHours: 9.5,
        overtimeHours: 1.5,
        status: 'present'
    }
];

const initialPayrollItems: PayrollItem[] = [
    {
        id: 'pay-1',
        staffId: '1',
        staffName: 'Dr. Gregory House',
        month: '2024-11',
        baseSalary: 4500,
        bonuses: [
            { type: 'Prime', amount: 500, description: 'Prime de performance' }
        ],
        deductions: [
            { type: 'Mutuelle', amount: 50, description: 'Cotisation mutuelle' }
        ],
        overtimePay: 250,
        netSalary: 5200,
        status: 'paid',
        paymentDate: '2024-11-30'
    }
];

const initialTrainings: Training[] = [
    {
        id: 'train-1',
        staffId: '1',
        name: 'Réanimation Avancée',
        type: 'mandatory',
        startDate: '2024-01-10',
        endDate: '2024-01-12',
        status: 'completed',
        expiryDate: '2025-01-10',
        provider: 'Cloud Hôpital Formation'
    }
];

const initialPerformances: Performance[] = [
    {
        id: 'perf-1',
        staffId: '1',
        date: '2024-06-15',
        type: 'annual',
        overallRating: 4.5,
        strengths: ['Diagnostic exceptionnel', 'Rigueur scientifique'],
        areasForImprovement: ['Communication avec les patients', 'Ponctualité aux réunions'],
        goals: ['Former 2 internes', 'Publier 1 article'],
        managerComments: 'Excellent élément malgré son caractère.',
        status: 'completed'
    }
];

export const useHospitalStore = create<HospitalState>((set) => ({
    patients: initialPatients,
    staff: initialStaff,
    services: mockDepartments,
    beds: initialBeds,
    appointments: initialAppointments,
    leaveRequests: initialLeaveRequests,
    timeEntries: initialTimeEntries,
    payrollItems: initialPayrollItems,
    trainings: initialTrainings,
    performances: initialPerformances,

    addPatient: (newPatient) => set((state) => ({
        patients: [...state.patients, { ...newPatient, id: `pat-${Date.now()}` }]
    })),

    updatePatient: (id, updates) => set((state) => ({
        patients: state.patients.map(p => p.id === id ? { ...p, ...updates } : p)
    })),

    addStaff: (newStaff) => set((state) => ({
        staff: [...state.staff, { ...newStaff, id: `staff-${Date.now()}` }]
    })),

    updateStaffStatus: (id, status) => set((state) => ({
        staff: state.staff.map(s => s.id === id ? { ...s, status } : s)
    })),

    updateStaff: (id, updates) => set((state) => ({
        staff: state.staff.map(s => s.id === id ? { ...s, ...updates } : s)
    })),

    removeStaff: (id) => set((state) => ({
        staff: state.staff.filter(s => s.id !== id)
    })),

    addService: (newService) => set((state) => ({
        services: [...state.services, { ...newService, id: `dept-${Date.now()}` }]
    })),

    addBed: (newBed) => set((state) => ({
        beds: [...state.beds, { ...newBed, id: `bed-${Date.now()}` }]
    })),

    removeBed: (id) => set((state) => ({
        beds: state.beds.filter(b => b.id !== id)
    })),

    updateBedStatus: (bedId, status, patientInfo) => set((state) => ({
        beds: state.beds.map(b => b.id === bedId ? {
            ...b,
            status,
            patient: patientInfo !== undefined ? patientInfo : b.patient
        } : b)
    })),

    // Appointment Actions
    addAppointment: (newAppointment) => set((state) => ({
        appointments: [...state.appointments, newAppointment]
    })),

    updateAppointment: (id, updates) => set((state) => ({
        appointments: state.appointments.map(a => a.id === id ? { ...a, ...updates } : a)
    })),

    // Leave Request Actions
    addLeaveRequest: (newRequest) => set((state) => ({
        leaveRequests: [...state.leaveRequests, {
            ...newRequest,
            id: `leave-${Date.now()}`,
            createdAt: new Date().toISOString(),
            status: 'pending'
        }]
    })),

    updateLeaveRequest: (id, updates) => set((state) => ({
        leaveRequests: state.leaveRequests.map(lr => lr.id === id ? { ...lr, ...updates } : lr)
    })),

    approveLeaveRequest: (id, managerComment) => set((state) => ({
        leaveRequests: state.leaveRequests.map(lr =>
            lr.id === id ? { ...lr, status: 'approved', managerComment } : lr
        )
    })),

    rejectLeaveRequest: (id, managerComment) => set((state) => ({
        leaveRequests: state.leaveRequests.map(lr =>
            lr.id === id ? { ...lr, status: 'rejected', managerComment } : lr
        )
    })),

    // Time Tracking Actions
    addTimeEntry: (newEntry) => set((state) => ({
        timeEntries: [...state.timeEntries, { ...newEntry, id: `time-${Date.now()}` }]
    })),

    updateTimeEntry: (id, updates) => set((state) => ({
        timeEntries: state.timeEntries.map(te => te.id === id ? { ...te, ...updates } : te)
    })),

    checkOut: (id, checkOutTime) => set((state) => ({
        timeEntries: state.timeEntries.map(te => {
            if (te.id === id) {
                const checkIn = new Date(`${te.date}T${te.checkIn}`);
                const checkOut = new Date(`${te.date}T${checkOutTime}`);
                const totalHours = (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60);
                const overtimeHours = Math.max(0, totalHours - 8);
                return { ...te, checkOut: checkOutTime, totalHours, overtimeHours };
            }
            return te;
        })
    })),

    // Payroll Actions
    addPayrollItem: (newItem) => set((state) => ({
        payrollItems: [...state.payrollItems, { ...newItem, id: `pay-${Date.now()}` }]
    })),

    updatePayrollItem: (id, updates) => set((state) => ({
        payrollItems: state.payrollItems.map(pi => pi.id === id ? { ...pi, ...updates } : pi)
    })),

    validatePayroll: (id) => set((state) => ({
        payrollItems: state.payrollItems.map(pi =>
            pi.id === id ? { ...pi, status: 'validated' } : pi
        )
    })),

    // Training Actions
    addTraining: (newTraining) => set((state) => ({
        trainings: [...state.trainings, { ...newTraining, id: `train-${Date.now()}` }]
    })),

    updateTraining: (id, updates) => set((state) => ({
        trainings: state.trainings.map(t => t.id === id ? { ...t, ...updates } : t)
    })),

    // Performance Actions
    addPerformance: (newPerformance) => set((state) => ({
        performances: [...state.performances, { ...newPerformance, id: `perf-${Date.now()}` }]
    })),

    updatePerformance: (id, updates) => set((state) => ({
        performances: state.performances.map(p => p.id === id ? { ...p, ...updates } : p)
    })),
}));
