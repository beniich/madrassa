import { Router, Request, Response } from 'express';
import { queryAsOf } from '../../core/flashback';
import { z } from 'zod';

const router = Router();

const querySchema = z.object({
  table: z.string(),
  id: z.string(),
  at: z.string().datetime()
});

router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = querySchema.safeParse(req.query);
    if (!parsed.success) {
      res.status(400).json({ error: 'Invalid parameters', details: parsed.error.format() });
      return;
    }

    const { table, id, at } = parsed.data;
    const snapshot = await queryAsOf(table, id, new Date(at));
    
    if (!snapshot) {
      res.status(404).json({ error: 'No snapshot found for the specified time' });
      return;
    }
    
    res.json({ snapshot, asOf: at });
  } catch (error) {
    console.error('Flashback Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
