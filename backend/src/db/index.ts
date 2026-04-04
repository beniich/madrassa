/**
 * Drizzle ORM Client — Connexion PostgreSQL
 * Supporte l'injection du tenant_id pour RLS
 */
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import path from 'path';
import * as schema from './schema';

dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

// Pool de connexions partagé
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('error', (err) => {
  console.error('[DB] Unexpected error on idle client:', err);
});

// Client Drizzle global (sans RLS — pour super admin et migrations)
export const db = drizzle(pool, { schema });

/**
 * Créer un client Drizzle scopé à un tenant via RLS PostgreSQL
 * Injecte SET app.tenant_id = '<id>' dans la session
 */
export async function getTenantDb(tenantId: string) {
  const client = await pool.connect();

  // Activer RLS pour ce client de session
  await client.query(`SET app.tenant_id = '${tenantId.replace(/'/g, "''")}'`);

  const tenantDb = drizzle(client as any, { schema });

  return {
    db: tenantDb,
    release: () => client.release(),
  };
}

export { pool };
export default db;
