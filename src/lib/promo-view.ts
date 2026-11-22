import { fotoRemota } from './medios-build'
import { diasPromo, promoPhotoUrls, type Photo, type PromoView } from './promos'
import type { Promo } from './types'

/** Filas de Supabase -> PromoView con las fotos optimizadas en el build (webp, 400/800/1200 px). */
export async function toPromoViews(promos: Promo[]): Promise<PromoView[]> {
  return Promise.all(
    promos.map(async (p) => {
      const fotos = await Promise.all(
        promoPhotoUrls(p).map(async (src, i): Promise<Photo | null> => {
          // PRI-555: con srcset, para no mandarle la de 1200 a una caja de celular. PRI-566: fotoRemota, con el alto en
          // proporción; getImage con inferSize y solo el ancho dejaba el alto original y recortaba la foto.
          const img = await fotoRemota(src, { width: 1200, widths: [400, 800, 1200], quality: 75 })
          if (!img) return null
          return {
            src: img.src,
            srcSet: img.srcSet,
            alt: i === 0 ? p.title : `${p.title}, foto ${i + 1}`,
            r: +img.ratio.toFixed(3),
            // PRI-535: la portada que es el banner_url no entra a la galería del modal (promoModal).
            banner: (i === 0 && !!p.banner_url) || undefined,
          }
        }),
      )
      const photos = fotos.filter((f): f is Photo => !!f)
      return { slug: p.slug, title: p.title, description: p.description ?? null, endsAt: p.ends_at ?? null, dias: diasPromo(p.weekdays), cover: photos[0], photos: photos.slice(1) }
    }),
  )
}
