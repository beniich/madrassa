import { useState, useEffect, useRef } from 'react';
import Reveal from 'reveal.js';
import Markdown from 'reveal.js/plugin/markdown/markdown.esm.js';
import 'reveal.js/dist/reveal.css';
import 'reveal.js/dist/theme/white.css';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Save, Sparkles, RefreshCw, Plus, Download } from 'lucide-react';
import { toast } from 'sonner';
import { AIChat } from './AIChat';

const AI_SUGGESTIONS = [
    "Cours de mathématiques",
    "Histoire de France",
    "Sciences physiques",
    "Réunion parents"
];

export const PresentationAI = () => {
    const [markdown, setMarkdown] = useState(`# Bienvenue
Votre présentation IA

---

# Slide 2
Contenu généré par l'IA`);
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const [slideCount, setSlideCount] = useState(2);
    const deckRef = useRef<any>(null);
    const revealNodeRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        loadPresentation();
    }, []);

    useEffect(() => {
        if (revealNodeRef.current && !deckRef.current) {
            deckRef.current = new Reveal(revealNodeRef.current, {
                plugins: [Markdown],
                embedded: true,
                hash: false,
                keyboard: true
            });
            deckRef.current.initialize();
        }

        return () => {
            if (deckRef.current) {
                try {
                    deckRef.current.destroy();
                    deckRef.current = null;
                } catch (e) {
                    console.warn("Reveal destroy error", e);
                }
            }
        };
    }, []);

    useEffect(() => {
        const count = (markdown.match(/---/g) || []).length + 1;
        setSlideCount(count);
    }, [markdown]);

    const generateWithAI = () => {
        if (!prompt) {
            toast.error('Veuillez entrer une instruction !');
            return;
        }

        setLoading(true);

        setTimeout(() => {
            const slides = `# ${prompt}
Introduction au sujet

---

# Plan
- Point 1
- Point 2
- Point 3

---

# Développement
Contenu détaillé avec exemples

---

# Conclusion
Résumé des points clés

---

# Questions ?
Merci de votre attention !`;

            setMarkdown(slides);
            updateSlides();
            setLoading(false);
            toast.success('✅ Présentation générée avec 5 slides !');
        }, 2000);
    };

    const addSlideAI = () => {
        const newSlide = '\n\n---\n\n# Nouvelle Slide\nContenu généré par IA';
        setMarkdown(markdown + newSlide);
        updateSlides();
        toast.success('➕ Slide ajoutée !');
    };

    const updateSlides = () => {
        if (deckRef.current) {
            try {
                deckRef.current.destroy();
                deckRef.current = null;
            } catch (e) { }

            setTimeout(() => {
                if (revealNodeRef.current) {
                    deckRef.current = new Reveal(revealNodeRef.current, {
                        plugins: [Markdown],
                        embedded: true,
                        hash: false
                    });
                    deckRef.current.initialize();
                }
            }, 100);
        }
    };

    const savePresentation = () => {
        localStorage.setItem('ai_presentation_markdown', markdown);
        toast.success('💾 Présentation sauvegardée !');
    };

    const loadPresentation = () => {
        const saved = localStorage.getItem('ai_presentation_markdown');
        if (saved) {
            setMarkdown(saved);
            updateSlides();
        }
    };

    const exportPresentation = () => {
        const blob = new Blob([markdown], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `presentation-${Date.now()}.md`;
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
                        <h3 className="font-bold text-lg">Assistant IA - Présentations</h3>
                    </div>

                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Ex: Crée une présentation sur l'histoire de France en 5 slides"
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
                        <Button onClick={addSlideAI} className="bg-white/20 hover:bg-white/30 backdrop-blur-lg">
                            <Plus className="w-4 h-4" />
                        </Button>
                        <Button className="bg-white/20 hover:bg-white/30 backdrop-blur-lg">
                            🚀 Améliorer
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

                {/* Toolbar */}
                <div className="flex flex-wrap gap-2">
                    <Button onClick={savePresentation} variant="outline" className="gap-2">
                        <Save className="w-4 h-4" /> Sauvegarder
                    </Button>
                    <Button onClick={updateSlides} variant="outline" className="gap-2">
                        <RefreshCw className="w-4 h-4" /> Actualiser
                    </Button>
                    <Button onClick={exportPresentation} variant="outline" className="gap-2">
                        <Download className="w-4 h-4" /> Export
                    </Button>
                </div>

                {/* Editor + Preview */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-semibold text-gray-700 mb-2 block">Éditeur Markdown</label>
                        <Textarea
                            value={markdown}
                            onChange={(e) => setMarkdown(e.target.value)}
                            className="font-mono text-sm resize-none h-[500px]"
                            placeholder="# Titre..."
                        />
                    </div>

                    <div>
                        <label className="text-sm font-semibold text-gray-700 mb-2 block">Aperçu</label>
                        <div className="border rounded-lg overflow-hidden bg-gray-100 h-[500px]">
                            <div className="reveal h-full w-full" ref={revealNodeRef}>
                                <div className="slides">
                                    <section data-markdown="">
                                        <textarea data-template defaultValue={markdown}></textarea>
                                    </section>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
                {/* Slide Count */}
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-white text-center shadow-xl">
                    <h3 className="text-4xl font-bold">{slideCount}</h3>
                    <p className="opacity-90 mt-1">Slides</p>
                </div>

                {/* Chat */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-lg">
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-3 font-semibold">
                        💬 Chat IA Présentation
                    </div>
                    <div className="p-4">
                        <AIChat
                            initialMessage="🎤 Je peux créer des présentations captivantes pour vous !"
                            placeholder="Posez une question..."
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
