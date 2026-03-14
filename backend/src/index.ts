import express from 'express';
import cors from 'cors';
import auditRoutes from './api/routes/audit';
import flashbackRoutes from './api/routes/flashback';
import cronRoutes from './api/routes/cron';
import dotenv from 'dotenv';
import path from 'path';

// Load .env
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/audit', auditRoutes);
app.use('/api/flashback', flashbackRoutes);
app.use('/api/cron/jobs', cronRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date() });
});

app.listen(PORT, () => {
  console.log(`[Backend] Server running on http://localhost:${PORT}`);
});
