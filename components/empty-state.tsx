"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusIcon, DatabaseIcon, BarChart3Icon, FileTextIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/hooks/useLanguage"

interface EmptyStateProps {
  type: "dashboard" | "devices" | "charts" | "logs"
  title?: string
  description?: string
  actionLabel?: string
  onAction?: () => void
}

export function EmptyState({ type, title, description, actionLabel, onAction }: EmptyStateProps) {
  const router = useRouter()
  const { t } = useLanguage()

  const getIcon = () => {
    switch (type) {
      case "dashboard":
        return <DatabaseIcon className="h-16 w-16 text-gray-400" />
      case "devices":
        return <DatabaseIcon className="h-16 w-16 text-gray-400" />
      case "charts":
        return <BarChart3Icon className="h-16 w-16 text-gray-400" />
      case "logs":
        return <FileTextIcon className="h-16 w-16 text-gray-400" />
      default:
        return <DatabaseIcon className="h-16 w-16 text-gray-400" />
    }
  }

  const getDefaultContent = () => {
    switch (type) {
      case "dashboard":
        return {
          title: t("dashboard.noDevicesTitle"),
          description: t("dashboard.noDevicesDescription"),
          actionLabel: t("dashboard.addFirstDevice"),
        }
      case "devices":
        return {
          title: t("devices.noDevicesTitle"),
          description: t("devices.noDevicesDescription"),
          actionLabel: t("devices.addFirstDevice"),
        }
      case "charts":
        return {
          title: t("charts.noDataTitle"),
          description: t("charts.noDataDescription"),
          actionLabel: t("charts.addDeviceForCharts"),
        }
      case "logs":
        return {
          title: t("logs.noLogsTitle"),
          description: t("logs.noLogsDescription"),
          actionLabel: t("logs.addDeviceForLogs"),
        }
      default:
        return {
          title: "No Data",
          description: "No data available",
          actionLabel: "Add Device",
        }
    }
  }

  const defaultContent = getDefaultContent()
  const finalTitle = title || defaultContent.title
  const finalDescription = description || defaultContent.description
  const finalActionLabel = actionLabel || defaultContent.actionLabel

  const handleAction = () => {
    if (onAction) {
      onAction()
    } else {
      router.push("/dashboard/devices")
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Card className="w-full max-w-md mx-auto text-center shadow-lg border-2 border-dashed border-gray-300">
        <CardHeader className="pb-4">
          <div className="flex justify-center mb-4">{getIcon()}</div>
          <CardTitle className="text-xl font-semibold text-gray-700">{finalTitle}</CardTitle>
          <CardDescription className="text-gray-500 mt-2">{finalDescription}</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <Button
            onClick={handleAction}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium px-6 py-2 rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            {finalActionLabel}
          </Button>
          <div className="mt-4 text-xs text-gray-400">{t("dashboard.getStarted")}</div>
        </CardContent>
      </Card>
    </div>
  )
}
