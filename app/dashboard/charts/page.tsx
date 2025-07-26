"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import {
  TrendingUpIcon,
  TrendingDownIcon,
  DropletIcon,
  ThermometerIcon,
  CloudRainIcon,
  GaugeIcon,
  EyeIcon,
  RefreshCwIcon,
} from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import {
  fetchWaterLevelData,
  fetchRainfallData,
  fetchComparisonData,
  fetchWeatherTrends,
  type WaterLevelData,
  type RainfallData,
  type ComparisonData,
  type WeatherTrend,
} from "@/lib/data/charts"
import { fetchDevices, type Device } from "@/lib/data/FetchingDevices"
import { EmptyState } from "@/components/empty-state"
import LoadingSpinner from "@/components/LoadingSpinner"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"]

export default function ChartsPage() {
  const { user } = useAuth()
  const [devices, setDevices] = useState<Device[]>([])
  const [selectedDevice, setSelectedDevice] = useState<string>("all")
  const [waterLevelData, setWaterLevelData] = useState<WaterLevelData | null>(null)
  const [rainfallData, setRainfallData] = useState<RainfallData | null>(null)
  const [comparisonData, setComparisonData] = useState<ComparisonData | null>(null)
  const [weatherTrends, setWeatherTrends] = useState<WeatherTrend[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const loadChartsData = async () => {
    if (!user?.uid) return

    try {
      setLoading(true)
      const [devicesData, waterData, rainData, compData, trendsData] = await Promise.all([
        fetchDevices(user.uid),
        fetchWaterLevelData(user.uid, selectedDevice !== "all" ? selectedDevice : undefined),
        fetchRainfallData(user.uid, selectedDevice !== "all" ? selectedDevice : undefined),
        fetchComparisonData(user.uid),
        fetchWeatherTrends(user.uid),
      ])

      setDevices(devicesData)
      setWaterLevelData(waterData)
      setRainfallData(rainData)
      setComparisonData(compData)
      setWeatherTrends(trendsData)
    } catch (error) {
      console.error("Error loading charts data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadChartsData()
    setRefreshing(false)
  }

  useEffect(() => {
    loadChartsData()
  }, [user?.uid, selectedDevice])

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUpIcon className="h-4 w-4 text-green-600" />
      case "down":
        return <TrendingDownIcon className="h-4 w-4 text-red-600" />
      default:
        return <GaugeIcon className="h-4 w-4 text-gray-600" />
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

  if (loading) {
    return <LoadingSpinner />
  }

  // Show empty state if no devices
  if (!devices || devices.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Analitik & Grafik</h1>
            <p className="text-muted-foreground">Visualisasi data canggih dengan analisis tren</p>
          </div>
        </div>
        <EmptyState type="charts" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analitik & Grafik</h1>
          <p className="text-muted-foreground">Visualisasi data canggih dengan analisis tren</p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={selectedDevice} onValueChange={setSelectedDevice}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Pilih Perangkat" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Perangkat</SelectItem>
              {devices.map((device) => (
                <SelectItem key={device.id} value={device.id}>
                  {device.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={handleRefresh}
            disabled={refreshing}
            variant="outline"
            className="bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100"
          >
            <RefreshCwIcon className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Weather Trends Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {weatherTrends.map((trend, index) => (
          <Card
            key={trend.parameter}
            className="bg-gradient-to-br from-blue-50 to-cyan-50 border-l-4 border-l-blue-500"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-800">{trend.parameter}</CardTitle>
              {getTrendIcon(trend.trend)}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">
                {trend.current} {trend.unit}
              </div>
              <div className={`text-xs flex items-center ${getTrendColor(trend.trend)}`}>
                {trend.change > 0 ? "+" : ""}
                {trend.change} {trend.unit} dari jam terakhir
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Water Level Chart */}
      {waterLevelData && (
        <Card className="shadow-lg border-l-4 border-l-blue-500">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
            <CardTitle className="flex items-center text-blue-800">
              <DropletIcon className="h-5 w-5 mr-2 text-blue-600" />
              Tren Tinggi Air
            </CardTitle>
            <CardDescription className="text-blue-600">Monitoring tinggi air real-time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={waterLevelData.current}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" tickFormatter={(value) => new Date(value).toLocaleTimeString()} />
                  <YAxis />
                  <Tooltip
                    labelFormatter={(value) => new Date(value).toLocaleString()}
                    formatter={(value: number) => [`${value.toFixed(2)}m`, "Tinggi Air"]}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={2} name="Tinggi Air" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Rainfall Chart */}
      {rainfallData && (
        <Card className="shadow-lg border-l-4 border-l-green-500">
          <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50">
            <CardTitle className="flex items-center text-green-800">
              <CloudRainIcon className="h-5 w-5 mr-2 text-green-600" />
              Analisis Curah Hujan
            </CardTitle>
            <CardDescription className="text-green-600">Data presipitasi dan intensitas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={rainfallData.hourly}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" tickFormatter={(value) => new Date(value).toLocaleTimeString()} />
                  <YAxis />
                  <Tooltip
                    labelFormatter={(value) => new Date(value).toLocaleString()}
                    formatter={(value: number) => [`${value.toFixed(1)}mm`, "Curah Hujan"]}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#16a34a"
                    fill="#16a34a"
                    fillOpacity={0.3}
                    name="Curah Hujan"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Device Comparison */}
      {comparisonData && comparisonData.devices.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="shadow-lg border-l-4 border-l-purple-500">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
              <CardTitle className="flex items-center text-purple-800">
                <GaugeIcon className="h-5 w-5 mr-2 text-purple-600" />
                Perbandingan Perangkat
              </CardTitle>
              <CardDescription className="text-purple-600">Analisis lintas perangkat</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={comparisonData.devices.map((device, index) => ({
                      device,
                      waterLevel: comparisonData.waterLevel[index],
                      rainfall: comparisonData.rainfall[index],
                      temperature: comparisonData.temperature[index],
                    }))}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="device" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="waterLevel" fill="#2563eb" name="Tinggi Air" />
                    <Bar dataKey="rainfall" fill="#16a34a" name="Curah Hujan" />
                    <Bar dataKey="temperature" fill="#dc2626" name="Suhu" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-l-4 border-l-orange-500">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50">
              <CardTitle className="flex items-center text-orange-800">
                <ThermometerIcon className="h-5 w-5 mr-2 text-orange-600" />
                Distribusi Suhu
              </CardTitle>
              <CardDescription className="text-orange-600">Suhu perangkat</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={comparisonData.devices.map((device, index) => ({
                        name: device,
                        value: comparisonData.temperature[index],
                      }))}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value.toFixed(1)}°C`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {comparisonData.devices.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => [`${value.toFixed(1)}°C`, "Suhu"]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Historical Data Analysis */}
      {waterLevelData && (
        <Card className="shadow-lg border-l-4 border-l-indigo-500">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
            <CardTitle className="flex items-center text-indigo-800">
              <EyeIcon className="h-5 w-5 mr-2 text-indigo-600" />
              Analisis Historis
            </CardTitle>
            <CardDescription className="text-indigo-600">Tren mingguan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={waterLevelData.historical}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" tickFormatter={(value) => new Date(value).toLocaleDateString()} />
                  <YAxis />
                  <Tooltip
                    labelFormatter={(value) => new Date(value).toLocaleString()}
                    formatter={(value: number) => [`${value.toFixed(2)}m`, "Tinggi Air"]}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2} name="Data Historis" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Prediction Chart */}
      {waterLevelData && (
        <Card className="shadow-lg border-l-4 border-l-yellow-500">
          <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50">
            <CardTitle className="flex items-center text-yellow-800">
              <TrendingUpIcon className="h-5 w-5 mr-2 text-yellow-600" />
              Prediksi
            </CardTitle>
            <CardDescription className="text-yellow-600">Data prakiraan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={waterLevelData.prediction}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" tickFormatter={(value) => new Date(value).toLocaleTimeString()} />
                  <YAxis />
                  <Tooltip
                    labelFormatter={(value) => new Date(value).toLocaleString()}
                    formatter={(value: number) => [`${value.toFixed(2)}m`, "Level Prediksi"]}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Prediksi"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
