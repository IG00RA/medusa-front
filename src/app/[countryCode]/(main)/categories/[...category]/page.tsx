import { Metadata } from "next"
import { notFound } from "next/navigation"
import {
  ExtendedStoreProductParams,
  listProducts,
  listProductsWithSort,
  SortOptions,
} from "@lib/data/products"
import { listCategories } from "@lib/data/categories"
import { getRegion } from "@lib/data/regions"
import CategoryTemplate from "@modules/categories/templates"

type Props = {
  params: Promise<{ category: string[]; countryCode: string }>
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
    minPrice?: string
    maxPrice?: string
    query?: string
  }>
}

export async function generateStaticParams() {
  const product_categories = await listCategories()

  if (!product_categories) {
    return []
  }

  const countryCodes = await getRegion("ua").then(
    (region) => region?.countries?.map((c) => c.iso_2) || ["ua"]
  )

  const staticParams = countryCodes
    .map((countryCode) =>
      product_categories.map((category) => ({
        countryCode,
        category: category.handle.split("/"),
      }))
    )
    .flat()

  return staticParams
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const categoryHandle = params.category.join("/")
  try {
    const productCategory = await listCategories().then((categories) =>
      categories.find((c) => c.handle === categoryHandle)
    )

    if (!productCategory) {
      notFound()
    }

    const title = productCategory.name + " | FlexiHub Store"
    const description = productCategory.description ?? `${title} category.`

    return {
      title,
      description,
      alternates: {
        canonical: `${params.category.join("/")}`,
      },
    }
  } catch (error) {
    notFound()
  }
}

export default async function CategoryPage(props: Props) {
  const searchParams = await props.searchParams
  const params = await props.params
  const { sortBy, page, minPrice, maxPrice, query } = searchParams
  const { countryCode, category: categoryArray } = params
  const categoryHandle = categoryArray.join("/")

  const productCategory = await listCategories().then((categories) =>
    categories.find((c) => c.handle === categoryHandle)
  )

  if (!productCategory) {
    notFound()
  }

  const regionData = await getRegion(countryCode || "ua")
  const product_categories = await listCategories()
  const pageNumber = page ? parseInt(page) : 1

  const allProducts = await listProducts({ countryCode })

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
    category: categoryHandle,
    tags,
  })

  return (
    <CategoryTemplate
      allProducts={allProducts.response.products}
      searchParams={searchParams}
      product_categories={product_categories || []}
      products={products}
      count={count}
      regionData={regionData}
      category={productCategory}
    />
  )
}
