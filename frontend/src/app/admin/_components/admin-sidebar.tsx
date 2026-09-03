"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import Image from "next/image";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Store,
  BarChart3,
  Tags,
  LogOut,
  ChevronLeft,
  FlaskConical,
  FileSpreadsheet,
  Gift,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const navItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Productos", href: "/admin/productos", icon: Package },
  { name: "Precios", href: "/admin/precios", icon: Tags },
  { name: "Inventario", href: "/admin/inventario", icon: FlaskConical },
  { name: "Espacios", href: "/admin/espacios", icon: Store },
  { name: "Entregas", href: "/admin/entregas", icon: ShoppingCart },
  { name: "Reportes", href: "/admin/reportes", icon: FileSpreadsheet },
  { name: "Regalías", href: "/admin/regalias", icon: Gift },
  { name: "Estadísticas", href: "/admin/estadisticas", icon: BarChart3 },
];

export function AdminSidebar({
  user,
}: {
  user: { name?: string | null; email?: string | null };
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "bg-stone-950 flex flex-col transition-all duration-300 shadow-2xl z-20",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="p-4 h-16 border-b border-stone-800/50 flex items-center justify-between shrink-0">
        {!collapsed && (
          <Link href="/admin" className="flex items-center gap-3">
            <div className="relative w-7 h-7">
              <Image 
                src="/images/logo-icon.webp" 
                alt="MDN" 
                fill 
                className="object-contain rounded-full"
              />
            </div>
            <span className="font-serif text-base tracking-wide text-white">MDN Admin</span>
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 hover:bg-stone-800 text-stone-400 hover:text-white rounded-lg transition-colors ml-auto"
        >
          <ChevronLeft
            className={cn(
              "h-4 w-4 transition-transform duration-300",
              collapsed && "rotate-180"
            )}
          />
        </button>
      </div>

      <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 group",
                isActive
                  ? "bg-gold text-stone-950 shadow-md shadow-gold/10"
                  : "text-stone-400 hover:bg-stone-800/80 hover:text-stone-100"
              )}
            >
              <item.icon className={cn("h-4 w-4 shrink-0 transition-transform duration-300 group-hover:scale-110", isActive ? "text-stone-950" : "")} />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-stone-800/50 bg-stone-950/50">
        {!collapsed && (
          <div className="mb-3 px-3">
            <p className="text-[10px] uppercase tracking-[0.2em] text-stone-500 font-semibold mb-1">
              Usuario Actual
            </p>
            <p className="text-xs text-stone-300 truncate font-medium">
              {user?.name || user?.email}
            </p>
          </div>
        )}
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-stone-400 hover:bg-red-500/10 hover:text-red-400 transition-colors w-full group",
            collapsed && "justify-center"
          )}
          title="Cerrar Sesión"
        >
          <LogOut className="h-4 w-4 shrink-0 transition-transform group-hover:-translate-x-1" />
          {!collapsed && <span>Cerrar Sesión</span>}
        </button>
      </div>
    </aside>
  );
}
