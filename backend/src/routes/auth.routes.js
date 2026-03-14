// src/routes/auth.routes.js
const express = require("express");
const router = express.Router();
const { login, sync } = require("../controllers/auth.controller");
const { authenticate } = require("../middleware/auth.middleware");

// POST /api/auth/login
router.post("/login", login);

// POST /api/auth/sync
router.post("/sync", sync);

module.exports = router;
