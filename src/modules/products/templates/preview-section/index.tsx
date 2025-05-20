"use client"

import { useEffect, useState } from "react"
import { HttpTypes } from "@medusajs/types"
import { addToCart } from "@lib/data/cart"
import { useTranslations } from "@/lib/localization"
import Image from "next/image"
import toast, { Toaster } from "react-hot-toast"
import { IoPlaySharp } from "react-icons/io5"
import ProductPrice from "@modules/products/components/product-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { usePathname } from "next/navigation"

interface PreviewSectionProps {
  theme: {
    mainColor: string
    textColor: string
    bgColor: string
    btnBgColor: string
    borderColor: string
  }
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
  categories: HttpTypes.StoreProductCategory[]
}

const PreviewSection = ({
  theme,
  product,
  region,
  categories,
  countryCode,
}: PreviewSectionProps) => {
  const [quantity, setQuantity] = useState(1)
  const [selectedVariant, setSelectedVariant] = useState<
    HttpTypes.StoreProductVariant | undefined
  >(product.variants?.[0] || undefined)
  const [activeThumbnail, setActiveThumbnail] = useState<number | null>(1)
  const [isAdding, setIsAdding] = useState(false)
  const pathname = usePathname()
  const t = useTranslations().specificProduct.previewSection

  useEffect(() => {
    if (product.variants?.length && !selectedVariant) {
      const initialVariant = product.variants[0]
      setSelectedVariant(initialVariant)
      const initialColor =
        colors.find((c) =>
          initialVariant.options?.some((opt) => opt.value === c.colorName)
        ) || colors[0]
      setActiveColor(initialColor)
    }
  }, [product.variants])

  // Map Medusa variant options to colors (assuming a "color" option)
  const colors = product.options
    ?.find((opt) => opt.title?.toLowerCase() === "color")
    ?.values?.map((val, i) => ({
      color: ["#FFFFFF", "#303754", "#4D80E4", "#69C269"][i] || "#FFFFFF",
      colorName: val.value,
    })) || [
    { color: "#FFFFFF", colorName: "White" },
    { color: "#303754", colorName: "Dark Blue" },
    { color: "#4D80E4", colorName: "Blue" },
    { color: "#69C269", colorName: "Green" },
  ]

  const [activeColor, setActiveColor] = useState(colors[0])

  const getLocaleFromPath = (pathname: string): string => {
    const pathSegments = pathname.split("/")
    return pathSegments[1] || "ua"
  }

  const currentLocale = getLocaleFromPath(pathname || "")

  const productCategory = categories.find((category) =>
    category.products?.some((p) => p.id === product.id)
  )

  const getLocalizedCategoryName = (
    category: HttpTypes.StoreProductCategory | undefined
  ): string => {
    if (!category) {
      return t.navigationSecondItem || "Category"
    }
    if (
      category.metadata &&
      typeof category.metadata[currentLocale] === "string"
    ) {
      return category.metadata[currentLocale] as string
    }
    return category.name || "Category"
  }

  const handleVariantChange = (colorName: string) => {
    const variant = product.variants?.find((v) =>
      v.options?.some((opt) => opt.value === colorName)
    )
    if (variant) {
      setSelectedVariant(variant)
      setActiveColor(colors.find((c) => c.colorName === colorName) || colors[0])
    }
  }

  const handleAddToCart = async () => {
    if (!selectedVariant?.id) {
      toast.error("Please select a variant")
      return
    }

    setIsAdding(true)
    try {
      await addToCart({
        variantId: selectedVariant.id,
        quantity,
        countryCode,
      })
      toast.success(t.addedToCart || "Product added to cart!")
    } catch (error) {
      toast.error("Failed to add to cart")
    } finally {
      setIsAdding(false)
    }
  }

  useEffect(() => {
    console.log("product", product)
  }, [product])

  const hasPersonalization = product?.tags?.some(
    (tag) => tag.value === "Personalization"
  )

  return (
    <section className={`mx-auto px-[16px] pt-[24px] ${theme.bgColor}`}>
      <Toaster position="top-center" reverseOrder={false} />
      <nav className="flex gap-[8px] items-center text-[14px] text-[#A7A7A7] mb-[12px] max-w-[1408px] mx-auto">
        <LocalizedClientLink
          href="/"
          className="whitespace-nowrap overflow-hidden text-ellipsis max-w-[60px] hover:text-[#444444]"
        >
          {t.navigationFirstItem}
        </LocalizedClientLink>
        <span className="text-[#444444]">{">"}</span>
        {productCategory ? (
          <LocalizedClientLink
            href={`/categories/${productCategory.handle}`}
            className="text-[#444444] whitespace-nowrap hover:text-[${theme.textColor}]"
          >
            {getLocalizedCategoryName(productCategory)}
          </LocalizedClientLink>
        ) : (
          <span className="text-[#444444] whitespace-nowrap">
            {t.navigationSecondItem}
          </span>
        )}
        <span className="text-[#444444]">{">"}</span>
        <LocalizedClientLink
          href={`/products/${product.handle}`}
          className={`${theme.textColor} whitespace-nowrap hover:underline`}
        >
          {product.title}
        </LocalizedClientLink>
      </nav>
      <div className="lg:w-[1408px] pb-[32px] mx-auto lg:flex lg:gap-[43px] lg:items-center lg:justify-center border-y-[1px] border-y-[#F5E9D0] lg:py-[48px]">
        <div>
          <div className="mb-[16px]"></div>
          <div className="mx-auto w-[328px] lg:w-[300px] h-[400px] bg-[#F0F0F0] rounded-xl flex items-center justify-center">
            {product.thumbnail ? (
              <Image
                src={product.thumbnail}
                alt={product.title || "Product"}
                width={300}
                height={400}
                className="object-cover rounded-xl"
              />
            ) : (
              <div
                className={`${theme.btnBgColor} w-[80px] h-[80px] pl-[6px] rounded-full flex items-center justify-center`}
              >
                <IoPlaySharp size={40} color="#FFFFFF" />
              </div>
            )}
          </div>
          <div className="w-[328px] flex gap-[20px] justify-center mt-[12px] mb-[24px] mx-auto">
            {(product.images || []).slice(0, 4).map((img, i) => (
              <div
                key={i}
                className={`w-[60px] h-[60px] bg-[#F0F0F0] rounded cursor-pointer border-2 ${
                  activeThumbnail === i + 1
                    ? theme.borderColor
                    : "border-transparent"
                }`}
                onClick={() => setActiveThumbnail(i + 1)}
              >
                <Image
                  src={img.url}
                  alt={`Thumbnail ${i + 1}`}
                  width={60}
                  height={60}
                  className="object-cover rounded"
                />
              </div>
            ))}
          </div>
        </div>
        <div className="lg:flex lg:gap-[24px] lg:items-end">
          <div className="lg:w-[486px]">
            <h1 className="text-[var(--color-dark-blue)] text-[24px] font-semibold mb-[12px] lg:text-[28px]">
              {product.title}
            </h1>
            <div
              className={`w-[80px] h-[3px] bg-[${theme.mainColor}] mb-[12px]`}
            ></div>
            <div
              className={`${theme.textColor} font-bold text-[32px] mb-[16px]`}
            >
              <ProductPrice product={product} variant={selectedVariant} />
            </div>
            <p className="text-[14px] text-[#555555] lg:text-[16px]">
              {product.subtitle || t.description}
            </p>
            <div className="mt-[16px]">
              <h3 className="font-bold text-[16px] mb-[8px] text-[var(--color-dark-blue)]">
                {t.characteristicsList.title}
              </h3>
              <ul className="flex flex-col gap-[8px] text-[#555555] text-[16px]">
                <li>
                  • {t.characteristicsList.firstItem} {product.material}
                </li>
                <li>
                  • {t.characteristicsList.secondItem} {product.width} x{" "}
                  {product.length} x {product.height} {t.characteristicsList.cm}
                </li>
                <li>
                  • {t.characteristicsList.thirdItem} {product.weight}{" "}
                  {t.characteristicsList.weight}
                </li>
                <li>
                  •{" "}
                  {hasPersonalization
                    ? `${t.characteristicsList.fourthItem} ${t.characteristicsList.personalization}`
                    : `${t.characteristicsList.fourthItem} ${t.characteristicsList.noPersonalization}`}
                </li>
              </ul>
            </div>
          </div>
          <div>
            <div className="mt-[24px]">
              <h3 className="font-bold text-[16px] mb-[12px] text-[var(--color-dark-blue)]">
                {t.colorTitle}
              </h3>
              <div className="flex space-x-2 items-center">
                {colors.map((c, i) => (
                  <span
                    key={i}
                    onClick={() => handleVariantChange(c.colorName)}
                    className={`w-[30px] h-[30px] rounded-full cursor-pointer border-2 ${
                      activeColor.color === c.color
                        ? theme.borderColor
                        : "border-transparent"
                    }`}
                    style={{ backgroundColor: c.color }}
                  />
                ))}
              </div>
            </div>
            <div className="mt-[16px] mb-[32px] flex gap-[8px] items-center">
              <h3 className="font-bold text-[16px] text-[var(--color-dark-blue)]">
                {t.chooseColorTitle}
              </h3>
              <span
                className={`w-[30px] h-[30px] rounded-full cursor-pointer bg-[#E1DFDE]`}
              />
            </div>
            <div className="mt-4">
              <h3 className="font-bold text-[16px] text-[var(--color-dark-blue)] mb-[12px]">
                {t.quantityTitle}
              </h3>
              <div className="flex items-center gap-4">
                <select
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  className="bg-[#FFFFFF] px-[12px] py-[16px] text-[16px] rounded-xl"
                  disabled={isAdding}
                >
                  {[...Array(5)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1} {t.quantityEnding}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleAddToCart}
                  className={`${theme.btnBgColor} text-white px-[80px] py-[14.5px] rounded-xl text-[18px] font-semibold disabled:opacity-50`}
                  disabled={isAdding || !selectedVariant}
                >
                  {isAdding ? "Adding..." : t.btnBuy}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PreviewSection
