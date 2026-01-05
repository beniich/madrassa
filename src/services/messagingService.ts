
import { ChatMessage, ChatThread, UserRole } from '../types/school-365';

class MessagingService {
    private static instance: MessagingService;

    private constructor() { }

    public static getInstance(): MessagingService {
        if (!MessagingService.instance) {
            MessagingService.instance = new MessagingService();
        }
        return MessagingService.instance;
    }

    public async getThreads(): Promise<ChatThread[]> {
        // Simulation de récupération de threads classes/parents/admin
        return [
            { id: 't1', title: 'Classe 4B - Général', participants: [], type: 'class' },
            { id: 't2', title: 'Ahmed K. (Parents)', participants: [], type: 'individual' },
            { id: 't3', title: 'Conseil Pédagogique', participants: [], type: 'group' },
        ];
    }

    public async getMessages(threadId: string): Promise<ChatMessage[]> {
        return [
            {
                id: 'm1',
                threadId,
                senderId: 'dir_1',
                senderName: 'Direction',
                senderRole: 'DIRECTOR',
                recipients: [],
                content: "N'oubliez pas la réunion de demain à 14h.",
                type: 'announcement',
                createdAt: new Date().toISOString(),
            },
            {
                id: 'm2',
                threadId,
                senderId: 'parent_1',
                senderName: 'Mme K.',
                senderRole: 'PARENT',
                recipients: [],
                content: "Merci pour l'information. Ahmed sera présent.",
                type: 'direct',
                createdAt: new Date().toISOString(),
                readAt: new Date().toISOString()
            }
        ];
    }

    public async sendMessage(threadId: string, content: string, sender: { id: string, name: string, role: UserRole }): Promise<ChatMessage> {
        const newMessage: ChatMessage = {
            id: Date.now().toString(),
            threadId,
            senderId: sender.id,
            senderName: sender.name,
            senderRole: sender.role,
            recipients: [],
            content,
            type: 'direct',
            createdAt: new Date().toISOString(),
        };
        console.log('[Messaging] Message envoyé:', newMessage);
        return newMessage;
    }
}

export const messagingService = MessagingService.getInstance();
