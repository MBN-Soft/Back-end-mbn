// src/middleware/auth.js
const jwt = require("jsonwebtoken");

// ✅ التحقق من وجود توكن وصحته
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers["authorization"];

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    // لازم يكون Bearer token
    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).json({
        success: false,
        message: "Invalid token format",
      });
    }

    const token = parts[1];

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not defined in environment variables");
      return res.status(500).json({
        success: false,
        message: "Server configuration error",
      });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          success: false,
          message: "Invalid or expired token",
        });
      }

      req.user = decoded; // { id, email, role }
      next();
    });
  } catch (err) {
    console.error("Auth middleware error:", err);
    return res.status(500).json({
      success: false,
      message: "Authentication error",
    });
  }
};

// ✅ ميدل وير عام للأدوار
const allowRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }
    next();
  };
};

// 👑 السوبر أدمن فقط
const superAdminOnly = allowRoles("superadmin");

// ✅ للأدمن + السوبر
const adminMiddleware = allowRoles("admin", "superadmin");

// ✅ للمشاريع: كاتب + أدمن + سوبر
const ProjectMiddleware = allowRoles("writer", "admin", "superadmin");

module.exports = {
  authMiddleware,
  adminMiddleware,
  ProjectMiddleware,
  superAdminOnly,
};
