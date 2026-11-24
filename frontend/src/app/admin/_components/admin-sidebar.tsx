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
  FolderTree,
  Tags,
  LogOut,
  ChevronLeft,
  FlaskConical,
  FileSpreadsheet,
  Gift,
  ExternalLink,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const navItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Productos", href: "/admin/productos", icon: Package },
  { name: "Catálogos", href: "/admin/catalogos", icon: FolderTree },
  { name: "Precios", href: "/admin/precios", icon: Tags },
  { name: "Inventario", href: "/admin/inventario", icon: FlaskConical },
  { name: "Espacios", href: "/admin/espacios", icon: Store },
  { name: "Entregas", href: "/admin/entregas", icon: ShoppingCart },
  { name: "Reportes", href: "/admin/reportes", icon: FileSpreadsheet },
  { name: "Regalías", href: "/admin/regalias", icon: Gift },
];

export function AdminSidebar({
  user,
}: {
  user: { name?: string | null; email?: string | null };
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isRouteActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  const sidebarContent = (isMobile: boolean) => (
    <>
      <div className="p-4 h-16 border-b border-stone-800/50 flex items-center justify-between shrink-0">
        {(!collapsed || isMobile) && (
          <Link
            href="/admin"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3"
          >
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
        {isMobile ? (
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1.5 hover:bg-stone-800 text-stone-400 hover:text-white rounded-lg transition-colors ml-auto"
            aria-label="Cerrar menú"
          >
            <X className="h-5 w-5" />
          </button>
        ) : (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 hover:bg-stone-800 text-stone-400 hover:text-white rounded-lg transition-colors ml-auto"
            aria-label="Contraer menú"
          >
            <ChevronLeft
              className={cn(
                "h-4 w-4 transition-transform duration-300",
                collapsed && "rotate-180"
              )}
            />
          </button>
        )}
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => {
          const isActive = isRouteActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              title={collapsed && !isMobile ? item.name : undefined}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
                isActive
                  ? "bg-gold text-stone-950 shadow-md shadow-gold/10"
                  : "text-stone-400 hover:bg-stone-800/80 hover:text-stone-100",
                collapsed && !isMobile && "justify-center"
              )}
            >
              <item.icon
                className={cn(
                  "h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-110",
                  isActive ? "text-stone-950" : ""
                )}
              />
              {(!collapsed || isMobile) && <span>{item.name}</span>}
            </Link>
          );
        })}

        <div className="pt-3 mt-3 border-t border-stone-800/60">
          <Link
            href="/"
            target="_blank"
            onClick={() => setMobileOpen(false)}
            title={collapsed && !isMobile ? "Ver Tienda Pública" : undefined}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-stone-400 hover:bg-stone-800/80 hover:text-gold transition-colors",
              collapsed && !isMobile && "justify-center"
            )}
          >
            <ExternalLink className="h-4 w-4 shrink-0" />
            {(!collapsed || isMobile) && <span>Ver Tienda</span>}
          </Link>
        </div>
      </nav>

      <div className="p-3 border-t border-stone-800/50 bg-stone-950/50">
        {(!collapsed || isMobile) && (
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
            collapsed && !isMobile && "justify-center"
          )}
          title="Cerrar Sesión"
        >
          <LogOut className="h-4 w-4 shrink-0 transition-transform group-hover:-translate-x-1" />
          {(!collapsed || isMobile) && <span>Cerrar Sesión</span>}
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile floating menu trigger */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed bottom-5 right-5 z-40 bg-stone-950 text-gold p-3.5 rounded-full shadow-xl border border-gold/30 hover:bg-stone-900 transition-transform active:scale-95"
        aria-label="Abrir menú de administración"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative w-64 max-w-[80vw] bg-stone-950 flex flex-col h-full shadow-2xl z-10">
            {sidebarContent(true)}
          </aside>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden md:flex bg-stone-950 flex-col transition-all duration-300 shadow-2xl z-20 shrink-0",
          collapsed ? "w-16" : "w-64"
        )}
      >
        {sidebarContent(false)}
      </aside>
    </>
  );
}
