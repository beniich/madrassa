import pool from '../core/db/pool';
import { executeWithContext } from '../core/db/session';
import { randomUUID } from 'crypto';

async function seed() {
  console.log('--- Starting Seeding Process ---');
  
  const tenantId = randomUUID();
  const userId = randomUUID();

  try {
    // 1. Create a test user
    console.log('Seeding user...');
    await pool.query(
      'INSERT INTO users (id, email, tenant_id) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING',
      [userId, 'test.user@example.com', tenantId]
    );

    // 2. Create orders using executeWithContext to trigger Audit Triggers
    console.log('Seeding orders with Audit and Flashback context...');
    
    await executeWithContext({ userId, tenantId }, async (client) => {
      // Create initial order
      const orderId = randomUUID();
      await client.query(
        'INSERT INTO orders (id, user_id, tenant_id, amount, status) VALUES ($1, $2, $3, $4, $5)',
        [orderId, userId, tenantId, 150.00, 'pending']
      );
      console.log(`Order created: ${orderId}`);

      // Simulate a time delay for flashback testing
      console.log('Updating order to trigger history entry...');
      await new Promise(res => setTimeout(res, 500)); // Sleep 0.5s
      await client.query(
        "UPDATE orders SET status = 'paid', amount = 145.50, updated_at = NOW() WHERE id = $1",
        [orderId]
      );

      // Create another order to delete
      const deleteOrderId = randomUUID();
      await client.query(
        'INSERT INTO orders (id, user_id, tenant_id, amount, status) VALUES ($1, $2, $3, $4, $5)',
        [deleteOrderId, userId, tenantId, 99.99, 'to_be_deleted']
      );
      
      console.log('Deleting order to trigger delete audit...');
      await client.query('DELETE FROM orders WHERE id = $1', [deleteOrderId]);
    });

    // 3. Seed Scheduled Jobs
    console.log('Seeding scheduled jobs...');
    await pool.query(`
      INSERT INTO scheduled_jobs (name, cron_expr, status) 
      VALUES ($1, $2, $3)
      ON CONFLICT (name) DO UPDATE SET status = EXCLUDED.status;
    `, ['daily-cleanup', '0 0 * * *', 'idle']);

    console.log('--- Seeding Completed Successfully ---');
  } catch (err) {
    console.error('Seeding Failed:', err);
  } finally {
    await pool.end();
  }
}

// Check if we need to install uuid first, or use crypto.randomUUID() if node >= 16.7
// We have uuid in package.json? No, let's check.
seed();
