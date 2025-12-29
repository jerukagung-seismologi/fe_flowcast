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
  WindIcon, // Assuming WindIcon for pressure or humidity
} from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import {
  fetchWaterLevelData,
  fetchRainfallData,
  fetchComparisonData,
  fetchWeatherTrends,
  fetchTemperatureData, // Import new fetcher
  fetchHumidityData, // Import new fetcher
  fetchPressureData, // Import new fetcher
  type WaterLevelData,
  type RainfallData,
  type ComparisonData,
  type WeatherTrend,
  type TemperatureData, // Import new type
  type HumidityData, // Import new type
  type PressureData, // Import new type
} from "@/lib/data/charts"
import { fetchDevices, type Device } from "@/lib/data/LaravelDevices"
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
  const [temperatureData, setTemperatureData] = useState<TemperatureData | null>(null)
  const [humidityData, setHumidityData] = useState<HumidityData | null>(null)
  const [pressureData, setPressureData] = useState<PressureData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const loadChartsData = async () => {
    if (!user?.id) return

    try {
      setLoading(true)
      const [
        devicesData,
        waterData,
        rainData,
        compData,
        trendsData,
        tempData,
        humData,
        pressData,
      ] = await Promise.all([
        fetchDevices(String(user.id)),
        fetchWaterLevelData(String(user.id), selectedDevice !== "all" ? selectedDevice : undefined),
        fetchRainfallData(String(user.id), selectedDevice !== "all" ? selectedDevice : undefined),
        fetchComparisonData(String(user.id)),
        fetchWeatherTrends(String(user.id)),
        fetchTemperatureData(String(user.id), selectedDevice !== "all" ? selectedDevice : undefined),
        fetchHumidityData(String(user.id), selectedDevice !== "all" ? selectedDevice : undefined),
        fetchPressureData(String(user.id), selectedDevice !== "all" ? selectedDevice : undefined),
      ])

      setDevices(devicesData)
      setWaterLevelData(waterData)
      setRainfallData(rainData)
      setComparisonData(compData)
      setWeatherTrends(trendsData)
      setTemperatureData(tempData)
      setHumidityData(humData)
      setPressureData(pressData)
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
  }, [user?.id, selectedDevice])

  const getVariableIcon = (parameter: string) => {
    if (parameter.toLowerCase().includes("air")) {
      return <DropletIcon className="h-4 w-4 text-blue-600" />
    }
    if (parameter.toLowerCase().includes("hujan")) {
      return <CloudRainIcon className="h-4 w-4 text-green-600" />
    }
    if (parameter.toLowerCase().includes("suhu")) {
      return <ThermometerIcon className="h-4 w-4 text-red-600" />
    }
    if (parameter.toLowerCase().includes("kelembapan")) {
      return <GaugeIcon className="h-4 w-4 text-cyan-600" />
    }
    if (parameter.toLowerCase().includes("tekanan")) {
      return <WindIcon className="h-4 w-4 text-gray-600" />
    }
    return <GaugeIcon className="h-4 w-4 text-gray-600" />
  }

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
              {getVariableIcon(trend.parameter)}
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

      {/* Temperature and Dew Point Chart */}
      {temperatureData && (
        <Card className="shadow-lg border-l-4 border-l-red-500">
          <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50">
            <CardTitle className="flex items-center text-red-800">
              <ThermometerIcon className="h-5 w-5 mr-2 text-red-600" />
              Tren Suhu & Titik Embun
            </CardTitle>
            <CardDescription className="text-red-600">Monitoring suhu dan titik embun</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={temperatureData.current}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" tickFormatter={(value) => new Date(value).toLocaleTimeString()} />
                  <YAxis />
                  <Tooltip
                    labelFormatter={(value) => new Date(value).toLocaleString()}
                    formatter={(value: number, name: string) => [`${value.toFixed(1)}°C`, name]}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="temperature"
                    stroke="#dc2626"
                    strokeWidth={2}
                    name="Suhu"
                  />
                  <Line
                    type="monotone"
                    dataKey="dewpoint"
                    stroke="#2563eb"
                    strokeWidth={2}
                    name="Titik Embun"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Humidity Chart */}
      {humidityData && (
        <Card className="shadow-lg border-l-4 border-l-cyan-500">
          <CardHeader className="bg-gradient-to-r from-cyan-50 to-sky-50">
            <CardTitle className="flex items-center text-cyan-800">
              <GaugeIcon className="h-5 w-5 mr-2 text-cyan-600" />
              Kelembapan Udara
            </CardTitle>
            <CardDescription className="text-cyan-600">Data kelembapan relatif</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={humidityData.current}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" tickFormatter={(value) => new Date(value).toLocaleTimeString()} />
                  <YAxis unit="%" />
                  <Tooltip
                    labelFormatter={(value) => new Date(value).toLocaleString()}
                    formatter={(value: number) => [`${value.toFixed(1)}%`, "Kelembapan"]}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#0891b2"
                    fill="#0891b2"
                    fillOpacity={0.3}
                    name="Kelembapan"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pressure Chart */}
      {pressureData && (
        <Card className="shadow-lg border-l-4 border-l-gray-500">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50">
            <CardTitle className="flex items-center text-gray-800">
              <WindIcon className="h-5 w-5 mr-2 text-gray-600" />
              Tekanan Udara
            </CardTitle>
            <CardDescription className="text-gray-600">Data tekanan atmosfer</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={pressureData.current}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" tickFormatter={(value) => new Date(value).toLocaleTimeString()} />
                  <YAxis domain={["dataMin - 2", "dataMax + 2"]} unit=" hPa" />
                  <Tooltip
                    labelFormatter={(value) => new Date(value).toLocaleString()}
                    formatter={(value: number) => [`${value.toFixed(1)} hPa`, "Tekanan"]}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#475569"
                    strokeWidth={2}
                    name="Tekanan Udara"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Device Comparison */}
      {/* {comparisonData && comparisonData.devices.length > 0 && (
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
      )} */}

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
