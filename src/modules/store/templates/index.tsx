"use client"

import { useState } from "react"
import { Metadata } from "next"
import CategorySelector from "../components/category-selector"
import TitleFilterSection from "../components/title-filter-section"
import ProductListSection from "../components/product-list-section"
import SalesHitsSection from "@/modules/products/templates/sales-hits-section"
import { HttpTypes } from "@medusajs/types"
import { SortOptions } from "@/lib/data/products"

export const metadata: Metadata = {
  title: "FlexiHub Store",
  description: "Explore all of our products.",
}

export default function StoreTemplate({
  searchParams,
  products,
  count,
  regionData,
  product_categories,
}: {
  product_categories: HttpTypes.StoreProductCategory[]
  products: HttpTypes.StoreProduct[]
  count: number
  regionData: HttpTypes.StoreRegion | undefined | null
  searchParams: {
    sortBy?: SortOptions
    page?: string
    category?: string
    minPrice?: string
    maxPrice?: string
    query?: string
    filter?: string
  }
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
    searchParams.category
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
    setActiveCategory(undefined)
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
        regionData={regionData}
        onFoundItemsCountChange={handleFoundItemsCountChange}
        page={searchParams.page ? parseInt(searchParams.page) : 1}
        products={products}
        count={count}
      />
      <SalesHitsSection theme={themeColors} products={products} />
    </main>
  )
}
