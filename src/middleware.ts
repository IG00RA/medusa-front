import { HttpTypes } from "@medusajs/types"
import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.MEDUSA_BACKEND_URL
const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
const locales = ["ua", "sk", "en", "pl", "cz"]
const defaultLocale = "ua"

const regionMapCache = {
  regionMap: new Map<string, HttpTypes.StoreRegion>(),
  regionMapUpdated: Date.now(),
}

async function getRegionMap(cacheId: string) {
  const { regionMap, regionMapUpdated } = regionMapCache

  if (!BACKEND_URL || !PUBLISHABLE_API_KEY) {
    throw new Error(
      "Middleware: Missing MEDUSA_BACKEND_URL or NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY environment variables."
    )
  }

  if (
    !regionMap.keys().next().value ||
    regionMapUpdated < Date.now() - 3600 * 1000
  ) {
    const { regions } = await fetch(`${BACKEND_URL}/store/regions`, {
      headers: {
        "x-publishable-api-key": PUBLISHABLE_API_KEY,
      },
      next: {
        revalidate: 3600,
        tags: [`regions-${cacheId}`],
      },
      cache: "no-store",
    }).then(async (response) => {
      const json = await response.json()
      if (!response.ok) {
        throw new Error(json.message)
      }
      return json
    })

    if (!regions?.length) {
      throw new Error("No regions found. Set up regions in Medusa Admin.")
    }

    regions.forEach((region: HttpTypes.StoreRegion) => {
      region.countries?.forEach((c) => {
        if (c.iso_2 && locales.includes(c.iso_2)) {
          regionMapCache.regionMap.set(c.iso_2, region)
        }
      })
    })

    regionMapCache.regionMapUpdated = Date.now()
  }

  return regionMapCache.regionMap
}

async function getLocaleAndRegion(
  request: NextRequest,
  regionMap: Map<string, HttpTypes.StoreRegion>
) {
  let locale = defaultLocale

  // Отримуємо локаль із URL (наприклад, /ua)
  const urlLocale = request.nextUrl.pathname.split("/")[1]?.toLowerCase()
  if (urlLocale && locales.includes(urlLocale)) {
    locale = urlLocale
  } else {
    // Якщо локаль не вказана, перевіряємо геолокацію Vercel
    const vercelCountryCode = request.headers
      .get("x-vercel-ip-country")
      ?.toLowerCase()
    if (vercelCountryCode && locales.includes(vercelCountryCode)) {
      locale = vercelCountryCode
    }
  }

  // Отримуємо регіон, який відповідає локалі
  const region = regionMap.get(locale)

  return { locale, region }
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Пропускаємо статичні активи
  if (
    pathname.includes(".") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next")
  ) {
    return NextResponse.next()
  }

  let cacheIdCookie = request.cookies.get("_medusa_cache_id")
  let cacheId = cacheIdCookie?.value || crypto.randomUUID()

  const regionMap = await getRegionMap(cacheId)
  const { locale, region } = await getLocaleAndRegion(request, regionMap)

  const urlHasLocale = locales.some(
    (l) => pathname.startsWith(`/${l}/`) || pathname === `/${l}`
  )

  // Якщо локаль уже є в URL і cacheId встановлено, пропускаємо
  if (urlHasLocale && cacheIdCookie) {
    return NextResponse.next()
  }

  // Якщо локаль є, але cacheId відсутній, встановлюємо cacheId
  if (urlHasLocale && !cacheIdCookie) {
    const response = NextResponse.next()
    response.cookies.set("_medusa_cache_id", cacheId, {
      maxAge: 60 * 60 * 24,
    })
    return response
  }

  // Якщо локаль відсутня, перенаправляємо на URL із локаллю
  const redirectPath = pathname === "/" ? "" : pathname
  const queryString = request.nextUrl.search ? request.nextUrl.search : ""
  const redirectUrl = `${request.nextUrl.origin}/${locale}${redirectPath}${queryString}`

  const response = NextResponse.redirect(redirectUrl, 307)
  response.cookies.set("_medusa_cache_id", cacheId, {
    maxAge: 60 * 60 * 24,
  })

  // Зберігаємо регіон у cookies для використання на клієнті
  if (region) {
    response.cookies.set("_medusa_region", JSON.stringify(region), {
      maxAge: 60 * 60 * 24,
    })
  }

  return response
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images|assets|png|svg|jpg|jpeg|gif|webp).*)",
  ],
}
