// ============================================================
// memoryManager.js — Gestion de la mémoire des conversations
// ============================================================
const Database = require('better-sqlite3');
const path = require('path');

const MAX_TURNS = parseInt(process.env.AI_MEMORY_MAX_TURNS || '20', 10);

let db;

function getDB() {
  if (!db) {
    db = new Database(path.join(__dirname, '../../school_genius.db'));
    initTables();
  }
  return db;
}

function initTables() {
  getDB().exec(`
    CREATE TABLE IF NOT EXISTS ai_conversations (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id  TEXT NOT NULL,
      school_id   TEXT NOT NULL,
      user_id     TEXT NOT NULL,
      role        TEXT NOT NULL CHECK(role IN ('user','assistant','system')),
      agent       TEXT,
      content     TEXT NOT NULL,
      created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_conv_session ON ai_conversations(session_id);
    CREATE INDEX IF NOT EXISTS idx_conv_school  ON ai_conversations(school_id);

    CREATE TABLE IF NOT EXISTS ai_insights (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      school_id   TEXT NOT NULL,
      type        TEXT NOT NULL,
      agent       TEXT,
      title       TEXT NOT NULL,
      content     TEXT NOT NULL,
      is_read     BOOLEAN DEFAULT 0,
      created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS ai_artifacts (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      school_id   TEXT NOT NULL,
      type        TEXT NOT NULL,
      title       TEXT NOT NULL,
      content     TEXT NOT NULL,
      student_id  TEXT,
      class_id    TEXT,
      created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

/**
 * Récupère l'historique de la session (limité à MAX_TURNS derniers messages)
 */
function getHistory(sessionId) {
  const db = getDB();
  const rows = db
    .prepare(
      `SELECT role, content, agent FROM ai_conversations
       WHERE session_id = ?
       ORDER BY created_at DESC
       LIMIT ?`
    )
    .all(sessionId, MAX_TURNS * 2);

  return rows.reverse().map((r) => ({
    role: r.role,
    content: r.content,
    ...(r.agent && { agent: r.agent }),
  }));
}

/**
 * Sauvegarde un message dans l'historique
 */
function saveMessage(sessionId, schoolId, userId, role, content, agent = null) {
  const db = getDB();
  db.prepare(
    `INSERT INTO ai_conversations (session_id, school_id, user_id, role, content, agent)
     VALUES (?, ?, ?, ?, ?, ?)`
  ).run(sessionId, schoolId, userId, role, content, agent);
}

/**
 * Efface l'historique d'une session
 */
function clearHistory(sessionId) {
  const db = getDB();
  const info = db
    .prepare('DELETE FROM ai_conversations WHERE session_id = ?')
    .run(sessionId);
  return { deleted: info.changes };
}

/**
 * Sauvegarde un insight généré par un agent
 */
function saveInsight({ schoolId, type, agent, title, content }) {
  const db = getDB();
  db.prepare(
    `INSERT INTO ai_insights (school_id, type, agent, title, content)
     VALUES (?, ?, ?, ?, ?)`
  ).run(schoolId, type, agent, title, content);
}

/**
 * Récupère les insights non lus pour une école
 */
function getInsights(schoolId, limit = 10) {
  const db = getDB();
  return db
    .prepare(
      `SELECT * FROM ai_insights WHERE school_id = ? ORDER BY created_at DESC LIMIT ?`
    )
    .all(schoolId, limit);
}

/**
 * Marque les insights comme lus
 */
function markInsightsRead(schoolId) {
  const db = getDB();
  db.prepare('UPDATE ai_insights SET is_read = 1 WHERE school_id = ?').run(schoolId);
}

/**
 * Sauvegarde un artefact généré (bulletin, lettre…)
 */
function saveArtifact({ schoolId, type, title, content, studentId, classId }) {
  const db = getDB();
  const result = db
    .prepare(
      `INSERT INTO ai_artifacts (school_id, type, title, content, student_id, class_id)
       VALUES (?, ?, ?, ?, ?, ?)`
    )
    .run(schoolId, type, title, content, studentId || null, classId || null);
  return result.lastInsertRowid;
}

module.exports = {
  initTables,
  getHistory,
  saveMessage,
  clearHistory,
  saveInsight,
  getInsights,
  markInsightsRead,
  saveArtifact,
};
