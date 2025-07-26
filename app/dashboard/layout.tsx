"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { LayoutDashboard, Settings, FileText, BarChart3 } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { signOutUser } from "@/lib/FetchingAuth"
import { MobileSidebar } from "@/components/dashboard/MobileSidebar"
import { DesktopSidebar } from "@/components/dashboard/DesktopSidebar"
import { Topbar } from "@/components/dashboard/Topbar"
import type { NavigationItem } from "@/components/dashboard/types"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, profile, loading } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  const handleLogout = async () => {
    try {
      await signOutUser()
      router.push("/login")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const navigation: NavigationItem[] = [
    { name: "Beranda", href: "/dashboard", icon: LayoutDashboard },
    { name: "Perangkat", href: "/dashboard/devices", icon: Settings },
    { name: "Grafik", href: "/dashboard/charts", icon: BarChart3 },
    { name: "Log", href: "/dashboard/logs", icon: FileText },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <MobileSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} navigation={navigation} />
      <DesktopSidebar navigation={navigation} />

      {/* Main content */}
      <div className="lg:pl-64">
        <Topbar user={user} profile={profile} setSidebarOpen={setSidebarOpen} handleLogout={handleLogout} />

        {/* Page content */}
        <main className="py-6">
          <div className="px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
            