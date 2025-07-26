"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Droplets,
  Thermometer,
  Gauge,
  AlertTriangle,
  CheckCircle,
  Clock,
  Wind,
  Cloud,
  TrendingUp,
  TrendingDown,
  Minus,
  Battery,
  MapPin,
  Calendar,
  Wifi,
  WifiOff,
} from "lucide-react"

export default function DashboardPage() {
  const [devices, setDevices] = useState([
    {
      id: 1,
      name: "Weather Station Jakarta Utara",
      location: "Kelapa Gading",
      status: "online",
      registrationDate: "2023-03-15",
      batteryLevel: 87,
      coordinates: { lat: -6.1588, lng: 106.9056 },
      waterLevel: { value: 2.3, trend: "up", change: 0.2 },
      rainfall: { value: 15.2, trend: "down", change: -2.1 },
      temperature: { value: 28.5, trend: "up", change: 1.3 },
      humidity: { value: 78, trend: "stable", change: 0.1 },
      windSpeed: { value: 12.5, trend: "up", change: 2.8 },
      pressure: { value: 1012, trend: "down", change: -3.2 },
      lastUpdate: new Date(Date.now() - 5 * 60 * 1000),
      threshold: 3.0,
    },
    {
      id: 2,
      name: "Weather Station Jakarta Barat",
      location: "Cengkareng",
      status: "online",
      registrationDate: "2023-01-22",
      batteryLevel: 92,
      coordinates: { lat: -6.1373, lng: 106.7395 },
      waterLevel: { value: 1.8, trend: "stable", change: 0.0 },
      rainfall: { value: 8.7, trend: "up", change: 3.2 },
      temperature: { value: 29.1, trend: "down", change: -0.8 },
      humidity: { value: 82, trend: "up", change: 4.1 },
      windSpeed: { value: 8.2, trend: "stable", change: -0.1 },
      pressure: { value: 1011, trend: "up", change: 1.8 },
      lastUpdate: new Date(Date.now() - 2 * 60 * 1000),
      threshold: 2.5,
    },
    {
      id: 3,
      name: "Weather Station Jakarta Selatan",
      location: "Kemang",
      status: "offline",
      registrationDate: "2022-11-08",
      batteryLevel: 23,
      coordinates: { lat: -6.2615, lng: 106.8106 },
      waterLevel: { value: 0.0, trend: "stable", change: 0.0 },
      rainfall: { value: 0.0, trend: "stable", change: 0.0 },
      temperature: { value: 0.0, trend: "stable", change: 0.0 },
      humidity: { value: 0, trend: "stable", change: 0.0 },
      windSpeed: { value: 0.0, trend: "stable", change: 0.0 },
      pressure: { value: 0, trend: "stable", change: 0.0 },
      lastUpdate: new Date(Date.now() - 30 * 60 * 1000),
      threshold: 2.0,
    },
  ])

  const [stats, setStats] = useState({
    totalDevices: 3,
    onlineDevices: 2,
    alertDevices: 0,
    avgBatteryLevel: 0,
  })

  useEffect(() => {
    const onlineDevices = devices.filter((d) => d.status === "online").length
    const alertDevices = devices.filter((d) => d.waterLevel.value > d.threshold).length
    const avgBatteryLevel = devices.reduce((sum, d) => sum + d.batteryLevel, 0) / devices.length

    setStats({
      totalDevices: devices.length,
      onlineDevices,
      alertDevices,
      avgBatteryLevel: Number(avgBatteryLevel.toFixed(1)),
    })
  }, [devices])

  const formatTimeAgo = (date: Date) => {
    const minutes = Math.floor((Date.now() - date.getTime()) / (1000 * 60))
    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    return `${hours}h ago`
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-3 w-3 text-green-600" />
      case "down":
        return <TrendingDown className="h-3 w-3 text-red-600" />
      default:
        return <Minus className="h-3 w-3 text-gray-600" />
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "up":
        return "text-green-600"
      case "down":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const getBatteryColor = (level: number) => {
    if (level > 60) return "text-green-600 bg-green-100"
    if (level > 30) return "text-orange-600 bg-orange-100"
    return "text-red-600 bg-red-100"
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Total Stasiun</CardTitle>
            <Gauge className="h-4 w-4 text-white" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.totalDevices}</div>
            <p className="text-xs text-blue-100">Stasiun monitoring cuaca</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Stasiun Online</CardTitle>
            <CheckCircle className="h-4 w-4 text-white" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.onlineDevices}</div>
            <p className="text-xs text-green-100">Saat ini aktif</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-red-500 to-pink-500 text-white border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Stasiun Siaga</CardTitle>
            <AlertTriangle className="h-4 w-4 text-white" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.alertDevices}</div>
            <p className="text-xs text-red-100">Di atas ambang batas</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-orange-500 to-amber-500 text-white border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Rata-rata Baterai</CardTitle>
            <Battery className="h-4 w-4 text-white" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.avgBatteryLevel}%</div>
            <p className="text-xs text-orange-100">Semua stasiun</p>
          </CardContent>
        </Card>
      </div>

      {/* Device Status Cards */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Status Stasiun & Tren</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {devices.map((device) => (
            <Card
              key={device.id}
              className={`${device.status === "offline" ? "border-red-300 bg-gradient-to-br from-red-50 to-pink-50" : "border-green-300 bg-gradient-to-br from-green-50 to-blue-50"} shadow-lg hover:shadow-xl transition-all duration-300`}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{device.name}</CardTitle>
                  <Badge
                    variant={device.status === "online" ? "default" : "destructive"}
                    className={
                      device.status === "online"
                        ? "bg-gradient-to-r from-green-500 to-emerald-500"
                        : "bg-gradient-to-r from-red-500 to-pink-500"
                    }
                  >
                    {device.status === "online" ? (
                      <Wifi className="h-3 w-3 mr-1" />
                    ) : (
                      <WifiOff className="h-3 w-3 mr-1" />
                    )}
                    {device.status}
                  </Badge>
                </div>
                <CardDescription className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1 text-blue-500" />
                  {device.location}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Device Metadata */}
                <div className="grid grid-cols-2 gap-2 p-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg">
                  <div className="flex items-center text-xs">
                    <Calendar className="h-3 w-3 mr-1 text-purple-600" />
                    <span className="text-gray-600">Reg: {device.registrationDate}</span>
                  </div>
                  <div className="flex items-center text-xs">
                    <Battery className={`h-3 w-3 mr-1 ${getBatteryColor(device.batteryLevel).split(" ")[0]}`} />
                    <span className={`font-medium ${getBatteryColor(device.batteryLevel).split(" ")[0]}`}>
                      {device.batteryLevel}%
                    </span>
                  </div>
                  <div className="flex items-center text-xs col-span-2">
                    <MapPin className="h-3 w-3 mr-1 text-blue-600" />
                    <span className="text-gray-600">
                      {device.coordinates.lat.toFixed(4)}, {device.coordinates.lng.toFixed(4)}
                    </span>
                  </div>
                </div>

                {/* Weather Parameters with Trends */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center p-2 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg">
                    <div className="flex items-center justify-center mb-1">
                      <Droplets className="h-4 w-4 text-blue-600 mr-1" />
                      {getTrendIcon(device.waterLevel.trend)}
                    </div>
                    <div className="text-sm font-medium text-blue-800">{device.waterLevel.value}m</div>
                    <div className={`text-xs ${getTrendColor(device.waterLevel.trend)}`}>
                      {device.waterLevel.change > 0 ? "+" : ""}
                      {device.waterLevel.change}
                    </div>
                    <div className="text-xs text-blue-600">Water</div>
                  </div>
                  <div className="text-center p-2 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg">
                    <div className="flex items-center justify-center mb-1">
                      <Gauge className="h-4 w-4 text-green-600 mr-1" />
                      {getTrendIcon(device.rainfall.trend)}
                    </div>
                    <div className="text-sm font-medium text-green-800">{device.rainfall.value}mm</div>
                    <div className={`text-xs ${getTrendColor(device.rainfall.trend)}`}>
                      {device.rainfall.change > 0 ? "+" : ""}
                      {device.rainfall.change}
                    </div>
                    <div className="text-xs text-green-600">Rain</div>
                  </div>
                  <div className="text-center p-2 bg-gradient-to-br from-orange-100 to-red-100 rounded-lg">
                    <div className="flex items-center justify-center mb-1">
                      <Thermometer className="h-4 w-4 text-orange-600 mr-1" />
                      {getTrendIcon(device.temperature.trend)}
                    </div>
                    <div className="text-sm font-medium text-orange-800">{device.temperature.value}°C</div>
                    <div className={`text-xs ${getTrendColor(device.temperature.trend)}`}>
                      {device.temperature.change > 0 ? "+" : ""}
                      {device.temperature.change}
                    </div>
                    <div className="text-xs text-orange-600">Temp</div>
                  </div>
                  <div className="text-center p-2 bg-gradient-to-br from-purple-100 to-violet-100 rounded-lg">
                    <div className="flex items-center justify-center mb-1">
                      <Cloud className="h-4 w-4 text-purple-600 mr-1" />
                      {getTrendIcon(device.humidity.trend)}
                    </div>
                    <div className="text-sm font-medium text-purple-800">{device.humidity.value}%</div>
                    <div className={`text-xs ${getTrendColor(device.humidity.trend)}`}>
                      {device.humidity.change > 0 ? "+" : ""}
                      {device.humidity.change}
                    </div>
                    <div className="text-xs text-purple-600">Humidity</div>
                  </div>
                  <div className="text-center p-2 bg-gradient-to-br from-yellow-100 to-amber-100 rounded-lg">
                    <div className="flex items-center justify-center mb-1">
                      <Wind className="h-4 w-4 text-yellow-600 mr-1" />
                      {getTrendIcon(device.windSpeed.trend)}
                    </div>
                    <div className="text-sm font-medium text-yellow-800">{device.windSpeed.value}m/s</div>
                    <div className={`text-xs ${getTrendColor(device.windSpeed.trend)}`}>
                      {device.windSpeed.change > 0 ? "+" : ""}
                      {device.windSpeed.change}
                    </div>
                    <div className="text-xs text-yellow-600">Wind</div>
                  </div>
                  <div className="text-center p-2 bg-gradient-to-br from-gray-100 to-zinc-100 rounded-lg">
                    <div className="flex items-center justify-center mb-1">
                      <Gauge className="h-4 w-4 text-gray-600 mr-1" />
                      {getTrendIcon(device.pressure.trend)}
                    </div>
                    <div className="text-sm font-medium text-gray-800">{device.pressure.value}hPa</div>
                    <div className={`text-xs ${getTrendColor(device.pressure.trend)}`}>
                      {device.pressure.change > 0 ? "+" : ""}
                      {device.pressure.change}
                    </div>
                    <div className="text-xs text-gray-600">Pressure</div>
                  </div>
                </div>

                <div className="flex items-center text-xs text-muted-foreground">
                  <Clock className="h-3 w-3 mr-1" />
                  Last update: {formatTimeAgo(device.lastUpdate)}
                </div>

                {device.waterLevel.value > device.threshold && (
                  <div className="flex items-center text-xs text-red-700 bg-gradient-to-r from-red-100 to-pink-100 p-2 rounded border border-red-200">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Water level above threshold ({device.threshold}m)
                  </div>
                )}

                {device.batteryLevel < 30 && (
                  <div className="flex items-center text-xs text-orange-700 bg-gradient-to-r from-orange-100 to-yellow-100 p-2 rounded border border-orange-200">
                    <Battery className="h-3 w-3 mr-1" />
                    Low battery - maintenance required
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
