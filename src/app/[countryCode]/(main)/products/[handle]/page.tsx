import { Metadata } from "next"
import { notFound } from "next/navigation"
import { sdk } from "@lib/config"
import { getRegion } from "@lib/data/regions"
import { listRegions } from "@lib/data/regions"
import { listProducts } from "@lib/data/products"
import ProductTemplate from "@modules/products/templates"
import { HttpTypes } from "@medusajs/types"

type Props = {
  params: Promise<{ countryCode: string; handle: string }>
}

export async function generateStaticParams() {
  try {
    const countryCodes = await listRegions().then((regions) =>
      regions?.map((r) => r.countries?.map((c) => c.iso_2)).flat()
    )

    if (!countryCodes) {
      return []
    }

    const promises = countryCodes.map(async (country) => {
      const { response } = await listProducts({
        countryCode: country,
        queryParams: { limit: 100, fields: "handle" },
      })

      return {
        country,
        products: response.products,
      }
    })

    const countryProducts = await Promise.all(promises)

    return countryProducts
      .flatMap((countryData) =>
        countryData.products.map((product) => ({
          countryCode: countryData.country,
          handle: product.handle,
        }))
      )
      .filter((param) => param.handle)
  } catch (error) {
    console.error(
      `Failed to generate static paths for product pages: ${
        error instanceof Error ? error.message : "Unknown error"
      }.`
    )
    return []
  }
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const { handle, countryCode } = params
  const region = await getRegion(countryCode)

  if (!region) {
    notFound()
  }

  // Fetch product by handle using sdk.client.fetch
  const { product } = await sdk.client
    .fetch<{ product: HttpTypes.StoreProduct }>(`/store/products/${handle}`, {
      query: {
        region_id: region.id,
        fields: "id,title,handle,thumbnail,description",
      },
      headers: {
        "x-publishable-key":
          process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
      },
      cache: "no-store",
    })
    .catch(() => ({ product: null }))

  if (!product) {
    notFound()
  }

  return {
    title: `${product.title} | Medusa Store`,
    description: `${product.title}`,
    openGraph: {
      title: `${product.title} | Medusa Store`,
      description: `${product.title}`,
      images: product.thumbnail ? [product.thumbnail] : [],
    },
  }
}

export default async function ProductPage(props: Props) {
  const params = await props.params
  const { countryCode, handle } = params
  const region = await getRegion(countryCode)

  if (!region) {
    notFound()
  }

  // Fetch product by handle using sdk.client.fetch
  const { product: pricedProduct } = await sdk.client
    .fetch<{ product: HttpTypes.StoreProduct }>(`/store/products/${handle}`, {
      query: {
        region_id: region.id,
        fields:
          "id,title,handle,thumbnail,description,*variants.calculated_price,+variants.inventory_quantity,+metadata,+tags",
      },
      headers: {
        "x-publishable-key":
          process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
      },
      cache: "no-store",
    })
    .catch(() => ({ product: null }))

  if (!pricedProduct) {
    notFound()
  }

  return (
    <ProductTemplate
      product={pricedProduct}
      region={region}
      countryCode={countryCode}
    />
  )
}
