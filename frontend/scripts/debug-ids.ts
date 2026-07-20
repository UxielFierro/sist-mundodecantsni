import { PrismaClient } from "@prisma/client";
const LOCAL_URL = "postgresql://fruxiel:1201@localhost:5432/bd_mundodecantsni";

async function main() {
  // Check local products vs remote
  const local = new PrismaClient({ datasourceUrl: LOCAL_URL });
  const remote = new PrismaClient();

  const localProducts = await local.product.findMany({ orderBy: { id: "asc" }, take: 100 });
  const remoteProducts = await remote.product.findMany({ orderBy: { id: "asc" }, take: 100 });

  console.log("Local vs Remote products (first 20):");
  for (let i = 0; i < Math.min(20, localProducts.length, remoteProducts.length); i++) {
    const lp = localProducts[i];
    const rp = remoteProducts[i];
    const match = lp.codigo === rp.codigo ? "✅" : "❌";
    console.log(`  ${match} Local[${lp.id}] ${lp.codigo} - ${lp.name}  vs  Remote[${rp.id}] ${rp.codigo} - ${rp.name}`);
  }

  if (localProducts.length !== remoteProducts.length) {
    console.log(`\n⚠️ Diferencia de tamaño: Local=${localProducts.length} Remote=${remoteProducts.length}`);
  }

  // Check which product IDs exist in remote
  const localImage = await local.productImage.findFirst({ orderBy: { id: "asc" } });
  if (localImage) {
    const existsInRemote = await remote.product.findUnique({ where: { id: localImage.productId } });
    console.log(`\nImagen ID 1: productId=${localImage.productId}`);
    console.log(`  Existe en remote? ${existsInRemote ? "Sí" : "No"}`);
    if (!existsInRemote) {
      const localP = await local.product.findUnique({ where: { id: localImage.productId } });
      console.log(`  Producto local: ${localP?.codigo} - ${localP?.name}`);
      const remoteP = await remote.product.findFirst({ where: { codigo: localP?.codigo } });
      console.log(`  Producto remote por código: ${remoteP?.id} - ${remoteP?.name}`);
    }
  }

  await local.$disconnect();
  await remote.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
