
export type UserRole = 'ADMIN' | 'DIRECTOR' | 'TEACHER' | 'PARENT' | 'STUDENT';

export interface SchoolUser {
    id: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    schoolId: string;
    classId?: string;
}

// --- Messaging ---
export type MessageType = 'direct' | 'announcement' | 'system';

export interface ChatMessage {
    id: string;
    threadId: string;
    senderId: string;
    senderRole: UserRole;
    senderName: string;
    recipients: string[];
    content: string;
    type: MessageType;
    createdAt: string;
    readAt?: string;
    attachments?: string[];
}

export interface ChatThread {
    id: string;
    title: string;
    participants: string[];
    lastMessage?: ChatMessage;
    type: 'class' | 'individual' | 'group';
}

// --- Copilot ---
export interface AIContext {
    userRole: UserRole;
    schoolYear: string;
    currentClassId?: string;
    studentId?: string;
    subject?: string;
}

export interface AIResponse {
    answer: string;
    suggestions?: string[];
    sources?: string[];
}

export interface CopilotMessage {
    id: string;
    role: 'assistant' | 'user';
    content: string;
    timestamp: string;
}

// --- Documents ---
export interface SchoolFile {
    id: string;
    name: string;
    type: 'pdf' | 'docx' | 'xlsx' | 'jpg' | 'png';
    size: string;
    updatedAt: string;
    owner: string;
    parentId: string;
}

export interface SchoolFolder {
    id: string;
    name: string;
    parentId: string | null;
    itemCount: number;
}

// --- Tasks ---
export interface SchoolTask {
    id: string;
    title: string;
    assignedTo: string[];
    dueDate: string;
    status: 'todo' | 'in-progress' | 'completed';
    priority: 'low' | 'medium' | 'high';
    category: string;
}
