import { Metadata } from "next"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import StoreTemplate from "@modules/store/templates"
import { listProductsWithSort } from "@lib/data/products"
import { listCategories } from "@lib/data/categories"
import { getRegion } from "@lib/data/regions"
import { HttpTypes } from "@medusajs/types"

export const metadata: Metadata = {
  title: "Store",
  description: "Explore all of our products.",
}

type Params = {
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
    category?: string
    minPrice?: string
    maxPrice?: string
    query?: string
  }>
  params: Promise<{
    countryCode: string
    locale: string
  }>
}

export default async function StorePage(props: Params) {
  const params = await props.params
  const searchParams = await props.searchParams
  const { countryCode } = params
  const { sortBy, page, category } = searchParams

  const regionData = await getRegion(countryCode || "ua")
  const product_categories = await listCategories()
  const pageNumber = page ? parseInt(page) : 1

  const queryParams: HttpTypes.FindParams & HttpTypes.StoreProductParams = {
    limit: 12,
    region_id: regionData?.id,
  }

  let order: string | undefined
  if (sortBy === "created_at") {
    order = "created_at"
  } else if (sortBy === "price_asc" || sortBy === "price_desc") {
    order = sortBy
  }

  if (order) {
    queryParams["order"] = order
  }

  const {
    response: { products, count },
  } = await listProductsWithSort({
    page: pageNumber,
    queryParams,
    sortBy,
    countryCode,
  })

  return (
    <StoreTemplate
      searchParams={searchParams}
      product_categories={product_categories || []}
      products={products}
      count={count}
      regionData={regionData}
    />
  )
}
