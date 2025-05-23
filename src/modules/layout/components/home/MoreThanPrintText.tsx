"use client"

import { useLocale, useTranslations } from "@/lib/localization"
import { PrimaryButton, SecondaryButton } from "../buttons"
import { useRouter } from "next/navigation" // імпорт useRouter

export default function MoreThanPrintText() {
  const t = useTranslations().moreThanPrint.hero
  const router = useRouter()
  const locale = useLocale()

  const handlePrimaryClick = () => {
    router.push(`/${locale}/store`)
  }

  return (
    <div>
      <h2 className="w-[300px] text-[32px] font-bold text-[var(--color-dark-blue)] leading-tight mb-4">
        {t.heroTitle}
      </h2>
      <p className="text-[var(--color-dark-blue)] text-[16px] lg:text-[24px] font-medium mb-4">
        {t.heroSubtitle}
      </p>
      <hr className="w-24 border-b-2 border-[var(--color-main-blue)] mb-4" />
      <p className="text-[14px] lg:text-[18px] font-regular text-[var(--color-dark-blue)] mb-[24px] lg:mb-[16px]">
        {t.heroDescription}
      </p>
      <div className="flex gap-[8px] lg:gap-[16px]">
        <PrimaryButton
          text={t.buttons.choose}
          styles="px-[20px] lg:px-[48px] py-[16px] rounded-full text-[16px] lg:text-[18px] font-regular"
          onClick={handlePrimaryClick}
        />
        <SecondaryButton
          text={t.buttons.order}
          styles="px-[20px] lg:px-[48px] py-[16px] rounded-full text-[16px] lg:text-[18px] font-regular"
        />
      </div>
    </div>
  )
}
