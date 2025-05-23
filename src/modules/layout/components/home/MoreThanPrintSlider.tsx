"use client"

import { useEffect, useState } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination } from "swiper/modules"
import { Swiper as SwiperInstance } from "swiper"
import { MdArrowForwardIos, MdArrowBackIosNew } from "react-icons/md"

import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import { useTranslations } from "@/lib/localization"

interface ArrowProps {
  onClick: () => void
}

const PrevArrow = ({ onClick }: ArrowProps) => {
  return (
    <button
      onClick={onClick}
      className="absolute z-10 left-[13px] top-1/2 -translate-y-[50%] w-10 h-10 bg-white border border-[var(--color-main-blue)] text-[var(--color-main-blue)] rounded-full flex items-center justify-center shadow-md hover:bg-[var(--color-main-blue)] hover:text-white transition cursor-pointer"
      aria-label="Назад"
    >
      <MdArrowBackIosNew size={20} />
    </button>
  )
}

const NextArrow = ({ onClick }: ArrowProps) => {
  return (
    <button
      onClick={onClick}
      className="absolute z-10 right-[13px] top-1/2 -translate-y-[50%] w-10 h-10 bg-white border border-[var(--color-main-blue)] text-[var(--color-main-blue)] rounded-full flex items-center justify-center shadow-md hover:bg-[var(--color-main-blue)] hover:text-white transition cursor-pointer"
      aria-label="Вперед"
    >
      <MdArrowForwardIos size={20} />
    </button>
  )
}

const MoreThanPrintSlider = () => {
  const t = useTranslations().moreThanPrint.hero
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [swiperInstance, setSwiperInstance] = useState<SwiperInstance | null>(
    null
  )

  const sliderItems = [
    {
      title: t.sliderFirstItem,
      bgColor: "bg-[#DDE9FF]",
      textColor: "text-[var(--color-main-blue)]",
    },
    {
      title: t.sliderSecondItem,
      bgColor: "bg-[#FFEDED]",
      textColor: "text-[#F95F62]",
    },
    {
      title: t.sliderThirdItem,
      bgColor: "bg-[#FFF7E7]",
      textColor: "text-[#F5A623]",
    },
    {
      title: t.sliderFirstItem,
      bgColor: "bg-[#DDE9FF]",
      textColor: "text-[var(--color-main-blue)]",
    },
    {
      title: t.sliderSecondItem,
      bgColor: "bg-[#FFEDED]",
      textColor: "text-[#F95F62]",
    },
    {
      title: t.sliderThirdItem,
      bgColor: "bg-[#FFF7E7]",
      textColor: "text-[#F5A623]",
    },
  ]

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const slidesPerView = isMobile ? 1 : 3
  const slidesPerGroup = isMobile ? 1 : 3

  return (
    <div className="bg-white rounded-[32px] shadow-md w-[328px] h-[430px] lg:w-[786px] lg:h-[430px] mx-auto p-[24px] flex justify-center items-center">
      <div className="rounded-[24px] w-[310px] h-[402px] lg:w-[738px] lg:h-[342px] relative px-[64px] py-[31px] bg-[#F0F0F0]">
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={8}
          slidesPerView={slidesPerView}
          slidesPerGroup={slidesPerGroup}
          loop={false}
          speed={500}
          navigation={{
            prevEl: ".swiper-prev",
            nextEl: ".swiper-next",
          }}
          pagination={{
            el: ".swiper-pagination",
            clickable: true,
            renderBullet: (index, className) => {
              const multiplier = isMobile ? 1 : 3
              return `
                <span class="${className} w-3 h-3 rounded-full transition ${
                currentSlide === index * multiplier
                  ? "bg-[var(--color-main-blue)] w-4 h-4 mt-[48px]"
                  : "bg-gray-300 mt-[50px]"
              }"></span>
              `
            },
          }}
          onSlideChange={(swiper) => setCurrentSlide(swiper.activeIndex)}
          onSwiper={(swiper: SwiperInstance) => setSwiperInstance(swiper)}
          className="h-[280px]"
        >
          {sliderItems.map((item, index) => (
            <SwiperSlide key={index}>
              <div className="px-1">
                <div
                  className={`h-[280px] rounded-xl flex items-center justify-center text-center text-lg font-semibold px-[27px] ${item.bgColor} ${item.textColor}`}
                >
                  {item.title}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <PrevArrow onClick={() => swiperInstance?.slidePrev()} />
        <NextArrow onClick={() => swiperInstance?.slideNext()} />
        <div className="swiper-pagination custom-dots"></div>
      </div>
    </div>
  )
}

export default MoreThanPrintSlider
