import { PrismaClient } from "@prisma/client";
import fs from "fs/promises";
import path from "path";
import { createClient } from "@supabase/supabase-js";

const prisma = new PrismaClient();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const bucket = process.env.SUPABASE_STORAGE_BUCKET || "product-images";

async function main() {
  if (!supabaseUrl || !supabaseKey) {
    console.error("❌ NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY requeridos");
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false },
  });

  const imagesDir = path.resolve(__dirname, "../public/images/products");

  const images = await prisma.productImage.findMany();
  console.log(`📸 ${images.length} imágenes en la BD`);

  let uploaded = 0;
  for (const img of images) {
    const filename = img.url.split("/").pop();
    if (!filename) continue;

    const filepath = path.join(imagesDir, filename);
    let buffer;
    try {
      buffer = await fs.readFile(filepath);
    } catch {
      console.log(`  ⚠️  Archivo no encontrado: ${filename}`);
      continue;
    }

    const ext = filename.split(".").pop()?.toLowerCase();
    const contentType = ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : "image/jpeg";

    const { error } = await supabase.storage.from(bucket).upload(filename, buffer, {
      contentType,
      upsert: true,
    });

    if (error) {
      console.error(`  ❌ Error subiendo ${filename}:`, error.message);
      continue;
    }

    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(filename);
    if (urlData?.publicUrl) {
      await prisma.productImage.update({
        where: { id: img.id },
        data: { url: urlData.publicUrl },
      });
      console.log(`  ✅ ${filename} -> ${urlData.publicUrl}`);
    }
    uploaded++;
  }

  console.log(`\n🎉 ${uploaded} imágenes migradas a Supabase Storage`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
