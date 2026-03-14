import pool from '../db/pool';

export async function queryAsOf(tableName: string, rowId: string, timestamp: Date) {
  // Ensure table name is safe to avoid SQL injection (basic check)
  if (!/^[a-z0-9_]+$/i.test(tableName)) {
    throw new Error('Invalid table name');
  }

  const historyTableName = `${tableName}_history`;
  
  const query = `
    SELECT * 
    FROM ${historyTableName}
    WHERE id = $1
      AND valid_from <= $2
      AND (valid_to IS NULL OR valid_to > $2)
    ORDER BY valid_from DESC
    LIMIT 1;
  `;
  
  const { rows } = await pool.query(query, [rowId, timestamp]);
  return rows[0] || null;
}
