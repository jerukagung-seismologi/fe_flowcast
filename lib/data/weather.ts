import { fetchDevices } from "./devices"

export interface WeatherData {
  location: string
  current: {
    temperature: number
    humidity: number
    pressure: number
    windSpeed: number
    windDirection: string
    visibility: number
    uvIndex: number
    condition: string
    icon: string
  }
  forecast: WeatherForecast[]
  alerts: WeatherAlert[]
}

export interface WeatherForecast {
  date: string
  high: number
  low: number
  condition: string
  icon: string
  precipitation: number
  humidity: number
  windSpeed: number
}

export interface WeatherAlert {
  id: string
  type: "flood" | "storm" | "heat" | "wind"
  severity: "low" | "medium" | "high" | "extreme"
  title: string
  description: string
  startTime: Date
  endTime: Date
  affectedAreas: string[]
}

export interface ClimateData {
  temperature: {
    average: number
    trend: "warming" | "cooling" | "stable"
    anomaly: number
  }
  precipitation: {
    total: number
    trend: "increasing" | "decreasing" | "stable"
    anomaly: number
  }
  extremeEvents: {
    heatWaves: number
    floods: number
    droughts: number
    storms: number
  }
}

// Fetch current weather data
export async function fetchWeatherData(userId: string, location?: string): Promise<WeatherData> {
  try {
    // If no location provided, use first device location
    if (!location) {
      const devices = await fetchDevices(userId)
      if (devices.length === 0) {
        throw new Error("No devices found to determine location")
      }
      location = devices[0].location
    }

    // Mock weather data (in production, this would call a weather API)
    const mockWeatherData: WeatherData = {
      location,
      current: {
        temperature: 28 + Math.random() * 4, // 28-32°C
        humidity: 70 + Math.random() * 20, // 70-90%
        pressure: 1010 + Math.random() * 10, // 1010-1020 hPa
        windSpeed: 5 + Math.random() * 10, // 5-15 km/h
        windDirection: ["N", "NE", "E", "SE", "S", "SW", "W", "NW"][Math.floor(Math.random() * 8)],
        visibility: 8 + Math.random() * 2, // 8-10 km
        uvIndex: Math.floor(Math.random() * 11), // 0-10
        condition: ["Sunny", "Partly Cloudy", "Cloudy", "Rainy"][Math.floor(Math.random() * 4)],
        icon: "sun",
      },
      forecast: generateForecast(),
      alerts: generateWeatherAlerts(location),
    }

    return mockWeatherData
  } catch (error) {
    console.error("Error fetching weather data:", error)
    throw new Error("Failed to fetch weather data")
  }
}

// Generate weather forecast
function generateForecast(): WeatherForecast[] {
  const forecast: WeatherForecast[] = []
  const conditions = ["Sunny", "Partly Cloudy", "Cloudy", "Rainy", "Thunderstorms"]

  for (let i = 0; i < 7; i++) {
    const date = new Date()
    date.setDate(date.getDate() + i)

    const high = 28 + Math.random() * 6 // 28-34°C
    const low = high - 5 - Math.random() * 3 // 5-8°C lower than high

    forecast.push({
      date: date.toISOString().split("T")[0],
      high: Number(high.toFixed(1)),
      low: Number(low.toFixed(1)),
      condition: conditions[Math.floor(Math.random() * conditions.length)],
      icon: "sun",
      precipitation: Math.random() * 20, // 0-20mm
      humidity: 60 + Math.random() * 30, // 60-90%
      windSpeed: 5 + Math.random() * 15, // 5-20 km/h
    })
  }

  return forecast
}

