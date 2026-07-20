import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const productsDir = path.resolve(__dirname, "..", "public", "images", "products");
const mainImagesDir = path.resolve(__dirname, "..", "public", "images");

const thresholds = [
  { dir: productsDir, minSizeKB: 50 },
  { dir: mainImagesDir, minSizeKB: 30 },
];

for (const { dir, minSizeKB } of thresholds) {
  if (!fs.existsSync(dir)) continue;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (![".jpg", ".jpeg", ".png"].includes(ext)) continue;
    const filepath = path.join(dir, file);
    const stat = fs.statSync(filepath);
    const sizeKB = stat.size / 1024;
    if (sizeKB < minSizeKB) continue;
    const webpName = `${path.basename(file, ext)}.webp`;
    const webpPath = path.join(dir, webpName);
    try {
      await sharp(filepath)
        .webp({ quality: 80, effort: 6 })
        .toFile(webpPath);
      const webpStat = fs.statSync(webpPath);
      const saved = ((1 - webpStat.size / stat.size) * 100).toFixed(1);
      console.log(`Converted: ${file} (${sizeKB.toFixed(0)}KB -> ${(webpStat.size / 1024).toFixed(0)}KB, ahorro ${saved}%)`);
    } catch (err) {
      console.error(`Error converting ${file}:`, err.message);
    }
  }
}
