
import { create } from 'zustand';
import { Database, RecordPage, Block, DatabaseView } from '@/types/engine';
import { v4 as uuidv4 } from 'uuid'; // Assuming uuid is available or using a simple generator

// Simple ID generator if uuid is not available
const generateId = () => Math.random().toString(36).substr(2, 9);

interface EngineState {
    databases: Record<string, Database>;
    records: Record<string, RecordPage>;

    // Actions
    addDatabase: (db: Database) => void;
    updateDatabase: (id: string, updates: Partial<Database>) => void;
    addRecord: (record: RecordPage) => void;
    updateRecord: (id: string, updates: Partial<RecordPage>) => void;
    deleteRecord: (id: string) => void;

    // Getters
    getDatabase: (id: string) => Database | undefined;
    getRecordsByDatabase: (dbId: string) => RecordPage[];
}

// --- MOCK DATA ---

const MOCK_DB_ID = 'db_deals_001';

const MOCK_DB: Database = {
    id: MOCK_DB_ID,
    name: 'Sales Pipeline',
    description: 'Track all active deals and opportunities',
    icon: '💰',
    cover: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=2000',
    createdTime: new Date().toISOString(),
    lastEditedTime: new Date().toISOString(),
    views: [
        { id: 'view_table', name: 'All Deals', type: 'table' },
        { id: 'view_board', name: 'Kanban', type: 'board', groupBy: 'status' }
    ],
    properties: {
        name: { id: 'prop_name', name: 'Name', type: 'text' },
        status: {
            id: 'prop_status',
            name: 'Status',
            type: 'status',
            options: [
                { id: 'opt_new', name: 'New Lead', color: 'blue' },
                { id: 'opt_contacted', name: 'Contacted', color: 'yellow' },
                { id: 'opt_proposal', name: 'Proposal Sent', color: 'purple' },
                { id: 'opt_won', name: 'Won', color: 'green' },
                { id: 'opt_lost', name: 'Lost', color: 'red' },
            ]
        },
        value: { id: 'prop_value', name: 'Value', type: 'number' },
        assignee: { id: 'prop_assignee', name: 'Assignee', type: 'person' },
        probability: { id: 'prop_prob', name: 'Probability', type: 'number' },
        closing_date: { id: 'prop_date', name: 'Closing Date', type: 'date' },
    }
};

const MOCK_RECORDS: RecordPage[] = [
    {
        id: 'rec_001',
        databaseId: MOCK_DB_ID,
        icon: '🏢',
        createdTime: new Date().toISOString(),
        lastEditedTime: new Date().toISOString(),
        properties: {
            name: 'Acme Corp Enterprise Deal',
            status: 'Proposal Sent',
            value: 50000,
            assignee: 'Alice Smith',
            probability: 75,
            closing_date: '2024-12-15'
        },
        blocks: []
    },
    {
        id: 'rec_002',
        databaseId: MOCK_DB_ID,
        icon: '🚀',
        createdTime: new Date().toISOString(),
        lastEditedTime: new Date().toISOString(),
        properties: {
            name: 'Startup Bundle - TechFlow',
            status: 'New Lead',
            value: 12000,
            assignee: 'John Doe',
            probability: 20,
            closing_date: '2025-01-20'
        },
        blocks: []
    },
    {
        id: 'rec_003',
        databaseId: MOCK_DB_ID,
        icon: '🏭',
        createdTime: new Date().toISOString(),
        lastEditedTime: new Date().toISOString(),
        properties: {
            name: 'Global Industries Renewals',
            status: 'Won',
            value: 125000,
            assignee: 'Alice Smith',
            probability: 100,
            closing_date: '2023-11-30'
        },
        blocks: []
    },
    {
        id: 'rec_004',
        databaseId: MOCK_DB_ID,
        icon: '🏬',
        createdTime: new Date().toISOString(),
        lastEditedTime: new Date().toISOString(),
        properties: {
            name: 'Retail Chain Expansion',
            status: 'Contacted',
            value: 35000,
            assignee: 'Bob Jones',
            probability: 40,
            closing_date: '2024-02-15'
        },
        blocks: []
    }
];

export const useEngineStore = create<EngineState>((set, get) => ({
    databases: { [MOCK_DB_ID]: MOCK_DB },
    records: MOCK_RECORDS.reduce((acc, rec) => ({ ...acc, [rec.id]: rec }), {}),

    addDatabase: (db) => set((state) => ({
        databases: { ...state.databases, [db.id]: db }
    })),

    updateDatabase: (id, updates) => set((state) => ({
        databases: {
            ...state.databases,
            [id]: { ...state.databases[id], ...updates }
        }
    })),

    addRecord: (record) => set((state) => ({
        records: { ...state.records, [record.id]: record }
    })),

    updateRecord: (id, updates) => set((state) => {
        const record = state.records[id];
        if (!record) return state;
        return {
            records: {
                ...state.records,
                [id]: { ...record, ...updates, lastEditedTime: new Date().toISOString() }
            }
        };
    }),

    deleteRecord: (id) => set((state) => {
        const { [id]: _, ...rest } = state.records;
        return { records: rest };
    }),

    getDatabase: (id) => get().databases[id],

    getRecordsByDatabase: (dbId) => {
        return Object.values(get().records).filter(rec => rec.databaseId === dbId);
    }
}));
