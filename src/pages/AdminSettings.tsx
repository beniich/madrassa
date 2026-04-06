import { useState, useEffect } from "react";

// ============================================================================
// PAGE PARAMÈTRES ADMIN — Apparence & Personnalisation
// ============================================================================

const fontLinks = [
  "https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap",
  "https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&display=swap",
  "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&display=swap",
  "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&display=swap",
];

const FONTS = [
  {
    id: "nunito",
    name: "Nunito",
    family: "'Nunito', sans-serif",
    tag: "Moderne & Amical",
    desc: "Arrondi, lisible, idéal pour une école primaire ou collège.",
    sample: "Gestion Scolaire — Résultats & Présences",
  },
  {
    id: "merriweather",
    name: "Merriweather",
    family: "'Merriweather', serif",
    tag: "Institutionnel & Sérieux",
    desc: "Sérieux, académique. Parfait pour lycées et universités.",
    sample: "Gestion Scolaire — Résultats & Présences",
  },
  {
    id: "jetbrains",
    name: "JetBrains Mono",
    family: "'JetBrains Mono', monospace",
    tag: "Technique & Précis",
    desc: "Monospace moderne, idéal pour afficher des données et codes.",
    sample: "Gestion Scolaire — Résultats & Présences",
  },
  {
    id: "playfair",
    name: "Playfair Display",
    family: "'Playfair Display', serif",
    tag: "Élégant & Prestige",
    desc: "Élégant, pour des établissements haut de gamme ou privés.",
    sample: "Gestion Scolaire — Résultats & Présences",
  },
  {
    id: "archivo",
    name: "Archivo Black",
    family: "'Archivo Black', sans-serif",
    tag: "Industriel & Puissant",
    desc: "Style Caterpillar, robuste et moderne.",
    sample: "GESTION SCOLAIRE — PERFORMANCE",
  },
];

const COLOR_THEMES = [
  { id: "blue", name: "Bleu Académique", emoji: "🔵", primary: "#2563EB", primaryLight: "#EFF6FF", primaryDark: "#1E40AF", sidebar: "#1E293B", success: "#16A34A", warning: "#D97706", danger: "#E11D48", admin: "#7C3AED" },
  { id: "teal", name: "Teal Moderne", emoji: "🟦", primary: "#0D9488", primaryLight: "#F0FDFA", primaryDark: "#0F766E", sidebar: "#134E4A", success: "#16A34A", warning: "#D97706", danger: "#E11D48", admin: "#7C3AED" },
  { id: "indigo", name: "Indigo Prestige", emoji: "🟣", primary: "#4F46E5", primaryLight: "#EEF2FF", primaryDark: "#3730A3", sidebar: "#1E1B4B", success: "#16A34A", warning: "#D97706", danger: "#E11D48", admin: "#0D9488" },
  { id: "slate", name: "Ardoise Sobre", emoji: "⚫", primary: "#475569", primaryLight: "#F8FAFC", primaryDark: "#1E293B", sidebar: "#0F172A", success: "#16A34A", warning: "#D97706", danger: "#E11D48", admin: "#7C3AED" },
  { id: "green", name: "Vert Nature", emoji: "🟢", primary: "#15803D", primaryLight: "#F0FDF4", primaryDark: "#14532D", sidebar: "#14532D", success: "#16A34A", warning: "#D97706", danger: "#E11D48", admin: "#7C3AED" },
  { id: "rose", name: "Rose Dynamique", emoji: "🌸", primary: "#DB2777", primaryLight: "#FFF1F2", primaryDark: "#9D174D", sidebar: "#4C0519", success: "#16A34A", warning: "#D97706", danger: "#E11D48", admin: "#7C3AED" },
  { id: "caterpillar", name: "Caterpillar Industrial", emoji: "🏗️", primary: "#FFCD00", primaryLight: "#FFF7D6", primaryDark: "#E6B800", sidebar: "#0D0D0D", success: "#16A34A", warning: "#FFCD00", danger: "#E11D48", admin: "#FFCD00" },
];

const RADIUS_OPTIONS = [
  { id: "none", label: "Aucun", value: "0px" },
  { id: "sm", label: "Petit", value: "4px" },
  { id: "md", label: "Moyen", value: "8px" },
  { id: "lg", label: "Grand", value: "12px" },
  { id: "xl", label: "Très arrondi", value: "20px" },
];

