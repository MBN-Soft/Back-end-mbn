const supabase = require("../utils/supabaseClient");

// Helpers: يحوّل من API fields إلى DB columns
const mapBodyToDb = (body) => {
  const {
    Title,
    Tag,
    SemiDesc,
    FullDesc,
    ClientName,
    Tecnology,   // انت كاتبها Tecnology في الـ API
    FinishDate,
    Category,
    Link,
  } = body;

  return {
    title: Title,
    tag: Tag,
    semi_desc: SemiDesc,
    full_desc: FullDesc,
    client_name: ClientName,
    technology: Tecnology,
    category: Category,
    finish_date: FinishDate,
    // مفيش عمود link في جدولك حسب اللي بعته -> هنخليه اختياري لو أنت هتضيفه لاحقًا
    // لو عندك عمود link فعلًا ضيفه في الجدول أو سيبه هنا
    ...(Link !== undefined ? { link: Link || null } : {}),
  };
};

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
      Category,
    } = req.body;

    // Validation required fields
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

    // Map to DB columns
    const payload = mapBodyToDb(req.body);

    // Attach image paths to DB columns
    payload.main_image = mainImagePath;
    payload.gallery_images = galleryPaths;

    const { data: project, error } = await supabase
      .from("projects")
      .insert(payload)
      .select("*")
      .single();

    if (error) throw error;

    return res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: project,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
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

    return res.json({ success: true, data: projects });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
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

    return res.json({ success: true, data: project });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
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

    // هنحوّل فقط الحقول اللي جاية (partial update)
    const updates = {};

    if (req.body.Title !== undefined) updates.title = req.body.Title;
    if (req.body.Tag !== undefined) updates.tag = req.body.Tag;
    if (req.body.SemiDesc !== undefined) updates.semi_desc = req.body.SemiDesc;
    if (req.body.FullDesc !== undefined) updates.full_desc = req.body.FullDesc;
    if (req.body.ClientName !== undefined) updates.client_name = req.body.ClientName;
    if (req.body.Tecnology !== undefined) updates.technology = req.body.Tecnology;
    if (req.body.Category !== undefined) updates.category = req.body.Category;
    if (req.body.FinishDate !== undefined) updates.finish_date = req.body.FinishDate;

    // لو عندك عمود link فعلاً في الجدول، فعّل السطر ده
    if (req.body.Link !== undefined) updates.link = req.body.Link || null;

    // Files
    const main = req.files?.mainImage?.[0];
    const gallery = req.files?.galleryImages || [];

    if (main) updates.main_image = `/uploads/project/${main.filename}`;
    if (gallery.length > 0) updates.gallery_images = gallery.map(f => `/uploads/project/${f.filename}`);

    // لو مفيش أي updates
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields provided to update",
      });
    }

    const { data: project, error } = await supabase
      .from("projects")
      .update(updates)
      .eq("id", id)
      .select("*")
      .single();

    if (error || !project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    return res.json({
      success: true,
      message: "Project updated successfully",
      data: project,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
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
      .select("*");

    if (error || !data || data.length === 0) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    return res.json({ success: true, message: "Project deleted successfully" });

  } catch (err) {
    console.error(err);
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
  deleteProject
};
