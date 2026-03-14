import { AgendaView } from "@/components/hospital/AgendaView";
import { Button } from "@/components/ui-1cc/button";
import { Plus, Filter } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui-1cc/dialog";
import { AppointmentForm } from "@/components/hospital/AppointmentForm";

const SchedulePage = () => {
    return (
        <>
            <div className="space-y-6 animate-fade-in pb-12">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                            Agenda Hospitalier
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Planning des blocs opératoires, consultations et gardes.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" className="gap-2">
                            <Filter className="h-4 w-4" />
                            Filtrer Ressources
                        </Button>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button className="gap-2 shadow-lg shadow-primary/20">
                                    <Plus className="h-4 w-4" />
                                    Nouveau RDV
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <AppointmentForm onSuccess={() => document.dispatchEvent(new KeyboardEvent('keydown', { 'key': 'Escape' }))} />
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                <AgendaView />
            </div>
        </>
    );
};

export default SchedulePage;
