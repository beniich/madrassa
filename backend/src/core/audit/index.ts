import pool from '../db/pool';
import { SessionContext } from '../../types';

export async function getAuditLogs(filters: { table?: string; limit?: number; offset?: number }) {
  const { table, limit = 50, offset = 0 } = filters;
  
  let query = 'SELECT * FROM audit_log';
  const values: any[] = [];
  
  if (table) {
    query += ' WHERE table_name = $1';
    values.push(table);
  }
  
  query += ` ORDER BY created_at DESC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
  values.push(limit, offset);
  
  const { rows } = await pool.query(query, values);
  return rows;
}

export async function logManualEvent(ctx: SessionContext, action: string, tableName: string, rowId: string, newData: any) {
  const query = `
    INSERT INTO audit_log(user_id, action, table_name, row_id, old_data, new_data)
    VALUES ($1, $2, $3, $4, NULL, $5)
    RETURNING *;
  `;
  const values = [ctx.userId, action, tableName, rowId, JSON.stringify(newData)];
  const { rows } = await pool.query(query, values);
  return rows[0];
}
