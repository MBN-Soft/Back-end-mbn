// const supabase = require("../utils/supabaseClient");
// // ✅ إضافة مشروع جديد
// const createProject = async (req, res) => {
//   try {
//     const {
//       Title,
//       Tag,
//       SemiDesc,
//       FullDesc,
//       ClientName,
//       Tecnology,
//       FinishDate,
//       Link,
//       Category,
//     } = req.body;

//     if (
//       !Title || !Tag || !SemiDesc || !FullDesc ||
//       !ClientName || !Tecnology || !FinishDate || !Category
//     ) {
//       return res.status(400).json({
//         success: false,
//         message: "All required fields must be provided",
//       });
//     }

//     // main image required
//     const main = req.files?.mainImage?.[0];
//     if (!main) {
//       return res.status(400).json({
//         success: false,
//         message: "mainImage is required",
//       });
//     }

//     const gallery = req.files?.galleryImages || [];
//     const mainImagePath = `/uploads/project/${main.filename}`;
//     const galleryPaths = gallery.map((f) => `/uploads/project/${f.filename}`);

//     const { data: project, error } = await supabase
//       .from("projects")
//       .insert({
//         Title,
//         Tag,
//         SemiDesc,
//         FullDesc,
//         ClientName,
//         Tecnology,
//         FinishDate,
//         Category,
//         Link: Link || null,
//         mainImage: mainImagePath,
//         galleryImages: galleryPaths
//       })
//       .select()
//       .single();

//     if (error) throw error;

//     res.status(201).json({
//       success: true,
//       message: "Project created successfully",
//       data: project,
//     });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({
//       success: false,
//       message: "Error creating project",
//       error: err.message,
//     });
//   }
// };

// // ✅ جلب كل المشاريع
// const getAllProjects = async (req, res) => {
//   try {
//     const { data: projects, error } = await supabase
//       .from("projects")
//       .select("*")
//       .order("created_at", { ascending: false });

//     if (error) throw error;

//     res.json({ success: true, data: projects });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({
//       success: false,
//       message: "Error fetching projects",
//       error: err.message,
//     });
//   }
// };

// // ✅ جلب مشروع واحد بالـ ID
// const getProjectById = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const { data: project, error } = await supabase
//       .from("projects")
//       .select("*")
//       .eq("id", id)
//       .single();

//     if (error || !project) {
//       return res.status(404).json({ success: false, message: "Project not found" });
//     }

//     res.json({ success: true, data: project });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({
//       success: false,
//       message: "Error fetching project",
//       error: err.message,
//     });
//   }
// };

// // ✅ تعديل مشروع
// const updateProject = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updates = { ...req.body };

//     const main = req.files?.mainImage?.[0];
//     const gallery = req.files?.galleryImages || [];

//     if (main) updates.mainImage = `/uploads/project/${main.filename}`;
//     if (gallery.length > 0) updates.galleryImages = gallery.map(f => `/uploads/project/${f.filename}`);

//     const { data: project, error } = await supabase
//       .from("projects")
//       .update(updates)
//       .eq("id", id)
//       .select()
//       .single();

//     if (error || !project) {
//       return res.status(404).json({ success: false, message: "Project not found" });
//     }

//     res.json({
//       success: true,
//       message: "Project updated successfully",
//       data: project,
//     });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({
//       success: false,
//       message: "Error updating project",
//       error: err.message,
//     });
//   }
// };

// // ✅ حذف مشروع
// const deleteProject = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const { data, error } = await supabase
//       .from("projects")
//       .delete()
//       .eq("id", id);

//     if (error || !data || data.length === 0) {
//       return res.status(404).json({ success: false, message: "Project not found" });
//     }

//     res.json({ success: true, message: "Project deleted successfully" });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({
//       success: false,
//       message: "Error deleting project",
//       error: err.message,
//     });
//   }
// };

// module.exports = {
//   createProject,
//   getAllProjects,
//   getProjectById,
//   updateProject,
//   deleteProject
// };


// src/controllers/projectController.js

const { Prisma } = require("@prisma/client");
const { prisma } = require("../Config/prisma");

// تحويل الـ ID إلى رقم
const parseId = (value) => {
  const id = Number(value);

  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }

  return id;
};

// تحويل التاريخ إلى Date صالح
const parseDate = (value) => {
  if (!value) return null;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
};

