import { useState } from "react";
import { useMessages, sendMessage } from "@/hooks/useOfflineData";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Mail,
    Send,
    Search,
    Plus,
    User,
    Users,
    ShieldAlert,
    Clock,
    MoreVertical,
    Loader2,
    Trash2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const CommunicationPage = () => {
    const { user } = useAuth();
    const messages = useMessages();
    const [searchTerm, setSearchTerm] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [newMessage, setNewMessage] = useState({
        subject: "",
        content: "",
        recipientType: "all" as 'all' | 'class' | 'individual',
        priority: "normal" as 'low' | 'normal' | 'high' | 'urgent'
    });

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.subject || !newMessage.content) {
            toast.error("Sujet et contenu requis");
            return;
        }

        setIsSending(true);
        try {
            await sendMessage({
                ...newMessage,
                schoolId: 'demo_school',
                senderId: user?.id?.toString() || "me",
                senderRole: (user?.role === 'admin' ? 'direction' : user?.role === 'teacher' ? 'teacher' : 'parent') as 'direction' | 'teacher' | 'parent',
                readBy: []
            });
            toast.success("Message envoyé (synchronisation en attente)");
            setNewMessage({ subject: "", content: "", recipientType: "all", priority: "normal" });
        } catch (error) {
            toast.error("Erreur d'envoi");
        } finally {
            setIsSending(false);
        }
    };

    const filteredMessages = messages?.filter(m =>
        m.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-col lg:flex-row h-[calc(100vh-140px)] gap-6">
            <div className="flex-1 flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Communication</h1>
                        <p className="text-muted-foreground">Centre de messagerie et notifications de l'établissement</p>
                    </div>
                </div>

                <div className="flex items-center gap-4 bg-card p-4 rounded-xl border shadow-sm">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Rechercher un message..."
                            className="pl-10 pb-1"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                    {messages === undefined ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : filteredMessages?.length === 0 ? (
                        <Card className="p-12 text-center text-muted-foreground border-dashed border-2">
                            <Mail className="h-12 w-12 mx-auto mb-4 opacity-20" />
                            <h3 className="text-lg font-semibold text-foreground mb-2">Aucun message</h3>
                            <p>Vos conversations s'afficheront ici.</p>
                        </Card>
                    ) : (
                        filteredMessages?.map((msg) => (
                            <Card key={msg.localId} className="p-5 hover:shadow-md transition-all group border-primary/5">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <Badge variant={
                                            msg.priority === 'urgent' ? 'destructive' :
                                                msg.priority === 'high' ? 'secondary' : 'outline'
                                        } className="text-[10px] uppercase">
                                            {msg.priority}
                                        </Badge>
                                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                                            <Clock className="h-3 w-3" /> {new Date(msg.sentAt).toLocaleDateString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button variant="ghost" size="icon" className="h-7 w-7"><MoreVertical className="h-4 w-4" /></Button>
                                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive"><Trash2 className="h-4 w-4" /></Button>
                                    </div>
                                </div>

                                <h3 className="font-bold text-lg mb-1">{msg.subject}</h3>
                                <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">{msg.content}</p>

                                <div className="flex items-center justify-between mt-4 pt-4 border-t border-muted/50">
                                    <div className="flex items-center gap-2">
                                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                                            {msg.senderRole === 'direction' ? <ShieldAlert className="h-4 w-4" /> : <User className="h-4 w-4" />}
                                        </div>
                                        <div className="text-xs">
                                            <p className="font-bold">{msg.senderRole.toUpperCase()}</p>
                                            <p className="text-muted-foreground shrink-0 flex items-center gap-1">
                                                Destinataires: <Badge variant="secondary" className="text-[9px] py-0">{msg.recipientType}</Badge>
                                            </p>
                                        </div>
                                    </div>
                                    <Button variant="outline" size="sm" className="h-8 text-xs">Lire plus</Button>
                                </div>
                            </Card>
                        ))
                    )}
                </div>
            </div>

            <Card className="w-full lg:w-[400px] p-6 flex flex-col gap-6 h-fit shrink-0 shadow-lg border-primary/10">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <Plus className="h-6 w-6" />
                    </div>
                    <h2 className="font-bold text-xl">Nouveau Message</h2>
                </div>

                <form onSubmit={handleSendMessage} className="space-y-4">
                    <div className="space-y-2">
                        <Label className="text-xs">Destinataires</Label>
                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant={newMessage.recipientType === 'all' ? 'default' : 'outline'}
                                size="sm"
                                className="flex-1 text-[10px] h-8"
                                onClick={() => setNewMessage({ ...newMessage, recipientType: 'all' })}
                            >
                                <Users className="h-3 w-3 mr-1.5" /> Tous
                            </Button>
                            <Button
                                type="button"
                                variant={newMessage.recipientType === 'class' ? 'default' : 'outline'}
                                size="sm"
                                className="flex-1 text-[10px] h-8"
                                onClick={() => setNewMessage({ ...newMessage, recipientType: 'class' })}
                            >
                                <Users className="h-3 w-3 mr-1.5" /> Classe
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="subject" className="text-xs">Sujet</Label>
                        <Input
                            id="subject"
                            placeholder="Ex: Réunion de fin de semestre"
                            className="bg-muted/30 focus-visible:bg-background"
                            value={newMessage.subject}
                            onChange={e => setNewMessage({ ...newMessage, subject: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="content" className="text-xs">Message</Label>
                        <textarea
                            id="content"
                            className="w-full min-h-[150px] p-3 rounded-xl border bg-muted/30 focus-visible:bg-background focus:ring-2 focus:ring-primary outline-none text-sm transition-all"
                            placeholder="Rédigez votre message ici..."
                            value={newMessage.content}
                            onChange={e => setNewMessage({ ...newMessage, content: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs">Priorité</Label>
                        <div className="flex gap-2">
                            {['low', 'normal', 'high', 'urgent'].map(p => (
                                <button
                                    key={p}
                                    type="button"
                                    onClick={() => setNewMessage({ ...newMessage, priority: p as any })}
                                    className={cn(
                                        "flex-1 h-7 rounded-md text-[9px] border transition-all uppercase font-bold",
                                        newMessage.priority === p ? "bg-primary text-primary-foreground border-primary" : "bg-card hover:bg-muted"
                                    )}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>

                    <Button type="submit" className="w-full gap-2 shadow-lg shadow-primary/20" disabled={isSending}>
                        {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                        Envoyer l'Annonce
                    </Button>
                </form>
            </Card>
        </div>
    );
};

export default CommunicationPage;
