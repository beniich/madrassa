// @ts-nocheck
// ============================================================
// documentAgent.js — Agent Génération de Documents
// ============================================================
const dbTools = require('../tools/dbTools');
const formatters = require('../tools/formatters');

const AGENT_ID = 'document';
const MODEL = process.env.AI_DOCUMENT_MODEL || 'mistral:7b';

function buildSystemPrompt(context) {
  return `Tu es un secrétaire pédagogique expert pour l'école "${context.schoolName}".

📄 CONTEXTE:
- Date: ${context.date}
- École: ${context.schoolName}

🎯 TON RÔLE:
Tu génères des documents officiels de haute qualité professionnelle (bulletins, lettres, comptes rendus).

📋 RÈGLES ABSOLUES ET STRICTES (GUARDRAILS) :
1. Rédige UNIQUEMENT en français formel et professionnel.
2. Utilise le format Markdown structuré de façon immuable.
3. Rédige EXCLUSIVEMENT des documents lise-à-l'école (aucun autre sujet autorisé).
4. Ne sors pas du template fourni (si existant dans le contexte).
5. Anonymise ou masque les adresses et numéros de téléphone si la loi RGPD s'applique, sauf si présents dans le prompt.
6. Ne pas écrire de longs préambules ("Voici le document demandé :"). Fournis le document directement prêt à l'emploi.

STYLE: Officiel, clair, administratif. Chaque document doit être prêt à imprimer.`;
}

async function enrichMessage(userMessage, schoolId) {
  const lowerMsg = userMessage.toLowerCase();
  let enrichedContext = '';
  const context = dbTools.getSchoolContext(schoolId);

  if (lowerMsg.includes('bulletin')) {
    const studentMatch = lowerMsg.match(/(?:bulletin|bilan)\s+(?:de\s+|pour\s+)?([a-zÀ-ÿ\s]{3,30})/i);
    if (studentMatch) {
      const students = dbTools.searchStudents(schoolId, studentMatch[1].trim());
      if (students.length > 0) {
        const student = students[0];
        const grades = dbTools.getStudentGrades(student.id);
        const attendance = dbTools.getStudentAttendance(student.id);

        const template = formatters.buildReportCardTemplate({
          student,
          grades,
          attendance,
          period: 'Semestre 1',
        });
        enrichedContext += `\n\n[TEMPLATE BULLETIN PRÉ-REMPLI]\n${template}`;
      }
    }
  }

  if (lowerMsg.includes('lettre') && lowerMsg.includes('absence')) {
    const studentMatch = lowerMsg.match(/(?:lettre|courrier)\s+.*?(?:de\s+|pour\s+)([a-zÀ-ÿ\s]{3,30})/i);
    if (studentMatch) {
      const students = dbTools.searchStudents(schoolId, studentMatch[1].trim());
      if (students.length > 0) {
        const student = students[0];
        const template = formatters.buildParentLetterTemplate({
          student,
          reason: "Notification d'absence",
          schoolName: context.schoolName,
        });
        enrichedContext += `\n\n[TEMPLATE LETTRE ABSENCE]\n${template}`;
      }
    }
  }

  enrichedContext += `\n\n[INFOS ÉCOLE: ${context.schoolName} — ${context.date}]`;

  return enrichedContext;
}

export default {
  id: AGENT_ID,
  name: 'Générateur Documents',
  description: 'Bulletins, lettres aux parents, comptes rendus officiels',
  icon: '📄',
  model: MODEL,
  buildSystemPrompt,
  enrichMessage,
};

