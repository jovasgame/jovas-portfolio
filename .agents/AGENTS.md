# Reglas del Agente para Jovas Portfolio

## Reglas Globales del Repositorio

1. **Sincronización Git Automática:**
   Cada vez que realices modificaciones en el código fuente, la configuración o los estilos de este proyecto, debes ejecutar siempre la secuencia de guardado y push a GitHub:
   ```bash
   git add .
   git commit -m "Mensaje descriptivo de cambios"
   git push origin main
   ```

2. **Preservación de la Base de Datos de Cloudflare KV:**
   - No elimines ni sobreescribas los proyectos guardados por el usuario.
   - Utiliza deduplicación estricta por `id`.
   - Verifica que las llamadas a `/api/portfolio` manejen correctamente el estado del binding `PORTFOLIO_KV`.

3. **Mantenimiento del Dashboard:**
   - Asegúrate de que las acciones de creación (`addProject`), actualización (`updateProject`) y eliminación (`deleteProject`) notifiquen en vivo el estado de sincronización (`cloudSyncStatus`).
