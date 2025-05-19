"use client"

import Image from "next/image"
import { useTranslations } from "@/lib/localization"
import { Input, PrimaryButton } from "../buttons"

export default function Newsletter() {
  const t = useTranslations().newsletter

  return (
    <section className="bg-neutral-100">
      <div className="py-16 px-4 lg:py-24 lg:px-16 max-w-[1440px] m-auto flex justify-center">
        <div className="bg-white rounded-2xl w-fit flex gap-5 px-4 lg:px-10 py-5 max-lg:flex-col">
          <div className="flex flex-col justify-center lg:border-r lg:pr-10 border-neutral-300">
            <h3 className="font-bold text-xl">{t.follow}</h3>
            <nav className="flex gap-3 mt-4">
              <a href="">
                <Image
                  src="/social/telegram.svg"
                  alt="Telegram"
                  width={40}
                  height={40}
                />
              </a>
              <a href="">
                <Image
                  src="/social/tiktok.svg"
                  alt="TikTok"
                  width={40}
                  height={40}
                />
              </a>
              <a href="">
                <Image
                  src="/social/youtube.svg"
                  alt="YouTube"
                  width={40}
                  height={40}
                />
              </a>
              <a href="">
                <Image
                  src="/social/instagram.svg"
                  alt="Instagram"
                  width={40}
                  height={40}
                />
              </a>
            </nav>
          </div>
          <hr className="border-neutral-300 w-1/2 lg:hidden" />
          <div className="lg:mr-3">
            <div>
              <h3 className="font-bold text-xl">{t.subscribe}</h3>
              <p className="text-neutral-600 mt-2">{t.information}</p>
            </div>
            <form action="" className="flex gap-4 mt-5 max-lg:flex-col">
              <Input type="email" placeholder={t.email} styles="w-80" />
              <PrimaryButton text={t.submit} styles="rounded-xl w-fit" />
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
