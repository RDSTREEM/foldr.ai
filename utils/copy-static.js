const fs = require("fs");
const path = require("path");

const staticDir = path.join(__dirname, "..", "static");
const filesToCopy = ["manifest.json", "style.css"];
const distDir = path.join(__dirname, "..", "dist");

if (!fs.existsSync(distDir)) fs.mkdirSync(distDir);

for (const file of filesToCopy) {
  const src = path.join(staticDir, file);
  const dest = path.join(distDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`Copied ${file} to dist/`);
  } else {
    console.warn(`File not found: ${src}`);
  }
}
