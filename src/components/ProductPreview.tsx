import { useState } from 'preact/hooks'
import type { ImageMetadata } from 'astro'

interface ProductPreviewProps {
  images: ImageMetadata[]
  mainImage: ImageMetadata
  alt: string
  id: number
}

export default function ProductPreview ({ images, mainImage, alt, id }: ProductPreviewProps) {
  const [activeImg, setActiveImg] = useState(mainImage)
  const [hoverImg, setHoverImg] = useState<ImageMetadata | null>(null)

  const displayedImg = hoverImg || activeImg

  return (
    <div class="flex flex-col gap-3">
      <img
        src={displayedImg.src}
        alt={alt}
        class="h-80 w-full rounded-lg object-cover object-center aspect-square transition-all duration-300"
        style={`view-transition-name: img-${id}`}
      />

      <div class="flex gap-2 flex-wrap">
        {images.map((img, i) => (
          <button
            key={i}
            type="button"
            class={`w-12 h-12 rounded-md overflow-hidden border-2 transition-all duration-200 ${activeImg.src === img.src
              ? 'border-accent'
              : 'border-transparent hover:border-accent'
              }`}
            onMouseEnter={() => setHoverImg(img)}
            onMouseLeave={() => setHoverImg(null)}
            onClick={() => setActiveImg(img)}
          >
            <img
              src={img.src}
              alt={`${alt} preview ${i + 1}`}
              class="object-cover w-full h-full"
            />
          </button>
        ))}
      </div>
    </div>
  )
}
