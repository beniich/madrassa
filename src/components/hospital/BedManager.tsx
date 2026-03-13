import { Button } from "@/components/ui-1cc/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui-1cc/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui-1cc/select";
import { Input } from "@/components/ui-1cc/input";
import { Label } from "@/components/ui-1cc/label";
import { useHospitalStore } from "@/stores/useHospitalStore";
import { BedDouble } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function BedManager() {
    const services = useHospitalStore((state) => state.services);
    const addBed = useHospitalStore((state) => state.addBed);

    const [open, setOpen] = useState(false);
    const [number, setNumber] = useState("");
    const [deptId, setDeptId] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!number || !deptId) return;

        addBed({
            number,
            deptId,
            status: "available",
            patient: null
        });

        toast.success("Lit ajouté", {
            description: `Le lit ${number} a été ajouté au service.`
        });

        setNumber("");
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                    <BedDouble className="h-4 w-4" />
                    Ajouter un Lit
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Ajouter un lit</DialogTitle>
                    <DialogDescription>
                        Configurez un nouveau lit dans un service existant.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div className="space-y-2">
                        <Label htmlFor="dept">Service</Label>
                        <Select onValueChange={setDeptId} value={deptId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Sélectionner un service" />
                            </SelectTrigger>
                            <SelectContent>
                                {services.map(s => (
                                    <SelectItem key={s.id} value={s.id}>{s.name} ({s.floor})</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="number">Numéro du lit</Label>
                        <Input
                            id="number"
                            placeholder="ex: 304-B"
                            value={number}
                            onChange={(e) => setNumber(e.target.value)}
                        />
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button type="submit">Ajouter</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
