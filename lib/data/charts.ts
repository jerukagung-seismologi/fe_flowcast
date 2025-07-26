import { fetchDevices, type Device } from "./devices"

export interface ChartDataPoint {
  timestamp: string
  value: number
  label?: string
}

export interface WaterLevelData {
  current: ChartDataPoint[]
  historical: ChartDataPoint[]
  prediction: ChartDataPoint[]
}

export interface RainfallData {
  hourly: ChartDataPoint[]
  daily: ChartDataPoint[]
  monthly: ChartDataPoint[]
}

export interface ComparisonData {
  devices: string[]
  waterLevel: number[]
  rainfall: number[]
  temperature: number[]
}

export interface WeatherTrend {
  parameter: string
  current: number
  change: number
  trend: "up" | "down" | "stable"
  unit: string
}

// Generate mock time series data
function generateTimeSeriesData(
  baseValue: number,
  variance: number,
  points: number,
  interval = 60000, // 1 minute
): ChartDataPoint[] {
  const data: ChartDataPoint[] = []
  const now = Date.now()

  for (let i = points - 1; i >= 0; i--) {
    const timestamp = new Date(now - i * interval)
    const value = Math.max(0, baseValue + (Math.random() - 0.5) * variance)

    data.push({
      timestamp: timestamp.toISOString(),
      value: Number(value.toFixed(2)),
    })
  }

  return data
}

// Fetch water level data for charts
export async function fetchWaterLevelData(userId: string, deviceId?: string): Promise<WaterLevelData> {
  try {
    const devices = await fetchDevices(userId)

    let targetDevice: Device
    if (deviceId) {
      const device = devices.find((d) => d.id === deviceId)
      if (!device) {
        throw new Error("Device not found")
      }
      targetDevice = device
    } else {
      // Use first online device or first device
      targetDevice = devices.find((d) => d.status === "online") || devices[0]
      if (!targetDevice) {
        throw new Error("No devices found")
      }
    }

    const currentValue = targetDevice.waterLevel.value

    return {
      current: generateTimeSeriesData(currentValue, 0.5, 24, 60000), // Last 24 minutes
      historical: generateTimeSeriesData(currentValue, 1.0, 168, 3600000), // Last 7 days (hourly)
      prediction: generateTimeSeriesData(currentValue, 0.8, 12, 3600000), // Next 12 hours
    }
  } catch (error) {
    console.error("Error fetching water level data:", error)
    throw new Error("Failed to fetch water level data")
  }
}

// Fetch rainfall data for charts
export async function fetchRainfallData(userId: string, deviceId?: string): Promise<RainfallData> {
  try {
    const devices = await fetchDevices(userId)

    let targetDevice: Device
    if (deviceId) {
      const device = devices.find((d) => d.id === deviceId)
      if (!device) {
        throw new Error("Device not found")
      }
      targetDevice = device
    } else {
      targetDevice = devices.find((d) => d.status === "online") || devices[0]
      if (!targetDevice) {
        throw new Error("No devices found")
      }
    }

    const currentValue = targetDevice.rainfall.value

    return {
      hourly: generateTimeSeriesData(currentValue, 5, 24, 3600000), // Last 24 hours
      daily: generateTimeSeriesData(currentValue * 24, 20, 30, 86400000), // Last 30 days
      monthly: generateTimeSeriesData(currentValue * 24 * 30, 100, 12, 2592000000), // Last 12 months
    }
  } catch (error) {
    console.error("Error fetching rainfall data:", error)
    throw new Error("Failed to fetch rainfall data")
  }
}

// Fetch comparison data across devices
export async function fetchComparisonData(userId: string): Promise<ComparisonData> {
  try {
    const devices = await fetchDevices(userId)

    if (devices.length === 0) {
      return {
        devices: [],
        waterLevel: [],
        rainfall: [],
        temperature: [],
      }
    }

    return {
      devices: devices.map((d) => d.name),
      waterLevel: devices.map((d) => d.waterLevel.value),
      rainfall: devices.map((d) => d.rainfall.value),
      temperature: devices.map((d) => d.temperature.value),
    }
  } catch (error) {
    console.error("Error fetching comparison data:", error)
    throw new Error("Failed to fetch comparison data")
  }
}

