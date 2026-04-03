// ============================================================
// analyticsAgent.js — Agent Analytics & KPIs
// ============================================================
const dbTools = require('../tools/dbTools');
const formatters = require('../tools/formatters');

const AGENT_ID = 'analytics';
const MODEL = process.env.OLLAMA_ANALYTICS_MODEL || 'mistral';

function buildSystemPrompt(context) {
  return `Tu es un analyste de données expert pour l'école "${context.schoolName}".

📊 CONTEXTE ACTUEL:
- Date: ${context.date}
- Élèves: ${context.studentCount} | Enseignants: ${context.teacherCount} | Classes: ${context.classCount}
- Absences aujourd'hui: ${context.todayAbsences}

🎯 TON RÔLE:
- Analyser les KPIs et indicateurs de performance de l'école
- Identifier les tendances (positives et négatives)
- Générer des alertes préventives (absentéisme élevé, baisse de notes)
- Produire des résumés statistiques clairs et actionnables
- Faire des comparaisons inter-classes et inter-périodes

📋 RÈGLES DE RÉPONSE:
- Réponds TOUJOURS en français
- Utilise des chiffres précis et des pourcentages
- Structure tes réponses avec des sections claires
- Toujours contextualiser les données (bon/moyen/préoccupant)
- Propose des seuils d'alerte concrets (ex: "taux > 10% = préoccupant")
- Termine par des recommandations chiffrées et prioritisées

STYLE: Analytique, précis, concis. Privilégie tableaux et listes.`;
}

async function enrichMessage(userMessage, schoolId) {
  const lowerMsg = userMessage.toLowerCase();
  let enrichedContext = '';

  const stats = dbTools.getSchoolStats(schoolId);
  enrichedContext += `\n\n[STATISTIQUES ACTUELLES]\n${formatters.formatSchoolStats(stats)}`;

  if (
    lowerMsg.includes('tendance') ||
    lowerMsg.includes('évolution') ||
    lowerMsg.includes('résumé') ||
    lowerMsg.includes('bilan')
  ) {
    const trends = dbTools.getGradeTrends(schoolId, 30);
    if (trends.length > 0) {
      enrichedContext += `\n\n[ÉVOLUTION DES NOTES (30 derniers jours)]`;
      enrichedContext += trends
        .slice(-7)
        .map((t) => `• ${t.day}: ${t.avg_grade}/20 (${t.count} notes)`)
        .join('\n');
    }
  }

  if (
    lowerMsg.includes('alerte') ||
    lowerMsg.includes('risque') ||
    lowerMsg.includes('absentéisme') ||
    lowerMsg.includes('problème')
  ) {
    const atRisk = dbTools.getStudentsAtRisk(schoolId, 5);
    if (atRisk.length > 0) {
      enrichedContext += `\n\n[ÉLÈVES À RISQUE (${atRisk.length})]\n${formatters.formatStudentList(atRisk)}`;
    }
  }

  if (lowerMsg.includes('classe') || lowerMsg.includes('niveau')) {
    const classes = dbTools.getAllClasses(schoolId);
    if (classes.length > 0) {
      enrichedContext += `\n\n[CLASSES]\n`;
      enrichedContext += classes.map((c) => `• ${c.name} (niveau ${c.level || 'N/A'})`).join('\n');
    }
  }

  return enrichedContext;
}

async function generateAutoInsights(schoolId, context) {
  const stats = dbTools.getSchoolStats(schoolId);
  const atRisk = dbTools.getStudentsAtRisk(schoolId, 5);
  const insights = [];

  if (parseFloat(stats.absenceRate) > 10) {
    insights.push({
      type: 'alert',
      title: `⚠️ Absentéisme élevé: ${stats.absenceRate}%`,
      content: `${stats.absencesToday} élève(s) absent(s) aujourd'hui sur ${stats.totalStudents}. Taux supérieur au seuil de 10%.`,
    });
  }

  insights.push({
    type: 'summary',
    title: `📊 Résumé du ${context.date}`,
    content: formatters.formatSchoolStats(stats),
  });

  if (atRisk.length > 0) {
    insights.push({
      type: 'warning',
      title: `🎯 ${atRisk.length} élève(s) nécessitent un suivi`,
      content: formatters.formatStudentList(atRisk.slice(0, 5)),
    });
  }

  return insights;
}

module.exports = {
  id: AGENT_ID,
  name: 'Analyste Données',
  description: 'KPIs, tendances, alertes et statistiques de l\'école',
  icon: '📈',
  model: MODEL,
  buildSystemPrompt,
  enrichMessage,
  generateAutoInsights,
};
