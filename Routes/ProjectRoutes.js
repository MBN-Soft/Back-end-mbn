// src/routes/projectRoutes.js
const express = require("express");
const {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
} = require("../Controller/projectController");

const upload = require("../Midderlware/uploadProjectImages");


const {
  authMiddleware,
  adminMiddleware,
  ProjectMiddleware, // لو هتستخدمه
} = require("../Midderlware/auth");

const validateObjectId = require("../Midderlware/validateObjectId");

const router = express.Router();

// ✅ عرض كل المشاريع (public)
router.get("/projects", getAllProjects);

// ✅ عرض مشروع واحد (public + validate ID)
router.get("/projects/:id", validateObjectId, getProjectById);

// ✅ إضافة مشروع (لازم يكون مستخدم + أدمن)
router.post( "/projects",
  authMiddleware,
  adminMiddleware,
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "galleryImages", maxCount: 10 },
  ]),
  createProject
);
// أو لو عايز تستخدم ProjectMiddleware:
// router.post("/projects", authMiddleware, ProjectMiddleware, createProject);

// ✅ تعديل مشروع
router.put(
  "/projects/:id",
  authMiddleware,
  adminMiddleware,
  validateObjectId,
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "galleryImages", maxCount: 10 },
  ]),
  updateProject
);


// ✅ حذف مشروع
router.delete(
  "/projects/:id",
  authMiddleware,
  adminMiddleware,
  validateObjectId,
  deleteProject
);

module.exports = router;
