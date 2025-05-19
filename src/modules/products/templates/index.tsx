import { HttpTypes } from "@medusajs/types"
import PreviewSection from "./preview-section"
import DescriptionSection from "./description-section"
import SalesHitsSection from "./sales-hits-section"
import { listProducts } from "@lib/data/products"

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

  const themeColors = {
    mainColor: "#f0ad4e",
    textColor: "text-[#f0ad4e]",
    bgColor: "bg-[#fff9f0]",
    btnBgColor: "bg-[#f0ad4e]",
    borderColor: "border-[#f0ad4e]",
  }

  const queryParams: HttpTypes.StoreProductParams = {}
  if (region?.id) {
    queryParams.region_id = region.id
  }
  if (product.collection_id) {
    queryParams.collection_id = [product.collection_id]
  }
  if (product.tags) {
    queryParams.tag_id = product.tags
      .map((t) => t.id)
      .filter(Boolean) as string[]
  }
  queryParams.is_giftcard = false

  const products = await listProducts({
    queryParams,
    countryCode,
  }).then(({ response }) =>
    response.products.filter((p) => p.id !== product.id)
  )

  return (
    <main className="bg-[#F9F9F9]">
      <PreviewSection
        theme={themeColors}
        product={product}
        region={region}
        countryCode={countryCode}
      />
      <DescriptionSection theme={themeColors} product={product} />
      <SalesHitsSection
        theme={themeColors}
        product={product}
        countryCode={countryCode}
        products={products}
      />
    </main>
  )
}
