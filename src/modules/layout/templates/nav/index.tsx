import { Suspense } from "react"
import { listRegions } from "@lib/data/regions"
import { retrieveCart } from "@lib/data/cart"
import { StoreRegion } from "@medusajs/types"
import { listCategories } from "@lib/data/categories"
import NavClient from "../../components/nav-client"

export default async function Nav() {
  const regions = await listRegions().then((regions: StoreRegion[]) => regions)
  const cart = await retrieveCart().catch(() => null)
  const productCategories = await listCategories()

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NavClient regions={regions} cart={cart} categories={productCategories} />
    </Suspense>
  )
}
