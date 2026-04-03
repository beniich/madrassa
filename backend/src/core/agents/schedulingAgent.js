// ============================================================
// schedulingAgent.js — Agent Gestion Planning & Absences
// ============================================================
const dbTools = require('../tools/dbTools');
const formatters = require('../tools/formatters');

const AGENT_ID = 'scheduling';
const MODEL = process.env.OLLAMA_DEFAULT_MODEL || 'llama3.2';

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
- Gérer les absences élèves et les signalements aux parents

📋 RÈGLES DE RÉPONSE:
- Réponds TOUJOURS en français
- Pour les remplacements: propose toujours 2-3 options
- Vérifie toujours les conflits avant de proposer un créneau
- Signale clairement les impossibilités et leur raison
- Structure: Problème → Options → Recommandation

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

module.exports = {
  id: AGENT_ID,
  name: 'Gestionnaire Planning',
  description: 'Emplois du temps, remplacements et gestion des absences',
  icon: '🗓️',
  model: MODEL,
  buildSystemPrompt,
  enrichMessage,
};