// Generate weather alerts
function generateWeatherAlerts(location: string): WeatherAlert[] {
  const alerts: WeatherAlert[] = []

  // Randomly generate alerts (in production, this would come from weather services)
  if (Math.random() > 0.7) {
    const alertTypes: WeatherAlert["type"][] = ["flood", "storm", "heat", "wind"]
    const severities: WeatherAlert["severity"][] = ["low", "medium", "high"]

    const type = alertTypes[Math.floor(Math.random() * alertTypes.length)]
    const severity = severities[Math.floor(Math.random() * severities.length)]

    const startTime = new Date()
    const endTime = new Date(startTime.getTime() + (6 + Math.random() * 18) * 3600000) // 6-24 hours

    let title = ""
    let description = ""

    switch (type) {
      case "flood":
        title = "Flood Warning"
        description = `Heavy rainfall may cause flooding in ${location} and surrounding areas.`
        break
      case "storm":
        title = "Thunderstorm Alert"
        description = `Severe thunderstorms expected in ${location} with strong winds and heavy rain.`
        break
      case "heat":
        title = "Heat Advisory"
        description = `Excessive heat warning for ${location}. Stay hydrated and avoid prolonged sun exposure.`
        break
      case "wind":
        title = "High Wind Warning"
        description = `Strong winds expected in ${location}. Secure loose objects and avoid outdoor activities.`
        break
    }

    alerts.push({
      id: `alert_${Date.now()}`,
      type,
      severity,
      title,
      description,
      startTime,
      endTime,
      affectedAreas: [location],
    })
  }

  return alerts
}

// Fetch climate data
export async function fetchClimateData(userId: string, timeRange: "1y" | "5y" | "10y" = "1y"): Promise<ClimateData> {
  try {
    const devices = await fetchDevices(userId)

    if (devices.length === 0) {
      throw new Error("No devices found")
    }

    // Mock climate data (in production, this would analyze historical data)
    const mockClimateData: ClimateData = {
      temperature: {
        average: 28.5 + Math.random() * 2, // 28.5-30.5°C
        trend: ["warming", "cooling", "stable"][Math.floor(Math.random() * 3)] as any,
        anomaly: (Math.random() - 0.5) * 2, // -1 to +1°C
      },
      precipitation: {
        total: 1200 + Math.random() * 400, // 1200-1600mm annually
        trend: ["increasing", "decreasing", "stable"][Math.floor(Math.random() * 3)] as any,
        anomaly: (Math.random() - 0.5) * 200, // -100 to +100mm
      },
      extremeEvents: {
        heatWaves: Math.floor(Math.random() * 5), // 0-4 events
        floods: Math.floor(Math.random() * 3), // 0-2 events
        droughts: Math.floor(Math.random() * 2), // 0-1 events
        storms: Math.floor(Math.random() * 8), // 0-7 events
      },
    }

    return mockClimateData
  } catch (error) {
    console.error("Error fetching climate data:", error)
    throw new Error("Failed to fetch climate data")
  }
}

// Fetch weather statistics for dashboard
export async function fetchWeatherStats(userId: string): Promise<{
  averageTemperature: number
  totalRainfall: number
  activeAlerts: number
  extremeEvents: number
}> {
  try {
    const devices = await fetchDevices(userId)
    const weatherData = await fetchWeatherData(userId)
    const climateData = await fetchClimateData(userId)

    const onlineDevices = devices.filter((d) => d.status === "online")
    const avgTemp =
      onlineDevices.length > 0
        ? onlineDevices.reduce((sum, d) => sum + d.temperature.value, 0) / onlineDevices.length
        : weatherData.current.temperature

    const totalRainfall = onlineDevices.length > 0 ? onlineDevices.reduce((sum, d) => sum + d.rainfall.value, 0) : 0

    const extremeEvents = Object.values(climateData.extremeEvents).reduce((sum, count) => sum + count, 0)

    return {
      averageTemperature: Number(avgTemp.toFixed(1)),
      totalRainfall: Number(totalRainfall.toFixed(1)),
      activeAlerts: weatherData.alerts.length,
      extremeEvents,
    }
  } catch (error) {
    console.error("Error fetching weather stats:", error)
    throw new Error("Failed to fetch weather statistics")
  }
}
