"use client"

import { usePathname } from "next/navigation"
import ua from "@/translations/ua.json"
import sk from "@/translations/sk.json"
import us from "@/translations/en.json"
import pl from "@/translations/pl.json"
import cz from "@/translations/cz.json"

const dictionaries = { ua, sk, us, pl, cz }

export function useLocale(): "ua" | "sk" | "us" | "pl" | "cz" {
  const pathname = usePathname()
  const locale = pathname.split("/")[1] as "ua" | "sk" | "us" | "pl" | "cz"
  return ["ua", "sk", "us", "pl", "cz"].includes(locale) ? locale : "ua"
}

export function useTranslations() {
  const locale = useLocale()
  return dictionaries[locale] as unknown as LocalizationData
}

export function useRegion() {
  if (typeof window === "undefined") return null
  const regionCookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith("_medusa_region="))
  if (!regionCookie) return null
  return JSON.parse(decodeURIComponent(regionCookie.split("=")[1]))
}
