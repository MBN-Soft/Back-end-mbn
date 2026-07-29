// // src/Controller/articleController.js
// // const Article = require("../Models/Article");
// const supabase = require("../utils/supabaseClient");


// // ✅ إضافة مقالة جديدة
// const createArticle = async (req, res) => {
//   try {
//     if (!req.user || !req.user.id) {
//       return res.status(401).json({
//         success: false,
//         message: "Unauthorized",
//       });
//     }

//     const {
//       title,
//       slug,
//       shortDescription,
//       content,
//       category,
//       author,
//       mainImage,
//       extraImages,
//       tags,
//       metaTitle,
//       metaDescription,
//       status,
//     } = req.body;

//     if (!title || !slug || !shortDescription || !content || !mainImage) {
//       return res.status(400).json({
//         success: false,
//         message:
//           "title, slug, shortDescription, content, mainImage are required",
//       });
//     }

//     const { data: exists } = await supabase
//       .from("articles")
//       .select("id")
//       .eq("slug", slug)
//       .single();

//     if (exists) {
//       return res.status(400).json({
//         success: false,
//         message: "Slug already exists",
//       });
//     }

//     const { data: article, error } = await supabase
//       .from("articles")
//       .insert({
//         title,
//         slug,
//         short_description: shortDescription,
//         content,
//         category,
//         author,
//         main_image: mainImage,
//         extra_images: extraImages || [],
//         tags: tags || [],
//         meta_title: metaTitle,
//         meta_description: metaDescription,
//         status,
//         created_by: req.user.id, // 🔥 UUID مطابق FK
//       })
//       .select()
//       .single();

//     if (error) throw error;

//     res.status(201).json({
//       success: true,
//       message: "Article created successfully",
//       data: article,
//     });
//   } catch (err) {
//     console.error("Create article error:", err);
//     res.status(500).json({
//       success: false,
//       message: "Error creating article",
//       error: err.message,
//     });
//   }
// };


// // ✅ جلب كل المقالات
// const getAllArticles = async (req, res) => {
//   try {
//     const { data: articles, error } = await supabase
//       .from("articles")
//       .select("*")
//       .order("created_at", { ascending: false });

//     if (error) throw error;

//     res.json({
//       success: true,
//       count: articles.length,
//       data: articles,
//     });
//   } catch (err) {
//     console.error("Error fetching articles:", err);
//     res.status(500).json({
//       success: false,
//       message: "Error fetching articles",
//       error: err.message,
//     });
//   }
// };


// // ✅ جلب مقالة واحدة بالـ ID
// const getArticleById = async (req, res) => {
//   try {
//     const { id } = req.params;

//     // جلب المقالة حسب id
//     const { data: article, error } = await supabase
//       .from("articles")
//       .select("*")
//       .eq("id", id)
//       .single(); // single() عشان يرجع عنصر واحد بدل array

//     if (error || !article) {
//       return res.status(404).json({
//         success: false,
//         message: "Article not found",
//       });
//     }

//     res.json({
//       success: true,
//       data: article,
//     });
//   } catch (err) {
//     console.error("Error fetching article:", err);
//     res.status(500).json({
//       success: false,
//       message: "Error fetching article",
//       error: err.message,
//     });
//   }
// };

// // ✅ (اختياري) جلب مقالة بالـ slug – لو حابب تستخدمه في الفرونت
// const getArticleBySlug = async (req, res) => {
//   try {
//     const { slug } = req.params;

//     const { data: article, error } = await supabase
//       .from("articles")
//       .select("*")
//       .eq("slug", slug)
//       .single();

//     if (error || !article) {
//       return res.status(404).json({
//         success: false,
//         message: "Article not found",
//       });
//     }

//     res.json({
//       success: true,
//       data: article,
//     });
//   } catch (err) {
//     console.error("Error fetching article:", err);
//     res.status(500).json({
//       success: false,
//       message: "Error fetching article",
//       error: err.message,
//     });
//   }
// };


// // ✅ تعديل مقالة
// const updateArticle = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const { data: article, error } = await supabase
//       .from("articles")
//       .update(req.body)
//       .eq("id", id)
//       .select()
//       .single();

//     if (error || !article) {
//       return res.status(404).json({
//         success: false,
//         message: "Article not found",
//       });
//     }

//     res.json({
//       success: true,
//       message: "Article updated successfully",
//       data: article,
//     });
//   } catch (err) {
//     console.error("Error updating article:", err);
//     res.status(500).json({
//       success: false,
//       message: "Error updating article",
//       error: err.message,
//     });
//   }
// };


// // ✅ حذف مقالة
// const deleteArticle = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const { data, error } = await supabase
//       .from("articles")
//       .delete()
//       .eq("id", id);

//     if (error || !data || data.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "Article not found",
//       });
//     }

//     res.json({
//       success: true,
//       message: "Article deleted successfully",
//     });
//   } catch (err) {
//     console.error("Error deleting article:", err);
//     res.status(500).json({
//       success: false,
//       message: "Error deleting article",
//       error: err.message,
//     });
//   }
// };



// module.exports = {
//   createArticle,
//   getAllArticles,
//   getArticleById,
//   getArticleBySlug,
//   updateArticle,
//   deleteArticle,
// };



// src/Controller/articleController.js

const { Prisma } = require("@prisma/client");
const { prisma } = require("../Config/prisma");

// تحويل الـ ID إلى رقم صحيح
const parseId = (value) => {
  const id = Number(value);

  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }

  return id;
};

