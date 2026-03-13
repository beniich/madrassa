/**
 * SchoolGenius - Centralized API Client
 * All HTTP requests to the backend go through here.
 * - Auto-attaches JWT token from storage
 * - Uniform error handling
 * - Base URL configurable via env variable
 */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? (import.meta.env.PROD 
    ? (console.warn('[API] VITE_API_BASE_URL is missing in production! Fallback used.'), 'http://localhost:5000/api')
    : 'http://localhost:5000/api');

// ─────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────

function getToken(): string | null {
    const raw = localStorage.getItem('sg_user');
    if (!raw) return null;
    try {
        return JSON.parse(raw)?.token ?? null;
    } catch {
        return null;
    }
}

function buildHeaders(extra: Record<string, string> = {}): Record<string, string> {
    const token = getToken();
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...extra,
    };
}

async function handleResponse<T>(res: Response): Promise<T> {
    if (!res.ok) {
        const err = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error(err.error ?? `HTTP ${res.status}`);
    }
    return res.json() as Promise<T>;
}

// ─────────────────────────────────────────
// API Methods
// ─────────────────────────────────────────

export const apiClient = {
    async get<T>(path: string): Promise<T> {
        const res = await fetch(`${API_BASE_URL}${path}`, {
            method: 'GET',
            headers: buildHeaders(),
        });
        return handleResponse<T>(res);
    },

    async post<T>(path: string, body: unknown): Promise<T> {
        const res = await fetch(`${API_BASE_URL}${path}`, {
            method: 'POST',
            headers: buildHeaders(),
            body: JSON.stringify(body),
        });
        return handleResponse<T>(res);
    },

    async put<T>(path: string, body: unknown): Promise<T> {
        const res = await fetch(`${API_BASE_URL}${path}`, {
            method: 'PUT',
            headers: buildHeaders(),
            body: JSON.stringify(body),
        });
        return handleResponse<T>(res);
    },

    async delete<T>(path: string): Promise<T> {
        const res = await fetch(`${API_BASE_URL}${path}`, {
            method: 'DELETE',
            headers: buildHeaders(),
        });
        return handleResponse<T>(res);
    },
};
