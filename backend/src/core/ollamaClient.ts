// ============================================================
// ollamaClient.ts — Client HTTP vers Ollama Local
// ============================================================
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const DEFAULT_MODEL = process.env.OLLAMA_DEFAULT_MODEL || 'llama3.2';

export interface OllamaOptions {
  [key: string]: any;
}

export interface GenerateParams {
  model?: string;
  prompt: string;
  stream?: boolean;
  options?: OllamaOptions;
}

export interface ChatMessage {
  role: string;
  content: string;
}

export interface ChatParams {
  model?: string;
  messages: ChatMessage[];
  stream?: boolean;
  options?: OllamaOptions;
}

export interface EmbedParams {
  model?: string;
  prompt: string;
}

/**
 * Génère une réponse complète (non-streaming)
 */
export async function generate({ model = DEFAULT_MODEL, prompt, stream = false, options = {} }: GenerateParams): Promise<any> {
  const response = await fetch(`${OLLAMA_URL}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, prompt, stream, options }),
  });

  if (!response.ok) {
    throw new Error(`Ollama generate error: ${response.status} ${response.statusText}`);
  }

  return stream ? response.body : await response.json();
}

/**
 * Chat multi-tour avec messages [{ role, content }]
 */
export async function chat({ model = DEFAULT_MODEL, messages, stream = false, options = {} }: ChatParams): Promise<any> {
  const response = await fetch(`${OLLAMA_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, messages, stream, options }),
  });

  if (!response.ok) {
    throw new Error(`Ollama chat error: ${response.status} ${response.statusText}`);
  }

  return stream ? response.body : await response.json();
}

/**
 * Liste les modèles disponibles localement
 */
export async function listModels(): Promise<any> {
  const res = await fetch(`${OLLAMA_URL}/api/tags`);
  if (!res.ok) throw new Error('Impossible de joindre Ollama');
  return res.json();
}

/**
 * Vérifie si Ollama est en ligne
 */
export async function checkStatus(): Promise<{ online: boolean; models: string[]; url: string }> {
  try {
    const res = await fetch(`${OLLAMA_URL}/api/tags`, { signal: AbortSignal.timeout(3000) });
    const data = await res.json();
    return {
      online: true,
      models: (data.models || []).map((m: any) => m.name),
      url: OLLAMA_URL,
    };
  } catch {
    return { online: false, models: [], url: OLLAMA_URL };
  }
}

/**
 * Génère un embedding (pour RAG futur)
 */
export async function embed({ model = 'nomic-embed-text', prompt }: EmbedParams): Promise<any> {
  const res = await fetch(`${OLLAMA_URL}/api/embeddings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, prompt }),
  });
  return res.json();
}
