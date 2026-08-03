---
name: desplegar-cambios
description: Flujo completo para modificar el portafolio jovas-motiondesigner.art (Vite + React + Cloudflare Pages/D1) y publicarlo — usar cuando el usuario pida hacer cambios al sitio y subirlos
---

# Flujo de cambios y despliegue — Portafolio Jovas Motion

## Arquitectura del sitio

- **Frontend**: Vite 6 + React 19 + TypeScript + Tailwind 4 (`src/`)
- **Hosting**: Cloudflare Pages, despliegue automático al hacer push a `main` en GitHub (`jovasgame/jovas-portfolio`)
- **Base de datos**: Cloudflare **D1** (binding `PORTFOLIO_D1`, esquema en `schema.sql`) vía Pages Functions: `functions/api/portfolio.ts` (`/api/portfolio`) y `functions/api/auth.ts` (`/api/auth`). Fallback automático a KV (`PORTFOLIO_KV`) si D1 no está vinculado. Detalles de sync en la skill `portfolio-sync` (`.agents/skills/`)
- **Persistencia local**: IndexedDB (`src/utils/idbStorage.ts`) como principal, localStorage como respaldo — la lógica está en `src/context/PortfolioContext.tsx`
- **Dominios**: `jovas-motiondesigner.art` y `www.jovas-motiondesigner.art` (ambos sirven el sitio)

## Flujo estándar para cualquier cambio

1. Editar el código
2. Verificar tipos: `npx tsc --noEmit` (debe terminar sin salida)
3. Compilar: `npm run build` — revisar que el bundle JS no supere ~1 MB
4. Probar local si hace falta: `npx vite preview --port 4173`
5. Commit en español estilo repo (prefijos `feat:`/`fix:`/`perf:`) y `git push origin main`
6. Esperar el despliegue de Cloudflare Pages (~1-3 min) y verificar en vivo:

```bash
# Verificar que el nuevo bundle (hash del build local en dist/index.html) ya está en vivo
until curl -s https://jovas-motiondesigner.art/ | grep -q "index-<HASH>.js"; do sleep 10; done
```

## Reglas críticas (errores ya corregidos, no reintroducir)

- **NUNCA incrustar imágenes base64 en `src/`** — inflan el bundle JS (llegó a 21.5 MB). Las imágenes van en `public/images/` y se referencian como `/images/nombre.jpg`. Script de extracción disponible: `node scripts/extract-base64-images.cjs`
- **D1 sustituyó a KV (ago 2026)**: el blob único de KV (límite 25 MB, estaba al 95%, y "último gana" entre dispositivos) causaba pérdidas y duplicados. NO volver a un solo valor KV para todo el estado. D1 guarda una fila por proyecto/foto con `updated_at`
- **Escrituras protegidas**: el POST de `/api/portfolio` exige header `x-sync-key` si `SYNC_SECRET` está configurada en Pages env vars — no quitar esa verificación
- **Guardas de sync en `PortfolioContext.tsx`** (no eliminar): bloqueo de escritura hasta terminar el GET inicial (`cloudLoadFinishedRef`), merge por timestamps (`last_local_change` vs `updatedAt` de la nube), y rechazo de payload vacío en el servidor (409 `rejected_empty`)
- **No borrar los proyectos por defecto "legacy"**: `PortfolioContext.tsx` tiene listas `LEGACY_DUMMY_TITLES`/`LEGACY_DUMMY_IDS` que filtran datos viejos de ejemplo — mantenerlas
- **Sanitizers activos**: `sanitizeProfile`/`sanitizeBrandAssets` reemplazan URLs rotas de `lh3.googleusercontent.com/aida-public` — si una imagen "no se guarda", revisar ahí

## Diagnóstico rápido

```bash
npx tsc --noEmit          # errores de tipos
npm run build             # build + tamaño del bundle
git fetch origin && git status -sb   # sincronización con GitHub
curl -s -o /dev/null -w "%{http_code}" https://jovas-motiondesigner.art/        # sitio raíz
curl -s -o /dev/null -w "%{http_code}" https://www.jovas-motiondesigner.art/    # www
curl -s https://jovas-motiondesigner.art/api/portfolio | head -c 200            # debe responder "db":"d1","bound":true
npx wrangler d1 execute jovas-portfolio-db --remote --command "SELECT COUNT(*) FROM portfolio_projects"  # filas en D1 (requiere wrangler login)
```

## Si un dominio no carga

- Hacer `nslookup` de ambos dominios: deben resolver a IPs de Cloudflare (104.21.x.x / 172.67.x.x)
- Si resuelven pero no carga: casi siempre es caché DNS local → `ipconfig /flushdns` y probar en incógnito
- Si no resuelve el `www`: falta el registro CNAME `www` en el DNS de Cloudflare apuntando al dominio raíz
