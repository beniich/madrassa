
import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { ChatArea } from "@/components/chat/ChatArea";
import { MessageInput } from "@/components/chat/MessageInput";

const MessagesPage = () => {
    const [activeChannelId, setActiveChannelId] = useState<string>("all");

    return (
        <DashboardLayout>
            <div className="flex h-[calc(100vh-1rem)] overflow-hidden bg-background">
                {/* Sidebar */}
                <ChatSidebar
                    activeChannelId={activeChannelId}
                    onSelectChannel={setActiveChannelId}
                />

                {/* Main Chat Area */}
                <div className="flex-1 flex flex-col h-full relative">
                    {/* Chat Header */}
                    <div className="h-14 border-b border-border/50 flex items-center justify-between px-6 bg-background/50 backdrop-blur-sm z-10">
                        <div className="flex items-center gap-3">
                            <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                            <div>
                                <h3 className="font-semibold text-sm">Projet Alpha - Développement V2</h3>
                                <p className="text-[10px] text-muted-foreground">3 participants • Dernière activité il y a 5 min</p>
                            </div>
                        </div>
                    </div>

                    <ChatArea channelId={activeChannelId} />
                    <MessageInput />
                </div>
            </div>
        </DashboardLayout>
    );
};

export default MessagesPage;
