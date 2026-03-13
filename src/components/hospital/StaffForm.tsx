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
import { DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui-1cc/dialog";

const staffFormSchema = z.object({
    name: z.string().min(2, "Le nom est requis"),
    role: z.string().min(2, "Le rôle est requis"),
    specialty: z.string().optional(),
    email: z.string().email("Email invalide"),
    phone: z.string().min(10, "Numéro invalide"),
    status: z.enum(["on_duty", "off_duty", "on_call"]).default("off_duty"),
});

type StaffFormValues = z.infer<typeof staffFormSchema>;

interface StaffFormProps {
    onSuccess?: () => void;
}

export function StaffForm({ onSuccess }: StaffFormProps) {
    const addStaff = useHospitalStore((state) => state.addStaff);

    const form = useForm<StaffFormValues>({
        resolver: zodResolver(staffFormSchema),
        defaultValues: {
            name: "",
            role: "Doctor",
            status: "off_duty",
            email: "",
            phone: "",
            specialty: ""
        },
    });

    const onSubmit = (data: StaffFormValues) => {
        addStaff({
            name: data.name,
            role: data.role,
            status: data.status,
            email: data.email,
            phone: data.phone,
            specialty: data.specialty || undefined,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.name.replace(' ', '')}`, // Auto-generate avatar
        });

        toast.success("Membre ajouté avec succès", {
            description: `${data.name} a été ajouté à l'équipe.`
        });

        if (onSuccess) onSuccess();
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <DialogHeader>
                    <DialogTitle>Ajouter un membre</DialogTitle>
                    <DialogDescription>
                        Créez un profil pour un nouveau médecin, infirmier ou administratif.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="name" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nom Complet</FormLabel>
                            <FormControl><Input placeholder="Dr. House" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="role" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Rôle</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="Doctor">Médecin</SelectItem>
                                    <SelectItem value="Nurse">Infirmier(e)</SelectItem>
                                    <SelectItem value="Admin">Administratif</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="specialty" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Spécialité</FormLabel>
                            <FormControl><Input placeholder="Cardiologie" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="status" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Statut Actuel</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="on_duty">En Service</SelectItem>
                                    <SelectItem value="off_duty">Repos</SelectItem>
                                    <SelectItem value="on_call">Astreinte</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="email" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl><Input placeholder="email@hopital.fr" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="phone" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Téléphone</FormLabel>
                            <FormControl><Input placeholder="06..." {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                </div>

                <DialogFooter className="mt-4">
                    <Button type="submit">Ajouter l'employé</Button>
                </DialogFooter>
            </form>
        </Form>
    );
}
