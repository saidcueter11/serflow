import { motion, AnimatePresence } from 'framer-motion'
import type { ImageMetadata } from 'astro'
import { useState, useCallback, useMemo } from 'react'
import { LeftArrowIcon } from './icons/LeftArrowIcon'
import { RightArrowIcon } from './icons/RightArrowIcon'

interface ProductPreviewProps {
  images: ImageMetadata[]
  mainImage: ImageMetadata
  alt: string
  id: number
  productName?: string
}

export default function ProductPreview ({
  images,
  mainImage,
  alt,
  id,
  productName,
}: ProductPreviewProps) {
  const initialIndex = useMemo(
    () => images.findIndex((img) => img.src === mainImage.src) || 0,
    [images, mainImage]
  )

  const [activeIndex, setActiveIndex] = useState(initialIndex)
  const [direction, setDirection] = useState(0)
  const [touchStart, setTouchStart] = useState<number | null>(null)

  const hasMultipleImages = images.length > 1

  const handleNext = useCallback(() => {
    if (!hasMultipleImages) return
    setDirection(1)
    setActiveIndex((prev) => (prev + 1) % images.length)
  }, [images.length, hasMultipleImages])

  const handlePrev = useCallback(() => {
    if (!hasMultipleImages) return
    setDirection(-1)
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length)
  }, [images.length, hasMultipleImages])

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!hasMultipleImages) return
    setTouchStart(e.touches[0].clientX)
  }, [hasMultipleImages])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchStart || !hasMultipleImages) return
    const diff = touchStart - e.touches[0].clientX
    if (Math.abs(diff) > 50) {
      diff > 0 ? handleNext() : handlePrev()
      setTouchStart(null)
    }
  }, [touchStart, handleNext, handlePrev, hasMultipleImages])

  const variants = useMemo(() => ({
    enter: (dir: number) => ({
      x: dir > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? '-100%' : '100%',
      opacity: 0,
    }),
  }), [])

  const handleWhatsApp = useCallback(() => {
    const phoneNumber = '+573156481243'
    const productUrl = window.location.href
    const name = productName ? `\n\nProducto: ${productName}` : ''

    const text = `Hola 👋\n¿Sigue disponible este producto?${name}\n\n${productUrl}`

    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }, [productName])

  return (
    <div
      className="relative flex flex-col gap-4 w-full h-full"
      onTouchStart={hasMultipleImages ? handleTouchStart : undefined}
      onTouchMove={hasMultipleImages ? handleTouchMove : undefined}
    >
      <div className="relative overflow-hidden rounded-lg h-full w-full aspect-square bg-gray-900">
        {hasMultipleImages ? (
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.img
              key={activeIndex}
              src={images[activeIndex].src}
              alt={`${alt} - imagen ${activeIndex + 1} de ${images.length}`}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              loading="eager"
              decoding="async"
              transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
              className="absolute inset-0 h-full w-full object-cover object-center rounded-lg"
              style={{
                viewTransitionName: `product-image-${id}`,
              }}
            />
          </AnimatePresence>
        ) : (
          <img
            src={images[0].src}
            alt={alt}
            loading="eager"
            decoding="async"
            className="w-full h-full object-cover object-center rounded-lg"
            style={{
              viewTransitionName: `product-image-${id}`,
            }}
          />
        )}

        {/* Navigation Arrows - Only show if multiple images */}
        {hasMultipleImages && (
          <>
            <button
              type="button"
              aria-label="Imagen anterior"
              className="cursor-pointer absolute left-4 top-1/2 -translate-y-1/2 hover:-translate-x-0.5 bg-accent/90 hover:bg-accent rounded-full md:flex hidden transition-all z-30 backdrop-blur-sm"
              onClick={handlePrev}
            >
              <LeftArrowIcon />
            </button>
            <button
              type="button"
              aria-label="Siguiente imagen"
              className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 bg-accent/90 hover:bg-accent rounded-full md:flex hidden hover:translate-x-0.5 transition-all z-30 backdrop-blur-sm"
              onClick={handleNext}
            >
              <RightArrowIcon />
            </button>

            {/* Progress dots */}
            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1 z-30 px-4">
              {images.map((_, i) => (
                <button
                  key={i}
                  aria-label={`Ver imagen ${i + 1}`}
                  onClick={() => {
                    setDirection(i > activeIndex ? 1 : -1)
                    setActiveIndex(i)
                  }}
                  className={`h-1 flex-1 max-w-12 rounded-full transition-all duration-300 ${i === activeIndex
                    ? 'bg-accent'
                    : 'bg-gray-500/40 hover:bg-gray-500/60'
                    }`}
                />
              ))}
            </div>

            {/* Image counter */}
            <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full z-30">
              {activeIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {/* WhatsApp Button */}
      <button
        onClick={handleWhatsApp}
        className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 active:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-md hover:shadow-lg"
        aria-label="Contactar por WhatsApp"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        Preguntar por WhatsApp
      </button>
    </div>
  )
}