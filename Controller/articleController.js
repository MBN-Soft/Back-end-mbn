// src/Controller/articleController.js
const Article = require("../Models/Article");

// ✅ إضافة مقالة جديدة
const createArticle = async (req, res) => {
  try {
    const {
      title,
      slug,
      shortDescription,
      content,
      category,
      author,
      mainImage,
      extraImages,
      tags,
      metaTitle,
      metaDescription,
      status,
    } = req.body;

    if (!title || !slug || !shortDescription || !content || !mainImage) {
      return res.status(400).json({
        success: false,
        message: "title, slug, shortDescription, content, mainImage are required",
      });
    }

    const exists = await Article.findOne({ slug });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Slug already exists, please use another slug",
      });
    }

    const article = await Article.create({
      title,
      slug,
      shortDescription,
      content,
      category,
      author,
      mainImage,
      extraImages,
      tags,
      metaTitle,
      metaDescription,
      status,
      createdBy: req.user ? req.user.id : null,
    });

    res.status(201).json({
      success: true,
      message: "Article created successfully",
      data: article,
    });
  } catch (err) {
    console.error("Error creating article:", err);
    res.status(500).json({
      success: false,
      message: "Error creating article",
      error: err.message,
    });
  }
};

// ✅ جلب كل المقالات
const getAllArticles = async (req, res) => {
  try {
    // ممكن تضيف فلترة بالحالة أو التصنيف لو حبيت
    const articles = await Article.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      count: articles.length,
      data: articles,
    });
  } catch (err) {
    console.error("Error fetching articles:", err);
    res.status(500).json({
      success: false,
      message: "Error fetching articles",
      error: err.message,
    });
  }
};

// ✅ جلب مقالة واحدة بالـ ID
const getArticleById = async (req, res) => {
  try {
    const { id } = req.params;

    const article = await Article.findById(id);
    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found",
      });
    }

    res.json({
      success: true,
      data: article,
    });
  } catch (err) {
    console.error("Error fetching article:", err);
    res.status(500).json({
      success: false,
      message: "Error fetching article",
      error: err.message,
    });
  }
};

// ✅ (اختياري) جلب مقالة بالـ slug – لو حابب تستخدمه في الفرونت
const getArticleBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const article = await Article.findOne({ slug });
    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found",
      });
    }

    res.json({
      success: true,
      data: article,
    });
  } catch (err) {
    console.error("Error fetching article:", err);
    res.status(500).json({
      success: false,
      message: "Error fetching article",
      error: err.message,
    });
  }
};

// ✅ تعديل مقالة
const updateArticle = async (req, res) => {
  try {
    const { id } = req.params;

    const article = await Article.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found",
      });
    }

    res.json({
      success: true,
      message: "Article updated successfully",
      data: article,
    });
  } catch (err) {
    console.error("Error updating article:", err);
    res.status(500).json({
      success: false,
      message: "Error updating article",
      error: err.message,
    });
  }
};

// ✅ حذف مقالة
const deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;

    const article = await Article.findByIdAndDelete(id);
    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found",
      });
    }

    res.json({
      success: true,
      message: "Article deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting article:", err);
    res.status(500).json({
      success: false,
      message: "Error deleting article",
      error: err.message,
    });
  }
};

module.exports = {
  createArticle,
  getAllArticles,
  getArticleById,
  getArticleBySlug,
  updateArticle,
  deleteArticle,
};
