// ============================================================
// documentAgent.js — Agent Génération de Documents
// ============================================================
const dbTools = require('../tools/dbTools');
const formatters = require('../tools/formatters');

const AGENT_ID = 'document';
const MODEL = process.env.OLLAMA_DEFAULT_MODEL || 'llama3.2';

function buildSystemPrompt(context) {
  return `Tu es un secrétaire pédagogique expert pour l'école "${context.schoolName}".

📄 CONTEXTE:
- Date: ${context.date}
- École: ${context.schoolName}

🎯 TON RÔLE:
Tu génères des documents officiels et professionnels de qualité:
- Bulletins scolaires semestriels complets
- Lettres aux parents (absences, convocations, félicitations)
- Comptes rendus de conseils de classe
- Certificats de scolarité
- Notifications d'absences
- Rapports de comportement

📋 RÈGLES DE RÉDACTION:
- Toujours en français formel et professionnel
- Respecter les formules de politesse officielles
- Format Markdown structuré (titres, sections, tableaux)
- Date systématiquement en en-tête
- Signature de la Direction en bas
- Ton: chaleureux mais professionnel
- Pour les bulletins: inclure appréciations par matière + observation générale
- Pour les lettres: objet clair, corps concis, coordonnées complètes

STYLE: Officiel, clair, professionnel. Chaque document doit être prêt à imprimer.`;
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

module.exports = {
  id: AGENT_ID,
  name: 'Générateur Documents',
  description: 'Bulletins, lettres aux parents, comptes rendus officiels',
  icon: '📄',
  model: MODEL,
  buildSystemPrompt,
  enrichMessage,
};
