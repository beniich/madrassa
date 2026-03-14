// src/controllers/config.controller.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * GET /api/config/school
 * Alias pour récupérer le profil de l'école (attendu par le frontend)
 */
const getSchoolProfile = async (req, res, next) => {
  try {
    // On cherche l'école par défaut ou la première
    let school = await prisma.school.findFirst({
      include: { style: true }
    });

    if (!school) {
      // Création automatique si inexistante pour le mock/dev
      school = await prisma.school.create({
        data: {
          name: "SchoolGenius",
          code: "SG-001",
          style: {
            create: {} // Utilise les valeurs par défaut du schéma
          }
        },
        include: { style: true }
      });
    }

    res.json(school);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/config/school
 */
const updateSchoolProfile = async (req, res, next) => {
  try {
    const school = await prisma.school.findFirst();
    if (!school) return res.status(404).json({ error: "École non trouvée" });

    const updated = await prisma.school.update({
      where: { id: school.id },
      data: req.body
    });
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getSchoolProfile,
  updateSchoolProfile
};
