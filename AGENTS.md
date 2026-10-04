# AGENTS.md

Reglas del repo para agentes: `docs/SOFTWARE-FACTORY.md`, sección "Reglas para agentes".

Comandos: `npm run check`, `npm test`, `npm run build && npm run e2e`.

Design system: navegable en la pestaña Assets de Tempo y consultable por MCP. Llama a `asset_list_libraries` / `asset_list` (tempo-design-canvas-tools) **antes de diseñar o construir UI**. Antes de editar `defineControls` o `defineAsset`, lee `get_guide({ topic: "tempo-assets-instructions" })`; los controles van en `tempo/controls.ts` y los assets en los canvases de `tempo/designs/design-system/`, que son la fuente de verdad de cómo se ve la UI. Mantén ambos al día cuando cambien las props públicas. Revisa el tablero "Design System Debt" de la familia antes de cambiar sus primitivas: puede que el fix ya esté documentado.
