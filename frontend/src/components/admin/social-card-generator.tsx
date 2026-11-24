"use client";

import { useEffect, useRef, useState } from "react";
import { Download, Copy, Check, Sparkles, Camera } from "lucide-react";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/utils";

interface SocialVariant {
  name: string;
  price: number;
  inStock: boolean;
}

interface SocialCardProps {
  product: {
    name: string;
    slug: string;
    brandName: string | null;
    categoryName: string | null;
    olfactoryNotes: string | null;
    description: string | null;
    imageUrl: string | null;
    variants: SocialVariant[];
  };
}

type CardFormat = "story" | "post";
type CardTheme = "noir" | "editorial";

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines: number
): string[] {
  const words = text.trim().split(/\s+/);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (ctx.measureText(test).width <= maxWidth) {
      current = test;
    } else {
      if (current) lines.push(current);
      current = word;
      if (lines.length === maxLines - 1) break;
    }
  }
  if (current && lines.length < maxLines) {
    lines.push(current);
  }
  return lines;
}

export function SocialCardGenerator({ product }: SocialCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [format, setFormat] = useState<CardFormat>("story");
  const [theme, setTheme] = useState<CardTheme>("noir");
  const [rendering, setRendering] = useState(false);
  const [copied, setCopied] = useState(false);

  const width = 1080;
  const height = format === "story" ? 1920 : 1350;

  useEffect(() => {
    let cancelled = false;

    async function render() {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      setRendering(true);
      canvas.width = width;
      canvas.height = height;

      const isNoir = theme === "noir";
      const bgMain = isNoir ? "#0c0a09" : "#faf8f4";
      const bgSecondary = isNoir ? "#1c1917" : "#f2eee6";
      const textPrimary = isNoir ? "#fafaf9" : "#1c1917";
      const textMuted = isNoir ? "#a8a29e" : "#78716c";
      const gold = isNoir ? "#d4af37" : "#b0882a";
      const cardBg = isNoir ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.92)";
      const cardBorder = isNoir ? "rgba(212,175,55,0.28)" : "rgba(176,136,42,0.28)";

      // 1. Background
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, bgMain);
      bgGrad.addColorStop(1, bgSecondary);
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Subtle gold radial glow behind bottle
      const imgCenterY = format === "story" ? 660 : 475;
      const glow = ctx.createRadialGradient(width / 2, imgCenterY, 40, width / 2, imgCenterY, 440);
      glow.addColorStop(0, isNoir ? "rgba(212,175,55,0.22)" : "rgba(212,175,55,0.16)");
      glow.addColorStop(1, "rgba(212,175,55,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, width, height);

      // Outer luxury frame
      ctx.strokeStyle = cardBorder;
      ctx.lineWidth = 2;
      drawRoundedRect(ctx, 44, 44, width - 88, height - 88, 32);
      ctx.stroke();

      // 2. Top Header: Logo + Brand Title
      const topY = format === "story" ? 115 : 92;
      const logoImg = await loadImage("/images/logo-icon.png");
      if (cancelled) return;

      if (logoImg) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(width / 2, topY + 26, 34, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(logoImg, width / 2 - 34, topY - 8, 68, 68);
        ctx.restore();
      }

      ctx.textAlign = "center";
      ctx.fillStyle = gold;
      ctx.font = "600 22px Georgia, serif";
      ctx.fillText("MUNDO DECANTS NICARAGUA", width / 2, topY + 96);

      if (product.categoryName) {
        ctx.fillStyle = textMuted;
        ctx.font = "500 18px system-ui, sans-serif";
        ctx.fillText(product.categoryName.toUpperCase(), width / 2, topY + 128);
      }

      // 3. Perfume Bottle Image
      const boxSize = format === "story" ? 620 : 430;
      const imgTop = format === "story" ? 310 : 245;

      if (product.imageUrl) {
        const prodImg = await loadImage(product.imageUrl);
        if (cancelled) return;
        if (prodImg) {
          const ratio = Math.min(boxSize / prodImg.width, boxSize / prodImg.height);
          const drawW = prodImg.width * ratio;
          const drawH = prodImg.height * ratio;
          const drawX = (width - drawW) / 2;
          const drawY = imgTop + (boxSize - drawH) / 2;

          ctx.save();
          ctx.shadowColor = isNoir ? "rgba(0,0,0,0.65)" : "rgba(28,25,23,0.22)";
          ctx.shadowBlur = 45;
          ctx.shadowOffsetY = 24;
          ctx.drawImage(prodImg, drawX, drawY, drawW, drawH);
          ctx.restore();
        }
      } else {
        ctx.fillStyle = cardBorder;
        ctx.font = "400 180px Georgia, serif";
        ctx.fillText(product.name.charAt(0).toUpperCase(), width / 2, imgTop + boxSize / 2 + 60);
      }

      // 4. Brand & Perfume Name
      let cursorY = imgTop + boxSize + (format === "story" ? 75 : 48);

      if (product.brandName) {
        ctx.fillStyle = gold;
        ctx.font = "600 26px system-ui, sans-serif";
        ctx.fillText(product.brandName.toUpperCase(), width / 2, cursorY);
        cursorY += 54;
      }

      ctx.fillStyle = textPrimary;
      ctx.font = format === "story" ? "600 62px Georgia, serif" : "600 50px Georgia, serif";
      const titleLines = wrapText(ctx, product.name, width - 170, 2);
      for (const line of titleLines) {
        ctx.fillText(line, width / 2, cursorY);
        cursorY += format === "story" ? 72 : 58;
      }

      // Gold divider
      ctx.fillStyle = gold;
      ctx.fillRect(width / 2 - 48, cursorY - 12, 96, 3);
      cursorY += format === "story" ? 42 : 26;

      // 5. Olfactory Notes
      if (product.olfactoryNotes) {
        ctx.fillStyle = textMuted;
        ctx.font = "500 20px system-ui, sans-serif";
        ctx.fillText("NOTAS OLFATIVAS", width / 2, cursorY);
        cursorY += 34;

        ctx.fillStyle = textPrimary;
        ctx.font = "italic 26px Georgia, serif";
        const noteLines = wrapText(ctx, product.olfactoryNotes, width - 200, 2);
        for (const nl of noteLines) {
          ctx.fillText(nl, width / 2, cursorY);
          cursorY += 36;
        }
        cursorY += format === "story" ? 36 : 20;
      }

      // 6. Prices Cards
      const displayVariants = product.variants.slice(0, 3);
      if (displayVariants.length > 0) {
        const cardW = displayVariants.length === 1 ? 380 : displayVariants.length === 2 ? 320 : 270;
        const cardH = format === "story" ? 140 : 118;
        const gap = 28;
        const totalW = displayVariants.length * cardW + (displayVariants.length - 1) * gap;
        let startX = (width - totalW) / 2;

        for (const v of displayVariants) {
          drawRoundedRect(ctx, startX, cursorY, cardW, cardH, 20);
          ctx.fillStyle = cardBg;
          ctx.fill();
          ctx.strokeStyle = cardBorder;
          ctx.lineWidth = 2;
          ctx.stroke();

          ctx.fillStyle = textMuted;
          ctx.font = "600 22px system-ui, sans-serif";
          ctx.fillText(v.name.toUpperCase(), startX + cardW / 2, cursorY + (format === "story" ? 48 : 42));

          ctx.fillStyle = gold;
          ctx.font = "700 38px Georgia, serif";
          ctx.fillText(
            formatCurrency(v.price),
            startX + cardW / 2,
            cursorY + (format === "story" ? 102 : 90)
          );

          startX += cardW + gap;
        }
      }

      // 7. Footer CTA
      const footerY = height - 92;
      ctx.fillStyle = textMuted;
      ctx.font = "500 22px system-ui, sans-serif";
      ctx.fillText("100% Originales · Envíos a toda Nicaragua", width / 2, footerY - 34);

      ctx.fillStyle = gold;
      ctx.font = "600 24px system-ui, sans-serif";
      ctx.fillText("@mundodecants_nicaragua", width / 2, footerY);

      setRendering(false);
    }

    render();
    return () => {
      cancelled = true;
    };
  }, [product, format, theme, width, height]);

  function handleDownload() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      const url = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = `mundodecants-${product.slug}-${format}-${theme}.png`;
      a.click();
      toast.success("Imagen descargada lista para publicar");
    } catch {
      toast.error(
        "No se pudo exportar por restricciones CORS de la imagen externa. Probá resubiendo la imagen."
      );
    }
  }

  async function handleCopyCaption() {
    const pricesText = product.variants
      .map((v) => `• ${v.name}: ${formatCurrency(v.price)}`)
      .join("\n");

    const caption = [
      `✨ ${product.brandName ? `${product.brandName} — ` : ""}${product.name} ✨`,
      product.description ? `\n${product.description}` : "",
      product.olfactoryNotes ? `\n💧 Notas olfativas: ${product.olfactoryNotes}` : "",
      pricesText ? `\n💎 Presentaciones disponibles:\n${pricesText}` : "",
      `\n📦 Decants 100% originales · Envíos a toda Nicaragua 🇳🇮`,
      `📲 Escribinos por DM o WhatsApp para pedir el tuyo.`,
      `\n#MundoDecantsNicaragua #PerfumesNicaragua #DecantsNicaragua #AltaPerfumeria`,
    ]
      .filter(Boolean)
      .join("\n");

    try {
      await navigator.clipboard.writeText(caption);
      setCopied(true);
      toast.success("Texto copiado al portapapeles");
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error("No se pudo copiar el texto");
    }
  }

  return (
    <div className="bg-white border border-stone-200/80 rounded-2xl p-4 space-y-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-50 text-gold">
            <Camera className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-stone-900">Tarjeta para Redes Sociales</h3>
            <p className="text-[11px] text-muted-foreground">
              Descargá en HD lista para Instagram, Facebook o WhatsApp
            </p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-2 gap-2">
        <div className="flex rounded-lg bg-stone-100 p-0.5 text-xs">
          <button
            type="button"
            onClick={() => setFormat("story")}
            className={`flex-1 py-1.5 rounded-md font-medium transition-colors ${
              format === "story" ? "bg-white text-stone-900 shadow-xs" : "text-stone-600"
            }`}
          >
            Story 9:16
          </button>
          <button
            type="button"
            onClick={() => setFormat("post")}
            className={`flex-1 py-1.5 rounded-md font-medium transition-colors ${
              format === "post" ? "bg-white text-stone-900 shadow-xs" : "text-stone-600"
            }`}
          >
            Post 4:5
          </button>
        </div>

        <div className="flex rounded-lg bg-stone-100 p-0.5 text-xs">
          <button
            type="button"
            onClick={() => setTheme("noir")}
            className={`flex-1 py-1.5 rounded-md font-medium transition-colors ${
              theme === "noir" ? "bg-stone-900 text-white shadow-xs" : "text-stone-600"
            }`}
          >
            Noir Dorado
          </button>
          <button
            type="button"
            onClick={() => setTheme("editorial")}
            className={`flex-1 py-1.5 rounded-md font-medium transition-colors ${
              theme === "editorial" ? "bg-white text-stone-900 shadow-xs" : "text-stone-600"
            }`}
          >
            Editorial
          </button>
        </div>
      </div>

      {/* Live Preview */}
      <div className="relative bg-stone-100 rounded-xl p-3 flex items-center justify-center overflow-hidden">
        <canvas
          ref={canvasRef}
          className="w-full max-w-[260px] h-auto rounded-lg shadow-lg border border-stone-200/80"
        />
        {rendering && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-xs flex items-center justify-center">
            <Sparkles className="h-5 w-5 animate-spin text-gold" />
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={handleDownload}
          className="inline-flex items-center justify-center gap-1.5 bg-stone-900 text-white py-2 px-3 rounded-lg text-xs font-medium hover:bg-stone-800 transition-colors"
        >
          <Download className="h-3.5 w-3.5" />
          Descargar PNG
        </button>
        <button
          type="button"
          onClick={handleCopyCaption}
          className="inline-flex items-center justify-center gap-1.5 border border-stone-200 bg-white text-stone-700 py-2 px-3 rounded-lg text-xs font-medium hover:bg-stone-50 transition-colors"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copiado" : "Copiar texto"}
        </button>
      </div>
    </div>
  );
}
