"use client"

import { useTranslations } from "@/lib/localization"
import { MdArrowBackIosNew, MdArrowForwardIos } from "react-icons/md"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { HttpTypes } from "@medusajs/types"

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

  const displayCategories =
    product_categories.length > 0
      ? product_categories.map((cat) => cat.name)
      : [
          t.firstItem,
          t.secondItem,
          t.thirdItem,
          t.fourthItem,
          t.fifthItem,
          t.sixthItem,
        ]

  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams)
    params.set(name, value)
    return params.toString()
  }

  const handleCategoryClick = (category: string) => {
    onCategoryChange(category)
    router.push(`${pathname}?${createQueryString("category", category)}`)
  }

  const handleClearCategory = () => {
    onCategoryChange(undefined)
    const params = new URLSearchParams(searchParams)
    params.delete("category")
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <section
      className={`flex flex-col items-center ${theme.bgColor} px-[16px] py-[24px] lg:pt-[80px]`}
    >
      <div
        className={`relative flex flex-wrap w-[328px] h-[296px] lg:w-[1408px] lg:h-[100px] items-center justify-center gap-[12px] py-[20px] border ${theme.borderColor} rounded-[24px] bg-[#ffffff]`}
      >
        {displayCategories.map((item, idx) => (
          <button
            type="button"
            key={idx}
            onClick={() => handleCategoryClick(item)}
            className={`flex items-center justify-center w-[142px] h-[56px] text-[14px] rounded-xl cursor-pointer border ${
              theme.borderColor
            } ${
              activeCategory === item
                ? `${theme.btnBgColor} text-white border-[${theme.mainColor}]`
                : `${theme.borderColor} text-black`
            }`}
          >
            {item}
          </button>
        ))}
        <button
          type="button"
          onClick={handleClearCategory}
          className={`flex items-center justify-center w-[142px] h-[56px] text-[14px] rounded-xl cursor-pointer border ${
            theme.borderColor
          } ${
            !activeCategory
              ? `${theme.btnBgColor} text-white border-[${theme.mainColor}]`
              : `${theme.borderColor} text-black`
          }`}
        >
          All Categories
        </button>
        <div className="flex justify-center items-center mt-3">
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
      </div>
    </section>
  )
}

export default CategorySelector
