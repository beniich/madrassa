// src/middleware/auth.middleware.js
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Vérifie le token JWT et attache l'utilisateur à req.user
 */
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Token d'authentification manquant." });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, name: true, role: true, schoolId: true },
    });

    if (!user) {
      return res.status(401).json({ error: "Utilisateur introuvable." });
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Session expirée. Reconnectez-vous." });
    }
    return res.status(401).json({ error: "Token invalide." });
  }
};

/**
 * Autorise uniquement les rôles ADMIN et SUPER_ADMIN à modifier les styles
 */
const requireAdmin = (req, res, next) => {
  const allowedRoles = ["ADMIN", "SUPER_ADMIN", "DIRECTOR"];
  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({
      error: "Accès refusé. Seuls les administrateurs peuvent modifier les paramètres de style.",
    });
  }
  next();
};

/**
 * Vérifie que l'admin modifie bien son propre établissement
 * (sauf SUPER_ADMIN qui peut tout modifier)
 */
const requireSameSchool = (req, res, next) => {
  const { schoolId } = req.params;
  if (req.user.role === "SUPER_ADMIN") return next();

  if (req.user.schoolId !== schoolId) {
    return res.status(403).json({
      error: "Vous ne pouvez modifier que les paramètres de votre propre établissement.",
    });
  }
  next();
};

module.exports = { authenticate, requireAdmin, requireSameSchool };
