import { HttpTypes } from "@medusajs/types"
import { SortOptions } from "@lib/data/products"

interface MinPricedProduct extends HttpTypes.StoreProduct {
  _minPrice?: number
}

/**
 * Helper function to sort products by various criteria
 * @param products - Array of products to sort
 * @param sortBy - Sorting criteria
 * @returns Sorted array of products
 */
export function sortProducts(
  products: HttpTypes.StoreProduct[],
  sortBy: SortOptions
): HttpTypes.StoreProduct[] {
  let sortedProducts = products as MinPricedProduct[]

  switch (sortBy) {
    case "price_asc":
    case "price_desc":
      // Precompute the minimum price for each product
      sortedProducts.forEach((product) => {
        if (product.variants && product.variants.length > 0) {
          product._minPrice = Math.min(
            ...product.variants.map(
              (variant) => variant?.calculated_price?.calculated_amount || 0
            )
          )
        } else {
          product._minPrice = Infinity
        }
      })

      // Sort products based on the precomputed minimum prices
      sortedProducts.sort((a, b) => {
        const diff = (a._minPrice || Infinity) - (b._minPrice || Infinity)
        return sortBy === "price_asc" ? diff : -diff
      })
      break

    case "created_at":
      sortedProducts.sort((a, b) => {
        return (
          new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime()
        )
      })
      break

    case "popular":
      sortedProducts.sort((a, b) => {
        // Приклад: сортування за кількістю продажів або переглядів
        const salesA = Number(a.metadata?.sales || 0)
        const salesB = Number(b.metadata?.sales || 0)
        return salesB - salesA
      })
      break

    case "new":
      // Аналогічно до created_at, але можна додати додаткову логіку
      sortedProducts.sort((a, b) => {
        return (
          new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime()
        )
      })
      break

    case "personalized":
      sortedProducts.sort((a, b) => {
        // Приклад: сортування за персоналізацією
        const scoreA = Number(a.metadata?.personalization_score || 0)
        const scoreB = Number(b.metadata?.personalization_score || 0)
        return scoreB - scoreA
      })
      break

    default:
      break
  }

  return sortedProducts
}
