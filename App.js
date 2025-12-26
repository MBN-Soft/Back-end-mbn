// src/app.js
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./Config/db");

const authRoutes = require("./Routes/authRoutes");
const contactRoutes = require("./Routes/contactRoutes");
const adminRoutes = require("./Routes/adminRoutes");
const projectRoutes = require("./Routes/ProjectRoutes");
const articleRoutes = require("./Routes/articleRoutes");

const app = express();

// ================== Middlewares ==================
app.use(cors());
app.use(express.json());

// ================== Static uploads ==================
// 👇 مهم جدًا عشان الصور تفتح من المتصفح
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ================== Connect DB ==================
connectDB();

// ================== Routes ==================
app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api", projectRoutes);
app.use("/api", articleRoutes);

// ================== Test route ==================
app.get("/", (req, res) => {
  res.send("API is running...");
});

module.exports = app;
