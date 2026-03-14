import { Router, Request, Response } from 'express';
import { getAuditLogs } from '../../core/audit';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const table = req.query.table as string;
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;

    const logs = await getAuditLogs({ table, limit, offset });
    res.json(logs);
  } catch (error) {
    console.error('Audit Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
