import { Appointment, Staff, Bed } from '@/stores/useHospitalStore';
import { addHours, areIntervalsOverlapping, startOfDay, setHours, setMinutes } from 'date-fns';

// Types for scheduling
export interface SchedulingConstraints {
    patientId?: string;
    doctorId?: string;
    preferredDate?: Date;
    duration: number; // in hours
    type: Appointment['type'];
    urgency?: Appointment['urgency'];
    requiredEquipment?: string[];
    constraints?: string[];
}

export interface TimeSlot {
    start: Date;
    end: Date;
    room: string;
    doctor: string;
    score: number; // Higher is better
}

export interface SchedulingConflict {
    type: 'room' | 'doctor' | 'equipment' | 'patient';
    conflictingAppointment: Appointment;
    message: string;
}

// Check for conflicts with existing appointments
export function checkConflicts(
    newAppointment: Partial<Appointment>,
    existingAppointments: Appointment[]
): SchedulingConflict[] {
    const conflicts: SchedulingConflict[] = [];

    if (!newAppointment.start || !newAppointment.duration) {
        return conflicts;
    }

    const newStart = new Date(newAppointment.start);
    const newEnd = addHours(newStart, newAppointment.duration);

    for (const existing of existingAppointments) {
        if (existing.id === newAppointment.id) continue;

        const existingStart = new Date(existing.start);
        const existingEnd = addHours(existingStart, existing.duration);

        const overlaps = areIntervalsOverlapping(
            { start: newStart, end: newEnd },
            { start: existingStart, end: existingEnd }
        );

        if (!overlaps) continue;

        // Check room conflict
        if (newAppointment.room === existing.room) {
            conflicts.push({
                type: 'room',
                conflictingAppointment: existing,
                message: `La salle "${existing.room}" est déjà réservée.`
            });
        }

        // Check doctor conflict
        if (newAppointment.doctor === existing.doctor) {
            conflicts.push({
                type: 'doctor',
                conflictingAppointment: existing,
                message: `${existing.doctor} a déjà un RDV à cette heure.`
            });
        }

        // Check patient conflict
        if (newAppointment.patientId && newAppointment.patientId === existing.patientId) {
            conflicts.push({
                type: 'patient',
                conflictingAppointment: existing,
                message: `Ce patient a déjà un RDV programmé à cette heure.`
            });
        }
    }

    return conflicts;
}

// Find best available time slots based on constraints
export function findBestSlots(
    constraints: SchedulingConstraints,
    existingAppointments: Appointment[],
    staff: Staff[],
    rooms: string[] = ['Bloc A', 'Bloc B', 'Cab. 1', 'Cab. 2', 'Cab. 3', 'Urgences']
): TimeSlot[] {
    const slots: TimeSlot[] = [];
    const baseDate = constraints.preferredDate || new Date();
    const workDayStart = 8; // 8 AM
    const workDayEnd = 18; // 6 PM

    // Get available doctors based on urgency/type
    const availableDoctors = staff.filter(s =>
        s.role === 'Doctor' && (s.status === 'on_duty' || s.status === 'on_call')
    );

    if (availableDoctors.length === 0) {
        return slots;
    }

    // Generate potential slots for the next 3 days
    for (let dayOffset = 0; dayOffset < 3; dayOffset++) {
        const day = new Date(baseDate);
        day.setDate(day.getDate() + dayOffset);

        for (let hour = workDayStart; hour < workDayEnd; hour++) {
            // Skip if not enough time left in day
            if (hour + constraints.duration > workDayEnd) continue;

            for (const doctor of availableDoctors) {
                for (const room of rooms) {
                    const slotStart = setMinutes(setHours(startOfDay(day), hour), 0);

                    const testAppointment: Partial<Appointment> = {
                        start: slotStart,
                        duration: constraints.duration,
                        doctor: doctor.name,
                        room: room,
                        patientId: constraints.patientId
                    };

                    const conflicts = checkConflicts(testAppointment, existingAppointments);

                    if (conflicts.length === 0) {
                        // Calculate score based on various factors
                        let score = 100;

                        // Prefer earlier times
                        score -= dayOffset * 10;

                        // Prefer morning appointments for surgeries
                        if (constraints.type === 'surgery' && hour < 12) {
                            score += 20;
                        }

                        // Boost score for urgent appointments on same day
                        if (constraints.urgency === 'critical' && dayOffset === 0) {
                            score += 50;
                        } else if (constraints.urgency === 'high' && dayOffset <= 1) {
                            score += 30;
                        }

                        // Prefer specialty matching (simplified)
                        if (doctor.specialty?.toLowerCase().includes(constraints.type)) {
                            score += 15;
                        }

                        slots.push({
                            start: slotStart,
                            end: addHours(slotStart, constraints.duration),
                            room,
                            doctor: doctor.name,
                            score
                        });
                    }
                }
            }
        }
    }

    // Sort by score (descending) and return top 5
    return slots.sort((a, b) => b.score - a.score).slice(0, 5);
}

// Prioritize urgent appointments
export function prioritizeUrgent(appointments: Appointment[]): Appointment[] {
    const urgencyOrder: Record<string, number> = {
        'critical': 0,
        'high': 1,
        'normal': 2,
        'low': 3
    };

    return [...appointments].sort((a, b) => {
        const urgencyA = urgencyOrder[a.urgency || 'normal'];
        const urgencyB = urgencyOrder[b.urgency || 'normal'];

        if (urgencyA !== urgencyB) {
            return urgencyA - urgencyB;
        }

        // Then sort by start time
        return new Date(a.start).getTime() - new Date(b.start).getTime();
    });
}

// Get urgency badge color
export function getUrgencyColor(urgency?: Appointment['urgency']): string {
    switch (urgency) {
        case 'critical': return 'bg-red-500 text-white';
        case 'high': return 'bg-orange-500 text-white';
        case 'normal': return 'bg-blue-500 text-white';
        case 'low': return 'bg-gray-400 text-white';
        default: return 'bg-gray-400 text-white';
    }
}

// Get urgency label
export function getUrgencyLabel(urgency?: Appointment['urgency']): string {
    switch (urgency) {
        case 'critical': return 'Critique';
        case 'high': return 'Haute';
        case 'normal': return 'Normale';
        case 'low': return 'Basse';
        default: return 'Normale';
    }
}
