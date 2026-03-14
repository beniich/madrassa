import { PoolClient } from 'pg';
import pool from './pool';
import { SessionContext } from '../../types';

/**
 * Execute a callback within an ACID transaction and a set context.
 * Sets the current_user_id and optional tenant_id for RLS and Audit.
 */
export async function executeWithContext<T>(
  ctx: SessionContext,
  callback: (client: PoolClient) => Promise<T>
): Promise<T> {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Set local context variables for the transaction
    if (ctx.userId) {
      await client.query('SET LOCAL app.current_user_id = $1', [ctx.userId]);
    }
    
    if (ctx.tenantId) {
      await client.query('SET LOCAL app.tenant_id = $1', [ctx.tenantId]);
    }
    
    // Execute the actual queries
    const result = await callback(client);
    
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}
