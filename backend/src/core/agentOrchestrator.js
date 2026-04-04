// ============================================================
// agentOrchestrator.js — Chef d'orchestre des agents IA
// ============================================================
const ollamaClient = require('./ollamaClient');
const memoryManager = require('./memoryManager');
const dbTools = require('./tools/dbTools');
const ragService = require('./ai/ragService');

// Chargement des agents
const AGENTS = {
  school_advisor: require('./agents/schoolAdvisorAgent'),
  analytics: require('./agents/analyticsAgent'),
  scheduling: require('./agents/schedulingAgent'),
  document: require('./agents/documentAgent'),
  chat: require('./agents/chatAgent'),
};

// ─── Détection d'intention ──────────────────────────────────

const INTENT_PATTERNS = [
  {
    agent: 'analytics',
    keywords: [
      'statistique', 'stat', 'kpi', 'tendance', 'évolution', 'graphique',
      'bilan', 'résumé', 'dashboard', 'alerte', 'taux', 'pourcentage',
      'comparaison', 'performance globale', 'analytique',
    ],
  },
  {
    agent: 'school_advisor',
    keywords: [
      'élève', 'note', 'moyenne', 'résultat', 'difficulté', 'suivi',
      'conseil pédagogique', 'apprentissage', 'évaluation', 'progrès',
      'comportement', 'classe', 'matière', 'bulletin', 'orientation',
    ],
  },
  {
    agent: 'scheduling',
    keywords: [
      'emploi du temps', 'planning', 'horaire', 'créneau', 'remplacement',
      'absent', 'absence enseignant', 'salle', 'conflit', 'disponible',
      'agenda', 'cours planifié',
    ],
  },
  {
    agent: 'document',
    keywords: [
      'générer', 'rédiger', 'écrire', 'document', 'lettre', 'bulletin scolaire',
      'compte rendu', 'rapport', 'certificat', 'attestation', 'courrier',
      'notification', 'parent', 'imprimer',
    ],
  },
];

function detectIntent(message) {
  const lower = message.toLowerCase();
  const scores = {};

  for (const { agent, keywords } of INTENT_PATTERNS) {
    scores[agent] = keywords.filter((kw) => lower.includes(kw)).length;
  }

  const sorted = Object.entries(scores).sort(([, a], [, b]) => b - a);

  if (sorted[0][1] > 0) {
    return sorted[0][0];
  }

  return 'chat';
}

// ─── Dispatch Principal ──────────────────────────────────────

async function dispatch({ userMessage, schoolId, userId, sessionId, agentHint, modelOverride, isStrict = true }) {
  const history = memoryManager.getHistory(sessionId);

  const agentId = agentHint && AGENTS[agentHint] ? agentHint : detectIntent(userMessage);
  const agent = AGENTS[agentId];

  const context = dbTools.getSchoolContext(schoolId);

  // --- RAG: Recherche de contexte documentaire ---
  let ragContext = '';
  try {
    const similarChunks = await ragService.searchSimilarChunks(schoolId, userMessage);
    if (similarChunks.length > 0) {
      ragContext = `\n\n[CONTEXTE DOCUMENTAIRE RÉEL]:\n${similarChunks.join('\n\n---\n\n')}`;
    }
  } catch (err) {
    console.warn(`[Orchestrator] RAG échoué:`, err);
  }

  const systemPrompt = agent.buildSystemPrompt(context) + (ragContext ? `\n\n📚 Données complémentaires trouvées: ${ragContext}` : '');

  let enrichedUserMessage = userMessage;
  try {
    const extraContext = await agent.enrichMessage(userMessage, schoolId);
    if (extraContext) {
      enrichedUserMessage = `${userMessage}\n${extraContext}`;
    }
  } catch (err) {
    console.warn(`[Orchestrator] Enrichissement échoué pour ${agentId}:`, err.message);
  }

  const messages = [
    { role: 'system', content: systemPrompt },
    ...history.filter((m) => m.role !== 'system'),
    { role: 'user', content: enrichedUserMessage },
  ];

  memoryManager.saveMessage(sessionId, schoolId, userId, 'user', userMessage, agentId);

  const stream = await ollamaClient.chat({
    model: modelOverride || agent.model,
    messages,
    stream: true,
  });

  return {
    stream,
    agentId,
    agentName: agent.name,
    agentIcon: agent.icon,
  };
}

function saveAssistantResponse(sessionId, schoolId, userId, content, agentId) {
  memoryManager.saveMessage(sessionId, schoolId, userId, 'assistant', content, agentId);
}

async function generateAutoInsights(schoolId) {
  const context = dbTools.getSchoolContext(schoolId);
  const analyticsAgent = AGENTS.analytics;

  if (analyticsAgent.generateAutoInsights) {
    const insights = await analyticsAgent.generateAutoInsights(schoolId, context);
    for (const insight of insights) {
      memoryManager.saveInsight({ schoolId, agent: 'analytics', ...insight });
    }
    return insights;
  }

  return [];
}

function getAgentList() {
  return Object.values(AGENTS).map((a) => ({
    id: a.id,
    name: a.name,
    description: a.description,
    icon: a.icon,
    model: a.model,
  }));
}

module.exports = {
  dispatch,
  saveAssistantResponse,
  generateAutoInsights,
  getAgentList,
  detectIntent,
};
