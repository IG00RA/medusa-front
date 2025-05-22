"use client"

import { useTranslations, useLocale } from "@/lib/localization"
import { MdArrowBackIosNew, MdArrowForwardIos } from "react-icons/md"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useRef, useState, useEffect } from "react"

interface CategorySelectorProps {
  theme: {
    mainColor: string
    bgColor: string
    btnBgColor: string
    borderColor: string
  }
  product_categories: HttpTypes.StoreProductCategory[]
  activeCategory?: string
  onCategoryChange: (category: string | undefined) => void
}

const CategorySelector = ({
  theme,
  product_categories,
  activeCategory,
  onCategoryChange,
}: CategorySelectorProps) => {
  const t = useTranslations().product.categories
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [showScrollButtons, setShowScrollButtons] = useState(false)

  const locale = useLocale()

  // Функція для отримання локалізованої назви категорії
  const getCategoryName = (
    category: HttpTypes.StoreProductCategory | { name: string; handle: string }
  ): string => {
    if (
      "metadata" in category &&
      category.metadata &&
      category.metadata[locale]
    ) {
      return category.metadata[locale] as string
    }
    return category.name
  }

  // Функція для створення query string
  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams)
    params.set(name, value)
    return params.toString()
  }

  // Обробка кліку по категорії
  const handleCategoryClick = (
    categoryHandle: string,
    categoryName: string
  ) => {
    onCategoryChange(categoryName)
    router.push(`${pathname}?${createQueryString("category", categoryHandle)}`)
  }

  // Функції для прокручування
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: "smooth" })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: "smooth" })
    }
  }

  // Фільтрація категорій верхнього рівня
  const topLevelCategories = product_categories.filter(
    (category) =>
      !category.handle.includes("/") && category.parent_category_id === null
  )

  // Список категорій для відображення
  const displayCategories =
    topLevelCategories.length > 0
      ? topLevelCategories
      : [
          { name: t.firstItem, handle: "category1" },
          { name: t.secondItem, handle: "category2" },
          { name: t.thirdItem, handle: "category3" },
          { name: t.fourthItem, handle: "category4" },
          { name: t.fifthItem, handle: "category5" },
          { name: t.sixthItem, handle: "category6" },
        ]

  // Перевірка необхідності кнопок прокручування
  useEffect(() => {
    const checkScroll = () => {
      if (scrollContainerRef.current) {
        const { scrollWidth, clientWidth } = scrollContainerRef.current
        setShowScrollButtons(scrollWidth > clientWidth)
      }
    }

    checkScroll() // Перевірка при завантаженні
    window.addEventListener("resize", checkScroll) // Перевірка при зміні розміру вікна

    return () => window.removeEventListener("resize", checkScroll)
  }, [displayCategories])

  return (
    <section
      className={`flex flex-col items-center ${theme.bgColor} px-[16px] py-[24px] lg:pt-[80px]`}
    >
      <div className="relative w-[328px] lg:w-[1408px]">
        {/* Кнопка ← */}
        {showScrollButtons && (
          <button
            type="button"
            onClick={scrollLeft}
            className={`absolute left-3 top-1/2 transform -translate-y-[50%] min-w-[40px] h-[40px] border ${theme.borderColor} rounded-full flex items-center justify-center cursor-pointer z-10 bg-white`}
          >
            <MdArrowBackIosNew size={20} color={theme.mainColor} />
          </button>
        )}
        <div
          className={`relative w-[328px] lg:w-[1408px]  py-[20px] border ${
            theme.borderColor
          } rounded-[24px] bg-[#ffffff] ${
            showScrollButtons ? "px-[60px]" : "px-[20px]"
          }`}
        >
          {/* Смуга з категоріями */}
          <div
            ref={scrollContainerRef}
            className={`flex flex-nowrap items-center justify-center overflow-x-auto scrollbar-hide gap-[12px]`}
            style={{ scrollBehavior: "smooth" }}
          >
            {displayCategories.map((category, idx) => (
              <LocalizedClientLink
                key={idx}
                href={`/categories/${category.handle}`}
                onClick={() =>
                  handleCategoryClick(
                    category.handle,
                    getCategoryName(category)
                  )
                }
                className={`flex-shrink-0 min-w-[142px] h-[56px] text-[14px] rounded-xl cursor-pointer border ${
                  theme.borderColor
                } ${
                  activeCategory === getCategoryName(category)
                    ? `${theme.btnBgColor} text-white border-[${theme.mainColor}]`
                    : `${theme.borderColor} text-black`
                } text-center overflow-hidden text-ellipsis whitespace-nowrap px-[8px] flex items-center justify-center`}
                title={getCategoryName(category)}
              >
                {getCategoryName(category)}
              </LocalizedClientLink>
            ))}
          </div>
        </div>
        {/* Кнопка → */}
        {showScrollButtons && (
          <button
            type="button"
            onClick={scrollRight}
            className={`absolute right-3 top-1/2 transform -translate-y-[50%] min-w-[40px] h-[40px] border ${theme.borderColor} rounded-full flex items-center justify-center cursor-pointer z-10 bg-white`}
          >
            <MdArrowForwardIos size={20} color={theme.mainColor} />
          </button>
        )}
      </div>
    </section>
  )
}

export default CategorySelector
