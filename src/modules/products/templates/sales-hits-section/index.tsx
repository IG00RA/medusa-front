"use client"

import { HttpTypes } from "@medusajs/types"
import { MdArrowForwardIos, MdArrowBackIosNew } from "react-icons/md"
import { useTranslations } from "@/lib/localization"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import Image from "next/image"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
import ProductPrice from "../../components/product-price"

interface SalesHitsSectionProps {
  theme: {
    mainColor: string
    bgColor: string
    btnBgColor: string
    borderColor: string
  }
  products: HttpTypes.StoreProduct[]
}

const SalesHitsSection = ({ theme, products }: SalesHitsSectionProps) => {
  const defaultTheme = {
    mainColor: "var(--color-main-blue)",
    bgColor: "bg-[#F9F9F9]",
    btnBgColor: "bg-[var(--color-main-blue)]",
    borderColor: "border-[var(--color-main-blue)]",
  }

  const t = useTranslations().moreThanPrint.salesHits
  const tSec = useTranslations().specificProduct.previewSection

  const mergedTheme = { ...defaultTheme, ...theme }

  const hitProducts = products.filter((product) =>
    product.tags?.some((tag) => tag.value === "hit")
  )

  return (
    <section className="py-[64px] px-[16px] lg:py-[112px] bg-[#F9F9F9] relative">
      <div className="max-w-[1408px] mx-auto flex flex-col lg:flex-wrap items-center mb-[64px]">
        <h2 className="text-[32px] font-bold text-[var(--color-dark-blue)] leading-[1.2] text-center">
          {t.title}
        </h2>
        <div
          className={`w-[100px] h-[3px] ${mergedTheme.btnBgColor} mt-[8px]`}
        ></div>
      </div>
      <div className="relative max-w-[932px] mx-auto">
        <Swiper
          modules={[Navigation]}
          spaceBetween={16}
          slidesPerView={1}
          navigation={{
            nextEl: ".swiper-button-nextes",
            prevEl: ".swiper-button-previous",
          }}
          breakpoints={{
            1024: {
              slidesPerView: 3,
              spaceBetween: 16,
            },
          }}
          className="mySwiper !flex !items-stretch"
        >
          {hitProducts.map((product) => (
            <SwiperSlide key={product.id} className="!h-auto">
              <div
                style={{
                  boxShadow: "0px 16px 40px 0px rgba(32, 47, 75, 0.06)",
                }}
                className="flex flex-col items-center w-[300px] h-full rounded-[24px] bg-white border border-[#E8E8E8] py-6 px-6"
              >
                <LocalizedClientLink
                  href={`/products/${product.handle}`}
                  className="flex flex-col h-full"
                >
                  <div className="min-w-[252px] h-[200px] bg-[#F0F0F0] rounded-[24px] flex items-center justify-center mb-3 overflow-hidden">
                    <Image
                      src={
                        product.thumbnail ||
                        "/pages/moreThanPrintPage/gamePad.png"
                      }
                      alt={product.title || ""}
                      width={252}
                      height={200}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col items-center justify-between flex-grow">
                    <h3 className="text-[20px] w-[258px] text-center font-bold text-[var(--color-dark-blue)] mb-3">
                      {product.title}
                    </h3>
                    <div className="text-[20px] font-bold text-[var(--color-dark-blue)] mb-6 text-center mt-auto">
                      <ProductPrice product={product} />
                    </div>
                    <button className="px-12 py-3.5 rounded-xl text-[18px] font-semibold bg-[#f0ad4e] text-white">
                      {tSec.btnBuy}
                    </button>
                  </div>
                </LocalizedClientLink>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="flex justify-center lg:justify-between items-center mt-6 lg:mt-0 lg:absolute lg:inset-0 lg:top-1/2 lg:transform lg:-translate-y-1/2 w-full pointer-events-none">
          <button
            className={`swiper-button-previous pointer-events-auto lg:absolute lg:-left-[64px] min-w-[40px] h-[40px] border ${mergedTheme.borderColor} rounded-full flex items-center justify-center mr-[24px] lg:mr-0 bg-white bottom-[-20px]`}
          >
            <MdArrowBackIosNew size={20} color={mergedTheme.mainColor} />
          </button>
          <button
            className={`swiper-button-nextes pointer-events-auto lg:absolute lg:-right-[60px] min-w-[40px] h-[40px] border ${mergedTheme.borderColor} rounded-full flex items-center justify-center bg-white bottom-[-20px]`}
          >
            <MdArrowForwardIos size={20} color={mergedTheme.mainColor} />
          </button>
        </div>
      </div>
    </section>
  )
}

export default SalesHitsSection