function injectFonts() {
  fontLinks.forEach((href) => {
    if (!document.querySelector(`link[href="${href}"]`)) {
      const l = document.createElement("link");
      l.rel = "stylesheet";
      l.href = href;
      document.head.appendChild(l);
    }
  });
}

import { useConfig } from "@/contexts/ConfigContext";
import { saveSettingsToLocalStorage, loadSettingsFromLocalStorage } from "@/lib/settingsUtils";
import { AppearanceSettings, AllSettings } from "@/types/settings";

export default function AdminSettings() {
  const { appearance, updateAppearance } = useConfig();
  const [activeTab, setActiveTab] = useState("apparence");
  const [selectedTheme, setSelectedTheme] = useState("blue");
  const [selectedFont, setSelectedFont] = useState("nunito");
  const [selectedRadius, setSelectedRadius] = useState("md");
  const [darkMode, setDarkMode] = useState(false);
  const [saved, setSaved] = useState(false);
  const [previewSection, setPreviewSection] = useState("dashboard");

  useEffect(() => { 
    injectFonts();
    if (appearance) {
      setDarkMode(appearance.theme === 'dark');
      if (appearance.colorScheme) setSelectedTheme(appearance.colorScheme);
      if (appearance.fontFamily) {
        const fontId = FONTS.find(f => f.family.includes(appearance.fontFamily))?.id || "nunito";
        setSelectedFont(fontId);
      }
    }
  }, [appearance]);

  const theme = COLOR_THEMES.find((t) => t.id === selectedTheme) || COLOR_THEMES[0];
  const font = FONTS.find((f) => f.id === selectedFont) || FONTS[0];
  const radius = RADIUS_OPTIONS.find((r) => r.id === selectedRadius) || RADIUS_OPTIONS[2];

  const handleSave = () => {
    const currentSettings = loadSettingsFromLocalStorage() as AllSettings;
    const newAppearance: AppearanceSettings = {
      ...(currentSettings.appearance || {} as AppearanceSettings),
      theme: (darkMode ? 'dark' : 'light') as 'dark' | 'light',
      colorScheme: selectedTheme as 'caterpillar' | 'purple' | 'blue' | 'green' | 'red',
      fontFamily: font.name as any,
    };
    
    saveSettingsToLocalStorage({
      ...currentSettings,
      appearance: newAppearance
    });
    
    updateAppearance(newAppearance);
    
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const bg = darkMode ? "#0F172A" : "#F8FAFC";
  const card = darkMode ? "#1E293B" : "#FFFFFF";
  const textPrimary = darkMode ? "#F1F5F9" : "#1E293B";
  const textMuted = darkMode ? "#94A3B8" : "#64748B";
  const border = darkMode ? "#334155" : "#E2E8F0";

  return (
    <div style={{ fontFamily: font.family, background: bg, minHeight: "100vh", transition: "all 0.3s" }}>
      {/* Top bar */}
      <div style={{ background: theme.sidebar, padding: "0 2rem", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56, position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 22 }}>🏫</span>
          <span style={{ color: "white", fontWeight: 800, fontSize: "1rem" }}>EduAdmin</span>
          <span style={{ color: "#94A3B8", fontSize: "0.8rem", marginLeft: 8 }}>/ Settings</span>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <span style={{ color: "#94A3B8", fontSize: "0.8rem" }}>Mode sombre</span>
          <button
            onClick={() => setDarkMode(!darkMode)}
            style={{
              width: 44, height: 24, borderRadius: 999, background: darkMode ? theme.primary : "#475569",
              border: "none", cursor: "pointer", position: "relative", transition: "background 0.3s",
            }}
          >
            <div style={{
              position: "absolute", top: 3, left: darkMode ? 22 : 3,
              width: 18, height: 18, borderRadius: "50%", background: "white",
              transition: "left 0.3s", boxShadow: "0 1px 3px rgba(0,0,0,0.3)"
            }} />
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem 1.5rem", display: "grid", gridTemplateColumns: "220px 1fr", gap: "1.5rem" }}>

        {/* Sidebar Nav */}
        <div style={{ background: card, borderRadius: radius.value, border: `1px solid ${border}`, padding: "1rem", height: "fit-content", position: "sticky", top: 72 }}>
          <p style={{ fontSize: "0.7rem", fontWeight: 700, color: textMuted, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 12px" }}>Settings</p>
          {[
            { id: "apparence", icon: "🎨", label: "Apparence" },
            { id: "notifications", icon: "🔔", label: "Notifications" },
            { id: "securite", icon: "🔒", label: "Sécurité" },
            { id: "langue", icon: "🌐", label: "Langue & Région" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: 10,
                padding: "9px 12px", borderRadius: radius.value, border: "none",
                background: activeTab === tab.id ? theme.primaryLight : "transparent",
                color: activeTab === tab.id ? theme.primary : textMuted,
                fontWeight: activeTab === tab.id ? 700 : 500,
                cursor: "pointer", fontSize: "0.88rem", marginBottom: 2,
                transition: "all 0.15s", fontFamily: font.family,
              }}
            >
              <span>{tab.icon}</span> {tab.label}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

          {activeTab === "apparence" && (
            <>
              {/* Font Section */}
              <div style={{ background: card, borderRadius: radius.value, border: `1px solid ${border}`, padding: "1.5rem" }}>
                <h2 style={{ color: textPrimary, fontWeight: 800, margin: "0 0 4px", fontSize: "1.05rem" }}>
                  Aa Police de texte
                </h2>
                <p style={{ color: textMuted, margin: "0 0 1.2rem", fontSize: "0.83rem" }}>
                  Choisissez la typographie de l'interface. Elle s'applique à toute l'application.
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
                  {FONTS.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setSelectedFont(f.id)}
                      style={{
                        background: selectedFont === f.id ? theme.primaryLight : darkMode ? "#0F172A" : "#F8FAFC",
                        border: `2px solid ${selectedFont === f.id ? theme.primary : border}`,
                        borderRadius: radius.value,
                        padding: "1rem",
                        cursor: "pointer",
                        textAlign: "left",
                        transition: "all 0.15s",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                        <span style={{ fontFamily: f.family, fontWeight: 700, fontSize: "1rem", color: textPrimary }}>{f.name}</span>
                        <span style={{
                          fontSize: "0.65rem", fontWeight: 700, padding: "2px 8px", borderRadius: 999,
                          background: selectedFont === f.id ? theme.primary : border,
                          color: selectedFont === f.id ? "white" : textMuted,
                          fontFamily: "'Nunito', sans-serif",
                        }}>{f.tag}</span>
                      </div>
                      <p style={{ fontFamily: f.family, fontSize: "0.8rem", color: textMuted, margin: "0 0 8px" }}>{f.desc}</p>
                      <p style={{ fontFamily: f.family, fontSize: "0.9rem", color: textPrimary, fontStyle: "italic", margin: 0 }}>
                        "{f.sample}"
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Theme */}
              <div style={{ background: card, borderRadius: radius.value, border: `1px solid ${border}`, padding: "1.5rem" }}>
                <h2 style={{ color: textPrimary, fontWeight: 800, margin: "0 0 4px", fontSize: "1.05rem" }}>
                  🎨 Thème de couleurs
                </h2>
                <p style={{ color: textMuted, margin: "0 0 1.2rem", fontSize: "0.83rem" }}>
                  Couleur principale de l'interface, navigation et boutons.
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                  {COLOR_THEMES.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setSelectedTheme(t.id)}
                      style={{
                        border: `2px solid ${selectedTheme === t.id ? t.primary : border}`,
                        borderRadius: radius.value,
                        background: selectedTheme === t.id ? t.primaryLight : darkMode ? "#0F172A" : "#F8FAFC",
                        padding: "12px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        transition: "all 0.15s",
                      }}
                    >
                      <div style={{ display: "flex", gap: 4 }}>
                        <div style={{ width: 22, height: 22, borderRadius: 6, background: t.primary }} />
                        <div style={{ width: 22, height: 22, borderRadius: 6, background: t.sidebar }} />
                        <div style={{ width: 22, height: 22, borderRadius: 6, background: t.success }} />
                      </div>
                      <div style={{ textAlign: "left" }}>
                        <div style={{ fontSize: "0.8rem", fontWeight: 700, color: textPrimary }}>{t.name}</div>
                      </div>
                      {selectedTheme === t.id && (
                        <span style={{ marginLeft: "auto", color: t.primary, fontWeight: 800 }}>✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Border Radius */}
              <div style={{ background: card, borderRadius: radius.value, border: `1px solid ${border}`, padding: "1.5rem" }}>
                <h2 style={{ color: textPrimary, fontWeight: 800, margin: "0 0 4px", fontSize: "1.05rem" }}>
                  ⬛ Arrondi des bordures
                </h2>
                <p style={{ color: textMuted, margin: "0 0 1.2rem", fontSize: "0.83rem" }}>Style des cartes, boutons et champs de saisie.</p>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {RADIUS_OPTIONS.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => setSelectedRadius(r.id)}
                      style={{
                        padding: "10px 20px",
                        border: `2px solid ${selectedRadius === r.id ? theme.primary : border}`,
                        borderRadius: r.value,
                        background: selectedRadius === r.id ? theme.primaryLight : darkMode ? "#0F172A" : "#F8FAFC",
                        color: selectedRadius === r.id ? theme.primary : textMuted,
                        fontWeight: 600,
                        cursor: "pointer",
                        fontSize: "0.83rem",
                        fontFamily: font.family,
                        transition: "all 0.15s",
                      }}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Preview */}
              <div style={{ background: card, borderRadius: radius.value, border: `1px solid ${border}`, padding: "1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                  <div>
                    <h2 style={{ color: textPrimary, fontWeight: 800, margin: "0 0 4px", fontSize: "1.05rem" }}>👁 Aperçu en direct</h2>
                    <p style={{ color: textMuted, margin: 0, fontSize: "0.83rem" }}>Rendu avec vos préférences actuelles.</p>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    {["dashboard", "table", "form"].map((s) => (
                      <button key={s} onClick={() => setPreviewSection(s)} style={{
                        padding: "5px 12px", borderRadius: radius.value, border: `1px solid ${border}`,
                        background: previewSection === s ? theme.primary : "transparent",
                        color: previewSection === s ? "white" : textMuted,
                        fontSize: "0.75rem", fontWeight: 600, cursor: "pointer", fontFamily: font.family,
                      }}>
                        {s === "dashboard" ? "Dashboard" : s === "table" ? "Tableau" : "Formulaire"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preview: Dashboard */}
                {previewSection === "dashboard" && (
                  <div style={{ background: darkMode ? "#0F172A" : "#F8FAFC", borderRadius: radius.value, padding: "1.25rem" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 12 }}>
                      {[
                        { label: "Students", value: "1 248", color: theme.primary, icon: "👨‍🎓" },
                        { label: "Présents", value: "94%", color: theme.success, icon: "✅" },
                        { label: "Alertes", value: "7", color: theme.warning, icon: "⚠️" },
                      ].map((stat) => (
                        <div key={stat.label} style={{ background: card, borderRadius: radius.value, border: `1px solid ${border}`, padding: "1rem" }}>
                          <div style={{ fontSize: "1.4rem", marginBottom: 4 }}>{stat.icon}</div>
                          <div style={{ fontSize: "1.4rem", fontWeight: 800, color: stat.color, fontFamily: font.family }}>{stat.value}</div>
                          <div style={{ fontSize: "0.75rem", color: textMuted, fontFamily: font.family }}>{stat.label}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button style={{ background: theme.primary, color: "white", border: "none", borderRadius: radius.value, padding: "8px 16px", fontWeight: 700, cursor: "pointer", fontSize: "0.83rem", fontFamily: font.family }}>
                        + Add un élève
                      </button>
                      <button style={{ background: "transparent", color: theme.primary, border: `1.5px solid ${theme.primary}`, borderRadius: radius.value, padding: "8px 16px", fontWeight: 600, cursor: "pointer", fontSize: "0.83rem", fontFamily: font.family }}>
                        Exporter
                      </button>
                    </div>
                  </div>
                )}

                {/* Preview: Table */}
                {previewSection === "table" && (
                  <div style={{ background: darkMode ? "#0F172A" : "#F8FAFC", borderRadius: radius.value, overflow: "hidden", border: `1px solid ${border}` }}>
                    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", background: theme.primary, padding: "10px 16px" }}>
                      {["Last Name de l'élève", "Classe", "Note", "Statut"].map((h) => (
                        <span key={h} style={{ color: "white", fontWeight: 700, fontSize: "0.78rem", fontFamily: font.family }}>{h}</span>
                      ))}
                    </div>
                    {[
                      { name: "Amira Benali", classe: "3ème A", note: "17/20", status: "Présent", color: "#DCFCE7", tc: "#166534" },
                      { name: "Youssef Khalil", classe: "2ème B", note: "12/20", status: "Absent", color: "#FFE4E6", tc: "#9F1239" },
                      { name: "Sara Idrissi", classe: "4ème C", note: "15/20", status: "Présent", color: "#DCFCE7", tc: "#166534" },
                    ].map((row, i) => (
                      <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", padding: "10px 16px", borderBottom: `1px solid ${border}`, background: i % 2 === 0 ? card : (darkMode ? "#0F172A" : "#F8FAFC") }}>
                        <span style={{ color: textPrimary, fontWeight: 600, fontSize: "0.82rem", fontFamily: font.family }}>{row.name}</span>
                        <span style={{ color: textMuted, fontSize: "0.82rem", fontFamily: font.family }}>{row.classe}</span>
                        <span style={{ color: textPrimary, fontWeight: 700, fontSize: "0.82rem", fontFamily: font.family }}>{row.note}</span>
                        <span style={{ fontSize: "0.72rem", fontWeight: 700, background: row.color, color: row.tc, borderRadius: 999, padding: "2px 10px", width: "fit-content", fontFamily: font.family }}>{row.status}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Preview: Form */}
                {previewSection === "form" && (
                  <div style={{ background: darkMode ? "#0F172A" : "#F8FAFC", borderRadius: radius.value, padding: "1.25rem", display: "grid", gap: 12 }}>
                    {["Last Name complet", "Email"].map((label) => (
                      <div key={label}>
                        <label style={{ fontSize: "0.78rem", fontWeight: 700, color: textMuted, display: "block", marginBottom: 4, fontFamily: font.family }}>{label}</label>
                        <input
                          readOnly
                          placeholder={label === "Last Name complet" ? "Amira Benali" : "amira@ecole.ma"}
                          style={{ width: "100%", padding: "8px 12px", borderRadius: radius.value, border: `1.5px solid ${border}`, background: card, color: textPrimary, fontFamily: font.family, fontSize: "0.85rem", boxSizing: "border-box" }}
                        />
                      </div>
                    ))}
                    <div>
                      <label style={{ fontSize: "0.78rem", fontWeight: 700, color: textMuted, display: "block", marginBottom: 4, fontFamily: font.family }}>Rôle</label>
                      <select style={{ width: "100%", padding: "8px 12px", borderRadius: radius.value, border: `1.5px solid ${border}`, background: card, color: textPrimary, fontFamily: font.family, fontSize: "0.85rem" }}>
                        <option>Enseignant</option>
                        <option>Administrateur</option>
                        <option>Directeur</option>
                      </select>
                    </div>
                    <button style={{ background: theme.primary, color: "white", border: "none", borderRadius: radius.value, padding: "10px", fontWeight: 700, cursor: "pointer", fontSize: "0.88rem", fontFamily: font.family }}>
                      Save
                    </button>
                  </div>
                )}
              </div>

              {/* Save Button */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                <button style={{ padding: "10px 20px", borderRadius: radius.value, border: `1.5px solid ${border}`, background: "transparent", color: textMuted, fontWeight: 600, cursor: "pointer", fontFamily: font.family }}>
                  Réinitialiser
                </button>
                <button
                  onClick={handleSave}
                  style={{
                    padding: "10px 28px", borderRadius: radius.value, border: "none",
                    background: saved ? "#16A34A" : theme.primary,
                    color: "white", fontWeight: 700, cursor: "pointer", fontFamily: font.family,
                    fontSize: "0.92rem", transition: "background 0.3s",
                    boxShadow: `0 4px 14px ${theme.primary}55`,
                  }}
                >
                  {saved ? "✓ Sauvegardé !" : "Save les modifications"}
                </button>
              </div>
            </>
          )}

          {activeTab !== "apparence" && (
            <div style={{ background: card, borderRadius: radius.value, border: `1px solid ${border}`, padding: "3rem", textAlign: "center" }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🚧</div>
              <h2 style={{ color: textPrimary, fontWeight: 800, margin: "0 0 8px" }}>Section en construction</h2>
              <p style={{ color: textMuted, margin: 0 }}>Cette section sera disponible prochainement.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
