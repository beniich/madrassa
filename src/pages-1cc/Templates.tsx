import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '../components/ui/GlassCard';

interface Template {
    id: string;
    name: string;
    description?: string;
    category?: string;
    nodes: any[];
}

export default function Templates() {
    const [templates, setTemplates] = useState<Template[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('/templates')
            .then((res) => res.json())
            .then(setTemplates)
            .catch((e) => console.error('Failed to load templates', e));
    }, []);

    const handleCreate = (template: Template) => {
        // For now we simply navigate to the workflow editor with the template data in state
        navigate('/workflow-editor', { state: { template } });
    };

    return (
        <div className="p-8 min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 text-white">
            <h1 className="text-3xl font-bold mb-6">Templates Library</h1>
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {templates.map((t) => (
                    <GlassCard key={t.id}>
                        <div className="flex flex-col h-full">
                            <h2 className="text-xl font-semibold mb-2 text-indigo-200">{t.name}</h2>
                            {t.category && (
                                <span className="text-sm text-purple-300 mb-2">{t.category}</span>
                            )}
                            {t.description && (
                                <p className="text-sm text-gray-300 flex-grow mb-4">{t.description}</p>
                            )}
                            <button
                                className="mt-auto bg-indigo-600 hover:bg-indigo-500 text-sm py-2 rounded"
                                onClick={() => handleCreate(t)}
                            >
                                Créer à partir de ce template
                            </button>
                        </div>
                    </GlassCard>
                ))}
            </div>
        </div>
    );
}
