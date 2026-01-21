// src/Controller/articleController.js
const Article = require("../Models/Article");
const supabase = require("../utils/supabaseClient");


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

    // تحقق من وجود slug مسبقاً
    const { data: exists, error: existsError } = await supabase
      .from("articles")
      .select("id")
      .eq("slug", slug)
      .single();

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Slug already exists, please use another slug",
      });
    }

    const { data: article, error } = await supabase
      .from("articles")
      .insert({
        title,
        slug,
        short_description: shortDescription,
        content,
        category,
        author,
        main_image: mainImage,
        extra_images: extraImages || [],
        tags: tags || [],
        meta_title: metaTitle,
        meta_description: metaDescription,
        status,
        created_by: req.user ? req.user.id : null
      })
      .select()
      .single();

    if (error) throw error;

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
    const { data: articles, error } = await supabase
      .from("articles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

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

    // جلب المقالة حسب id
    const { data: article, error } = await supabase
      .from("articles")
      .select("*")
      .eq("id", id)
      .single(); // single() عشان يرجع عنصر واحد بدل array

    if (error || !article) {
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

    const { data: article, error } = await supabase
      .from("articles")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error || !article) {
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

    const { data: article, error } = await supabase
      .from("articles")
      .update(req.body)
      .eq("id", id)
      .select()
      .single();

    if (error || !article) {
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

    const { data, error } = await supabase
      .from("articles")
      .delete()
      .eq("id", id);

    if (error || !data || data.length === 0) {
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
