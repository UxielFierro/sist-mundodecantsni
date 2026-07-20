import { getCategories, getBrands } from "@/server/actions/products";
import { NewProductForm } from "@/components/admin/forms/new-product-form";

export default async function NewProductPage() {
  const [categories, brands] = await Promise.all([getCategories(), getBrands()]);

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Nuevo Producto</h1>
        <p className="text-muted-foreground mt-1">Registra un nuevo perfume o insumo</p>
      </div>

      <NewProductForm categories={categories} brands={brands} />
    </div>
  );
}