// ضمان أن القيمة Array
const normalizeArray = (value) => {
  if (Array.isArray(value)) {
    return value;
  }

  // أحيانًا FormData يرسل الـ array كنص JSON
  if (typeof value === "string") {
    try {
      const parsedValue = JSON.parse(value);

      return Array.isArray(parsedValue) ? parsedValue : [];
    } catch {
      return value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }

  return [];
};

// تنظيف بيانات المقالة ومنع إرسال حقول غير موجودة إلى Prisma
const buildArticleData = (body, isUpdate = false) => {
  const data = {};

  const stringFields = [
    "title",
    "slug",
    "shortDescription",
    "content",
    "category",
    "author",
    "mainImage",
    "metaTitle",
    "metaDescription",
  ];

  stringFields.forEach((field) => {
    if (body[field] !== undefined) {
      data[field] = body[field];
    }
  });

  if (body.extraImages !== undefined) {
    data.extraImages = normalizeArray(body.extraImages);
  }

  if (body.tags !== undefined) {
    data.tags = normalizeArray(body.tags);
  }

  if (body.status !== undefined) {
    data.status = body.status;
  } else if (!isUpdate) {
    data.status = "draft";
  }

  return data;
};

// إضافة مقالة جديدة
const createArticle = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const {
      title,
      slug,
      shortDescription,
      content,
      mainImage,
      status,
    } = req.body;

    if (!title || !slug || !shortDescription || !content || !mainImage) {
      return res.status(400).json({
        success: false,
        message:
          "title, slug, shortDescription, content and mainImage are required",
      });
    }

    if (status && !["draft", "published"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be draft or published",
      });
    }

    const createdById = parseId(req.user.id);

    if (!createdById) {
      return res.status(401).json({
        success: false,
        message: "Invalid authenticated user ID",
      });
    }

    const existingArticle = await prisma.article.findUnique({
      where: {
        slug,
      },
      select: {
        id: true,
      },
    });

    if (existingArticle) {
      return res.status(409).json({
        success: false,
        message: "Slug already exists",
      });
    }

    const userExists = await prisma.user.findUnique({
      where: {
        id: createdById,
      },
      select: {
        id: true,
      },
    });

    if (!userExists) {
      return res.status(401).json({
        success: false,
        message: "Authenticated user not found",
      });
    }

    const articleData = buildArticleData(req.body);

    const article = await prisma.article.create({
      data: {
        ...articleData,
        createdById,
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    return res.status(201).json({
      success: true,
      message: "Article created successfully",
      data: article,
    });
  } catch (err) {
    console.error("Create article error:", err);

    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      return res.status(409).json({
        success: false,
        message: "Slug already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Error creating article",
      error: err.message,
    });
  }
};

// جلب كل المقالات
const getAllArticles = async (req, res) => {
  try {
    const articles = await prisma.article.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      count: articles.length,
      data: articles,
    });
  } catch (err) {
    console.error("Error fetching articles:", err);

    return res.status(500).json({
      success: false,
      message: "Error fetching articles",
      error: err.message,
    });
  }
};

// جلب مقالة واحدة بالـ ID
const getArticleById = async (req, res) => {
  try {
    const id = parseId(req.params.id);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Invalid article ID",
      });
    }

    const article = await prisma.article.findUnique({
      where: {
        id,
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: article,
    });
  } catch (err) {
    console.error("Error fetching article:", err);

    return res.status(500).json({
      success: false,
      message: "Error fetching article",
      error: err.message,
    });
  }
};

// جلب مقالة بالـ slug
const getArticleBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    if (!slug) {
      return res.status(400).json({
        success: false,
        message: "Slug is required",
      });
    }

    const article = await prisma.article.findUnique({
      where: {
        slug,
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: article,
    });
  } catch (err) {
    console.error("Error fetching article:", err);

    return res.status(500).json({
      success: false,
      message: "Error fetching article",
      error: err.message,
    });
  }
};

// تعديل مقالة
const updateArticle = async (req, res) => {
  try {
    const id = parseId(req.params.id);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Invalid article ID",
      });
    }

    if (
      req.body.status !== undefined &&
      !["draft", "published"].includes(req.body.status)
    ) {
      return res.status(400).json({
        success: false,
        message: "Status must be draft or published",
      });
    }

    const existingArticle = await prisma.article.findUnique({
      where: {
        id,
      },
    });

    if (!existingArticle) {
      return res.status(404).json({
        success: false,
        message: "Article not found",
      });
    }

    if (
      req.body.slug &&
      req.body.slug !== existingArticle.slug
    ) {
      const slugExists = await prisma.article.findUnique({
        where: {
          slug: req.body.slug,
        },
        select: {
          id: true,
        },
      });

      if (slugExists) {
        return res.status(409).json({
          success: false,
          message: "Slug already exists",
        });
      }
    }

    const articleData = buildArticleData(req.body, true);

    if (Object.keys(articleData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided for update",
      });
    }

    const article = await prisma.article.update({
      where: {
        id,
      },
      data: articleData,
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: "Article updated successfully",
      data: article,
    });
  } catch (err) {
    console.error("Error updating article:", err);

    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      return res.status(409).json({
        success: false,
        message: "Slug already exists",
      });
    }

    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2025"
    ) {
      return res.status(404).json({
        success: false,
        message: "Article not found",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Error updating article",
      error: err.message,
    });
  }
};

// حذف مقالة
const deleteArticle = async (req, res) => {
  try {
    const id = parseId(req.params.id);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Invalid article ID",
      });
    }

    const existingArticle = await prisma.article.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });

    if (!existingArticle) {
      return res.status(404).json({
        success: false,
        message: "Article not found",
      });
    }

    const deletedArticle = await prisma.article.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Article deleted successfully",
      data: deletedArticle,
    });
  } catch (err) {
    console.error("Error deleting article:", err);

    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2025"
    ) {
      return res.status(404).json({
        success: false,
        message: "Article not found",
      });
    }

    return res.status(500).json({
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