"use client"

import { useState, useEffect, useCallback } from "react"
import { HiMiniMagnifyingGlass } from "react-icons/hi2"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { SortOptions } from "@lib/data/products"
import { useTranslations } from "@/lib/localization"
import { debounce } from "lodash"

interface TitleFilterSectionProps {
  theme: {
    mainColor: string
    bgColor: string
    btnBgColor: string
    borderColor: string
  }
  searchQuery: string
  onSearchChange: (query: string) => void
  activeFilter: number
  onFilterChange: (index: number) => void
  priceRange: { min: number; max: number }
  onPriceRangeChange: (min: number, max: number) => void
  onResetFilters: () => void
  foundItemsCount: number
}

const TitleFilterSection = ({
  theme,
  searchQuery: initialSearchQuery,
  onSearchChange,
  activeFilter,
  onFilterChange,
  priceRange,
  onPriceRangeChange,
  onResetFilters,
  foundItemsCount,
}: TitleFilterSectionProps) => {
  const t = useTranslations().product.filtersSection
  const [minPrice, setMinPrice] = useState<number>(priceRange.min)
  const [maxPrice, setMaxPrice] = useState<number>(priceRange.max)
  const [localSearchQuery, setLocalSearchQuery] =
    useState<string>(initialSearchQuery)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentSortBy = searchParams.get("sortBy") as SortOptions | null

  const debouncedSearch = useCallback(
    debounce((query: string) => {
      onSearchChange(query)
      router.push(`${pathname}?${createQueryString({ query })}`)
    }, 300),
    [onSearchChange, router, pathname]
  )

  const handleSearch = (query: string) => {
    setLocalSearchQuery(query)
    debouncedSearch(query)
  }

  useEffect(() => {
    setMinPrice(priceRange.min)
    setMaxPrice(priceRange.max)
  }, [priceRange])

  useEffect(() => {
    setLocalSearchQuery(initialSearchQuery)
  }, [initialSearchQuery])

  const filters: {
    label: string
    value: SortOptions | "popular" | "new" | "personalized"
  }[] = [
    { label: t.sortingFilters.firstItem, value: "popular" },
    { label: t.sortingFilters.secondItem, value: "new" },
    { label: t.sortingFilters.thirdItem, value: "price_asc" },
    { label: t.sortingFilters.fourthItem, value: "price_desc" },
    { label: t.sortingFilters.fifthItem, value: "personalized" },
  ]

  const createQueryString = (params: Record<string, string>) => {
    const newParams = new URLSearchParams(searchParams)
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value)
      } else {
        newParams.delete(key)
      }
    })
    return newParams.toString()
  }

  const handleApplyPriceFilter = () => {
    onPriceRangeChange(minPrice, maxPrice)
    router.push(
      `${pathname}?${createQueryString({
        minPrice: minPrice.toString(),
        maxPrice: maxPrice.toString(),
      })}`
    )
  }

  const handleFilter = (index: number) => {
    onFilterChange(index)
    const sortValue = filters[index].value
    router.push(`${pathname}?${createQueryString({ sortBy: sortValue })}`)
  }

  const handleReset = () => {
    onResetFilters()
    setLocalSearchQuery("")
    setMinPrice(0)
    setMaxPrice(0)
    router.push(pathname)
  }

  return (
    <section className={`mx-auto px-[16px] pb-[48px] ${theme.bgColor}`}>
      <div className="mb-[16px] lg:w-[1408px] mx-auto">
        <h1 className="text-[#444444] text-[24px] font-semibold mb-[14px]">
          {t.title}
        </h1>
        <div
          className={`w-[100px] h-[3px] bg-[${theme.mainColor}] mb-[28px]`}
        ></div>
        <nav className="flex gap-[24px] items-center text-[16px] text-[#A7A7A7] mb-[28px]">
          <span>{t.navigationFirstItem}</span>
          <span className="text-[#444444]">{">"}</span>
          <span className="text-[#444444]">{t.navigationSecondItem}</span>
        </nav>
        <p className="text-[16px] text-[#444444]">{t.description}</p>
      </div>

      <div className="lg:w-[1408px] mx-auto">
        <div
          className={`flex items-center gap-[16px] w-[328px] mb-[22px] lg:w-[849px] mx-auto lg:mx-0 border ${theme.borderColor} rounded-xl py-[16px] px-[30px] bg-[#FFFFFF]`}
        >
          <HiMiniMagnifyingGlass size={28} color={`${theme.mainColor}`} />
          <input
            type="text"
            className="color-[#A7A7A7] text-[18px] focus:outline-none w-full"
            placeholder={t.placeholderInput}
            value={localSearchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="mb-[12px] lg:w-[1408px] mx-auto">
        <p className="text-[18px] font-semibold mb-[22px]">{t.sortingTitle}</p>
        <div className="flex flex-wrap gap-[12px]">
          {filters.map((item, idx) => (
            <button
              type="button"
              key={idx}
              onClick={() => handleFilter(idx)}
              className={`flex items-center justify-center py-[14.5px] lg:py-[10px] px-[24px] h-[56px] text-[18px] rounded-xl lg:rounded-[24px] cursor-pointer border ${
                theme.borderColor
              } ${
                currentSortBy === item.value
                  ? `${theme.btnBgColor} text-white border-[${theme.mainColor}]`
                  : `${theme.borderColor} text-black bg-[#ffffff]`
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4 lg:flex lg:items-center lg:gap-[12px] lg:w-[1408px] mx-auto">
        <div className="flex items-center gap-[12px] mb-[18px] lg:mb-[0px]">
          <p className="text-[18px] font-semibold">{t.priceName}</p>
          <span className="text-[18px] font-medium">{t.from}</span>
          <input
            type="number"
            className={`w-[95px] h-[47px] py-[10px] px-[20px] border ${theme.borderColor} bg-[#ffffff] rounded-xl lg:rounded-[24px] text-[18px] text-[#444444]`}
            value={minPrice}
            onChange={(e) => setMinPrice(Number(e.target.value))}
            min={0}
          />
          <span className="text-[18px] font-medium">{t.to}</span>
          <input
            type="number"
            className={`w-[95px] h-[47px] py-[10px] px-[20px] border ${theme.borderColor} bg-[#ffffff] rounded-xl lg:rounded-[24px] text-[18px] text-[#444444]`}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            min={0}
          />
        </div>

        <div className="flex gap-2">
          <button
            className={`rounded-xl lg:rounded-[24px] ${theme.btnBgColor} text-white px-[24px] py-[14.5px] lg:py-[10px] text-[18px]`}
            onClick={handleApplyPriceFilter}
          >
            {t.btnApply}
          </button>
          <button
            className={`rounded-xl lg:rounded-[24px] bg-[#ffffff] text-[#444444] px-[24px] py-[14.5px] lg:py-[10px] text-[18px] border ${theme.borderColor}`}
            onClick={handleReset}
          >
            {t.btnReset}
          </button>
        </div>
      </div>

      <p className="text-sm text-gray-500 lg:w-[1408px] mx-auto">
        {t.quantityFound} {foundItemsCount}
      </p>
    </section>
  )
}

export default TitleFilterSection
