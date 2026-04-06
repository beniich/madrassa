import { useState } from "react";

const palette = {
  primary: {
    label: "Primaire — Bleu Académique",
    description: "Navigation, boutons principaux, liens actifs",
    shades: [
      { name: "50",  hex: "#EFF6FF", tw: "bg-blue-50" },
      { name: "100", hex: "#DBEAFE", tw: "bg-blue-100" },
      { name: "200", hex: "#BFDBFE", tw: "bg-blue-200" },
      { name: "300", hex: "#93C5FD", tw: "bg-blue-300" },
      { name: "400", hex: "#60A5FA", tw: "bg-blue-400" },
      { name: "500", hex: "#3B82F6", tw: "bg-blue-500" },
      { name: "600", hex: "#2563EB", tw: "bg-blue-600" },
      { name: "700", hex: "#1D4ED8", tw: "bg-blue-700" },
      { name: "800", hex: "#1E40AF", tw: "bg-blue-800" },
      { name: "900", hex: "#1E3A8A", tw: "bg-blue-900" },
    ],
  },
  secondary: {
    label: "Secondaire — Vert Réussite",
    description: "Success, présences, notes positives, validations",
    shades: [
      { name: "50",  hex: "#F0FDF4", tw: "bg-emerald-50" },
      { name: "100", hex: "#DCFCE7", tw: "bg-emerald-100" },
      { name: "200", hex: "#BBF7D0", tw: "bg-emerald-200" },
      { name: "300", hex: "#86EFAC", tw: "bg-emerald-300" },
      { name: "400", hex: "#4ADE80", tw: "bg-emerald-400" },
      { name: "500", hex: "#22C55E", tw: "bg-emerald-500" },
      { name: "600", hex: "#16A34A", tw: "bg-emerald-600" },
      { name: "700", hex: "#15803D", tw: "bg-emerald-700" },
      { name: "800", hex: "#166534", tw: "bg-emerald-800" },
      { name: "900", hex: "#14532D", tw: "bg-emerald-900" },
    ],
  },
  accent: {
    label: "Accent — Ambre Énergie",
    description: "Alertes, en attente, délais, notifications",
    shades: [
      { name: "50",  hex: "#FFFBEB", tw: "bg-amber-50" },
      { name: "100", hex: "#FEF3C7", tw: "bg-amber-100" },
      { name: "200", hex: "#FDE68A", tw: "bg-amber-200" },
      { name: "300", hex: "#FCD34D", tw: "bg-amber-300" },
      { name: "400", hex: "#FBBF24", tw: "bg-amber-400" },
      { name: "500", hex: "#F59E0B", tw: "bg-amber-500" },
      { name: "600", hex: "#D97706", tw: "bg-amber-600" },
      { name: "700", hex: "#B45309", tw: "bg-amber-700" },
      { name: "800", hex: "#92400E", tw: "bg-amber-800" },
      { name: "900", hex: "#78350F", tw: "bg-amber-900" },
    ],
  },
  danger: {
    label: "Danger — Rouge Alerte",
    description: "Errors, absences, échecs, suppressions",
    shades: [
      { name: "50",  hex: "#FFF1F2", tw: "bg-rose-50" },
      { name: "100", hex: "#FFE4E6", tw: "bg-rose-100" },
      { name: "200", hex: "#FECDD3", tw: "bg-rose-200" },
      { name: "300", hex: "#FDA4AF", tw: "bg-rose-300" },
      { name: "400", hex: "#FB7185", tw: "bg-rose-400" },
      { name: "500", hex: "#F43F5E", tw: "bg-rose-500" },
      { name: "600", hex: "#E11D48", tw: "bg-rose-600" },
      { name: "700", hex: "#BE123C", tw: "bg-rose-700" },
      { name: "800", hex: "#9F1239", tw: "bg-rose-800" },
      { name: "900", hex: "#881337", tw: "bg-rose-900" },
    ],
  },
  neutral: {
    label: "Neutre — Ardoise",
    description: "Textes, fonds, bordures, sidebar, tableaux",
    shades: [
      { name: "50",  hex: "#F8FAFC", tw: "bg-slate-50" },
      { name: "100", hex: "#F1F5F9", tw: "bg-slate-100" },
      { name: "200", hex: "#E2E8F0", tw: "bg-slate-200" },
      { name: "300", hex: "#CBD5E1", tw: "bg-slate-300" },
      { name: "400", hex: "#94A3B8", tw: "bg-slate-400" },
      { name: "500", hex: "#64748B", tw: "bg-slate-500" },
      { name: "600", hex: "#475569", tw: "bg-slate-600" },
      { name: "700", hex: "#334155", tw: "bg-slate-700" },
      { name: "800", hex: "#1E293B", tw: "bg-slate-800" },
      { name: "900", hex: "#0F172A", tw: "bg-slate-900" },
    ],
  },
  violet: {
    label: "Violet — Administration",
    description: "Rôles admin, directeurs, tableaux de bord avancés",
    shades: [
      { name: "50",  hex: "#F5F3FF", tw: "bg-violet-50" },
      { name: "100", hex: "#EDE9FE", tw: "bg-violet-100" },
      { name: "200", hex: "#DDD6FE", tw: "bg-violet-200" },
      { name: "300", hex: "#C4B5FD", tw: "bg-violet-300" },
      { name: "400", hex: "#A78BFA", tw: "bg-violet-400" },
      { name: "500", hex: "#8B5CF6", tw: "bg-violet-500" },
      { name: "600", hex: "#7C3AED", tw: "bg-violet-600" },
      { name: "700", hex: "#6D28D9", tw: "bg-violet-700" },
      { name: "800", hex: "#5B21B6", tw: "bg-violet-800" },
      { name: "900", hex: "#4C1D95", tw: "bg-violet-900" },
    ],
  },
};

