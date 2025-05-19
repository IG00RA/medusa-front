// src/modules/layout/templates/nav/language.tsx
"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, usePathname } from "next/navigation"
import Image from "next/image"

interface Language {
  short: string
  full: string
}

export default function Language({ mobile }: { mobile?: boolean }) {
  const router = useRouter()
  const pathname = usePathname()
  const [menu, setMenu] = useState(false)
  const languageRef = useRef<HTMLDivElement>(null)

  const languages: Language[] = [
    { short: "ua", full: "Українська" },
    { short: "sk", full: "Slovenská" },
    { short: "en", full: "English" },
    { short: "pl", full: "Polska" },
    { short: "cz", full: "Čeština" },
  ]

  const getLocaleFromPath = (pathname: string): string => {
    const pathSegments = pathname.split("/")
    return pathSegments[1] || "ua"
  }

  const locale = getLocaleFromPath(pathname || "")

  const getCurrentLanguage = () => {
    return (
      languages.find((lang) => lang.short === locale) ||
      languages.find((lang) => lang.short === "ua")!
    )
  }

  const changeLanguage = (newLocale: string) => {
    const currentPath = pathname.replace(/^\/(ua|sk|en|pl|cz)/, "")
    router.push(`/${newLocale}${currentPath}`)
    setMenu(false)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        languageRef.current &&
        !languageRef.current.contains(event.target as Node)
      ) {
        setMenu(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className={`relative ${!mobile && "max-lg:hidden"}`} ref={languageRef}>
      <div
        className="bg-white px-4 h-10 rounded-xl border border-neutral-300 flex items-center justify-between gap-10 cursor-pointer"
        onClick={() => setMenu((prev) => !prev)}
      >
        <div className="flex gap-3 items-center">
          <span className="bg-main-blue rounded-sm h-6 flex items-center justify-center aspect-square font-bold text-white text-xs">
            {getCurrentLanguage().short.toUpperCase()}
          </span>
          {getCurrentLanguage().full}
        </div>
        <Image src="/header/arrow.svg" alt="arrow" width={10} height={10} />
      </div>

      {menu && (
        <div
          className={`absolute mt-2 right-0 ${
            mobile ? "w-full" : "w-max"
          } flex flex-col z-100 rounded-2xl border border-neutral-300 shadow-2xl transition-all duration-250 ease-in-out`}
        >
          <h2 className="bg-lighter-blue font-bold text-dark-blue rounded-t-2xl px-6 py-4 text-xl">
            Language
          </h2>
          <ul className="bg-white rounded-b-2xl px-6 pt-4 pb-6 w-full flex flex-col gap-3">
            {languages.map((lang, index) => {
              const chosen = locale.toLowerCase() === lang.short.toLowerCase()
              return (
                <li
                  key={index}
                  className={`flex gap-3 items-center justify-between border rounded-lg p-2 cursor-pointer ${
                    chosen
                      ? "bg-blue-50 border-main-blue"
                      : "border-neutral-300"
                  }`}
                  onClick={() => changeLanguage(lang.short.toLowerCase())}
                >
                  <div
                    className={`flex gap-2 items-center ${
                      chosen && "font-bold"
                    }`}
                  >
                    <span
                      className={`${
                        chosen
                          ? "bg-main-blue text-white"
                          : "bg-neutral-300 text-dark-blue"
                      } rounded-sm h-6 flex items-center justify-center aspect-square font-bold text-xs`}
                    >
                      {lang.short.toUpperCase()}
                    </span>
                    {lang.full}
                  </div>
                  {chosen && (
                    <div className="bg-main-blue h-4 aspect-square rounded-full flex items-center justify-center">
                      <Image
                        src="/header/arrow-round.svg"
                        alt="arrow"
                        width={6}
                        height={6}
                        className="mb-[-1px]"
                      />
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}
