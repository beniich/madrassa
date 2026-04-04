// ============================================================
// schoolAdvisorAgent.js — Conseiller Pédagogique IA
// ============================================================
const dbTools = require('../tools/dbTools');
const formatters = require('../tools/formatters');

const AGENT_ID = 'school_advisor';
const MODEL = process.env.AI_SCHOOL_ADVISOR_MODEL || 'mistral:7b';

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

📋 RÈGLES ABSOLUES ET STRICTES (GUARDRAILS) :
1. Tu parles UNIQUEMENT en français.
2. Tu ne traites QUE les sujets scolaires (élèves, classes, notes, absences). Refuse catégoriquement tout autre sujet.
3. Tes données sont STRICTEMENT CONFIDENTIELLES. Masque systématiquement les emails et numéros de téléphones personnels.
4. Base-toi UNIQUEMENT sur le contexte de données fourni. Ne jamais inventer une note, absence ou prénom.
5. Sois très concis et direct. Limite-toi à 3 recommandations pédagogiques maximum par réponse.
6. Si tu n'as pas de données sur un élève ou objet de la requête, signale-le immédiatement et demande des précisions.
7. Tu as accès aux données de l'école. Analyse-les avec un grand discernement professionnel.`;
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
