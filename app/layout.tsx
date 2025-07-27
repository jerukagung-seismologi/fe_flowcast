import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "HydroMeteo Sense",
  description: "Platform hidrometeorologi cerdas dengan analisis data cuaca dan hidrologi",
  keywords: [
    "hidrometeorologi",
    "cuaca",
    "hidrologi",
    "analisis data",
    "HydroMeteo Sense",
    "prediksi cuaca",
    "platform cerdas",
  ],
  authors: [{ name: "HydroMeteo Team", url: "https://hydrometeo-sense.com" }],
  themeColor: "#10b981",
  icons: {
    icon: "https://img.icons8.com/color/240/heavy-rain.png",
  },
  openGraph: {
    title: "HydroMeteo Sense",
    description: "Platform hidrometeorologi cerdas dengan analisis data cuaca dan hidrologi",
    url: "https://hydrometeo-sense.com",
    siteName: "HydroMeteo Sense",
    images: [
      {
        url: "https://img.icons8.com/color/240/heavy-rain.png",
        width: 240,
        height: 240,
        alt: "HydroMeteo Sense Logo",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HydroMeteo Sense",
    description: "Platform hidrometeorologi cerdas dengan analisis data cuaca dan hidrologi",
    images: ["https://img.icons8.com/color/240/heavy-rain.png"],
    creator: "@hydrometeo_sense",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
