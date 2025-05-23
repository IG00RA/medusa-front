"use client"

import { useTranslations } from "@/lib/localization"
import Image from "next/image"
import { PrimaryButton, SecondaryButton } from "../buttons"

const PrintOnDemandSection = () => {
  const t = useTranslations().moreThanPrint.printOnDemand

  const items = [
    {
      title: t.firstItem.title,
      desc: t.firstItem.description,
      image: "/pages/moreThanPrintPage/gamePad.png",
    },
    {
      title: t.secondItem.title,
      desc: t.secondItem.description,
      image: "/pages/moreThanPrintPage/gift.png",
    },
    {
      title: t.thirdItem.title,
      desc: t.thirdItem.description,
      image: "/pages/moreThanPrintPage/gear.png",
    },
    {
      title: t.fourthItem.title,
      desc: t.fourthItem.description,
      image: "/pages/moreThanPrintPage/factory.png",
    },
  ]

  return (
    <section className=" flex flex-col py-[64px] px-[16px] bg-[var(--color-lighter-blue)]">
      <div className="max-w-[1408px] mx-auto flex flex-col lg:flex-wrap items-center">
        <h2 className="text-[32px] lg:text-[34px]  font-bold text-[var(--color-dark-blue)] leading-[1.2] text-center">
          {t.title}
        </h2>
      </div>

      <ul className="max-w-[870px] mx-auto flex flex-col lg:flex-row lg:flex-wrap justify-center items-center gap-[16px] mt-[48px] mb-[48px] lg:mt-[80px]">
        {items.map((item, index) => (
          <li
            key={index}
            className={`flex flex-col  items-center w-[328px] h-[429px] lg:w-[426px] lg:h-[510px] rounded-[24px] bg-[#FFFFFF] border-[1px] border-[#E8E8E8] py-[24px] px-[24px] lg:py-[40px] lg:px-[32px]`}
          >
            <div
              className={`w-[112px] h-[112px] bg-[var(--color-light-blue)] rounded-full flex items-center justify-center mb-[12px] lg:mb-[16px]`}
            >
              <Image src={item.image} alt={item.title} width={28} height={28} />
            </div>

            <div className="flex flex-col items-center flex-grow">
              <h3 className="text-[24px] font-bold text-[var(--color-dark-blue)] mb-[12px] lg:mb-[16px] text-center">
                {item.title}
              </h3>
              <p
                className="text-[14px] lg:text-[18px] font-regular text-[#555555] mb-[12px] lg:mb-[32px] text-center lg:text-left line-height-[1.5]"
                dangerouslySetInnerHTML={{ __html: item.desc }}
              />
              <SecondaryButton
                text={t.firstItem.btn}
                styles={`px-[20px] py-[10px] rounded-full text-[18px] font-regular w-[185px] mt-auto font-semibold`}
              />
            </div>
          </li>
        ))}
      </ul>

      <div className="max-w-[930px] mx-auto flex flex-col gap-[16px] lg:gap-[0px] items-center mt-[48px] mb-[32px] lg:mb-[56px] py-[24px] px-[24px] lg:py-[65px] lg:px-[15px] bg-[#E6EFFC] rounded-[24px]">
        <div className="flex justify-start">
          <div className="min-w-[13px] h-[13px] bg-[var(--color-main-blue)] mr-[12px] rounded-full lg:hidden"></div>
          <p className="text-[14px] lg:text-[20px] font-medium mb-[12px] text-left lg:text-center">
            {t.description.first}
          </p>
        </div>
        <div className="flex justify-start">
          <div className="min-w-[13px] h-[13px] bg-[var(--color-main-blue)] mr-[12px] rounded-full lg:hidden"></div>
          <p className="text-[14px] lg:text-[20px] font-medium mb-[12px] text-left lg:text-center">
            {t.description.second}
          </p>
        </div>
      </div>
      <PrimaryButton
        text={t.btn}
        styles={`px-[48px] py-[14.5px] rounded-full text-[18px] font-regular mx-auto`}
      />
    </section>
  )
}

export default PrintOnDemandSection
