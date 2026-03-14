import pool from '../db/pool';

/**
 * Activer RLS sur une table donnée.
 */
export async function enableRls(tableName: string) {
  if (!/^[a-z0-9_]+$/i.test(tableName)) throw new Error('Invalid table name');
  const query = `ALTER TABLE "${tableName}" ENABLE ROW LEVEL SECURITY;`;
  await pool.query(query);
}

/**
 * Appliquer les politiques d'isolation par tenant sur une table.
 * Assure que 'tenant_id' colonne existe et est utilisée pour le filtrage.
 */
export async function applyRlsPolicies(tableName: string) {
  if (!/^[a-z0-9_]+$/i.test(tableName)) throw new Error('Invalid table name');
  
  // Clean up existing policy if needed, then recreate
  const query = `
    DROP POLICY IF EXISTS tenant_isolation ON "${tableName}";
    CREATE POLICY tenant_isolation ON "${tableName}"
      USING (tenant_id::text = current_setting('app.tenant_id', true));
  `;
  await pool.query(query);
}
