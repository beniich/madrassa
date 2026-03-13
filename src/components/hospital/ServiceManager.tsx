import { Button } from "@/components/ui-1cc/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui-1cc/dialog";
import { Input } from "@/components/ui-1cc/input";
import { Label } from "@/components/ui-1cc/label";
import { useHospitalStore } from "@/stores/useHospitalStore";
import { Plus, Building2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Card } from "@/components/ui-1cc/card";
import { Badge } from "@/components/ui-1cc/badge";

export function ServiceManager() {
    const services = useHospitalStore((state) => state.services);
    const addService = useHospitalStore((state) => state.addService);

    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [floor, setFloor] = useState("");
    const [color, setColor] = useState("#3b82f6");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !floor) return;

        addService({
            name,
            floor,
            color
        });

        toast.success("Service ajouté", {
            description: `Le service ${name} a été créé.`
        });

        setName("");
        setFloor("");
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Gérer les Services
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Gestion des Services Hospitaliers</DialogTitle>
                    <DialogDescription>
                        Ajoutez ou modifiez les services et départements de l'hôpital.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-8 mt-4">
                    {/* List of existing services */}
                    <div className="space-y-4">
                        <h3 className="font-semibold flex items-center gap-2">
                            <Building2 className="h-4 w-4" />
                            Services Actuels
                        </h3>
                        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                            {services.map(service => (
                                <Card key={service.id} className="p-3 flex items-center justify-between bg-muted/50 border-border/50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: service.color }} />
                                        <div>
                                            <div className="font-medium text-sm">{service.name}</div>
                                            <div className="text-xs text-muted-foreground">{service.floor}</div>
                                        </div>
                                    </div>
                                    <Badge variant="outline" className="text-xs">
                                        {service.id.slice(0, 6)}
                                    </Badge>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Add Form */}
                    <form onSubmit={handleSubmit} className="space-y-4 border-l border-border/50 pl-8">
                        <h3 className="font-semibold">Nouveau Service</h3>

                        <div className="space-y-2">
                            <Label htmlFor="name">Nom du service</Label>
                            <Input
                                id="name"
                                placeholder="ex: Pneumologie"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="floor">Étage / Aile</Label>
                            <Input
                                id="floor"
                                placeholder="ex: 3ème Étage - Aile Nord"
                                value={floor}
                                onChange={(e) => setFloor(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="color">Code Couleur</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="color"
                                    type="color"
                                    value={color}
                                    className="w-12 h-10 p-1"
                                    onChange={(e) => setColor(e.target.value)}
                                />
                                <Input
                                    value={color}
                                    onChange={(e) => setColor(e.target.value)}
                                    className="flex-1"
                                />
                            </div>
                        </div>

                        <Button type="submit" className="w-full mt-4">
                            Créer le Service
                        </Button>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
