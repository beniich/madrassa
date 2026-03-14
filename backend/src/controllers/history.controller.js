// src/controllers/history.controller.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * GET /api/settings/history/:schoolId
 * Retourne les 50 dernières modifications de style
 */
const getHistory = async (req, res, next) => {
  try {
    const { schoolId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const style = await prisma.schoolStyle.findUnique({ where: { schoolId } });
    if (!style) {
      return res.status(404).json({ error: "Paramètres introuvables." });
    }

    const [history, total] = await Promise.all([
      prisma.styleHistory.findMany({
        where: { styleId: style.id },
        orderBy: { createdAt: "desc" },
        skip,
        take: parseInt(limit),
      }),
      prisma.styleHistory.count({ where: { styleId: style.id } }),
    ]);

    res.json({
      history: history.map((h) => ({
        id: h.id,
        changedBy: h.changedByName,
        changes: h.changes,
        createdAt: h.createdAt,
      })),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getHistory };
