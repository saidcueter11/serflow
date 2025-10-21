import { useEffect, useRef, useState, useMemo } from 'preact/hooks';
import { RightArrowIcon } from './icons/RightArrowIcon';
import { LeftArrowIcon } from './icons/LeftArrowIcon';
import type { ImageMetadata } from 'astro';

interface SlideshowClientProps {
  slides: {
    id: number;
    img: ImageMetadata;
    alt: string;
  }[];
}

export default function SlideshowClient ({ slides }: SlideshowClientProps) {
  const stableSlides = useMemo(() => slides, []);

  const [current, setCurrent] = useState(0);
  const [isManual, setIsManual] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const prevSlide = () => {
    setIsManual(true);
    setCurrent((prev) => (prev - 1 + stableSlides.length) % stableSlides.length);
  };

  const nextSlide = () => {
    setIsManual(true);
    setCurrent((prev) => (prev + 1) % stableSlides.length);
  };

  // 🕒 Auto-advance only if not manually changed
  useEffect(() => {
    if (!isManual) {
      intervalRef.current = window.setInterval(() => {
        setCurrent((prev) => (prev + 1) % stableSlides.length);
      }, 3000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isManual, stableSlides.length]);

  return (
    <div class="relative w-full h-52 overflow-hidden">
      <div
        class="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {stableSlides.map((slide) => (
          <img
            key={slide.id}
            src={slide.img.src}
            alt={slide.alt}
            class="w-full flex-shrink-0 object-cover h-52"
          />
        ))}
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        class="absolute top-1/2 left-4 transform -translate-y-1/2 hover:-translate-x-1 transition-transform cursor-pointer"
      >
        <LeftArrowIcon />
      </button>

      <button
        onClick={nextSlide}
        class="absolute top-1/2 right-4 transform -translate-y-1/2 hover:translate-x-1 cursor-pointer transition-transform"
      >
        <RightArrowIcon />
      </button>

      {/* Dots */}
      <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {stableSlides.map((_, i) => (
          <div
            key={i}
            onClick={() => {
              setIsManual(true);
              setCurrent(i);
            }}
            class={`h-2 w-2 rounded-full cursor-pointer ${i === current ? 'bg-accent' : 'bg-gray-400'
              }`}
          ></div>
        ))}
      </div>
    </div>
  );
}
