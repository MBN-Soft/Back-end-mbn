const jwt = require("jsonwebtoken");

// ✅ Auth Middleware (JWT)
const authMiddleware = (req, res, next) => {
  try {
    const authHeader =
      req.headers.authorization || req.headers["authorization"];

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    // Bearer TOKEN
    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).json({
        success: false,
        message: "Invalid token format",
      });
    }

    const token = parts[1];

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is missing");
      return res.status(500).json({
        success: false,
        message: "Server configuration error",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔥 أهم سطر (UUID مطابق لجدول users)
    req.user = {
      id: decoded.id,       // UUID
      email: decoded.email,
      role: decoded.role,
    };

    if (!req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Invalid token payload",
      });
    }

    next();
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

// ✅ Role Middleware
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

const superAdminOnly = allowRoles("superadmin");
const adminMiddleware = allowRoles("admin", "superadmin");
const ProjectMiddleware = allowRoles("writer", "admin", "superadmin");

module.exports = {
  authMiddleware,
  adminMiddleware,
  ProjectMiddleware,
  superAdminOnly,
};
