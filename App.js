const express = require("express");
const cors = require("cors");
const path = require("path");

const { connectDB } = require("./Config/prisma");

const authRoutes = require("./Routes/authRoutes");
const contactRoutes = require("./Routes/contactRoutes");
const adminRoutes = require("./Routes/adminRoutes");
const projectRoutes = require("./Routes/ProjectRoutes");
const articleRoutes = require("./Routes/articleRoutes");
const sitemapRoutes = require("./Routes/sitemapRoutes");

const app = express();

// ================== Middlewares ==================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================== Static uploads ==================
app.use(
  "/uploads",
  express.static(path.join(__dirname, "..", "uploads"))
);

// ================== Connect SQL Database ==================
connectDB();

// ================== Routes ==================
app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api", projectRoutes);
app.use("/api", articleRoutes);
app.use("/api", sitemapRoutes);

// ================== Test route ==================
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running...",
  });
});

// ================== Not Found ==================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// ================== Error Handler ==================
app.use((error, req, res, next) => {
  console.error(error);

  res.status(error.status || 500).json({
    success: false,
    message: error.message || "Internal server error",
  });
});

module.exports = app;