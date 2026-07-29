// // src/controllers/authController.js
// const jwt = require("jsonwebtoken");
// const supabase = require("../utils/supabaseClient");
// const bcrypt = require("bcryptjs"); // أو bcrypt


// // const User = require("../Models/User"); // أو ../models/User حسب الفولدر

// const createToken = (user) => {
//   return jwt.sign(
//     { id: user.id, email: user.email, role: user.role },
//     process.env.JWT_SECRET,
//     { expiresIn: "7d" }
//   );
// };


// /**
//  * 🟢 registerAdmin (هنا بقت: عمل أول Super Admin في السيستم)
//  * - استخدمها مرة واحدة بس في البداية
//  * - لو فيه يوزر واحد على الأقل → تمنع إنشاء سوبر أدمن جديد
//  */
// const registerAdmin = async (req, res) => {
//   try {
//     // تحقق لو فيه users موجودين بالفعل
//     const { data: users, error: fetchError } = await supabase
//       .from("users")
//       .select("id")
//       .limit(1);

//     if (users.length > 0) {
//       return res.status(403).json({
//         success: false,
//         message: "Super admin already initialized",
//       });
//     }

//     const { name, email, password } = req.body;

//     // تحقق من وجود email مسبقاً
//     const { data: exists } = await supabase
//       .from("users")
//       .select("id")
//       .eq("email", email)
//       .single();

//     if (exists) {
//       return res
//         .status(400)
//         .json({ success: false, message: "User already exists" });
//     }

//     // hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     const { data: user, error } = await supabase
//       .from("users")
//       .insert({
//         name,
//         email: email.toLowerCase().trim(),
//         password: hashedPassword,
//         role: "superadmin"
//       })
//       .select()
//       .single();

//     if (error) throw error;

//     const token = createToken(user);

//     res.status(201).json({
//       success: true,
//       message: "Super admin created successfully",
//       token,
//       user,
//     });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({
//       success: false,
//       message: "Error creating super admin",
//       error: err.message,
//     });
//   }
// };

// /**
//  * 🟢 loginAdmin
//  * - تقدر تستخدمه كـ login عام لأي يوزر (سواء superadmin / admin / writer)
//  */
// const loginAdmin = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const { data: user } = await supabase
//       .from("users")
//       .select("*")
//       .eq("email", email.toLowerCase().trim())
//       .single();

//     if (!user) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid email or password",
//       });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid email or password",
//       });
//     }

//     const token = createToken(user);

//     res.json({
//       success: true,
//       message: "Logged in successfully",
//       token,
//       user,
//     });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({
//       success: false,
//       message: "Error logging in",
//       error: err.message,
//     });
//   }
// };

// /**
//  * 🟣 createUserBySuperAdmin
//  * - السوبر أدمن بس هو اللي يستدعيها
//  * - ينشئ Admin أو Writer
//  */
// const createUserBySuperAdmin = async (req, res) => {
//   try {
//     const { name, email, password, role } = req.body;

//     if (!name || !email || !password || !role) {
//       return res.status(400).json({
//         success: false,
//         message: "All fields are required",
//       });
//     }

//     if (!["admin", "writer"].includes(role)) {
//       return res.status(400).json({
//         success: false,
//         message: "Role must be admin or writer",
//       });
//     }

//     const { data: exists } = await supabase
//       .from("users")
//       .select("id")
//       .eq("email", email.toLowerCase().trim())
//       .single();

//     if (exists) {
//       return res.status(400).json({
//         success: false,
//         message: "Email already in use",
//       });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const { data: user, error } = await supabase
//       .from("users")
//       .insert({
//         name,
//         email: email.toLowerCase().trim(),
//         password: hashedPassword,
//         role
//       })
//       .select()
//       .single();

//     if (error) throw error;

//     res.status(201).json({
//       success: true,
//       message: "User created successfully",
//       user,
//     });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({
//       success: false,
//       message: "Error creating user",
//       error: err.message,
//     });
//   }
// };

// /**
//  * 🟣 updateUserRole
//  * - السوبر أدمن يعدّل صلاحيات أي يوزر تاني
//  */
// const updateUserRole = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { role } = req.body;

//     if (!["superadmin", "admin", "writer"].includes(role)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid role",
//       });
//     }

//     const { data: user, error } = await supabase
//       .from("users")
//       .update({ role })
//       .eq("id", id)
//       .select()
//       .single();

//     if (error || !user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     res.json({
//       success: true,
//       message: "User role updated successfully",
//       user,
//     });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({
//       success: false,
//       message: "Error updating user role",
//       error: err.message,
//     });
//   }
// };


// // 🟢 Get All Users (Super Admin Only)
// const getAllUsers = async (req, res) => {
//   try {
//     const { data: users, error } = await supabase
//       .from("users")
//       .select("id, name, email, role, created_at, updated_at"); // بدون password

//     if (error) throw error;

//     res.json({
//       success: true,
//       count: users.length,
//       data: users,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({
//       success: false,
//       message: "Error fetching users",
//       error: err.message,
//     });
//   }
// };



