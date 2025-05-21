"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { HttpTypes } from "@medusajs/types"
import { useTranslations } from "@/lib/localization"
import { IoPlaySharp } from "react-icons/io5"
import CategoryProductsSection from "../category-products-section"

interface DescriptionSectionProps {
  theme: {
    mainColor: string
    textColor: string
    bgColor: string
    btnBgColor: string
    borderColor: string
  }
  product: HttpTypes.StoreProduct
  categories: HttpTypes.StoreProductCategory[]
  products: HttpTypes.StoreProduct[]
}

const DescriptionSection = ({
  theme,
  product,
  products,
  categories,
}: DescriptionSectionProps) => {
  const [activeBtn, setActiveBtn] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isVideoModal, setIsVideoModal] = useState(false)
  const [isContentLoaded, setIsContentLoaded] = useState(false)
  const t = useTranslations().specificProduct.descriptionSection
  const tSec = useTranslations().specificProduct.previewSection
  const hasPersonalization = product?.tags?.some(
    (tag) => tag.value === "personalization"
  )

  const data = {
    title: t.title,
    descriptions: [
      { first: t.descriptions.first },
      { second: t.descriptions.second },
      { third: t.descriptions.third },
      { forth: t.descriptions.forth },
    ],
    buttons: [
      { firstBtn: t.buttons.firstBtn },
      { secondBtn: t.buttons.secondBtn },
      { thirdBtn: t.buttons.thirdBtn },
    ],
    listTitle: t.listTitle,
    list: [
      {
        title: t.list.firstTitle,
        description: t.list.firstDescription,
        image: "/pages/moreThanPrintPage/leaf.png",
      },
      {
        title: t.list.secondTitle,
        description: t.list.secondDescription,
        image: "/pages/moreThanPrintPage/paint.png",
      },
      {
        title: t.list.thirdTitle,
        description: t.list.thirdDescription,
        image: "/pages/moreThanPrintPage/gear.png",
      },
    ],
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isModalOpen) {
        closeModal()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isModalOpen])

  useEffect(() => {
    if (isModalOpen) {
      setIsContentLoaded(false)
    }
  }, [isModalOpen, selectedImage, isVideoModal])

  const openModal = (image: string | null, isVideo: boolean = false) => {
    setSelectedImage(image)
    setIsVideoModal(isVideo)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedImage(null)
    setIsVideoModal(false)
  }

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      closeModal()
    }
  }

  const handleContentLoad = () => {
    setIsContentLoaded(true)
  }

  return (
    <section className="flex justify-center py-[32px] px-[16px] my-[64px] rounded-xl text-sm text-[#555555] mx-auto">
      <div className="w-[328px] lg:w-[1248px] rounded-xl py-[32px] lg:py-[48px] px-[24px] bg-[#FFFFFF]">
        <div className="flex flex-wrap gap-[12px] mb-[24px]">
          {data.buttons.map((btn, index) => {
            const isActive = index === activeBtn
            return (
              <button
                key={index}
                onClick={() => setActiveBtn(index)}
                className={`text-[16px] px-[14px] lg:px-[80px] py-[12px] lg:py-[16px] rounded-xl font-regular transition-colors ${
                  isActive
                    ? `${theme.btnBgColor} text-white`
                    : "bg-white border border-gray-300 text-gray-700"
                }`}
              >
                {Object.values(btn)[0]}
              </button>
            )
          })}
        </div>

        {activeBtn === 0 && (
          <>
            <div>
              <h2 className="text-[18px] text-[var(--color-dark-blue)] font-bold mb-[16px]">
                {product.title}
              </h2>
              {product?.description?.split("\n").map((paragraph, index) => (
                <p key={index} className="mb-[12px] lg:text-[16px]">
                  {paragraph}
                </p>
              ))}
            </div>
            <div className="mb-6">
              <h3 className="text-[18px] text-[var(--color-dark-blue)] font-bold mb-[16px] mt-[24px]">
                {data.listTitle}
              </h3>
              <ul className="flex flex-col lg:flex-row gap-[16px] lg:gap-[80px]">
                {data.list.map((item, index) => (
                  <li key={index} className="flex items-center gap-[12px]">
                    <div
                      className={`w-[60px] h-[60px] rounded-full flex items-center justify-center ${theme.bgColor}`}
                    >
                      <Image
                        src={item.image}
                        alt={item.title}
                        width={24}
                        height={24}
                      />
                    </div>
                    <div>
                      <p className="text-[var(--color-dark-blue)] text-[16px] font-bold mb-[4px]">
                        {item.title}
                      </p>
                      <p>{item.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mb-6 border-b-[1px] border-[#E0E0E0] pb-[24px]">
              <h3 className="text-[18px] text-[var(--color-dark-blue)] font-bold mb-[16px] lg:mb-[24px] mt-[24px]">
                {t.videoTitle}
              </h3>
              <div className="lg:flex lg:gap-[26px] items-center">
                {product.mid_code && (
                  <div
                    className="w-[280px] lg:w-[410px] h-[200px] bg-[#F0F0F0] rounded-xl flex items-center justify-center cursor-pointer overflow-hidden relative"
                    onClick={() =>
                      openModal(
                        product.mid_code
                          ? `https://img.youtube.com/vi/${product.mid_code}/hqdefault.jpg`
                          : null,
                        true
                      )
                    }
                  >
                    {product.mid_code ? (
                      <>
                        <Image
                          src={`https://img.youtube.com/vi/${product.mid_code}/hqdefault.jpg`}
                          alt="Video Thumbnail"
                          width={410}
                          height={200}
                          className="w-full h-full object-cover rounded-xl"
                        />
                        <div
                          className={`bg-[#A1BBED] w-[80px] h-[80px] pl-[6px] rounded-full flex items-center justify-center absolute top-1/2 left-1/2 transform -translate-x-[50%] -translate-y-[50%]`}
                        >
                          <IoPlaySharp size={40} color="#FFFFFF" />
                        </div>
                      </>
                    ) : (
                      <div
                        className={`bg-[#A1BBED] w-[80px] h-[80px] pl-[6px] rounded-full flex items-center justify-center`}
                      >
                        <IoPlaySharp size={40} color="#FFFFFF" />
                      </div>
                    )}
                  </div>
                )}
                <div className="mt-2 lg:mt-0 w-[280px] lg:w-[410px] overflow-x-auto">
                  <div className="flex gap-[8px] lg:gap-[26px] flex-nowrap snap-x snap-mandatory">
                    {(product.images || []).map((img, index) => (
                      <div
                        key={index}
                        className="w-[88px] lg:w-[150px] h-[61px] lg:h-[200px] bg-[#F0F0F0] rounded-md overflow-hidden cursor-pointer flex-shrink-0"
                        onClick={() => openModal(img.url, false)}
                      >
                        <Image
                          src={img.url}
                          alt={`Product image ${index + 1}`}
                          width={150}
                          height={200}
                          className="w-full h-full object-cover rounded-md"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeBtn === 1 && (
          <div className="mt-[16px]">
            <h3 className="font-bold text-[18px] mb-[8px] text-[var(--color-dark-blue)]">
              {tSec.characteristicsList.title}
            </h3>
            <ul className="flex flex-col gap-[8px] text-[#555555] text-[16px]">
              <li>
                • {tSec.characteristicsList.firstItem} {product.material}
              </li>
              <li>
                • {tSec.characteristicsList.secondItem} {product.width} x{" "}
                {product.length} x {product.height}{" "}
                {tSec.characteristicsList.cm}
              </li>
              <li>
                • {tSec.characteristicsList.thirdItem} {product.weight}{" "}
                {tSec.characteristicsList.weight}
              </li>
              <li>
                •{" "}
                {hasPersonalization
                  ? `${tSec.characteristicsList.fourthItem} ${tSec.characteristicsList.personalization}`
                  : `${tSec.characteristicsList.fourthItem} ${tSec.characteristicsList.noPersonalization}`}
              </li>
            </ul>
          </div>
        )}

        {activeBtn === 2 && <div>{/* Empty tab for now */}</div>}

        <div className="mb-6">
          <h3 className="text-[18px] text-[var(--color-dark-blue)] font-bold mb-[16px] mt-[24px]">
            {t.alsoInterested}
          </h3>
          <CategoryProductsSection
            theme={theme}
            categories={categories}
            products={products}
            product={product}
          />
          {/* <ProductTabs product={product} /> */}
        </div>

        {isModalOpen && (selectedImage || isVideoModal) && (
          <div
            className="fixed inset-0 custom-overlay bg-opacity-25 flex items-center justify-center z-50"
            onClick={handleOverlayClick}
          >
            <div className="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center">
              {!isContentLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 border-4 border-t-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
                </div>
              )}
              {isContentLoaded && (
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 text-white text-2xl font-bold p-1 pl-2 pr-2 rounded-full border border-white bg-zinc-600"
                >
                  ×
                </button>
              )}
              {isVideoModal && product.mid_code ? (
                <iframe
                  width="800"
                  height="450"
                  src={`https://www.youtube.com/embed/${product.mid_code}?autoplay=1`}
                  title="Product Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-[80vw] h-[60vh] rounded-xl"
                  onLoad={handleContentLoad}
                />
              ) : (
                selectedImage && (
                  <Image
                    src={selectedImage}
                    alt="Full-screen product image"
                    width={1200}
                    height={800}
                    className="w-full h-full object-contain"
                    onLoad={handleContentLoad}
                  />
                )
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default DescriptionSection
