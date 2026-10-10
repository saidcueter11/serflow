import { getImage } from 'astro:assets'
import { promoPhotoUrls, type PromoView } from './promos'
import type { Promo } from './types'

/** Filas de Supabase -> PromoView con las fotos optimizadas en el build (webp, 1200 px). */
export async function toPromoViews(promos: Promo[]): Promise<PromoView[]> {
  return Promise.all(
    promos.map(async (p) => {
      const photos = await Promise.all(
        promoPhotoUrls(p).map(async (src, i) => ({
          src: (await getImage({ src, inferSize: true, width: 1200, format: 'webp', quality: 75 })).src,
          alt: i === 0 ? p.title : `${p.title}, foto ${i + 1}`,
        })),
      )
      return { slug: p.slug, title: p.title, description: p.description ?? null, endsAt: p.ends_at ?? null, cover: photos[0], photos: photos.slice(1) }
    }),
  )
}
