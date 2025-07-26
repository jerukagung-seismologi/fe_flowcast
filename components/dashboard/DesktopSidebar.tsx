import Link from "next/link"
import { CloudRain } from "lucide-react"
import type { NavigationItem } from "./types"

interface DesktopSidebarProps {
  navigation: NavigationItem[]
}

export function DesktopSidebar({ navigation }: DesktopSidebarProps) {
  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
      <div className="flex flex-col flex-grow bg-gradient-to-b from-white to-blue-50 border-r border-gray-200">
        <div className="flex items-center h-16 px-4 bg-emerald-700">
          <CloudRain className="h-8 w-8 text-white" />
          <span className="ml-2 text-lg font-bold text-white">Hidrometeorologi Portal</span>
        </div>
        <nav className="flex-1 space-y-1 px-2 py-4">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-blue-200 hover:text-blue-800 transition-all duration-200"
            >
              <item.icon className="mr-3 h-5 w-5 group-hover:text-blue-700" />
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}
