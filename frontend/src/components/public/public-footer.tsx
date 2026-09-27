import Link from "next/link";
import { MessageCircle, Camera, Music2, Globe, MapPin } from "lucide-react";

const socialLinks = [
  {
    name: "WhatsApp",
    href: "https://wa.me/message/7ZODFUDVVJZSH1",
    icon: MessageCircle,
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/mundodecants_nicaragua",
    icon: Camera,
  },
  {
    name: "TikTok",
    href: "https://www.tiktok.com/@mundodecants_nicaragua",
    icon: Music2,
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/share/1HoTQ938Nn",
    icon: Globe,
  },
];

const categoryLinks = [
  { name: "Nicho", href: "/categoria/nicho" },
  { name: "Diseñador", href: "/categoria/disenador" },
  { name: "Árabe", href: "/categoria/arabe" },
  { name: "Damas", href: "/categoria/damas" },
];

export function PublicFooter() {
  return (
    <footer className="border-t bg-stone-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-10">
          {/* Brand */}
          <div>
            <h3 className="font-serif text-lg font-semibold mb-1">
              Mundo Decants
            </h3>
            <p className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground/50 mb-3">
              Nicaragua
            </p>
            <p className="text-sm text-muted-foreground/70 leading-relaxed">
              Fragancias auténticas en presentaciones de decant. Perfumes nicho,
              diseñador y árabes con envío a todo Nicaragua.
            </p>
          </div>

          {/* Catálogo */}
          <div>
            <h4 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground/80 mb-4">
              Catálogo
            </h4>
            <ul className="space-y-2.5">
              {categoryLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground/70 hover:text-foreground transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href="/catalogo.pdf"
                  className="text-sm text-gold hover:text-gold/80 transition-colors duration-300"
                >
                  Descargar PDF
                </a>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground/80 mb-4">
              Contacto
            </h4>
            <ul className="space-y-2.5">
              {socialLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-muted-foreground/70 hover:text-foreground transition-colors duration-300"
                  >
                    <link.icon className="h-3.5 w-3.5" />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Ubicación */}
          <div>
            <h4 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground/80 mb-4">
              Ubicación
            </h4>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground/70 leading-relaxed">
                Colonia Centroamérica
                <br />
                De los Semáforos de Lozelsa
                <br />
                20 varas abajo, en edificio KTM
                <br />
                Managua, Nicaragua
              </p>
              <a
                href="https://maps.app.goo.gl/ChcfVXpJgUnzkcwc9"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-gold hover:text-gold/80 transition-colors duration-300"
              >
                <MapPin className="h-3.5 w-3.5" />
                Ver en Google Maps
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground/50">
            © {new Date().getFullYear()} Mundo Decants Nicaragua. Todos los
            derechos reservados.
          </p>
          <div className="flex items-center gap-4">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground/40 hover:text-gold transition-colors duration-300"
                aria-label={link.name}
              >
                <link.icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
