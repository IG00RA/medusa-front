"use client"

import { useTranslations } from "@/lib/localization"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
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
  onFoundItemsCountChange?: (count: number) => void
  page: number
  regionData: HttpTypes.StoreRegion | undefined | null
  products: HttpTypes.StoreProduct[]
  allProducts: HttpTypes.StoreProduct[]
  count: number
}

const PRODUCT_LIMIT = 12

const ProductListSection = ({
  theme,
  onFoundItemsCountChange,
  page,
  regionData,
  products,
  allProducts,
  count,
}: ProductListSectionProps) => {
  const t = useTranslations().moreThanPrint.salesHits
  const [recentlyViewedItems, setRecentlyViewedItems] = useState<
    HttpTypes.StoreProduct[]
  >([])
  const [totalPages, setTotalPages] = useState<number>(1)
  const scrollRef = useRef<HTMLUListElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const updateScrollButtons = () => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 0)
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth)
  }

  useEffect(() => {
    updateScrollButtons()
    const el = scrollRef.current
    if (el) el.addEventListener("scroll", updateScrollButtons)
    return () => {
      if (el) el.removeEventListener("scroll", updateScrollButtons)
    }
  }, [])

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current
    if (!el) return
    const scrollAmount = 300
    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    })
  }
  const tSec = useTranslations().specificProduct.previewSection

  useEffect(() => {
    if (!regionData) return

    setTotalPages(Math.ceil(count / PRODUCT_LIMIT))

    if (onFoundItemsCountChange) {
      onFoundItemsCountChange(count)
    }
    const viewed = JSON.parse(
      localStorage.getItem("recentlyViewed") || "[]"
    ) as string[]

    const viewedProducts = allProducts.filter((p) => viewed.includes(p.id!))
    setRecentlyViewedItems(viewedProducts)
  }, [products, count, onFoundItemsCountChange, regionData])

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
        {products.length === 0 ? (
          <div className="text-center py-8">
            <h3 className="text-[20px] font-bold text-[#444444]">
              {t.notFound}
            </h3>
            <p className="text-[16px] text-[#A7A7A7] mt-2">{t.parameter}</p>
          </div>
        ) : (
          <ul className="mx-auto flex flex-col lg:flex-row lg:flex-wrap lg:justify-start items-stretch gap-[16px]">
            {products.map((item) => {
              const { cheapestPrice } = getProductPrice({ product: item })
              return (
                <li
                  key={item.id}
                  style={{
                    boxShadow: "0px 16px 40px 0px rgba(32, 47, 75, 0.06)",
                  }}
                  className="flex flex-col lg:w-[100%] lg:max-w-[calc(25%-12px)] w-[300px] rounded-[24px] bg-white border border-[#E8E8E8] py-6 px-6"
                >
                  <LocalizedClientLink
                    href={`/products/${item.handle}`}
                    onClick={() => handleViewProduct(item.id!)}
                    className="flex flex-col h-full"
                  >
                    <div className="flex flex-col h-full items-center">
                      <div className="min-w-[252px] w-[100%] h-[200px] bg-[#F0F0F0] rounded-[24px] flex items-center justify-center mb-3 overflow-hidden relative">
                        <Image
                          src={
                            item.thumbnail ||
                            "/pages/moreThanPrintPage/gamePad.png"
                          }
                          alt={item.title || ""}
                          width={252}
                          height={200}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col items-center flex-grow w-full">
                        <h3 className="text-[20px] w-[258px] text-center font-bold text-[var(--color-dark-blue)] mb-3">
                          {item.title}
                        </h3>

                        <p className="text-[20px] font-bold text-[var(--color-dark-blue)] mb-6 text-center mt-auto">
                          {cheapestPrice?.calculated_price_number
                            ? `${cheapestPrice.calculated_price_number} ${tSec.price}`
                            : "N/A"}
                        </p>
                        <button
                          className={`px-12 py-3.5 rounded-xl text-[18px] font-semibold ${theme.btnBgColor} text-white`}
                        >
                          {t.btn}
                        </button>
                      </div>
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
          <p className="text-[18px] font-semibold mb-[24px]">{t.view}</p>
          <div className="relative mb-[48px]">
            <div className="relative w-full">
              {/* Left Arrow */}
              {canScrollLeft && (
                <button
                  onClick={() => scroll("left")}
                  className={`absolute left-0 top-1/2 transform -translate-y-1/2 z-10 min-w-[40px] h-[40px] border ${theme.borderColor} bg-white rounded-full flex items-center justify-center cursor-pointer shadow-md`}
                >
                  <MdArrowBackIosNew size={20} color={theme.mainColor} />
                </button>
              )}

              {/* Right Arrow */}
              {canScrollRight && (
                <button
                  onClick={() => scroll("right")}
                  className={`absolute right-0 top-1/2 transform -translate-y-1/2 z-10 min-w-[40px] h-[40px] border ${theme.borderColor} bg-white rounded-full flex items-center justify-center cursor-pointer shadow-md`}
                >
                  <MdArrowForwardIos size={20} color={theme.mainColor} />
                </button>
              )}

              {/* Scrollable List */}
              <ul
                ref={scrollRef}
                className="flex overflow-x-auto gap-[16px] px-[20px] py-[24px] bg-[#FFFFFF] rounded-[24px] scroll-smooth scrollbar-hide"
              >
                {recentlyViewedItems.map((item) => {
                  const { cheapestPrice } = getProductPrice({ product: item })
                  return (
                    <li
                      key={item.id}
                      className="flex-shrink-0 flex flex-col items-center w-[222px] h-[195px] rounded-[24px]"
                    >
                      <LocalizedClientLink
                        href={`/products/${item.handle}`}
                        onClick={() => handleViewProduct(item.id!)}
                      >
                        <div className="min-w-[222px] h-[128px] bg-[#F0F0F0] rounded-[24px] flex items-center justify-center mb-3 overflow-hidden relative">
                          <Image
                            src={
                              item.thumbnail ||
                              "/pages/moreThanPrintPage/gamePad.png"
                            }
                            alt={item.title || ""}
                            width={222}
                            height={128}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex flex-col items-center flex-grow">
                          <h3 className="text-[14px] w-[194px] text-center font-bold text-[var(--color-dark-blue)] mb-[12px]">
                            {item.title}
                          </h3>
                          <p
                            className={`text-[16px] font-bold ${theme.textColor} text-center`}
                          >
                            {cheapestPrice?.calculated_price_number
                              ? `${cheapestPrice.calculated_price_number} ${tSec.price}`
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
        </div>
      )}
    </section>
  )
}

export default ProductListSection
