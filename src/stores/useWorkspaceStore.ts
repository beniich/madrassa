import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type WorkspaceType = 'clinic' | 'hospital' | 'private_practice' | 'dental' | 'other';

export interface Team {
    id: string;
    name: string;
    description?: string;
    color: string; // Tail direction for visuals (e.g., "bg-blue-500")
    members: string[]; // User IDs
    icon?: string;
}

export interface Workspace {
    id: string;
    name: string;
    type: WorkspaceType;
    logo?: string;
    teams: Team[];
    users: string[]; // User IDs belonging to this workspace
    settings: {
        theme?: string;
        language?: string;
        features_enabled?: string[];
    };
}

interface WorkspaceState {
    workspaces: Workspace[];
    activeWorkspaceId: string | null;

    // Actions
    setActiveWorkspace: (id: string) => void;
    addWorkspace: (workspace: Omit<Workspace, 'id' | 'teams' | 'users'>) => void;
    updateWorkspace: (id: string, updates: Partial<Workspace>) => void;

    // Team Actions
    addTeam: (workspaceId: string, team: Omit<Team, 'id'>) => void;
    updateTeam: (workspaceId: string, teamId: string, updates: Partial<Team>) => void;
    removeTeam: (workspaceId: string, teamId: string) => void;

    // Selectors
    getActiveWorkspace: () => Workspace | undefined;
    getWorkspaceTeams: (workspaceId?: string) => Team[];
}

const INITIAL_WORKSPACES: Workspace[] = [
    {
        id: 'ws-001',
        name: 'Clinique Pasteur',
        type: 'clinic',
        logo: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=200&h=200&fit=crop',
        users: ['user-001', 'user-002'],
        settings: {},
        teams: [
            { id: 't-001', name: 'Chirurgie', color: '#3b82f6', members: ['user-001'], icon: 'Scalpel' }, // blue
            { id: 't-002', name: 'Urgences', color: '#ef4444', members: ['user-002'], icon: 'Siren' }, // red
            { id: 't-003', name: 'Administration', color: '#64748b', members: ['user-001'], icon: 'Building' }, // slate
        ]
    },
    {
        id: 'ws-002',
        name: 'Cabinet Dr. House',
        type: 'private_practice',
        users: ['user-001'],
        settings: {},
        teams: [
            { id: 't-004', name: 'Medical', color: '#10b981', members: ['user-001'], icon: 'Stethoscope' }, // green
            { id: 't-005', name: 'Secretariat', color: '#f59e0b', members: ['user-002'], icon: 'Phone' }, // amber
        ]
    }
];

export const useWorkspaceStore = create<WorkspaceState>()(
    persist(
        (set, get) => ({
            workspaces: INITIAL_WORKSPACES,
            activeWorkspaceId: 'ws-001',

            setActiveWorkspace: (id) => set({ activeWorkspaceId: id }),

            addWorkspace: (data) => {
                const newWorkspace: Workspace = {
                    ...data,
                    id: `ws-${Date.now()}`,
                    teams: [],
                    users: [],
                    settings: {}
                };
                set(state => ({ workspaces: [...state.workspaces, newWorkspace] }));
            },

            updateWorkspace: (id, updates) => {
                set(state => ({
                    workspaces: state.workspaces.map(w =>
                        w.id === id ? { ...w, ...updates } : w
                    )
                }));
            },

            addTeam: (workspaceId, teamData) => {
                set(state => ({
                    workspaces: state.workspaces.map(w => {
                        if (w.id !== workspaceId) return w;
                        const newTeam: Team = {
                            ...teamData,
                            id: `t-${Date.now()}`,
                            members: []
                        };
                        return { ...w, teams: [...w.teams, newTeam] };
                    })
                }));
            },

            updateTeam: (workspaceId, teamId, updates) => {
                set(state => ({
                    workspaces: state.workspaces.map(w => {
                        if (w.id !== workspaceId) return w;
                        return {
                            ...w,
                            teams: w.teams.map(t =>
                                t.id === teamId ? { ...t, ...updates } : t
                            )
                        };
                    })
                }));
            },

            removeTeam: (workspaceId, teamId) => {
                set(state => ({
                    workspaces: state.workspaces.map(w => {
                        if (w.id !== workspaceId) return w;
                        return {
                            ...w,
                            teams: w.teams.filter(t => t.id !== teamId)
                        };
                    })
                }));
            },

            getActiveWorkspace: () => {
                const { workspaces, activeWorkspaceId } = get();
                return workspaces.find(w => w.id === activeWorkspaceId);
            },

            getWorkspaceTeams: (workspaceId) => {
                const { workspaces, activeWorkspaceId } = get();
                const targetId = workspaceId || activeWorkspaceId;
                const workspace = workspaces.find(w => w.id === targetId);
                return workspace?.teams || [];
            }
        }),
        {
            name: 'medflow-workspace-storage',
        }
    )
);
