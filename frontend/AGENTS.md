<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Mundo Decants Nicaragua - Sistema

## Comandos de Desarrollo

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build

# Migraciones de base de datos
npm run db:migrate    # Crear nueva migración
npm run db:seed       # Poblar datos iniciales
npm run db:studio     # Abrir Prisma Studio (gestor visual)
npm run db:reset      # Reiniciar BD y migrar desde cero

# Linter
npm run lint
```

## Variables de Entorno

Ver `.env.example` para referencia. Configurar en Vercel:
- `DATABASE_URL` - Conexión PostgreSQL (Supabase en producción)
- `AUTH_SECRET` - Secreto para JWT (generar con `openssl rand -base64 32`)
- `AUTH_URL` - URL de la aplicación
- `NEXT_PUBLIC_SUPABASE_URL` - URL del proyecto Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Anon key de Supabase
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key de Supabase
- `SUPABASE_STORAGE_BUCKET` - Bucket de imágenes (default: "product-images")

## Estructura del Proyecto

```
frontend/
├── prisma/           # Schema y migraciones
├── src/
│   ├── app/
│   │   ├── (admin)/  # Dashboard protegido
│   │   ├── api/      # API Routes
│   │   └── ...       # Páginas públicas
│   ├── components/   # UI Components
│   ├── lib/          # Utilidades
│   └── server/       # Server Actions
└── public/images/    # Imágenes de productos
```
