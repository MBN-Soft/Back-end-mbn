// src/routes/authRoutes.js
const express = require("express");
const {
  registerAdmin,
  loginAdmin,
  createUserBySuperAdmin,
  updateUserRole,
  deleteUser,
  getAllUsers
} = require("../Controller/authController");
const { authMiddleware, superAdminOnly } = require("../Midderlware/auth");

const router = express.Router();

// تستخدم مرة واحدة فقط لإنشاء أول سوبر أدمن
router.post("/register-admin", registerAdmin);

// login لأي يوزر
router.post("/login", loginAdmin);

// السوبر أدمن يخلق أدمن/كاتب
router.post("/create-user",authMiddleware,superAdminOnly,createUserBySuperAdmin);

// 🛑 السوبر أدمن يحذف أي يوزر ماعدا السوبر أدمن
router.delete("/users/:id", authMiddleware, superAdminOnly,deleteUser);

router.get("/users", authMiddleware, superAdminOnly, getAllUsers);


// السوبر أدمن يغيّر رول يوزر
router.put("/users/:id/role",authMiddleware,superAdminOnly,updateUserRole);

module.exports = router;
