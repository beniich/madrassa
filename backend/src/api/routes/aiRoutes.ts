// @ts-nocheck
// ============================================================
// aiRoutes.js — Routes /api/ai/*
// ============================================================
import express, { Request, Response, NextFunction } from 'express';
const router = express.Router();
import { v4 as uuidv4 } from 'uuid';

import * as orchestrator from '../../core/agentOrchestrator';
import * as ollamaClient from '../../core/ollamaClient';
import * as memoryManager from '../../core/memoryManager';
import { aiRateLimiter, enforceGuardrails } from '../../core/aiGateway';
import ragService from '../../core/ai/ragService';
import db from '../../db/index';
import { aiDocuments } from '../../db/schema';

// Middleware d'auth
function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ error: 'Non autorisé: Token manquant' });
  }
  
  // TODO: Validation JWT Firebase réelle requise ici
  req.user = { id: 'authenticated-user' };
  
  // Le middleware tenant (tenantMiddleware) injecte req.tenantId
  req.schoolId = req.tenantId || req.headers['x-school-id'];
  
  if (!req.schoolId) {
    return res.status(400).json({ error: 'schoolId (tenant) manquant' });
  }
  
  next();
}

// ─── GET /api/ai/status ─────────────────────────────────────
router.get('/status', async (req, res) => {
  try {
    const status = await ollamaClient.checkStatus();
    res.json(status);
  } catch (err) {
    res.status(503).json({ online: false, error: err.message });
  }
});

// ─── GET /api/ai/models ─────────────────────────────────────
router.get('/models', authenticateToken, async (req, res) => {
  try {
    const data = await ollamaClient.listModels();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Impossible de récupérer les modèles', details: err.message });
  }
});

// ─── GET /api/ai/agents ─────────────────────────────────────
router.get('/agents', authenticateToken, (req, res) => {
  res.json({ agents: orchestrator.getAgentList() });
});

// ─── POST /api/ai/chat — Chat Streaming SSE ─────────────────
router.post('/chat', authenticateToken, aiRateLimiter, enforceGuardrails, async (req, res) => {
  const { message, sessionId, agentHint, model, isStrict } = req.body;

  if (!message || message.trim() === '') {
    return res.status(400).json({ error: 'Le message ne peut pas être vide' });
  }

  const sid = sessionId || uuidv4();

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders();

  let fullResponse = '';
  let agentId = 'chat';

  try {
    const { stream, agentId: detectedAgent, agentName, agentIcon } = await orchestrator.dispatch({
      userMessage: message,
      schoolId: req.schoolId,
      userId: req.user.id,
      sessionId: sid,
      agentHint,
      modelOverride: model,
      isStrict: isStrict !== undefined ? isStrict : true
    });

    agentId = detectedAgent;

    res.write(
      `event: agent\ndata: ${JSON.stringify({
        agentId: detectedAgent,
        agentName,
        agentIcon,
        sessionId: sid,
      })}\n\n`
    );

    for await (const chunk of stream) {
      try {
        const parsed = JSON.parse(chunk.toString());
        const token = parsed.message?.content || '';

        if (token) {
          fullResponse += token;
          res.write(`event: token\ndata: ${JSON.stringify({ token })}\n\n`);
        }

        if (parsed.done) break;
      } catch {
        // Chunk invalide, ignorer
      }
    }

    orchestrator.saveAssistantResponse(sid, req.schoolId, req.user.id, fullResponse, agentId);
    res.write(`event: done\ndata: ${JSON.stringify({ sessionId: sid })}\n\n`);
  } catch (err) {
    console.error('[AI Chat] Erreur:', err);
    res.write(`event: error\ndata: ${JSON.stringify({ error: err.message })}\n\n`);
  } finally {
    res.end();
  }
});

// ─── POST /api/ai/agent/:agentId ────────────────────────────
router.post('/agent/:agentId', authenticateToken, aiRateLimiter, enforceGuardrails, async (req, res) => {
  const { agentId } = req.params;
  const { message, sessionId } = req.body;

  if (!message) return res.status(400).json({ error: 'Message requis' });

  const sid = sessionId || uuidv4();

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  let fullResponse = '';

  try {
    const { stream, agentName, agentIcon } = await orchestrator.dispatch({
      userMessage: message,
      schoolId: req.schoolId,
      userId: req.user.id,
      sessionId: sid,
      agentHint: agentId,
    });

    res.write(
      `event: agent\ndata: ${JSON.stringify({ agentId, agentName, agentIcon, sessionId: sid })}\n\n`
    );

    for await (const chunk of stream) {
      try {
        const parsed = JSON.parse(chunk.toString());
        const token = parsed.message?.content || '';
        if (token) {
          fullResponse += token;
          res.write(`event: token\ndata: ${JSON.stringify({ token })}\n\n`);
        }
        if (parsed.done) break;
      } catch {}
    }

    orchestrator.saveAssistantResponse(sid, req.schoolId, req.user.id, fullResponse, agentId);
    res.write(`event: done\ndata: ${JSON.stringify({ sessionId: sid })}\n\n`);
  } catch (err) {
    res.write(`event: error\ndata: ${JSON.stringify({ error: err.message })}\n\n`);
  } finally {
    res.end();
  }
});

