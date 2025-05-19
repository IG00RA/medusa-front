import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import "styles/globals.css"
import { Poppins } from "next/font/google"

export const metadata: Metadata = {
  title: "Flexifun HUB Store",
  description: "Explore - play - learn",
}

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
})

// export const metadata: Metadata = {
//   metadataBase: new URL(getBaseURL()),
// }

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="light">
      <body className={`antialiased ${poppins.className} text-sm`}>
        <main className="relative">{props.children}</main>
      </body>
    </html>
  )
}
