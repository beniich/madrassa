import { create } from 'zustand';

// --- Types ---

export type InvoiceStatus = 'draft' | 'pending' | 'paid' | 'overdue' | 'cancelled';

export interface InvoiceItem {
    id: string;
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
}

export interface InvoiceDesign {
    logo?: string; // Data URL or URL
    primaryColor?: string;
    fontFamily?: string;
    showLogo?: boolean;
    companyName?: string;
    companyAddress?: string;
    companyDetails?: string; // Siret, etc.
}

export interface Invoice {
    id: string;
    number: string; // INV-2024-001
    patientId: string;
    patientName: string;
    date: string; // ISO Date
    dueDate: string; // ISO Date
    status: InvoiceStatus;
    items: InvoiceItem[];
    subtotal: number;
    taxRate: number; // 20% = 0.2
    taxAmount: number;
    total: number;
    notes?: string;

    // Customization
    design?: InvoiceDesign;
    signature?: string | null; // Data URL
}

export interface FinanceState {
    invoices: Invoice[];

    // Actions
    addInvoice: (invoice: Omit<Invoice, 'id' | 'number'>) => void;
    updateInvoice: (id: string, updates: Partial<Invoice>) => void;
    deleteInvoice: (id: string) => void;
    markAsPaid: (id: string) => void;

    // Stats Calculators
    getTotalRevenue: () => number;
    getOutstandingAmount: () => number;
}

// --- Mock Data ---

const mockInvoices: Invoice[] = [
    {
        id: '1',
        number: 'INV-2024-001',
        patientId: 'pat-1',
        patientName: 'Gregory House',
        date: '2024-12-10',
        dueDate: '2024-12-24',
        status: 'paid',
        items: [
            { id: 'item-1', description: 'Consultation Diagnostique', quantity: 1, unitPrice: 150, total: 150 }
        ],
        subtotal: 150,
        taxRate: 0.2,
        taxAmount: 30,
        total: 180
    },
    {
        id: '2',
        number: 'INV-2024-002',
        patientId: 'pat-2',
        patientName: 'Lisa Cuddy',
        date: '2024-12-16',
        dueDate: '2024-12-30',
        status: 'pending',
        items: [
            { id: 'item-2', description: 'IRM Cérébrale', quantity: 1, unitPrice: 450, total: 450 },
            { id: 'item-3', description: 'Chambre (Journée)', quantity: 2, unitPrice: 100, total: 200 }
        ],
        subtotal: 650,
        taxRate: 0.2,
        taxAmount: 130,
        total: 780
    }
];

// --- Store ---

export const useFinanceStore = create<FinanceState>((set, get) => ({
    invoices: mockInvoices,

    addInvoice: (invoiceData) => set((state) => {
        const nextId = (state.invoices.length + 1).toString().padStart(3, '0');
        const newInvoice: Invoice = {
            ...invoiceData,
            id: `inv-${Date.now()}`,
            number: `INV-2024-${nextId}`
        };
        return { invoices: [newInvoice, ...state.invoices] };
    }),

    updateInvoice: (id, updates) => set((state) => ({
        invoices: state.invoices.map(inv => inv.id === id ? { ...inv, ...updates } : inv)
    })),

    deleteInvoice: (id) => set((state) => ({
        invoices: state.invoices.filter(inv => inv.id !== id)
    })),

    markAsPaid: (id) => set((state) => ({
        invoices: state.invoices.map(inv => inv.id === id ? { ...inv, status: 'paid' } : inv)
    })),

    getTotalRevenue: () => {
        return get().invoices
            .filter(inv => inv.status === 'paid')
            .reduce((sum, inv) => sum + inv.total, 0);
    },

    getOutstandingAmount: () => {
        return get().invoices
            .filter(inv => inv.status === 'pending' || inv.status === 'overdue')
            .reduce((sum, inv) => sum + inv.total, 0);
    }
}));
