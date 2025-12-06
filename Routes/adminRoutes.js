// src/routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const { getAllMessages, deleteMessage } = require("../Controller/adminController");
const { authMiddleware, adminMiddleware } = require("../Midderlware/auth");

// GET /api/admin/messages
router.get("/messages", authMiddleware, adminMiddleware, getAllMessages);

// DELETE /api/admin/messages/:id
router.delete("/messages/:id", authMiddleware, adminMiddleware, deleteMessage);

module.exports = router;
