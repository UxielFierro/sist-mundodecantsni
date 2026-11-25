"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import {
  HelpCircle,
  X,
  Search,
  Lightbulb,
  BookOpen,
  ChevronRight,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import {
  ADMIN_HELP_GUIDES,
  getGuideForPathname,
  type ModuleHelpGuide,
} from "@/lib/admin-help-content";

export function AdminHelpDrawer() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"guide" | "index">("guide");
  const [selectedGuideId, setSelectedGuideId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const routeGuide = useMemo(
    () => getGuideForPathname(pathname || "/admin"),
    [pathname]
  );

  const activeGuide: ModuleHelpGuide = useMemo(() => {
    if (selectedGuideId) {
      return ADMIN_HELP_GUIDES.find((g) => g.id === selectedGuideId) ?? routeGuide;
    }
    return routeGuide;
  }, [selectedGuideId, routeGuide]);

  // Reset to current route's guide whenever pathname changes
  useEffect(() => {
    setSelectedGuideId(null);
    setViewMode("guide");
  }, [pathname]);

  // Close with Escape
  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const filteredGuides = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return ADMIN_HELP_GUIDES;
    return ADMIN_HELP_GUIDES.filter(
      (g) =>
        g.title.toLowerCase().includes(q) ||
        g.summary.toLowerCase().includes(q) ||
        g.steps.some(
          (s) => s.title.toLowerCase().includes(q) || s.detail.toLowerCase().includes(q)
        ) ||
        g.tips.some((t) => t.toLowerCase().includes(q)) ||
        g.faqs.some(
          (f) => f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q)
        )
    );
  }, [search]);

  function handleOpen() {
    setSelectedGuideId(null);
    setViewMode("guide");
    setSearch("");
    setOpen(true);
  }

  return (
    <>
      {/* Fixed top-right Help button */}
      <button
        type="button"
        onClick={handleOpen}
        title={`Ayuda: ${routeGuide.title}`}
        aria-label="Abrir guía de ayuda del módulo"
        className="fixed top-4 right-4 md:top-5 md:right-6 z-40 inline-flex items-center gap-1.5 rounded-full bg-white/95 backdrop-blur-md border border-stone-200/90 px-2.5 py-2 md:px-3.5 md:py-2 text-xs font-medium text-stone-700 shadow-sm hover:border-gold hover:text-stone-950 hover:shadow-md transition-all"
      >
        <HelpCircle className="h-4 w-4 text-gold shrink-0" />
        <span className="hidden sm:inline">Ayuda</span>
      </button>

      {/* Slide-over Help Drawer */}
      {open && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200"
            onClick={() => setOpen(false)}
          />

          {/* Panel */}
          <aside className="relative z-10 w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            {/* Dark Header */}
            <div className="px-5 py-4 bg-stone-950 text-white border-b border-stone-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="p-1.5 rounded-lg bg-gold/15 text-gold shrink-0">
                  <HelpCircle className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-gold font-semibold">
                    Centro de Ayuda
                  </p>
                  <h2 className="font-serif text-base truncate">
                    {viewMode === "index" ? "Todos los Módulos" : activeGuide.title}
                  </h2>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Cerrar ayuda"
                className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Sub-bar: toggle between current guide and all modules */}
            <div className="px-5 py-2.5 bg-stone-50 border-b border-stone-200/80 flex items-center justify-between gap-2 shrink-0">
              {viewMode === "guide" ? (
                <>
                  <span className="text-[11px] text-muted-foreground">
                    {activeGuide.id === routeGuide.id
                      ? "Guía del módulo actual"
                      : "Consultando otra guía"}
                  </span>
                  <button
                    type="button"
                    onClick={() => setViewMode("index")}
                    className="inline-flex items-center gap-1 text-xs font-medium text-stone-700 hover:text-gold transition-colors"
                  >
                    <BookOpen className="h-3.5 w-3.5" />
                    Ver todos los módulos
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedGuideId(null);
                    setViewMode("guide");
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-700 hover:text-gold transition-colors"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Volver a {routeGuide.shortTitle}
                </button>
              )}
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {viewMode === "index" ? (
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Buscar tema (ej: MDN, POS, redes, stock...)"
                      className="w-full pl-9 pr-3 py-2 text-xs border border-stone-200 rounded-xl bg-stone-50 focus:bg-white focus:outline-none focus:border-gold"
                    />
                  </div>

                  <div className="space-y-2">
                    {filteredGuides.map((g) => {
                      const isCurrent = g.id === routeGuide.id;
                      return (
                        <button
                          key={g.id}
                          type="button"
                          onClick={() => {
                            setSelectedGuideId(g.id);
                            setViewMode("guide");
                          }}
                          className="w-full text-left p-3.5 rounded-xl border border-stone-200/80 hover:border-gold/60 hover:bg-stone-50/70 transition-all flex items-center justify-between gap-3 group"
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm text-stone-900 group-hover:text-gold transition-colors">
                                {g.title}
                              </span>
                              {isCurrent && (
                                <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold">
                                  Actual
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                              {g.summary}
                            </p>
                          </div>
                          <ChevronRight className="h-4 w-4 text-stone-400 group-hover:text-gold shrink-0" />
                        </button>
                      );
                    })}
                    {filteredGuides.length === 0 && (
                      <p className="text-center text-xs text-muted-foreground py-8">
                        No se encontraron guías para &ldquo;{search}&rdquo;
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  {/* Summary */}
                  <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/70">
                    <p className="text-xs text-stone-700 leading-relaxed">{activeGuide.summary}</p>
                  </div>

                  {/* Step-by-step */}
                  <div className="space-y-3">
                    <h3 className="text-[11px] uppercase tracking-[0.18em] font-semibold text-stone-500">
                      Cómo usar este módulo
                    </h3>
                    <div className="space-y-2.5">
                      {activeGuide.steps.map((step, idx) => (
                        <div
                          key={step.title}
                          className="flex gap-3 p-3 rounded-xl border border-stone-200/70 bg-white"
                        >
                          <div className="w-6 h-6 rounded-full bg-stone-900 text-gold text-xs font-serif font-semibold flex items-center justify-center shrink-0 mt-0.5">
                            {idx + 1}
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-xs font-semibold text-stone-900 mb-0.5">
                              {step.title}
                            </h4>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                              {step.detail}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tips */}
                  {activeGuide.tips.length > 0 && (
                    <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/70 space-y-2">
                      <h3 className="text-xs font-semibold text-amber-900 flex items-center gap-1.5">
                        <Lightbulb className="h-4 w-4 text-gold" />
                        Tips prácticos
                      </h3>
                      <ul className="space-y-1.5 text-xs text-amber-950/85 leading-relaxed">
                        {activeGuide.tips.map((tip) => (
                          <li key={tip} className="flex items-start gap-2">
                            <Sparkles className="h-3 w-3 text-gold shrink-0 mt-1" />
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* FAQs */}
                  {activeGuide.faqs.length > 0 && (
                    <div className="space-y-2.5">
                      <h3 className="text-[11px] uppercase tracking-[0.18em] font-semibold text-stone-500">
                        Preguntas frecuentes
                      </h3>
                      <div className="space-y-2">
                        {activeGuide.faqs.map((faq) => (
                          <details
                            key={faq.question}
                            className="group rounded-xl border border-stone-200/80 bg-white overflow-hidden"
                          >
                            <summary className="px-3.5 py-2.5 text-xs font-medium text-stone-900 cursor-pointer hover:bg-stone-50 select-none flex items-center justify-between gap-2">
                              <span>{faq.question}</span>
                              <ChevronRight className="h-3.5 w-3.5 text-stone-400 transition-transform group-open:rotate-90 shrink-0" />
                            </summary>
                            <div className="px-3.5 pb-3 pt-1 text-xs text-muted-foreground leading-relaxed border-t border-stone-100">
                              {faq.answer}
                            </div>
                          </details>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-stone-200 bg-stone-50/70 flex items-center justify-between text-[11px] text-muted-foreground shrink-0">
              <span>Mundo Decants Nicaragua · Admin</span>
              <span>ESC para cerrar</span>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
