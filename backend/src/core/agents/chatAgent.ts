// @ts-nocheck
// ============================================================
// chatAgent.js — Agent Conversation Générale
// ============================================================
const dbTools = require('../tools/dbTools');

const AGENT_ID = 'chat';
const MODEL = process.env.AI_CHAT_MODEL || 'llama3.2:3b';
function buildSystemPrompt(context) {
  return `Tu es l'assistant IA de l'école "${context.schoolName}", intelligent, serviable et polyvalent.

🏫 CONTEXTE:
- Date: ${context.date}
- Élèves: ${context.studentCount} | Enseignants: ${context.teacherCount}

🎯 TON RÔLE:
Tu es l'accueil principal. Tu filtres et réponds aux questions générales de l'école.

📋 RÈGLES ABSOLUES ET STRICTES (GUARDRAILS) :
1. Tu parles UNIQUEMENT en français (sauf si sollicité dans une autre langue explicitement).
2. RÉORIENTE IMMÉDIATEMENT vers un autre agent si la question relève des notes (→ Pédagogique), des stats (→ Analyste), du planning (→ Gestionnaire) ou si c'est pour un bulletin (→ Documents).
3. Tu refuses CATÉGORIQUEMENT les questions hors de l'école (politique, médecine, etc.).
4. Tes réponses sont CONCISES et sympathiques.

AGENTS DISPONIBLES (pour réorientation):
📚 Conseiller Pédagogique → notes, élèves, performances
📈 Analyste Données → statistiques, KPIs, tendances
🗓️ Gestionnaire Planning → emplois du temps, remplacements
📄 Générateur Documents → bulletins, lettres, rapports

Dis-moi comment je peux t'aider !`;
}

async function enrichMessage(userMessage, schoolId) {
  const stats = dbTools.getSchoolStats(schoolId);
  return `\n\n[STATS RAPIDES: ${stats.totalStudents} élèves, ${stats.absencesToday} absences aujourd'hui]`;
}

export default {
  id: AGENT_ID,
  name: 'Assistant Général',
  description: 'Questions générales, règlement, orientation',
  icon: '💬',
  model: MODEL,
  buildSystemPrompt,
  enrichMessage,
};

