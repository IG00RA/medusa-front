"use client"

import { useTranslations } from "@/lib/localization"
import Image from "next/image"
import { useEffect, useState } from "react"
import { MdArrowBackIosNew, MdArrowForwardIos } from "react-icons/md"
import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import { Pagination } from "@modules/store/components/pagination"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

interface ProductListSectionProps {
  theme: {
    mainColor: string
    textColor: string
    bgColor: string
    btnBgColor: string
    borderColor: string
  }
  searchQuery: string
  activeFilter: number
  priceRange: { min: number; max: number }
  onFoundItemsCountChange?: (count: number) => void
  page: number
  regionData: HttpTypes.StoreRegion | undefined | null
  products: HttpTypes.StoreProduct[]
  count: number
}

const PRODUCT_LIMIT = 12

const ProductListSection = ({
  theme,
  searchQuery,
  activeFilter,
  priceRange,
  onFoundItemsCountChange,
  page,
  regionData,
  products,
  count,
}: ProductListSectionProps) => {
  const t = useTranslations().moreThanPrint.salesHits
  const [filteredItems, setFilteredItems] = useState<HttpTypes.StoreProduct[]>(
    []
  )
  const [recentlyViewedItems, setRecentlyViewedItems] = useState<
    HttpTypes.StoreProduct[]
  >([])
  const [totalPages, setTotalPages] = useState<number>(1)
  const [region, setRegion] = useState<HttpTypes.StoreRegion | null>(null)

  useEffect(() => {
    if (!regionData) return

    setRegion(regionData)
    setTotalPages(Math.ceil(count / PRODUCT_LIMIT))

    let result = [...products]

    // Price filtering
    result = result.filter((item) => {
      const { cheapestPrice } = getProductPrice({ product: item })
      const priceValue = Number(cheapestPrice?.calculated_price || 0)
      return priceValue >= priceRange.min && priceValue <= priceRange.max
    })

    // Search filtering
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (item) =>
          item.title?.toLowerCase().includes(query) ||
          item.description?.toLowerCase().includes(query)
      )
    }

    // Custom filters
    if (activeFilter !== null) {
      switch (activeFilter) {
        case 0: // Popular
          result = result.filter((item) =>
            item.tags?.some((tag) => tag.value === "popular")
          )
          break
        case 1: // New
          result = result.filter((item) =>
            item.tags?.some((tag) => tag.value === "new")
          )
          break
        case 2: // Price Low to High
          result.sort((a, b) => {
            const priceA = Number(
              getProductPrice({ product: a }).cheapestPrice?.calculated_price ||
                0
            )
            const priceB = Number(
              getProductPrice({ product: b }).cheapestPrice?.calculated_price ||
                0
            )
            return priceA - priceB
          })
          break
        case 3: // Price High to Low
          result.sort((a, b) => {
            const priceA = Number(
              getProductPrice({ product: a }).cheapestPrice?.calculated_price ||
                0
            )
            const priceB = Number(
              getProductPrice({ product: b }).cheapestPrice?.calculated_price ||
                0
            )
            return priceB - priceA
          })
          break
        case 4: // Can Personalize
          result = result.filter((item) =>
            item.tags?.some((tag) => tag.value === "personalized")
          )
          break
      }
    }

    setFilteredItems(result)
    if (onFoundItemsCountChange) {
      onFoundItemsCountChange(result.length)
    }

    // Recently viewed (client-side storage)
    const viewed = JSON.parse(
      localStorage.getItem("recentlyViewed") || "[]"
    ) as string[]
    const viewedProducts = products
      .filter((p) => viewed.includes(p.id!))
      .slice(0, 3)
    setRecentlyViewedItems(viewedProducts)
  }, [
    searchQuery,
    activeFilter,
    priceRange,
    products,
    count,
    onFoundItemsCountChange,
  ])

  const handleViewProduct = (productId: string) => {
    const viewed = JSON.parse(
      localStorage.getItem("recentlyViewed") || "[]"
    ) as string[]
    if (!viewed.includes(productId)) {
      viewed.unshift(productId)
      localStorage.setItem(
        "recentlyViewed",
        JSON.stringify(viewed.slice(0, 10))
      )
    }
  }

  return (
    <section className="pt-[64px] pb-[48px] px-[16px] lg:pt-[112px] bg-[#F9F9F9] relative">
      <div className="relative max-w-[1408px] mx-auto mb-[48px]">
        {filteredItems.length === 0 ? (
          <div className="text-center py-8">
            <h3 className="text-[20px] font-bold text-[#444444]">
              Нажаль, товари не знайдено
            </h3>
            <p className="text-[16px] text-[#A7A7A7] mt-2">
              Спробуйте змінити параметри фільтрації
            </p>
          </div>
        ) : (
          <ul className="flex flex-col lg:flex-row lg:flex-wrap justify-center items-center gap-[16px]">
            {filteredItems.map((item) => {
              const { cheapestPrice } = getProductPrice({ product: item })
              return (
                <li
                  key={item.id}
                  className="flex flex-col items-center w-[300px] h-[412px] rounded-[24px] bg-white border border-[#E8E8E8] py-6 px-6"
                >
                  <LocalizedClientLink
                    href={`/products/${item.handle}`}
                    onClick={() => handleViewProduct(item.id!)}
                  >
                    <div className="min-w-[252px] h-[200px] bg-[#F0F0F0] rounded-[24px] flex items-center justify-center mb-3">
                      <Image
                        src={item.thumbnail || "/placeholder.png"}
                        alt={item.title || ""}
                        width={56}
                        height={56}
                      />
                    </div>
                    <div className="flex flex-col items-center flex-grow">
                      <h3 className="text-[20px] w-[258px] text-center font-bold text-[var(--color-dark-blue)] mb-3">
                        {item.title}
                      </h3>
                      <p className="text-[20px] font-bold text-[var(--color-dark-blue)] mb-6 text-center">
                        {cheapestPrice?.calculated_price
                          ? `${
                              cheapestPrice.calculated_price
                            } ${region?.currency_code.toUpperCase()}`
                          : "N/A"}
                      </p>
                      <button
                        className={`px-12 py-3.5 rounded-xl text-[18px] font-semibold ${theme.btnBgColor} text-white`}
                      >
                        {t.btn}
                      </button>
                    </div>
                  </LocalizedClientLink>
                </li>
              )
            })}
          </ul>
        )}
        {totalPages > 1 && (
          <Pagination
            data-testid="product-pagination"
            page={page}
            totalPages={totalPages}
          />
        )}
      </div>

      {recentlyViewedItems.length > 0 && (
        <div className="mx-auto w-[328px] lg:w-[1408px]">
          <p className="text-[18px] font-semibold mb-[24px]">Ви переглядали:</p>
          <div className="relative mb-[48px]">
            <ul className="flex flex-col lg:flex-row lg:flex-wrap justify-center items-center gap-[16px] bg-[#FFFFFF] rounded-[24px] px-[20px] py-[24px]">
              <div className="flex justify-center items-center mb-[8px]">
                <button
                  className={`lg:absolute lg:-left-[-30px] lg:top-1/2 lg:transform lg:-translate-y-1/2 min-w-[40px] h-[40px] border ${theme.borderColor} rounded-full flex items-center justify-center mr-[24px] lg:mr-0 cursor-pointer`}
                >
                  <MdArrowBackIosNew size={20} color={theme.mainColor} />
                </button>
                <button
                  className={`lg:absolute lg:-right-[-30px] lg:top-1/2 lg:transform lg:-translate-y-1/2 min-w-[40px] h-[40px] border ${theme.borderColor} rounded-full flex items-center justify-center cursor-pointer`}
                >
                  <MdArrowForwardIos size={20} color={theme.mainColor} />
                </button>
              </div>
              {recentlyViewedItems.map((item) => {
                const { cheapestPrice } = getProductPrice({ product: item })
                return (
                  <li
                    key={item.id}
                    className="flex flex-col items-center w-[222px] h-[195px] rounded-[24px]"
                  >
                    <LocalizedClientLink
                      href={`/products/${item.handle}`}
                      onClick={() => handleViewProduct(item.id!)}
                    >
                      <div className="min-w-[222px] min-h-[128px] bg-[#F0F0F0] rounded-[24px] flex items-center justify-center mb-3">
                        <Image
                          src={item.thumbnail || "/placeholder.png"}
                          alt={item.title || ""}
                          width={56}
                          height={56}
                        />
                      </div>
                      <div className="flex flex-col items-center flex-grow">
                        <h3 className="text-[14px] w-[194px] text-center font-bold text-[var(--color-dark-blue)] mb-[12px]">
                          {item.title}
                        </h3>
                        <p
                          className={`text-[16px] font-bold ${theme.textColor} text-center`}
                        >
                          {cheapestPrice?.calculated_price
                            ? `${
                                cheapestPrice.calculated_price
                              } ${region?.currency_code.toUpperCase()}`
                            : "N/A"}
                        </p>
                      </div>
                    </LocalizedClientLink>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      )}
    </section>
  )
}

export default ProductListSection
