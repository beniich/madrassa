// src/controllers/hr.controller.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * GET /api/hr
 * Liste tout le personnel de l'école
 */
const getHRMembers = async (req, res, next) => {
  try {
    const members = await prisma.hRMember.findMany({
      orderBy: { lastName: 'asc' }
    });
    res.json(members);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/hr
 * Ajoute un nouveau membre au personnel
 */
const createHRMember = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone, subject, status, schoolId } = req.body;
    
    // Pour cet exemple, on utilise un schoolId par défaut si non fourni
    const finalSchoolId = schoolId || "school_default";

    const member = await prisma.hRMember.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        subject,
        status,
        schoolId: finalSchoolId
      }
    });
    res.status(201).json(member);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/hr/leaves
 * Liste les demandes de congés
 */
const getLeaveRequests = async (req, res, next) => {
  try {
    const leaves = await prisma.leaveRequest.findMany({
      include: { employee: true },
      orderBy: { startDate: 'desc' }
    });
    res.json(leaves);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getHRMembers,
  createHRMember,
  getLeaveRequests
};
