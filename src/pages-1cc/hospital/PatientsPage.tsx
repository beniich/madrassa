import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui-1cc/card";
import { Input } from "@/components/ui-1cc/input";
import { Button } from "@/components/ui-1cc/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui-1cc/table";
import { Badge } from "@/components/ui-1cc/badge";
import { Search, Plus, Filter, FileText } from "lucide-react";
import { useHospitalStore } from "@/stores/useHospitalStore";
import { useState } from "react";

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui-1cc/sheet";
import { PatientForm } from "@/components/patients/PatientForm";
import { PatientRiskBadge, calculateRiskScore } from "@/components/patients/PatientRiskBadge";

const PatientsPage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const patients = useHospitalStore((state) => state.patients);

    const filteredPatients = patients.filter(patient =>
        patient.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.first_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <div className="space-y-8 animate-fade-in">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                            Gestion des Patients
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            {patients.length} dossiers actifs
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" className="gap-2">
                            <Filter className="h-4 w-4" />
                            Filtres
                        </Button>
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button className="gap-2 shadow-lg shadow-primary/20">
                                    <Plus className="h-4 w-4" />
                                    Nouveau Patient
                                </Button>
                            </SheetTrigger>
                            <SheetContent className="min-w-[400px] md:min-w-[600px] overflow-y-auto">
                                <SheetHeader className="mb-6">
                                    <SheetTitle>Nouveau Dossier Patient</SheetTitle>
                                    <SheetDescription>
                                        Remplissez les informations ci-dessous pour créer un nouveau dossier médical.
                                        Tous les champs marqués d'une astérisque (*) sont obligatoires.
                                    </SheetDescription>
                                </SheetHeader>
                                <PatientForm onSuccess={() => { document.dispatchEvent(new KeyboardEvent('keydown', { 'key': 'Escape' })); }} />
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>

                {/* Search & Actions */}
                <Card className="glass-card">
                    <CardContent className="p-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Rechercher par nom, dossier ou numéro de sécurité sociale..."
                                className="pl-10 bg-background/50 border-input/50 focus:bg-background transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Patients Table */}
                <Card className="glass-card overflow-hidden">
                    <CardHeader className="border-b border-border/50 bg-muted/20">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <FileText className="h-5 w-5 text-primary" />
                            Liste des Dossiers
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent">
                                    <TableHead>Patient</TableHead>
                                    <TableHead>Risque</TableHead>
                                    <TableHead>Statut</TableHead>
                                    <TableHead>Dernière Visite</TableHead>
                                    <TableHead>Diagnostic / Motif</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredPatients.map((patient) => (
                                    <TableRow key={patient.id} className="hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => window.location.href = `/patients/${patient.id}`}>
                                        <TableCell>
                                            <div className="font-medium">{patient.first_name} {patient.last_name}</div>
                                            <div className="text-xs text-muted-foreground">{patient.dob} ({patient.gender})</div>
                                        </TableCell>
                                        <TableCell>
                                            <PatientRiskBadge risk={patient.riskScore || calculateRiskScore(patient)} size="sm" />
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={
                                                patient.status === 'admitted' ? 'default' :
                                                    patient.status === 'outpatient' ? 'secondary' : 'outline'
                                            }>
                                                {patient.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{new Date(patient.last_visit).toLocaleDateString()}</TableCell>
                                        <TableCell>{patient.diagnosis}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); window.location.href = `/patients/${patient.id}`; }}>
                                                Voir Dossier
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </>
    );
};

export default PatientsPage;
