# Reglas del Agente para Jovas Portfolio

## Reglas Globales del Repositorio

1. **Sincronización Git Automática:**
   Cada vez que realices modificaciones en el código fuente, la configuración o los estilos de este proyecto, debes ejecutar siempre la secuencia de guardado y push a GitHub:
   ```bash
   git add .
   git commit -m "Mensaje descriptivo de cambios"
   git push origin main
   ```

2. **Preservación de la Base de Datos de Cloudflare D1:**
   - No elimines ni sobreescribas los proyectos guardados por el usuario.
   - Utiliza deduplicación estricta por `id`.
   - Verifica que las llamadas a `/api/portfolio` manejen correctamente el binding `PORTFOLIO_D1` (fallback legado: `PORTFOLIO_KV`).
   - Respeta las guardas anti-pérdida: bloqueo de escritura hasta terminar el GET inicial, merge por timestamps (`last_local_change` vs `updatedAt`), y rechazo de payloads vacíos en el servidor.
   - Las escrituras al POST `/api/portfolio` requieren el header `x-sync-key` cuando `SYNC_SECRET` está configurada en las env vars de Pages.

3. **Mantenimiento del Dashboard:**
   - Asegúrate de que las acciones de creación (`addProject`), actualización (`updateProject`) y eliminación (`deleteProject`) notifiquen en vivo el estado de sincronización (`cloudSyncStatus`).

## Skills Disponibles para el Agente
- **`jovas-portfolio-expert`**: `file:///.agents/skills/jovas-portfolio-expert/SKILL.md` (Manual máster del proyecto, arquitectura full-stack, optimizaciones y guía de desarrollo).
- **`portfolio-sync`**: `file:///.agents/skills/portfolio-sync/SKILL.md` (Protocolo estricto de sincronización D1 y Git Push).

