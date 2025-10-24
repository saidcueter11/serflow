import { useState } from "react"
import { Categories, mockProducts } from "../mocks/mockProducts"
import ProductCard from "./ProductCard"
import miTierraQuerida from '../assets/miTierraQuerida.jpg'
import baseball from '../assets/beisbol.jpg'
import kids from '../assets/kids.png'
import basketball from '../assets/basketball.jpg'

export default function ProductCardList () {
  const [currentCategory, setCurrentCategory] = useState(Categories.miTierraQuerida)

  const categoryImages: Record<string, string> = {
    [Categories.miTierraQuerida]: miTierraQuerida.src,
    [Categories.beisbol]: baseball.src,
    [Categories.basketball]: basketball.src,
    [Categories.kids]: kids.src
  }

  const categoryImage = categoryImages[currentCategory] ?? miTierraQuerida.src

  const filteredProductList = mockProducts.filter(product => product.category === currentCategory)

  return (
    <>
      <div className="flex gap-2 text-sm">
        {Object.values(Categories).map(category => (
          <button
            className={`cursor-pointer rounded-2xl px-3 py-1 hover:bg-accent/30 transition-colors ${currentCategory === category ? 'bg-accent/30' : ''}`}
            onClick={() => setCurrentCategory(category)}
          >{category}</button>
        ))}
      </div>
      <div className="relative min-w-full">
        <img
          className="w-full h-32 object-cover rounded-md"
          src={categoryImage}
          loading="lazy"
        />
        <span className="absolute z-10 inset-0 flex items-center justify-center text-2xl drop-shadow-md drop-shadow-primary">{currentCategory}</span>
      </div>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 sm:gap-6 mt-10 gap-4">
        {
          filteredProductList.map((product) => (
            <ProductCard
              id={product.id}
              mainImage={product.image}
              category={product.category}
              images={mockProducts.map((img) => img.image)}
            />
          ))
        }
      </div>
    </>
  )
}