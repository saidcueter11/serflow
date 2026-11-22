import { getImage } from 'astro:assets'
import { diasPromo, promoPhotoUrls, type PromoView } from './promos'
import type { Promo } from './types'

/** Filas de Supabase -> PromoView con las fotos optimizadas en el build (webp, 400/800/1200 px). */
export async function toPromoViews(promos: Promo[]): Promise<PromoView[]> {
  return Promise.all(
    promos.map(async (p) => {
      const photos = await Promise.all(
        promoPhotoUrls(p).map(async (src, i) => {
          // PRI-555: con srcset, para no mandarle la de 1200 a una caja de celular.
          const img = await getImage({ src, inferSize: true, width: 1200, widths: [400, 800, 1200], format: 'webp', quality: 75 })
          return {
            src: img.src,
            srcSet: img.srcSet.attribute,
            alt: i === 0 ? p.title : `${p.title}, foto ${i + 1}`,
            r: +(Number(img.attributes.width) / Number(img.attributes.height)).toFixed(3) || undefined,
            // PRI-535: la portada que es el banner_url no entra a la galería del modal (promoModal).
            banner: (i === 0 && !!p.banner_url) || undefined,
          }
        }),
      )
      return { slug: p.slug, title: p.title, description: p.description ?? null, endsAt: p.ends_at ?? null, dias: diasPromo(p.weekdays), cover: photos[0], photos: photos.slice(1) }
    }),
  )
}
