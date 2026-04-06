// ============================================================
// memoryManager.ts — Gestion de la mémoire des conversations
// ============================================================
import Database from 'better-sqlite3';
import path from 'path';

const MAX_TURNS = parseInt(process.env.AI_MEMORY_MAX_TURNS || '20', 10);

let db: Database.Database | null = null;

export function getDB(): Database.Database {
  if (!db) {
    db = new Database(path.join(__dirname, '../../school_genius.db'));
    initTables();
  }
  return db;
}

export function initTables() {
  const database = getDB();
  database.exec(`
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

export interface ConversationMessage {
  role: string;
  content: string;
  agent?: string;
}

export function getHistory(sessionId: string): ConversationMessage[] {
  const database = getDB();
  const rows = database
    .prepare(
      `SELECT role, content, agent FROM ai_conversations
       WHERE session_id = ?
       ORDER BY created_at DESC
       LIMIT ?`
    )
    .all(sessionId, MAX_TURNS * 2) as any[];

  return rows.reverse().map((r) => ({
    role: r.role,
    content: r.content,
    ...(r.agent && { agent: r.agent }),
  }));
}

export function saveMessage(sessionId: string, schoolId: string, userId: string, role: string, content: string, agent: string | null = null) {
  const database = getDB();
  database.prepare(
    `INSERT INTO ai_conversations (session_id, school_id, user_id, role, content, agent)
     VALUES (?, ?, ?, ?, ?, ?)`
  ).run(sessionId, schoolId, userId, role, content, agent);
}

export function clearHistory(sessionId: string) {
  const database = getDB();
  const info = database
    .prepare('DELETE FROM ai_conversations WHERE session_id = ?')
    .run(sessionId);
  return { deleted: info.changes };
}

export interface InsightInput {
  schoolId: string;
  type: string;
  agent?: string;
  title: string;
  content: string;
}

export function saveInsight({ schoolId, type, agent, title, content }: InsightInput) {
  const database = getDB();
  database.prepare(
    `INSERT INTO ai_insights (school_id, type, agent, title, content)
     VALUES (?, ?, ?, ?, ?)`
  ).run(schoolId, type, agent || null, title, content);
}

export function getInsights(schoolId: string, limit = 10): any[] {
  const database = getDB();
  return database
    .prepare(
      `SELECT * FROM ai_insights WHERE school_id = ? ORDER BY created_at DESC LIMIT ?`
    )
    .all(schoolId, limit) as any[];
}

export function markInsightsRead(schoolId: string) {
  const database = getDB();
  database.prepare('UPDATE ai_insights SET is_read = 1 WHERE school_id = ?').run(schoolId);
}

export interface ArtifactInput {
  schoolId: string;
  type: string;
  title: string;
  content: string;
  studentId?: string | null;
  classId?: string | null;
}

export function saveArtifact({ schoolId, type, title, content, studentId, classId }: ArtifactInput): number | bigint {
  const database = getDB();
  const result = database
    .prepare(
      `INSERT INTO ai_artifacts (school_id, type, title, content, student_id, class_id)
       VALUES (?, ?, ?, ?, ?, ?)`
    )
    .run(schoolId, type, title, content, studentId || null, classId || null);
  return result.lastInsertRowid;
}
