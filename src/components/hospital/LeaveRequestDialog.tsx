import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui-1cc/dialog";
import { Button } from "@/components/ui-1cc/button";
import { Label } from "@/components/ui-1cc/label";
import { Input } from "@/components/ui-1cc/input";
import { Textarea } from "@/components/ui-1cc/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui-1cc/select";
import { Calendar } from "@/components/ui-1cc/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui-1cc/popover";
import { CalendarIcon } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { fr } from "date-fns/locale";
import { useHospitalStore } from "@/stores/useHospitalStore";
import { toast } from "@/hooks-1cc/use-toast";

interface LeaveRequestDialogProps {
    staffId: string;
    staffName: string;
    isOpen: boolean;
    onClose: () => void;
}

export function LeaveRequestDialog({
    staffId,
    staffName,
    isOpen,
    onClose,
}: LeaveRequestDialogProps) {
    const addLeaveRequest = useHospitalStore((state) => state.addLeaveRequest);

    const [leaveType, setLeaveType] = useState<string>("CP");
    const [startDate, setStartDate] = useState<Date>();
    const [endDate, setEndDate] = useState<Date>();
    const [reason, setReason] = useState("");

    const calculateDays = () => {
        if (!startDate || !endDate) return 0;
        return differenceInDays(endDate, startDate) + 1;
    };

    const handleSubmit = () => {
        if (!startDate || !endDate) {
            toast({
                title: "Dates manquantes",
                description: "Veuillez sélectionner les dates de début et de fin.",
                variant: "destructive",
            });
            return;
        }

        if (endDate < startDate) {
            toast({
                title: "Dates invalides",
                description: "La date de fin doit être après la date de début.",
                variant: "destructive",
            });
            return;
        }

        addLeaveRequest({
            staffId,
            staffName,
            type: leaveType as any,
            startDate: format(startDate, "yyyy-MM-dd"),
            endDate: format(endDate, "yyyy-MM-dd"),
            days: calculateDays(),
            reason,
            status: "pending",
        });

        toast({
            title: "Demande envoyée",
            description: `Votre demande de ${leaveType} (${calculateDays()} jours) a été soumise.`,
            className: "bg-green-600 text-white",
        });

        // Reset form
        setStartDate(undefined);
        setEndDate(undefined);
        setReason("");
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Nouvelle Demande de Congé</DialogTitle>
                    <DialogDescription>
                        Remplissez le formulaire pour soumettre votre demande.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>Type de Congé</Label>
                        <Select value={leaveType} onValueChange={setLeaveType}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="CP">Congés Payés</SelectItem>
                                <SelectItem value="RTT">RTT</SelectItem>
                                <SelectItem value="Maladie">Arrêt Maladie</SelectItem>
                                <SelectItem value="Sans Solde">Sans Solde</SelectItem>
                                <SelectItem value="Formation">Formation</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Date de Début</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start text-left font-normal"
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {startDate ? (
                                            format(startDate, "dd MMM yyyy", { locale: fr })
                                        ) : (
                                            <span className="text-muted-foreground">Choisir...</span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={startDate}
                                        onSelect={setStartDate}
                                        locale={fr}
                                        disabled={(date) => date < new Date()}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div className="space-y-2">
                            <Label>Date de Fin</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start text-left font-normal"
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {endDate ? (
                                            format(endDate, "dd MMM yyyy", { locale: fr })
                                        ) : (
                                            <span className="text-muted-foreground">Choisir...</span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={endDate}
                                        onSelect={setEndDate}
                                        locale={fr}
                                        disabled={(date) => !startDate || date < startDate}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>

                    {startDate && endDate && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                            <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                                Durée : {calculateDays()} jour{calculateDays() > 1 ? "s" : ""}
                            </p>
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label>Motif (optionnel)</Label>
                        <Textarea
                            placeholder="Précisez le motif de votre demande..."
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            rows={3}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Annuler
                    </Button>
                    <Button onClick={handleSubmit}>Soumettre la Demande</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
