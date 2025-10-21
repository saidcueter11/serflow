import type { ImageMetadata } from 'astro'
import hat1 from '../assets/hat1.jpg'
import hat2 from '../assets/hat2.jpg'
import hat3 from '../assets/hat3.jpg'
import hat4 from '../assets/hat4.jpg'


interface ProductType {
  id: number,
  name: string,
  description: string,
  price: number,
  image: ImageMetadata,
  category: string,
  tags: string[]
}

export const mockProducts: ProductType[] = [
  {
    id: 1,
    name: 'Camiseta Personalizable',
    description:
      'Elige tu diseño, color y tipografía. Ideal para grupos, eventos o uso diario.',
    price: 45000,
    image: hat1,
    category: 'camisetas',
    tags: ['estampado', 'bordado', 'unisex'],
  },
  {
    id: 2,
    name: 'Gorra Bordada',
    description:
      'Gorra estilo snapback con bordado personalizado en el frente.',
    price: 38000,
    image: hat2,
    category: 'gorras',
    tags: ['bordado', 'accesorio'],
  },
  {
    id: 3,
    name: 'Sudadera con Capucha',
    description:
      'Sudadera unisex con opción de estampado o bordado en pecho o espalda.',
    price: 85000,
    image: hat3,
    category: 'sudaderas',
    tags: ['bordado', 'estampado', 'invierno'],
  },
  {
    id: 4,
    name: 'Sombrero Tipo Pescador',
    description: 'Sombrero fresco y cómodo, con tu diseño personalizado.',
    price: 32000,
    image: hat4,
    category: 'sombreros',
    tags: ['verano', 'personalizado'],
  },
  {
    id: 5,
    name: 'Set para Regalo',
    description:
      'Incluye camiseta, gorra y bolsa con diseño personalizado. Ideal para cumpleaños o eventos.',
    price: 95000,
    image: hat3,
    category: 'combos',
    tags: ['regalo', 'combo', 'personalizado'],
  },
  {
    id: 6,
    name: 'Bolso Tote',
    description:
      'Bolsa de tela resistente con impresión o bordado. Estilo ecológico y urbano.',
    price: 30000,
    image: hat2,
    category: 'accesorios',
    tags: ['ecológico', 'bordado', 'estampado'],
  },
]