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
import { Textarea } from "@/components/ui-1cc/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui-1cc/select";
import { useHospitalStore } from "@/stores/useHospitalStore";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui-1cc/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui-1cc/tabs";
import { User, FileText, Shield } from "lucide-react";

// Schema Validation
const patientFormSchema = z.object({
    // Identity
    first_name: z.string().min(2, "Le prénom est requis"),
    last_name: z.string().min(2, "Le nom est requis"),
    dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format date invalide (YYYY-MM-DD)"),
    gender: z.enum(["M", "F"]),
    socialSecurityNumber: z.string().min(13, "Numéro SS invalide (13 ou 15 chiffres)").optional(),
    phone: z.string().min(10, "Numéro de téléphone invalide"),
    email: z.string().email("Email invalide").optional(),
    address: z.string().optional(),

    // Medical
    admissionReason: z.string().min(5, "Motif d'admission requis"),
    diagnosis: z.string().optional(), // Nature de la maladie
    allergies: z.string().optional(), // Comma separated string for input
    medicalHistory: z.string().optional(), // Comma separated string for input

    // Admin
    insuranceProvider: z.string().optional(),
    status: z.enum(["admitted", "outpatient", "discharged"]).default("admitted"),
});

type PatientFormValues = z.infer<typeof patientFormSchema>;

interface PatientFormProps {
    onSuccess?: () => void;
    initialData?: Partial<Patient>;
    editPatientId?: string;
}

export function PatientForm({ onSuccess, initialData, editPatientId }: PatientFormProps) {
    const addPatient = useHospitalStore((state) => state.addPatient);
    const updatePatient = useHospitalStore((state) => state.updatePatient);

    const form = useForm<PatientFormValues>({
        resolver: zodResolver(patientFormSchema),
        defaultValues: {
            first_name: initialData?.first_name || "",
            last_name: initialData?.last_name || "",
            dob: initialData?.dob || "",
            gender: initialData?.gender || "M",
            socialSecurityNumber: initialData?.socialSecurityNumber || "",
            phone: initialData?.phone || "",
            email: initialData?.email || "",
            address: initialData?.address || "",
            admissionReason: initialData?.admissionReason || "",
            diagnosis: initialData?.diagnosis || "",
            allergies: initialData?.allergies?.join(', ') || "",
            medicalHistory: initialData?.medicalHistory?.join(', ') || "",
            insuranceProvider: initialData?.insuranceProvider || "",
            status: initialData?.status || "admitted",
        },
    });

    const onSubmit = (data: PatientFormValues) => {
        // Transform strings to arrays for tags
        const allergiesArray = data.allergies ? data.allergies.split(',').map(s => s.trim()).filter(s => s !== "") : [];
        const historyArray = data.medicalHistory ? data.medicalHistory.split(',').map(s => s.trim()).filter(s => s !== "") : [];

        if (editPatientId) {
            updatePatient(editPatientId, {
                ...data,
                allergies: allergiesArray,
                medicalHistory: historyArray,
            });
            toast.success("Dossier patient mis à jour", {
                description: `${data.first_name} ${data.last_name} a été mis à jour.`
            });
        } else {
            addPatient({
                ...data,
                first_name: data.first_name,
                last_name: data.last_name,
                gender: data.gender,
                status: data.status,
                dob: data.dob,
                phone: data.phone,
                admissionReason: data.admissionReason,
                allergies: allergiesArray,
                medicalHistory: historyArray,
                last_visit: new Date().toISOString(),
                socialSecurityNumber: data.socialSecurityNumber,
                email: data.email,
                address: data.address,
                diagnosis: data.diagnosis,
                insuranceProvider: data.insuranceProvider,
            });

            toast.success("Dossier patient créé avec succès", {
                description: `${data.first_name} ${data.last_name} a été ajouté.`
            });
        }

        if (onSuccess) onSuccess();
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <Tabs defaultValue="identity" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="identity" className="flex gap-2"><User className="h-4 w-4" /> Identité</TabsTrigger>
                        <TabsTrigger value="medical" className="flex gap-2"><FileText className="h-4 w-4" /> Médical</TabsTrigger>
                        <TabsTrigger value="admin" className="flex gap-2"><Shield className="h-4 w-4" /> Admin</TabsTrigger>
                    </TabsList>

                    <div className="mt-4 p-1">
                        {/* IDENTITY TAB */}
                        <TabsContent value="identity" className="space-y-4 animate-fade-in">
                            <div className="grid grid-cols-2 gap-4">
                                <FormField control={form.control} name="first_name" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Prénom <span className="text-red-500">*</span></FormLabel>
                                        <FormControl><Input placeholder="Jean" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="last_name" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nom <span className="text-red-500">*</span></FormLabel>
                                        <FormControl><Input placeholder="Dupont" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <FormField control={form.control} name="dob" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Date de naissance</FormLabel>
                                        <FormControl><Input type="date" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="gender" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Sexe</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="M">Masculin</SelectItem>
                                                <SelectItem value="F">Féminin</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>

                            <FormField control={form.control} name="phone" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Téléphone</FormLabel>
                                    <FormControl><Input placeholder="06 12 34 56 78" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField control={form.control} name="address" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Adresse complète</FormLabel>
                                    <FormControl><Textarea placeholder="123 Rue de la Santé, 75000 Paris" className="min-h-[60px]" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </TabsContent>

                        {/* MEDICAL TAB */}
                        <TabsContent value="medical" className="space-y-4 animate-fade-in">
                            <FormField control={form.control} name="admissionReason" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Motif d'admission (Plainte principale)</FormLabel>
                                    <FormControl><Textarea placeholder="Douleurs thoraciques, fièvre..." className="min-h-[80px]" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField control={form.control} name="diagnosis" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nature de la maladie (Diagnostic suspecté)</FormLabel>
                                    <FormControl><Input placeholder="Ex: Angine de poitrine" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <div className="grid grid-cols-2 gap-4">
                                <FormField control={form.control} name="allergies" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Allergies (séparées par des virgules)</FormLabel>
                                        <FormControl><Input placeholder="Pénicilline, Arachides..." {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="medicalHistory" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Antécédents (séparés par des virgules)</FormLabel>
                                        <FormControl><Input placeholder="Diabète, Hypertension..." {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>
                        </TabsContent>

                        {/* ADMIN TAB */}
                        <TabsContent value="admin" className="space-y-4 animate-fade-in">
                            <FormField control={form.control} name="socialSecurityNumber" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Numéro de Sécurité Sociale</FormLabel>
                                    <FormControl><Input placeholder="1 85 01 75..." {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField control={form.control} name="insuranceProvider" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Mutuelle / Assurance</FormLabel>
                                    <FormControl><Input placeholder="Nom de la mutuelle" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField control={form.control} name="status" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Statut d'admission</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="admitted">Admis (Hospitalisation)</SelectItem>
                                            <SelectItem value="outpatient">Consultation Externe</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </TabsContent>
                    </div>

                    <div className="flex justify-end pt-4 border-t border-border mt-6">
                        <Button type="submit" className="w-full md:w-auto bg-primary text-primary-foreground hover:bg-primary/90">
                            {editPatientId ? "Enregistrer les modifications" : "Créer le dossier patient"}
                        </Button>
                    </div>
                </Tabs>
            </form>
        </Form>
    );
}
