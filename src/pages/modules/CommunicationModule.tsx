
import { useState, useEffect } from "react";
import CenterPane from "@/components/dashboard/CenterPane";
import DetailPane from "@/components/dashboard/DetailPane";
import ListItem from "@/components/dashboard/ListItem";
import { usePaneContext } from "@/components/dashboard/OutlookLayout";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  Send,
  Users,
  Clock,
  Search,
  Star,
  Archive,
  AlertCircle,
  MoreHorizontal,
  Sparkles,
  Paperclip,
  Smile
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { messagingService } from "@/services/messagingService";
import { ChatMessage, ChatThread } from "@/types/school-365";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

const CommunicationModule = () => {
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [selectedThread, setSelectedThread] = useState<ChatThread | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const { setSelectedItem, setIsCopilotOpen } = usePaneContext();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [reply, setReply] = useState("");
  const [activeFolder, setActiveFolder] = useState<"inbox" | "urgent" | "parents" | "classes">("inbox");

  useEffect(() => {
    const fetchThreads = async () => {
      const data = await messagingService.getThreads();
      setThreads(data);
    };
    fetchThreads();
  }, []);

  useEffect(() => {
    if (selectedThread) {
      const fetchMessages = async () => {
        const data = await messagingService.getMessages(selectedThread.id);
        setMessages(data);
      };
      fetchMessages();
    }
  }, [selectedThread]);

  const handleSelectThread = (thread: ChatThread) => {
    setSelectedThread(thread);
    setSelectedItem(thread);
  };

  const handleSend = async () => {
    if (!reply.trim() || !selectedThread || !user) return;

    const newMsg = await messagingService.sendMessage(selectedThread.id, reply, {
      id: user.id,
      name: user.name || "Auteur",
      role: (user.role?.toUpperCase() as any) || "TEACHER"
    });

    setMessages(prev => [...prev, newMsg]);
    setReply("");
  };

  const folders = [
    { id: "inbox", label: "Boîte de réception", icon: MessageSquare, count: 3 },
    { id: "urgent", label: "Urgent", icon: AlertCircle, count: 1, color: "text-red-500" },
    { id: "parents", label: "Parents", icon: Users, count: 5 },
    { id: "classes", label: "Classes", icon: Clock, count: 2 },
  ];

  return (
    <div className="flex flex-1 h-full overflow-hidden">
      {/* Folder Sidebar (Outlook style) */}
      <div className="w-64 border-r border-border bg-muted/10 hidden lg:flex flex-col p-4 space-y-4">
        <Button className="w-full shadow-md bg-blue-600 hover:bg-blue-700 text-white font-semibold">
          Nouveau Message
        </Button>
        <div className="space-y-1">
          {folders.map((folder) => (
            <button
              key={folder.id}
              onClick={() => setActiveFolder(folder.id as any)}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all",
                activeFolder === folder.id
                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-semibold"
                  : "hover:bg-muted text-muted-foreground"
              )}
            >
              <div className="flex items-center gap-3">
                <folder.icon className={cn("h-4 w-4", activeFolder === folder.id ? "" : folder.color)} />
                <span>{folder.label}</span>
              </div>
              {folder.count > 0 && (
                <span className={cn(
                  "text-[10px] px-1.5 py-0.5 rounded-full bg-muted font-bold",
                  activeFolder === folder.id ? "bg-blue-100 dark:bg-blue-900 text-blue-600" : ""
                )}>
                  {folder.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <CenterPane
        title="Flux de Communication"
        searchPlaceholder="Rechercher dans les fils..."
        onSearch={setSearchQuery}
        className="max-w-md border-r"
      >
        <div className="space-y-1 pr-1">
          {threads.map((thread) => (
            <ListItem
              key={thread.id}
              title={thread.title}
              subtitle={thread.lastMessage?.content || "Aucun message récent"}
              icon={<div className={cn(
                "h-2 w-2 rounded-full",
                thread.type === 'class' ? 'bg-purple-500' : 'bg-blue-500'
              )} />}
              badge={thread.type === 'class' ? "CLASSE" : undefined}
              badgeVariant="outline"
              isSelected={selectedThread?.id === thread.id}
              onClick={() => handleSelectThread(thread)}
              rightContent={
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">10:45 AM</span>
                  {thread.id === 't1' && <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />}
                </div>
              }
              className="group"
            />
          ))}
        </div>
      </CenterPane>

      <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-slate-950">
        {selectedThread ? (
          <>
            {/* Rich Header */}
            <div className="h-14 px-6 border-b border-border flex items-center justify-between bg-white dark:bg-slate-950 sticky top-0 z-10">
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-9 w-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white shadow-sm flex-shrink-0">
                  <span className="font-bold text-sm">{selectedThread.title[0]}</span>
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-sm truncate uppercase tracking-wide">{selectedThread.title}</h3>
                  <div className="flex items-center gap-2 text-[10px] text-green-500 font-semibold animate-pulse">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                    En direct • {messages.length} participants
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="text-muted-foreground">
                  <Search className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="hidden md:flex gap-2 border-blue-200 text-blue-600 hover:bg-blue-50"
                  onClick={() => setIsCopilotOpen(true)}
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Assistant IA
                </Button>
                <Button variant="ghost" size="icon" className="text-muted-foreground">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Conversation Flow */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex flex-col",
                    msg.senderId === user?.id ? "items-end" : "items-start"
                  )}
                >
                  <div className="flex items-center gap-2 mb-1 px-1">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">{msg.senderName}</span>
                    <span className="text-[9px] text-slate-400">10:30 AM</span>
                  </div>
                  <div className={cn(
                    "max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm",
                    msg.senderId === user?.id
                      ? "bg-blue-600 text-white rounded-tr-none shadow-blue-100"
                      : "bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-tl-none"
                  )}>
                    {msg.content}
                    {msg.type === 'announcement' && (
                      <Badge className="mt-2 block w-fit bg-red-100 text-red-600 hover:bg-red-100 border-none text-[9px]">IMPORTANT</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Premium Compose Box */}
            <div className="p-6 border-t border-border bg-white dark:bg-slate-950">
              <div className="relative group">
                <div className="absolute -top-10 left-0 right-0 flex justify-center opacity-0 group-focus-within:opacity-100 transition-opacity">
                  <Button
                    variant="outline"
                    size="xs"
                    className="bg-blue-50 text-blue-600 border-blue-200 text-[10px] h-7 rounded-full px-4 flex gap-2"
                    onClick={() => setReply(prev => prev + " (Assistant: Reformuler avec plus de pédagogie...) ")}
                  >
                    <Sparkles className="h-3 w-3" />
                    Aider à rédiger
                  </Button>
                </div>
                <div className="border rounded-2xl shadow-sm focus-within:ring-2 focus-within:ring-blue-500/20 transition-all overflow-hidden">
                  <Textarea
                    placeholder={`Répondre à ${selectedThread.title}...`}
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    className="border-none focus-visible:ring-0 resize-none min-h-[100px] p-4 text-sm bg-transparent"
                  />
                  <div className="flex items-center justify-between p-3 bg-muted/5">
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-blue-600">
                        <Paperclip className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-blue-600">
                        <Smile className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button
                      onClick={handleSend}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-5 rounded-xl transition-all shadow-md"
                      disabled={!reply.trim()}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Répondre
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900/50 p-10 text-center">
            <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4 text-blue-600 animate-bounce">
              <MessageSquare size={40} />
            </div>
            <h3 className="text-xl font-bold mb-2">Centre de Communication Unifié</h3>
            <p className="text-muted-foreground max-w-sm">
              Sélectionnez une discussion pour commencer à collaborer avec votre équipe pédagogique et les parents.
            </p>
            <Button variant="outline" className="mt-6 border-blue-200 text-blue-600 hover:bg-blue-50" onClick={() => { }}>
              Consulter les annonces globales
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunicationModule;
