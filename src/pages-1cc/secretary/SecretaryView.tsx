import React, { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui-1cc/card';
import { Button } from '@/components/ui-1cc/button';
import { Input } from '@/components/ui-1cc/input';
import { Label } from '@/components/ui-1cc/label';
import { Badge } from '@/components/ui-1cc/badge';
import { Calendar } from '@/components/ui-1cc/calendar';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui-1cc/select';
import {
    CalendarPlus,
    Search,
    Clock,
    User,
    Phone,
    CheckCircle,
    XCircle,
    AlertTriangle,
    MessageSquare
} from 'lucide-react';
import { useHospitalStore } from '@/stores/useHospitalStore';
import { PatientRiskBadge, calculateRiskScore } from '@/components/patients/PatientRiskBadge';
import { toast } from 'sonner';
import { format, addDays, setHours, setMinutes } from 'date-fns';
import { fr } from 'date-fns/locale';

// Mock available slots
const AVAILABLE_SLOTS = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'];

const SecretaryView: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [selectedSlot, setSelectedSlot] = useState<string>('');
    const [selectedDoctor, setSelectedDoctor] = useState<string>('');
    const [searchPatient, setSearchPatient] = useState('');
    const [selectedPatient, setSelectedPatient] = useState<any>(null);
    const [reason, setReason] = useState('');

    const patients = useHospitalStore((state) => state.patients);
    const staff = useHospitalStore((state) => state.staff);
    const doctors = staff.filter(s => s.role === 'Médecin');

    const filteredPatients = patients.filter(p =>
        p.first_name.toLowerCase().includes(searchPatient.toLowerCase()) ||
        p.last_name.toLowerCase().includes(searchPatient.toLowerCase()) ||
        p.phone?.includes(searchPatient)
    );

    const handleBookAppointment = () => {
        if (!selectedPatient || !selectedSlot || !selectedDoctor) {
            toast.error('Veuillez remplir tous les champs obligatoires');
            return;
        }

        toast.success('RDV créé avec succès !', {
            description: `${selectedPatient.first_name} ${selectedPatient.last_name} - ${format(selectedDate, 'dd/MM/yyyy')} à ${selectedSlot}`,
        });

        // Reset form
        setSelectedPatient(null);
        setSelectedSlot('');
        setReason('');
        setSearchPatient('');
    };

    // Mock today's appointments
    const todayAppointments = [
        { time: '09:00', patient: 'Jean Dupont', doctor: 'Dr. House', status: 'confirmed' },
        { time: '09:30', patient: 'Marie Martin', doctor: 'Dr. Wilson', status: 'waiting' },
        { time: '10:00', patient: 'Pierre Durand', doctor: 'Dr. House', status: 'confirmed' },
        { time: '10:30', patient: '--', doctor: 'Dr. House', status: 'available' },
        { time: '11:00', patient: 'Sophie Bernard', doctor: 'Dr. Wilson', status: 'cancelled' },
        { time: '14:00', patient: 'Luc Richard', doctor: 'Dr. House', status: 'confirmed' },
        { time: '14:30', patient: '--', doctor: 'Dr. Wilson', status: 'available' },
        { time: '15:00', patient: 'Anne Petit', doctor: 'Dr. House', status: 'confirmed' },
    ];

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'confirmed':
                return <Badge className="bg-green-100 text-green-700"><CheckCircle className="h-3 w-3 mr-1" />Confirmé</Badge>;
            case 'waiting':
                return <Badge className="bg-yellow-100 text-yellow-700"><Clock className="h-3 w-3 mr-1" />En attente</Badge>;
            case 'cancelled':
                return <Badge className="bg-red-100 text-red-700"><XCircle className="h-3 w-3 mr-1" />Annulé</Badge>;
            case 'available':
                return <Badge className="bg-blue-100 text-blue-700">Disponible</Badge>;
            default:
                return null;
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-6 animate-fade-in">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">Mode Secrétaire</h1>
                        <p className="text-muted-foreground">Gestion des RDV et accueil patients</p>
                    </div>
                    <Badge variant="outline" className="text-lg px-4 py-2">
                        {format(new Date(), 'EEEE dd MMMM yyyy', { locale: fr })}
                    </Badge>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Quick Booking Form */}
                    <Card className="glass-card lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CalendarPlus className="h-5 w-5 text-primary" />
                                Prise de RDV Rapide
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Patient Search */}
                            <div className="space-y-2">
                                <Label>Rechercher Patient</Label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Nom, prénom ou téléphone..."
                                        className="pl-10"
                                        value={searchPatient}
                                        onChange={(e) => setSearchPatient(e.target.value)}
                                    />
                                </div>
                                {searchPatient && !selectedPatient && (
                                    <div className="border rounded-md max-h-40 overflow-y-auto">
                                        {filteredPatients.map((p) => (
                                            <div
                                                key={p.id}
                                                className="p-2 hover:bg-muted cursor-pointer flex items-center justify-between"
                                                onClick={() => { setSelectedPatient(p); setSearchPatient(''); }}
                                            >
                                                <div>
                                                    <span className="font-medium">{p.first_name} {p.last_name}</span>
                                                    <span className="text-xs text-muted-foreground ml-2">{p.phone}</span>
                                                </div>
                                                <PatientRiskBadge risk={p.riskScore || calculateRiskScore(p)} size="sm" showLabel={false} />
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {selectedPatient && (
                                    <div className="flex items-center justify-between p-3 bg-primary/10 rounded-md">
                                        <div className="flex items-center gap-3">
                                            <User className="h-5 w-5 text-primary" />
                                            <div>
                                                <div className="font-medium">{selectedPatient.first_name} {selectedPatient.last_name}</div>
                                                <div className="text-xs text-muted-foreground flex items-center gap-2">
                                                    <Phone className="h-3 w-3" /> {selectedPatient.phone || 'Non renseigné'}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <PatientRiskBadge risk={selectedPatient.riskScore || calculateRiskScore(selectedPatient)} size="sm" />
                                            <Button variant="ghost" size="sm" onClick={() => setSelectedPatient(null)}>
                                                <XCircle className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Doctor Selection */}
                                <div className="space-y-2">
                                    <Label>Médecin</Label>
                                    <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Choisir un médecin" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {doctors.map((d) => (
                                                <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                                            ))}
                                            <SelectItem value="dr-house">Dr. House</SelectItem>
                                            <SelectItem value="dr-wilson">Dr. Wilson</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Time Slot */}
                                <div className="space-y-2">
                                    <Label>Créneau</Label>
                                    <Select value={selectedSlot} onValueChange={setSelectedSlot}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Heure du RDV" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {AVAILABLE_SLOTS.map((slot) => (
                                                <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Reason */}
                            <div className="space-y-2">
                                <Label>Motif (optionnel)</Label>
                                <Input
                                    placeholder="Consultation, suivi, urgence..."
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                />
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3">
                                <Button onClick={handleBookAppointment} className="flex-1 gap-2">
                                    <CalendarPlus className="h-4 w-4" />
                                    Créer le RDV
                                </Button>
                                <Button variant="outline" className="gap-2">
                                    <MessageSquare className="h-4 w-4" />
                                    Envoyer Rappel WhatsApp
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Calendar */}
                    <Card className="glass-card">
                        <CardHeader>
                            <CardTitle className="text-sm">Date du RDV</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Calendar
                                mode="single"
                                selected={selectedDate}
                                onSelect={(date) => date && setSelectedDate(date)}
                                locale={fr}
                                className="rounded-md border"
                            />
                        </CardContent>
                    </Card>
                </div>

                {/* Today's Schedule */}
                <Card className="glass-card">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="h-5 w-5 text-primary" />
                            Planning du Jour
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                            {todayAppointments.map((apt, i) => (
                                <div
                                    key={i}
                                    className={`p-3 rounded-lg border ${apt.status === 'available' ? 'border-dashed border-primary/50 bg-primary/5' : 'border-border'}`}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-bold text-lg">{apt.time}</span>
                                        {getStatusBadge(apt.status)}
                                    </div>
                                    <div className="text-sm">{apt.patient}</div>
                                    <div className="text-xs text-muted-foreground">{apt.doctor}</div>
                                    {apt.status === 'available' && (
                                        <Button size="sm" variant="outline" className="w-full mt-2 text-xs">
                                            Réserver
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default SecretaryView;
