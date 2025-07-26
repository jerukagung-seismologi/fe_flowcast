"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ThermometerIcon,
  CloudRainIcon,
  WindIcon,
  GaugeIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  MinusIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  WifiIcon,
  WifiOffIcon,
  BatteryIcon,
  RefreshCwIcon,
} from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { fetchDevices, fetchDeviceStats, type Device, type DeviceStats } from "@/lib/data/devices"
import { fetchRecentAlerts, type LogEvent } from "@/lib/data/logs"
import { fetchWeatherStats } from "@/lib/data/weather"
import { useLanguage } from "@/hooks/useLanguage"

export default function DashboardPage() {
  const { user } = useAuth()
  const { t } = useLanguage()
  const [devices, setDevices] = useState<Device[]>([])
  const [deviceStats, setDeviceStats] = useState<DeviceStats | null>(null)
  const [recentAlerts, setRecentAlerts] = useState<LogEvent[]>([])
  const [weatherStats, setWeatherStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const loadDashboardData = async () => {
    if (!user?.uid) return

    try {
      setLoading(true)
      const [devicesData, statsData, alertsData, weatherData] = await Promise.all([
        fetchDevices(user.uid),
        fetchDeviceStats(user.uid),
        fetchRecentAlerts(user.uid, 5),
        fetchWeatherStats(user.uid).catch(() => null), // Weather stats are optional
      ])

      setDevices(devicesData)
      setDeviceStats(statsData)
      setRecentAlerts(alertsData)
      setWeatherStats(weatherData)
    } catch (error) {
      console.error("Error loading dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadDashboardData()
    setRefreshing(false)
  }

  useEffect(() => {
    loadDashboardData()
  }, [user?.uid])

  const getTrendIcon = (trend: string, size = "h-4 w-4") => {
    switch (trend) {
      case "up":
        return <TrendingUpIcon className={`${size} text-green-600`} />
      case "down":
        return <TrendingDownIcon className={`${size} text-red-600`} />
      default:
        return <MinusIcon className={`${size} text-gray-600`} />
    }
  }

  const getStatusColor = (status: string) => {
    return status === "online" ? "text-green-600" : "text-red-600"
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("dashboard.welcome")}</h1>
          <p className="text-muted-foreground">{t("dashboard.overview")}</p>
        </div>
        <Button
          onClick={handleRefresh}
          disabled={refreshing}
          variant="outline"
          className="bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100"
        >
          <RefreshCwIcon className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
          {t("common.refresh")}
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">{t("dashboard.totalDevices")}</CardTitle>
            <GaugeIcon className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{deviceStats?.totalDevices || 0}</div>
            <p className="text-xs text-blue-600">{t("dashboard.connectedStations")}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">{t("dashboard.onlineDevices")}</CardTitle>
            <WifiIcon className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{deviceStats?.onlineDevices || 0}</div>
            <p className="text-xs text-green-600">{t("dashboard.activeNow")}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-800">{t("dashboard.alerts")}</CardTitle>
            <AlertTriangleIcon className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">{deviceStats?.alertDevices || 0}</div>
            <p className="text-xs text-orange-600">{t("dashboard.needsAttention")}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-800">{t("dashboard.avgBattery")}</CardTitle>
            <BatteryIcon className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">{deviceStats?.avgBatteryLevel || 0}%</div>
            <p className="text-xs text-purple-600">{t("dashboard.batteryLevel")}</p>
          </CardContent>
        </Card>
      </div>

      {/* Device Status Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Active Devices */}
        <Card className="shadow-lg border-l-4 border-l-blue-500">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
            <CardTitle className="flex items-center text-blue-800">
              <WifiIcon className="h-5 w-5 mr-2 text-blue-600" />
              {t("dashboard.activeDevices")}
            </CardTitle>
            <CardDescription className="text-blue-600">{t("dashboard.realTimeMonitoring")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {devices.filter((d) => d.status === "online").length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">{t("dashboard.noActiveDevices")}</div>
            ) : (
              devices
                .filter((d) => d.status === "online")
                .slice(0, 3)
                .map((device) => (
                  <div
                    key={device.id}
                    className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg"
                  >
                    <div>
                      <h4 className="font-medium text-gray-800">{device.name}</h4>
                      <p className="text-sm text-gray-600">{device.location}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="default" className="bg-gradient-to-r from-green-500 to-emerald-500">
                        <WifiIcon className="h-3 w-3 mr-1" />
                        Online
                      </Badge>
                      <div className="text-right">
                        <div className="text-sm font-medium">{device.waterLevel.value.toFixed(1)}m</div>
                        <div className="flex items-center">
                          {getTrendIcon(device.waterLevel.trend, "h-3 w-3")}
                          <span className="text-xs ml-1">
                            {device.waterLevel.change > 0 ? "+" : ""}
                            {device.waterLevel.change.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
            )}
          </CardContent>
        </Card>

        {/* Recent Alerts */}
        <Card className="shadow-lg border-l-4 border-l-red-500">
          <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50">
            <CardTitle className="flex items-center text-red-800">
              <AlertTriangleIcon className="h-5 w-5 mr-2 text-red-600" />
              {t("dashboard.recentAlerts")}
            </CardTitle>
            <CardDescription className="text-red-600">{t("dashboard.systemNotifications")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentAlerts.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                <CheckCircleIcon className="h-8 w-8 mx-auto mb-2 text-green-500" />
                {t("dashboard.noRecentAlerts")}
              </div>
            ) : (
              recentAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-start space-x-3 p-3 bg-gradient-to-r from-red-50 to-pink-50 rounded-lg"
                >
                  <AlertTriangleIcon className="h-4 w-4 text-red-600 mt-1" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">{alert.message}</p>
                    <p className="text-xs text-gray-600">
                      {new Date(alert.timestamp).toLocaleString()} • {alert.device}
                    </p>
                  </div>
                  <Badge variant="destructive" className="text-xs">
                    {alert.severity}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Weather Overview */}
      {weatherStats && (
        <Card className="shadow-lg border-l-4 border-l-green-500">
          <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50">
            <CardTitle className="flex items-center text-green-800">
              <CloudRainIcon className="h-5 w-5 mr-2 text-green-600" />
              {t("dashboard.weatherOverview")}
            </CardTitle>
            <CardDescription className="text-green-600">{t("dashboard.currentConditions")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg">
                <ThermometerIcon className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                <div className="text-lg font-bold text-blue-800">{weatherStats.averageTemperature}°C</div>
                <div className="text-xs text-blue-600">{t("dashboard.avgTemp")}</div>
              </div>
              <div className="text-center p-3 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg">
                <CloudRainIcon className="h-6 w-6 mx-auto mb-2 text-green-600" />
                <div className="text-lg font-bold text-green-800">{weatherStats.totalRainfall}mm</div>
                <div className="text-xs text-green-600">{t("dashboard.totalRain")}</div>
              </div>
              <div className="text-center p-3 bg-gradient-to-br from-orange-100 to-red-100 rounded-lg">
                <AlertTriangleIcon className="h-6 w-6 mx-auto mb-2 text-orange-600" />
                <div className="text-lg font-bold text-orange-800">{weatherStats.activeAlerts}</div>
                <div className="text-xs text-orange-600">{t("dashboard.activeAlerts")}</div>
              </div>
              <div className="text-center p-3 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg">
                <WindIcon className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                <div className="text-lg font-bold text-purple-800">{weatherStats.extremeEvents}</div>
                <div className="text-xs text-purple-600">{t("dashboard.extremeEvents")}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Device Performance Summary */}
      <Card className="shadow-lg border-l-4 border-l-indigo-500">
        <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
          <CardTitle className="flex items-center text-indigo-800">
            <GaugeIcon className="h-5 w-5 mr-2 text-indigo-600" />
            {t("dashboard.systemStatus")}
          </CardTitle>
          <CardDescription className="text-indigo-600">{t("dashboard.overallHealth")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {devices.map((device) => (
              <div key={device.id} className="p-4 bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-800 truncate">{device.name}</h4>
                  <div className={`flex items-center ${getStatusColor(device.status)}`}>
                    {device.status === "online" ? (
                      <WifiIcon className="h-4 w-4" />
                    ) : (
                      <WifiOffIcon className="h-4 w-4" />
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{t("dashboard.waterLevel")}:</span>
                    <div className="flex items-center">
                      <span className="font-medium">{device.waterLevel.value.toFixed(1)}m</span>
                      {getTrendIcon(device.waterLevel.trend, "h-3 w-3 ml-1")}
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{t("dashboard.battery")}:</span>
                    <span className={`font-medium ${device.batteryLevel < 30 ? "text-red-600" : "text-green-600"}`}>
                      {device.batteryLevel}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{t("dashboard.lastUpdate")}:</span>
                    <span className="text-xs text-gray-500">{new Date(device.lastUpdate).toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
