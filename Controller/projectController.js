const supabase = require("../utils/supabaseClient");
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
      Link,
      Category,
    } = req.body;

    if (
      !Title || !Tag || !SemiDesc || !FullDesc ||
      !ClientName || !Tecnology || !FinishDate || !Category
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    // main image required
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

    const { data: project, error } = await supabase
      .from("projects")
      .insert({
        Title,
        Tag,
        SemiDesc,
        FullDesc,
        ClientName,
        Tecnology,
        FinishDate,
        Category,
        Link: Link || null,
        mainImage: mainImagePath,
        galleryImages: galleryPaths
      })
      .select()
      .single();

    if (error) throw error;

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
    const { data: projects, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.json({ success: true, data: projects });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error fetching projects",
      error: err.message,
    });
  }
};

// ✅ جلب مشروع واحد بالـ ID
const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: project, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    res.json({ success: true, data: project });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error fetching project",
      error: err.message,
    });
  }
};

// ✅ تعديل مشروع
const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    const main = req.files?.mainImage?.[0];
    const gallery = req.files?.galleryImages || [];

    if (main) updates.mainImage = `/uploads/project/${main.filename}`;
    if (gallery.length > 0) updates.galleryImages = gallery.map(f => `/uploads/project/${f.filename}`);

    const { data: project, error } = await supabase
      .from("projects")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error || !project) {
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

    const { data, error } = await supabase
  .from("projects")
  .delete()
  .eq("id", id)
  .select();

    if (error || !data || data.length === 0) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    res.json({ success: true, message: "Project deleted successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({
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
  deleteProject
};
