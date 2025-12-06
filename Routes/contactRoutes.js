// src/routes/contactRoutes.js
const express = require("express");
const router = express.Router();
const { submitContactForm } = require("../Controller/contactController");

// POST /api/contact
router.post("/submit-message", submitContactForm);

module.exports = router;
