
import { useState, useRef, useEffect } from "react";
import {
  X,
  Send,
  Bot,
  Sparkles,
  FileText,
  Users,
  Clock,
  BarChart3,
  Zap,
  ShieldCheck,
  User,
  History,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { usePaneContext } from "./OutlookLayout";
import { aiService } from "@/services/aiService";
import { AIContext, CopilotMessage } from "@/types/school-365";
import { useAuth } from "@/contexts/AuthContext";

const quickActions = [
  { icon: Users, label: "Résumer la classe 4B", action: "summarize_class" },
  { icon: FileText, label: "Générer un exercice (Maths)", action: "generate_exercise" },
  { icon: Clock, label: "Analyser absences semaine", action: "analyze_absences" },
  { icon: BarChart3, label: "Rédiger bulletin", action: "write_report" },
];

const CopilotPanel = () => {
  const { isCopilotOpen, setIsCopilotOpen, selectedItem } = usePaneContext();
  const { user } = useAuth();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<CopilotMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Bonjour ! Je suis votre Copilot Scolaire 365. Comment puis-je vous assister aujourd'hui ?",
      timestamp: new Date().toISOString()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    const scrollContainer = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]');
    if (scrollContainer) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (text: string = input) => {
    if (!text.trim() || isLoading) return;

    const userMsg: CopilotMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    const context: AIContext = {
      userRole: (user?.role?.toUpperCase() as any) || 'TEACHER',
      schoolYear: '2025-2026',
      subject: 'Mathématiques',
      studentId: selectedItem?.id
    };

    try {
      const response = await aiService.askCopilot(text, context);
      const aiMsg: CopilotMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.answer,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      setMessages(prev => [...prev, {
        id: 'error',
        role: 'assistant',
        content: "Désolé, j'ai rencontré une erreur lors du traitement de votre demande.",
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={cn(
        "h-full bg-card border-l border-border flex flex-col transition-all duration-300 ease-in-out shadow-2xl relative z-40",
        isCopilotOpen ? "w-[400px]" : "w-0 overflow-hidden border-none"
      )}
    >
      {/* Header Premium */}
      <div className="h-14 px-4 flex items-center justify-between border-b border-border bg-gradient-to-r from-blue-600/10 via-purple-600/5 to-transparent">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-md">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <span className="font-bold text-sm bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              School Copilot
            </span>
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-semibold uppercase tracking-tighter">
              <ShieldCheck className="h-3 w-3 text-green-500" />
              Intelligence Sécurisée
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          onClick={() => setIsCopilotOpen(false)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Context Banner - Dynamic based on selection */}
      {selectedItem && (
        <div className="px-4 py-3 bg-blue-50/50 dark:bg-blue-900/20 border-b border-border animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-2">
            <div className="p-1 px-2 rounded-md bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase">
              Focus
            </div>
            <p className="text-sm font-medium truncate text-blue-700 dark:text-blue-300">
              {selectedItem.name || selectedItem.firstName + " " + selectedItem.lastName}
            </p>
          </div>
        </div>
      )}

      {/* Messages Area */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 px-4 py-6">
        <div className="space-y-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300",
                msg.role === "user" ? "flex-row-reverse" : "flex-row"
              )}
            >
              <div
                className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm",
                  msg.role === "user"
                    ? "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                    : "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                )}
              >
                {msg.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>

              <div
                className={cn(
                  "max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed",
                  msg.role === "user"
                    ? "bg-blue-600 text-white rounded-tr-none shadow-blue-200 dark:shadow-none shadow-lg"
                    : "bg-muted/70 backdrop-blur-sm border border-border rounded-tl-none"
                )}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 animate-pulse">
              <div className="h-8 w-8 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                <Bot className="h-4 w-4 text-blue-400" />
              </div>
              <div className="bg-muted/70 p-3 px-4 rounded-2xl rounded-tl-none border border-border">
                <div className="flex gap-1.5 h-4 items-center">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Start Guide if no history */}
        {messages.length === 1 && !isLoading && (
          <div className="mt-8 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest px-2">
              <Zap className="h-3 w-3 text-yellow-500" />
              Actions Rapides
            </div>
            <div className="grid grid-cols-1 gap-2">
              {quickActions.map((action) => (
                <button
                  key={action.action}
                  className="group flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-850 border border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-900/50 text-left transition-all hover:shadow-md"
                  onClick={() => handleSend(action.label)}
                >
                  <div className="h-8 w-8 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center border border-slate-100 dark:border-slate-700 group-hover:scale-110 transition-transform">
                    <action.icon className="h-4 w-4 text-blue-500" />
                  </div>
                  <span className="text-sm font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {action.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </ScrollArea>

      {/* Input Area Premium */}
      <div className="p-4 bg-background border-t border-border">
        <div className="relative group">
          <textarea
            placeholder="Interrogez le Copilot sur vos classes, documents..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            className="w-full bg-muted/30 hover:bg-muted/50 focus:bg-background border border-border rounded-xl py-3.5 pl-4 pr-12 text-sm transition-all outline-none ring-0 focus:ring-2 focus:ring-blue-500/20 min-h-[50px] max-h-[150px] resize-none"
            rows={2}
          />
          <Button
            size="icon"
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className={cn(
              "absolute right-2 bottom-2 h-9 w-9 rounded-lg transition-all",
              input.trim() ? "bg-blue-600 hover:bg-blue-700 scale-100" : "bg-muted text-muted-foreground scale-95 opacity-50"
            )}
          >
            <Send className="h-4.5 w-4.5" />
          </Button>
        </div>
        <div className="mt-3 flex items-center justify-between px-1">
          <div className="flex gap-2">
            <button className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors" title="Historique">
              <History className="h-4 w-4" />
            </button>
            <button className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors" title="A propos de la confidentialité">
              <Info className="h-4 w-4" />
            </button>
          </div>
          <span className="text-[10px] text-muted-foreground font-medium italic">
            Propulsé par SchoolGraph AI
          </span>
        </div>
      </div>
    </div>
  );
};

export default CopilotPanel;
