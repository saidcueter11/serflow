# Software factory - serflow

Auditoría de partida: doc de Tempo "Software Factory Readiness Audit — serflow". Bases montadas en el PR #25 (CI + E2E).

## Reglas para agentes

Las leen los agentes de Tempo (Producto, Diseño, Feature Builder, Bug Fixer, PR Reviewer, Seguridad) antes de cada run y mandan sobre su prompt. Cambiar una regla = editar esta sección por PR. Hechos verificables, no aspiraciones: cada comando y ruta debe existir.

### Producto
- Catálogo web público de **Serflow**, tienda de prendas personalizadas en Cartagena, Colombia. Prod: https://serflowctg.netlify.app/
- Usuarios: clientes que llegan sobre todo desde el celular, ven categorías y productos y piden por WhatsApp (`wa.me/573156481243`). No hay carrito, cuentas, pagos ni checkout: el CTA de cada producto abre WhatsApp con el link y la foto visible.
- El contenido (categorías, productos, promos, imágenes) se administra en el repo hermano `saidcueter11/serflow-admin` (Next.js) contra la misma Supabase. Un feature que necesita datos nuevos suele ser un par de PRs: este repo + serflow-admin (ver PR #20 y serflow-admin#11). Los agentes de este proyecto solo tocan este repo; si hace falta el lado admin, lo dicen en el issue.
- Principios: rápido en móvil, sitio estático (Astro SSG, se reconstruye en cada deploy), copy cercano en español de Colombia. Anti-patrones: agregar backend o lógica de servidor, librerías pesadas en el cliente, romper el flujo a WhatsApp.
- Dueño y único decisor: Said (no hay cliente externo). El producto va a cambiar: el backlog se arma desde cero en el board de Tempo. Los GitHub Issues anteriores (#8-#23) son históricos; no se trabajan ni se migran salvo que Said lo pida.

### Git y PRs
- Rama base: `master`. Ramas: `<feat|fix|docs|chore>/<ID>-<slug>` desde `origin/master`.
- Un PR por cambio, contra `master`. Si el cambio necesita SQL nuevo o un cambio en serflow-admin, el cuerpo del PR lo dice arriba de todo.
- Commits y título del PR en inglés, conventional commits (`feat:`, `fix:`, `chore:`, `docs:`). El ID del issue va en el título. Cuerpo del PR en español o inglés, con qué cambió, cómo se probó y el link del deploy preview de Netlify.
- Solo Said mergea. Ningún agente mergea ni hace push a `master`.

### Verificación
- Local (todo permitido, son rápidos):
  - `npm run check` (astro check, typecheck)
  - `npm test` (Vitest, specs `src/**/*.test.ts`)
  - `npm run build && npm run e2e` (Playwright contra `astro preview` en http://localhost:4231). El build necesita `.env` con `PUBLIC_SUPABASE_URL` y `PUBLIC_SUPABASE_ANON_KEY` (ver `.env.example`); el build tarda ~2 min por el procesamiento de imágenes.
- CI (GitHub Actions), ambos son gate para mergear:
  - `.github/workflows/ci.yml`, job `ci`: `npm run check` + `npm test`. Corre en PR y en push a `master`.
  - `.github/workflows/e2e.yml`, job `e2e`: build + `npm run e2e`. Corre en PR. Reporte en el artifact `playwright-report`.
- Netlify también publica un deploy preview por PR (`deploy-preview-<N>--serflowctg.netlify.app`); úsalo para capturas y QA visual.
- E2E: Playwright, specs en `e2e/`, proyectos `desktop` (Desktop Chrome) y `mobile` (Pixel 7). Sin auth (sitio público). Sin mocks: leen la Supabase real a través del build. Rojo antes / verde después: correr el spec nuevo local contra `master` (rojo) y contra la rama (verde), y pegar ambos resultados en el PR.
- No usar `waitForTimeout`; esperar con `expect(...)` sobre elementos o URL. CI reintenta 2 veces; un test que pasa en reintento se reporta como flaky en el PR.
- Flakes conocidos: ninguno todavía.
- Excepciones sin E2E: cambios solo de docs, workflows o config. Se declaran en el cuerpo del PR con "Sin E2E: <motivo>".

### Datos y prod
- Una sola base: Supabase de prod. El sitio, los deploy previews, CI y el dev local leen la misma base con la anon key, solo lectura (RLS).
- SQL en `supabase/NN_<nombre>.sql` (`01_phase1_schema.sql`, `02_promos.sql`). No hay CLI de migraciones: Said los corre a mano en el SQL editor de Supabase. Los agentes escriben el archivo nuevo (siguiente número), idempotente (`if not exists`, `drop policy if exists`) y aditivo (sin borrar ni renombrar columnas que el sitio o serflow-admin usen), y nunca lo ejecutan.
- Nunca correr `npm run phase1:seed` (`scripts/seed-supabase.mjs`): escribe en prod con la service-role key.
- Datos de prueba: no hay; los E2E usan el catálogo real y no deben depender de un producto específico (navegar por links, no por slugs fijos).
- Convenciones: solo se muestra lo que tiene `is_active = true`; orden por `sort_order`; las URLs usan `slug` (`/products/<categoría>/<producto>`, `/promos/<slug>`); `products.price` existe (nullable) pero el sitio no muestra precios hoy.

### Secretos
- Nunca imprimir ni commitear `SUPABASE_SERVICE_ROLE_KEY` (solo existe para el seed; no está en CI ni Netlify como variable del sitio).
- `PUBLIC_SUPABASE_URL` y `PUBLIC_SUPABASE_ANON_KEY` son públicas por diseño (van en el bundle); viven en Netlify y como secrets del repo para `e2e.yml`. `.env` está en `.gitignore`.

### Zonas sensibles (disparan revisión de Seguridad)
- `supabase/**`, `scripts/**`, `src/lib/supabase.ts`, `.github/workflows/**`, `netlify.toml`, `astro.config.mjs`, `package.json` (dependencias nuevas), y cualquier `set:html` o construcción de URLs con texto del usuario (`src/components/ContactForm.astro`, `src/components/ProductPreview.astro`).
- Modelo de amenaza: la anon key es pública, así que RLS es la única barrera. El público solo debe poder leer filas activas de `categories`, `products`, `promos` y los buckets públicos de imágenes; escribir es solo para usuarios autenticados (serflow-admin). Toda policy nueva se revisa contra eso. El texto del usuario que va a WhatsApp siempre pasa por `encodeURIComponent`.

### Diseño
- Design system "Noche caribe" (PRI-121). Fuente de verdad: los canvases de `tempo/designs/design-system/` (foundations, buttons, labels, cards, media, business-info, states, app-shell). Antes de crear o revisar UI, consultar `asset_list` (Tempo) y reutilizar lo que hay; el tablero "Design System Debt" de cada familia dice qué falta migrar.
- Tokens en `src/styles/tokens.css` (lo importan `global.css` y el host del canvas). Usar las clases Tailwind de los tokens (`bg-primary` = fondo, `bg-surface`, `bg-surface-2`, `border-line`, `text-ink`, `text-muted`, `text-accent` = dorado de marca y único acento, `text-ok`, `text-danger`, `rounded-tile`, `rounded-card`, `font-display`, `font-body`, `fabric`). Nada de hex sueltos ni duraciones fijas. Fuentes: Space Grotesk 500/700 (`font-display`) y la del sistema para texto (`font-body`); `font-titan`/`font-vend-sans` son legado.
- Componentes nuevos en `src/components/ui/` (React estático: Astro los renderiza sin `client:*`, 0 KB de JS; sin hooks ni estado). Los `.astro` de `src/components/` son legado y se migran por PR. Controles de Tempo en `tempo/controls.ts` (el sitio no depende de `tempo-sdk`).
- Datos del negocio (WhatsApp, correo, horarios, dirección, mapa) solo en `src/lib/business.ts`; para links de WhatsApp usar `whatsappUrl()`.
- Fotos: mientras llegan las del cliente se usan fotos de ejemplo del catálogo actual (`src/assets/images/`), nunca stock genérico ajeno al taller; se reemplazan cuando lleguen las reales. `PhotoSlot` sigue ocultándose si no recibe `src`. Una sola mascota visible por página.
- Mobile-first. Viewports de referencia: Pixel 7 y desktop (los mismos proyectos de Playwright).
- Motion con los tokens de duración, sin animaciones que bloqueen la navegación; respetar `prefers-reduced-motion`.
- Copy en español de Colombia, tono cercano e informal. Accesibilidad mínima: `alt` en imágenes, `aria-label` en botones con solo ícono, contraste sobre el fondo oscuro.
- App local: `npm run dev` en http://localhost:4231.

### Comunicación y tablero
- El board de Tempo es uno solo para toda la organización (prefijo `PRI-`) y lo comparten otros proyectos. Todo issue de serflow lleva el label `proj:serflow`: al crear uno, pásalo siempre; al buscar, filtra por él (vista "Serflow"). Nunca toques issues sin ese label.
- Canal de reporte: comentario en el issue de Tempo (no hay Slack conectado). Si algo necesita decisión de Said, el comentario empieza con "Decisión:".
- Stages que se usan: `new-idea`, `scoping`, `spec-concept-design`, `ready-for-dev`, `backlog`, `implementation`, `pr-review`, `merged`, `deployed-production`, `wont-do`, `duplicate`.
