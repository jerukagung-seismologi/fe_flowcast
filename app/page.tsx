"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  CloudRain,
  BarChart3,
  Bell,
  ArrowRight,
  Play,
  Star,
  Clock,
  TrendingUp,
  TrendingDown,
  Activity,
  MapPin,
  Battery,
  Calendar,
  Minus,
} from "lucide-react"

export default function LandingPage() {

  const features = [
    {
      icon: <TrendingUp className="h-8 w-8 text-green-600" />,
      title: "Analisis Tren",
      description: "Identifikasi pola cuaca yang sedang berkembang dengan indikator tren visual yang intuitif.",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: <MapPin className="h-8 w-8 text-blue-600" />,
      title: "Metadata Perangkat",
      description: "Akses informasi perangkat yang komprehensif termasuk tanggal registrasi, status operasional, dan level baterai.",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: <CloudRain className="h-8 w-8 text-indigo-600" />,
      title: "Pemantauan Multi-Parameter",
      description: "Lacak berbagai parameter cuaca secara bersamaan untuk analisis yang lebih mendalam.",
      gradient: "from-indigo-500 to-purple-500",
    },
    {
      icon: <Battery className="h-8 w-8 text-orange-600" />,
      title: "Kesehatan Perangkat",
      description: "Pantau kesehatan dan konektivitas perangkat secara real-time untuk memastikan keandalan data.",
      gradient: "from-orange-500 to-red-500",
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-purple-600" />,
      title: "Analitik Tingkat Lanjut",
      description: "Manfaatkan analitik canggih untuk wawasan prediktif dan pengambilan keputusan yang lebih baik.",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: <Bell className="h-8 w-8 text-red-600" />,
      title: "Peringatan Cerdas",
      description: "Terima peringatan otomatis untuk peristiwa cuaca penting dan anomali perangkat.",
      gradient: "from-red-500 to-rose-500",
    },
  ]

  const trendFeatures = [
    {
      icon: <TrendingUp className="h-6 w-6 text-green-600" />,
      title: "Tren Naik",
      description: "Indikator visual untuk peningkatan parameter cuaca.",
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      icon: <TrendingDown className="h-6 w-6 text-red-600" />,
      title: "Tren Turun",
      description: "Indikator visual untuk penurunan parameter cuaca.",
      color: "text-red-600",
      bg: "bg-red-100",
    },
    {
      icon: <Minus className="h-6 w-6 text-gray-600" />,
      title: "Tren Stabil",
      description: "Indikator visual untuk parameter cuaca yang stabil.",
      color: "text-gray-600",
      bg: "bg-gray-100",
    },
    {
      icon: <Activity className="h-6 w-6 text-blue-600" />,
      title: "Volatilitas",
      description: "Indikator visual untuk fluktuasi parameter cuaca yang tidak menentu.",
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
  ]

  const metadataFeatures = [
    {
      icon: <Calendar className="h-6 w-6 text-purple-600" />,
      title: "Tanggal Registrasi",
      description: "Riwayat instalasi dan pengoperasian perangkat",
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
    {
      icon: <Activity className="h-6 w-6 text-green-600" />,
      title: "Status Operasional",
      description: "Kesehatan dan konektivitas perangkat secara real-time",
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      icon: <Battery className="h-6 w-6 text-orange-600" />,
      title: "Level Baterai",
      description: "Status daya dan penjadwalan pemeliharaan",
      color: "text-orange-600",
      bg: "bg-orange-100",
    },
    {
      icon: <MapPin className="h-6 w-6 text-blue-600" />,
      title: "Koordinat GPS",
      description: "Data lokasi yang tepat dan integrasi pemetaan",
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
  ]

  const benefits = [
    {
      icon: <TrendingUp className="h-6 w-6 text-green-600" />,
      title: "Kecerdasan Prediktif",
      description: "Analisis tren memungkinkan pengambilan keputusan proaktif dan strategi intervensi dini.",
    },
    {
      icon: <MapPin className="h-6 w-6 text-blue-600" />,
      title: "Visibilitas Perangkat Lengkap",
      description: "Metadata komprehensif memberikan transparansi operasional penuh dan wawasan pemeliharaan.",
    },
    {
      icon: <Clock className="h-6 w-6 text-purple-600" />,
      title: "Konteks Historis",
      description: "Tanggal registrasi dan riwayat operasional memungkinkan analisis tren jangka panjang.",
    },
    {
      icon: <Battery className="h-6 w-6 text-orange-600" />,
      title: "Pemeliharaan Proaktif",
      description: "Pemantauan baterai dan pelacakan kesehatan perangkat mencegah waktu henti yang tidak terduga.",
    },
  ]

  const testimonials = [
    {
      name: "Dr. Elena Rodriguez",
      role: "Kepala Meteorolog",
      company: "Badan Meteorologi Nasional",
      content:
        "Indikator tren dan metadata perangkat komprehensif telah merevolusi pemantauan cuaca kami. Kami sekarang dapat memprediksi pola cuaca berminggu-minggu sebelumnya.",
      rating: 5,
    },
    {
      name: "Prof. Ahmad Hassan",
      role: "Ahli Hidrologi",
      company: "Institut Sumber Daya Air",
      content:
        "Memiliki informasi perangkat lengkap termasuk level baterai dan koordinat yang tepat telah meningkatkan efisiensi pemeliharaan kami hingga 300%.",
      rating: 5,
    },
    {
      name: "Sarah Kim",
      role: "Direktur Manajemen Darurat",
      company: "Otoritas Bencana Regional",
      content:
        "Indikator tren visual membantu tim kami dengan cepat mengidentifikasi pola cuaca yang berkembang dan merespons lebih cepat terhadap potensi bencana.",
      rating: 5,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                <CloudRain className="h-6 w-6 text-white" />
              </div>
              <span className="ml-3 text-xl font-bold text-gray-900">Infraseis Hidrometeorologi</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                  Masuk
                </Button>
              </Link>
              <Link href="/login">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Mulai
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <Badge className="mb-6 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border-blue-200">
              <TrendingUp className="h-3 w-3 mr-1" />
              Analisis Tren & Intelijen Perangkat
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Intelijen Cuaca Cerdas dengan Analisis Tren
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-4xl mx-auto">
              Platform kami menyediakan analisis tren visual dan metadata perangkat yang komprehensif untuk pemantauan
              hidrometeorologi yang tak tertandingi.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-3"
                >
                  Mulai Memantau
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-3 border-gray-300 hover:bg-gray-50 bg-transparent"
              >
                <Play className="mr-2 h-5 w-5" />
                Tonton Demo
              </Button>
            </div>
          </div>
        </div>

        {/* Hero Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-32 h-32 bg-purple-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-cyan-200 rounded-full opacity-20 animate-pulse delay-2000"></div>
          <div className="absolute top-60 right-1/4 w-24 h-24 bg-green-200 rounded-full opacity-20 animate-pulse delay-3000"></div>
        </div>
      </section>

      {/* Trend Analysis Section */}
      <section className="py-16 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Indikator Tren Visual</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Segera pahami pola data dengan indikator visual yang intuitif
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendFeatures.map((feature, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
              >
                <div className={`w-12 h-12 ${feature.bg} rounded-lg flex items-center justify-center mb-4`}>
                  {feature.icon}
                </div>
                <h3 className={`text-lg font-semibold ${feature.color} mb-2`}>{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Device Metadata Section */}
      <section className="py-16 bg-gradient-to-r from-purple-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Intelijen Perangkat Komprehensif</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Visibilitas operasional lengkap untuk setiap perangkat pemantauan
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {metadataFeatures.map((feature, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
              >
                <div className={`w-12 h-12 ${feature.bg} rounded-lg flex items-center justify-center mb-4`}>
                  {feature.icon}
                </div>
                <h3 className={`text-lg font-semibold ${feature.color} mb-2`}>{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Fitur Intelijen Tingkat Lanjut</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Pemantauan cuaca komprehensif dengan analisis tren cerdas dan manajemen perangkat lengkap
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50"
              >
                <CardHeader>
                  <div
                    className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-lg flex items-center justify-center mb-4`}
                  >
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl text-gray-900">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Mengapa Memilih Intelijen Cuaca Cerdas?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Fitur canggih yang mengubah cara Anda memantau dan memahami pola cuaca
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-white rounded-lg shadow-md flex items-center justify-center">
                  {benefit.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-white mb-2">30,000+</div>
              <div className="text-blue-100">Stasiun Cuaca Cerdas</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">200+</div>
              <div className="text-blue-100">Negara yang Dipantau</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">99.9%</div>
              <div className="text-blue-100">Akurasi Tren</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">24/7</div>
              <div className="text-blue-100">Pemantauan Cerdas</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Dipercaya oleh Profesional Cuaca</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Lihat bagaimana analisis tren dan intelijen perangkat mengubah pemantauan cuaca
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">"{testimonial.content}"</p>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">
                      {testimonial.role} di {testimonial.company}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Siap untuk Meningkatkan Pemantauan Cuaca Anda?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Dapatkan akses instan ke analisis tren canggih dan intelijen perangkat yang komprehensif.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-3"
              >
                Mulai Memantau Sekarang
                <TrendingUp className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-3 border-gray-300 hover:bg-gray-50 bg-transparent"
              >
                Akses Dasbor
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                  <CloudRain className="h-6 w-6 text-white" />
                </div>
                <span className="ml-3 text-xl font-bold">Infraseis Hidrometeorologi</span>
              </div>
              <p className="text-gray-400">
                Intelijen hidrometeorologi cerdas dengan analisis tren canggih dan manajemen perangkat yang komprehensif.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Intelijen</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Analisis Tren
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Intelijen Perangkat
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Analitik Prediktif
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Peringatan Cerdas
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Pemantauan</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Pola Cuaca
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Kesehatan Perangkat
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Status Baterai
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Pelacakan Lokasi
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Dukungan</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Dokumentasi
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Referensi API
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Pelatihan
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Dukungan Teknis
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Infraseis Hidrometeorologi. Hak Cipta Dilindungi.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
