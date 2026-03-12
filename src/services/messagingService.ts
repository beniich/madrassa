/**
 * Messaging Service - Real API Backend
 * Replaces hardcoded mock messages with live calls to /api/messages
 */

import { apiClient } from '@/lib/apiClient';
import { generateLocalId } from '@/lib/db';

export type UserRole = 'DIRECTOR' | 'TEACHER' | 'PARENT' | 'ADMIN';

export interface ChatThread {
    id: string;
    title: string;
    participants: string[];
    type: 'class' | 'individual' | 'group';
    lastMessage?: string;
    lastAt?: string;
}

export interface ChatMessage {
    id: string;
    threadId: string;
    senderId: string;
    senderName: string;
    senderRole: UserRole;
    recipients: string[];
    content: string;
    type: 'announcement' | 'direct';
    createdAt: string;
    readAt?: string;
}

class MessagingService {
    private static instance: MessagingService;

    private constructor() {}

    public static getInstance(): MessagingService {
        if (!MessagingService.instance) {
            MessagingService.instance = new MessagingService();
        }
        return MessagingService.instance;
    }

    /**
     * Fetch all message threads (derived from messages grouped by recipientType/subject).
     */
    public async getThreads(): Promise<ChatThread[]> {
        try {
            const messages = await apiClient.get<any[]>('/messages');

            // Group messages into threads by subject
            const threadMap = new Map<string, any[]>();
            for (const msg of messages) {
                const key = msg.subject ?? 'Sans sujet';
                if (!threadMap.has(key)) threadMap.set(key, []);
                threadMap.get(key)!.push(msg);
            }

            return Array.from(threadMap.entries()).map(([subject, msgs]) => {
                const last = msgs[msgs.length - 1];
                return {
                    id: `thread-${subject.toLowerCase().replace(/\s+/g, '-')}`,
                    title: subject,
                    participants: [],
                    type: last?.recipientType === 'all' ? 'group' : 'individual',
                    lastMessage: last?.content?.substring(0, 60),
                    lastAt: last?.sentAt,
                };
            });
        } catch (err) {
            console.error('[MessagingService] getThreads error:', err);
            return [];
        }
    }

    /**
     * Fetch messages within a specific thread (by subject slug).
     */
    public async getMessages(threadId: string): Promise<ChatMessage[]> {
        try {
            const messages = await apiClient.get<any[]>('/messages');
            const subject = threadId.replace('thread-', '').replace(/-/g, ' ');

            return messages
                .filter((m) => (m.subject ?? '').toLowerCase() === subject)
                .map((m) => ({
                    id: m.localId,
                    threadId,
                    senderId: m.senderId ?? '',
                    senderName: m.senderName ?? m.senderId ?? 'Inconnu',
                    senderRole: (m.senderRole ?? 'ADMIN') as UserRole,
                    recipients: m.recipientId ? [m.recipientId] : [],
                    content: m.content ?? '',
                    type: m.recipientType === 'all' ? 'announcement' : 'direct',
                    createdAt: m.sentAt ?? new Date().toISOString(),
                    readAt: undefined,
                }));
        } catch (err) {
            console.error('[MessagingService] getMessages error:', err);
            return [];
        }
    }

    /**
     * Send a new message and persist it to the backend.
     */
    public async sendMessage(
        threadId: string,
        content: string,
        sender: { id: string; name: string; role: UserRole },
        subject?: string
    ): Promise<ChatMessage> {
        const localId = generateLocalId();
        const sentAt = new Date().toISOString();

        const payload = {
            localId,
            senderId: sender.id,
            senderName: sender.name,
            senderRole: sender.role,
            subject: subject ?? threadId.replace('thread-', '').replace(/-/g, ' '),
            content,
            recipientType: 'all',
            sentAt,
            priority: 'normal',
        };

        try {
            await apiClient.post('/messages', payload);
        } catch (err) {
            console.warn('[MessagingService] Failed to persist message to backend:', err);
        }

        return {
            id: localId,
            threadId,
            senderId: sender.id,
            senderName: sender.name,
            senderRole: sender.role,
            recipients: [],
            content,
            type: 'direct',
            createdAt: sentAt,
        };
    }
}

export const messagingService = MessagingService.getInstance();
