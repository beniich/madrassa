import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui-1cc/button";
import { Card } from "@/components/ui-1cc/card";
import { Plus, Play, MoreVertical, Edit, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui-1cc/dropdown-menu";

interface Workflow {
    id: string;
    name: string;
    description: string;
    status: "active" | "inactive";
    lastRun?: string;
}

const mockWorkflows: Workflow[] = [
    {
        id: "1",
        name: "Nouveau Lead -> Email Bienvenue",
        description: "Envoie un email de bienvenue lorsqu'un lead est créé.",
        status: "active",
        lastRun: "Il y a 2h",
    },
    {
        id: "2",
        name: "Deal Gagné -> Créer Tâche",
        description: "Crée une tâche d'onboarding quand un deal passe à Gagné.",
        status: "inactive",
        lastRun: "Hier",
    },
];

const Workflows = () => {
    const navigate = useNavigate();
    const [workflows, setWorkflows] = useState<Workflow[]>(mockWorkflows);

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold">Automatisations</h1>
                        <p className="text-muted-foreground">
                            Créez et gérez vos workflows d'automatisation
                        </p>
                    </div>
                    <Button onClick={() => navigate("/workflows/new")} variant="neumorphismPrimary">
                        <Plus className="h-4 w-4 mr-2" />
                        Nouveau Workflow
                    </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {workflows.map((workflow) => (
                        <Card key={workflow.id} variant="neumorphism" className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${workflow.status === 'active' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                                    }`}>
                                    <Play className="h-5 w-5" />
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => navigate(`/workflows/${workflow.id}`)}>
                                            <Edit className="h-4 w-4 mr-2" />
                                            Editer
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="text-destructive">
                                            <Trash className="h-4 w-4 mr-2" />
                                            Supprimer
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            <h3 className="font-semibold text-lg mb-2">{workflow.name}</h3>
                            <p className="text-sm text-muted-foreground mb-4 h-10 line-clamp-2">
                                {workflow.description}
                            </p>

                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <span className={`px-2 py-1 rounded-full ${workflow.status === 'active' ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'
                                    }`}>
                                    {workflow.status === 'active' ? 'Actif' : 'Inactif'}
                                </span>
                                <span>{workflow.lastRun}</span>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Workflows;
