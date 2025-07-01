"use client"

import { useLocale, useTranslations } from "@/lib/localization"
import Image from "next/image"
import { PrimaryButton } from "../buttons"
import { useRouter } from "next/navigation"

const OurWareSection = () => {
  const t = useTranslations().moreThanPrint.ourWare
  const items = [
    {
      title: t.educationalSets.title,
      desc: t.educationalSets.description,
      image: "/pages/moreThanPrintPage/pazzle.png",
      bgMain: "bg-[var(--color-lighter-blue)]",
      bgPic: "bg-[var(--color-light-blue)]",
      bgBtn: "bg-main-blue",
      link: "games",
    },
    {
      title: t.playSets.title,
      desc: t.playSets.description,
      image: "/pages/moreThanPrintPage/gamePad.png",
      bgMain: "bg-[var(--color-lighter-red)]",
      bgPic: "bg-[var(--color-light-red)]",
      bgBtn: "bg-main-red",
      link: "games",
    },
    {
      title: t.decorSets.title,
      desc: t.decorSets.description,
      image: "/pages/moreThanPrintPage/gift.png",
      bgMain: "bg-[var(--color-lighter-orange)]",
      bgPic: "bg-[var(--color-light-orange)]",
      bgBtn: "bg-main-orange",
      link: "decor",
    },
    {
      title: t.usefulSets.title,
      desc: t.usefulSets.description,
      image: "/pages/moreThanPrintPage/mobile.png",
      bgMain: "bg-[var(--color-lighter-green)]",
      bgPic: "bg-[var(--color-light-green)]",
      bgBtn: "bg-main-green",
      link: "accessories",
    },
  ]

  const router = useRouter()
  const locale = useLocale()

  const handlePrimaryClick = (link: string) => {
    router.push(`/${locale}/categories/${link}`)
  }

  return (
    <section className="py-[96px] px-[16px]">
      <div className="max-w-[1408px] mx-auto flex flex-col lg:flex-wrap items-center">
        <h2 className="text-[32px] font-bold text-[var(--color-dark-blue)] leading-[1.2] text-center">
          {t.ourWaresTitle}
        </h2>
        <div className="w-[100px] h-[3px] bg-[var(--color-main-blue)] mt-[8px]"></div>
      </div>

      <ul className=" max-w-[1408px] mx-auto flex flex-col lg:flex-row lg:flex-wrap justify-center items-center gap-[16px] mt-[48px] lg:mt-[80px]">
        {items.map((item, index) => (
          <li
            key={index}
            className={`flex flex-col lg:flex-row lg:gap-[40px] items-center w-[328px] h-[469px] lg:w-[696px] lg:h-[276px] rounded-[24px] ${item.bgMain} p-[24px]`}
          >
            <div
              className={`w-[280px] lg:min-w-[228px] h-[228px]   ${item.bgPic} rounded-[24px] flex items-center justify-center mb-[24px] lg:mb-0`}
            >
              <Image src={item.image} alt={item.title} width={56} height={56} />
            </div>

            <div className="flex flex-col items-center lg:items-start">
              <h3 className="text-[18px] lg:text-[24px] font-bold text-[var(--color-dark-blue)] mb-[8px] lg:mb-[20px]">
                {item.title}
              </h3>
              <p className="text-[14px] lg:text-[18px] font-regular text-[#555555] mb-[24px] lg:mb-[20px] text-center lg:text-left">
                {item.desc}
              </p>
              <PrimaryButton
                onClick={() => handlePrimaryClick(item.link)}
                text={t.ourWaresBtn}
                styles={`px-[20px] py-[10px] rounded-full text-[18px] font-regular w-[185px] ${item.bgBtn}`}
              />
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default OurWareSection
