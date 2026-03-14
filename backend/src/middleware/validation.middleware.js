// src/middleware/validation.middleware.js
const { body, validationResult } = require("express-validator");

const VALID_THEMES = ["blue", "teal", "indigo", "slate", "green", "rose"];
const VALID_FONTS = ["nunito", "merriweather", "jetbrains", "playfair"];
const VALID_RADII = ["none", "sm", "md", "lg", "xl"];
const HEX_REGEX = /^#([A-Fa-f0-9]{6})$/;

/**
 * Valide les données d'une mise à jour de style
 */
const validateStyleUpdate = [
  body("colorTheme")
    .optional()
    .isIn(VALID_THEMES)
    .withMessage(`Thème invalide. Valeurs acceptées : ${VALID_THEMES.join(", ")}`),

  body("primaryColor")
    .optional()
    .matches(HEX_REGEX)
    .withMessage("primaryColor doit être un code HEX valide (ex: #2563EB)"),

  body("sidebarColor")
    .optional()
    .matches(HEX_REGEX)
    .withMessage("sidebarColor doit être un code HEX valide"),

  body("successColor")
    .optional()
    .matches(HEX_REGEX)
    .withMessage("successColor doit être un code HEX valide"),

  body("warningColor")
    .optional()
    .matches(HEX_REGEX)
    .withMessage("warningColor doit être un code HEX valide"),

  body("dangerColor")
    .optional()
    .matches(HEX_REGEX)
    .withMessage("dangerColor doit être un code HEX valide"),

  body("adminColor")
    .optional()
    .matches(HEX_REGEX)
    .withMessage("adminColor doit être un code HEX valide"),

  body("fontFamily")
    .optional()
    .isIn(VALID_FONTS)
    .withMessage(`Police invalide. Valeurs acceptées : ${VALID_FONTS.join(", ")}`),

  body("borderRadius")
    .optional()
    .isIn(VALID_RADII)
    .withMessage(`Arrondi invalide. Valeurs acceptées : ${VALID_RADII.join(", ")}`),

  body("darkMode")
    .optional()
    .isBoolean()
    .withMessage("darkMode doit être un booléen"),

  body("logoUrl")
    .optional({ nullable: true })
    .isURL()
    .withMessage("logoUrl doit être une URL valide"),

  // Middleware qui collecte les erreurs
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: "Données invalides",
        details: errors.array().map((e) => ({ field: e.path, message: e.msg })),
      });
    }
    next();
  },
];

module.exports = { validateStyleUpdate };