const usages = [
  { role: "Fond principal", tw: "bg-slate-50", hex: "#F8FAFC", text: "text-slate-900" },
  { role: "Sidebar / Nav", tw: "bg-slate-800", hex: "#1E293B", text: "text-white" },
  { role: "Bouton primaire", tw: "bg-blue-600", hex: "#2563EB", text: "text-white" },
  { role: "Badge succès", tw: "bg-emerald-100", hex: "#DCFCE7", text: "text-emerald-800" },
  { role: "Badge alerte", tw: "bg-amber-100", hex: "#FEF3C7", text: "text-amber-800" },
  { role: "Badge erreur", tw: "bg-rose-100", hex: "#FFE4E6", text: "text-rose-700" },
  { role: "Carte admin", tw: "bg-violet-600", hex: "#7C3AED", text: "text-white" },
  { role: "Bordures", tw: "bg-slate-200", hex: "#E2E8F0", text: "text-slate-600" },
];

function CopyBadge({ text }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };
  return (
    <button
      onClick={copy}
      className="text-xs font-mono px-2 py-0.5 rounded bg-black/10 hover:bg-black/20 transition-all"
      title="Copier"
    >
      {copied ? "✓ Copié" : text}
    </button>
  );
}

export default function SchoolPalette() {
  const [activeGroup, setActiveGroup] = useState("primary");

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", background: "#F8FAFC", minHeight: "100vh", padding: "2rem" }}>
      {/* Header */}
      <div style={{ maxWidth: 920, margin: "0 auto" }}>
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
            <span style={{ fontSize: 28 }}>🏫</span>
            <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#1E293B", margin: 0 }}>
              Palette Tailwind CSS
            </h1>
          </div>
          <p style={{ color: "#64748B", margin: 0, fontSize: "0.95rem" }}>
            Palette officielle pour l'application de <strong>gestion des écoles</strong>
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: "1.5rem" }}>
          {Object.entries(palette).map(([key, val]) => (
            <button
              key={key}
              onClick={() => setActiveGroup(key)}
              style={{
                padding: "6px 14px",
                borderRadius: 8,
                border: activeGroup === key ? "2px solid #2563EB" : "2px solid #E2E8F0",
                background: activeGroup === key ? "#EFF6FF" : "white",
                color: activeGroup === key ? "#1D4ED8" : "#475569",
                fontWeight: 600,
                fontSize: "0.82rem",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {val.label.split("—")[0].trim()}
            </button>
          ))}
        </div>

        {/* Active Palette */}
        {Object.entries(palette).map(([key, group]) =>
          activeGroup !== key ? null : (
            <div key={key} style={{ background: "white", borderRadius: 16, padding: "1.5rem", boxShadow: "0 1px 6px rgba(0,0,0,0.07)", marginBottom: "1.5rem" }}>
              <div style={{ marginBottom: "1rem" }}>
                <h2 style={{ fontWeight: 800, color: "#1E293B", margin: "0 0 4px" }}>{group.label}</h2>
                <p style={{ color: "#64748B", margin: 0, fontSize: "0.85rem" }}>{group.description}</p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(10, 1fr)", gap: 6 }}>
                {group.shades.map((s) => {
                  const isDark = parseInt(s.name) >= 600;
                  return (
                    <div key={s.name} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                      <div
                        style={{
                          width: "100%",
                          aspectRatio: "1",
                          borderRadius: 10,
                          background: s.hex,
                          border: "1px solid rgba(0,0,0,0.07)",
                          cursor: "pointer",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.06)",
                          transition: "transform 0.1s",
                        }}
                        title={`${s.tw} — ${s.hex}`}
                        onClick={() => navigator.clipboard.writeText(s.hex)}
                      />
                      <span style={{ fontSize: "0.62rem", color: "#94A3B8", fontWeight: 600 }}>{s.name}</span>
                      <span style={{ fontSize: "0.58rem", color: "#CBD5E1", fontFamily: "monospace" }}>{s.hex}</span>
                    </div>
                  );
                })}
              </div>
              {/* Tailwind class list */}
              <div style={{ marginTop: "1.2rem", display: "flex", flexWrap: "wrap", gap: 6 }}>
                {group.shades.map((s) => (
                  <CopyBadge key={s.name} text={s.tw} />
                ))}
              </div>
            </div>
          )
        )}

        {/* Usage Guide */}
        <div style={{ background: "white", borderRadius: 16, padding: "1.5rem", boxShadow: "0 1px 6px rgba(0,0,0,0.07)", marginBottom: "1.5rem" }}>
          <h2 style={{ fontWeight: 800, color: "#1E293B", margin: "0 0 1rem" }}>
            📌 Guide d'utilisation rapide
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 }}>
            {usages.map((u) => (
              <div
                key={u.role}
                style={{
                  borderRadius: 10,
                  overflow: "hidden",
                  border: "1px solid #E2E8F0",
                }}
              >
                <div
                  style={{
                    background: u.hex,
                    padding: "14px 16px",
                    color: u.text === "text-white" ? "white" : u.text.includes("900") ? "#1E293B" : u.text.includes("800") ? "#1E3A8A" : "#475569",
                    fontWeight: 700,
                    fontSize: "0.82rem",
                  }}
                >
                  {u.role}
                </div>
                <div style={{ padding: "8px 12px", background: "#F8FAFC" }}>
                  <code style={{ fontSize: "0.72rem", color: "#475569" }}>{u.tw}</code>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tailwind Config */}
        <div style={{ background: "#1E293B", borderRadius: 16, padding: "1.5rem", boxShadow: "0 1px 6px rgba(0,0,0,0.1)" }}>
          <h2 style={{ fontWeight: 800, color: "white", margin: "0 0 1rem" }}>
            ⚙️ tailwind.config.js — Extrait recommandé
          </h2>
          <pre style={{
            background: "#0F172A",
            borderRadius: 10,
            padding: "1rem",
            color: "#7DD3FC",
            fontSize: "0.78rem",
            overflowX: "auto",
            lineHeight: 1.7,
            margin: 0,
          }}>
{`// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        school: {
          primary:   '#2563EB', // blue-600
          success:   '#16A34A', // emerald-600
          warning:   '#D97706', // amber-600
          danger:    '#E11D48', // rose-600
          admin:     '#7C3AED', // violet-600
          surface:   '#F8FAFC', // slate-50
          sidebar:   '#1E293B', // slate-800
          border:    '#E2E8F0', // slate-200
          text:      '#1E293B', // slate-800
          muted:     '#64748B', // slate-500
        },
      },
    },
  },
};`}
          </pre>
        </div>

        <p style={{ textAlign: "center", color: "#CBD5E1", fontSize: "0.75rem", marginTop: "1.5rem" }}>
          Cliquez sur une nuance pour copier son code HEX • Cliquez sur les badges pour copier la classe Tailwind
        </p>
      </div>
    </div>
  );
}
