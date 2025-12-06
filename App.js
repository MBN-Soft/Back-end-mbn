// src/app.js
const express = require("express");
const cors = require("cors");
const connectDB = require("./Config/db");

const authRoutes = require("./Routes/authRoutes");
const contactRoutes = require("./Routes/contactRoutes");
const adminRoutes = require("./Routes/adminRoutes");
const ProjectRoutes = require("./Routes/ProjectRoutes");
const articleRoutes = require("./Routes/articleRoutes");



const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Connect DB
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api", ProjectRoutes);
app.use("/api", articleRoutes);



app.get("/", (req, res) => {
  res.send("API is running...");
});



module.exports = app;
