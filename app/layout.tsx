import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "HydroMeteo Sense",
  description: "Platform hidrometeorologi cerdas dengan analisis data cuaca dan hidrologi",
  themeColor: "#10b981",
  icons: {
    icon: "https://img.icons8.com/color/240/heavy-rain.png",
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
