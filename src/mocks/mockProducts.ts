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
import baseballTest from '../assets/baseballTest.jpeg'

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
    image: serFlowHat,
    category: Categories.miTierraQuerida,
  },
  {
    id: 2,
    image: serFlowHat1,
    category: Categories.miTierraQuerida,
  },
  {
    id: 3,
    image: serFlowHat2,
    category: Categories.miTierraQuerida,
  },
  {
    id: 4,
    image: serFlowHat3,
    category: Categories.miTierraQuerida,
  },
  {
    id: 5,
    image: serFlowHat4,
    category: Categories.miTierraQuerida,
  },
  {
    id: 6,
    image: serFlowHat5,
    category: Categories.miTierraQuerida,
  }, {
    id: 7,
    image: serFlowHat6,
    category: Categories.miTierraQuerida,
  }, {
    id: 7,
    image: serFlowHat7,
    category: Categories.miTierraQuerida,
  }, {
    id: 8,
    image: serFlowHat8,
    category: Categories.miTierraQuerida,
  }, {
    id: 9,
    image: serFlowHat9,
    category: Categories.miTierraQuerida,
  }, {
    id: 10,
    image: serFlowHat10,
    category: Categories.miTierraQuerida,
  }, {
    id: 11,
    image: serFlowHat11,
    category: Categories.miTierraQuerida,
  },
  { id: 12, image: baseballTest, category: Categories.beisbol }
]