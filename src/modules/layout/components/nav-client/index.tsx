"use client"

import { useState } from "react"
import Image from "next/image"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Language from "../language"
import Cart from "../cart"
import { useTranslations } from "@/lib/localization"

type NavClientProps = {
  regions: HttpTypes.StoreRegion[] | null
  cart: HttpTypes.StoreCart | null
  categories: HttpTypes.StoreProductCategory[]
}

export default function NavClient({
  regions,
  cart,
  categories,
}: NavClientProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const t = useTranslations().header

  return (
    <div className="sticky top-0 inset-x-0 z-50">
      <header className="bg-lighter-blue relative">
        <nav className="p-4 lg:px-16 max-w-[1440px] m-auto flex justify-between items-center text-dark-blue">
          <LocalizedClientLink href="/">
            <Image
              src="/logotype.svg"
              alt="FlexiFun"
              width={150}
              height={150}
            />
          </LocalizedClientLink>
          <div className="flex gap-3 items-center max-lg:hidden">
            {categories?.slice(0, 4).map((category) => (
              <LocalizedClientLink
                key={category.id}
                href={`/categories/${category.handle}`}
              >
                {category.name}
              </LocalizedClientLink>
            ))}
            {/* <LocalizedClientLink href="/categories/development">
              {t.navigation.development}
            </LocalizedClientLink>
            <LocalizedClientLink href="/categories/games">
              {t.navigation.games}
            </LocalizedClientLink>
            <LocalizedClientLink href="/categories/accessories">
              {t.navigation.accessories}
            </LocalizedClientLink>
            <LocalizedClientLink href="/categories/decorations">
              {t.navigation.decorations}
            </LocalizedClientLink> */}
            <LocalizedClientLink
              href="/custom"
              className="font-bold text-main-blue"
            >
              {t.navigation.custom}
            </LocalizedClientLink>
            <LocalizedClientLink href="/about">
              {t.navigation.about}
            </LocalizedClientLink>
            <LocalizedClientLink href="/delivery">
              {t.navigation.delivery}
            </LocalizedClientLink>
          </div>
          <div className="flex gap-3 items-center">
            <Language />
            <Cart cart={cart} />
            <div
              className="bg-main-blue h-10 text-lg px-4 rounded-xl flex items-center justify-center gap-10 cursor-pointer lg:hidden"
              onClick={() => setIsMenuOpen((prev) => !prev)}
            >
              <Image src="/header/menu.svg" alt="menu" width={15} height={15} />
            </div>
          </div>
        </nav>

        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-lighter-blue z-50 shadow-md border-b border-neutral-300 lg:hidden transition-all duration-300 ease-in-out">
            <div className="p-4 flex flex-col gap-4">
              {categories?.slice(0, 4).map((category) => (
                <LocalizedClientLink
                  key={category.id}
                  href={`/categories/${category.handle}`}
                >
                  {category.name}
                </LocalizedClientLink>
              ))}
              {/* <LocalizedClientLink
                href="/categories/development"
                className="py-2"
              >
                {t.navigation.development}
              </LocalizedClientLink>
              <LocalizedClientLink href="/categories/games" className="py-2">
                {t.navigation.games}
              </LocalizedClientLink>
              <LocalizedClientLink
                href="/categories/accessories"
                className="py-2"
              >
                {t.navigation.accessories}
              </LocalizedClientLink>
              <LocalizedClientLink
                href="/categories/decorations"
                className="py-2"
              >
                {t.navigation.decorations}
              </LocalizedClientLink> */}
              <LocalizedClientLink
                href="/custom"
                className="py-2 font-bold text-main-blue"
              >
                {t.navigation.custom}
              </LocalizedClientLink>
              <LocalizedClientLink href="/about" className="py-2">
                {t.navigation.about}
              </LocalizedClientLink>
              <LocalizedClientLink href="/delivery" className="py-2">
                {t.navigation.delivery}
              </LocalizedClientLink>
              <Language mobile={true} />
            </div>
          </div>
        )}

        <div className="border-y border-neutral-300">
          <div className="py-2 px-4 lg:px-16 max-w-[1440px] m-auto flex max-lg:justify-between gap-3 max-lg:text-xs">
            <p>🌿 {t.features.ecology}</p>
            <p>✈️ {t.features.worldwide}</p>
          </div>
        </div>
      </header>
    </div>
  )
}
