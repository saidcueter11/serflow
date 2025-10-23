import type { ImageMetadata } from 'astro'

interface ProductCardProps {
  id: number
  name: string
  category: string
  images: ImageMetadata[]
  mainImage: ImageMetadata
}

export default function ProductCard ({
  id,
  name,
  category,
  images,
  mainImage,
}: ProductCardProps) {
  return (
    <div class="flex-col flex gap-3 prose prose-img:m-0 prose-p:m-0 prose-invert max-w-64">
      <div class="flex flex-col gap-3">
        <a
          href={`/products/${id}`}
          data-astro-prefetch
          class="hover:scale-105 transform transition-all"
        >
          <img
            src={mainImage.src}
            alt={name}
            class="w-full h-72 rounded-lg object-cover object-center aspect-square transition-all duration-300"
            style={`view-transition-name: img-${id}`}
          />
        </a>

        {/* Stacked preview thumbnails */}
        <div class="flex items-center mt-2">
          {images.slice(0, 5).map((img, index) => (
            <div
              key={index}
              class={`size-8 rounded-full overflow-hidden border border-slate-700 shadow-sm transition-transform duration-200`}
              style={{ marginLeft: index === 0 ? '0' : '-0.75rem', zIndex: images.length - index }}
            >
              <img
                src={img.src}
                alt={`${name} preview ${index + 1}`}
                class="w-full h-full object-cover object-center"
              />
            </div>
          ))}

          {images.length > 3 && (
            <span class="text-xs text-secondary ml-2 self-center">+{images.length - 3}</span>
          )}
        </div>
      </div>

      <p class="text-sm font-medium">{name}</p>

      <div class="flex gap-3">
        <span class="rounded-lg px-2 text-xs font-light py-1 border-2 border-accent w-fit h-fit capitalize">
          {category}
        </span>
      </div>
    </div>
  )
}
