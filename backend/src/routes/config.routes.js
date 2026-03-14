// src/routes/config.routes.js
const express = require("express");
const router = express.Router();
const { getSchoolProfile, updateSchoolProfile } = require("../controllers/config.controller");

router.get("/school", getSchoolProfile);
router.put("/school", updateSchoolProfile);

module.exports = router;
