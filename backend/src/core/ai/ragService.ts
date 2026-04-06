// @ts-nocheck
// ============================================================
// ragService.js — Moteur de Recherche Vectorielle (RAG)
// ============================================================
const { db } = require('../../db');
const { aiDocumentChunks } = require('../../db/schema');
const { sql, eq, and } = require('drizzle-orm');
const ollamaClient = require('../ollamaClient');

/**
 * Transforme un texte en vecteur via Ollama (nomic-embed-text)
 */
async function generateEmbedding(text) {
  const model = process.env.AI_EMBEDDING_MODEL || 'nomic-embed-text';
  try {
    const res = await ollamaClient.embed({ model, prompt: text });
    return res.embedding;
  } catch (err) {
    console.error('[RAG] Erreur génération embedding:', err);
    throw err;
  }
}

/**
 * Recherche les segments les plus pertinents pour une requête
 */
async function searchSimilarChunks(schoolId, query, limit = 5) {
  const queryEmbedding = await generateEmbedding(query);
  const vectorStr = `[${queryEmbedding.join(',')}]`;

  // Utilisation de la distance cosinus (<=>) de pgvector
  // Plus la distance est petite, plus c'est similaire
  const similarityThreshold = 0.5; // Ajuster selon besoins

  try {
    const results = await db.execute(sql`
      SELECT content, metadata, (embedding <=> ${vectorStr}::vector) as distance
      FROM ai_document_chunks
      WHERE tenant_id = ${schoolId}
      ORDER BY distance ASC
      LIMIT ${limit}
    `);

    // Filtrer par distance si nécessaire
    return results.rows
      .filter(row => row.distance < similarityThreshold)
      .map(row => row.content);
  } catch (err) {
    console.error('[RAG] Erreur recherche vectorielle:', err);
    return [];
  }
}

/**
 * Indexe un nouveau document (découpage + vectorisation)
 */
async function ingestDocument(schoolId, docId, content, metadata = {}) {
  // 1. Découpage simple par paragraphe (chunking)
  // Idéalement: utiliser langchain ou un découpeur par taille fixe (ex: 500 chars avec overlap)
  const chunks = content.split('\n\n').filter(c => c.trim().length > 20);

  for (const chunkText of chunks) {
    const embedding = await generateEmbedding(chunkText);
    
    await db.insert(aiDocumentChunks).values({
      tenantId: schoolId,
      documentId: docId,
      content: chunkText,
      embedding: embedding,
      metadata: metadata,
    });
  }
  
  return chunks.length;
}

export default {
  generateEmbedding,
  searchSimilarChunks,
  ingestDocument
};

