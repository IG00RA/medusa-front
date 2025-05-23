"use client";
import { useTranslations } from "@/lib/localization";
import Image from "next/image";

const WhyFlexiFunSection = () => {
  const t = useTranslations().moreThanPrint.whyFlexiFun;
  const items = [
    {
      title: t.firstItem.title,
      desc: t.firstItem.description,
      image: "/pages/moreThanPrintPage/leaf.png",
    },
    {
      title: t.secondItem.title,
      desc: t.secondItem.description,
      image: "/pages/moreThanPrintPage/gear.png",
    },
    {
      title: t.thirdItem.title,
      desc: t.thirdItem.description,
      image: "/pages/moreThanPrintPage/paint.png",
    },
    {
      title: t.fourthItem.title,
      desc: t.fourthItem.description,
      image: "/pages/moreThanPrintPage/flash.png",
    },
    {
      title: t.fifthItem.title,
      desc: t.fifthItem.description,
      image: "/pages/moreThanPrintPage/plane.png",
    },
  ];

  return (
    <section className="bg-[#fff] pt-[122px] pb-[144px]">
      <div className="max-w-[1408px] mx-auto px-[16px] flex flex-col items-center">
        <h2 className="text-[32px] font-bold text-[var(--color-dark-blue)] leading-[1.2]">
          {t.title}
        </h2>

        <div className="w-[100px] h-[3px] bg-[var(--color-main-blue)] mt-[8px]"></div>

        <div className="flex flex-col lg:flex-row gap-[24px] lg:gap-[16px] mt-[48px] lg:mt-[80px]">
          {items.map((item, index) => (
            <div key={index} className="flex flex-col items-center w-[221px]">
              <div className="w-[80px] h-[80px] bg-[var(--color-light-blue)] rounded-full flex items-center justify-center mb-6">
                <Image src={item.image} alt="ecology" width={28} height={28} />
              </div>
              <h3 className="text-[18px] font-bold text-[var(--color-dark-blue)] mb-3">
                {item.title}
              </h3>
              <p className="text-[18px] font-medium text-[var(--color-dark-blue)] text-center">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyFlexiFunSection;
