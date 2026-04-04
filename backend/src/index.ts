import express from 'express';
import cors from 'cors';
import auditRoutes from './api/routes/audit';
import flashbackRoutes from './api/routes/flashback';
import cronRoutes from './api/routes/cron';
import stripeRoutes from './api/routes/stripe';
import tenantRoutes from './api/routes/tenants';
import superAdminRoutes from './api/routes/superAdmin';
import { tenantMiddleware } from './core/tenant/tenantMiddleware';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const aiRoutes = require('./api/routes/aiRoutes');
import dotenv from 'dotenv';
import path from 'path';

// Load .env
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const app = express();
const PORT = process.env.PORT || 4000;

// ─── Middlewares globaux ─────────────────────────────────────────────────────

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

// Stripe webhook nécessite le raw body — AVANT express.json()
app.use('/api/stripe/webhook', express.raw({ type: 'application/json' }));

app.use(express.json({ limit: '10mb' }));

// Middleware tenant sur toutes les routes (sauf exclusions internes)
app.use(tenantMiddleware);

// ─── Routes ─────────────────────────────────────────────────────────────────

// Routes publiques (pas de tenant requis)
app.use('/api/tenants', tenantRoutes);
app.use('/api/stripe', stripeRoutes);

// Routes app (tenant requis via middleware)
app.use('/api/audit', auditRoutes);
app.use('/api/flashback', flashbackRoutes);
app.use('/api/cron/jobs', cronRoutes);
app.use('/api/ai', aiRoutes);

// Super Admin (clé master)
app.use('/api/super-admin', superAdminRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    time: new Date(),
    version: '2.0.0',
    features: ['multitenant', 'drizzle-orm', 'stripe'],
  });
});

app.listen(PORT, () => {
  console.log(`[Backend] 🚀 Server running on http://localhost:${PORT}`);
  console.log(`[Backend] 🏫 Multitenant mode: enabled`);
  console.log(`[Backend] 💳 Stripe: ${process.env.STRIPE_SECRET_KEY ? 'configured' : 'NOT SET'}`);
});