// src/controllers/auth.controller.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * POST /api/auth/login
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email et mot de passe requis." });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: { school: { select: { id: true, name: true, code: true } } },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Identifiants incorrects." });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role, schoolId: user.schoolId },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        school: user.school,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/sync
 * Synchronise l'utilisateur Firebase avec la base locale
 */
const sync = async (req, res, next) => {
  try {
    // Note: Dans une app réelle, on vérifierait le token Firebase ici avec firebase-admin.
    // Pour ce pont, on simule l'extraction des infos ou on attend que le frontend 
    // les passe (ou on utilise des valeurs par défaut intelligentes).
    
    // On extrait l'email du token (mocké ici ou via décodage non-vérifié pour dev)
    const email = req.body.email || "demo@schoolgenius.cc"; 
    const name = req.body.name || "Utilisateur Démo";

    let user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: { school: true }
    });

    if (!user) {
      // Création de l'école par défaut si nécessaire
      let school = await prisma.school.findFirst();
      if (!school) {
        school = await prisma.school.create({
          data: { name: "École SchoolGenius", code: "SG-DEF" }
        });
      }

      // Création de l'utilisateur
      user = await prisma.user.create({
        data: {
          email: email.toLowerCase(),
          name: name,
          password: "firebase-managed", // Pas utilisé pour l'auth Firebase
          role: "TEACHER",
          schoolId: school.id
        },
        include: { school: true }
      });
    }

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        schoolId: user.schoolId,
        school: user.school
      }
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { login, sync };
