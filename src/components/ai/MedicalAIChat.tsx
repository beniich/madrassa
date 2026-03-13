import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui-1cc/card';
import { Button } from '@/components/ui-1cc/button';
import { Input } from '@/components/ui-1cc/input';
import { Badge } from '@/components/ui-1cc/badge';
import { ScrollArea } from '@/components/ui-1cc/scroll-area';
import {
    Bot,
    Send,
    Loader2,
    Sparkles,
    FileText,
    AlertTriangle,
    Pill,
    RefreshCw
} from 'lucide-react';
import { Patient } from '@/stores/useHospitalStore';
import { MedicalEvent } from '@/stores/usePatientTimelineStore';
import {
    askMedicalAI,
    summarizePatientRecord,
    AISummary,
    AIChatMessage
} from '@/services/aiMedical';

interface MedicalAIChatProps {
    patient?: Patient;
    events?: MedicalEvent[];
    compact?: boolean;
}

export const MedicalAIChat: React.FC<MedicalAIChatProps> = ({
    patient,
    events = [],
    compact = false
}) => {
    const [messages, setMessages] = useState<AIChatMessage[]>([
        {
            role: 'assistant',
            content: 'Bonjour ! Je suis votre assistant IA médical. Comment puis-je vous aider ?',
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [summary, setSummary] = useState<AISummary | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: AIChatMessage = {
            role: 'user',
            content: input,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await askMedicalAI(input, { patient, events });

            const assistantMessage: AIChatMessage = {
                role: 'assistant',
                content: response,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'Désolé, une erreur s\'est produite. Veuillez réessayer.',
                timestamp: new Date()
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleQuickAction = async (action: string) => {
        if (isLoading) return;

        setMessages(prev => [...prev, {
            role: 'user',
            content: action,
            timestamp: new Date()
        }]);

        setIsLoading(true);

        try {
            if (action.includes('Résumer') && patient) {
                const result = await summarizePatientRecord(patient, events);
                setSummary(result);
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: result.summary,
                    timestamp: new Date()
                }]);
            } else {
                const response = await askMedicalAI(action, { patient, events });
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: response,
                    timestamp: new Date()
                }]);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const getRiskBadge = (level: AISummary['riskLevel']) => {
        const styles = {
            low: 'bg-green-100 text-green-700',
            medium: 'bg-yellow-100 text-yellow-700',
            high: 'bg-red-100 text-red-700'
        };
        const labels = { low: 'Faible', medium: 'Moyen', high: 'Élevé' };
        return <Badge className={styles[level]}>{labels[level]}</Badge>;
    };

    if (compact) {
        return (
            <Card className="glass-card">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                        <Bot className="h-4 w-4 text-primary" />
                        Assistant IA
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <div className="flex gap-2 flex-wrap">
                        <Button
                            size="sm"
                            variant="outline"
                            className="text-xs"
                            onClick={() => handleQuickAction('Résumer le dossier')}
                            disabled={!patient || isLoading}
                        >
                            <FileText className="h-3 w-3 mr-1" />
                            Résumé
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            className="text-xs"
                            onClick={() => handleQuickAction('Vérifier les allergies')}
                            disabled={!patient || isLoading}
                        >
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Allergies
                        </Button>
                    </div>
                    {isLoading && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Loader2 className="h-3 w-3 animate-spin" />
                            Analyse en cours...
                        </div>
                    )}
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="glass-card h-full flex flex-col">
            <CardHeader className="border-b border-border/50">
                <CardTitle className="text-lg flex items-center gap-2">
                    <div className="p-2 rounded-full bg-primary/10">
                        <Bot className="h-5 w-5 text-primary" />
                    </div>
                    Assistant IA Médical
                    <Badge variant="outline" className="ml-auto text-xs">
                        <Sparkles className="h-3 w-3 mr-1" />
                        Beta
                    </Badge>
                </CardTitle>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
                {/* Quick Actions */}
                <div className="p-3 border-b border-border/50 flex gap-2 flex-wrap bg-muted/20">
                    <Button
                        size="sm"
                        variant="secondary"
                        className="text-xs gap-1"
                        onClick={() => handleQuickAction('Résumer le dossier patient')}
                        disabled={!patient || isLoading}
                    >
                        <FileText className="h-3 w-3" />
                        Résumer
                    </Button>
                    <Button
                        size="sm"
                        variant="secondary"
                        className="text-xs gap-1"
                        onClick={() => handleQuickAction('Vérifier les allergies')}
                        disabled={!patient || isLoading}
                    >
                        <AlertTriangle className="h-3 w-3" />
                        Allergies
                    </Button>
                    <Button
                        size="sm"
                        variant="secondary"
                        className="text-xs gap-1"
                        onClick={() => handleQuickAction('Suggérer une prescription')}
                        disabled={!patient || isLoading}
                    >
                        <Pill className="h-3 w-3" />
                        Prescription
                    </Button>
                    <Button
                        size="sm"
                        variant="ghost"
                        className="text-xs gap-1 ml-auto"
                        onClick={() => setMessages([{
                            role: 'assistant',
                            content: 'Conversation réinitialisée. Comment puis-je vous aider ?',
                            timestamp: new Date()
                        }])}
                    >
                        <RefreshCw className="h-3 w-3" />
                    </Button>
                </div>

                {/* Summary Card if available */}
                {summary && (
                    <div className="p-3 border-b border-border/50 bg-primary/5">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold">Analyse du Risque</span>
                            {getRiskBadge(summary.riskLevel)}
                        </div>
                        <div className="text-xs text-muted-foreground space-y-1">
                            {summary.keyPoints.slice(0, 3).map((point, i) => (
                                <div key={i} className="flex items-center gap-1">
                                    <span className="text-primary">•</span> {point}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Messages */}
                <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                    <div className="space-y-4">
                        {messages.map((msg, i) => (
                            <div
                                key={i}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] p-3 rounded-lg text-sm ${msg.role === 'user'
                                            ? 'bg-primary text-primary-foreground'
                                            : 'bg-muted'
                                        }`}
                                >
                                    <p className="whitespace-pre-wrap">{msg.content}</p>
                                    <span className="text-[10px] opacity-70 mt-1 block">
                                        {msg.timestamp.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-muted p-3 rounded-lg flex items-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <span className="text-sm">Analyse en cours...</span>
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>

                {/* Input */}
                <div className="p-3 border-t border-border/50">
                    <form
                        className="flex gap-2"
                        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                    >
                        <Input
                            placeholder={patient ? "Posez une question sur ce patient..." : "Sélectionnez un patient"}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            disabled={!patient || isLoading}
                            className="flex-1"
                        />
                        <Button
                            type="submit"
                            size="icon"
                            disabled={!input.trim() || !patient || isLoading}
                        >
                            <Send className="h-4 w-4" />
                        </Button>
                    </form>
                </div>
            </CardContent>
        </Card>
    );
};

export default MedicalAIChat;
