"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
} from "recharts"
import { TrendingUp, Droplets, CloudRain, TrendingDown, Minus } from "lucide-react"

export default function ChartsPage() {
  const [selectedDevice, setSelectedDevice] = useState("1")
  const [timeRange, setTimeRange] = useState("24h")

  // Generate sample data with trend indicators
  const generateWaterLevelData = () => {
    const data = []
    const now = new Date()
    const hours = timeRange === "24h" ? 24 : timeRange === "7d" ? 168 : 720

    for (let i = hours; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60 * 60 * 1000)
      const waterLevel = Math.max(0, 2 + Math.sin(i * 0.1) * 0.8 + Math.random() * 0.4)
      const prevValue = i < hours ? data[data.length - 1]?.waterLevel || waterLevel : waterLevel

      let trend = "stable"
      if (waterLevel > prevValue + 0.1) trend = "up"
      else if (waterLevel < prevValue - 0.1) trend = "down"

      data.push({
        time: time.toISOString(),
        timeLabel:
          timeRange === "24h"
            ? time.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
            : time.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        waterLevel,
        threshold: 3.0,
        trend,
      })
    }
    return data
  }

  const generateRainfallData = () => {
    const data = []
    const now = new Date()
    const hours = timeRange === "24h" ? 24 : timeRange === "7d" ? 168 : 720

    for (let i = hours; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60 * 60 * 1000)
      const rainfall = Math.max(0, Math.random() * 20)

      data.push({
        time: time.toISOString(),
        timeLabel:
          timeRange === "24h"
            ? time.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
            : time.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        rainfall,
      })
    }
    return data
  }

  const generateComparisonData = () => {
    const data = []
    const now = new Date()
    const hours = 24

    for (let i = hours; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60 * 60 * 1000)
      data.push({
        time: time.toISOString(),
        timeLabel: time.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
        device1: Math.max(0, 2 + Math.sin(i * 0.1) * 0.8 + Math.random() * 0.4),
        device2: Math.max(0, 1.5 + Math.cos(i * 0.15) * 0.6 + Math.random() * 0.3),
        device3: Math.max(0, 1.8 + Math.sin(i * 0.08) * 0.5 + Math.random() * 0.2),
      })
    }
    return data
  }

  const [waterLevelData, setWaterLevelData] = useState(generateWaterLevelData())
  const [rainfallData, setRainfallData] = useState(generateRainfallData())
  const [comparisonData, setComparisonData] = useState(generateComparisonData())

  useEffect(() => {
    setWaterLevelData(generateWaterLevelData())
    setRainfallData(generateRainfallData())
  }, [timeRange])

  const devices = [
    { id: "1", name: "Weather Station Jakarta Utara" },
    { id: "2", name: "Weather Station Jakarta Barat" },
    { id: "3", name: "Weather Station Jakarta Selatan" },
  ]

  const chartConfig = {
    waterLevel: {
      label: "Water Level",
      color: "hsl(var(--chart-1))",
    },
    threshold: {
      label: "Threshold",
      color: "hsl(var(--chart-2))",
    },
    rainfall: {
      label: "Rainfall",
      color: "hsl(var(--chart-3))",
    },
    device1: {
      label: "Jakarta Utara",
      color: "hsl(var(--chart-1))",
    },
    device2: {
      label: "Jakarta Barat",
      color: "hsl(var(--chart-2))",
    },
    device3: {
      label: "Jakarta Selatan",
      color: "hsl(var(--chart-3))",
    },
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-600" />
      default:
        return <Minus className="h-4 w-4 text-gray-600" />
    }
  }

  const currentTrend =
    waterLevelData.length > 0 ? waterLevelData[waterLevelData.length - 1]?.trend || "stable" : "stable"

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analitik & Tren Cerdas</h1>
          <p className="text-muted-foreground">Visualisasi data canggih dengan analisis tren intelijen</p>
        </div>
        <div className="flex gap-4">
          <Select value={selectedDevice} onValueChange={setSelectedDevice}>
            <SelectTrigger className="w-48 border-blue-200 focus:border-blue-500">
              <SelectValue placeholder="Select device" />
            </SelectTrigger>
            <SelectContent>
              {devices.map((device) => (
                <SelectItem key={device.id} value={device.id}>
                  {device.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32 border-purple-200 focus:border-purple-500">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">24 Hours</SelectItem>
              <SelectItem value="7d">7 Days</SelectItem>
              <SelectItem value="30d">30 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Water Level Chart with Trend Indicator */}
      <Card className="shadow-lg border-l-4 border-l-blue-500">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
          <CardTitle className="flex items-center justify-between text-blue-800">
            <div className="flex items-center">
              <Droplets className="h-5 w-5 mr-2 text-blue-600" />
              Tren Tinggi Air
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm">Current Trend:</span>
              {getTrendIcon(currentTrend)}
            </div>
          </CardTitle>
          <CardDescription className="text-blue-600">
            Monitoring tinggi air real-time dengan analisis tren
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={waterLevelData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timeLabel" tick={{ fontSize: 12 }} interval="preserveStartEnd" />
                <YAxis
                  tick={{ fontSize: 12 }}
                  label={{ value: "Water Level (m)", angle: -90, position: "insideLeft" }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="waterLevel"
                  stroke="var(--color-waterLevel)"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="threshold"
                  stroke="var(--color-threshold)"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Rainfall Chart */}
      <Card className="shadow-lg border-l-4 border-l-green-500">
        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
          <CardTitle className="flex items-center text-green-800">
            <CloudRain className="h-5 w-5 mr-2 text-green-600" />
            Analisis Curah Hujan
          </CardTitle>
          <CardDescription className="text-green-600">Pola curah hujan dan monitoring intensitas</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rainfallData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timeLabel" tick={{ fontSize: 12 }} interval="preserveStartEnd" />
                <YAxis tick={{ fontSize: 12 }} label={{ value: "Rainfall (mm)", angle: -90, position: "insideLeft" }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="rainfall" fill="var(--color-rainfall)" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Multi-Station Comparison */}
      <Card className="shadow-lg border-l-4 border-l-purple-500">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50">
          <CardTitle className="flex items-center text-purple-800">
            <TrendingUp className="h-5 w-5 mr-2 text-purple-600" />
            Intelijen Multi-Stasiun
          </CardTitle>
          <CardDescription className="text-purple-600">
            Analisis komparatif lintas stasiun monitoring cuaca
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timeLabel" tick={{ fontSize: 12 }} interval="preserveStartEnd" />
                <YAxis
                  tick={{ fontSize: 12 }}
                  label={{ value: "Water Level (m)", angle: -90, position: "insideLeft" }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="device1"
                  stackId="1"
                  stroke="var(--color-device1)"
                  fill="var(--color-device1)"
                  fillOpacity={0.3}
                />
                <Area
                  type="monotone"
                  dataKey="device2"
                  stackId="2"
                  stroke="var(--color-device2)"
                  fill="var(--color-device2)"
                  fillOpacity={0.3}
                />
                <Area
                  type="monotone"
                  dataKey="device3"
                  stackId="3"
                  stroke="var(--color-device3)"
                  fill="var(--color-device3)"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
