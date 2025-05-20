"use client"

import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"
import { useTranslations } from "@/lib/localization"
import { useEffect } from "react"

type FooterProps = {
  collections: HttpTypes.StoreCollection[]
  categories: HttpTypes.StoreProductCategory[]
}

export default function FooterClient({ collections, categories }: FooterProps) {
  const t = useTranslations().footer
  return (
    <footer className="bg-dark-blue text-white">
      <div className="py-12 px-4 lg:px-16 max-w-[1440px] m-auto">
        <LocalizedClientLink href="/">
          <Image
            src="/logotype.svg"
            alt="FlexiFun"
            width={150}
            height={150}
            className="brightness-0 invert"
          />
        </LocalizedClientLink>
        <ul className="flex max-lg:flex-col justify-between gap-5 mt-8 pb-4 max-lg:border-b border-main-blue">
          <li>
            <h3 className="font-bold max-lg:text-lg">{t.about.header}</h3>
            <nav className="flex flex-col gap-2 mt-3">
              <LocalizedClientLink href="/about/team">
                {t.about.team}
              </LocalizedClientLink>
              <LocalizedClientLink href="/about/history">
                {t.about.history}
              </LocalizedClientLink>
              <LocalizedClientLink href="/about/contacts">
                {t.about.contacts}
              </LocalizedClientLink>
            </nav>
          </li>
          <li>
            <h3 className="font-bold max-lg:text-lg">{t.delivery.header}</h3>
            <nav className="flex flex-col gap-2 mt-3">
              <LocalizedClientLink href="/delivery">
                {t.delivery.delivery}
              </LocalizedClientLink>
              <LocalizedClientLink href="/payment">
                {t.delivery.payment}
              </LocalizedClientLink>
              <LocalizedClientLink href="/returns">
                {t.delivery.return}
              </LocalizedClientLink>
            </nav>
          </li>
          <li>
            <h3 className="font-bold max-lg:text-lg">{t.catalogue.header}</h3>
            <nav className="flex flex-col gap-2 mt-3">
              {categories?.slice(0, 4).map((category) => (
                <LocalizedClientLink
                  key={category.id}
                  href={`/categories/${category.handle}`}
                >
                  {category.name}
                </LocalizedClientLink>
              ))}
            </nav>
          </li>
          <li>
            <h3 className="font-bold max-lg:text-lg">{t.custom.header}</h3>
            <nav className="flex flex-col gap-2 mt-3">
              <LocalizedClientLink href="/custom/tutorial">
                {t.custom.tutorial}
              </LocalizedClientLink>
              <LocalizedClientLink href="/custom/materials">
                {t.custom.materials}
              </LocalizedClientLink>
              <LocalizedClientLink href="/custom/industrial">
                {t.custom.industrial}
              </LocalizedClientLink>
              <LocalizedClientLink href="/custom/wholesale">
                {t.custom.wholesale}
              </LocalizedClientLink>
            </nav>
          </li>
          <li>
            <h3 className="font-bold max-lg:text-lg">{t.contacts.header}</h3>
            <nav className="flex flex-col gap-2 mt-3">
              <a href="tel:+380000000000">+380 XX XXX XX XX</a>
              <a href="mailto:info@flexifun.com">info@flexifun.com</a>
            </nav>
            <h3 className="font-bold mt-16 lg:mt-8 max-lg:text-lg">
              {t.social.header}
            </h3>
            <nav className="flex gap-3 mt-3">
              <a href="https://telegram.org">
                <Image
                  src="/social/telegram.svg"
                  alt="Telegram"
                  width={35}
                  height={35}
                />
              </a>
              <a href="https://tiktok.com">
                <Image
                  src="/social/tiktok.svg"
                  alt="TikTok"
                  width={35}
                  height={35}
                />
              </a>
              <a href="https://youtube.com">
                <Image
                  src="/social/youtube.svg"
                  alt="YouTube"
                  width={35}
                  height={35}
                />
              </a>
              <a href="https://instagram.com">
                <Image
                  src="/social/instagram.svg"
                  alt="Instagram"
                  width={35}
                  height={35}
                />
              </a>
            </nav>
          </li>
        </ul>
        <div className="flex max-lg:flex-col justify-between mt-8">
          <p>
            © {new Date().getFullYear()} FlexiFun. {t.legal.rights}.
          </p>
          <nav className="flex max-lg:justify-between gap-3">
            <LocalizedClientLink href="/policies">
              {t.legal.policies}
            </LocalizedClientLink>
            <LocalizedClientLink href="/terms" className="max-lg:text-right">
              {t.legal.terms}
            </LocalizedClientLink>
          </nav>
        </div>
      </div>
    </footer>
  )
}
