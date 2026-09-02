"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Eye, EyeOff } from "lucide-react";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Usuario o contraseña incorrectos");
      setLoading(false);
    } else {
      router.push("/admin");
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 px-4 py-12 relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-gold/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-gold/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-sm bg-white p-8 md:p-10 shadow-2xl shadow-stone-200/50 rounded-2xl border border-stone-100 relative z-10">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <div className="relative w-16 h-16">
              <Image 
                src="/images/logo-icon.webp" 
                alt="Logo" 
                fill 
                className="object-contain"
              />
            </div>
          </div>
          <h1 className="text-2xl font-serif font-medium tracking-tight text-foreground">
            Mundo Decants
          </h1>
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 mt-1">
            Administración
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label htmlFor="username" className="block text-xs uppercase tracking-wider font-medium text-foreground/80">
              Usuario
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-border/60 rounded-xl bg-stone-50/50 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all text-sm"
              placeholder="Ingresa tu usuario"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="block text-xs uppercase tracking-wider font-medium text-foreground/80">
              Contraseña
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-border/60 rounded-xl bg-stone-50/50 pr-12 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all text-sm"
                placeholder="Ingresa tu contraseña"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 border border-red-100 text-xs px-4 py-3 rounded-lg text-center font-medium">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-foreground text-background py-3.5 rounded-xl text-xs uppercase tracking-widest font-medium hover:bg-gold hover:text-white transition-colors duration-300 disabled:opacity-50 mt-2 flex items-center justify-center gap-2"
          >
            {loading ? (
              "Iniciando sesión..."
            ) : (
              <>
                <ShieldCheck className="h-4 w-4" />
                Iniciar Sesión
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
