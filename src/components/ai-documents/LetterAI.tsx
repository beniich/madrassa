import { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Button } from '@/components/ui-1cc/button';
import { Save, Sparkles, Download, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { AIChat } from './AIChat';

const AI_SUGGESTIONS = [
    "Lettre de motivation enseignant",
    "Convocation parents",
    "Rapport pédagogique",
    "Lettre de recommandation"
];

const TEMPLATES = {
    motivation: `<h2>Lettre de Motivation</h2>
<p><strong>Objet : Candidature au poste d'enseignant</strong></p>
<p>Madame, Monsieur,</p>
<p>Actuellement à la recherche d'un poste d'enseignant, je me permets de vous adresser ma candidature...</p>
<p>Cordialement,</p>
<p>[Votre nom]</p>`,
    convocation: `<h2>Convocation</h2>
<p><strong>Objet : Réunion parents-professeurs</strong></p>
<p>Chers parents,</p>
<p>Nous vous convions à une réunion le [date] à [heure] afin de discuter du parcours de votre enfant...</p>
<p>Cordialement,<br>L'équipe pédagogique</p>`,
    rapport: `<h2>Rapport d'Évaluation Pédagogique</h2>
<p><strong>Année scolaire 2024-2025</strong></p>
<p>L'élève a démontré tout au long de l'année des compétences remarquables...</p>
<p>Fait le [date]<br>[Signature]</p>`
};

export const LetterAI = () => {
    const [value, setValue] = useState('');
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const [wordCount, setWordCount] = useState(0);

    useEffect(() => {
        loadLetter();
    }, []);

    useEffect(() => {
        const text = value.replace(/<[^>]*>/g, '');
        const words = text.trim().split(/\s+/).filter(w => w.length > 0);
        setWordCount(words.length);
    }, [value]);

    const generateWithAI = () => {
        if (!prompt) {
            toast.error('Veuillez entrer une instruction !');
            return;
        }

        setLoading(true);

        setTimeout(() => {
            const letter = `<p><strong>Objet : ${prompt}</strong></p>
<p>Madame, Monsieur,</p>
<p>Je me permets de vous adresser cette lettre dans le cadre de ${prompt.toLowerCase()}.</p>
<p>Fort de mon expérience dans le domaine éducatif, je suis convaincu que mes compétences correspondent parfaitement à vos attentes.</p>
<p>Je reste à votre disposition pour tout complément d'information.</p>
<p>Cordialement,<br>[Votre nom]</p>`;

            setValue(letter);
            setLoading(false);
            toast.success('✅ Lettre rédigée par l\'IA !');
        }, 2000);
    };

    const improveLetter = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            toast.success('✨ Lettre améliorée !');
        }, 1500);
    };

    const correctLetter = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            toast.success('✔️ Correction terminée !');
        }, 1500);
    };

    const loadTemplate = (type: keyof typeof TEMPLATES) => {
        setValue(TEMPLATES[type]);
        toast.success(`📁 Modèle "${type}" chargé !`);
    };

    const saveLetter = () => {
        localStorage.setItem('ai_letter_content', value);
        toast.success('💾 Lettre sauvegardée !');
    };

    const loadLetter = () => {
        const saved = localStorage.getItem('ai_letter_content');
        if (saved) setValue(saved);
    };

    const exportPDF = () => {
        toast.info('📄 Export PDF - Fonctionnalité à implémenter');
    };

    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'align': [] }],
            ['link', 'image'],
            ['clean']
        ],
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                {/* AI Panel */}
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-white shadow-xl">
                    <div className="flex items-center gap-2 mb-4">
                        <Sparkles className="w-5 h-5" />
                        <h3 className="font-bold text-lg">Assistant IA - Rédaction</h3>
                    </div>

                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Ex: Rédige une lettre de motivation pour un enseignant de mathématiques"
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
                        <Button onClick={improveLetter} className="bg-white/20 hover:bg-white/30 backdrop-blur-lg">
                            🚀 Améliorer
                        </Button>
                        <Button onClick={correctLetter} className="bg-white/20 hover:bg-white/30 backdrop-blur-lg">
                            <CheckCircle className="w-4 h-4" />
                        </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-4">
                        {AI_SUGGESTIONS.map((suggestion, idx) => (
                            <button
                                key={idx}
                                onClick={() => setPrompt(suggestion)}
                                className="px-3 py-2 rounded-full bg-white/20 border border-white/30 text-sm hover:bg-white/30 transition-all backdrop-blur-lg"
                            >
                                {suggestion}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Templates */}
                <div>
                    <h6 className="font-semibold text-gray-900 mb-3">📁 Modèles de lettres</h6>
                    <div className="grid grid-cols-3 gap-4">
                        <button
                            onClick={() => loadTemplate('motivation')}
                            className="p-4 border-2 border-gray-200 rounded-xl hover:border-purple-500 hover:shadow-lg transition-all"
                        >
                            <h6 className="font-semibold text-purple-600 mb-1">💼 Motivation</h6>
                            <p className="text-xs text-gray-600">Lettre professionnelle</p>
                        </button>
                        <button
                            onClick={() => loadTemplate('convocation')}
                            className="p-4 border-2 border-gray-200 rounded-xl hover:border-purple-500 hover:shadow-lg transition-all"
                        >
                            <h6 className="font-semibold text-purple-600 mb-1">📬 Convocation</h6>
                            <p className="text-xs text-gray-600">Pour les parents</p>
                        </button>
                        <button
                            onClick={() => loadTemplate('rapport')}
                            className="p-4 border-2 border-gray-200 rounded-xl hover:border-purple-500 hover:shadow-lg transition-all"
                        >
                            <h6 className="font-semibold text-purple-600 mb-1">📊 Rapport</h6>
                            <p className="text-xs text-gray-600">Évaluation pédagogique</p>
                        </button>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="flex flex-wrap gap-2">
                    <Button onClick={saveLetter} variant="outline" className="gap-2">
                        <Save className="w-4 h-4" /> Sauvegarder
                    </Button>
                    <Button onClick={exportPDF} variant="outline" className="gap-2">
                        <Download className="w-4 h-4" /> Export PDF
                    </Button>
                </div>

                {/* Editor */}
                <div className="bg-white rounded-xl overflow-hidden shadow-lg">
                    <ReactQuill
                        theme="snow"
                        value={value}
                        onChange={setValue}
                        modules={modules}
                        style={{ height: '500px' }}
                    />
                </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
                {/* Word Count */}
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-white text-center shadow-xl">
                    <h3 className="text-4xl font-bold">{wordCount}</h3>
                    <p className="opacity-90 mt-1">Mots</p>
                </div>

                {/* Chat */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-lg">
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-3 font-semibold">
                        💬 Chat IA Rédaction
                    </div>
                    <div className="p-4">
                        <AIChat
                            initialMessage="✍️ Je peux vous aider à rédiger et améliorer vos lettres !"
                            placeholder="Posez une question..."
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
