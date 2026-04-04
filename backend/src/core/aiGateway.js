// ============================================================
// aiGateway.js — Middleware d'API Gateway (Rate limit & Guardrails)
// ============================================================
const { validateInput } = require('./guardrails');

// Simple Rate Limiter en mémoire (Démonstration/Sprint 2)
// Idéalement à brancher sur Redis avec 'express-rate-limit' en Sprint 5+
const RATE_LIMITS = new Map();
const MAX_REQUESTS_PER_MIN = parseInt(process.env.AI_RATE_LIMIT_PER_MIN || '20', 10);
const GUARDRAILS_ENABLED = process.env.AI_GUARDRAILS_ENABLED !== 'false';

/**
 * Middleware: Rate Limiter
 */
function aiRateLimiter(req, res, next) {
  const userId = req.user?.id || req.ip;
  const now = Date.now();
  
  if (!RATE_LIMITS.has(userId)) {
    RATE_LIMITS.set(userId, { count: 1, resetAt: now + 60000 });
    return next();
  }

  const record = RATE_LIMITS.get(userId);

  if (now > record.resetAt) {
    RATE_LIMITS.set(userId, { count: 1, resetAt: now + 60000 });
    return next();
  }

  record.count++;
  if (record.count > MAX_REQUESTS_PER_MIN) {
    return res.status(429).json({ 
      error: 'Trop de requêtes IA. Veuillez patienter une minute.',
      retryAfter: Math.ceil((record.resetAt - now) / 1000)
    });
  }

  next();
}

/**
 * Middleware: Input Guardrails
 */
function enforceGuardrails(req, res, next) {
  if (!GUARDRAILS_ENABLED) return next();
  
  // Si l'utilisateur a explicitement désactivé le mode strict dans sa requête
  if (req.body.isStrict === false) return next();

  // On s'attend à recevoir 'message' dans le body (pour chat ou agent)
  const userMessage = req.body.message;
  
  if (userMessage) {
    const check = validateInput(userMessage);
    if (!check.pass) {
      return res.status(403).json({
        error: "Message bloqué par le système de sécurité.",
        reason: check.reason,
        policyViolation: true
      });
    }
  }

  next();
}

/**
 * Nettoyage toutes les 5 minutes pour éviter la fuite de mémoire
 */
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of RATE_LIMITS.entries()) {
    if (now > record.resetAt) RATE_LIMITS.delete(key);
  }
}, 300000);

module.exports = {
  aiRateLimiter,
  enforceGuardrails
};
