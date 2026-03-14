// src/middleware/error.middleware.js

const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${req.method} ${req.path}:`, err.message);

  // Erreurs Prisma connues
  if (err.code === "P2025") {
    return res.status(404).json({ error: "Ressource introuvable." });
  }
  if (err.code === "P2002") {
    return res.status(409).json({ error: "Conflit : cette ressource existe déjà." });
  }

  // Erreur de validation
  if (err.name === "ValidationError") {
    return res.status(400).json({ error: err.message });
  }

  // Erreur générique
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: process.env.NODE_ENV === "production"
      ? "Erreur interne du serveur."
      : err.message,
  });
};

module.exports = { errorHandler };
