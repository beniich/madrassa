// ============================================================
// memoryManager.ts — Gestion de la mémoire des conversations (Migrated to PostgreSQL via Drizzle)
// ============================================================
import db from '../db/index';
import { aiConversations, aiInsights, aiArtifacts } from '../db/schema';
import { eq, desc } from 'drizzle-orm';

const MAX_TURNS = parseInt(process.env.AI_MEMORY_MAX_TURNS || '20', 10);

export function initTables() {
  // SQLite table init function - now obsolete because of Drizzle migrations
}

export interface ConversationMessage {
  role: string;
  content: string;
  agent?: string;
}

export async function getHistory(sessionId: string): Promise<ConversationMessage[]> {
  const rows = await db
    .select({ role: aiConversations.role, content: aiConversations.content, agent: aiConversations.agent })
    .from(aiConversations)
    .where(eq(aiConversations.sessionId, sessionId))
    .orderBy(desc(aiConversations.createdAt))
    .limit(MAX_TURNS * 2);

  return rows.reverse().map((r) => ({
    role: r.role,
    content: r.content,
    ...(r.agent && { agent: r.agent }),
  }));
}

export async function saveMessage(sessionId: string, schoolId: string, userId: string, role: string, content: string, agent: string | null = null) {
  if (!schoolId) {
    console.warn('[memoryManager] saveMessage skipped: schoolId is undefined', { sessionId });
    return;
  }
  await db.insert(aiConversations).values({
    sessionId,
    tenantId: schoolId,
    userId,
    role,
    content,
    agent: agent || undefined,
  });
}

export async function clearHistory(sessionId: string) {
  const result = await db.delete(aiConversations).where(eq(aiConversations.sessionId, sessionId));
  return { deleted: result.rowCount || 0 };
}

export interface InsightInput {
  schoolId: string;
  type: string;
  agent?: string;
  title: string;
  content: string;
}

export async function saveInsight({ schoolId, type, agent, title, content }: InsightInput) {
  await db.insert(aiInsights).values({
    tenantId: schoolId,
    type,
    agent: agent || undefined,
    title,
    content,
  });
}

export async function getInsights(schoolId: string, limit = 10) {
  return await db
    .select()
    .from(aiInsights)
    .where(eq(aiInsights.tenantId, schoolId))
    .orderBy(desc(aiInsights.createdAt))
    .limit(limit);
}

export async function markInsightsRead(schoolId: string) {
  await db
    .update(aiInsights)
    .set({ isRead: true })
    .where(eq(aiInsights.tenantId, schoolId));
}

export interface ArtifactInput {
  schoolId: string;
  type: string;
  title: string;
  content: string;
  studentId?: string | null;
  classId?: string | null;
}

export async function saveArtifact({ schoolId, type, title, content, studentId, classId }: ArtifactInput) {
  const result = await db
    .insert(aiArtifacts)
    .values({
      tenantId: schoolId,
      type,
      title,
      content,
      studentId: studentId || undefined,
      classId: classId || undefined,
    })
    .returning({ id: aiArtifacts.id });
  return result[0].id;
}
