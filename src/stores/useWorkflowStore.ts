import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface WorkflowTransition {
    to: string; // Step ID
    label: string; // Label of the action (e.g., "Admit Patient")
    color?: string; // Optional button color
    requiredFields?: string[]; // Fields required to transition
}

export interface WorkflowStep {
    id: string;
    name: string;
    type: 'initial' | 'in_progress' | 'done' | 'cancelled'; // Semantic type
    color: string; // Border top color for kanban column
    transitions: WorkflowTransition[];
    autoAssignTo?: string; // Team ID to auto-assign
}

export interface Workflow {
    id: string;
    name: string;
    description?: string;
    steps: WorkflowStep[];
    workspaceId: string;
}

interface WorkflowState {
    workflows: Workflow[];
    activeWorkflowId: string | null;

    // Actions
    addWorkflow: (workflow: Workflow) => void;
    updateWorkflow: (id: string, updates: Partial<Workflow>) => void;
    deleteWorkflow: (id: string) => void;
    setActiveWorkflow: (id: string) => void;

    // Helpers
    getWorkspaceWorkflows: (workspaceId: string) => Workflow[];
    getWorkflowById: (id: string) => Workflow | undefined;
}

// Initial default workflow for new workspaces
const DEFAULT_CLINIC_WORKFLOW: Workflow = {
    id: 'wf-default-clinic',
    name: 'Parcours Patient Standard',
    description: 'De l\'admission à la sortie pour une clinique standard.',
    workspaceId: 'ws-001', // Default assigned to first workspace for demo
    steps: [
        {
            id: 'step-admission',
            name: 'Admission / Accueil',
            type: 'initial',
            color: '#3b82f6', // blue
            transitions: [
                { to: 'step-triage', label: 'Envoyer au Triage' }
            ]
        },
        {
            id: 'step-triage',
            name: 'Infirmerie / Triage',
            type: 'in_progress',
            color: '#f59e0b', // amber
            transitions: [
                { to: 'step-consultation', label: 'Prêt pour Médecin' },
                { to: 'step-emergency', label: 'URGENCE', color: 'red' }
            ],
            autoAssignTo: 't-002' // Auto assign to Urgences team (example)
        },
        {
            id: 'step-consultation',
            name: 'Consultation Médecin',
            type: 'in_progress',
            color: '#10b981', // green
            transitions: [
                { to: 'step-billing', label: 'Terminer & Facturer' },
                { to: 'step-observation', label: 'Mise en Observation' }
            ]
        },
        {
            id: 'step-observation',
            name: 'Observation / Soins',
            type: 'in_progress',
            color: '#8b5cf6', // violet
            transitions: [
                { to: 'step-billing', label: 'Sortie vers Facturation' }
            ]
        },
        {
            id: 'step-billing',
            name: 'Sortie & Facturation',
            type: 'in_progress',
            color: '#ec4899', // pink
            transitions: [
                { to: 'step-done', label: 'Dossier Clôturé' }
            ]
        },
        {
            id: 'step-done',
            name: 'Terminé',
            type: 'done',
            color: '#64748b', // slate
            transitions: []
        }
    ]
};

export const useWorkflowStore = create<WorkflowState>()(
    persist(
        (set, get) => ({
            workflows: [DEFAULT_CLINIC_WORKFLOW],
            activeWorkflowId: DEFAULT_CLINIC_WORKFLOW.id,

            addWorkflow: (workflow) => set((state) => ({ workflows: [...state.workflows, workflow] })),

            updateWorkflow: (id, updates) => set((state) => ({
                workflows: state.workflows.map((w) => (w.id === id ? { ...w, ...updates } : w))
            })),

            deleteWorkflow: (id) => set((state) => ({
                workflows: state.workflows.filter((w) => w.id !== id)
            })),

            setActiveWorkflow: (id) => set({ activeWorkflowId: id }),

            getWorkspaceWorkflows: (workspaceId) => {
                return get().workflows.filter((w) => w.workspaceId === workspaceId);
            },

            getWorkflowById: (id) => {
                return get().workflows.find((w) => w.id === id);
            }
        }),
        {
            name: 'medflow-workflow-storage',
        }
    )
);
