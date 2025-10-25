import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import store1 from '../assets/store1.jpg'
import store2 from '../assets/store2.jpg'
import store3 from '../assets/store3.jpg'
import { LeftArrowIcon } from './icons/LeftArrowIcon'
import { RightArrowIcon } from './icons/RightArrowIcon'

const slides = [
  { id: 1, img: store1, alt: 'Slide 1' },
  { id: 2, img: store2, alt: 'Slide 2' },
  { id: 3, img: store3, alt: 'Slide 3' },
]

export default function Slideshow () {
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const [isPaused, setIsPaused] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // detect touch device
  useEffect(() => {
    setIsTouchDevice(window.matchMedia('(pointer: coarse)').matches)
  }, [])

  const total = slides.length

  const changeSlide = (newDirection: number) => {
    setDirection(newDirection)
    setIndex((prev) => (prev + newDirection + total) % total)
  }

  // auto-slide
  useEffect(() => {
    if (isPaused) return
    timeoutRef.current = setTimeout(() => changeSlide(1), 5000)
    return () => clearTimeout(timeoutRef.current!)
  }, [index, isPaused])

  const handleDragEnd = (_: any, info: any) => {
    const offset = info.offset.x
    const velocity = info.velocity.x
    if (Math.abs(offset) > 100 || Math.abs(velocity) > 500) {
      changeSlide(offset < 0 ? 1 : -1)
    }
    setIsPaused(false)
  }

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 1,
    }),
    center: { x: 0, opacity: 1, zIndex: 1 },
    exit: (direction: number) => ({
      x: direction > 0 ? '-100%' : '100%',
      opacity: 1,
      zIndex: 0,
    }),
  }

  return (
    <div className="relative w-dvw h-[60vh] md:h-[80vh] lg:h-dvh overflow-hidden">
      {/* Slides */}
      <div className="w-full h-full relative z-0">
        <AnimatePresence initial={false} custom={direction}>
          <motion.img
            key={slides[index].id}
            src={slides[index].img.src}
            alt={slides[index].alt}
            className="absolute w-full h-full object-cover"
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            drag={isTouchDevice ? 'x' : false}
            dragConstraints={{ left: 0, right: 0 }}
            onDragStart={() => setIsPaused(true)}
            onDragEnd={handleDragEnd}
          />
        </AnimatePresence>
      </div>

      {/* Overlay text */}
      <div className="absolute inset-0 bg-primary/40 flex flex-col justify-center items-center text-center text-white px-6 z-10 pointer-events-none">
        <h1 className="text-3xl md:text-5xl font-bold drop-shadow-md drop-shadow-primary font-titan">
          Bienvenido a Serflow
        </h1>
        <p className="mt-4 max-w-md md:text-lg font-vend-sans text-white/90 drop-shadow-md drop-shadow-primary">
          Calidad que enamora, precios que te hacen volver.
        </p>
        <a
          href="/products/miTierraQuerida"
          data-astro-prefetch
          className="group relative overflow-hidden rounded-md bg-primary px-8 py-2 mt-8 text-neutral-50 hover:text-primary pointer-events-auto"
        >
          <span className="relative z-10">Ver productos</span>
          <span className="absolute inset-0 rounded-md">
            <span className="absolute left-0 aspect-square w-full origin-center -translate-x-full rounded-full bg-accent transition-all duration-500 group-hover:-translate-x-0 group-hover:scale-150"></span>
          </span>
        </a>
      </div>

      {/* Buttons */}
      <button
        onClick={() => {
          setIsPaused(true)
          changeSlide(-1)
        }}
        className="cursor-pointer absolute top-1/2 left-4 md:left-12 -translate-y-1/2 bg-accent text-primary rounded-full hover:-translate-x-1 transition-transform hidden lg:block z-20 pointer-events-auto"
        aria-label="Previous slide"
      >
        <LeftArrowIcon size={12} />
      </button>

      <button
        onClick={() => {
          setIsPaused(true)
          changeSlide(1)
        }}
        className="cursor-pointer absolute top-1/2 right-4 md:right-12 -translate-y-1/2 bg-accent text-primary rounded-full hover:translate-x-1 transition-transform hidden lg:block z-20 pointer-events-auto"
        aria-label="Next slide"
      >
        <RightArrowIcon size={12} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20 pointer-events-auto">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setIsPaused(true)
              setDirection(i > index ? 1 : -1)
              setIndex(i)
            }}
            className={`size-3 rounded-full transition ${i === index ? 'bg-white' : 'bg-white/50 hover:bg-white'
              }`}
          />
        ))}
      </div>
    </div>
  )
}
