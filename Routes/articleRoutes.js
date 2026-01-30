// src/Routes/articleRoutes.js
const express = require("express");
const {
  createArticle,
  getAllArticles,
  getArticleById,
  getArticleBySlug,
  updateArticle,
  deleteArticle,
} = require("../Controller/articleController");




const {
  authMiddleware,
  ProjectMiddleware,
} = require("../Midderlware/auth");

const validateObjectId = require("../Midderlware/validateObjectId");

const router = express.Router();

// ✅ GET: كل المقالات (Public)
router.get("/articles", getAllArticles);

// ✅ GET: مقالة بالـ ID (Public)
router.get("/articles/:id", validateObjectId, getArticleById);

// ✅ (اختياري) GET: مقالة بالـ slug (Public)
router.get("/article-slug/:slug", getArticleBySlug);

// ✅ POST: إضافة مقالة (Writer / Admin / SuperAdmin)
router.post(
  "/create-articles",
  authMiddleware,
  ProjectMiddleware,
  createArticle
);

// ✅ PUT: تعديل مقالة
router.put(
  "/articles/:id",
  authMiddleware,
  ProjectMiddleware,
  validateObjectId,
  updateArticle
);

// ✅ DELETE: حذف مقالة
router.delete(
  "/articles/:id",
  authMiddleware,
  ProjectMiddleware,
  validateObjectId,
  deleteArticle
);

module.exports = router;
