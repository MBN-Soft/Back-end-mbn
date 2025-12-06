// src/Models/Project.js
const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    Title: { type: String, required: true },
    Tag: { type: String, required: true },
    SemiDesc: { type: String, required: true },
    FullDesc: { type: String, required: true },
    ClientName: { type: String, required: true },
    Tecnology: { type: String, required: true }, // أو Technology لو حابب تصحح الاسم
    FinishDate: { type: Date, required: true },
    // ممكن تخليها رابط صورة أو Object
    Imgproject: { type: String }, // مثال: رابط الصورة
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);
