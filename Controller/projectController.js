// src/Models/Project.js
const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    Title: { type: String, required: true },
    Tag: { type: String, required: true },
    SemiDesc: { type: String, required: true },
    FullDesc: { type: String, required: true },
    ClientName: { type: String, required: true },
    Technology: { type: String, required: true },
    Category: { type: String, required: true },
    FinishDate: { type: Date, required: true },

    // 🟢 الصور
    mainImage: {
      type: String, // URL أو path
      required: true,
    },

    galleryImages: [
      {
        type: String, // URLs أو paths
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);
