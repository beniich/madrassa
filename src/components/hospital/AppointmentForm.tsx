import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui-1cc/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui-1cc/form";
import { Input } from "@/components/ui-1cc/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui-1cc/select";
import { useHospitalStore } from "@/stores/useHospitalStore";
import { toast } from "sonner";
import { DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui-1cc/dialog";
import { addHours } from "date-fns";

const appointmentFormSchema = z.object({
    title: z.string().min(2, "Le titre est requis"),
    type: z.enum(["surgery", "consultation", "urgent", "meeting"]),
    doctor: z.string().min(2, "Le médecin est requis"),
    room: z.string().min(2, "La salle est requise"),
    start_time: z.string().regex(/^\d{2}:\d{2}$/, "Format HH:MM requis"),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format YYYY-MM-DD requis"),
    duration: z.coerce.number().min(0.5, "Durée minimum 30min"),
});

type AppointmentFormValues = z.infer<typeof appointmentFormSchema>;

interface AppointmentFormProps {
    onSuccess?: () => void;
}

export function AppointmentForm({ onSuccess }: AppointmentFormProps) {
    const addAppointment = useHospitalStore((state) => state.addAppointment);

    const form = useForm<AppointmentFormValues>({
        resolver: zodResolver(appointmentFormSchema),
        defaultValues: {
            title: "",
            type: "consultation",
            doctor: "",
            room: "",
            start_time: "09:00",
            date: new Date().toISOString().split('T')[0],
            duration: 1,
        },
    });

    const onSubmit = (data: AppointmentFormValues) => {
        // Construct Date object
        const startDateTime = new Date(`${data.date}T${data.start_time}`);

        addAppointment({
            id: Date.now(), // handled by store usually but types might require it or store overwrites
            title: data.title,
            type: data.type,
            start: startDateTime,
            duration: data.duration,
            doctor: data.doctor,
            room: data.room,
            source: 'Internal'
        });

        toast.success("Rendez-vous planifié", {
            description: `${data.title} avec ${data.doctor} à ${data.start_time}`
        });

        if (onSuccess) onSuccess();
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <DialogHeader>
                    <DialogTitle>Nouveau Rendez-vous</DialogTitle>
                    <DialogDescription>Planifier une intervention, une consultation ou une réunion.</DialogDescription>
                </DialogHeader>

                <FormField control={form.control} name="title" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Titre</FormLabel>
                        <FormControl><Input placeholder="Ex: Consultation Cardiologie" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />

                <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="type" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="consultation">Consultation</SelectItem>
                                    <SelectItem value="surgery">Chirurgie</SelectItem>
                                    <SelectItem value="urgent">Urgence</SelectItem>
                                    <SelectItem value="meeting">Réunion</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="doctor" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Médecin / Responsable</FormLabel>
                            <FormControl><Input placeholder="Dr. House" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <FormField control={form.control} name="date" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Date</FormLabel>
                            <FormControl><Input type="date" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="start_time" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Heure</FormLabel>
                            <FormControl><Input type="time" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="duration" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Durée (h)</FormLabel>
                            <FormControl><Input type="number" step="0.5" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                </div>

                <FormField control={form.control} name="room" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Salle / Lieu</FormLabel>
                        <FormControl><Input placeholder="Bloc A, Bureau 101..." {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />

                <DialogFooter className="mt-4">
                    <Button type="submit">Enregistrer le RDV</Button>
                </DialogFooter>
            </form>
        </Form>
    );
}
