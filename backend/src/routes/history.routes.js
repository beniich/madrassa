// src/routes/history.routes.js
const express = require("express");
const router = express.Router();
const { getHistory } = require("../controllers/history.controller");
const { authenticate, requireAdmin, requireSameSchool } = require("../middleware/auth.middleware");

// GET /api/settings/history/:schoolId
router.get("/:schoolId", authenticate, requireAdmin, requireSameSchool, getHistory);

module.exports = router;
