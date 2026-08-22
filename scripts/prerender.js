import { readFile, writeFile, mkdir, rm } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { render } from "../dist/server/entry-server.js";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const distDir = join(rootDir, "dist");
const template = await readFile(join(distDir, "index.html"), "utf8");
const sitemap = await readFile(join(distDir, "sitemap.xml"), "utf8");
const routes = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => new URL(match[1]).pathname);

function escapeAttribute(value) {
  return String(value).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function serialize(value) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

function createHead(seo, schemas) {
  return [
    `<title data-seo="true">${escapeAttribute(seo.title)}</title>`,
    `<meta data-seo="true" name="description" content="${escapeAttribute(seo.description)}">`,
    `<meta data-seo="true" name="keywords" content="${escapeAttribute(seo.keywords)}">`,
    `<meta data-seo="true" name="robots" content="${escapeAttribute(seo.robots)}">`,
    `<link data-seo="true" rel="canonical" href="${escapeAttribute(seo.canonical)}">`,
    `<link data-seo="true" rel="alternate" hreflang="ru" href="${escapeAttribute(seo.canonical)}">`,
    `<link data-seo="true" rel="alternate" hreflang="x-default" href="${escapeAttribute(seo.canonical)}">`,
    `<meta data-seo="true" property="og:type" content="${seo.type}">`,
    `<meta data-seo="true" property="og:url" content="${escapeAttribute(seo.canonical)}">`,
    `<meta data-seo="true" property="og:title" content="${escapeAttribute(seo.title)}">`,
    `<meta data-seo="true" property="og:description" content="${escapeAttribute(seo.description)}">`,
    `<meta data-seo="true" property="og:image" content="${escapeAttribute(seo.image)}">`,
    `<meta data-seo="true" property="og:image:alt" content="${escapeAttribute(seo.title)}">`,
    `<meta data-seo="true" name="twitter:card" content="summary_large_image">`,
    `<meta data-seo="true" name="twitter:title" content="${escapeAttribute(seo.title)}">`,
    `<meta data-seo="true" name="twitter:description" content="${escapeAttribute(seo.description)}">`,
    `<meta data-seo="true" name="twitter:image" content="${escapeAttribute(seo.image)}">`,
    ...schemas.map((schema) => `<script type="application/ld+json" data-structured-data="true">${serialize(schema)}</script>`),
  ].join("\n    ");
}

for (const route of [...new Set(routes)]) {
  const result = await render(route);
  const stateScript = `<script>window.__REACT_QUERY_STATE__=${serialize(result.state)}</script>`;
  const output = template
    .replace(/<!--default-seo-start-->[\s\S]*?<!--default-seo-end-->/, createHead(result.seo, result.schemas))
    .replace('<div id="root"></div>', `<div id="root">${result.html}</div>${stateScript}`);
  const outputPath = route === "/"
    ? join(distDir, "index.html")
    : route.startsWith("/services/")
      ? join(distDir, "_prerender", "services", `${route.split("/").pop()}.html`)
      : join(distDir, `${route.slice(1)}.html`);
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, output, "utf8");
  console.log(`Prerendered ${route}`);
}

await rm(join(distDir, "server"), { recursive: true, force: true });
