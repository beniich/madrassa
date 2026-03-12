import { useState, useMemo, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, ModuleRegistry, ClientSideRowModelModule } from 'ag-grid-community';
import { Button } from '@/components/ui/button';
import { Plus, Save, Download, BarChart3, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { AIChat } from './AIChat';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

ModuleRegistry.registerModules([ClientSideRowModelModule]);

interface RowData {
    id: number;
    nom: string;
    prenom: string;
    mat1: number;
    mat2: number;
    mat3: number;
    moyenne: number;
    [key: string]: string | number;
}

const AI_SUGGESTIONS = [
    "Génère un emploi du temps pour une semaine",
    "Crée un tableau de suivi de présences",
    "Génère un budget mensuel",
    "Tableau de notes avec moyennes"
];

export const SpreadsheetAI = () => {
    const [rowData, setRowData] = useState<RowData[]>([]);
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const [columnDefs, setColumnDefs] = useState<ColDef[]>([
        { field: 'id', headerName: 'ID', editable: false, width: 80 },
        { field: 'nom', headerName: 'Nom', editable: true },
        { field: 'prenom', headerName: 'Prénom', editable: true },
        { field: 'mat1', headerName: 'Matière 1', editable: true },
        { field: 'mat2', headerName: 'Matière 2', editable: true },
        { field: 'mat3', headerName: 'Matière 3', editable: true },
        { field: 'moyenne', headerName: 'Moyenne', editable: false }
    ]);

    useEffect(() => {
        loadSpreadsheet();
    }, []);

    const defaultColDef = useMemo<ColDef>(() => ({
        flex: 1,
        minWidth: 100,
        resizable: true,
        sortable: true,
        filter: true,
    }), []);

    const generateWithAI = () => {
        if (!prompt) {
            toast.error('Veuillez entrer une instruction !');
            return;
        }

        setLoading(true);

        setTimeout(() => {
            const students: RowData[] = [
                { id: 1, nom: "Dupont", prenom: "Jean", mat1: 15, mat2: 12, mat3: 14, moyenne: 13.67 },
                { id: 2, nom: "Martin", prenom: "Sophie", mat1: 16, mat2: 17, mat3: 15, moyenne: 16 },
                { id: 3, nom: "Bernard", prenom: "Luc", mat1: 12, mat2: 13, mat3: 11, moyenne: 12 },
                { id: 4, nom: "Dubois", prenom: "Marie", mat1: 18, mat2: 19, mat3: 17, moyenne: 18 },
                { id: 5, nom: "Thomas", prenom: "Pierre", mat1: 14, mat2: 15, mat3: 13, moyenne: 14 }
            ];

            setRowData(students);
            setLoading(false);
            toast.success('✅ Tableau généré par l\'IA !');
        }, 2000);
    };

    const addRow = () => {
        const newId = rowData.length + 1;
        setRowData([...rowData, {
            id: newId,
            nom: "",
            prenom: "",
            mat1: 0,
            mat2: 0,
            mat3: 0,
            moyenne: 0
        }]);
    };

    const saveSpreadsheet = () => {
        localStorage.setItem('ai_spreadsheet_data', JSON.stringify(rowData));
        localStorage.setItem('ai_spreadsheet_columns', JSON.stringify(columnDefs));
        toast.success('💾 Tableur sauvegardé !');
    };

    const loadSpreadsheet = () => {
        const savedData = localStorage.getItem('ai_spreadsheet_data');
        const savedCols = localStorage.getItem('ai_spreadsheet_columns');

        if (savedData) setRowData(JSON.parse(savedData));
        if (savedCols) setColumnDefs(JSON.parse(savedCols));
    };

    const exportCSV = () => {
        let csv = columnDefs.map(col => col.headerName).join(',') + '\n';
        rowData.forEach(row => {
            csv += columnDefs.map(col => row[col.field as string] || '').join(',') + '\n';
        });

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `tableur-${Date.now()}.csv`;
        a.click();
        toast.success('📥 Export réussi !');
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                {/* AI Panel */}
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-white shadow-xl">
                    <div className="flex items-center gap-2 mb-4">
                        <Sparkles className="w-5 h-5" />
                        <h3 className="font-bold text-lg">Assistant IA - Tableur</h3>
                    </div>

                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Ex: Génère un tableau de notes pour 5 élèves avec 3 matières et calcule les moyennes"
                        className="w-full px-4 py-3 rounded-lg bg-white/10 border-2 border-white/30 text-white placeholder-white/60 backdrop-blur-lg focus:outline-none focus:border-white/50 resize-none"
                        rows={2}
                    />

                    <div className="flex gap-2 mt-4">
                        <Button
                            onClick={generateWithAI}
                            disabled={loading}
                            className="flex-1 bg-white text-purple-600 hover:bg-gray-100 font-semibold"
                        >
                            {loading ? '⏳ Génération...' : '✨ Générer avec IA'}
                        </Button>
                        <Button className="bg-white/20 hover:bg-white/30 backdrop-blur-lg">
                            🔍 Analyser
                        </Button>
                        <Button className="bg-white/20 hover:bg-white/30 backdrop-blur-lg">
                            <BarChart3 className="w-4 h-4" />
                        </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-4">
                        {AI_SUGGESTIONS.map((suggestion, idx) => (
                            <button
                                key={idx}
                                onClick={() => setPrompt(suggestion)}
                                className="px-3 py-2 rounded-full bg-white/20 border border-white/30 text-sm hover:bg-white/30 transition-all backdrop-blur-lg"
                            >
                                {suggestion.slice(0, 25)}...
                            </button>
                        ))}
                    </div>
                </div>

                {/* Toolbar */}
                <div className="flex flex-wrap gap-2">
                    <Button onClick={addRow} variant="outline" className="gap-2">
                        <Plus className="w-4 h-4" /> Ajouter ligne
                    </Button>
                    <Button onClick={saveSpreadsheet} variant="outline" className="gap-2">
                        <Save className="w-4 h-4" /> Sauvegarder
                    </Button>
                    <Button onClick={exportCSV} variant="outline" className="gap-2">
                        <Download className="w-4 h-4" /> Export CSV
                    </Button>
                </div>

                {/* Grid */}
                <div className="ag-theme-alpine rounded-xl overflow-hidden shadow-lg" style={{ height: 500 }}>
                    <AgGridReact
                        rowData={rowData}
                        columnDefs={columnDefs}
                        defaultColDef={defaultColDef}
                        onCellValueChanged={(event) => {
                            const updatedData = [...rowData];
                            updatedData[event.node.rowIndex!] = event.data;
                            setRowData(updatedData);
                        }}
                    />
                </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
                {/* Stats */}
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-white text-center shadow-xl">
                    <h3 className="text-4xl font-bold">{rowData.length}</h3>
                    <p className="opacity-90 mt-1">Lignes totales</p>
                </div>

                <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-white text-center shadow-xl">
                    <h3 className="text-4xl font-bold">{columnDefs.length}</h3>
                    <p className="opacity-90 mt-1">Colonnes</p>
                </div>

                {/* Chat */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-lg">
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-3 font-semibold">
                        💬 Chat IA Tableur
                    </div>
                    <div className="p-4">
                        <AIChat
                            initialMessage="👋 Je peux vous aider à créer et analyser vos tableurs !"
                            placeholder="Posez une question..."
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
