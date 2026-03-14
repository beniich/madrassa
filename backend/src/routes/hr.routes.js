// src/routes/hr.routes.js
const express = require("express");
const router = express.Router();
const { getHRMembers, createHRMember, getLeaveRequests } = require("../controllers/hr.controller");

router.get("/", getHRMembers);
router.post("/", createHRMember);
router.get("/leaves", getLeaveRequests);

module.exports = router;
