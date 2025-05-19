// src/modules/products/templates/description-section.tsx
"use client"

import { useState } from "react"
import Image from "next/image"
import { HttpTypes } from "@medusajs/types"
import { useTranslations } from "@/lib/localization"
import { IoPlaySharp } from "react-icons/io5"
import ProductTabs from "@modules/products/components/product-tabs"

interface DescriptionSectionProps {
  theme: {
    mainColor: string
    textColor: string
    bgColor: string
    btnBgColor: string
    borderColor: string
  }
  product: HttpTypes.StoreProduct
}

const DescriptionSection = ({ theme, product }: DescriptionSectionProps) => {
  const [activeBtn, setActiveBtn] = useState(0)
  const t = useTranslations().specificProduct.descriptionSection
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
        <div>
          <h2 className="text-[18px] text-[var(--color-dark-blue)] font-bold mb-[16px]">
            {data.title}
          </h2>
          {data.descriptions.map((desc, index) => (
            <p key={index} className="mb-[12px] lg:text-[16px]">
              {Object.values(desc)[0]}
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
            <div className="w-[280px] lg:w-[410px] h-[200px] bg-[#F0F0F0] rounded-xl flex items-center justify-center">
              <div
                className={`bg-[#A1BBED] w-[80px] h-[80px] pl-[6px] rounded-full flex items-center justify-center`}
              >
                <IoPlaySharp size={40} color="#FFFFFF" />
              </div>
            </div>
            <div className="flex space-x-2 lg:gap-[26px] mt-2 lg:mt-0">
              <div className="w-1/3 lg:w-[150px] h-[61px] lg:h-[200px] bg-[#F0F0F0] rounded-md"></div>
              <div className="w-1/3 lg:w-[150px] h-[61px] lg:h-[200px] bg-[#F0F0F0] rounded-md"></div>
              <div className="w-1/3 lg:w-[150px] h-[61px] lg:h-[200px] bg-[#F0F0F0] rounded-md"></div>
            </div>
          </div>
        </div>
        <div className="mb-6">
          <h3 className="text-[18px] text-[var(--color-dark-blue)] font-bold mb-[16px] mt-[24px]">
            {t.alsoInterested}
          </h3>
          <ProductTabs product={product} />
        </div>
      </div>
    </section>
  )
}

export default DescriptionSection
