// src/routes/ai.routes.js
const express = require("express");
const router = express.Router();
const { askCopilot } = require("../controllers/ai.controller");
const { authenticate } = require("../middleware/auth.middleware");

/**
 * POST /api/ai/ask
 * Pose une question à l'assistant IA
 * Optionnellement protégé par authenticate si on veut restreindre l'IA aux utilisateurs connectés.
 */
router.post("/ask", askCopilot);

module.exports = router;
