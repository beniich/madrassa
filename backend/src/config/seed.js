// src/config/seed.js
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Démarrage du seed...\n");

  // ─── École de démo ─────────────────────────────────────────
  const school = await prisma.school.upsert({
    where: { code: "DEMO-001" },
    update: {},
    create: {
      name: "Lycée Ibn Khaldoun",
      code: "DEMO-001",
    },
  });
  console.log(`✅ École créée : ${school.name} (${school.id})`);

  // ─── Paramètres de style par défaut ────────────────────────
  await prisma.schoolStyle.upsert({
    where: { schoolId: school.id },
    update: {},
    create: {
      schoolId: school.id,
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
    },
  });
  console.log(`✅ Paramètres de style initialisés`);

  // ─── Utilisateurs de démo ───────────────────────────────────
  const hashedPassword = await bcrypt.hash("Admin1234!", 10);

  const users = [
    {
      email: "superadmin@ecole.ma",
      name: "Super Administrateur",
      role: "SUPER_ADMIN",
      schoolId: school.id,
      password: hashedPassword,
    },
    {
      email: "admin@ecole.ma",
      name: "Directeur Benali",
      role: "ADMIN",
      schoolId: school.id,
      password: hashedPassword,
    },
    {
      email: "directeur@ecole.ma",
      name: "Directrice Idrissi",
      role: "DIRECTOR",
      schoolId: school.id,
      password: hashedPassword,
    },
    {
      email: "prof@ecole.ma",
      name: "Prof. Khalil",
      role: "TEACHER",
      schoolId: school.id,
      password: hashedPassword,
    },
  ];

  for (const userData of users) {
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: userData,
    });
    console.log(`✅ Utilisateur : ${user.name} (${user.role}) — ${user.email}`);
  }

  console.log("\n🎉 Seed terminé avec succès !");
  console.log("\n📋 Comptes de test (mot de passe: Admin1234!) :");
  console.log("   superadmin@ecole.ma → SUPER_ADMIN");
  console.log("   admin@ecole.ma      → ADMIN");
  console.log("   directeur@ecole.ma  → DIRECTOR");
  console.log("   prof@ecole.ma       → TEACHER (lecture seule)");
  console.log(`\n🏫 School ID : ${school.id}`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
