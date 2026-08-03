---
name: portfolio-sync
description: Reglas y guía de sincronización de la base de datos Cloudflare KV y flujo obligatorio de Git Push para el portafolio de Jovas Motion Design.
---

# Skill: Portfolio Sync & Deployment Protocol

Esta Skill define los procedimientos de sincronización con Cloudflare KV y los estándares de mantenimiento de código para el proyecto **jovas-portfolio**.

## 1. Arquitectura de Sincronización Cloudflare KV
- **API Endpoint:** `functions/api/portfolio.ts`
- **KV Binding:** `PORTFOLIO_KV` (declarado en `wrangler.toml` y configurado en Cloudflare Pages Settings -> Functions -> KV namespace bindings).
- **Estado en Tiempo Real:** El contexto `PortfolioContext.tsx` gestiona `cloudSyncStatus` (`synced`, `syncing`, `unbound`, `error`).
- **Resiliencia Local:** Todas las escrituras se respaldan automáticamente en `IndexedDB` y `localStorage` para garantizar cero pérdida de datos.

## 2. Reglas Antipatrón en Manejo de Datos
1. **NO filtrar por títulos/IDs legados:** Nunca incluir listas rígidas de exclusión por título/ID en `sanitizeProjectList`.
2. **Deduplicación Estricta por ID:** Usar `Map<string, Project>` o `Set<string>` para garantizar que ningún proyecto se duplique al mezclar respuestas asíncronas de la nube con almacenamiento local.
3. **Respetar Datos de la Nube:** Si Cloudflare KV devuelve datos válidos, utilizarlos como fuente de verdad. El fallback a `initialProjects` aplica ÚNICAMENTE cuando no existen datos locales ni remotos.

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
