import React, { useState } from 'react';
import { usePatientTimelineStore, getEventStyle, MedicalEventType, MedicalEvent } from '@/stores/usePatientTimelineStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui-1cc/card';
import { Button } from '@/components/ui-1cc/button';
import { Badge } from '@/components/ui-1cc/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui-1cc/select';
import { Clock, Filter, Plus, ChevronDown } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface PatientTimelineProps {
    patientId: string;
    onAddEvent?: () => void;
}

const EVENT_TYPE_LABELS: Record<MedicalEventType, string> = {
    admission: 'Admission',
    consultation: 'Consultation',
    exam: 'Examen',
    prescription: 'Prescription',
    alert: 'Alerte',
    discharge: 'Sortie',
    note: 'Note',
    surgery: 'Chirurgie',
    lab_result: 'Résultat Labo',
};

export const PatientTimeline: React.FC<PatientTimelineProps> = ({ patientId, onAddEvent }) => {
    const [filterType, setFilterType] = useState<MedicalEventType | 'all'>('all');
    const [expanded, setExpanded] = useState<string | null>(null);

    const allEvents = usePatientTimelineStore((state) => state.getPatientEvents(patientId));

    const events = filterType === 'all'
        ? (allEvents || [])
        : (allEvents || []).filter(e => e.type === filterType);

    const toggleExpand = (eventId: string) => {
        setExpanded(expanded === eventId ? null : eventId);
    };

    return (
        <Card className="glass-card h-full">
            <CardHeader className="border-b border-border/50 pb-4">
                <div className="flex justify-between items-center">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Clock className="h-5 w-5 text-primary" />
                        Timeline Médicale
                    </CardTitle>
                    <div className="flex gap-2">
                        <Select value={filterType} onValueChange={(v) => setFilterType(v as MedicalEventType | 'all')}>
                            <SelectTrigger className="w-[160px] h-8 text-xs">
                                <Filter className="h-3 w-3 mr-1" />
                                <SelectValue placeholder="Filtrer" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tous les types</SelectItem>
                                {Object.entries(EVENT_TYPE_LABELS).map(([key, label]) => (
                                    <SelectItem key={key} value={key}>
                                        {getEventStyle(key as MedicalEventType).icon} {label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {onAddEvent && (
                            <Button size="sm" variant="outline" onClick={onAddEvent} className="h-8">
                                <Plus className="h-3 w-3 mr-1" />
                                Ajouter
                            </Button>
                        )}
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-4 overflow-y-auto max-h-[500px]">
                {events.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        <Clock className="h-12 w-12 mx-auto mb-2 opacity-20" />
                        <p>Aucun événement dans la timeline</p>
                    </div>
                ) : (
                    <div className="relative">
                        {/* Timeline line */}
                        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/50 via-primary/20 to-transparent" />

                        <div className="space-y-4">
                            {events.map((event, index) => (
                                <TimelineEventCard
                                    key={event.id}
                                    event={event}
                                    isFirst={index === 0}
                                    isExpanded={expanded === event.id}
                                    onToggle={() => toggleExpand(event.id)}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

interface TimelineEventCardProps {
    event: MedicalEvent;
    isFirst: boolean;
    isExpanded: boolean;
    onToggle: () => void;
}

const TimelineEventCard: React.FC<TimelineEventCardProps> = ({
    event,
    isFirst,
    isExpanded,
    onToggle
}) => {
    const style = getEventStyle(event.type);

    return (
        <div className="relative pl-10 animate-fade-in">
            {/* Timeline dot */}
            <div className={`absolute left-2 w-5 h-5 rounded-full border-2 border-background ${style.bgColor} flex items-center justify-center text-xs shadow-md ${isFirst ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}`}>
                {style.icon}
            </div>

            <div
                className={`p-3 rounded-lg border transition-all cursor-pointer hover:shadow-md ${style.bgColor} border-${style.color.replace('text-', '')}/20`}
                onClick={onToggle}
            >
                <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">{event.title}</span>
                        {event.severity === 'critical' && (
                            <Badge variant="destructive" className="text-[10px] px-1 py-0">Urgent</Badge>
                        )}
                        {event.severity === 'warning' && (
                            <Badge variant="outline" className="text-[10px] px-1 py-0 border-yellow-500 text-yellow-600">Attention</Badge>
                        )}
                    </div>
                    <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <span>{formatDistanceToNow(new Date(event.timestamp), { addSuffix: true, locale: fr })}</span>
                    <span>•</span>
                    <span>{event.author.name}</span>
                    <Badge variant="secondary" className="text-[10px] px-1 py-0">
                        {EVENT_TYPE_LABELS[event.type]}
                    </Badge>
                </div>

                {isExpanded && event.description && (
                    <div className="mt-2 pt-2 border-t border-border/30 text-sm text-muted-foreground animate-fade-in">
                        {event.description}

                        {event.data && Object.keys(event.data).length > 0 && (
                            <div className="mt-2 p-2 bg-background/50 rounded text-xs font-mono">
                                {Object.entries(event.data).map(([key, value]) => (
                                    <div key={key} className="flex gap-2">
                                        <span className="text-primary">{key}:</span>
                                        <span>{String(value)}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PatientTimeline;
