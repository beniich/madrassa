// src/services/settingsApi.js
// ─── Service frontend pour connecter la page Paramètres au backend ───

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

/**
 * Récupère le token JWT stocké localement
 */
const getToken = () => localStorage.getItem("token");

/**
 * Helper fetch avec auth header
 */
const apiFetch = async (path, options = {}) => {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
      ...options.headers,
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Erreur serveur");
  return data;
};

// ─── Auth ──────────────────────────────────────────────────────
export const login = async (email, password) => {
  const data = await apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  localStorage.setItem("token", data.token);
  return data;
};

export const logout = () => {
  localStorage.removeItem("token");
};

// ─── Settings ─────────────────────────────────────────────────
export const fetchSettings = (schoolId) =>
  apiFetch(`/settings/${schoolId}`);

export const saveSettings = (schoolId, payload) =>
  apiFetch(`/settings/${schoolId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

export const resetSettings = (schoolId) =>
  apiFetch(`/settings/${schoolId}/reset`, { method: "PATCH" });

export const exportTailwindConfig = (schoolId) =>
  apiFetch(`/settings/${schoolId}/export`);

export const fetchHistory = (schoolId, page = 1) =>
  apiFetch(`/settings/history/${schoolId}?page=${page}&limit=20`);

// ─── Hook React custom ─────────────────────────────────────────
// Exemple d'usage dans le composant AdminSettings :
//
// import { fetchSettings, saveSettings } from './services/settingsApi';
//
// const [style, setStyle] = useState(null);
// const schoolId = user.school.id;
//
// useEffect(() => {
//   fetchSettings(schoolId).then(({ style }) => setStyle(style));
// }, [schoolId]);
//
// const handleSave = async () => {
//   const updated = await saveSettings(schoolId, {
//     colorTheme: selectedTheme,
//     fontFamily: selectedFont,
//     borderRadius: selectedRadius,
//     darkMode,
//   });
//   setStyle(updated.style);
// };
