import React from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { KanbanBoard } from '@/components/workflow/KanbanBoard';
import { useWorkflowStore } from '@/stores/useWorkflowStore';
import { useWorkspaceStore } from '@/stores/useWorkspaceStore';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui-1cc/select';
import { Button } from '@/components/ui-1cc/button';
import { Plus, Settings2 } from 'lucide-react';

export default function WorkflowPage() {
    const { activeWorkspaceId } = useWorkspaceStore();
    const { getWorkspaceWorkflows, activeWorkflowId, setActiveWorkflow } = useWorkflowStore();

    const workflows = activeWorkspaceId ? getWorkspaceWorkflows(activeWorkspaceId) : [];

    return (
        <DashboardLayout>
            <div className="h-[calc(100vh-4rem)] flex flex-col space-y-4 pb-4">
                {/* Header */}
                <div className="flex justify-between items-center px-1">
                    <div className="flex items-center gap-4">
                        <h1 className="text-2xl font-bold tracking-tight">Tableau de Bord</h1>
                        <Select value={activeWorkflowId || ''} onValueChange={setActiveWorkflow}>
                            <SelectTrigger className="w-[280px]">
                                <SelectValue placeholder="Sélectionner un workflow" />
                            </SelectTrigger>
                            <SelectContent>
                                {workflows.map(wf => (
                                    <SelectItem key={wf.id} value={wf.id}>{wf.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="gap-2">
                            <Settings2 className="h-4 w-4" /> Configurer
                        </Button>
                        <Button size="sm" className="gap-2">
                            <Plus className="h-4 w-4" /> Nouveau Workflow
                        </Button>
                    </div>
                </div>

                {/* Board Area */}
                {activeWorkflowId ? (
                    <div className="flex-1 overflow-hidden rounded-lg border bg-background/50 backdrop-blur-sm p-4">
                        <KanbanBoard workflowId={activeWorkflowId} />
                    </div>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-muted-foreground border rounded-lg border-dashed">
                        Aucun workflow sélectionné. Crtéez-en un ou sélectionnez un existant.
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
