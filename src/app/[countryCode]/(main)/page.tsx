import { Metadata } from "next"

import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"
import MoreThanPrintSection from "@/modules/layout/components/home/MoreThanPrintSection"
import OurWareSection from "@/modules/layout/components/home/OurWareSection"
import PrintOnDemandSection from "@/modules/layout/components/home/PrintOnDemandSection"
import WhyFlexiFunSection from "@/modules/layout/components/home/WhyFlexiFunSection"
import EcologySection from "@/modules/layout/components/home/EcologySection"

export const metadata: Metadata = {
  title: "Flexifun HUB Store",
  description: "Explore - play - learn",
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params

  const { countryCode } = params

  const region = await getRegion(countryCode)

  const { collections } = await listCollections({
    fields: "id, handle, title",
  })

  if (!collections || !region) {
    return null
  }

  return (
    <>
      <MoreThanPrintSection />
      <EcologySection />
      <OurWareSection />
      <PrintOnDemandSection />
      {/* <SalesHitsSection /> */}
      <WhyFlexiFunSection />
      {/* <Hero />
      <div className="py-12">
        <ul className="flex flex-col gap-x-6">
          <FeaturedProducts collections={collections} region={region} />
        </ul>
      </div> */}
    </>
  )
}
