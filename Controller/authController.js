// src/controllers/authController.js
const jwt = require("jsonwebtoken");
const supabase = require("../utils/supabaseClient");

const User = require("../Models/User"); // أو ../models/User حسب الفولدر

const createToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};


/**
 * 🟢 registerAdmin (هنا بقت: عمل أول Super Admin في السيستم)
 * - استخدمها مرة واحدة بس في البداية
 * - لو فيه يوزر واحد على الأقل → تمنع إنشاء سوبر أدمن جديد
 */
const registerAdmin = async (req, res) => {
  try {
    // تحقق لو فيه users موجودين بالفعل
    const { data: users, error: fetchError } = await supabase
      .from("users")
      .select("id")
      .limit(1);

    if (users.length > 0) {
      return res.status(403).json({
        success: false,
        message: "Super admin already initialized",
      });
    }

    const { name, email, password } = req.body;

    // تحقق من وجود email مسبقاً
    const { data: exists } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (exists) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const { data: user, error } = await supabase
      .from("users")
      .insert({
        name,
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        role: "superadmin"
      })
      .select()
      .single();

    if (error) throw error;

    const token = createToken(user);

    res.status(201).json({
      success: true,
      message: "Super admin created successfully",
      token,
      user,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error creating super admin",
      error: err.message,
    });
  }
};

/**
 * 🟢 loginAdmin
 * - تقدر تستخدمه كـ login عام لأي يوزر (سواء superadmin / admin / writer)
 */
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data: user } = await supabase
      .from("users")
      .select("*")
      .eq("email", email.toLowerCase().trim())
      .single();

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = createToken(user);

    res.json({
      success: true,
      message: "Logged in successfully",
      token,
      user,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error logging in",
      error: err.message,
    });
  }
};

/**
 * 🟣 createUserBySuperAdmin
 * - السوبر أدمن بس هو اللي يستدعيها
 * - ينشئ Admin أو Writer
 */
const createUserBySuperAdmin = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (!["admin", "writer"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Role must be admin or writer",
      });
    }

    const { data: exists } = await supabase
      .from("users")
      .select("id")
      .eq("email", email.toLowerCase().trim())
      .single();

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Email already in use",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { data: user, error } = await supabase
      .from("users")
      .insert({
        name,
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        role
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error creating user",
      error: err.message,
    });
  }
};

/**
 * 🟣 updateUserRole
 * - السوبر أدمن يعدّل صلاحيات أي يوزر تاني
 */
const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!["superadmin", "admin", "writer"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    const { data: user, error } = await supabase
      .from("users")
      .update({ role })
      .eq("id", id)
      .select()
      .single();

    if (error || !user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "User role updated successfully",
      user,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error updating user role",
      error: err.message,
    });
  }
};


// 🟢 Get All Users (Super Admin Only)
const getAllUsers = async (req, res) => {
  try {
    const { data: users, error } = await supabase
      .from("users")
      .select("id, name, email, role, created_at, updated_at"); // بدون password

    if (error) throw error;

    res.json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error fetching users",
      error: err.message,
    });
  }
};



// 🛑 السوبر أدمن يحذف أي يوزر (عدا السوبر أدمن)
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: user } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.role === "superadmin") {
      return res.status(403).json({
        success: false,
        message: "Cannot delete a superadmin",
      });
    }

    const { error } = await supabase
      .from("users")
      .delete()
      .eq("id", id);

    if (error) throw error;

    res.json({
      success: true,
      message: "User deleted successfully",
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error deleting user",
      error: err.message,
    });
  }
};


module.exports = {
  registerAdmin,        // دلوقتي = إنشاء أول سوبر أدمن
  loginAdmin,           // Login عام
  createUserBySuperAdmin,
  updateUserRole,
  deleteUser,
  getAllUsers
};
