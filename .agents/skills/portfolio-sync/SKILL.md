---
name: portfolio-sync
description: Reglas y guía de sincronización de la base de datos Cloudflare D1 y flujo obligatorio de Git Push para el portafolio de Jovas Motion Design.
---

# Skill: Portfolio Sync & Deployment Protocol

Esta Skill define los procedimientos de sincronización con **Cloudflare D1** y los estándares de mantenimiento de código para el proyecto **jovas-portfolio**.

## 1. Arquitectura de Sincronización Cloudflare D1
- **API Endpoints:** `functions/api/portfolio.ts` (lectura pública / escritura protegida) y `functions/api/auth.ts` (login server-side).
- **Base de datos:** Cloudflare **D1** (SQLite serverless, consistencia fuerte), binding `PORTFOLIO_D1` declarado en `wrangler.toml`. Esquema en `schema.sql` (tablas `portfolio_projects`, `portfolio_photos`, `portfolio_settings`, cada fila con `updated_at`).
- **Fallback legado:** si `PORTFOLIO_D1` no está vinculado pero sí `PORTFOLIO_KV`, la API usa KV (blob único) automáticamente.
- **Estado en Tiempo Real:** `PortfolioContext.tsx` gestiona `cloudSyncStatus` (`synced`, `syncing`, `unbound`, `error`).
- **Resiliencia Local:** todas las escrituras se respaldan en `IndexedDB` y `localStorage` — cero pérdida de datos aunque falle la red.
- **Variables de entorno en Pages** (Settings > Environment variables): `ADMIN_USERNAME`, `ADMIN_PASSWORD` (login real del dashboard, validado en servidor) y `SYNC_SECRET` (token que el cliente envía como header `x-sync-key` en cada POST). Si no existen, la API opera en modo abierto.

## 2. Reglas Antipatrón en Manejo de Datos (previenen fantasmas/duplicados/pérdidas)
1. **NO filtrar por títulos/IDs legados:** nunca incluir listas rígidas de exclusión por título/ID en `sanitizeProjectList`.
2. **Deduplicación estricta por ID:** usar `Set<string>`/`Map` al mezclar respuestas de la nube con almacenamiento local.
3. **La nube (D1) es la fuente de verdad, pero solo si es más reciente:** `PortfolioContext` compara `updatedAt` de la nube contra `last_local_change` local. Si el local es más nuevo (ediciones offline) y hay sesión admin, el cliente **empuja** su estado a la nube (autocuración); si no, **adopta** la nube.
4. **Nunca escribir antes de terminar el GET inicial:** `cloudLoadFinishedRef` bloquea `syncToCloud` hasta que la carga inicial terminó. Escribir antes pisaría datos reales con estado inicial (origen histórico de proyectos fantasma y resets).
5. **Guarda anti-vaciado en el servidor:** un POST con 0 proyectos se rechaza (409) si la base tiene filas, salvo `force:true` (reset intencional).
6. **Fallback a `initialProjects`:** aplica ÚNICAMENTE cuando no existen datos locales ni remotos.
7. **Imágenes:** las subidas del dashboard se comprimen a JPEG base64 (`ImageUploader`). Preferir URLs externas (Drive/YouTube) para media pesada. NUNCA incrustar base64 en `src/` (ver skill `desplegar-cambios`).

## 3. Protocolo Obligatorio de Guardado y Git Push 🚀
Cada vez que el agente realice cambios en el código o en la configuración del proyecto:
1. Validar la compilación mediante `npm run build` o `npx tsc --noEmit`.
2. Ejecutar los comandos de Git para sincronizar con el repositorio remoto:
   ```bash
   git add .
   git commit -m "Descripción clara de los cambios realizados"
   git push origin main
   ```
3. Confirmar al usuario que los cambios fueron subidos correctamente a GitHub.
4. Esperar el deploy de Cloudflare Pages (~1-3 min) y verificar `/api/portfolio` en vivo (debe responder `"db":"d1"`, `"bound":true`).

## 4. Diagnóstico rápido
```bash
curl -s https://jovas-motiondesigner.art/api/portfolio | head -c 200   # debe incluir "db":"d1"
npx wrangler d1 execute jovas-portfolio-db --remote --command "SELECT COUNT(*) FROM portfolio_projects"   # filas en D1
```
