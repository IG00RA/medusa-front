import { HttpTypes } from "@medusajs/types"
import { getPercentageDiff } from "./get-precentage-diff"
import { convertToLocale } from "./money"

interface PriceData {
  calculated_price_number: number
  calculated_price: string
  original_price_number: number
  original_price: string
  currency_code: string
  price_type: string | null
  percentage_diff: number
}

export const getPricesForVariant = (
  variant: HttpTypes.StoreProductVariant | null
): PriceData | null => {
  if (!variant?.calculated_price?.calculated_amount) {
    return null
  }

  return {
    calculated_price_number: Number(variant.calculated_price.calculated_amount), // Гарантуємо число
    calculated_price: convertToLocale({
      amount: Number(variant.calculated_price.calculated_amount),
      currency_code: variant.calculated_price.currency_code || "",
    }),
    original_price_number: Number(variant.calculated_price.original_amount), // Гарантуємо число
    original_price: convertToLocale({
      amount: Number(variant.calculated_price.original_amount),
      currency_code: variant.calculated_price.currency_code || "",
    }),
    currency_code: variant.calculated_price.currency_code || "",
    price_type:
      variant?.calculated_price?.calculated_price?.price_list_type || "",
    percentage_diff: getPercentageDiff(
      Number(variant.calculated_price.original_amount),
      Number(variant.calculated_price.calculated_amount)
    ),
  }
}

export function getProductPrice({
  product,
  variantId,
}: {
  product: HttpTypes.StoreProduct
  variantId?: string
}): {
  product: HttpTypes.StoreProduct
  cheapestPrice: PriceData | null
  variantPrice: PriceData | null
} {
  if (!product || !product.id) {
    throw new Error("No product provided")
  }

  const cheapestPrice = (): PriceData | null => {
    if (!product || !product.variants?.length) {
      return null
    }

    const cheapestVariant = product.variants
      .filter((v) => !!v.calculated_price)
      .sort(
        (a, b) =>
          Number(a.calculated_price!.calculated_amount) -
          Number(b.calculated_price!.calculated_amount)
      )[0]

    return getPricesForVariant(cheapestVariant)
  }

  const variantPrice = (): PriceData | null => {
    if (!product || !variantId) {
      return null
    }

    const variant = product.variants?.find(
      (v) => v.id === variantId || v.sku === variantId
    )

    if (!variant) {
      return null
    }

    return getPricesForVariant(variant)
  }

  return {
    product,
    cheapestPrice: cheapestPrice(),
    variantPrice: variantPrice(),
  }
}
