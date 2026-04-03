// ============================================================
// schoolAdvisorAgent.js — Conseiller Pédagogique IA
// ============================================================
const dbTools = require('../tools/dbTools');
const formatters = require('../tools/formatters');

const AGENT_ID = 'school_advisor';
const MODEL = process.env.OLLAMA_DEFAULT_MODEL || 'llama3.2';

function buildSystemPrompt(context) {
  return `Tu es un conseiller pédagogique expert et bienveillant pour l'école "${context.schoolName}".

📚 CONTEXTE ACTUEL:
- Date: ${context.date}
- Élèves inscrits: ${context.studentCount}
- Enseignants: ${context.teacherCount}
- Classes: ${context.classCount}
- Absences aujourd'hui: ${context.todayAbsences}

🎯 TON RÔLE:
- Analyser les performances scolaires des élèves
- Identifier les élèves en difficulté et proposer des actions concrètes
- Donner des conseils pédagogiques personnalisés et actionnables
- Rédiger des observations de suivi bienveillantes et professionnelles
- Répondre aux questions sur les élèves, classes et résultats

📋 RÈGLES DE RÉPONSE:
- Réponds TOUJOURS en français
- Sois précis, bienveillant et actionnable
- Utilise des emojis avec modération pour structurer
- Propose toujours une action concrète après ton analyse
- Si tu n'as pas de données sur un élève, dis-le clairement
- Ne jamais inventer de données ou de notes

IMPORTANT: Tu as accès aux données réelles de l'école. Analyse-les avec discernement.`;
}

async function enrichMessage(userMessage, schoolId) {
  const lowerMsg = userMessage.toLowerCase();
  let enrichedContext = '';

  const studentMatch = lowerMsg.match(/(?:élève|étudiant|notes?|bulletin|suivi)\s+(?:de\s+)?([a-zÀ-ÿ\s]{3,30})/i);
  if (studentMatch) {
    const query = studentMatch[1].trim();
    const students = dbTools.searchStudents(schoolId, query);
    if (students.length > 0) {
      const student = students[0];
      const grades = dbTools.getStudentGrades(student.id);
      const attendance = dbTools.getStudentAttendance(student.id);
      enrichedContext += `\n\n[DONNÉES ÉLÈVE: ${student.first_name} ${student.last_name}]
Notes: \n${formatters.formatGrades(grades)}
Absences:\n${formatters.formatAttendance(attendance)}`;
    }
  }

  if (lowerMsg.includes('difficulté') || lowerMsg.includes('risque') || lowerMsg.includes('aide')) {
    const atRisk = dbTools.getStudentsAtRisk(schoolId);
    if (atRisk.length > 0) {
      enrichedContext += `\n\n[ÉLÈVES NÉCESSITANT UN SUIVI]\n${formatters.formatStudentList(atRisk)}`;
    }
  }

  const classMatch = lowerMsg.match(/classe\s+([0-9](?:ère?|ème?|e)?[a-zA-Z]?)/i);
  if (classMatch) {
    const classes = dbTools.getAllClasses(schoolId);
    const matchedClass = classes.find((c) =>
      c.name?.toLowerCase().includes(classMatch[1].toLowerCase())
    );
    if (matchedClass) {
      const averages = dbTools.getClassAverage(matchedClass.id);
      enrichedContext += `\n\n[MOYENNES CLASSE ${matchedClass.name}]\n${formatters.formatClassAverages(averages)}`;
    }
  }

  return enrichedContext;
}

module.exports = {
  id: AGENT_ID,
  name: 'Conseiller Pédagogique',
  description: 'Analyse les performances élèves et fournit des conseils pédagogiques',
  icon: '📚',
  model: MODEL,
  buildSystemPrompt,
  enrichMessage,
};
