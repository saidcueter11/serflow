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
  imagePath: string,
  category: Categories,
}

// Store paths instead of importing all images
export const mockProducts: ProductType[] = [
  // Mi Tierra Querida
  { id: 1, imagePath: 'miTierraQuerida/miTierraQuerida2.webp', category: Categories.miTierraQuerida },
  { id: 2, imagePath: 'miTierraQuerida/miTierraQuerida3.webp', category: Categories.miTierraQuerida },
  { id: 3, imagePath: 'miTierraQuerida/miTierraQuerida4.webp', category: Categories.miTierraQuerida },
  { id: 4, imagePath: 'miTierraQuerida/miTierraQuerida5.webp', category: Categories.miTierraQuerida },
  { id: 5, imagePath: 'miTierraQuerida/miTierraQuerida6.webp', category: Categories.miTierraQuerida },
  { id: 6, imagePath: 'miTierraQuerida/miTierraQuerida7.webp', category: Categories.miTierraQuerida },
  { id: 7, imagePath: 'miTierraQuerida/miTierraQuerida8.webp', category: Categories.miTierraQuerida },
  { id: 8, imagePath: 'miTierraQuerida/miTierraQuerida9.webp', category: Categories.miTierraQuerida },
  { id: 9, imagePath: 'miTierraQuerida/miTierraQuerida10.webp', category: Categories.miTierraQuerida },
  { id: 10, imagePath: 'miTierraQuerida/miTierraQuerida11.webp', category: Categories.miTierraQuerida },
  { id: 11, imagePath: 'miTierraQuerida/miTierraQuerida12.webp', category: Categories.miTierraQuerida },
  { id: 12, imagePath: 'miTierraQuerida/miTierraQuerida13.webp', category: Categories.miTierraQuerida },
  { id: 13, imagePath: 'miTierraQuerida/miTierraQuerida14.webp', category: Categories.miTierraQuerida },
  { id: 14, imagePath: 'miTierraQuerida/miTierraQuerida15.webp', category: Categories.miTierraQuerida },
  { id: 15, imagePath: 'miTierraQuerida/miTierraQuerida16.webp', category: Categories.miTierraQuerida },
  { id: 16, imagePath: 'miTierraQuerida/miTierraQuerida17.webp', category: Categories.miTierraQuerida },
  { id: 17, imagePath: 'miTierraQuerida/miTierraQuerida18.webp', category: Categories.miTierraQuerida },
  { id: 18, imagePath: 'miTierraQuerida/miTierraQuerida19.webp', category: Categories.miTierraQuerida },
  { id: 19, imagePath: 'miTierraQuerida/miTierraQuerida20.webp', category: Categories.miTierraQuerida },
  { id: 20, imagePath: 'miTierraQuerida/miTierraQuerida21.webp', category: Categories.miTierraQuerida },
  { id: 21, imagePath: 'miTierraQuerida/miTierraQuerida22.webp', category: Categories.miTierraQuerida },
  { id: 22, imagePath: 'miTierraQuerida/miTierraQuerida23.webp', category: Categories.miTierraQuerida },
  { id: 23, imagePath: 'miTierraQuerida/miTierraQuerida24.webp', category: Categories.miTierraQuerida },
  { id: 24, imagePath: 'miTierraQuerida/miTierraQuerida25.webp', category: Categories.miTierraQuerida },
  { id: 25, imagePath: 'miTierraQuerida/miTierraQuerida26.webp', category: Categories.miTierraQuerida },

  // Baseball
  { id: 26, imagePath: 'beisbol/beisbol.webp', category: Categories.beisbol },
  { id: 27, imagePath: 'beisbol/beisbol2.webp', category: Categories.beisbol },
  { id: 28, imagePath: 'beisbol/beisbol3.webp', category: Categories.beisbol },
  { id: 29, imagePath: 'beisbol/beisbol4.webp', category: Categories.beisbol },
  { id: 30, imagePath: 'beisbol/beisbol5.webp', category: Categories.beisbol },
  { id: 31, imagePath: 'beisbol/beisbol6.webp', category: Categories.beisbol },
  { id: 32, imagePath: 'beisbol/beisbol7.webp', category: Categories.beisbol },
  { id: 33, imagePath: 'beisbol/beisbol8.webp', category: Categories.beisbol },
  { id: 34, imagePath: 'beisbol/beisbol9.webp', category: Categories.beisbol },
  { id: 36, imagePath: 'beisbol/beisbol11.webp', category: Categories.beisbol },
  { id: 37, imagePath: 'beisbol/beisbol12.webp', category: Categories.beisbol },
  { id: 38, imagePath: 'beisbol/beisbol13.webp', category: Categories.beisbol },
  { id: 39, imagePath: 'beisbol/beisbol14.webp', category: Categories.beisbol },
  { id: 40, imagePath: 'beisbol/beisbol15.webp', category: Categories.beisbol },
  { id: 41, imagePath: 'beisbol/beisbol16.webp', category: Categories.beisbol },
  { id: 42, imagePath: 'beisbol/beisbol17.webp', category: Categories.beisbol },
  { id: 43, imagePath: 'beisbol/beisbol18.webp', category: Categories.beisbol },
  { id: 44, imagePath: 'beisbol/beisbol19.webp', category: Categories.beisbol },
  { id: 45, imagePath: 'beisbol/beisbol20.webp', category: Categories.beisbol },
  { id: 46, imagePath: 'beisbol/beisbol21.webp', category: Categories.beisbol },
  { id: 47, imagePath: 'beisbol/beisbol22.webp', category: Categories.beisbol },
  { id: 48, imagePath: 'beisbol/beisbol23.webp', category: Categories.beisbol },
  { id: 49, imagePath: 'beisbol/beisbol24.webp', category: Categories.beisbol },
]

// Helper to get images for a specific category (lazy load)
export const getProductsByCategory = (category: Categories) => {
  return mockProducts.filter(p => p.category === category)
}