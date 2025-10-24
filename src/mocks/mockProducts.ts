import type { ImageMetadata } from 'astro'
import miTierraQuerida from '../assets/images/miTierraQuerida/miTierraQuerida2.webp'
import miTierraQuerida2 from '../assets/images/miTierraQuerida/miTierraQuerida3.webp'
import miTierraQuerida3 from '../assets/images/miTierraQuerida/miTierraQuerida4.webp'
import miTierraQuerida4 from '../assets/images/miTierraQuerida/miTierraQuerida5.webp'
import miTierraQuerida5 from '../assets/images/miTierraQuerida/miTierraQuerida6.webp'
import miTierraQuerida6 from '../assets/images/miTierraQuerida/miTierraQuerida7.webp'
import miTierraQuerida7 from '../assets/images/miTierraQuerida/miTierraQuerida8.webp'
import miTierraQuerida8 from '../assets/images/miTierraQuerida/miTierraQuerida9.webp'
import miTierraQuerida9 from '../assets/images/miTierraQuerida/miTierraQuerida10.webp'
import miTierraQuerida10 from '../assets/images/miTierraQuerida/miTierraQuerida11.webp'
import miTierraQuerida11 from '../assets/images/miTierraQuerida/miTierraQuerida12.webp'
import miTierraQuerida12 from '../assets/images/miTierraQuerida/miTierraQuerida13.webp'
import miTierraQuerida13 from '../assets/images/miTierraQuerida/miTierraQuerida14.webp'
import miTierraQuerida14 from '../assets/images/miTierraQuerida/miTierraQuerida15.webp'
import miTierraQuerida15 from '../assets/images/miTierraQuerida/miTierraQuerida16.webp'
import miTierraQuerida16 from '../assets/images/miTierraQuerida/miTierraQuerida17.webp'
import miTierraQuerida17 from '../assets/images/miTierraQuerida/miTierraQuerida18.webp'
import miTierraQuerida18 from '../assets/images/miTierraQuerida/miTierraQuerida19.webp'
import miTierraQuerida19 from '../assets/images/miTierraQuerida/miTierraQuerida20.webp'
import miTierraQuerida20 from '../assets/images/miTierraQuerida/miTierraQuerida21.webp'
import miTierraQuerida21 from '../assets/images/miTierraQuerida/miTierraQuerida22.webp'
import miTierraQuerida22 from '../assets/images/miTierraQuerida/miTierraQuerida23.webp'
import miTierraQuerida23 from '../assets/images/miTierraQuerida/miTierraQuerida24.webp'
import miTierraQuerida24 from '../assets/images/miTierraQuerida/miTierraQuerida25.webp'

export enum Categories {
  miTierraQuerida = "Mi tierra querida",
  beisbol = "Beisbol",
  basketball = "Basketball",
  kids = "Niños",
  moda = "Moda"
}

interface ProductType {
  id: number,
  image: ImageMetadata,
  category: Categories,
}

export const mockProducts: ProductType[] = [
  {
    id: 1,
    image: miTierraQuerida,
    category: Categories.miTierraQuerida,
  },
  {
    id: 2,
    image: miTierraQuerida2,
    category: Categories.miTierraQuerida,
  },
  {
    id: 3,
    image: miTierraQuerida3,
    category: Categories.miTierraQuerida,
  },
  {
    id: 4,
    image: miTierraQuerida4,
    category: Categories.miTierraQuerida,
  },
  {
    id: 5,
    image: miTierraQuerida5,
    category: Categories.miTierraQuerida,
  },
  {
    id: 6,
    image: miTierraQuerida6,
    category: Categories.miTierraQuerida,
  }, {
    id: 7,
    image: miTierraQuerida7,
    category: Categories.miTierraQuerida,
  }, {
    id: 8,
    image: miTierraQuerida8,
    category: Categories.miTierraQuerida,
  }, {
    id: 9,
    image: miTierraQuerida9,
    category: Categories.miTierraQuerida,
  }, {
    id: 10,
    image: miTierraQuerida10,
    category: Categories.miTierraQuerida,
  }, {
    id: 11,
    image: miTierraQuerida11,
    category: Categories.miTierraQuerida,
  }, {
    id: 12,
    image: miTierraQuerida12,
    category: Categories.miTierraQuerida,
  },
  {
    id: 13,
    image: miTierraQuerida13,
    category: Categories.miTierraQuerida
  }, {
    id: 14,
    image: miTierraQuerida14,
    category: Categories.miTierraQuerida
  }, {
    id: 15,
    image: miTierraQuerida15,
    category: Categories.miTierraQuerida
  },
  {
    id: 16,
    image: miTierraQuerida16,
    category: Categories.miTierraQuerida
  },
  {
    id: 17,
    image: miTierraQuerida17,
    category: Categories.miTierraQuerida
  },
  {
    id: 18,
    image: miTierraQuerida18,
    category: Categories.miTierraQuerida
  },
  {
    id: 19,
    image: miTierraQuerida19,
    category: Categories.miTierraQuerida
  },
  {
    id: 20,
    image: miTierraQuerida20,
    category: Categories.miTierraQuerida
  },
  {
    id: 21,
    image: miTierraQuerida21,
    category: Categories.miTierraQuerida
  },
  {
    id: 22,
    image: miTierraQuerida22,
    category: Categories.miTierraQuerida
  },
  {
    id: 23,
    image: miTierraQuerida23,
    category: Categories.miTierraQuerida
  },
  {
    id: 24,
    image: miTierraQuerida24,
    category: Categories.miTierraQuerida
  },
]