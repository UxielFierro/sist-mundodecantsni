import { prisma } from "@/lib/db";
import { createLocation } from "@/server/actions/locations";
import { redirect } from "next/navigation";
import { Plus, Store } from "lucide-react";
import Link from "next/link";

async function handleCreate(formData: FormData) {
  "use server";
  await createLocation(formData);
  redirect("/admin/espacios");
}

export default async function SpacesPage() {
  const locations = await prisma.location.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: { select: { deliveries: true, salesReports: true } },
      locationInventory: { select: { quantity: true } },
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Espacios</h1>
          <p className="text-muted-foreground mt-1">
            Colectivos, tiendas y bodegas donde se distribuye inventario
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {locations.map((loc) => {
            const totalItems = loc.locationInventory.reduce((s, i) => s + i.quantity, 0);
            return (
              <Link
                key={loc.id}
                href={`/admin/espacios/${loc.id}`}
                className="bg-card border rounded-xl p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Store className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{loc.name}</h3>
                    <span className="text-xs text-muted-foreground capitalize">{loc.type}</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-sm">
                  <div>
                    <div className="font-bold">{loc._count.deliveries}</div>
                    <div className="text-xs text-muted-foreground">Entregas</div>
                  </div>
                  <div>
                    <div className="font-bold">{loc._count.salesReports}</div>
                    <div className="text-xs text-muted-foreground">Reportes</div>
                  </div>
                  <div>
                    <div className="font-bold">{totalItems}</div>
                    <div className="text-xs text-muted-foreground">Items</div>
                  </div>
                </div>
              </Link>
            );
          })}
          {locations.length === 0 && (
            <div className="col-span-2 text-center py-12 text-muted-foreground">
              No hay espacios registrados
            </div>
          )}
        </div>

        <form action={handleCreate} className="bg-card border rounded-xl p-5 space-y-3 h-fit">
          <h2 className="font-semibold flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nuevo Espacio
          </h2>
          <div>
            <input
              name="name"
              placeholder="Nombre del espacio"
              required
              className="w-full px-3 py-2 border rounded-lg bg-background text-sm"
            />
          </div>
          <div>
            <select
              name="type"
              className="w-full px-3 py-2 border rounded-lg bg-background text-sm"
            >
              <option value="collectivo">Colectivo</option>
              <option value="tienda">Tienda</option>
              <option value="bodega">Bodega</option>
            </select>
          </div>
          <div>
            <input
              name="contact"
              placeholder="Persona de contacto"
              className="w-full px-3 py-2 border rounded-lg bg-background text-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground py-2 rounded-lg text-sm font-medium hover:opacity-90"
          >
            Crear Espacio
          </button>
        </form>
      </div>
    </div>
  );
}
