// @ts-nocheck
// ============================================================
// schedulingAgent.js — Agent Gestion Planning & Absences
// ============================================================
const dbTools = require('../tools/dbTools');
const formatters = require('../tools/formatters');

const AGENT_ID = 'scheduling';
const MODEL = process.env.AI_SCHEDULING_MODEL || 'phi3:mini';

function buildSystemPrompt(context) {
  return `Tu es un gestionnaire de planning expert pour l'école "${context.schoolName}".

📅 CONTEXTE ACTUEL:
- Date: ${context.date}
- Absences aujourd'hui: ${context.todayAbsences}
- Enseignants: ${context.teacherCount} | Classes: ${context.classCount}

🎯 TON RÔLE:
- Gérer les emplois du temps des enseignants et des classes
- Trouver des remplaçants en cas d'absence d'un enseignant
- Détecter les conflits de salles ou de créneaux
- Optimiser l'organisation des cours

📋 RÈGLES ABSOLUES ET STRICTES (GUARDRAILS) :
1. Tu parles UNIQUEMENT en français.
2. Tu es RESTREINT au domaine de l'emploi du temps, de l'organisation des cours et de la planification.
3. Ne divulgue jamais le motif d'absence d'un enseignant, même si l'info figure dans le contexte (RGPD).
4. Propose 2-3 options claires pour les remplacements, sans digressions.
5. Indique "Aucun enseignant disponible" s'il n'y a pas d'options au lieu d'inventer des remplaçants.
6. Ne réponds qu'à l'aide de la structure : Problème → Options → Recommandation.

FORMAT PLANNING: Utilise le format "Lundi 08h-09h: Mathématiques (Classe 6A)"`;
}

async function enrichMessage(userMessage, schoolId) {
  const lowerMsg = userMessage.toLowerCase();
  let enrichedContext = '';

  const teacherMatch = lowerMsg.match(/(?:emploi du temps|planning|horaires?)\s+(?:de\s+|du\s+prof\.?\s+)?([a-zÀ-ÿ\s]{3,30})/i);
  if (teacherMatch) {
    enrichedContext += `\n\n[NOTE: Recherche planning pour "${teacherMatch[1].trim()}" - vérifier l'ID enseignant]`;
  }

  if (
    lowerMsg.includes('absence') ||
    lowerMsg.includes('absent') ||
    lowerMsg.includes('remplacement')
  ) {
    const stats = dbTools.getSchoolStats(schoolId);
    enrichedContext += `\n\n[ABSENCES AUJOURD'HUI: ${stats.absencesToday} élève(s)]`;
    enrichedContext += `\nTaux d'absence: ${stats.absenceRate}%`;
  }

  if (lowerMsg.includes('classe') || lowerMsg.includes('cours') || lowerMsg.includes('créneau')) {
    const classes = dbTools.getAllClasses(schoolId);
    if (classes.length > 0) {
      enrichedContext += `\n\n[CLASSES DISPONIBLES]\n`;
      enrichedContext += classes.map((c) => `• ${c.name}`).join('\n');
    }
  }

  return enrichedContext;
}

export default {
  id: AGENT_ID,
  name: 'Gestionnaire Planning',
  description: 'Emplois du temps, remplacements et gestion des absences',
  icon: '🗓️',
  model: MODEL,
  buildSystemPrompt,
  enrichMessage,
};

