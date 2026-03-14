
import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { RecordView } from '@/components/engine/RecordView';
import { TableView } from '@/components/engine/TableView';
import { useEngineStore } from '@/stores/useEngineStore';
import { Button } from '@/components/ui-1cc/button';
import { ArrowLeft, LayoutPanelLeft, List, Settings2, Share2, MoreHorizontal, Plus } from 'lucide-react';
import { Separator } from '@/components/ui-1cc/separator';
import { RecordPage } from '@/types/engine';

const UniversalPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const recordId = searchParams.get('record');
    const navigate = useNavigate();

    // Custom hook usage
    const database = useEngineStore(state => state.getDatabase('db_deals_001'));
    const allRecords = useEngineStore(state => state.records);
    const record = recordId ? allRecords[recordId] : null;
    const updateRecord = useEngineStore(state => state.updateRecord);
    const addRecord = useEngineStore(state => state.addRecord);

    if (!database) return <div className="p-8">Loading Database...</div>;

    const handleUpdateRecord = (updates: Partial<RecordPage>) => {
        if (recordId) {
            updateRecord(recordId, updates);
        }
    };

    const handleAddRecord = () => {
        const newId = `rec_${Date.now()}`;
        const newRecord: RecordPage = {
            id: newId,
            databaseId: database.id,
            icon: '📄',
            blocks: [],
            createdTime: new Date().toISOString(),
            lastEditedTime: new Date().toISOString(),
            properties: {
                name: 'Untitled',
                status: 'New Lead'
            }
        };
        addRecord(newRecord);
        navigate(`/universal?record=${newId}`);
    };

    // VIEW: RECORD DETAIL
    if (recordId && record) {
        return (
            <>
                <div className="h-full flex flex-col">
                    {/* Top Navbar for Record */}
                    <div className="h-12 border-b flex items-center px-4 justify-between bg-white dark:bg-[#191919] z-10">
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" onClick={() => setSearchParams({})} className="h-8 gap-1 text-muted-foreground hover:text-foreground">
                                <ArrowLeft className="h-4 w-4" />
                                Back to {database.name}
                            </Button>
                            <Separator orientation="vertical" className="h-4 mx-2" />
                            <div className="flex items-center gap-2 text-sm text-foreground">
                                <span>{record.icon}</span>
                                <span className="font-medium truncate max-w-[200px]">{String(record.properties.name || '')}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8"><Share2 className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                        </div>
                    </div>

                    {/* The Content */}
                    <div className="flex-1 overflow-hidden">
                        <RecordView
                            record={record}
                            propertiesSchema={database.properties}
                            onUpdate={handleUpdateRecord}
                        />
                    </div>
                </div>
            </>
        );
    }

    // VIEW: DATABASE (TABLE)
    return (
        <>
            <div className="h-full flex flex-col bg-slate-50/50 dark:bg-black/20 p-6 space-y-6">

                {/* Header */}
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 text-3xl flex items-center justify-center bg-white dark:bg-white/5 rounded-lg border shadow-sm">
                            {database.icon}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">{database.name}</h1>
                            <p className="text-slate-500 dark:text-slate-400 text-sm">{database.description}</p>
                        </div>
                    </div>

                    {/* Toolbar */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 bg-white dark:bg-white/5 p-1 rounded-md border text-sm">
                            <Button variant="ghost" size="sm" className="h-7 px-3 bg-slate-100 dark:bg-slate-800 shadow-sm text-foreground">
                                <List className="h-3.5 w-3.5 mr-2" /> Table
                            </Button>
                            <Button variant="ghost" size="sm" className="h-7 px-3 text-muted-foreground hover:text-foreground">
                                <LayoutPanelLeft className="h-3.5 w-3.5 mr-2" /> Board
                            </Button>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" className="h-8 gap-2">
                                <Settings2 className="h-3.5 w-3.5" /> Properties
                            </Button>
                            <Button size="sm" onClick={handleAddRecord} className="h-8 bg-blue-600 hover:bg-blue-700 text-white gap-2">
                                <Plus className="h-4 w-4" /> New Deal
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Database Content */}
                <div className="flex-1 overflow-auto rounded-lg border shadow-sm bg-white dark:bg-[#191919]">
                    <TableView databaseId={database.id} />
                </div>

            </div>
        </>
    );
};

export default UniversalPage;
