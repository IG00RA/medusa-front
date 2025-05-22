import { Metadata } from "next"
import StoreTemplate from "@modules/store/templates"
import {
  ExtendedStoreProductParams,
  listProductsWithSort,
  SortOptions,
} from "@lib/data/products"
import { listCategories } from "@lib/data/categories"
import { getRegion } from "@lib/data/regions"

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
    filter?: string
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
  const { sortBy, page, category, minPrice, maxPrice, query } = searchParams

  const regionData = await getRegion(countryCode || "ua")
  const product_categories = await listCategories()
  const pageNumber = page ? parseInt(page) : 1

  const queryParams: ExtendedStoreProductParams = {
    limit: 12,
    region_id: regionData?.id,
  }

  let tags: string[] | undefined
  if (sortBy === "popular" || sortBy === "new" || sortBy === "personalized") {
    tags = [sortBy]
  }

  const {
    response: { products, count },
  } = await listProductsWithSort({
    page: pageNumber,
    queryParams,
    sortBy: sortBy as SortOptions,
    countryCode,
    searchQuery: query,
    minPrice: minPrice ? parseInt(minPrice) : undefined,
    maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
    category,
    tags,
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
