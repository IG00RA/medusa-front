import { HttpTypes } from "@medusajs/types"
import PreviewSection from "./preview-section"
import DescriptionSection from "./description-section"
import SalesHitsSection from "./sales-hits-section"
import { listProducts } from "@lib/data/products"
import { listCategories } from "@/lib/data/categories"

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
}

export default async function ProductTemplate({
  product,
  region,
  countryCode,
}: ProductTemplateProps) {
  if (!product || !product.id) {
    return null
  }

  const productCategories = await listCategories()

  const themeColors = {
    mainColor: "#f0ad4e",
    textColor: "text-[#f0ad4e]",
    bgColor: "bg-[#fff9f0]",
    btnBgColor: "bg-[#f0ad4e]",
    borderColor: "border-[#f0ad4e]",
  }

  const products = await listProducts({
    countryCode,
  }).then(({ response }) =>
    response.products.filter((p) => p.id !== product.id)
  )

  return (
    <main className="bg-[#F9F9F9]">
      <PreviewSection
        theme={themeColors}
        categories={productCategories}
        product={product}
        region={region}
        countryCode={countryCode}
      />
      <DescriptionSection
        categories={productCategories}
        products={products}
        theme={themeColors}
        product={product}
      />
      <SalesHitsSection theme={themeColors} products={products} />
    </main>
  )
}
