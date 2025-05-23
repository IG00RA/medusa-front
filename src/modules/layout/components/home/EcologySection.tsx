"use client"
import { useTranslations } from "@/lib/localization"
import Image from "next/image"

const EcologySection = () => {
  const t = useTranslations().moreThanPrint.ecology
  const items = [
    {
      title: t.bio.title,
      desc: t.bio.description,
      image: "/pages/moreThanPrintPage/plant.png",
    },
    {
      title: t.safety.title,
      desc: t.safety.description,
      image: "/pages/moreThanPrintPage/trash.png",
    },
    {
      title: t.eco.title,
      desc: t.eco.description,
      image: "/pages/moreThanPrintPage/child.png",
    },
  ]

  return (
    <section className="bg-[#F7FCF7] py-[48px] lg:py-[112px]">
      <div className="max-w-[1408px] mx-auto flex flex-col items-center">
        <h2 className="text-[32px] lg:text-[40px] font-bold text-[var(--color-dark-blue)] leading-[1.2] text-center">
          {t.ecologyTitle}
        </h2>

        <div className="w-[200px] h-[3px] bg-[#69C269] mt-[25px] mb-[25px]"></div>

        <p className="text-[14px] lg:text-[18px] font-regular mb-[12px] text-center">
          {t.ecologyDescription}
        </p>

        <p className="text-[14px] lg:text-[18px] font-regular">
          {t.ecologyDescription2}
        </p>

        <ul className="flex flex-col lg:flex-row gap-16 mt-16">
          {items.map((item, index) => (
            <li key={index} className="flex flex-col items-center w-[322px]">
              <div className="w-[120px] h-[120px] bg-[#E8F5E8] rounded-full flex items-center justify-center mb-6">
                <Image src={item.image} alt="ecology" width={34} height={34} />
              </div>
              <h3 className="text-[18px] lg:text-[20px] font-bold text-[var(--color-dark-blue)] mb-3">
                {item.title}
              </h3>
              <p className="text-[16px] lg:text-[18px] font-regular text-[#555555]">
                {item.desc}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default EcologySection
