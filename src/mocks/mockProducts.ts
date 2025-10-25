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
import miTierraQuerida25 from '../assets/images/miTierraQuerida/miTierraQuerida26.webp'
import beisbol from '../assets/images/beisbol/beisbol.webp'
import beisbol2 from '../assets/images/beisbol/beisbol2.webp'
import beisbol3 from '../assets/images/beisbol/beisbol3.webp'
import beisbol4 from '../assets/images/beisbol/beisbol4.webp'
import beisbol5 from '../assets/images/beisbol/beisbol5.webp'
import beisbol6 from '../assets/images/beisbol/beisbol6.webp'
import beisbol7 from '../assets/images/beisbol/beisbol7.webp'
import beisbol8 from '../assets/images/beisbol/beisbol8.webp'
import beisbol9 from '../assets/images/beisbol/beisbol9.webp'
import beisbol11 from '../assets/images/beisbol/beisbol11.webp'
import beisbol12 from '../assets/images/beisbol/beisbol12.webp'
import beisbol13 from '../assets/images/beisbol/beisbol13.webp'
import beisbol14 from '../assets/images/beisbol/beisbol14.webp'
import beisbol15 from '../assets/images/beisbol/beisbol15.webp'
import beisbol16 from '../assets/images/beisbol/beisbol16.webp'
import beisbol17 from '../assets/images/beisbol/beisbol17.webp'
import beisbol18 from '../assets/images/beisbol/beisbol18.webp'
import beisbol19 from '../assets/images/beisbol/beisbol19.webp'
import beisbol20 from '../assets/images/beisbol/beisbol20.webp'
import beisbol21 from '../assets/images/beisbol/beisbol21.webp'
import beisbol22 from '../assets/images/beisbol/beisbol22.webp'
import beisbol23 from '../assets/images/beisbol/beisbol23.webp'
import beisbol24 from '../assets/images/beisbol/beisbol24.webp'

export enum Categories {
  miTierraQuerida = 'miTierraQuerida',
  beisbol = 'beisbol',
  basketball = 'basketball',
  kids = 'kids',
  moda = 'moda',
}

export const CategoryLabels = {
  [Categories.miTierraQuerida]: 'Mi Tierra Querida',
  [Categories.beisbol]: 'Beisbol',
  [Categories.basketball]: 'Basketball',
  [Categories.kids]: 'Niños',
  [Categories.moda]: "Moda"
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
  {
    id: 25,
    image: miTierraQuerida25,
    category: Categories.miTierraQuerida
  },

  //Baseball

  {
    id: 26,
    image: beisbol,
    category: Categories.beisbol,
  },
  {
    id: 27,
    image: beisbol2,
    category: Categories.beisbol,
  },
  {
    id: 28,
    image: beisbol3,
    category: Categories.beisbol,
  },
  {
    id: 29,
    image: beisbol4,
    category: Categories.beisbol,
  },
  {
    id: 30,
    image: beisbol5,
    category: Categories.beisbol,
  },
  {
    id: 31,
    image: beisbol6,
    category: Categories.beisbol,
  },
  {
    id: 32,
    image: beisbol7,
    category: Categories.beisbol,
  },
  {
    id: 33,
    image: beisbol8,
    category: Categories.beisbol,
  },
  {
    id: 34,
    image: beisbol9,
    category: Categories.beisbol,
  },
  // Beisbol10 is missing
  {
    id: 36,
    image: beisbol11,
    category: Categories.beisbol,
  },
  {
    id: 37,
    image: beisbol12,
    category: Categories.beisbol,
  },
  {
    id: 38,
    image: beisbol13,
    category: Categories.beisbol,
  },
  {
    id: 39,
    image: beisbol14,
    category: Categories.beisbol,
  },
  {
    id: 40,
    image: beisbol15,
    category: Categories.beisbol,
  },
  {
    id: 41,
    image: beisbol16,
    category: Categories.beisbol,
  },
  {
    id: 42,
    image: beisbol17,
    category: Categories.beisbol,
  },
  {
    id: 43,
    image: beisbol18,
    category: Categories.beisbol,
  },
  {
    id: 44,
    image: beisbol19,
    category: Categories.beisbol,
  },
  {
    id: 45,
    image: beisbol20,
    category: Categories.beisbol,
  },
  {
    id: 46,
    image: beisbol21,
    category: Categories.beisbol,
  },
  {
    id: 47,
    image: beisbol22,
    category: Categories.beisbol,
  },
  {
    id: 48,
    image: beisbol23,
    category: Categories.beisbol,
  },
  {
    id: 49,
    image: beisbol24,
    category: Categories.beisbol,
  },
]