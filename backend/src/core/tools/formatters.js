// ============================================================
// formatters.js — Formatage et structuration des réponses agents
// ============================================================

function formatStudentList(students) {
  if (!students || students.length === 0) return 'Aucun élève trouvé.';
  return students
    .map(
      (s, i) =>
        `${i + 1}. ${s.first_name} ${s.last_name} (Classe: ${s.class_id || 'N/A'})` +
        (s.absence_count ? ` — ${s.absence_count} absence(s)` : '') +
        (s.avg_grade ? ` — Moyenne: ${s.avg_grade}/20` : '')
    )
    .join('\n');
}

function formatGrades(grades) {
  if (!grades || grades.length === 0) return 'Aucune note disponible.';
  const bySubject = grades.reduce((acc, g) => {
    const subj = g.subject_name || 'Matière inconnue';
    if (!acc[subj]) acc[subj] = [];
    acc[subj].push(g.value);
    return acc;
  }, {});

  return Object.entries(bySubject)
    .map(([subj, vals]) => {
      const avg = (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1);
      const min = Math.min(...vals);
      const max = Math.max(...vals);
      return `• ${subj}: Moy. ${avg}/20 (min: ${min}, max: ${max}, ${vals.length} note(s))`;
    })
    .join('\n');
}

function formatAttendance(absences) {
  if (!absences || absences.length === 0) return 'Aucune absence enregistrée.';
  return absences
    .map((a) => {
      const date = new Date(a.date).toLocaleDateString('fr-FR');
      const justified = a.justified ? '✓ justifiée' : '✗ non justifiée';
      return `• ${date}: ${a.reason || 'Sans motif'} (${justified})`;
    })
    .join('\n');
}

function formatSchoolStats(stats) {
  return `
📊 Statistiques du jour:
• Élèves total: ${stats.totalStudents}
• Absences aujourd'hui: ${stats.absencesToday} (${stats.absenceRate}%)
• Absences cette semaine: ${stats.absencesWeek}
• Moyenne générale: ${stats.globalAverage ? `${stats.globalAverage}/20` : 'Non disponible'}
  `.trim();
}

function formatClassAverages(averages) {
  if (!averages || averages.length === 0) return 'Aucune donnée de moyennes.';
  return averages
    .map((a) => `• ${a.subject || 'Matière'}: ${a.average}/20`)
    .join('\n');
}

function formatSchedule(schedule) {
  const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  if (!schedule || schedule.length === 0) return 'Aucun créneau planifié.';

  const byDay = schedule.reduce((acc, slot) => {
    const day = days[slot.day_of_week - 1] || `Jour ${slot.day_of_week}`;
    if (!acc[day]) acc[day] = [];
    acc[day].push(slot);
    return acc;
  }, {});

  return Object.entries(byDay)
    .map(([day, slots]) => {
      const slotLines = slots
        .map((s) => `  ${s.start_time}–${s.end_time}: ${s.subject_name} (${s.class_name})`)
        .join('\n');
      return `${day}:\n${slotLines}`;
    })
    .join('\n\n');
}

function buildReportCardTemplate({ student, grades, attendance, classAverages, period }) {
  const absenceCount = attendance ? attendance.length : 0;
  const justified = attendance ? attendance.filter((a) => a.justified).length : 0;

  return `
# BULLETIN SCOLAIRE — ${period || 'Semestre 1'}

**Établissement:** School Genius  
**Date:** ${new Date().toLocaleDateString('fr-FR')}

---

## Informations Élève
- **Nom:** ${student?.last_name?.toUpperCase() || '___'} ${student?.first_name || '___'}
- **Classe:** ${student?.class_id || '___'}

---

## Résultats par Matière

${
  grades
    ? Object.entries(
        grades.reduce((acc, g) => {
          const subj = g.subject_name || 'Matière';
          if (!acc[subj]) acc[subj] = [];
          acc[subj].push(g.value);
          return acc;
        }, {})
      )
        .map(([subj, vals]) => {
          const avg = (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1);
          const classAvg = classAverages?.find((c) => c.subject === subj)?.average || '—';
          const appreciation =
            avg >= 16
              ? 'Très bien'
              : avg >= 14
              ? 'Bien'
              : avg >= 12
              ? 'Assez bien'
              : avg >= 10
              ? 'Passable'
              : 'Insuffisant';
          return `| ${subj} | ${avg}/20 | ${classAvg}/20 | ${appreciation} |`;
        })
        .join('\n')
    : '| — | — | — | — |'
}

**En-tête tableau:** | Matière | Moyenne élève | Moyenne classe | Appréciation |

---

## Vie Scolaire
- **Absences:** ${absenceCount} (dont ${justified} justifiées)
- **Retards:** À compléter

---

## Observations Générales
_À compléter par l'équipe pédagogique_

---

*Bulletin généré par School Genius AI le ${new Date().toLocaleDateString('fr-FR')}*
`.trim();
}

function buildParentLetterTemplate({ student, reason, details, schoolName }) {
  return `
**${schoolName || 'School Genius'}**  
${new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}

---

**Objet :** ${reason}

Madame, Monsieur,

Nous vous contactons concernant votre enfant **${student?.first_name || '___'} ${student?.last_name?.toUpperCase() || '___'}**, élève en classe de **${student?.class_id || '___'}**.

${details || '[Détails à compléter]'}

Nous restons à votre disposition pour tout renseignement complémentaire.

Veuillez agréer, Madame, Monsieur, l'expression de nos cordiales salutations.

**La Direction**  
${schoolName || 'School Genius'}
`.trim();
}

module.exports = {
  formatStudentList,
  formatGrades,
  formatAttendance,
  formatSchoolStats,
  formatClassAverages,
  formatSchedule,
  buildReportCardTemplate,
  buildParentLetterTemplate,
};
