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
  const [activeThumbnail, setActiveThumbnail] = useState<string | null>(
    product.mid_code
      ? `https://img.youtube.com/vi/${product.mid_code}/hqdefault.jpg`
      : product.thumbnail || null
  )
  const [isAdding, setIsAdding] = useState(false)
  const [customColor, setCustomColor] = useState("#E1DFDE")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isVideoModal, setIsVideoModal] = useState(!!product.mid_code)
  const [isContentLoaded, setIsContentLoaded] = useState(false)
  const pathname = usePathname()
  const t = useTranslations().specificProduct.previewSection

  // Map product options to colors and associate with images
  const colors = product.options
    ?.find((opt) => opt.title?.toLowerCase() === "color")
    ?.values?.map((val) => ({
      colorName: val.value,
      color: val.value === "custom" ? customColor : val.value,
      image:
        product.images?.find((img) => img.url.toLowerCase().includes(val.value))
          ?.url || null,
    })) || [
    { colorName: "white", color: "white", image: null },
    { colorName: "black", color: "black", image: null },
    { colorName: "blue", color: "blue", image: null },
    { colorName: "green", color: "green", image: null },
  ]

  const [activeColor, setActiveColor] = useState(
    colors[0] || { colorName: "white", color: "white", image: null }
  )

  useEffect(() => {
    if (product.variants?.length && !selectedVariant) {
      const initialVariant = product.variants[0]
      setSelectedVariant(initialVariant)
      const initialColor =
        colors.find((c) =>
          initialVariant.options?.some((opt) => opt.value === c.colorName)
        ) || colors[0]
      setActiveColor(
        initialColor || { colorName: "white", color: "white", image: null }
      )
      setActiveThumbnail(
        product.mid_code
          ? `https://img.youtube.com/vi/${product.mid_code}/hqdefault.jpg`
          : initialColor?.image || product.thumbnail || null
      )
      setIsVideoModal(!!product.mid_code)
    }
  }, [product.variants, product.thumbnail, product.mid_code])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isModalOpen) {
        setIsModalOpen(false)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isModalOpen])

  useEffect(() => {
    // Reset loading state when modal opens or content changes
    if (isModalOpen) {
      setIsContentLoaded(false)
    }
  }, [isModalOpen, activeThumbnail, isVideoModal])

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

  const handleVariantChange = (
    colorName: string,
    colorValue: string,
    image: string | null
  ) => {
    const variant = product.variants?.find((v) =>
      v.options?.some((opt) => opt.value === colorName)
    )
    setSelectedVariant(variant || product.variants?.[0])
    setActiveColor({ color: colorValue, colorName, image })
    if (image) {
      setActiveThumbnail(image)
      setIsVideoModal(false)
    }
  }

  const handleThumbnailClick = (url: string) => {
    setActiveThumbnail(url)
    setIsVideoModal(false)
  }

  const handleVideoClick = () => {
    setActiveThumbnail(
      `https://img.youtube.com/vi/${product.mid_code}/hqdefault.jpg`
    )
    setIsVideoModal(true)
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

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      setIsModalOpen(false)
    }
  }

  const handleContentLoad = () => {
    setIsContentLoaded(true)
  }

  const hasPersonalization = product?.tags?.some(
    (tag) => tag.value === "personalization"
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
      <div className="lg:w-[1408px] pb-[32px] mx-auto lg:flex lg:gap-[43px] lg:items-start lg:justify-center border-y-[1px] border-y-[#F5E9D0] lg:py-[48px]">
        <div>
          <div className="mx-auto w-[328px] lg:w-[300px] h-[400px] bg-[#F0F0F0] rounded-xl flex items-center justify-center overflow-hidden relative">
            {activeThumbnail ? (
              <div
                className="w-full h-full cursor-pointer"
                onClick={() => setIsModalOpen(true)}
              >
                <Image
                  src={activeThumbnail}
                  alt={product.title || "Product"}
                  width={300}
                  height={400}
                  className="w-full h-full object-cover rounded-xl"
                />
                {isVideoModal && product.mid_code && (
                  <div
                    className={`${theme.btnBgColor} w-[80px] h-[80px] pl-[6px] rounded-full flex items-center justify-center absolute top-1/2 left-1/2 transform -translate-x-[50%] -translate-y-[50%]`}
                  >
                    <IoPlaySharp size={40} color="#FFFFFF" />
                  </div>
                )}
              </div>
            ) : (
              <div
                className={`${theme.btnBgColor} w-[80px] h-[80px] pl-[6px] rounded-full flex items-center justify-center`}
              >
                <IoPlaySharp size={40} color="#FFFFFF" />
              </div>
            )}
          </div>
          <div className="w-[328px] mt-[12px] mb-[24px] mx-auto overflow-x-auto">
            <div className="flex gap-[20px] flex-nowrap snap-x snap-mandatory">
              {product.mid_code && (
                <div
                  className={`w-[60px] h-[60px] bg-[#F0F0F0] flex justify-center rounded cursor-pointer border-2 overflow-hidden relative flex-shrink-0 ${
                    activeThumbnail ===
                    `https://img.youtube.com/vi/${product.mid_code}/hqdefault.jpg`
                      ? theme.borderColor
                      : "border-transparent"
                  }`}
                  onClick={handleVideoClick}
                >
                  <Image
                    src={`https://img.youtube.com/vi/${product.mid_code}/hqdefault.jpg`}
                    alt="Video Thumbnail"
                    width={60}
                    height={60}
                    className="w-full h-full object-cover rounded"
                  />
                  <div
                    className={`${theme.btnBgColor} w-[20px] h-[20px] rounded-full flex items-center justify-center absolute top-1/2 left-1/2 transform -translate-x-[50%] -translate-y-[50%]`}
                  >
                    <IoPlaySharp size={12} color="#FFFFFF" />
                  </div>
                </div>
              )}
              {(product.images || []).map((img, i) => (
                <div
                  key={i}
                  className={`w-[60px] h-[60px] bg-[#F0F0F0] rounded cursor-pointer border-2 overflow-hidden flex-shrink-0 ${
                    activeThumbnail === img.url
                      ? theme.borderColor
                      : "border-transparent"
                  }`}
                  onClick={() => handleThumbnailClick(img.url)}
                >
                  <Image
                    src={img.url}
                    alt={`Thumbnail ${i + 1}`}
                    width={60}
                    height={60}
                    className="w-full h-full object-cover rounded"
                  />
                </div>
              ))}
            </div>
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
              <div className="flex gap-2 items-center">
                {colors
                  .filter((c) => c.colorName !== "custom")
                  .map((c, i) => (
                    <span
                      key={i}
                      onClick={() =>
                        handleVariantChange(c.colorName, c.color, c.image)
                      }
                      className={`w-[30px] h-[30px] shrink-0 rounded-full cursor-pointer border-2 ${
                        activeColor.colorName === c.colorName
                          ? theme.borderColor
                          : ""
                      }`}
                      style={{ backgroundColor: c.color }}
                    />
                  ))}
              </div>
            </div>
            <div className="mt-[16px] mb-[32px] flex gap-[8px] items-center relative">
              <h3 className="font-bold text-[16px] text-[var(--color-dark-blue)]">
                {t.chooseColorTitle}
              </h3>
              <input
                type="color"
                value={customColor}
                onChange={(e) => {
                  setCustomColor(e.target.value)
                  handleVariantChange("custom", e.target.value, null)
                }}
                className={`w-[30px] h-[30px] rounded-full cursor-pointer border-2 appearance-none [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded-full [&::-webkit-color-swatch]:border-none ${
                  activeColor.colorName === "custom"
                    ? theme.borderColor
                    : "border-transparent"
                }`}
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
                  className={`${theme.btnBgColor} text-white px-[80px] py-[14.5px] cursor-pointer rounded-xl text-[18px] font-semibold disabled:opacity-50`}
                  disabled={isAdding || !selectedVariant}
                >
                  {isAdding ? "..." : t.btnBuy}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && activeThumbnail && (
        <div
          className="fixed inset-0 custom-overlay bg-opacity-25 flex items-center justify-center z-50"
          onClick={handleOverlayClick}
        >
          <div className="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center">
            {!isContentLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-t-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
              </div>
            )}
            {isContentLoaded && (
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-white text-2xl font-bold p-1 pl-2 pr-2 rounded-full border border-white bg-zinc-600"
              >
                ×
              </button>
            )}
            {isVideoModal && product.mid_code ? (
              <iframe
                width="800"
                height="450"
                src={`https://www.youtube.com/embed/${product.mid_code}?autoplay=1`}
                title="Product Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-[80vw] h-[60vh] rounded-xl"
                onLoad={handleContentLoad}
              />
            ) : (
              <Image
                src={activeThumbnail}
                alt="Full-screen product image"
                width={1200}
                height={800}
                className="w-full h-full object-contain"
                onLoad={handleContentLoad}
              />
            )}
          </div>
        </div>
      )}
    </section>
  )
}

export default PreviewSection
