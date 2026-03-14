import { Router, Request, Response } from 'express';
import { runJob } from '../../core/scheduler';

const router = Router();

// Middleware to verify Vercel Cron Secret
router.use((req: Request, res: Response, next) => {
  const authHeader = req.headers['authorization'];
  
  // In development, we might not have a full token, but checking exists 
  // or a specific secret is good practice. We'll use process.env.CRON_SECRET
  if (process.env.NODE_ENV === 'production' && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  next();
});

// Example cron jobs
const jobs = {
  'daily-cleanup': async () => {
    // Implement daily cleanup logic here
    console.log('Running daily cleanup...');
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
};

router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const jobName = req.query.jobName as string || 'daily-cleanup';
    
    if (!jobs[jobName as keyof typeof jobs]) {
      res.status(404).json({ error: 'Job not found' });
      return;
    }

    // Fire and forget, or await depending on Vercel timeout limits
    // Since Vercel route timeout is usually 10s-60s, it's safer to await if jobs are quick
    await runJob(jobName, jobs[jobName as keyof typeof jobs]);
    
    res.json({ success: true, message: `Job ${jobName} executed` });
  } catch (error) {
    res.status(500).json({ error: 'Job execution failed' });
  }
});

export default router;
