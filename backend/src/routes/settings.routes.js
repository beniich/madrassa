// src/routes/settings.routes.js
const express = require("express");
const router = express.Router();

const {
  getSettings,
  updateSettings,
  resetSettings,
  exportTailwindConfig,
} = require("../controllers/settings.controller");

const { authenticate, requireAdmin, requireSameSchool } = require("../middleware/auth.middleware");
const { validateStyleUpdate } = require("../middleware/validation.middleware");

// GET /api/settings/:schoolId — Lecture (tous les rôles authentifiés)
router.get("/:schoolId", authenticate, requireSameSchool, getSettings);

// PUT /api/settings/:schoolId — Mise à jour (admin/directeur uniquement)
router.put(
  "/:schoolId",
  authenticate,
  requireAdmin,
  requireSameSchool,
  validateStyleUpdate,
  updateSettings
);

// PATCH /api/settings/:schoolId/reset — Remise à zéro (admin uniquement)
router.patch(
  "/:schoolId/reset",
  authenticate,
  requireAdmin,
  requireSameSchool,
  resetSettings
);

// GET /api/settings/:schoolId/export — Export Tailwind config
router.get("/:schoolId/export", authenticate, requireSameSchool, exportTailwindConfig);

module.exports = router;
