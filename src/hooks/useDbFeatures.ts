import { useQuery, useMutation } from '@tanstack/react-query';

const API_BASE = 'http://localhost:4000/api';

export function useAuditLogs(table?: string, limit = 50, offset = 0) {
  return useQuery({
    queryKey: ['audit-logs', table, limit, offset],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (table) params.append('table', table);
      params.append('limit', limit.toString());
      params.append('offset', offset.toString());

      const res = await fetch(`${API_BASE}/audit?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch audit logs');
      return res.json();
    }
  });
}

export function useFlashback(table: string, id: string, at: Date | null) {
  return useQuery({
    queryKey: ['flashback', table, id, at?.toISOString()],
    queryFn: async () => {
      if (!at) return null;
      
      const params = new URLSearchParams({
        table,
        id,
        at: at.toISOString()
      });

      const res = await fetch(`${API_BASE}/flashback?${params.toString()}`);
      if (!res.ok && res.status !== 404) throw new Error('Failed to fetch flashback data');
      if (res.status === 404) return null; // No snapshot
      
      return res.json();
    },
    enabled: !!at && !!table && !!id
  });
}

export function useRunCronJob() {
  return useMutation({
    mutationFn: async (jobName: string) => {
      // For testing purposes, we send the request without heavy auth
      // In prod, pass the CRON_SECRET if calling manually
      const res = await fetch(`${API_BASE}/cron/jobs?jobName=${jobName}`, {
        method: 'POST'
      });
      if (!res.ok) throw new Error('Failed to trigger cron job');
      return res.json();
    }
  });
}
