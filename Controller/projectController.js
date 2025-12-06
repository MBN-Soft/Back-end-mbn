// src/controllers/projectController.js
const Project = require("../Models/Project");

// ✅ إضافة مشروع جديد
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
      Imgproject,
    } = req.body;

    // Validation بسيط
    if (
      !Title ||
      !Tag ||
      !SemiDesc ||
      !FullDesc ||
      !ClientName ||
      !Tecnology ||
      !FinishDate
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All required fields must be provided" });
    }

    const project = await Project.create({
      Title,
      Tag,
      SemiDesc,
      FullDesc,
      ClientName,
      Tecnology,
      FinishDate,
      Imgproject,
    });

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: project,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Error creating project", error: err.message });
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
const updateProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findByIdAndUpdate(id, req.body, {
      new: true, // يرجع الدوكيومنت بعد التعديل
      runValidators: true, // يطبّق الـ schema validation
    });

    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    res.json({
      success: true,
      message: "Project updated successfully",
      data: project,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Error updating project", error: err.message });
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
