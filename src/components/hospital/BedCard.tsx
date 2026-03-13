import { Card } from "@/components/ui-1cc/card";
import { BedDouble, User, Clock, AlertCircle, Sparkles, Wrench } from "lucide-react";
import { Badge } from "@/components/ui-1cc/badge";
import { cn } from "@/lib/utils";

interface BedCardProps {
    data: {
        id: string;
        number: string;
        status: string;
        patient: {
            name: string;
            condition: string;
            admissionTime: string;
        } | null;
    };
    onClick?: () => void;
}

export const BedCard = ({ data, onClick }: BedCardProps) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'occupied': return 'border-red-500/50 bg-red-500/5 shadow-[0_0_15px_-3px_rgba(239,68,68,0.2)]';
            case 'available': return 'border-green-500/50 bg-green-500/5 shadow-[0_0_15px_-3px_rgba(34,197,94,0.2)]';
            case 'cleaning': return 'border-yellow-500/50 bg-yellow-500/5';
            case 'maintenance': return 'border-slate-500/50 bg-slate-500/5';
            default: return 'border-border';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'occupied': return <User className="h-4 w-4 text-red-500" />;
            case 'available': return <BedDouble className="h-4 w-4 text-green-500" />;
            case 'cleaning': return <Sparkles className="h-4 w-4 text-yellow-500" />;
            case 'maintenance': return <Wrench className="h-4 w-4 text-slate-500" />;
            default: return <BedDouble className="h-4 w-4" />;
        }
    };

    return (
        <Card
            className={cn(
                "relative p-4 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg border backdrop-blur-sm",
                getStatusColor(data.status)
            )}
            onClick={onClick}
        >
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                    <div className={cn("p-2 rounded-lg bg-background/50",
                        data.status === 'occupied' ? 'text-red-500' :
                            data.status === 'available' ? 'text-green-500' : 'text-slate-500'
                    )}>
                        <h3 className="font-bold text-lg">{data.number}</h3>
                    </div>
                </div>
                {data.status === 'occupied' && data.patient?.condition === 'Critique' && (
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                )}
            </div>

            {data.status === 'occupied' && data.patient ? (
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                        <User className="h-3 w-3 text-muted-foreground" />
                        <span className="truncate">{data.patient.name}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            <span>{data.patient.condition}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{data.patient.admissionTime}</span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="h-[52px] flex items-center justify-center text-sm text-muted-foreground/50 font-medium uppercase tracking-wider">
                    {data.status === 'available' ? 'Disponible' :
                        data.status === 'cleaning' ? 'Nettoyage' : 'Maintenance'}
                </div>
            )}

            <div className="absolute top-0 right-0 p-4 opacity-10">
                {getStatusIcon(data.status)}
            </div>
        </Card>
    );
};
