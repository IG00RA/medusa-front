"use client"

import { useState } from "react"
import { HttpTypes } from "@medusajs/types"
import { SortOptions } from "@lib/data/products"
import CategorySelector from "@modules/store/components/category-selector"
import TitleFilterSection from "@modules/store/components/title-filter-section"
import ProductListSection from "@modules/store/components/product-list-section"

export default function CategoryTemplate({
  searchParams,
  products,
  count,
  regionData,
  product_categories,
  allProducts,
  category,
}: {
  product_categories: HttpTypes.StoreProductCategory[]
  products: HttpTypes.StoreProduct[]
  allProducts: HttpTypes.StoreProduct[]
  count: number
  regionData: HttpTypes.StoreRegion | undefined | null
  searchParams: {
    sortBy?: SortOptions
    page?: string
    minPrice?: string
    maxPrice?: string
    query?: string
  }
  category: HttpTypes.StoreProductCategory
}) {
  const themeColors = {
    mainColor: "#f0ad4e",
    textColor: "text-[#f0ad4e]",
    bgColor: "bg-[#fff9f0]",
    btnBgColor: "bg-[#f0ad4e]",
    borderColor: "border-[#f0ad4e]",
  }

  const [searchQuery, setSearchQuery] = useState<string>(
    searchParams.query || ""
  )
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({
    min: parseInt(searchParams.minPrice || "") || 0,
    max: parseInt(searchParams.maxPrice || "") || 10000,
  })
  const [foundItemsCount, setFoundItemsCount] = useState<number>(0)
  const [activeCategory, setActiveCategory] = useState<string | undefined>(
    category.name
  )

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
  }

  const handlePriceRangeChange = (min: number, max: number) => {
    setPriceRange({ min, max })
  }

  const resetFilters = () => {
    setSearchQuery("")
    setPriceRange({ min: 0, max: 10000 })
    setActiveCategory(category.name)
  }

  const handleFoundItemsCountChange = (count: number) => {
    setFoundItemsCount(count)
  }

  return (
    <main>
      <CategorySelector
        theme={themeColors}
        product_categories={product_categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        parentCategoryHandle={category.handle}
      />
      <TitleFilterSection
        theme={themeColors}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        priceRange={priceRange}
        onPriceRangeChange={handlePriceRangeChange}
        onResetFilters={resetFilters}
        foundItemsCount={foundItemsCount}
      />
      <ProductListSection
        theme={themeColors}
        allProducts={allProducts}
        regionData={regionData}
        onFoundItemsCountChange={handleFoundItemsCountChange}
        page={searchParams.page ? parseInt(searchParams.page) : 1}
        products={products}
        count={count}
      />
    </main>
  )
}
