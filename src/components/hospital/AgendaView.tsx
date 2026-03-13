import { useState } from 'react';
import { format, addDays, startOfWeek, addHours, startOfDay, addMinutes } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Clock, MapPin, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui-1cc/button';
import { Card } from '@/components/ui-1cc/card';
import { cn } from '@/lib/utils';
import { useHospitalStore, Appointment } from "@/stores/useHospitalStore";
import { GoogleCalendarService, CalendarEvent } from '@/components/calendar/GoogleCalendarService';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui-1cc/dialog";
import { Input } from "@/components/ui-1cc/input";
import { Label } from "@/components/ui-1cc/label";
import { toast } from "sonner";
import { DndContext, DragEndEvent, useDraggable, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';

// --- Draggable Component ---
const DraggableEvent = ({ event, children, top, height, className }: { event: any, children: React.ReactNode, top: number, height: number, className?: string }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: event.id,
        data: event,
        disabled: event.type === 'google' // Disable drag for Google events
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        top: `${top}px`,
        height: `${height}px`,
        position: 'absolute' as const,
        zIndex: 50,
    } : {
        top: `${top}px`,
        height: `${height}px`,
        position: 'absolute' as const,
    };

    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes} className={className}>
            {children}
        </div>
    );
};

export const AgendaView = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [viewMode, setViewMode] = useState<'day' | 'week'>('day');
    const [googleEvents, setGoogleEvents] = useState<CalendarEvent[]>([]);
    const [isSyncing, setIsSyncing] = useState(false);

    // Connect to store
    const appointments = useHospitalStore((state) => state.appointments);
    const updateAppointment = useHospitalStore((state) => state.updateAppointment);

    const [editingEvent, setEditingEvent] = useState<Appointment | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // DnD Sensors
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, delta } = event;
        if (!active || !delta.y) return;

        const appointmentId = active.id as string;
        const appointment = appointments.find(a => a.id === appointmentId);

        if (appointment) {
            // 80px = 1 hour (60 mins)
            // delta.y pixels = (delta.y / 80) * 60 minutes
            const minutesMoved = Math.round((delta.y / 80) * 60);

            // Snap to 15 mins
            const snappedMinutes = Math.round(minutesMoved / 15) * 15;

            if (snappedMinutes !== 0) {
                const newStart = addMinutes(appointment.start, snappedMinutes);
                updateAppointment(appointmentId, {
                    ...appointment,
                    start: newStart
                });
                toast.success(`Rendez-vous déplacé à ${format(newStart, 'HH:mm')}`);
            }
        }
    };

    const handleSaveEvent = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingEvent) return;

        updateAppointment(editingEvent.id, {
            ...editingEvent,
            duration: Number(editingEvent.duration)
        });
        setIsDialogOpen(false);
        toast.success("Rendez-vous mis à jour");
    };

    const hours = Array.from({ length: 13 }, (_, i) => i + 7); // 07:00 to 19:00

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'surgery': return 'bg-red-500/10 border-red-500/20 text-red-700 dark:text-red-300';
            case 'consultation': return 'bg-blue-500/10 border-blue-500/20 text-blue-700 dark:text-blue-300';
            case 'urgent': return 'bg-orange-500/10 border-orange-500/20 text-orange-700 dark:text-orange-300';
            case 'google': return 'bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-300';
            default: return 'bg-slate-500/10 border-slate-500/20 text-slate-700 dark:text-slate-300';
        }
    };

    const handleConnectGoogle = async () => {
        setIsSyncing(true);
        const connected = await GoogleCalendarService.connect();
        if (connected) {
            const events = await GoogleCalendarService.fetchEvents();
            setGoogleEvents(events);
        }
        setIsSyncing(false);
    };

    // Merge internal and google events
    const allEvents = [
        ...appointments.map(a => ({ ...a, source: 'Internal' as const })),
        ...googleEvents.map(g => ({ ...g, duration: (g.end.getTime() - g.start.getTime()) / (1000 * 60 * 60), doctor: g.source, room: 'Google', source: 'Google' as const, type: 'google' as const }))
    ];

    return (
        <Card className="glass-card overflow-hidden flex flex-col h-[700px]">
            {/* Calendar Header */}
            <div className="flex items-center justify-between p-4 border-b border-border/50">
                <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-bold capitalize text-foreground">
                        {format(currentDate, 'EEEE d MMMM yyyy', { locale: fr })}
                    </h2>
                    <div className="flex items-center rounded-md border border-border/50 bg-background/50">
                        <Button variant="ghost" size="icon" onClick={() => setCurrentDate(addDays(currentDate, -1))}>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setCurrentDate(new Date())}>
                            Aujourd'hui
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setCurrentDate(addDays(currentDate, 1))}>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 border-blue-200 text-blue-700 bg-blue-50/50 hover:bg-blue-100 dark:bg-blue-900/10 dark:text-blue-300 dark:border-blue-900"
                        onClick={handleConnectGoogle}
                        disabled={isSyncing}
                    >
                        {isSyncing ? <Loader2 className="h-4 w-4 animate-spin" /> : <img src="https://www.google.com/favicon.ico" className="h-4 w-4" alt="G" />}
                        {googleEvents.length > 0 ? 'Synchronisé' : 'Sync Google Agenda'}
                    </Button>

                    <div className="flex bg-muted/20 p-1 rounded-lg">
                        <button
                            onClick={() => setViewMode('day')}
                            className={cn("px-3 py-1 text-sm rounded-md transition-all", viewMode === 'day' ? "bg-white shadow-sm text-primary font-medium" : "text-muted-foreground hover:text-foreground")}
                        >
                            Jour
                        </button>
                        <button
                            onClick={() => setViewMode('week')}
                            className={cn("px-3 py-1 text-sm rounded-md transition-all", viewMode === 'week' ? "bg-white shadow-sm text-primary font-medium" : "text-muted-foreground hover:text-foreground")}
                        >
                            Semaine
                        </button>
                    </div>
                </div>
            </div>

            {/* Calendar Body */}
            <div className="flex-1 overflow-y-auto relative bg-slate-50/30 dark:bg-black/20">
                <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
                    {/* Time Grid */}
                    <div className="relative min-h-[800px]">
                        {hours.map((hour) => (
                            <div key={hour} className="flex border-b border-border/30 h-[80px]">
                                <div className="w-16 flex-shrink-0 border-r border-border/30 flex justify-center pt-2 bg-background/50">
                                    <span className="text-xs font-medium text-muted-foreground">{hour}:00</span>
                                </div>
                                <div className="flex-1 relative group">
                                    <div className="absolute inset-0 group-hover:bg-slate-100/30 dark:group-hover:bg-slate-800/20 transition-colors" />
                                    {/* Half hour line */}
                                    <div className="absolute top-1/2 left-0 right-0 border-t border-dashed border-border/20" />
                                </div>
                            </div>
                        ))}

                        {/* Events Overlay */}
                        {allEvents.map((apt) => {
                            const startHour = apt.start.getHours();
                            const startMinutes = apt.start.getMinutes();
                            if (startHour < 7) return null;

                            const topPosition = ((startHour - 7) * 80) + ((startMinutes / 60) * 80);
                            const height = apt.duration * 80;

                            const EventContent = () => (
                                <div
                                    className={cn("h-full w-full rounded-lg border p-3 cursor-pointer hover:shadow-lg transition-all border-l-4 overflow-hidden", getTypeColor(apt.type))}
                                >
                                    <div className="flex flex-col h-full">
                                        <div className="flex justify-between items-start">
                                            <span className="font-semibold text-sm truncate">{apt.title}</span>
                                            <span className="text-xs opacity-70 flex items-center gap-1 whitespace-nowrap">
                                                <Clock className="h-3 w-3" />
                                                {format(apt.start, 'HH:mm')}
                                            </span>
                                        </div>
                                        <div className="mt-auto flex items-center justify-between text-xs opacity-80 pt-2 border-t border-black/5 dark:border-white/5">
                                            <div className="flex items-center gap-1 truncate"><User className="h-3 w-3" />{apt.doctor}</div>
                                            <div className="flex items-center gap-1 truncate"><MapPin className="h-3 w-3" />{apt.room}</div>
                                        </div>
                                    </div>
                                </div>
                            );

                            if (apt.type === 'google') {
                                return (
                                    <div
                                        key={apt.id}
                                        className="absolute left-20 right-4"
                                        style={{ top: `${topPosition}px`, height: `${height}px` }}
                                    >
                                        <EventContent />
                                    </div>
                                );
                            }

                            return (
                                <DraggableEvent
                                    key={apt.id}
                                    event={apt}
                                    top={topPosition}
                                    height={height}
                                    className="left-20 right-4"
                                >
                                    <Dialog open={isDialogOpen && editingEvent?.id === apt.id} onOpenChange={(open) => {
                                        setIsDialogOpen(open);
                                        if (open) setEditingEvent(apt);
                                    }}>
                                        <DialogTrigger asChild>
                                            <div onClick={(e) => e.stopPropagation()}> {/* Prevent drag start for click */}
                                                <EventContent />
                                            </div>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Modifier le rendez-vous</DialogTitle>
                                                <DialogDescription>Changer les détails de l'intervention ou de la consultation.</DialogDescription>
                                            </DialogHeader>
                                            <form onSubmit={handleSaveEvent} className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label>Titre</Label>
                                                    <Input
                                                        value={editingEvent?.title || ''}
                                                        onChange={e => setEditingEvent({ ...editingEvent, title: e.target.value })}
                                                    />
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label>Médecin</Label>
                                                        <Input
                                                            value={editingEvent?.doctor || ''}
                                                            onChange={e => setEditingEvent({ ...editingEvent, doctor: e.target.value })}
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Salle</Label>
                                                        <Input
                                                            value={editingEvent?.room || ''}
                                                            onChange={e => setEditingEvent({ ...editingEvent, room: e.target.value })}
                                                        />
                                                    </div>
                                                </div>
                                                <DialogFooter>
                                                    <Button type="submit">Enregistrer</Button>
                                                </DialogFooter>
                                            </form>
                                        </DialogContent>
                                    </Dialog>
                                </DraggableEvent>
                            );
                        })}

                        {/* Current Time Indicator */}
                        <div
                            className="absolute left-16 right-0 border-t-2 border-red-500 z-10 flex items-center pointer-events-none"
                            style={{ top: `${((new Date().getHours() - 7) * 80) + ((new Date().getMinutes() / 60) * 80)}px` }}
                        >
                            <div className="h-2 w-2 rounded-full bg-red-500 -ml-1" />
                        </div>
                    </div>
                </DndContext>
            </div>
        </Card>
    );
};
