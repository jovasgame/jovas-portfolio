---
name: jovas-portfolio-expert
description: Agente experto maestro para jovas-portfolio. Entiende la arquitectura completa (React 19, Cloudflare D1/Pages, WebGL, Tailwind 4), ejecuta auditorías, soluciona errores, optimiza bundle/performance y sincroniza automáticamente los cambios con GitHub main.
---

# Skill: Jovas Portfolio Expert Agent 🎨⚡

Esta Skill le concede a cualquier modelo de Inteligencia Artificial (Antigravity, Claude, Codex, Gemini, etc.) la capacidad de actuar como el **Ingeniero Máster y Mantenedor Principal del Portafolio de José Luis Vásquez (jovas-portfolio)**.

---

## 1. Arquitectura Full-Stack y Filosofía del Sistema

- **Frontend Core**: React 19, TypeScript ~5.8, Vite 6, Tailwind CSS 4 (mediante `@tailwindcss/vite`).
- **Animaciones & 3D WebGL**: GSAP 3.15, Motion 12.23, OGL 1.0 (Shaders nativos GLSL en Canvas).
- **Servidor & Cloud Serverless**: Cloudflare Pages Functions (`functions/api/portfolio.ts` para lectura/escritura y `functions/api/auth.ts` para login).
- **Persistencia Multinivel (Resiliencia Total)**:
  1. **Cloudflare D1** (`PORTFOLIO_D1`): Base de datos SQLite serverless, consistencia fuerte y fuente principal de verdad en la nube.
  2. **Cloudflare KV** (`PORTFOLIO_KV`): Fallback legado automático si D1 no está vinculado.
  3. **IndexedDB Local** (`idbStorage.ts`): Respaldos estructurados offline en el navegador del usuario.
  4. **LocalStorage** (`jovas_portfolio_v5_final_*`): Caché de acceso ultra rápido y control de timestamp local (`last_local_change`).

---

## 2. Mapa Tecnológico de Componentes

### Vistas Principales & Modales (`src/App.tsx`)
- `App.tsx`: Orquestador principal. Renderiza el fondo WebGL `Aurora` de bajo consumo, la barra de navegación `Navbar`, las 7 secciones continuas del sitio y maneja la carga diferida (`React.lazy`) de vistas pesadas:
  - `AdminDashboard.tsx` (Cargado en diferido solo cuando el administrador inicia sesión).
  - `ContactPage.tsx` (Cargado en diferido al solicitar la página de cotización extendida).

### Secciones Interactivas
- `HeroSlider.tsx`: Showcase dinámico con transiciones avanzadas y llamadas a la acción.
- `PortfolioGrid.tsx`: Malla Bento responsiva con filtrado por categorías (Motion Design, 3D, VFX, Reel) y apertura de `ProjectModal`.
- `VideoSection.tsx`: Reproductor de video integrado con estética YouTube/Vimeo para Motion Graphics y Reels.
- `WorkflowSection.tsx`: Demostración visual e interactiva del flujo de trabajo de renderizado y animación.
- `CoverflowGallery.tsx`: Carrusel 3D interactivo para inspección de proyectos en perspectiva.
- `PhotoGallerySection.tsx`: Galería fotográfica en alta resolución con lightbox modal (`MediaViewer`).
- `AboutSection.tsx`: Presentación profesional de José Luis Vásquez integrando elementos interactivos (`MagicBento`).
- `ContactSection.tsx`: Generador de cotizaciones interactivo con selección de alcance, presupuesto y cálculo dinámico.

### Shaders & Gráficos WebGL (`src/components/`)
- `Aurora.tsx` & `SoftAurora.tsx`: Canvas con shaders GLSL de ondas de luz fluida en segundo plano.
- `MetallicPaint.tsx`: Efectos cromados interactivos con simulación de reflexión especular.
- `PrismaticBurst.tsx`: Shader de aberración cromática y refracción de luz.
- `Strands.tsx`: Hilos cuánticos luminosos reactivos al puntero.

---

## 3. Protocolo de Sincronización Cloudflare D1 (`PortfolioContext.tsx`)

1. **Autenticación en Servidor**: El login envía credenciales SHA-256 a `/api/auth`. El servidor emite un token seguro que se conserva en `sessionStorage`.
2. **Cabecera `x-sync-key`**: Toda solicitud de escritura (POST) incluye el token de sincronización `x-sync-key` correspondiente a `SYNC_SECRET`.
3. **Control Anti-Pérdida & Autocuración**:
   - `cloudLoadFinishedRef` impide que peticiones de guardado previas a la carga inicial sobrescriban la nube con un estado vacío.
   - El cliente compara `updatedAt` de la nube contra `last_local_change` local. Si el local es más reciente debido a trabajo offline, el estado local se sincroniza a la nube. Si la nube es más reciente, el cliente actualiza sus datos locales.
   - **Guarda anti-vaciado en D1**: Si un POST intenta enviar 0 proyectos teniendo la base de datos filas previas, Cloudflare D1 rechaza la petición (`HTTP 409 rejected_empty`) salvo orden explícita `force: true`.
   - **Protección `SQLITE_TOOBIG`**: El backend limita cada declaración individual a ~950 KB. Las imágenes comprimidas base64 de gran tamaño se gestionan en `imageCompression.ts`.

---

## 4. Guía de Optimización de Compilación y Bundle Size

1. **Code-Splitting Estricto**: Vistas secundarias o de administración NUNCA deben importarse de forma síncrona en el hilo principal de `App.tsx`. Usar `React.lazy` y `<React.Suspense>`.
2. **Fragmentación Manual de Paquetes (`vite.config.ts`)**:
   - `vendor-react`: `react`, `react-dom`
   - `vendor-motion`: `motion`, `gsap`
   - `vendor-graphics`: `ogl`
   - `vendor-icons`: `lucide-react`
3. **Límite de Chunks**: Ningún JS final en `dist/` debe superar los 500 KB tras minificación.

---

## 5. Regla Global e Inviolable de Sincronización con GitHub 🚀

Cada vez que se editen archivos de código fuente, componentes, estilos, utilidades o archivos de configuración (`vite.config.ts`, `wrangler.toml`, etc.):

1. **Validar Tipado**: `cmd /c npm run lint` (`npx tsc --noEmit`).
2. **Validar Compilación de Producción**: `cmd /c npm run build`.
3. **Push Inmediato a GitHub**:
   ```bash
   git add .
   git commit -m "Mensaje descriptivo y profesional de los cambios"
   git push origin main
   ```
4. Confirmar al usuario la sincronización exitosa y el inicio del despliegue automático en Cloudflare Pages.

---

## 6. Procedimiento de Auditoría y Resolución de Errores

Cualquier modelo o agente asignado a este sitio debe seguir este flujo sistemático:
1. **Analizar el problema** sin asumir causas a ciegas. Inspeccionar los archivos afectados mediante `view_file` y realizar búsquedas con `grep_search`.
2. **Solucionar la raíz del error** en lugar de parchear síntomas.
3. **Ejecutar la suite de pruebas/compilación** (`cmd /c npm run lint` y `cmd /c npm run build`).
4. **Registrar y subir los cambios a GitHub**.
