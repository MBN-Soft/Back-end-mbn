// src/controllers/projectController.js
const Project = require("../Models/Project");

// ✅ إضافة مشروع جديد
// ✅ إضافة مشروع جديد (مع صور)
const createProject = async (req, res) => {
  try {
    const {
      Title,
      Tag,
      SemiDesc,
      FullDesc,
      ClientName,
      Tecnology,
      FinishDate,
      Link,
      Category, // لو عندك
    } = req.body;

    // Validation بسيط
    if (
      !Title ||
      !Tag ||
      !SemiDesc ||
      !FullDesc ||
      !ClientName ||
      !Tecnology ||
      !FinishDate ||
      !Category
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    // ✅ main image required
    const main = req.files?.mainImage?.[0];
    if (!main) {
      return res.status(400).json({
        success: false,
        message: "mainImage is required",
      });
    }

    const gallery = req.files?.galleryImages || [];

    const mainImagePath = `/uploads/project/${main.filename}`;
    const galleryPaths = gallery.map((f) => `/uploads/project/${f.filename}`);

    const project = await Project.create({
      Title,
      Tag,
      SemiDesc,
      FullDesc,
      ClientName,
      Tecnology,
      FinishDate,
      Category,
      mainImage: mainImagePath,
      galleryImages: galleryPaths,
    });

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: project,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error creating project",
      error: err.message,
    });
  }
};


// ✅ جلب كل المشاريع
const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json({ success: true, data: projects });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Error fetching projects", error: err.message });
  }
};

// ✅ جلب مشروع واحد بالـ ID
const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id);
    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    res.json({ success: true, data: project });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Error fetching project", error: err.message });
  }
};

// ✅ تعديل مشروع
// ✅ تعديل مشروع (مع إمكانية تحديث الصور)
const updateProject = async (req, res) => {
  try {
    const { id } = req.params;

    const updates = { ...req.body };

    // لو فيه صور جديدة
    const main = req.files?.mainImage?.[0];
    const gallery = req.files?.galleryImages || [];

    if (main) {
      updates.mainImage = `/uploads/projects/${main.filename}`;
    }

    if (gallery.length > 0) {
      updates.galleryImages = gallery.map((f) => `/uploads/projects/${f.filename}`)
    }

    const project = await Project.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    res.json({
      success: true,
      message: "Project updated successfully",
      data: project,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error updating project",
      error: err.message,
    });
  }
};


// ✅ حذف مشروع
const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findByIdAndDelete(id);

    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    res.json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Error deleting project", error: err.message });
  }
};

module.exports = {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
};
