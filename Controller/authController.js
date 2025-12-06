// src/controllers/authController.js
const jwt = require("jsonwebtoken");
const User = require("../Models/User"); // أو ../models/User حسب الفولدر

const createToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
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
    const { name, email, password } = req.body;

    // لو فيه يوزرز موجودين، امنع إنشاء سوبر جديد
    const usersCount = await User.countDocuments();
    if (usersCount > 0) {
      return res.status(403).json({
        success: false,
        message: "Super admin already initialized",
      });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const user = new User({
      name,
      email,
      password, // هيتشفّر في pre('save')
      role: "superadmin",
    });

    await user.save();

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

    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });

    const isMatch = await user.checkPassword(password);
    if (!isMatch)
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });

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
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    if (!["admin", "writer"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Role must be admin or writer",
      });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res
        .status(400)
        .json({ success: false, message: "Email already in use" });
    }

    const user = new User({
      name,
      email,
      password,
      role,
    });

    await user.save();

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

    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
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
    // رجّع كل اليوزرز بدون الـ password
    const users = await User.find().select("-password");

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

    // لو المستخدم اللي بيتحذف سوبر أدمن → ممنوع
    const user = await User.findById(id);

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

    await User.findByIdAndDelete(id);

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
