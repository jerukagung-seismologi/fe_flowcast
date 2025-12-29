import { fetchDevicesWithSensors } from "@/lib/data/LaravelSensorData"

export interface ChartDataPoint {
  timestamp: string
  timeLabel: string
  value: number
  trend?: "up" | "down" | "stable"
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
const generateTimeSeriesData = (hours: number, baseValue: number, variance: number): ChartDataPoint[] => {
  const data: ChartDataPoint[] = []
  const now = new Date()

  for (let i = hours; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000)
    const value = baseValue + (Math.random() - 0.5) * variance
    const prevValue = i < hours ? data[data.length - 1]?.value || baseValue : baseValue

    let trend: "up" | "down" | "stable" = "stable"
    if (value > prevValue + 0.1) trend = "up"
    else if (value < prevValue - 0.1) trend = "down"

    data.push({
      timestamp: timestamp.toISOString(),
      timeLabel: timestamp.toLocaleTimeString(),
      value: Math.max(0, value),
      trend,
    })
  }

  return data
}

export async function fetchWaterLevelData(userId: string, deviceId?: string): Promise<WaterLevelData> {
  try {
    const devices = await fetchDevicesWithSensors(userId)

    if (devices.length === 0) {
      return {
        current: [],
        historical: [],
        prediction: [],
      }
    }

    const targetDevice = deviceId ? devices.find((d) => d.id === deviceId) : devices[0]
    const baseValue = targetDevice?.waterLevel.value || 1.5

    return {
      current: generateTimeSeriesData(24, baseValue, 0.5),
      historical: generateTimeSeriesData(168, baseValue, 0.8), // 7 days
      prediction: generateTimeSeriesData(12, baseValue, 0.3), // 12 hours ahead
    }
  } catch (error) {
    console.error("Error fetching water level data:", error)
    return {
      current: [],
      historical: [],
      prediction: [],
    }
  }
}

export async function fetchRainfallData(userId: string, deviceId?: string): Promise<RainfallData> {
  try {
    const devices = await fetchDevicesWithSensors(userId)

    if (devices.length === 0) {
      return {
        hourly: [],
        daily: [],
        monthly: [],
      }
    }

    const targetDevice = deviceId ? devices.find((d) => d.id === deviceId) : devices[0]
    const baseValue = targetDevice?.rainfall.value || 5

    return {
      hourly: generateTimeSeriesData(24, baseValue, 10),
      daily: generateTimeSeriesData(30, baseValue * 24, 50), // 30 days
      monthly: generateTimeSeriesData(12, baseValue * 24 * 30, 200), // 12 months
    }
  } catch (error) {
    console.error("Error fetching rainfall data:", error)
    return {
      hourly: [],
      daily: [],
      monthly: [],
    }
  }
}

export async function fetchComparisonData(userId: string): Promise<ComparisonData> {
  try {
    const devices = await fetchDevicesWithSensors(userId)

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
    return {
      devices: [],
      waterLevel: [],
      rainfall: [],
      temperature: [],
    }
  }
}

export async function fetchWeatherTrends(userId: string): Promise<WeatherTrend[]> {
  try {
    const devices = await fetchDevicesWithSensors(userId)

    if (devices.length === 0) {
      return []
    }

    // Calculate averages across all devices
    const avgWaterLevel = devices.reduce((sum, d) => sum + d.waterLevel.value, 0) / devices.length
    const avgRainfall = devices.reduce((sum, d) => sum + d.rainfall.value, 0) / devices.length
    const avgTemperature = devices.reduce((sum, d) => sum + d.temperature.value, 0) / devices.length
    const avgHumidity = devices.reduce((sum, d) => sum + d.humidity.value, 0) / devices.length
    const avgWindSpeed = devices.reduce((sum, d) => sum + d.windSpeed.value, 0) / devices.length
    const avgPressure = devices.reduce((sum, d) => sum + d.pressure.value, 0) / devices.length

    // Calculate average changes
    const avgWaterChange = devices.reduce((sum, d) => sum + d.waterLevel.change, 0) / devices.length
    const avgRainChange = devices.reduce((sum, d) => sum + d.rainfall.change, 0) / devices.length
    const avgTempChange = devices.reduce((sum, d) => sum + d.temperature.change, 0) / devices.length
    const avgHumidityChange = devices.reduce((sum, d) => sum + d.humidity.change, 0) / devices.length
    const avgWindChange = devices.reduce((sum, d) => sum + d.windSpeed.change, 0) / devices.length
    const avgPressureChange = devices.reduce((sum, d) => sum + d.pressure.change, 0) / devices.length

    const getTrend = (change: number): "up" | "down" | "stable" => {
      if (change > 0.1) return "up"
      if (change < -0.1) return "down"
      return "stable"
    }

    return [
      {
        parameter: "Water Level",
        current: Number(avgWaterLevel.toFixed(2)),
        change: Number(avgWaterChange.toFixed(2)),
        trend: getTrend(avgWaterChange),
        unit: "m",
      },
      {
        parameter: "Rainfall",
        current: Number(avgRainfall.toFixed(1)),
        change: Number(avgRainChange.toFixed(1)),
        trend: getTrend(avgRainChange),
        unit: "mm",
      },
      {
        parameter: "Temperature",
        current: Number(avgTemperature.toFixed(1)),
        change: Number(avgTempChange.toFixed(1)),
        trend: getTrend(avgTempChange),
        unit: "°C",
      },
      {
        parameter: "Humidity",
        current: Number(avgHumidity.toFixed(0)),
        change: Number(avgHumidityChange.toFixed(0)),
        trend: getTrend(avgHumidityChange),
        unit: "%",
      },
      {
        parameter: "Wind Speed",
        current: Number(avgWindSpeed.toFixed(1)),
        change: Number(avgWindChange.toFixed(1)),
        trend: getTrend(avgWindChange),
        unit: "m/s",
      },
      {
        parameter: "Pressure",
        current: Number(avgPressure.toFixed(0)),
        change: Number(avgPressureChange.toFixed(0)),
        trend: getTrend(avgPressureChange),
        unit: "hPa",
      },
    ]
  } catch (error) {
    console.error("Error fetching weather trends:", error)
    return []
  }
}