// ─── GET /api/ai/history/:sessionId ─────────────────────────
router.get('/history/:sessionId', authenticateToken, (req, res) => {
  try {
    const history = memoryManager.getHistory(req.params.sessionId);
    res.json({ history, sessionId: req.params.sessionId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── DELETE /api/ai/history/:sessionId ──────────────────────
router.delete('/history/:sessionId', authenticateToken, (req, res) => {
  try {
    const result = memoryManager.clearHistory(req.params.sessionId);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── GET /api/ai/insights ───────────────────────────────────
router.get('/insights', authenticateToken, (req, res) => {
  try {
    const insights = memoryManager.getInsights(req.schoolId);
    res.json({ insights });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── POST /api/ai/insights ──────────────────────────────────
router.post('/insights', authenticateToken, async (req, res) => {
  try {
    const insights = await orchestrator.generateAutoInsights(req.schoolId);
    res.json({ success: true, insights });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── PATCH /api/ai/insights/read ────────────────────────────
router.patch('/insights/read', authenticateToken, (req, res) => {
  try {
    memoryManager.markInsightsRead(req.schoolId);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── POST /api/ai/document ──────────────────────────────────
router.post('/document', authenticateToken, aiRateLimiter, enforceGuardrails, async (req, res) => {
  const { type, studentId, classId, period, extra } = req.body;

  const promptMap = {
    report_card: `Génère un bulletin scolaire complet${studentId ? ` pour l'élève ID ${studentId}` : ''}${period ? ` pour ${period}` : ''}.`,
    parent_letter: `Rédige une lettre officielle aux parents${studentId ? ` concernant l'élève ID ${studentId}` : ''}.${extra ? ' ' + extra : ''}`,
    class_report: `Rédige un compte rendu de conseil de classe${classId ? ` pour la classe ${classId}` : ''}${period ? ` — ${period}` : ''}.`,
  };

  const message = promptMap[type] || extra || 'Génère un document scolaire officiel.';
  const sid = uuidv4();

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  let fullContent = '';

  try {
    const { stream } = await orchestrator.dispatch({
      userMessage: message,
      schoolId: req.schoolId,
      userId: req.user.id,
      sessionId: sid,
      agentHint: 'document',
    });

    res.write(`event: agent\ndata: ${JSON.stringify({ agentId: 'document' })}\n\n`);

    for await (const chunk of stream) {
      try {
        const parsed = JSON.parse(chunk.toString());
        const token = parsed.message?.content || '';
        if (token) {
          fullContent += token;
          res.write(`event: token\ndata: ${JSON.stringify({ token })}\n\n`);
        }
        if (parsed.done) break;
      } catch {}
    }

    const artifactId = memoryManager.saveArtifact({
      schoolId: req.schoolId,
      type: type || 'document',
      title: `Document généré — ${new Date().toLocaleDateString('fr-FR')}`,
      content: fullContent,
      studentId: studentId || null,
      classId: classId || null,
    });

    res.write(`event: done\ndata: ${JSON.stringify({ artifactId, sessionId: sid })}\n\n`);
  } catch (err) {
    res.write(`event: error\ndata: ${JSON.stringify({ error: err.message })}\n\n`);
  } finally {
    res.end();
  }
});

// ─── POST /api/ai/ingest — Ingestion de document pour RAG ──
router.post('/ingest', authenticateToken, async (req, res) => {
  const { title, content, fileType, metadata } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: 'Titre et contenu requis pour l\'ingestion.' });
  }

  try {
    // 1. Sauvegarde métadonnées document
    const [doc] = await db.insert(aiDocuments).values({
      tenantId: req.schoolId,
      title,
      content,
      fileType: fileType || 'txt',
      metadata: metadata || {}
    }).returning();

    // 2. Lancer l'ingestion asynchrone (chunking + vectorisation)
    const chunkCount = await ragService.ingestDocument(req.schoolId, doc.id, content, metadata);

    res.json({ 
      success: true, 
      documentId: doc.id, 
      chunkCount,
      message: `${chunkCount} segments vectorisés avec succès.`
    });
  } catch (err) {
    console.error('[AI Ingest] Erreur:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;

