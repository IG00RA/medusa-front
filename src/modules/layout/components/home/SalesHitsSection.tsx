"use client";

import { useTranslations } from "@/lib/localization";
import Image from "next/image";
import { MdArrowForwardIos, MdArrowBackIosNew } from "react-icons/md";

interface SalesHitsSectionProps {
  theme?: {
    mainColor: string;
    bgColor: string;
    btnBgColor: string;
    borderColor: string;
  };
}

const SalesHitsSection = ({ theme }: SalesHitsSectionProps) => {
  const t = useTranslations().moreThanPrint.salesHits;

  const defaultTheme = {
    mainColor: "var(--color-main-blue)",
    bgColor: "bg-[#F9F9F9]",
    btnBgColor: "bg-[var(--color-main-blue)]",
    borderColor: "border-[var(--color-main-blue)]",
  };

  const mergedTheme = {
    ...defaultTheme,
    ...theme,
  };

  const items = [
    {
      name: t.firstItem.name,
      price: t.firstItem.price,
      image: "/pages/moreThanPrintPage/gamePad.png",
    },
    {
      name: t.secondItem.name,
      price: t.secondItem.price,
      image: "/pages/moreThanPrintPage/gamePad.png",
    },
    {
      name: t.thirdItem.name,
      price: t.thirdItem.price,
      image: "/pages/moreThanPrintPage/gamePad.png",
    },
  ];

  return (
    <section className="py-[64px] px-[16px] lg:py-[112px] bg-[#F9F9F9] relative">
      <div className="max-w-[1408px] mx-auto flex flex-col lg:flex-wrap items-center">
        <h2 className="text-[32px] font-bold text-[var(--color-dark-blue)] leading-[1.2] text-center">
          {t.title}
        </h2>
        <div
          className={`w-[100px] h-[3px] ${mergedTheme.btnBgColor} mt-[8px]`}
        ></div>
      </div>

      <div className="relative max-w-[1060px] mx-auto">
        <ul className="flex flex-col lg:flex-row lg:flex-wrap justify-center items-center gap-[16px] mt-[48px] lg:mt-[80px]">
          {items.map((item, index) => (
            <li
              key={index}
              className="flex flex-col items-center w-[300px] h-[412px] rounded-[24px] bg-white border border-[#E8E8E8] py-6 px-6"
            >
              <div className="min-w-[252px] h-[200px] bg-[#F0F0F0] rounded-[24px] flex items-center justify-center mb-3">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={56}
                  height={56}
                />
              </div>

              <div className="flex flex-col items-center flex-grow">
                <h3 className="text-[20px] w-[258px] text-center font-bold text-[var(--color-dark-blue)] mb-3">
                  {item.name}
                </h3>
                <p className="text-[20px] font-bold text-[var(--color-dark-blue)] mb-6 text-center">
                  {item.price}
                </p>
                <button
                  className={`px-12 py-3.5 rounded-xl text-[18px] font-semibold ${mergedTheme.btnBgColor} text-white`}
                >
                  {t.btn}
                </button>
              </div>
            </li>
          ))}
        </ul>

        <div className="flex justify-center lg:justify-between items-center mt-6 lg:mt-0 lg:absolute lg:inset-0 lg:top-1/2 lg:transform lg:-translate-y-1/2 w-full">
          <button
            className={`lg:absolute lg:-left-[0px] min-w-[40px] h-[40px] border ${mergedTheme.borderColor} rounded-full flex items-center justify-center mr-[24px] lg:mr-0`}
          >
            <MdArrowBackIosNew size={20} color={`${mergedTheme.mainColor}`} />
          </button>
          <button
            className={`lg:absolute lg:-right-[0px] min-w-[40px] h-[40px] border ${mergedTheme.borderColor} rounded-full flex items-center justify-center`}
          >
            <MdArrowForwardIos size={20} color={`${mergedTheme.mainColor}`} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default SalesHitsSection;
