import pool from '../db/pool';
import { JobRecord } from '../../types';

export async function acquireLock(jobName: string): Promise<JobRecord | null> {
  const query = `
    UPDATE scheduled_jobs 
    SET status = 'running', last_run = NOW()
    WHERE name = $1 AND (status = 'idle' OR status = 'failed')
    RETURNING *;
  `;
  const { rows } = await pool.query(query, [jobName]);
  return rows[0] || null;
}

export async function releaseLock(jobName: string, status: 'idle' | 'failed') {
  const query = `
    UPDATE scheduled_jobs 
    SET status = $2
    WHERE name = $1
  `;
  await pool.query(query, [jobName, status]);
}

export async function runJob(jobName: string, handler: () => Promise<void>) {
  const job = await acquireLock(jobName);
  
  if (!job) {
    console.log(`[Scheduler] Job ${jobName} is already running or doesn't exist.`);
    return;
  }

  try {
    console.log(`[Scheduler] Executing job: ${jobName}`);
    await handler();
    await releaseLock(jobName, 'idle');
    console.log(`[Scheduler] Job ${jobName} completed successfully.`);
  } catch (error) {
    console.error(`[Scheduler] Job ${jobName} failed:`, error);
    await releaseLock(jobName, 'failed');
    throw error;
  }
}
