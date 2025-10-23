import type { ImageMetadata } from 'astro'
import serFlowHat1 from '../assets/serflowHat1.jpg'
import serFlowHat from '../assets/serFlowHat.jpeg'
import serFlowHat2 from '../assets/serflowHat2.jpg'
import serFlowHat3 from '../assets/serflowHat3.jpg'
import serFlowHat4 from '../assets/serflowHat4.jpg'
import serFlowHat5 from '../assets/serflowHat5.jpg'
import serFlowHat6 from '../assets/serflowHAt6.jpg'
import serFlowHat7 from '../assets/serflowHat7.jpg'
import serFlowHat8 from '../assets/serflowHat8.jpg'
import serFlowHat9 from '../assets/serflowHat9.jpg'
import serFlowHat10 from '../assets/serflowHat10.jpg'
import serFlowHat11 from '../assets/serflowHat11.jpg'
import serFlowHat12 from '../assets/serflowHat12.jpg'


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
    image: serFlowHat,
    category: 'camisetas',
    tags: ['estampado', 'bordado', 'unisex'],
  },
  {
    id: 2,
    name: 'Gorra Bordada',
    description:
      'Gorra estilo snapback con bordado personalizado en el frente.',
    price: 38000,
    image: serFlowHat1,
    category: 'gorras',
    tags: ['bordado', 'accesorio'],
  },
  {
    id: 3,
    name: 'Sudadera con Capucha',
    description:
      'Sudadera unisex con opción de estampado o bordado en pecho o espalda.',
    price: 85000,
    image: serFlowHat2,
    category: 'sudaderas',
    tags: ['bordado', 'estampado', 'invierno'],
  },
  {
    id: 4,
    name: 'Sombrero Tipo Pescador',
    description: 'Sombrero fresco y cómodo, con tu diseño personalizado.',
    price: 32000,
    image: serFlowHat3,
    category: 'sombreros',
    tags: ['verano', 'personalizado'],
  },
  {
    id: 5,
    name: 'Set para Regalo',
    description:
      'Incluye camiseta, gorra y bolsa con diseño personalizado. Ideal para cumpleaños o eventos.',
    price: 95000,
    image: serFlowHat4,
    category: 'combos',
    tags: ['regalo', 'combo', 'personalizado'],
  },
  {
    id: 6,
    name: 'Bolso Tote',
    description:
      'Bolsa de tela resistente con impresión o bordado. Estilo ecológico y urbano.',
    price: 30000,
    image: serFlowHat5,
    category: 'accesorios',
    tags: ['ecológico', 'bordado', 'estampado'],
  }, {
    id: 7,
    name: 'Bolso Tote',
    description:
      'Bolsa de tela resistente con impresión o bordado. Estilo ecológico y urbano.',
    price: 30000,
    image: serFlowHat6,
    category: 'accesorios',
    tags: ['ecológico', 'bordado', 'estampado'],
  }, {
    id: 7,
    name: 'Bolso Tote',
    description:
      'Bolsa de tela resistente con impresión o bordado. Estilo ecológico y urbano.',
    price: 30000,
    image: serFlowHat7,
    category: 'accesorios',
    tags: ['ecológico', 'bordado', 'estampado'],
  }, {
    id: 8,
    name: 'Bolso Tote',
    description:
      'Bolsa de tela resistente con impresión o bordado. Estilo ecológico y urbano.',
    price: 30000,
    image: serFlowHat8,
    category: 'accesorios',
    tags: ['ecológico', 'bordado', 'estampado'],
  }, {
    id: 9,
    name: 'Bolso Tote',
    description:
      'Bolsa de tela resistente con impresión o bordado. Estilo ecológico y urbano.',
    price: 30000,
    image: serFlowHat9,
    category: 'accesorios',
    tags: ['ecológico', 'bordado', 'estampado'],
  }, {
    id: 10,
    name: 'Bolso Tote',
    description:
      'Bolsa de tela resistente con impresión o bordado. Estilo ecológico y urbano.',
    price: 30000,
    image: serFlowHat10,
    category: 'accesorios',
    tags: ['ecológico', 'bordado', 'estampado'],
  }, {
    id: 11,
    name: 'Bolso Tote',
    description:
      'Bolsa de tela resistente con impresión o bordado. Estilo ecológico y urbano.',
    price: 30000,
    image: serFlowHat11,
    category: 'accesorios',
    tags: ['ecológico', 'bordado', 'estampado'],
  },
]