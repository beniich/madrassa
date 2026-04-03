// ============================================================
// ollamaClient.js — Client HTTP vers Ollama Local
// ============================================================
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const DEFAULT_MODEL = process.env.OLLAMA_DEFAULT_MODEL || 'llama3.2';

/**
 * Génère une réponse complète (non-streaming)
 */
async function generate({ model = DEFAULT_MODEL, prompt, stream = false, options = {} }) {
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
async function chat({ model = DEFAULT_MODEL, messages, stream = false, options = {} }) {
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
async function listModels() {
  const res = await fetch(`${OLLAMA_URL}/api/tags`);
  if (!res.ok) throw new Error('Impossible de joindre Ollama');
  return res.json();
}

/**
 * Vérifie si Ollama est en ligne
 */
async function checkStatus() {
  try {
    const res = await fetch(`${OLLAMA_URL}/api/tags`, { signal: AbortSignal.timeout(3000) });
    const data = await res.json();
    return {
      online: true,
      models: (data.models || []).map((m) => m.name),
      url: OLLAMA_URL,
    };
  } catch {
    return { online: false, models: [], url: OLLAMA_URL };
  }
}

/**
 * Génère un embedding (pour RAG futur)
 */
async function embed({ model = 'nomic-embed-text', prompt }) {
  const res = await fetch(`${OLLAMA_URL}/api/embeddings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, prompt }),
  });
  return res.json();
}

module.exports = { generate, chat, listModels, checkStatus, embed };