// تجهيز بيانات المشروع
const buildProjectData = (body, files = {}, isUpdate = false) => {
  const data = {};

  // دعم أسماء الفرونت القديمة وأسماء Prisma الجديدة
  const title = body.title ?? body.Title;
  const tag = body.tag ?? body.Tag;
  const semiDesc = body.semiDesc ?? body.SemiDesc;
  const fullDesc = body.fullDesc ?? body.FullDesc;
  const clientName = body.clientName ?? body.ClientName;

  // الفرونت القديم فيه خطأ إملائي Tecnology
  const technology =
    body.technology ??
    body.Technology ??
    body.Tecnology;

  const category = body.category ?? body.Category;
  const finishDateValue = body.finishDate ?? body.FinishDate;
  const link = body.link ?? body.Link;

  if (title !== undefined) {
    data.title = String(title).trim();
  }

  if (tag !== undefined) {
    data.tag = String(tag).trim();
  }

  if (semiDesc !== undefined) {
    data.semiDesc = String(semiDesc).trim();
  }

  if (fullDesc !== undefined) {
    data.fullDesc = String(fullDesc).trim();
  }

  if (clientName !== undefined) {
    data.clientName = String(clientName).trim();
  }

  if (technology !== undefined) {
    data.technology = String(technology).trim();
  }

  if (category !== undefined) {
    data.category = String(category).trim();
  }

  if (finishDateValue !== undefined) {
    const parsedFinishDate = parseDate(finishDateValue);

    if (parsedFinishDate) {
      data.finishDate = parsedFinishDate;
    }
  }

  // استخدم السطر ده فقط لو أضفت link في Prisma Schema
  if (link !== undefined) {
    data.link = link ? String(link).trim() : null;
  }

  const mainImage = files?.mainImage?.[0];

  if (mainImage) {
    data.mainImage = `/uploads/project/${mainImage.filename}`;
  }

  const galleryImages = files?.galleryImages || [];

  if (galleryImages.length > 0) {
    data.galleryImages = galleryImages.map(
      (file) => `/uploads/project/${file.filename}`
    );
  } else if (!isUpdate) {
    data.galleryImages = [];
  }

  return data;
};

// إضافة مشروع جديد
const createProject = async (req, res) => {
  try {
    const {
      Title,
      title,
      Tag,
      tag,
      SemiDesc,
      semiDesc,
      FullDesc,
      fullDesc,
      ClientName,
      clientName,
      Tecnology,
      Technology,
      technology,
      FinishDate,
      finishDate,
      Category,
      category,
    } = req.body;

    const projectTitle = title || Title;
    const projectTag = tag || Tag;
    const projectSemiDesc = semiDesc || SemiDesc;
    const projectFullDesc = fullDesc || FullDesc;
    const projectClientName = clientName || ClientName;
    const projectTechnology =
      technology || Technology || Tecnology;
    const projectFinishDate = finishDate || FinishDate;
    const projectCategory = category || Category;

    if (
      !projectTitle ||
      !projectTag ||
      !projectSemiDesc ||
      !projectFullDesc ||
      !projectClientName ||
      !projectTechnology ||
      !projectFinishDate ||
      !projectCategory
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    const parsedFinishDate = parseDate(projectFinishDate);

    if (!parsedFinishDate) {
      return res.status(400).json({
        success: false,
        message: "Invalid finish date",
      });
    }

    const mainImage = req.files?.mainImage?.[0];

    if (!mainImage) {
      return res.status(400).json({
        success: false,
        message: "mainImage is required",
      });
    }

    const projectData = buildProjectData(
      req.body,
      req.files,
      false
    );

    projectData.finishDate = parsedFinishDate;

    const project = await prisma.project.create({
      data: projectData,
    });

    return res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: project,
    });
  } catch (err) {
    console.error("Create project error:", err);

    return res.status(500).json({
      success: false,
      message: "Error creating project",
      error: err.message,
    });
  }
};

// جلب كل المشاريع
const getAllProjects = async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (err) {
    console.error("Get projects error:", err);

    return res.status(500).json({
      success: false,
      message: "Error fetching projects",
      error: err.message,
    });
  }
};

// جلب مشروع بالـ ID
const getProjectById = async (req, res) => {
  try {
    const id = parseId(req.params.id);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID",
      });
    }

    const project = await prisma.project.findUnique({
      where: {
        id,
      },
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: project,
    });
  } catch (err) {
    console.error("Get project error:", err);

    return res.status(500).json({
      success: false,
      message: "Error fetching project",
      error: err.message,
    });
  }
};

// تعديل مشروع
const updateProject = async (req, res) => {
  try {
    const id = parseId(req.params.id);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID",
      });
    }

    const existingProject = await prisma.project.findUnique({
      where: {
        id,
      },
    });

    if (!existingProject) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const finishDateValue =
      req.body.finishDate ?? req.body.FinishDate;

    if (finishDateValue !== undefined) {
      const parsedFinishDate = parseDate(finishDateValue);

      if (!parsedFinishDate) {
        return res.status(400).json({
          success: false,
          message: "Invalid finish date",
        });
      }
    }

    const updates = buildProjectData(
      req.body,
      req.files,
      true
    );

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided for update",
      });
    }

    const project = await prisma.project.update({
      where: {
        id,
      },
      data: updates,
    });

    return res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: project,
    });
  } catch (err) {
    console.error("Update project error:", err);

    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2025"
    ) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Error updating project",
      error: err.message,
    });
  }
};

// حذف مشروع
const deleteProject = async (req, res) => {
  try {
    const id = parseId(req.params.id);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID",
      });
    }

    const existingProject = await prisma.project.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });

    if (!existingProject) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    await prisma.project.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (err) {
    console.error("Delete project error:", err);

    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2025"
    ) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Error deleting project",
      error: err.message,
    });
  }
};

module.exports = {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
};