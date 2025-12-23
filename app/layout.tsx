import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "@/styles/globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "FlowCast",
  description: "Platform hidrometeorologi cerdas dengan analisis data cuaca dan hidrologi",
  keywords: [
    "hidrometeorologi",
    "cuaca",
    "hidrologi",
    "analisis data",
    "FlowCast",
    "prediksi cuaca",
    "platform cerdas",
  ],
  authors: [{ name: "FlowCast Team", url: "https://flowcast.com" }],
  themeColor: "#10b981",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "FlowCast",
    description: "Platform hidrometeorologi cerdas dengan analisis data cuaca dan hidrologi",
    url: "https://flowcast.com",
    siteName: "FlowCast",
    images: [
      {
        url: "/favicon.ico",
        width: 240,
        height: 240,
        alt: "FlowCast Logo",
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
