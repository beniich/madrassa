// src/index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const authRoutes = require("./routes/auth.routes");
const settingsRoutes = require("./routes/settings.routes");
const historyRoutes = require("./routes/history.routes");
const aiRoutes = require("./routes/ai.routes");
const hrRoutes = require("./routes/hr.routes");
const configRoutes = require("./routes/config.routes");
const { errorHandler } = require("./middleware/error.middleware");

const app = express();
const PORT = process.env.PORT || 3001;

// ─── Sécurité ─────────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
}));

// ─── Rate limiting ────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { error: "Trop de requêtes, réessayez dans 15 minutes." },
});
app.use("/api/", limiter);

// ─── Parsing ──────────────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// ─── Routes ───────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/settings/history", historyRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/hr", hrRoutes);
app.use("/api/config", configRoutes);

// ─── Health check ────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV,
  });
});

// ─── 404 ─────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} introuvable.` });
});

// ─── Error handler global ────────────────────────────────────
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`\n🏫 School Settings API démarré sur http://localhost:${PORT}`);
  console.log(`📋 Environnement : ${process.env.NODE_ENV}`);
  console.log(`📡 Routes disponibles :`);
  console.log(`   POST   /api/auth/login`);
  console.log(`   GET    /api/auth/me`);
  console.log(`   GET    /api/settings/:schoolId`);
  console.log(`   PUT    /api/settings/:schoolId`);
  console.log(`   PATCH  /api/settings/:schoolId/reset`);
  console.log(`   GET    /api/settings/:schoolId/export`);
  console.log(`   GET    /api/settings/history/:schoolId\n`);
});

module.exports = app;
