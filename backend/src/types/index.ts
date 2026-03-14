export interface SessionContext {
  userId: string;
  tenantId?: string;
  role?: string;
}

export interface AuditLog {
  id: string;
  user_id: string;
  action: 'INSERT' | 'UPDATE' | 'DELETE';
  table_name: string;
  row_id: string;
  old_data: any;
  new_data: any;
  created_at: Date;
}

export interface FlashbackResult<T> {
  snapshot: T;
  asOf: Date;
}

export interface JobRecord {
  id: string;
  name: string;
  cron_expr: string;
  last_run: Date | null;
  status: 'idle' | 'running' | 'failed';
  payload: any;
}
