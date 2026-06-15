# GeniFix — Sitio web

Landing premium en español para la strippping GeniFix (8 mm / 12 mm), con panel de administración para productos.

## Stack

- **Next.js 16** + TypeScript + Tailwind CSS 4
- **Payload CMS 3** — admin en `/admin`
- **Framer Motion** + **Lenis** — animaciones y scroll suave
- **Vercel** — deploy (Neon PostgreSQL en producción). Guía: [`DEPLOY-VERCEL.md`](./DEPLOY-VERCEL.md)

## Desarrollo local

```bash
npm install
cp .env.example .env.local
npm run dev
```

- Sitio: http://localhost:3000
- Admin: http://localhost:3000/admin

### Primer acceso al admin

Enlace **Admin Panel** en el pie del sitio → `/admin`

Las credenciales se configuran con variables de entorno `ADMIN_EMAIL` y `ADMIN_PASSWORD`.  
En local ya están en `.env.local`. El usuario se crea solo al arrancar el servidor.

### Video de presentación

1. **Media** → subir MP4/WebM  
2. **Globals → Configuración del sitio** → elegir video y título  
3. Aparece al final de la sección **Productos**

## Deploy en Vercel (gratis)

**Guía paso a paso (ruso):** ver [`DEPLOY-VERCEL.md`](./DEPLOY-VERCEL.md)

### Imágenes en producción

Las fotos subidas se guardan en disco temporal en serverless. Tras un redeploy pueden perderse. Para producción estable, conecte S3 o Cloudinary.

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run verify` | Typecheck + build (antes de deploy) |
| `npm run typecheck` | Verificación TypeScript |

## Secciones del sitio

- **Inicio** — hero con 5 beneficios y parallax
- **Productos** — catálogo desde CMS (8 mm / 12 mm)
- **Nosotros** — mapa Google (ONYX MUEBLES, Mar del Plata)
- **Contactos** — teléfono `02233390267` + formulario → WhatsApp
- **Documentación** — enlace a [Google Drive](https://drive.google.com/drive/folders/1N98bIfrM7IJSxZIpcR1bSKlDo6015RSM?usp=sharing)
- **Botón flotante WhatsApp** — +54 9 2233 39-0267

## Reemplazar imagen hero

Coloque su foto del producto en `public/images/hero-genifix.jpg` y actualice la ruta en `Hero.tsx` y en el CMS.
