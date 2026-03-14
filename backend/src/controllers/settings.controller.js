// src/controllers/settings.controller.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// ─── Valeurs par défaut ────────────────────────────────────────
const DEFAULT_STYLE = {
  colorTheme: "blue",
  primaryColor: "#2563EB",
  sidebarColor: "#1E293B",
  successColor: "#16A34A",
  warningColor: "#D97706",
  dangerColor: "#E11D48",
  adminColor: "#7C3AED",
  fontFamily: "nunito",
  borderRadius: "md",
  darkMode: false,
  logoUrl: null,
};

// Mapping thème → couleurs préréglées
const THEME_PRESETS = {
  blue:   { primaryColor: "#2563EB", sidebarColor: "#1E293B", adminColor: "#7C3AED" },
  teal:   { primaryColor: "#0D9488", sidebarColor: "#134E4A", adminColor: "#7C3AED" },
  indigo: { primaryColor: "#4F46E5", sidebarColor: "#1E1B4B", adminColor: "#0D9488" },
  slate:  { primaryColor: "#475569", sidebarColor: "#0F172A", adminColor: "#7C3AED" },
  green:  { primaryColor: "#15803D", sidebarColor: "#14532D", adminColor: "#7C3AED" },
  rose:   { primaryColor: "#DB2777", sidebarColor: "#4C0519", adminColor: "#7C3AED" },
};

// ─── Helper : formate la réponse style ─────────────────────────
const formatStyle = (style) => ({
  id: style.id,
  colorTheme: style.colorTheme,
  colors: {
    primary: style.primaryColor,
    sidebar: style.sidebarColor,
    success: style.successColor,
    warning: style.warningColor,
    danger:  style.dangerColor,
    admin:   style.adminColor,
  },
  fontFamily:   style.fontFamily,
  borderRadius: style.borderRadius,
  darkMode:     style.darkMode,
  logoUrl:      style.logoUrl,
  updatedAt:    style.updatedAt,
});

/**
 * GET /api/settings/:schoolId
 * Récupère les paramètres de style d'un établissement
 */
const getSettings = async (req, res, next) => {
  try {
    const { schoolId } = req.params;

    // Vérifie que l'école existe
    const school = await prisma.school.findUnique({
      where: { id: schoolId },
      select: { id: true, name: true, code: true },
    });
    if (!school) {
      return res.status(404).json({ error: "Établissement introuvable." });
    }

    // Cherche ou crée les paramètres de style
    let style = await prisma.schoolStyle.findUnique({
      where: { schoolId },
    });

    if (!style) {
      style = await prisma.schoolStyle.create({
        data: { schoolId, ...DEFAULT_STYLE },
      });
    }

    res.json({
      school,
      style: formatStyle(style),
    });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/settings/:schoolId
 * Met à jour les paramètres de style
 */
const updateSettings = async (req, res, next) => {
  try {
    const { schoolId } = req.params;
    const updates = req.body;

    // Si un thème preset est sélectionné, appliquer ses couleurs automatiquement
    if (updates.colorTheme && THEME_PRESETS[updates.colorTheme]) {
      const preset = THEME_PRESETS[updates.colorTheme];
      // Seulement si l'admin n'a pas fourni de couleurs manuelles
      if (!updates.primaryColor) updates.primaryColor = preset.primaryColor;
      if (!updates.sidebarColor) updates.sidebarColor = preset.sidebarColor;
      if (!updates.adminColor)   updates.adminColor   = preset.adminColor;
    }

    // Récupère l'état actuel pour enregistrer le diff
    const current = await prisma.schoolStyle.findUnique({ where: { schoolId } });
    if (!current) {
      return res.status(404).json({ error: "Paramètres introuvables. Faites d'abord un GET pour les initialiser." });
    }

    // Calcule les champs qui ont changé
    const changes = {};
    for (const [key, newVal] of Object.entries(updates)) {
      if (current[key] !== undefined && String(current[key]) !== String(newVal)) {
        changes[key] = { from: current[key], to: newVal };
      }
    }

    // Met à jour les paramètres
    const updated = await prisma.schoolStyle.update({
      where: { schoolId },
      data: updates,
    });

    // Enregistre dans l'historique si des changements ont eu lieu
    if (Object.keys(changes).length > 0) {
      await prisma.styleHistory.create({
        data: {
          styleId: updated.id,
          changedBy: req.user.id,
          changedByName: req.user.name,
          changes,
        },
      });
    }

    res.json({
      message: "Paramètres mis à jour avec succès.",
      style: formatStyle(updated),
      changesCount: Object.keys(changes).length,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/settings/:schoolId/reset
 * Réinitialise les paramètres aux valeurs par défaut
 */
const resetSettings = async (req, res, next) => {
  try {
    const { schoolId } = req.params;

    const current = await prisma.schoolStyle.findUnique({ where: { schoolId } });
    if (!current) {
      return res.status(404).json({ error: "Paramètres introuvables." });
    }

    const reset = await prisma.schoolStyle.update({
      where: { schoolId },
      data: DEFAULT_STYLE,
    });

    // Enregistre la réinitialisation dans l'historique
    await prisma.styleHistory.create({
      data: {
        styleId: reset.id,
        changedBy: req.user.id,
        changedByName: req.user.name,
        changes: { _action: { from: "custom", to: "reset_to_defaults" } },
      },
    });

    res.json({
      message: "Paramètres réinitialisés aux valeurs par défaut.",
      style: formatStyle(reset),
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/settings/:schoolId/export
 * Exporte la config Tailwind CSS correspondant aux paramètres
 */
const exportTailwindConfig = async (req, res, next) => {
  try {
    const { schoolId } = req.params;

    const style = await prisma.schoolStyle.findUnique({ where: { schoolId } });
    if (!style) {
      return res.status(404).json({ error: "Paramètres introuvables." });
    }

    const fontFamilies = {
      nunito:      "'Nunito', sans-serif",
      merriweather:"'Merriweather', serif",
      jetbrains:   "'JetBrains Mono', monospace",
      playfair:    "'Playfair Display', serif",
    };
    const radiusValues = {
      none: "0px", sm: "4px", md: "8px", lg: "12px", xl: "20px",
    };

    const tailwindConfig = {
      theme: {
        extend: {
          colors: {
            school: {
              primary:  style.primaryColor,
              sidebar:  style.sidebarColor,
              success:  style.successColor,
              warning:  style.warningColor,
              danger:   style.dangerColor,
              admin:    style.adminColor,
            },
          },
          fontFamily: {
            sans: [fontFamilies[style.fontFamily]],
          },
          borderRadius: {
            DEFAULT: radiusValues[style.borderRadius],
          },
        },
      },
    };

    res.json({
      config: tailwindConfig,
      configString: `// tailwind.config.js — Généré automatiquement\nmodule.exports = ${JSON.stringify(tailwindConfig, null, 2)};`,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getSettings, updateSettings, resetSettings, exportTailwindConfig };