// // 🛑 السوبر أدمن يحذف أي يوزر (عدا السوبر أدمن)
// const deleteUser = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const { data: user } = await supabase
//       .from("users")
//       .select("*")
//       .eq("id", id)
//       .single();

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     if (user.role === "superadmin") {
//       return res.status(403).json({
//         success: false,
//         message: "Cannot delete a superadmin",
//       });
//     }

//     const { error } = await supabase
//       .from("users")
//       .delete()
//       .eq("id", id);

//     if (error) throw error;

//     res.json({
//       success: true,
//       message: "User deleted successfully",
//     });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({
//       success: false,
//       message: "Error deleting user",
//       error: err.message,
//     });
//   }
// };


// module.exports = {
//   registerAdmin,        // دلوقتي = إنشاء أول سوبر أدمن
//   loginAdmin,           // Login عام
//   createUserBySuperAdmin,
//   updateUserRole,
//   deleteUser,
//   getAllUsers
// };




// src/controllers/authController.js

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { Prisma } = require("@prisma/client");
const { prisma } = require("../Config/prisma");

const ALLOWED_ROLES = ["superadmin", "admin", "writer"];

// إنشاء JWT
const createToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

// تجهيز الإيميل
const normalizeEmail = (email) => {
  return String(email || "").toLowerCase().trim();
};

// التحقق من الـ ID
const parseId = (value) => {
  const id = Number(value);

  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }

  return id;
};

// إزالة الباسورد من بيانات المستخدم
const sanitizeUser = (user) => {
  if (!user) return null;

  const { password, ...safeUser } = user;

  return safeUser;
};

/**
 * إنشاء أول Super Admin
 * تستخدم مرة واحدة فقط.
 */
const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    if (String(password).length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const normalizedEmail = normalizeEmail(email);

    // هل يوجد أي مستخدم بالفعل؟
    const existingUsersCount = await prisma.user.count();

    if (existingUsersCount > 0) {
      return res.status(403).json({
        success: false,
        message: "Super admin already initialized",
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
      select: {
        id: true,
      },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name: String(name).trim(),
        email: normalizedEmail,
        password: hashedPassword,
        role: "superadmin",
      },
    });

    const token = createToken(user);

    return res.status(201).json({
      success: true,
      message: "Super admin created successfully",
      token,
      user: sanitizeUser(user),
    });
  } catch (err) {
    console.error("Register admin error:", err);

    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      return res.status(409).json({
        success: false,
        message: "Email already in use",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Error creating super admin",
      error: err.message,
    });
  }
};

/**
 * Login عام لجميع المستخدمين.
 */
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const normalizedEmail = normalizeEmail(email);

    const user = await prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = createToken(user);

    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
      token,
      user: sanitizeUser(user),
    });
  } catch (err) {
    console.error("Login error:", err);

    return res.status(500).json({
      success: false,
      message: "Error logging in",
      error: err.message,
    });
  }
};

/**
 * السوبر أدمن ينشئ Admin أو Writer.
 */
const createUserBySuperAdmin = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "superadmin") {
      return res.status(403).json({
        success: false,
        message: "Super admin access required",
      });
    }

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

    if (String(password).length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const normalizedEmail = normalizeEmail(email);

    const existingUser = await prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
      select: {
        id: true,
      },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already in use",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name: String(name).trim(),
        email: normalizedEmail,
        password: hashedPassword,
        role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user,
    });
  } catch (err) {
    console.error("Create user error:", err);

    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      return res.status(409).json({
        success: false,
        message: "Email already in use",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Error creating user",
      error: err.message,
    });
  }
};

/**
 * تعديل دور المستخدم.
 */
const updateUserRole = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "superadmin") {
      return res.status(403).json({
        success: false,
        message: "Super admin access required",
      });
    }

    const id = parseId(req.params.id);
    const { role } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    if (!ALLOWED_ROLES.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    /*
     * منع السوبر أدمن من إزالة صلاحية نفسه،
     * لأن ده ممكن يقفل الوصول إلى إدارة النظام.
     */
    if (
      existingUser.id === Number(req.user.id) &&
      existingUser.role === "superadmin" &&
      role !== "superadmin"
    ) {
      return res.status(403).json({
        success: false,
        message: "You cannot remove your own super admin role",
      });
    }

    const user = await prisma.user.update({
      where: {
        id,
      },
      data: {
        role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "User role updated successfully",
      user,
    });
  } catch (err) {
    console.error("Update user role error:", err);

    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2025"
    ) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Error updating user role",
      error: err.message,
    });
  }
};

/**
 * جلب كل المستخدمين بدون الباسورد.
 */
const getAllUsers = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "superadmin") {
      return res.status(403).json({
        success: false,
        message: "Super admin access required",
      });
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (err) {
    console.error("Get all users error:", err);

    return res.status(500).json({
      success: false,
      message: "Error fetching users",
      error: err.message,
    });
  }
};

/**
 * حذف أي مستخدم عدا Super Admin.
 */
const deleteUser = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "superadmin") {
      return res.status(403).json({
        success: false,
        message: "Super admin access required",
      });
    }

    const id = parseId(req.params.id);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

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

    await prisma.user.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (err) {
    console.error("Delete user error:", err);

    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2025"
    ) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Error deleting user",
      error: err.message,
    });
  }
};

module.exports = {
  registerAdmin,
  loginAdmin,
  createUserBySuperAdmin,
  updateUserRole,
  deleteUser,
  getAllUsers,
};