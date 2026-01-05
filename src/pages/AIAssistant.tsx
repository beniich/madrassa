import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Bot,
    Send,
    Sparkles,
    BrainCircuit,
    History,
    User,
    AlertCircle,
    Lightbulb,
    Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";

const AIAssistantPage = () => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([
        { role: 'assistant', content: `Bonjour ${user?.firstName}, je suis votre assistant IA. Comment puis-je vous aider dans la gestion de l'établissement aujourd'hui ?`, type: 'text' }
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);

    const handleSend = () => {
        if (!input.trim()) return;

        const userMsg = { role: 'user', content: input, type: 'text' };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setIsTyping(true);

        // Mock AI Response
        setTimeout(() => {
            const aiResponse = {
                role: 'assistant',
                content: "Analyse des données locales terminée. J'ai remarqué une baisse de 15% de l'assiduité dans la classe de 4ème B cette semaine. Souhaitez-vous que je génère un rapport détaillé pour la direction ?",
                type: 'insight'
            };
            setMessages(prev => [...prev, aiResponse]);
            setIsTyping(false);
        }, 1500);
    };

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] max-w-5xl mx-auto gap-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                        <Bot className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold">Assistant IA</h1>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Sparkles className="h-3 w-3 text-accent" />
                            Mode Analyse Local Activé
                        </p>
                    </div>
                </div>
                <Button variant="outline" size="sm" className="gap-2">
                    <History className="h-4 w-4" />
                    Historique
                </Button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 p-4 rounded-2xl border bg-card/50 backdrop-blur-sm">
                {messages.map((msg, i) => (
                    <div key={i} className={cn(
                        "flex gap-3 max-w-[85%]",
                        msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
                    )}>
                        <div className={cn(
                            "h-8 w-8 rounded-full flex items-center justify-center shrink-0 border",
                            msg.role === 'assistant' ? "bg-primary/10 border-primary/20" : "bg-muted border-border"
                        )}>
                            {msg.role === 'assistant' ? <Bot className="h-4 w-4 text-primary" /> : <User className="h-4 w-4" />}
                        </div>
                        <div className={cn(
                            "p-4 rounded-2xl shadow-sm",
                            msg.role === 'user' ? "bg-primary text-primary-foreground" : "bg-card border"
                        )}>
                            {msg.type === 'insight' && (
                                <div className="flex items-center gap-2 mb-2 text-primary text-xs font-bold uppercase tracking-wider">
                                    <BrainCircuit className="h-3 w-3" />
                                    Insight Détecté
                                </div>
                            )}
                            <p className="text-sm leading-relaxed">{msg.content}</p>
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="flex gap-3 max-w-[85%]">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                            <Loader2 className="h-4 w-4 text-primary animate-spin" />
                        </div>
                        <div className="p-4 rounded-2xl bg-card border">
                            <div className="flex gap-1">
                                <span className="h-1.5 w-1.5 bg-muted-foreground/40 rounded-full animate-bounce" />
                                <span className="h-1.5 w-1.5 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:0.2s]" />
                                <span className="h-1.5 w-1.5 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:0.4s]" />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="relative">
                <Input
                    className="pr-12 py-6 rounded-2xl shadow-lg border-primary/20 focus-visible:ring-primary"
                    placeholder="Demandez n'importe quoi sur les élèves, les performances ou l'assiduité..."
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                />
                <Button
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-xl"
                    size="icon"
                    onClick={handleSend}
                >
                    <Send className="h-4 w-4" />
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <button className="flex flex-col items-start p-3 rounded-xl border bg-card hover:border-primary/50 transition-colors text-left group">
                    <AlertCircle className="h-4 w-4 text-destructive mb-2" />
                    <span className="text-xs font-semibold group-hover:text-primary transition-colors">Alertes prioritaires</span>
                    <span className="text-[10px] text-muted-foreground">Élèves à risque d'exclusion</span>
                </button>
                <button className="flex flex-col items-start p-3 rounded-xl border bg-card hover:border-primary/50 transition-colors text-left group">
                    <Lightbulb className="h-4 w-4 text-accent mb-2" />
                    <span className="text-xs font-semibold group-hover:text-primary transition-colors">Optimiser l'emploi du temps</span>
                    <span className="text-[10px] text-muted-foreground">Analyse des chevauchements</span>
                </button>
                <button className="flex flex-col items-start p-3 rounded-xl border bg-card hover:border-primary/50 transition-colors text-left group">
                    <BrainCircuit className="h-4 w-4 text-primary mb-2" />
                    <span className="text-xs font-semibold group-hover:text-primary transition-colors">Prédire les résultats</span>
                    <span className="text-[10px] text-muted-foreground">Basé sur les notes actuelles</span>
                </button>
            </div>
        </div>
    );
};

export default AIAssistantPage;
