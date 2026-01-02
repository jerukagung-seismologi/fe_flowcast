"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  ChevronsLeft,
  MenuIcon,
  Plus,
  PlusCircle,
  Search,
  Settings,
  Trash,
  CloudRain,
  Wind,
  Gauge,
  Eye,
  Bell,
  TrendingUp
} from "lucide-react"

export default function LandingPage() {
  const functions = [
    {
      icon: <CloudRain className="h-6 w-6 text-blue-600" />,
      title: "Pemantauan Data",
      description: "Mengumpulkan dan menampilkan curah hujan, tinggi muka air, dan debit.",
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-green-600" />,
      title: "Analisis Tren",
      description: "Menilai tren naik, turun, atau stabil untuk mendukung keputusan.",
    },
    {
      icon: <Bell className="h-6 w-6 text-red-600" />,
      title: "Peringatan",
      description: "Notifikasi otomatis untuk anomali dan potensi risiko banjir.",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center gap-x-2">
                <Link href="/" className="flex items-center gap-x-2">
                  <img src="/apple-touch-icon.png" alt="logo" className="h-10 w-10" />
                </Link>
              </div>
              <span className="ml-3 text-xl font-bold text-gray-900">FlowCast</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                  Masuk
                </Button>
              </Link>
              <Link href="/login">
                <Button className="bg-blue-600 hover:bg-blue-700">Mulai</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Platform Pemantauan Hidrometeorologi & Banjir
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8">
            FlowCast membantu instansi atau pemangku kepentingan memahami kondisi aliran sungai melalui pemantauan langsung,
            analisis tren, dan peringatan dini untuk mendukung peringatan dini bencana.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button size="lg" className="bg-green-700 hover:bg-green-800 text-lg px-8 py-3">
                Mulai Memantau
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="text-lg px-8 py-3 border-gray-300 hover:bg-gray-50 bg-transparent">
                Akses Dasbor
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Fungsi Utama */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-8">Fungsi Utama FlowCast</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {functions.map((f, i) => (
              <div
                key={i}
                className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    {f.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{f.title}</h3>
                </div>
                <p className="text-gray-600 text-sm">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Fokus pada informasi yang Anda butuhkan
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Masuk untuk melihat data, tren, dan peringatan yang relevan di wilayah Anda.
          </p>
          <Link href="/login">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3">
              Masuk & Akses FlowCast
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-4">
              <div className="flex items-center gap-x-2">
                <Link href="/" className="flex items-center gap-x-2">
                  <img src="/apple-touch-icon.png" alt="logo" className="h-10 w-10" />
                </Link>
              </div>
            <span className="ml-3 text-xl font-bold">FlowCast</span>
          </div>
          <p className="text-gray-400">
            Pemantauan hidrometeorologi sederhana: data, tren, dan peringatan untuk keputusan yang lebih cepat.
          </p>
          <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-500 text-sm">
            <p>&copy; {new Date().getFullYear()} FlowCast. Hak Cipta Dilindungi.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
