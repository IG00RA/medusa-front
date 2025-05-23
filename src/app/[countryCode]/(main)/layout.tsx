import { Metadata } from "next"

import { listCartOptions, retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import { getBaseURL } from "@lib/util/env"
import { StoreCartShippingOption } from "@medusajs/types"
import CartMismatchBanner from "@modules/layout/components/cart-mismatch-banner"
import Footer from "@modules/layout/templates/footer"
import Nav from "@modules/layout/templates/nav"
import FreeShippingPriceNudge from "@modules/shipping/components/free-shipping-price-nudge"
import Newsletter from "@/modules/layout/components/newsletter"
import SalesHitsSection from "@/modules/products/templates/sales-hits-section"
import { listProducts } from "@/lib/data/products"

export const metadata: Metadata = {
  title: "Flexifun HUB Store",
  description: "Explore - play - learn",
}
// export const metadata: Metadata = {
//   metadataBase: new URL(getBaseURL()),
// }

type Props = {
  params: Promise<{ category: string[]; countryCode: string }>
  children: React.ReactNode
}

export default async function PageLayout(props: Props) {
  const themeColors = {
    mainColor: "#f0ad4e",
    textColor: "text-[#f0ad4e]",
    bgColor: "bg-[#fff9f0]",
    btnBgColor: "bg-[#f0ad4e]",
    borderColor: "border-[#f0ad4e]",
  }
  const params = await props.params
  const { countryCode } = params
  const customer = await retrieveCustomer()
  const products = await listProducts({ countryCode })

  const cart = await retrieveCart()
  let shippingOptions: StoreCartShippingOption[] = []

  if (cart) {
    const { shipping_options } = await listCartOptions()

    shippingOptions = shipping_options
  }

  return (
    <>
      <Nav />
      {customer && cart && (
        <CartMismatchBanner customer={customer} cart={cart} />
      )}

      {cart && (
        <FreeShippingPriceNudge
          variant="popup"
          cart={cart}
          shippingOptions={shippingOptions}
        />
      )}
      {props.children}
      <SalesHitsSection
        theme={themeColors}
        products={products.response.products}
      />
      <Newsletter />
      <Footer />
    </>
  )
}
