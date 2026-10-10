import { EmptyState } from "../../../../src/components/ui/EmptyState";
import { WHATSAPP_URL } from "../../../../src/lib/business";
import { Arrow, Code, DebtBoard, type DebtRow, Tile } from "../Chrome";

/*
 * Recreaciones "reimplemented for display": los originales viven dentro de
 * archivos .astro y no se pueden renderizar en el canvas de React. Cada copia
 * existe solo para este storyboard; no es un componente para usar.
 */

/** ProductCardList.astro:101-109 */
function EmptyCategoryLookalike() {
  return (
    <div className="w-[300px] rounded-2xl border border-primary-lighter bg-surface p-8 text-center">
      <p className="text-sm text-muted">No hay productos disponibles en esta categoría por ahora.</p>
    </div>
  );
}

/** CategoryShowcase.astro:25 / ProductCardList.astro:58 */
function GrayTileLookalike({ fabric }: { fabric?: boolean }) {
  return (
    <div
      className={`relative aspect-[3/4] w-[120px] overflow-hidden rounded-2xl ${fabric ? "fabric bg-surface-2" : "bg-zinc-800"}`}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <div className="font-display text-[15px] leading-tight text-white">Gorras</div>
        <div className="text-[11px] text-muted">{fabric ? "6 productos" : "0 productos"}</div>
      </div>
    </div>
  );
}

const ROWS: DebtRow[] = [
  {
    title: "Categoría vacía: una caja sin salida en ProductCardList",
    body: (
      <>
        Cuando una categoría no tiene productos activos se pinta una caja con una sola frase. No hay acción: el cliente
        llegó, no ve nada y no sabe a dónde ir. Además usa <Code>rounded-2xl</Code>, <Code>border-primary-lighter</Code>{" "}
        y <Code>font-vend-sans</Code> en vez de los tokens de la familia.
      </>
    ),
    bullets: [
      <>
        <Code>src/components/ProductCardList.astro:100-109</Code> la rama <Code>list.length === 0</Code>
      </>,
    ],
    fix: (
      <>
        Reemplazar el <Code>{"<div>"}</Code> por <Code>{"<EmptyState>"}</Code> con salida por WhatsApp (
        <Code>whatsappUrl()</Code>) o a otra categoría. El wrapper conserva <Code>data-grid</Code> y{" "}
        <Code>hidden</Code> para el script de pestañas.
      </>
    ),
    visual: (
      <div className="flex items-start gap-4 pt-4">
        <Tile tone="remove" label="ProductCardList.astro:101" reimplemented>
          <EmptyCategoryLookalike />
        </Tile>
        <Arrow />
        <Tile tone="target" label="EmptyState">
          <div className="w-[340px]">
            <EmptyState
              title="Todavía no hay gorras aquí"
              description="Escríbenos: las hacemos por encargo y te contamos tiempos."
              action={{ label: "Pregunta por WhatsApp", href: WHATSAPP_URL }}
            />
          </div>
        </Tile>
      </div>
    ),
  },
  {
    title: "Conteo de productos: el error de Supabase se traga y sale \"0 productos\"",
    body: (
      <>
        Las demás funciones de catálogo lanzan si Supabase falla, así que el build falla y sigue el deploy anterior (bien:
        ningún visitante ve un catálogo roto). <Code>getCategoriesWithCounts</Code> solo revisa el error de categorías; si
        falla la consulta de productos, cada categoría queda en 0 y el home publica "0 productos" en todas las cards.
      </>
    ),
    bullets: [
      <>
        <Code>src/lib/products.ts:13, :75, :89</Code> <Code>throw</Code> en getCategories, getProducts,
        getProductsByCategory
      </>,
      <>
        <Code>src/lib/products.ts:50-56</Code> se revisa <Code>categoriesRes.error</Code> pero no{" "}
        <Code>productsRes.error</Code>
      </>,
      <>
        <Code>src/components/CategoryShowcase.astro:34</Code> pinta <Code>{"{cat.product_count} productos"}</Code>
      </>,
    ],
    fix: (
      <>
        Lanzar también con <Code>productsRes.error</Code>, igual que las otras funciones. No hace falta ErrorState: en SSG
        el error nunca llega al visitante.
      </>
    ),
    visual: (
      <div className="flex items-start gap-4 pt-4">
        <Tile tone="remove" label="CategoryShowcase.astro:34" reimplemented>
          <GrayTileLookalike />
        </Tile>
      </div>
    ),
  },
  {
    title: "if (error) return null en las funciones de slug, sin llamadores",
    body: (
      <>
        Convierten el error en vacío, así que un fallo se vería igual que "no hay datos". Hoy no las llama nadie. Las
        promos ya lanzan con error (PRI-131). Los dos <Code>catch {"{}"}</Code> del sitio no son deuda: dan un valor de
        respaldo razonable (og:image sin convertir, foto vacía en el mensaje).
      </>
    ),
    bullets: [
      <>
        <Code>src/lib/products.ts</Code> getCategoryBySlug y getProductBySlug: 0 llamadores
      </>,
      <>
        <Code>[id].astro:53</Code>, <Code>ProductPreview.astro:365</Code> catch con respaldo: se quedan
      </>,
    ],
    fix: <>Borrar las dos funciones de slug sin llamadores.</>,
    visual: null,
  },
  {
    title: "Caja gris bg-zinc-800 cuando una categoría no tiene imagen",
    body: (
      <>
        Color fuera de la paleta y un relleno que la regla de fotos prohíbe ("una sección sin su foto nunca muestra
        relleno"). En una card que es link no se puede ocultar solo la foto, así que el respaldo debe venir de los tokens.
      </>
    ),
    bullets: [
      <>
        <Code>src/components/CategoryShowcase.astro:25</Code> card del home
      </>,
      <>
        <Code>src/components/ProductCardList.astro:58</Code> banner de la categoría
      </>,
    ],
    fix: (
      <>
        Cambiar a <Code>bg-surface-2 fabric</Code> (0 KB, en paleta). Y en CategoryShowcase, no listar categorías con{" "}
        <Code>product_count === 0</Code>: no ofrecer un camino que termina vacío.
      </>
    ),
    visual: (
      <div className="flex items-start gap-4 pt-4">
        <Tile tone="remove" label="bg-zinc-800" reimplemented>
          <GrayTileLookalike />
        </Tile>
        <Arrow />
        <Tile tone="target" label="bg-surface-2 fabric" reimplemented>
          <GrayTileLookalike fabric />
        </Tile>
      </div>
    ),
  },
];

export function BoardDesignSystemDebt() {
  return <DebtBoard family="estados" rows={ROWS} />;
}
