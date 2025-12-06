// src/Models/Article.js   (أو المسار اللي عندك)
const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    shortDescription: { type: String, required: true, trim: true, maxlength: 300 },
    content: { type: String, required: true },
    category: { type: String, trim: true },
    author: { type: String, trim: true },
    mainImage: { type: String, required: true, trim: true },
    extraImages: [{ type: String, trim: true }],
    tags: [{ type: String, trim: true }],
    metaTitle: { type: String, trim: true, maxlength: 70 },
    metaDescription: { type: String, trim: true, maxlength: 170 },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// ❌ هنا كانت المشكلة عندك: pre hook بيستقبل next وبعدين حد بيناديه غلط
// ✅ خلّيه بسيط من غير next خالص
articleSchema.pre("validate", function () {
  if (this.slug) {
    this.slug = this.slug.toString().toLowerCase().trim();
  }
});

module.exports = mongoose.model("Article", articleSchema);
