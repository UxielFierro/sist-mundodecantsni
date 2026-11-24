"use client";

import { useState, useTransition } from "react";
import { Plus, X, Check } from "lucide-react";
import { toast } from "sonner";
import { createCategory, createBrand } from "@/server/actions/catalogs";

interface Option {
  id: number;
  name: string;
}

export function QuickCatalogSelect({
  type,
  name,
  label,
  emptyLabel,
  initialOptions,
  defaultValue,
}: {
  type: "category" | "brand";
  name: string;
  label: string;
  emptyLabel: string;
  initialOptions: Option[];
  defaultValue?: number | null;
}) {
  const [options, setOptions] = useState<Option[]>(initialOptions);
  const [selected, setSelected] = useState<string>(defaultValue ? String(defaultValue) : "");
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleQuickCreate() {
    const trimmed = newName.trim();
    if (!trimmed) {
      toast.error("Ingresá un nombre");
      return;
    }

    startTransition(async () => {
      try {
        const fd = new FormData();
        fd.append("name", trimmed);
        if (type === "category" && newDesc.trim()) {
          fd.append("description", newDesc.trim());
        }

        const created =
          type === "category" ? await createCategory(fd) : await createBrand(fd);

        const next = [...options, { id: created.id, name: created.name }].sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        setOptions(next);
        setSelected(String(created.id));
        setNewName("");
        setNewDesc("");
        setCreating(false);
        toast.success(
          `${type === "category" ? "Categoría" : "Marca"} "${created.name}" creada y seleccionada`
        );
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Error al crear");
      }
    });
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label htmlFor={name} className="block text-sm font-medium">
          {label}
        </label>
        <button
          type="button"
          onClick={() => setCreating((v) => !v)}
          className="inline-flex items-center gap-0.5 text-[11px] font-medium text-gold hover:underline"
        >
          {creating ? (
            <>
              <X className="h-3 w-3" /> Cerrar
            </>
          ) : (
            <>
              <Plus className="h-3 w-3" /> Nueva
            </>
          )}
        </button>
      </div>

      <select
        id={name}
        name={name}
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        className="w-full px-3 py-2 text-sm border rounded-lg bg-background"
      >
        <option value="">{emptyLabel}</option>
        {options.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.name}
          </option>
        ))}
      </select>

      {creating && (
        <div className="mt-2 p-2.5 bg-stone-50 border border-stone-200 rounded-lg space-y-2">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder={`Nombre de nueva ${type === "category" ? "categoría" : "marca"}`}
            className="w-full px-2.5 py-1.5 text-xs border rounded-md bg-white"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleQuickCreate();
              }
            }}
          />
          {type === "category" && (
            <input
              type="text"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="Descripción breve (opcional)"
              className="w-full px-2.5 py-1.5 text-xs border rounded-md bg-white"
            />
          )}
          <div className="flex justify-end gap-1.5">
            <button
              type="button"
              onClick={() => setCreating(false)}
              className="px-2 py-1 text-[11px] border rounded bg-white hover:bg-stone-100"
            >
              Cancelar
            </button>
            <button
              type="button"
              disabled={isPending}
              onClick={handleQuickCreate}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] bg-stone-900 text-white rounded hover:bg-stone-800 disabled:opacity-50"
            >
              <Check className="h-3 w-3" />
              {isPending ? "Creando..." : "Crear"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
