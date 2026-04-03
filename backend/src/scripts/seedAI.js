// ============================================================
// seedAI.js — Initialisation de la base de données AI (SQLite)
// ============================================================
const Database = require('better-sqlite3');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DB_PATH = path.join(__dirname, '../../school_genius.db');
const db = new Database(DB_PATH);

console.log(`[Seed] Initialisation de la base: ${DB_PATH}`);

function init() {
  db.exec(`
    -- Écoles
    CREATE TABLE IF NOT EXISTS schools (
      id    TEXT PRIMARY KEY,
      name  TEXT NOT NULL
    );

    -- Matières
    CREATE TABLE IF NOT EXISTS subjects (
      id    TEXT PRIMARY KEY,
      name  TEXT NOT NULL
    );

    -- Élèves
    CREATE TABLE IF NOT EXISTS students (
      id          TEXT PRIMARY KEY,
      school_id   TEXT NOT NULL,
      first_name  TEXT NOT NULL,
      last_name   TEXT NOT NULL,
      class_id    TEXT,
      email       TEXT,
      FOREIGN KEY(school_id) REFERENCES schools(id)
    );

    -- Enseignants
    CREATE TABLE IF NOT EXISTS teachers (
      id          TEXT PRIMARY KEY,
      school_id   TEXT NOT NULL,
      first_name  TEXT NOT NULL,
      last_name   TEXT NOT NULL,
      email       TEXT,
      subject_id  TEXT,
      FOREIGN KEY(school_id) REFERENCES schools(id),
      FOREIGN KEY(subject_id) REFERENCES subjects(id)
    );

    -- Classes
    CREATE TABLE IF NOT EXISTS classes (
      id          TEXT PRIMARY KEY,
      school_id   TEXT NOT NULL,
      name        TEXT NOT NULL,
      level       TEXT,
      teacher_id  TEXT,
      FOREIGN KEY(school_id) REFERENCES schools(id),
      FOREIGN KEY(teacher_id) REFERENCES teachers(id)
    );

    -- Notes
    CREATE TABLE IF NOT EXISTS grades (
      id          TEXT PRIMARY KEY,
      student_id  TEXT NOT NULL,
      subject_id  TEXT NOT NULL,
      value       REAL NOT NULL,
      date        DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(student_id) REFERENCES students(id),
      FOREIGN KEY(subject_id) REFERENCES subjects(id)
    );

    -- Absences
    CREATE TABLE IF NOT EXISTS absences (
      id          TEXT PRIMARY KEY,
      student_id  TEXT NOT NULL,
      school_id   TEXT NOT NULL,
      date        DATETIME DEFAULT CURRENT_TIMESTAMP,
      reason      TEXT,
      justified   BOOLEAN DEFAULT 0,
      FOREIGN KEY(student_id) REFERENCES students(id),
      FOREIGN KEY(school_id) REFERENCES schools(id)
    );

    -- Emplois du temps
    CREATE TABLE IF NOT EXISTS teacher_schedules (
      id           TEXT PRIMARY KEY,
      teacher_id   TEXT NOT NULL,
      subject_id   TEXT NOT NULL,
      class_id     TEXT NOT NULL,
      day_of_week  INTEGER NOT NULL,
      start_time   TEXT NOT NULL,
      end_time     TEXT NOT NULL,
      FOREIGN KEY(teacher_id) REFERENCES teachers(id),
      FOREIGN KEY(subject_id) REFERENCES subjects(id),
      FOREIGN KEY(class_id) REFERENCES classes(id)
    );
  `);

  console.log('[Seed] Tables créées.');

  // Données de base
  const schoolId = 'school-1';
  db.prepare('INSERT OR IGNORE INTO schools (id, name) VALUES (?, ?)').run(schoolId, 'Madrassa Genius');

  const subjects = [
    { id: 'math', name: 'Mathématiques' },
    { id: 'fr', name: 'Français' },
    { id: 'hist', name: 'Histoire-Géo' },
    { id: 'sci', name: 'Sciences' },
  ];
  const insertSubj = db.prepare('INSERT OR IGNORE INTO subjects (id, name) VALUES (@id, @name)');
  subjects.forEach(s => insertSubj.run(s));

  // Classes
  const class6A = '6A';
  db.prepare('INSERT OR IGNORE INTO classes (id, school_id, name, level) VALUES (?, ?, ?, ?)')
    .run(class6A, schoolId, '6ème A', '6ème');

  // Élèves
  const students = [
    { id: 'std-1', first: 'Jean', last: 'Dupont', class: class6A, email: 'jean@test.com' },
    { id: 'std-2', first: 'Marie', last: 'Curie', class: class6A, email: 'marie@test.com' },
    { id: 'std-3', first: 'Amine', last: 'Bennani', class: class6A, email: 'amine@test.com' },
  ];
  const insertStudent = db.prepare('INSERT OR IGNORE INTO students (id, school_id, first_name, last_name, class_id, email) VALUES (?, ?, ?, ?, ?, ?)');
  students.forEach(s => insertStudent.run(s.id, schoolId, s.first, s.last, s.class, s.email));

  // Notes
  const insertGrade = db.prepare('INSERT INTO grades (id, student_id, subject_id, value, date) VALUES (?, ?, ?, ?, ?)');
  students.forEach(s => {
    subjects.forEach(subj => {
      const val = 10 + Math.random() * 8; // Random note entre 10 et 18
      insertGrade.run(uuidv4(), s.id, subj.id, parseFloat(val.toFixed(2)), new Date().toISOString());
    });
  });

  // Absences
  db.prepare('INSERT OR IGNORE INTO absences (id, student_id, school_id, date, reason, justified) VALUES (?, ?, ?, ?, ?, ?)')
    .run(uuidv4(), 'std-1', schoolId, new Date().toISOString(), 'Grippe', 1);

  console.log('[Seed] Données de démonstration insérées.');
}

try {
  init();
  console.log('[Seed] Terminé avec succès.');
} catch (err) {
  console.error('[Seed] Erreur:', err.message);
} finally {
  db.close();
}
