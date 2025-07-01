"use client"

import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { PrimaryButton } from "@/modules/layout/components/buttons"

const OrderSuccessPage = () => {
  const router = useRouter()
  const pathname = usePathname()
  const getLocaleFromPath = (pathname: string): string => {
    const pathSegments = pathname.split("/")
    return pathSegments[1] || "ua"
  }

  const locale = getLocaleFromPath(pathname || "")
  useEffect(() => {
    const redirectTimeout = setTimeout(() => {
      router.push(`/${locale}`)
    }, 5000)

    return () => clearTimeout(redirectTimeout)
  }, [router])

  return (
    <main className="py-8 px-4 lg:px-16 max-w-[1440px] m-auto">
      <div className="bg-white rounded-3xl shadow-md border border-neutral-200 p-8 max-w-2xl mx-auto text-center">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-green-600"
            >
              <path
                d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-dark-blue mb-2">
          Замовлення успішно оформлено!
        </h1>
        <p className="text-neutral-600 mb-8">
          Дякуємо за ваше замовлення. Ми зв'язжемося з вами найближчим часом для
          підтвердження деталей.
        </p>

        <div className="flex flex-col items-center gap-4 mb-8">
          <div className="bg-lighter-blue rounded-xl p-4 w-full max-w-md">
            <p className="text-dark-blue">
              Перевірте, будь ласка, свою електронну пошту. Ми надіслали вам
              лист із деталями замовлення.
            </p>
          </div>
        </div>

        <div className="flex justify-center">
          <Link href="/">
            <PrimaryButton text="Повернутися на головну" styles="px-8" />
          </Link>
        </div>

        <p className="text-sm text-neutral-400 mt-8">
          Вас буде автоматично перенаправлено на головну сторінку через 5
          секунд.
        </p>
      </div>
    </main>
  )
}

export default OrderSuccessPage
