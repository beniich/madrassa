// @ts-nocheck
// ============================================================
// agentOrchestrator.js — Chef d'orchestre des agents IA
// ============================================================
import * as ollamaClient from './ollamaClient';
import * as memoryManager from './memoryManager';
import * as dbTools from './tools/dbTools';
import * as ragService from './ai/ragService';

// Chargement des agents
import schoolAdvisorAgent from './agents/schoolAdvisorAgent';
import analyticsAgent from './agents/analyticsAgent';
import schedulingAgent from './agents/schedulingAgent';
import documentAgent from './agents/documentAgent';
import chatAgent from './agents/chatAgent';

const AGENTS: Record<string, any> = {
  school_advisor: schoolAdvisorAgent,
  analytics: analyticsAgent,
  scheduling: schedulingAgent,
  document: documentAgent,
  chat: chatAgent,
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

export function detectIntent(message: string): string {
  const lower = message.toLowerCase();
  const scores: Record<string, number> = {};

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

export async function dispatch({ userMessage, schoolId, userId, sessionId, agentHint, modelOverride, isStrict = true }: any) {
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

export function saveAssistantResponse(sessionId: string, schoolId: string, userId: string, content: string, agentId: string) {
  memoryManager.saveMessage(sessionId, schoolId, userId, 'assistant', content, agentId);
}

export async function generateAutoInsights(schoolId: string) {
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

export function getAgentList() {
  return Object.values(AGENTS).map((a: any) => ({
    id: a.id,
    name: a.name,
    description: a.description,
    icon: a.icon,
    model: a.model,
  }));
}



