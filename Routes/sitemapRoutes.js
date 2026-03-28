const express = require("express");
const router = express.Router();
const { getSitemap } = require("../Controller/sitemapController");

router.get("/sitemap.xml", getSitemap);

module.exports = router;
