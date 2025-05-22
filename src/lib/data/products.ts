"use server"

import { sdk } from "@lib/config"
import { sortProducts } from "@lib/util/sort-products"
import { HttpTypes } from "@medusajs/types"
import { getAuthHeaders, getCacheOptions } from "./cookies"
import { getRegion, retrieveRegion } from "./regions"
import { getProductPrice } from "../util/get-product-price"

export type SortOptions =
  | "created_at"
  | "price_asc"
  | "price_desc"
  | "popular"
  | "new"
  | "personalized"

export interface ExtendedStoreProductParams
  extends HttpTypes.FindParams,
    HttpTypes.StoreProductParams {
  q?: string
}

export const listProducts = async ({
  pageParam = 1,
  queryParams,
  countryCode,
  regionId,
}: {
  pageParam?: number
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
  countryCode?: string
  regionId?: string
}): Promise<{
  response: { products: HttpTypes.StoreProduct[]; count: number }
  nextPage: number | null
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
}> => {
  if (!countryCode && !regionId) {
    throw new Error("Country code or region ID is required")
  }

  const limit = queryParams?.limit || 12
  const _pageParam = Math.max(pageParam, 1)
  const offset = _pageParam === 1 ? 0 : (_pageParam - 1) * limit

  let region: HttpTypes.StoreRegion | undefined | null

  if (countryCode) {
    region = await getRegion(countryCode)
  } else {
    region = await retrieveRegion(regionId!)
  }

  if (!region) {
    return {
      response: { products: [], count: 0 },
      nextPage: null,
    }
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("products")),
  }

  return sdk.client
    .fetch<{ products: HttpTypes.StoreProduct[]; count: number }>(
      `/store/products`,
      {
        method: "GET",
        query: {
          limit,
          offset,
          region_id: region?.id,
          fields:
            "*variants.calculated_price,+variants.inventory_quantity,+metadata,+tags",
          ...queryParams,
        },
        headers,
        next,
        // cache: "force-cache",
        cache: "no-store",
      }
    )
    .then(({ products, count }) => {
      const nextPage = count > offset + limit ? pageParam + 1 : null

      return {
        response: {
          products,
          count,
        },
        nextPage: nextPage,
        queryParams,
      }
    })
}

export const listProductsWithSort = async ({
  page = 0,
  queryParams,
  sortBy = "created_at",
  countryCode,
  searchQuery,
  minPrice,
  maxPrice,
  category,
  tags,
}: {
  page?: number
  queryParams?: ExtendedStoreProductParams
  sortBy?: SortOptions
  countryCode: string
  searchQuery?: string
  minPrice?: number
  maxPrice?: number
  category?: string
  tags?: string[]
}): Promise<{
  response: { products: HttpTypes.StoreProduct[]; count: number }
  nextPage: number | null
  queryParams?: ExtendedStoreProductParams
}> => {
  const limit = queryParams?.limit || 12

  const region = await getRegion(countryCode)
  if (!region) {
    return {
      response: { products: [], count: 0 },
      nextPage: null,
      queryParams,
    }
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("products")),
  }

  const query: ExtendedStoreProductParams = {
    limit,
    offset: (page - 1) * limit,
    region_id: region.id,
    fields:
      "*variants.calculated_price,+variants.inventory_quantity,+metadata,+tags,+categories",
    ...queryParams,
  }

  // Додавання пошуку за назвою
  if (searchQuery) {
    query.q = searchQuery
  }

  const { products, count } = await sdk.client.fetch<{
    products: HttpTypes.StoreProduct[]
    count: number
  }>(`/store/products`, {
    method: "GET",
    query,
    headers,
    next,
    cache: "no-store",
  })

  // Клієнтська фільтрація
  let filteredProducts = products

  // Фільтрація за тегами
  if (tags && tags.length > 0) {
    filteredProducts = filteredProducts.filter((product) =>
      product.tags?.some((tag) => tags.includes(tag.value))
    )
  }

  // Фільтрація за категорією
  if (category) {
    filteredProducts = filteredProducts.filter((product) =>
      product.categories?.some((cat) => cat.handle === category)
    )
  }

  // Фільтрація за ціною
  if (minPrice !== undefined || maxPrice !== undefined) {
    filteredProducts = filteredProducts.filter((product) => {
      const { cheapestPrice } = getProductPrice({ product })
      const price = cheapestPrice?.calculated_price_number ?? 0
      return (
        (minPrice === undefined || price >= minPrice) &&
        (maxPrice === undefined || price <= maxPrice)
      )
    })
  }

  const nextPage = count > (page - 1) * limit + limit ? page + 1 : null

  // Сортування на клієнтській стороні
  let sortedProducts = filteredProducts
  if (
    sortBy === "popular" ||
    sortBy === "new" ||
    sortBy === "personalized" ||
    sortBy === "created_at" ||
    sortBy === "price_asc" ||
    sortBy === "price_desc"
  ) {
    sortedProducts = sortProducts(filteredProducts, sortBy)
  }

  // Обмеження кількості товарів на сторінці
  const paginatedProducts = sortedProducts.slice(0, limit)

  return {
    response: {
      products: paginatedProducts,
      count: filteredProducts.length,
    },
    nextPage,
    queryParams,
  }
}
