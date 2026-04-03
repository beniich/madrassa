// ============================================================
// ollamaService.ts — Client frontend pour l'API AI
// ============================================================

export type AgentType =
  | 'school_advisor'
  | 'analytics'
  | 'scheduling'
  | 'document'
  | 'chat';

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  agentId?: AgentType;
  agentName?: string;
  agentIcon?: string;
  timestamp: Date;
  streaming?: boolean;
}

export interface AgentInfo {
  id: AgentType;
  name: string;
  description: string;
  icon: string;
  model: string;
}

export interface OllamaStatus {
  online: boolean;
  models: string[];
  url: string;
}

const API_BASE = import.meta.env.VITE_API_URL || '/api';

// ─── Status & Agents ─────────────────────────────────────────

export async function checkOllamaStatus(): Promise<OllamaStatus> {
  const res = await fetch(`${API_BASE}/ai/status`);
  return res.json();
}

export async function getAgents(): Promise<AgentInfo[]> {
  const res = await fetch(`${API_BASE}/ai/agents`, {
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  return data.agents || [];
}

export async function getModels(): Promise<string[]> {
  const res = await fetch(`${API_BASE}/ai/models`, {
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  return (data.models || []).map((m: { name: string }) => m.name);
}

// ─── Chat Streaming ──────────────────────────────────────────

export interface StreamChatOptions {
  message: string;
  sessionId?: string;
  agentHint?: AgentType;
  onToken: (token: string) => void;
  onAgent: (agent: { agentId: AgentType; agentName: string; agentIcon: string; sessionId: string }) => void;
  onDone: (sessionId: string) => void;
  onError: (error: string) => void;
}

export async function streamChat(options: StreamChatOptions): Promise<void> {
  const { message, sessionId, agentHint, onToken, onAgent, onDone, onError } = options;

  const res = await fetch(`${API_BASE}/ai/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ message, sessionId, agentHint }),
  });

  if (!res.ok) {
    onError(`Erreur HTTP: ${res.status}`);
    return;
  }

  const reader = res.body?.getReader();
  if (!reader) {
    onError('Stream non disponible');
    return;
  }

  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        try {
          const data = JSON.parse(line.slice(6));
          if (data.token !== undefined) {
            onToken(data.token);
          } else if (data.agentId) {
            onAgent(data);
          } else if (data.sessionId !== undefined && !data.agentId) {
            onDone(data.sessionId);
          } else if (data.error) {
            onError(data.error);
          }
        } catch {
          // Ligne invalide
        }
      }
    }
  }
}

// ─── Historique ──────────────────────────────────────────────

export async function getHistory(sessionId: string): Promise<AIMessage[]> {
  const res = await fetch(`${API_BASE}/ai/history/${sessionId}`, {
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  return (data.history || []).map((m: { role: string; content: string; agent: string }) => ({
    id: crypto.randomUUID(),
    role: m.role as 'user' | 'assistant',
    content: m.content,
    agentId: m.agent as AgentType,
    timestamp: new Date(),
  }));
}

export async function clearHistory(sessionId: string): Promise<void> {
  await fetch(`${API_BASE}/ai/history/${sessionId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
}

// ─── Insights ────────────────────────────────────────────────

export interface AIInsight {
  id: number;
  type: 'alert' | 'warning' | 'summary' | 'info';
  agent: AgentType;
  title: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

export async function getInsights(): Promise<AIInsight[]> {
  const res = await fetch(`${API_BASE}/ai/insights`, {
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  return data.insights || [];
}

export async function generateInsights(): Promise<AIInsight[]> {
  const res = await fetch(`${API_BASE}/ai/insights`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  return data.insights || [];
}

export async function markInsightsRead(): Promise<void> {
  await fetch(`${API_BASE}/ai/insights/read`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
  });
}

// ─── Documents ───────────────────────────────────────────────

export interface GenerateDocumentOptions {
  type: 'report_card' | 'parent_letter' | 'class_report';
  studentId?: string;
  classId?: string;
  period?: string;
  extra?: string;
  onToken: (token: string) => void;
  onDone: (artifactId: number) => void;
  onError: (error: string) => void;
}

export async function generateDocument(options: GenerateDocumentOptions): Promise<void> {
  const { type, studentId, classId, period, extra, onToken, onDone, onError } = options;

  const res = await fetch(`${API_BASE}/ai/document`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ type, studentId, classId, period, extra }),
  });

  const reader = res.body?.getReader();
  if (!reader) { onError('Stream non disponible'); return; }

  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        try {
          const data = JSON.parse(line.slice(6));
          if (data.token) onToken(data.token);
          else if (data.artifactId) onDone(data.artifactId);
          else if (data.error) onError(data.error);
        } catch {}
      }
    }
  }
}

// ─── Utils ───────────────────────────────────────────────────

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('auth_token') || '';
  const schoolId = localStorage.getItem('school_id') || 'school-1';
  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    'x-school-id': schoolId,
  };
}
