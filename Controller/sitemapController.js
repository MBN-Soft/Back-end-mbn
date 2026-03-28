const supabase = require("../utils/supabaseClient");

exports.getSitemap = async (req, res) => {
  try {
    const baseUrl = `${req.protocol}://${req.get("host")}`;

    // صفحات ثابتة
    const staticPages = ["", "/about", "/contact", "/blog"];

    // 👇 هات المقالات
    const { data: posts, error: postError } = await supabase
      .from("posts")
      .select("slug, updated_at");

    if (postError) throw postError;

    // 👇 هات المنتجات / الباكدجات
    const { data: products, error: productError } = await supabase
      .from("products")
      .select("slug, updated_at");

    if (productError) throw productError;

    // static
    const staticUrls = staticPages.map(
      (page) => `
      <url>
        <loc>${baseUrl}${page}</loc>
      </url>`
    );

    // posts
    const postUrls = posts.map(
      (post) => `
      <url>
        <loc>${baseUrl}/blog/${post.slug}</loc>
        <lastmod>${new Date(post.updated_at).toISOString()}</lastmod>
      </url>`
    );

    // products
    const productUrls = products.map(
      (product) => `
      <url>
        <loc>${baseUrl}/product/${product.slug}</loc>
        <lastmod>${new Date(product.updated_at).toISOString()}</lastmod>
      </url>`
    );

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${staticUrls.join("")}
      ${postUrls.join("")}
      ${productUrls.join("")}
    </urlset>`;

    res.set("Content-Type", "application/xml");
    res.set("Cache-Control", "public, max-age=3600"); // كاش ساعة

    res.send(sitemap);

  } catch (error) {
    console.error("Sitemap Error:", error);
    res.status(500).send("Error generating sitemap");
  }
};
