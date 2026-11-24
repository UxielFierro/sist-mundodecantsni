"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  FolderTree,
  Award,
  FlaskConical,
  Settings,
  Plus,
  Pencil,
  Trash2,
  Search,
  Check,
  X,
} from "lucide-react";
import {
  createCategory,
  updateCategory,
  deleteCategory,
  createBrand,
  updateBrand,
  deleteBrand,
  createPresentation,
  updatePresentation,
  deletePresentation,
  updateSystemConfig,
} from "@/server/actions/catalogs";

interface CategoryItem {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  productCount: number;
}

interface BrandItem {
  id: number;
  name: string;
  slug: string;
  productCount: number;
}

interface PresentationItem {
  id: number;
  name: string;
  slug: string;
  unitType: string | null;
  unitValue: number | null;
  quantity: number;
  sortOrder: number;
  variantCount: number;
}

interface SystemConfigData {
  standardSuppliesCost: number;
  standardShippingCost: number;
  posFeePercentage: number;
  currency: string;
}

type TabKey = "categories" | "brands" | "presentations" | "config";

export function CatalogsManager({
  categories,
  brands,
  presentations,
  config,
}: {
  categories: CategoryItem[];
  brands: BrandItem[];
  presentations: PresentationItem[];
  config: SystemConfigData;
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>("categories");
  const [isPending, startTransition] = useTransition();

  // Search filters
  const [catQuery, setCatQuery] = useState("");
  const [brandQuery, setBrandQuery] = useState("");

  // Edit states
  const [editingCat, setEditingCat] = useState<CategoryItem | null>(null);
  const [editingBrand, setEditingBrand] = useState<BrandItem | null>(null);
  const [editingPres, setEditingPres] = useState<PresentationItem | null>(null);

  const tabs: { key: TabKey; label: string; count?: number; icon: typeof FolderTree }[] = [
    { key: "categories", label: "Categorías", count: categories.length, icon: FolderTree },
    { key: "brands", label: "Marcas", count: brands.length, icon: Award },
    { key: "presentations", label: "Presentaciones", count: presentations.length, icon: FlaskConical },
    { key: "config", label: "Configuración", icon: Settings },
  ];

  const filteredCategories = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(catQuery.toLowerCase()) ||
      (c.description ?? "").toLowerCase().includes(catQuery.toLowerCase())
  );

  const filteredBrands = brands.filter((b) =>
    b.name.toLowerCase().includes(brandQuery.toLowerCase())
  );

  function runAction(fn: () => Promise<unknown>, successMsg: string) {
    startTransition(async () => {
      try {
        await fn();
        toast.success(successMsg);
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Ocurrió un error");
      }
    });
  }

  return (
    <div className="space-y-6">
      {/* Tabs bar */}
      <div className="flex flex-wrap gap-2 border-b border-stone-200 pb-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                active
                  ? "bg-stone-900 text-white shadow-sm"
                  : "bg-white text-stone-600 border border-stone-200 hover:border-stone-300 hover:text-stone-900"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`text-[11px] px-1.5 py-0.5 rounded-full ${
                    active ? "bg-white/20 text-white" : "bg-stone-100 text-stone-600"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ==================== CATEGORIES TAB ==================== */}
      {activeTab === "categories" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Create form */}
          <form
            action={(formData) => {
              runAction(async () => {
                await createCategory(formData);
              }, "Categoría creada correctamente");
            }}
            className="bg-white border border-stone-200/80 rounded-2xl p-5 space-y-4 h-fit shadow-sm"
          >
            <h2 className="font-semibold text-base flex items-center gap-2 text-stone-900">
              <Plus className="h-4 w-4 text-gold" />
              Nueva Categoría
            </h2>
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">Nombre *</label>
              <input
                name="name"
                required
                placeholder="Ej: Nicho, Diseñador, Árabe, Damas..."
                className="w-full px-3 py-2 text-sm border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-stone-900/20"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">
                Descripción para la tienda
              </label>
              <textarea
                name="description"
                rows={3}
                placeholder="Ej: Fragancias exclusivas y de alta perfumería"
                className="w-full px-3 py-2 text-sm border rounded-lg bg-background resize-none focus:outline-none focus:ring-2 focus:ring-stone-900/20"
              />
              <p className="text-[11px] text-muted-foreground mt-1">
                Se muestra en la portada pública y en la página de la colección.
              </p>
            </div>
            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-stone-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-stone-800 disabled:opacity-50 transition-colors"
            >
              {isPending ? "Guardando..." : "Agregar Categoría"}
            </button>
          </form>

          {/* List */}
          <div className="lg:col-span-2 bg-white border border-stone-200/80 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-4 border-b flex items-center justify-between gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={catQuery}
                  onChange={(e) => setCatQuery(e.target.value)}
                  placeholder="Buscar categoría..."
                  className="w-full pl-9 pr-3 py-1.5 text-sm border rounded-lg bg-stone-50 focus:bg-white focus:outline-none"
                />
              </div>
              <span className="text-xs text-muted-foreground">
                {filteredCategories.length} categoría{filteredCategories.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="divide-y">
              {filteredCategories.map((cat) => {
                const isEditing = editingCat?.id === cat.id;
                return (
                  <div key={cat.id} className="p-4 hover:bg-stone-50/60 transition-colors">
                    {isEditing ? (
                      <form
                        action={(formData) => {
                          runAction(async () => {
                            await updateCategory(cat.id, formData);
                            setEditingCat(null);
                          }, "Categoría actualizada");
                        }}
                        className="space-y-3"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input
                            name="name"
                            defaultValue={cat.name}
                            required
                            className="px-3 py-1.5 text-sm border rounded-lg"
                          />
                          <input
                            name="description"
                            defaultValue={cat.description ?? ""}
                            placeholder="Descripción..."
                            className="px-3 py-1.5 text-sm border rounded-lg"
                          />
                        </div>
                        <div className="flex items-center gap-2 justify-end">
                          <button
                            type="button"
                            onClick={() => setEditingCat(null)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs border rounded-lg hover:bg-stone-100"
                          >
                            <X className="h-3.5 w-3.5" /> Cancelar
                          </button>
                          <button
                            type="submit"
                            disabled={isPending}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs bg-stone-900 text-white rounded-lg hover:bg-stone-800"
                          >
                            <Check className="h-3.5 w-3.5" /> Guardar
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium text-stone-900">{cat.name}</span>
                            <span className="text-[11px] font-mono text-stone-400 bg-stone-100 px-1.5 py-0.5 rounded">
                              /{cat.slug}
                            </span>
                            <span className="text-[11px] text-stone-600 bg-amber-50 border border-amber-200/70 px-2 py-0.5 rounded-full">
                              {cat.productCount} producto{cat.productCount !== 1 ? "s" : ""}
                            </span>
                          </div>
                          {cat.description && (
                            <p className="text-xs text-muted-foreground mt-1">{cat.description}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => setEditingCat(cat)}
                            className="p-2 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            disabled={isPending}
                            onClick={() => {
                              if (
                                confirm(
                                  `¿Eliminar la categoría "${cat.name}"? Esta acción no se puede deshacer.`
                                )
                              ) {
                                runAction(
                                  () => deleteCategory(cat.id),
                                  `Categoría "${cat.name}" eliminada`
                                );
                              }
                            }}
                            className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              {filteredCategories.length === 0 && (
                <div className="p-10 text-center text-sm text-muted-foreground">
                  No se encontraron categorías
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==================== BRANDS TAB ==================== */}
      {activeTab === "brands" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <form
            action={(formData) => {
              runAction(async () => {
                await createBrand(formData);
              }, "Marca creada correctamente");
            }}
            className="bg-white border border-stone-200/80 rounded-2xl p-5 space-y-4 h-fit shadow-sm"
          >
            <h2 className="font-semibold text-base flex items-center gap-2 text-stone-900">
              <Plus className="h-4 w-4 text-gold" />
              Nueva Marca
            </h2>
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">
                Nombre de la casa / marca *
              </label>
              <input
                name="name"
                required
                placeholder="Ej: Xerjoff, Dior, Lattafa, Creed..."
                className="w-full px-3 py-2 text-sm border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-stone-900/20"
              />
            </div>
            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-stone-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-stone-800 disabled:opacity-50 transition-colors"
            >
              {isPending ? "Guardando..." : "Agregar Marca"}
            </button>
          </form>

          <div className="lg:col-span-2 bg-white border border-stone-200/80 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-4 border-b flex items-center justify-between gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={brandQuery}
                  onChange={(e) => setBrandQuery(e.target.value)}
                  placeholder="Buscar marca..."
                  className="w-full pl-9 pr-3 py-1.5 text-sm border rounded-lg bg-stone-50 focus:bg-white focus:outline-none"
                />
              </div>
              <span className="text-xs text-muted-foreground">
                {filteredBrands.length} marca{filteredBrands.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="divide-y max-h-[600px] overflow-y-auto">
              {filteredBrands.map((brand) => {
                const isEditing = editingBrand?.id === brand.id;
                return (
                  <div key={brand.id} className="px-4 py-3 hover:bg-stone-50/60 transition-colors">
                    {isEditing ? (
                      <form
                        action={(formData) => {
                          runAction(async () => {
                            await updateBrand(brand.id, formData);
                            setEditingBrand(null);
                          }, "Marca actualizada");
                        }}
                        className="flex items-center gap-2"
                      >
                        <input
                          name="name"
                          defaultValue={brand.name}
                          required
                          className="flex-1 px-3 py-1.5 text-sm border rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => setEditingBrand(null)}
                          className="p-1.5 border rounded-lg hover:bg-stone-100"
                        >
                          <X className="h-4 w-4" />
                        </button>
                        <button
                          type="submit"
                          disabled={isPending}
                          className="p-1.5 bg-stone-900 text-white rounded-lg hover:bg-stone-800"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                      </form>
                    ) : (
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="font-medium text-stone-900 truncate">{brand.name}</span>
                          <span className="text-[11px] text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full shrink-0">
                            {brand.productCount} producto{brand.productCount !== 1 ? "s" : ""}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => setEditingBrand(brand)}
                            className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg"
                            title="Editar"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            disabled={isPending}
                            onClick={() => {
                              if (confirm(`¿Eliminar la marca "${brand.name}"?`)) {
                                runAction(
                                  () => deleteBrand(brand.id),
                                  `Marca "${brand.name}" eliminada`
                                );
                              }
                            }}
                            className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                            title="Eliminar"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              {filteredBrands.length === 0 && (
                <div className="p-10 text-center text-sm text-muted-foreground">
                  No se encontraron marcas
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==================== PRESENTATIONS TAB ==================== */}
      {activeTab === "presentations" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <form
            action={(formData) => {
              runAction(async () => {
                await createPresentation(formData);
              }, "Presentación creada correctamente");
            }}
            className="bg-white border border-stone-200/80 rounded-2xl p-5 space-y-4 h-fit shadow-sm"
          >
            <h2 className="font-semibold text-base flex items-center gap-2 text-stone-900">
              <Plus className="h-4 w-4 text-gold" />
              Nueva Presentación
            </h2>
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">Nombre *</label>
              <input
                name="name"
                required
                placeholder="Ej: 3 ml, 5 ml, 10 ml, 30 ml, Frasco 100 ml"
                className="w-full px-3 py-2 text-sm border rounded-lg bg-background"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1">Tipo unidad</label>
                <select
                  name="unitType"
                  defaultValue="ml"
                  className="w-full px-3 py-2 text-sm border rounded-lg bg-background"
                >
                  <option value="ml">ml (mililitros)</option>
                  <option value="unidad">unidad</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1">
                  Cantidad (ml / u)
                </label>
                <input
                  name="quantity"
                  type="number"
                  min={1}
                  defaultValue={5}
                  required
                  className="w-full px-3 py-2 text-sm border rounded-lg bg-background"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">
                Orden de visualización
              </label>
              <input
                name="sortOrder"
                type="number"
                min={0}
                defaultValue={presentations.length + 1}
                className="w-full px-3 py-2 text-sm border rounded-lg bg-background"
              />
            </div>
            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-stone-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-stone-800 disabled:opacity-50"
            >
              {isPending ? "Guardando..." : "Agregar Presentación"}
            </button>
          </form>

          <div className="lg:col-span-2 bg-white border border-stone-200/80 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-stone-50 border-b">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-stone-600">Orden</th>
                    <th className="text-left px-4 py-3 font-medium text-stone-600">Nombre</th>
                    <th className="text-left px-4 py-3 font-medium text-stone-600">Unidad</th>
                    <th className="text-center px-4 py-3 font-medium text-stone-600">Variantes</th>
                    <th className="text-right px-4 py-3 font-medium text-stone-600">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {presentations.map((p) => {
                    const isEditing = editingPres?.id === p.id;
                    if (isEditing) {
                      return (
                        <tr key={p.id} className="bg-stone-50">
                          <td colSpan={5} className="p-3">
                            <form
                              action={(formData) => {
                                runAction(async () => {
                                  await updatePresentation(p.id, formData);
                                  setEditingPres(null);
                                }, "Presentación actualizada");
                              }}
                              className="grid grid-cols-2 sm:grid-cols-5 gap-2 items-center"
                            >
                              <input
                                name="sortOrder"
                                type="number"
                                defaultValue={p.sortOrder}
                                className="px-2 py-1.5 text-xs border rounded-lg bg-white"
                                placeholder="Orden"
                              />
                              <input
                                name="name"
                                defaultValue={p.name}
                                required
                                className="px-2 py-1.5 text-xs border rounded-lg bg-white"
                              />
                              <select
                                name="unitType"
                                defaultValue={p.unitType ?? "ml"}
                                className="px-2 py-1.5 text-xs border rounded-lg bg-white"
                              >
                                <option value="ml">ml</option>
                                <option value="unidad">unidad</option>
                              </select>
                              <input
                                name="quantity"
                                type="number"
                                min={1}
                                defaultValue={p.quantity}
                                className="px-2 py-1.5 text-xs border rounded-lg bg-white"
                              />
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  type="button"
                                  onClick={() => setEditingPres(null)}
                                  className="p-1.5 border rounded-lg bg-white"
                                >
                                  <X className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  type="submit"
                                  disabled={isPending}
                                  className="p-1.5 bg-stone-900 text-white rounded-lg"
                                >
                                  <Check className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </form>
                          </td>
                        </tr>
                      );
                    }
                    return (
                      <tr key={p.id} className="hover:bg-stone-50/60">
                        <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                          #{p.sortOrder}
                        </td>
                        <td className="px-4 py-3 font-medium text-stone-900">
                          {p.name}{" "}
                          <span className="text-[11px] font-mono text-stone-400 ml-1">
                            ({p.slug})
                          </span>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {p.quantity} {p.unitType ?? "ml"}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="text-xs bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full">
                            {p.variantCount}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            type="button"
                            onClick={() => setEditingPres(p)}
                            className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            disabled={isPending}
                            onClick={() => {
                              if (confirm(`¿Eliminar la presentación "${p.name}"?`)) {
                                runAction(
                                  () => deletePresentation(p.id),
                                  `Presentación "${p.name}" eliminada`
                                );
                              }
                            }}
                            className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg ml-1"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==================== SYSTEM CONFIG TAB ==================== */}
      {activeTab === "config" && (
        <form
          action={(formData) => {
            runAction(async () => {
              await updateSystemConfig(formData);
            }, "Configuración del sistema actualizada");
          }}
          className="bg-white border border-stone-200/80 rounded-2xl p-6 max-w-2xl space-y-5 shadow-sm"
        >
          <div>
            <h2 className="font-semibold text-lg text-stone-900">Parámetros Globales de Costos</h2>
            <p className="text-xs text-muted-foreground mt-1">
              Estos valores se utilizan automáticamente al calcular costos netos y precios sugeridos
              en el módulo de Precios.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Costo estándar de insumos (C$)
              </label>
              <input
                name="standardSuppliesCost"
                type="number"
                step="0.01"
                min={0}
                defaultValue={config.standardSuppliesCost}
                required
                className="w-full px-3 py-2 text-sm border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Costo estándar de envío (C$)
              </label>
              <input
                name="standardShippingCost"
                type="number"
                step="0.01"
                min={0}
                defaultValue={config.standardShippingCost}
                required
                className="w-full px-3 py-2 text-sm border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Comisión POS / Tarjeta (%)
              </label>
              <input
                name="posFeePercentage"
                type="number"
                step="0.01"
                min={0}
                max={100}
                defaultValue={config.posFeePercentage}
                required
                className="w-full px-3 py-2 text-sm border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">Moneda</label>
              <input
                name="currency"
                defaultValue={config.currency}
                required
                className="w-full px-3 py-2 text-sm border rounded-lg"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isPending}
              className="bg-stone-900 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-stone-800 disabled:opacity-50"
            >
              {isPending ? "Guardando..." : "Guardar Configuración"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
