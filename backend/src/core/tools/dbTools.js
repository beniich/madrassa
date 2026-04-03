// ============================================================
// dbTools.js — Outils de requêtes DB structurées pour les agents
// ============================================================
const Database = require('better-sqlite3');
const path = require('path');

let db;

function getDB() {
  if (!db) {
    db = new Database(path.join(__dirname, '../../../../school_genius.db'), { readonly: true });
  }
  return db;
}

// ─── Contexte Général ────────────────────────────────────────

function getSchoolContext(schoolId) {
  const db = getDB();

  try {
    const school = db
      .prepare('SELECT * FROM schools WHERE id = ?')
      .get(schoolId) || { name: 'École', id: schoolId };

    const studentCount = db
      .prepare('SELECT COUNT(*) as count FROM students WHERE school_id = ?')
      .get(schoolId)?.count || 0;

    const teacherCount = db
      .prepare('SELECT COUNT(*) as count FROM teachers WHERE school_id = ?')
      .get(schoolId)?.count || 0;

    const classCount = db
      .prepare('SELECT COUNT(*) as count FROM classes WHERE school_id = ?')
      .get(schoolId)?.count || 0;

    const todayAbsences = db
      .prepare(
        `SELECT COUNT(*) as count FROM absences
         WHERE school_id = ? AND DATE(date) = DATE('now')`
      )
      .get(schoolId)?.count || 0;

    return {
      schoolName: school.name || 'École',
      schoolId,
      studentCount,
      teacherCount,
      classCount,
      todayAbsences,
      date: new Date().toLocaleDateString('fr-FR', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      }),
    };
  } catch (e) {
    return {
      schoolName: 'School Genius',
      schoolId,
      studentCount: 0,
      teacherCount: 0,
      classCount: 0,
      todayAbsences: 0,
      date: new Date().toLocaleDateString('fr-FR'),
    };
  }
}

// ─── Élèves ──────────────────────────────────────────────────

function getStudentById(studentId) {
  const db = getDB();
  return db.prepare('SELECT * FROM students WHERE id = ?').get(studentId);
}

function searchStudents(schoolId, query) {
  const db = getDB();
  const q = `%${query}%`;
  return db
    .prepare(
      `SELECT id, first_name, last_name, class_id, email
       FROM students
       WHERE school_id = ? AND (first_name LIKE ? OR last_name LIKE ? OR email LIKE ?)
       LIMIT 10`
    )
    .all(schoolId, q, q, q);
}

function getStudentGrades(studentId) {
  const db = getDB();
  return db
    .prepare(
      `SELECT g.*, s.name as subject_name
       FROM grades g
       LEFT JOIN subjects s ON g.subject_id = s.id
       WHERE g.student_id = ?
       ORDER BY g.date DESC
       LIMIT 30`
    )
    .all(studentId);
}

function getStudentAttendance(studentId) {
  const db = getDB();
  return db
    .prepare(
      `SELECT * FROM absences
       WHERE student_id = ?
       ORDER BY date DESC
       LIMIT 20`
    )
    .all(studentId);
}

function getStudentsAtRisk(schoolId, threshold = 10) {
  const db = getDB();
  return db
    .prepare(
      `SELECT s.id, s.first_name, s.last_name, s.class_id,
              COUNT(a.id) as absence_count,
              AVG(g.value) as avg_grade
       FROM students s
       LEFT JOIN absences a ON s.id = a.student_id
       LEFT JOIN grades g ON s.id = g.student_id
       WHERE s.school_id = ?
       GROUP BY s.id
       HAVING absence_count >= ? OR avg_grade < 10
       ORDER BY absence_count DESC
       LIMIT 20`
    )
    .all(schoolId, threshold);
}

// ─── Classes ─────────────────────────────────────────────────

function getClassById(classId) {
  const db = getDB();
  return db.prepare('SELECT * FROM classes WHERE id = ?').get(classId);
}

function getClassStudents(classId) {
  const db = getDB();
  return db
    .prepare('SELECT id, first_name, last_name, email FROM students WHERE class_id = ?')
    .all(classId);
}