// Fetch weather trends
export async function fetchWeatherTrends(userId: string): Promise<WeatherTrend[]> {
  try {
    const devices = await fetchDevices(userId)
    const onlineDevices = devices.filter((d) => d.status === "online")

    if (onlineDevices.length === 0) {
      return []
    }

    // Calculate averages across all online devices
    const avgWaterLevel = onlineDevices.reduce((sum, d) => sum + d.waterLevel.value, 0) / onlineDevices.length
    const avgRainfall = onlineDevices.reduce((sum, d) => sum + d.rainfall.value, 0) / onlineDevices.length
    const avgTemperature = onlineDevices.reduce((sum, d) => sum + d.temperature.value, 0) / onlineDevices.length
    const avgHumidity = onlineDevices.reduce((sum, d) => sum + d.humidity.value, 0) / onlineDevices.length
    const avgWindSpeed = onlineDevices.reduce((sum, d) => sum + d.windSpeed.value, 0) / onlineDevices.length
    const avgPressure = onlineDevices.reduce((sum, d) => sum + d.pressure.value, 0) / onlineDevices.length

    const avgWaterChange = onlineDevices.reduce((sum, d) => sum + d.waterLevel.change, 0) / onlineDevices.length
    const avgRainChange = onlineDevices.reduce((sum, d) => sum + d.rainfall.change, 0) / onlineDevices.length
    const avgTempChange = onlineDevices.reduce((sum, d) => sum + d.temperature.change, 0) / onlineDevices.length
    const avgHumidityChange = onlineDevices.reduce((sum, d) => sum + d.humidity.change, 0) / onlineDevices.length
    const avgWindChange = onlineDevices.reduce((sum, d) => sum + d.windSpeed.change, 0) / onlineDevices.length
    const avgPressureChange = onlineDevices.reduce((sum, d) => sum + d.pressure.change, 0) / onlineDevices.length

    return [
      {
        parameter: "Water Level",
        current: Number(avgWaterLevel.toFixed(2)),
        change: Number(avgWaterChange.toFixed(2)),
        trend: Math.abs(avgWaterChange) < 0.1 ? "stable" : avgWaterChange > 0 ? "up" : "down",
        unit: "m",
      },
      {
        parameter: "Rainfall",
        current: Number(avgRainfall.toFixed(1)),
        change: Number(avgRainChange.toFixed(1)),
        trend: Math.abs(avgRainChange) < 1 ? "stable" : avgRainChange > 0 ? "up" : "down",
        unit: "mm",
      },
      {
        parameter: "Temperature",
        current: Number(avgTemperature.toFixed(1)),
        change: Number(avgTempChange.toFixed(1)),
        trend: Math.abs(avgTempChange) < 0.5 ? "stable" : avgTempChange > 0 ? "up" : "down",
        unit: "°C",
      },
      {
        parameter: "Humidity",
        current: Number(avgHumidity.toFixed(0)),
        change: Number(avgHumidityChange.toFixed(1)),
        trend: Math.abs(avgHumidityChange) < 2 ? "stable" : avgHumidityChange > 0 ? "up" : "down",
        unit: "%",
      },
      {
        parameter: "Wind Speed",
        current: Number(avgWindSpeed.toFixed(1)),
        change: Number(avgWindChange.toFixed(1)),
        trend: Math.abs(avgWindChange) < 1 ? "stable" : avgWindChange > 0 ? "up" : "down",
        unit: "km/h",
      },
      {
        parameter: "Pressure",
        current: Number(avgPressure.toFixed(0)),
        change: Number(avgPressureChange.toFixed(1)),
        trend: Math.abs(avgPressureChange) < 2 ? "stable" : avgPressureChange > 0 ? "up" : "down",
        unit: "hPa",
      },
    ]
  } catch (error) {
    console.error("Error fetching weather trends:", error)
    throw new Error("Failed to fetch weather trends")
  }
}

// Fetch device performance metrics
export async function fetchDevicePerformance(
  userId: string,
  deviceId: string,
  timeRange: "24h" | "7d" | "30d" = "24h",
): Promise<{
  uptime: number
  dataPoints: number
  lastSeen: Date
  batteryTrend: ChartDataPoint[]
}> {
  try {
    const devices = await fetchDevices(userId)
    const device = devices.find((d) => d.id === deviceId)

    if (!device) {
      throw new Error("Device not found")
    }

    // Calculate time range
    let hours = 24
    switch (timeRange) {
      case "7d":
        hours = 168
        break
      case "30d":
        hours = 720
        break
    }

    // Mock performance data
    const uptime = device.status === "online" ? Math.random() * 20 + 80 : 0 // 80-100% if online
    const dataPoints = Math.floor(hours * (uptime / 100))

    // Generate battery trend
    const batteryTrend = generateTimeSeriesData(
      device.batteryLevel,
      10,
      Math.min(hours, 48), // Max 48 points
      hours <= 24 ? 1800000 : hours <= 168 ? 10800000 : 43200000, // 30min, 3h, or 12h intervals
    )

    return {
      uptime: Number(uptime.toFixed(1)),
      dataPoints,
      lastSeen: device.lastUpdate,
      batteryTrend,
    }
  } catch (error) {
    console.error("Error fetching device performance:", error)
    throw new Error("Failed to fetch device performance")
  }
}
