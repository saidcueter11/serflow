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
}

export default function ProductPreview ({ images, mainImage, alt, id }: ProductPreviewProps) {
  const [activeIndex, setActiveIndex] = useState(
    images.findIndex((img) => img.src === mainImage.src) || 0
  )
  const [direction, setDirection] = useState(0)

  const handleNext = () => {
    setDirection(1)
    setActiveIndex((prev) => (prev + 1) % images.length)
  }

  const handlePrev = () => {
    setDirection(-1)
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  // Touch drag
  const [touchStart, setTouchStart] = useState<number | null>(null)
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
      zIndex: 2, // ensures outgoing image stays on top
    }),
  }

  return (
    <div
      className="relative flex flex-col gap-3"
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
            transition={{ duration: 0.45, ease: 'easeInOut' }}
            className="absolute inset-0 h-full w-full object-cover object-center rounded-lg"
          />
        </AnimatePresence>
      </div>

      {/* Arrows */}
      <button
        type="button"
        className="cursor-pointer absolute left-4 top-1/2 -translate-y-1/2 hover:-translate-x-0.5 bg-accent rounded-full  transition-all z-30"
        onClick={handlePrev}
      >
        <LeftArrowIcon />
      </button>
      <button
        type="button"
        className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 bg-accent rounded-full hover:translate-x-0.5 transition-all z-30"
        onClick={handleNext}
      >
        <RightArrowIcon />
      </button>

      {/* Thumbnails */}
      <div className="flex gap-2 flex-wrap justify-center mt-3">
        {images.map((img, i) => (
          <button
            key={i}
            type="button"
            className={`w-12 h-12 rounded-md overflow-hidden border-2 transition-all duration-200 ${activeIndex === i ? 'border-accent' : 'border-transparent hover:border-accent'
              }`}
            onClick={() => {
              setDirection(i > activeIndex ? 1 : -1)
              setActiveIndex(i)
            }}
          >
            <img src={img.src} alt={`${alt} preview ${i + 1}`} className="object-cover w-full h-full" />
          </button>
        ))}
      </div>
    </div>
  )
}
