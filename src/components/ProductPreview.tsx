import { motion, AnimatePresence } from 'framer-motion'
import type { ImageMetadata } from 'astro'
import { useState } from 'react'
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
  const [activeIndex, setActiveIndex] = useState(
    images.findIndex((img) => img.src === mainImage.src) || 0
  )
  const [direction, setDirection] = useState(0)
  const [touchStart, setTouchStart] = useState<number | null>(null)

  const handleNext = () => {
    setDirection(1)
    setActiveIndex((prev) => (prev + 1) % images.length)
  }

  const handlePrev = () => {
    setDirection(-1)
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const handleTouchStart = (e: TouchEvent) => setTouchStart(e.touches[0].clientX)
  const handleTouchMove = (e: TouchEvent) => {
    if (!touchStart) return
    const diff = touchStart - e.touches[0].clientX
    if (Math.abs(diff) > 50) {
      diff > 0 ? handleNext() : handlePrev()
      setTouchStart(null)
    }
  }

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? '100%' : '-100%',
      zIndex: 0,
    }),
    center: {
      x: 0,
      zIndex: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? '-100%' : '100%',
      zIndex: 2,
    }),
  }

  const handleWhatsApp = () => {
    const phoneNumber = '+573156481243' // your business WhatsApp number
    const productUrl = window.location.href

    const text = `
Hola 👋
¿Sigue disponible este producto?

${productUrl}
    `.trim()

    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`
    window.open(url, '_blank')
  }

  return (
    <div
      className="relative flex flex-col gap-4 w-full h-full"
      onTouchStart={handleTouchStart as any}
      onTouchMove={handleTouchMove as any}
    >
      <div className="relative overflow-hidden rounded-lg h-full w-full aspect-square">
        <AnimatePresence initial={false} custom={direction}>
          <motion.img
            key={activeIndex}
            src={images[activeIndex].src}
            alt={alt}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            loading="lazy"
            transition={{ duration: 0.45, ease: 'easeInOut' }}
            className="absolute inset-0 h-full w-full object-cover object-center rounded-lg"
            style={{ viewTransitionName: `product-image-${id}` }}
          />
        </AnimatePresence>

        {/* Arrows */}
        <button
          type="button"
          className="cursor-pointer absolute left-4 top-1/2 -translate-y-1/2 hover:-translate-x-0.5 bg-accent rounded-full md:flex hidden transition-all z-30"
          onClick={handlePrev}
        >
          <LeftArrowIcon />
        </button>
        <button
          type="button"
          className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 bg-accent rounded-full md:flex hidden hover:translate-x-0.5 transition-all z-30"
          onClick={handleNext}
        >
          <RightArrowIcon />
        </button>

        {/* Progress dots */}
        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1 z-30 px-4">
          {images.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-all duration-300 ${i === activeIndex ? 'bg-accent w-6' : 'bg-gray-500/40 w-3'
                }`}
            ></div>
          ))}
        </div>
      </div>

      {/* WhatsApp Button */}
      <button
        onClick={handleWhatsApp}
        className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md font-medium transition-all"
      >
        💬 Preguntar por WhatsApp
      </button>
    </div>
  )
}
