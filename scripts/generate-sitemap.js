import { createClient } from "@supabase/supabase-js";
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, "..");

function loadEnv() {
  try {
    const envPath = join(rootDir, ".env");
    const envContent = readFileSync(envPath, "utf-8");
    const envVars = {};
    for (const line of envContent.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const [key, ...valueParts] = trimmed.split("=");
      if (key && valueParts.length > 0) {
        envVars[key.trim()] = valueParts.join("=").trim().replace(/^["']|["']$/g, "");
      }
    }
    return envVars;
  } catch {
    return {};
  }
}

const env = loadEnv();
const supabaseUrl = env.VITE_SUPABASE_URL || "https://djasykbaoqceslmfusfj.supabase.co";
const supabaseKey = env.VITE_SUPABASE_PUBLISHABLE_KEY;
const baseUrl = "https://cleanhousednr.ru";

async function generateSitemap() {
  const fallbackDate = new Date().toISOString().split('T')[0];
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${fallbackDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/services</loc>
    <lastmod>${fallbackDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
`;

  if (supabaseKey) {
    try {
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { data: services, error } = await supabase
        .from("services")
        .select("id, updated_at")
        .eq("is_active", true)
        .order("sort_order");

      if (error) {
        console.error("Failed to fetch services:", error.message);
      } else if (services && services.length > 0) {
        for (const service of services) {
          const lastmod = service.updated_at ? new Date(service.updated_at).toISOString().split('T')[0] : fallbackDate;
          sitemap += `  <url>
    <loc>${baseUrl}/services/${service.id}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;
        }
        console.log(`Sitemap generated with ${services.length} service pages`);
      }
    } catch (err) {
      console.error("Error fetching services:", err);
    }
  } else {
    console.warn("VITE_SUPABASE_PUBLISHABLE_KEY not set, generating sitemap without service pages");
  }

  sitemap += `  <url>
    <loc>${baseUrl}/privacy</loc>
    <lastmod>${fallbackDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.4</priority>
  </url>
  <url>
    <loc>${baseUrl}/offer</loc>
    <lastmod>${fallbackDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.4</priority>
  </url>
</urlset>
`;

  writeFileSync(join(rootDir, "public", "sitemap.xml"), sitemap, "utf-8");
}

generateSitemap().catch((err) => {
  console.error("Sitemap generation failed:", err);
  process.exit(1);
});
