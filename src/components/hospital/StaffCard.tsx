import { Card } from "@/components/ui-1cc/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui-1cc/avatar";
import { Badge } from "@/components/ui-1cc/badge";
import { Phone, Mail, Stethoscope, Clock, Shield, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui-1cc/button";

interface StaffCardProps {
    data: {
        id: string;
        name: string;
        role: string;
        specialty?: string;
        status: 'on_duty' | 'off_duty' | 'on_call';
        email: string;
        phone: string;
        avatar?: string;

    };
    onEdit?: () => void;
    onDelete?: () => void;
    onClick?: () => void;
}

export const StaffCard = ({ data, onEdit, onDelete, onClick }: StaffCardProps) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'on_duty': return 'bg-green-500/10 text-green-700 border-green-200';
            case 'on_call': return 'bg-orange-500/10 text-orange-700 border-orange-200';
            default: return 'bg-slate-100 text-slate-500 border-slate-200';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'on_duty': return 'En Service';
            case 'on_call': return 'Astreinte';
            default: return 'Repos';
        }
    };

    return (
        <Card
            className="glass-card p-0 overflow-hidden group hover:shadow-lg transition-all duration-300 cursor-pointer"
            onClick={onClick}
        >
            <div className="h-24 bg-gradient-to-r from-primary/20 to-secondary/20 relative">
                <div className="absolute top-3 right-3 flex gap-2" onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="icon" className="h-6 w-6 bg-white/50 hover:bg-white" onClick={onEdit}>
                        <Pencil className="h-3 w-3" />
                    </Button>
                    <Badge variant="outline" className={`bg-white/50 backdrop-blur-sm border-0 ${getStatusColor(data.status)}`}>
                        {getStatusLabel(data.status)}
                    </Badge>
                </div>
            </div>

            <div className="px-6 pb-6 relative">
                <div className="-mt-12 mb-4 flex justify-between items-end">
                    <Avatar className="h-24 w-24 border-4 border-background shadow-md">
                        <AvatarImage src={data.avatar} />
                        <AvatarFallback className="text-xl bg-primary/10 text-primary font-bold">
                            {data.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                    </Avatar>
                    <div className="mb-1">
                        <Badge variant="secondary" className="font-normal">
                            {data.role === 'Doctor' ? <Stethoscope className="h-3 w-3 mr-1" /> : <Shield className="h-3 w-3 mr-1" />}
                            {data.role}
                        </Badge>
                    </div>
                </div>

                <div className="mb-4">
                    <h3 className="text-xl font-bold text-foreground">{data.name}</h3>
                    <p className="text-sm text-primary font-medium">{data.specialty}</p>
                </div>

                <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2 p-2 rounded-md hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-colors">
                        <Mail className="h-4 w-4 text-primary/70" />
                        <span className="truncate">{data.email}</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-md hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-colors">
                        <Phone className="h-4 w-4 text-primary/70" />
                        <span>{data.phone}</span>
                    </div>
                    {data.status === 'on_duty' && (
                        <div className="flex items-center gap-2 p-2 rounded-md bg-green-500/5 text-green-700">
                            <Clock className="h-4 w-4" />
                            <span>Début de service: 08:00</span>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
};
