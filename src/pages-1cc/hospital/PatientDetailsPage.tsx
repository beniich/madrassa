import { useParams, useNavigate } from "react-router-dom";
import { useHospitalStore } from "@/stores/useHospitalStore";
import { Button } from "@/components/ui-1cc/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui-1cc/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui-1cc/tabs";
import { ArrowLeft, FileText, Activity, Shield, Clock, Phone, Mail, MapPin, Edit, Bot } from "lucide-react";
import { Badge } from "@/components/ui-1cc/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui-1cc/avatar";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui-1cc/sheet";
import { PatientForm } from "@/components/patients/PatientForm";
import { PatientTimeline } from "@/components/patients/PatientTimeline";
import { MedicalAIChat } from "@/components/ai/MedicalAIChat";
import { PatientRiskBadge, calculateRiskScore } from "@/components/patients/PatientRiskBadge";
import { usePatientTimelineStore } from "@/stores/usePatientTimelineStore";
import { useState } from "react";

export default function PatientDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const patient = useHospitalStore(state => state.patients.find(p => p.id === id));
    const [isEditOpen, setIsEditOpen] = useState(false);
    const events = usePatientTimelineStore(state => state.getPatientEvents(id || '')) || [];

    if (!patient) {
        return (
            <>
                <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
                    <h2 className="text-2xl font-bold">Patient introuvable</h2>
                    <Button onClick={() => navigate('/patients')}>Retour à la liste</Button>
                </div>
            </>
        );
    }

    return (
        <>
            <div className="space-y-6 animate-fade-in pb-12">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => navigate('/patients')}>
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold flex items-center gap-3">
                                {patient.first_name} {patient.last_name}
                                <PatientRiskBadge risk={patient.riskScore || calculateRiskScore(patient)} size="md" />
                                <Badge variant={patient.status === 'admitted' ? 'default' : 'outline'}>
                                    {patient.status}
                                </Badge>
                            </h1>
                            <p className="text-muted-foreground text-sm">Dossier #{patient.id}</p>
                        </div>
                    </div>

                    <Sheet open={isEditOpen} onOpenChange={setIsEditOpen}>
                        <SheetTrigger asChild>
                            <Button variant="outline" className="gap-2">
                                <Edit className="h-4 w-4" />
                                Modifier le dossier
                            </Button>
                        </SheetTrigger>
                        <SheetContent className="min-w-[400px] md:min-w-[600px] overflow-y-auto">
                            <SheetHeader className="mb-6">
                                <SheetTitle>Modifier le Dossier Patient</SheetTitle>
                                <SheetDescription>
                                    Modifiez les informations ci-dessous. Les changements seront appliqués immédiatement après enregistrement.
                                </SheetDescription>
                            </SheetHeader>
                            <PatientForm
                                editPatientId={patient.id}
                                initialData={patient}
                                onSuccess={() => setIsEditOpen(false)}
                            />
                        </SheetContent>
                    </Sheet>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Sidebar Info */}
                    <Card className="glass-card md:col-span-1 h-fit">
                        <CardHeader>
                            <div className="flex justify-center mb-4">
                                <Avatar className="h-24 w-24 text-2xl">
                                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${patient.first_name}${patient.last_name}`} />
                                    <AvatarFallback>{patient.first_name[0]}{patient.last_name[0]}</AvatarFallback>
                                </Avatar>
                            </div>
                            <CardTitle className="text-center text-lg">Informations Contact</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            <div className="flex items-center gap-3 p-2 rounded-md bg-muted/30">
                                <Phone className="h-4 w-4 text-primary" />
                                <span>{patient.phone || "Non renseigné"}</span>
                            </div>
                            <div className="flex items-center gap-3 p-2 rounded-md bg-muted/30">
                                <Mail className="h-4 w-4 text-primary" />
                                <span>{patient.email || "Non renseigné"}</span>
                            </div>
                            <div className="flex items-start gap-3 p-2 rounded-md bg-muted/30">
                                <MapPin className="h-4 w-4 text-primary mt-1" />
                                <span>{patient.address || "Adresse non renseignée"}</span>
                            </div>
                            <div className="pt-4 border-t border-border/50">
                                <div className="text-xs text-muted-foreground uppercase font-bold mb-2">Sécurité Sociale</div>
                                <div className="font-mono bg-slate-100 dark:bg-slate-900 p-2 rounded text-center tracking-widest">
                                    {patient.socialSecurityNumber || "N/A"}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Main Content */}
                    <Card className="glass-card md:col-span-2 min-h-[500px]">
                        <Tabs defaultValue="timeline" className="w-full">
                            <div className="p-4 border-b border-border/50">
                                <TabsList className="grid w-full grid-cols-5">
                                    <TabsTrigger value="timeline" className="gap-2"><Clock className="h-4 w-4" /> Timeline</TabsTrigger>
                                    <TabsTrigger value="medical" className="gap-2"><Activity className="h-4 w-4" /> Médical</TabsTrigger>
                                    <TabsTrigger value="history" className="gap-2"><FileText className="h-4 w-4" /> Notes</TabsTrigger>
                                    <TabsTrigger value="admin" className="gap-2"><Shield className="h-4 w-4" /> Admin</TabsTrigger>
                                    <TabsTrigger value="ai" className="gap-2 text-primary"><Bot className="h-4 w-4" /> IA</TabsTrigger>
                                </TabsList>
                            </div>

                            <CardContent className="p-0">
                                {/* TIMELINE TAB - HIL Feature */}
                                <TabsContent value="timeline" className="m-0">
                                    <PatientTimeline patientId={patient.id} />
                                </TabsContent>

                                <div className="p-6">
                                    <TabsContent value="medical" className="space-y-6 animate-fade-in">
                                        <div className="space-y-2">
                                            <h3 className="font-semibold text-lg flex items-center gap-2">
                                                <Activity className="h-5 w-5 text-red-500" />
                                                Motif d'Admission
                                            </h3>
                                            <p className="text-muted-foreground bg-red-50/50 dark:bg-red-900/10 p-4 rounded-lg border border-red-100 dark:border-red-900/20">
                                                {patient.admissionReason || "Aucun motif spécifié."}
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <h3 className="font-semibold">Diagnostic Suspecté</h3>
                                                <div className="p-3 bg-blue-50/50 dark:bg-blue-900/10 rounded-lg border border-blue-100 dark:border-blue-900/20 text-blue-700 dark:text-blue-300">
                                                    {patient.diagnosis || "En cours d'évaluation"}
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <h3 className="font-semibold">Allergies Connues</h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {patient.allergies && patient.allergies.length > 0 ? (
                                                        patient.allergies.map((allergy, i) => (
                                                            <Badge key={i} variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-200 border-red-200">
                                                                {allergy}
                                                            </Badge>
                                                        ))
                                                    ) : (
                                                        <span className="text-muted-foreground text-sm italic">Aucune allergie signalée</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t border-border/50">
                                            <h3 className="font-semibold mb-3">Antécédents Médicaux</h3>
                                            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                                                {patient.medicalHistory && patient.medicalHistory.length > 0 ? (
                                                    patient.medicalHistory.map((history, i) => (
                                                        <li key={i}>{history}</li>
                                                    ))
                                                ) : (
                                                    <li className="list-none italic">Aucun antécédent notable.</li>
                                                )}
                                            </ul>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="history" className="space-y-4 animate-fade-in">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-semibold">Dernières Visites</h3>
                                            <Button size="sm" variant="outline">Ajouter une note</Button>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="flex gap-4 p-4 rounded-lg bg-muted/30 border border-border/50 items-start">
                                                <div className="bg-primary/10 p-2 rounded-full">
                                                    <FileText className="h-4 w-4 text-primary" />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="font-semibold">Consultation Initiale</span>
                                                        <span className="text-xs text-muted-foreground">{new Date(patient.last_visit).toLocaleDateString()}</span>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">
                                                        Admission du patient. Prise des constantes et installation en chambre.
                                                    </p>
                                                </div>
                                            </div>
                                            {/* Mock filler */}
                                            <div className="flex gap-4 p-4 rounded-lg bg-muted/30 border border-border/50 items-start opacity-70">
                                                <div className="bg-muted p-2 rounded-full">
                                                    <Activity className="h-4 w-4 text-muted-foreground" />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="font-semibold">Prise de sang</span>
                                                        <span className="text-xs text-muted-foreground">Il y a 2 jours</span>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">
                                                        Bilan sanguin complet effectué. Résultats en attente.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="admin" className="space-y-6 animate-fade-in">
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <span className="text-sm text-muted-foreground">Mutuelle / Assurance</span>
                                                <div className="font-medium">{patient.insuranceProvider || "Non renseigné"}</div>
                                            </div>
                                            <div className="space-y-2">
                                                <span className="text-sm text-muted-foreground">Médecin Traitant</span>
                                                <div className="font-medium text-primary">Dr. House</div>
                                            </div>
                                            <div className="space-y-2">
                                                <span className="text-sm text-muted-foreground">Date de Naissance</span>
                                                <div className="font-medium">{patient.dob}</div>
                                            </div>
                                            <div className="space-y-2">
                                                <span className="text-sm text-muted-foreground">Sexe</span>
                                                <div className="font-medium">{patient.gender === 'M' ? 'Masculin' : 'Féminin'}</div>
                                            </div>
                                        </div>
                                        <div className="mt-8 pt-4 border-t border-border/50 flex justify-end">
                                            <Button variant="destructive">Archiver le dossier</Button>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="ai" className="animate-fade-in h-[500px]">
                                        <MedicalAIChat patient={patient} events={events} />
                                    </TabsContent>
                                </div>
                            </CardContent>
                        </Tabs>
                    </Card>
                </div>
            </div>
        </>
    );
}
