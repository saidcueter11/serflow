import type { ImageMetadata } from 'astro'
import type { Categories } from '../mocks/mockProducts'

interface ProductCardProps {
  id: number
  images: ImageMetadata[]
  mainImage: ImageMetadata
  category: Categories
}

export default function ProductCard ({
  id,
  images,
  mainImage,
  category
}: ProductCardProps) {
  return (
    <div className="flex-col flex gap-3 prose prose-img:m-0 prose-p:m-0 prose-invert max-w-64">
      <div className="flex flex-col gap-2">
        <a
          href={`/products/${id}`}
          data-astro-prefetch
          className="hover:scale-105 transform transition-all"
        >
          <img
            src={mainImage.src}
            alt={category}
            className="w-full h-72 rounded-lg object-cover object-center aspect-square transition-all duration-300"
          />
        </a>

        {/* Stacked preview thumbnails */}
        <div className="flex items-center">
          {images.slice(0, 5).map((img, index) => (
            <div
              key={index}
              className={`size-8 rounded-full overflow-hidden border border-slate-700 shadow-sm transition-transform duration-200`}
              style={{ marginLeft: index === 0 ? '0' : '-0.75rem', zIndex: images.length - index }}
            >
              <img
                src={img.src}
                alt={`${category} preview ${index + 1}`}
                className="w-full h-full object-cover object-center"
              />
            </div>
          ))}

          {images.length > 3 && (
            <span className="text-xs text-secondary ml-2 self-center">+{images.length - 3}</span>
          )}
        </div>
      </div>
    </div>
  )
}