function getClassAverage(classId) {
  const db = getDB();
  return db
    .prepare(
      `SELECT s.name as subject, ROUND(AVG(g.value), 2) as average
       FROM grades g
       JOIN students st ON g.student_id = st.id
       LEFT JOIN subjects s ON g.subject_id = s.id
       WHERE st.class_id = ?
       GROUP BY g.subject_id`
    )
    .all(classId);
}

function getAllClasses(schoolId) {
  const db = getDB();
  return db
    .prepare('SELECT id, name, level, teacher_id FROM classes WHERE school_id = ?')
    .all(schoolId);
}

// ─── Enseignants ─────────────────────────────────────────────

function getTeacherById(teacherId) {
  const db = getDB();
  return db.prepare('SELECT * FROM teachers WHERE id = ?').get(teacherId);
}

function getTeacherSchedule(teacherId) {
  const db = getDB();
  return db
    .prepare(
      `SELECT ts.*, s.name as subject_name, c.name as class_name
       FROM teacher_schedules ts
       LEFT JOIN subjects s ON ts.subject_id = s.id
       LEFT JOIN classes c ON ts.class_id = c.id
       WHERE ts.teacher_id = ?
       ORDER BY ts.day_of_week, ts.start_time`
    )
    .all(teacherId);
}

function findAvailableTeachers(schoolId, subjectId, slot) {
  const db = getDB();
  return db
    .prepare(
      `SELECT t.* FROM teachers t
       WHERE t.school_id = ? AND t.subject_id = ?
       AND t.id NOT IN (
         SELECT teacher_id FROM teacher_schedules
         WHERE day_of_week = ? AND start_time = ?
       )
       LIMIT 5`
    )
    .all(schoolId, subjectId, slot.day, slot.time);
}

// ─── Statistiques Globales ───────────────────────────────────

function getSchoolStats(schoolId) {
  const db = getDB();

  try {
    const totalStudents = db
      .prepare('SELECT COUNT(*) as n FROM students WHERE school_id = ?')
      .get(schoolId)?.n || 0;

    const absencesToday = db
      .prepare(
        `SELECT COUNT(*) as n FROM absences
         WHERE school_id = ? AND DATE(date) = DATE('now')`
      )
      .get(schoolId)?.n || 0;

    const absencesWeek = db
      .prepare(
        `SELECT COUNT(*) as n FROM absences
         WHERE school_id = ? AND date >= DATE('now', '-7 days')`
      )
      .get(schoolId)?.n || 0;

    const globalAvg = db
      .prepare(
        `SELECT ROUND(AVG(g.value), 2) as avg
         FROM grades g
         JOIN students s ON g.student_id = s.id
         WHERE s.school_id = ?`
      )
      .get(schoolId)?.avg || null;

    return {
      totalStudents,
      absencesToday,
      absencesWeek,
      absenceRate: totalStudents > 0 ? ((absencesToday / totalStudents) * 100).toFixed(1) : 0,
      globalAverage: globalAvg,
    };
  } catch {
    return { totalStudents: 0, absencesToday: 0, absencesWeek: 0, absenceRate: 0, globalAverage: null };
  }
}

function getGradeTrends(schoolId, days = 30) {
  const db = getDB();
  return db
    .prepare(
      `SELECT DATE(g.date) as day, ROUND(AVG(g.value), 2) as avg_grade, COUNT(*) as count
       FROM grades g
       JOIN students s ON g.student_id = s.id
       WHERE s.school_id = ? AND g.date >= DATE('now', ?)
       GROUP BY DATE(g.date)
       ORDER BY day`
    )
    .all(schoolId, `-${days} days`);
}

module.exports = {
  getSchoolContext,
  getStudentById,
  searchStudents,
  getStudentGrades,
  getStudentAttendance,
  getStudentsAtRisk,
  getClassById,
  getClassStudents,
  getClassAverage,
  getAllClasses,
  getTeacherById,
  getTeacherSchedule,
  findAvailableTeachers,
  getSchoolStats,
  getGradeTrends,
};
