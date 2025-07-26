import { fetchDevices } from "./devices"
import { fetchRecentAlerts } from "./logs"

export interface WeatherStats {
  averageTemperature: number
  totalRainfall: number
  activeAlerts: number
  extremeEvents: number
}

export interface WeatherForecast {
  date: string
  temperature: {
    min: number
    max: number
  }
  rainfall: number
  humidity: number
  windSpeed: number
  condition: "sunny" | "cloudy" | "rainy" | "stormy"
}

export async function fetchWeatherStats(userId: string): Promise<WeatherStats> {
  try {
    const devices = await fetchDevices(userId)
    const alerts = await fetchRecentAlerts(userId, 10)

    if (devices.length === 0) {
      return {
        averageTemperature: 0,
        totalRainfall: 0,
        activeAlerts: 0,
        extremeEvents: 0,
      }
    }

    const avgTemperature = devices.reduce((sum, d) => sum + d.temperature.value, 0) / devices.length
    const totalRainfall = devices.reduce((sum, d) => sum + d.rainfall.value, 0)
    const activeAlerts = alerts.filter((a) => a.severity === "high").length
    const extremeEvents = devices.filter(
      (d) => d.waterLevel.value > d.threshold || d.temperature.value > 35 || d.rainfall.value > 50,
    ).length

    return {
      averageTemperature: Number(avgTemperature.toFixed(1)),
      totalRainfall: Number(totalRainfall.toFixed(1)),
      activeAlerts,
      extremeEvents,
    }
  } catch (error) {
    console.error("Error fetching weather stats:", error)
    return {
      averageTemperature: 0,
      totalRainfall: 0,
      activeAlerts: 0,
      extremeEvents: 0,
    }
  }
}

export async function fetchWeatherForecast(userId: string, days = 7): Promise<WeatherForecast[]> {
  try {
    const devices = await fetchDevices(userId)

    if (devices.length === 0) {
      return []
    }

    const forecast: WeatherForecast[] = []
    const baseTemp = devices.reduce((sum, d) => sum + d.temperature.value, 0) / devices.length
    const baseRain = devices.reduce((sum, d) => sum + d.rainfall.value, 0) / devices.length

    for (let i = 0; i < days; i++) {
      const date = new Date()
      date.setDate(date.getDate() + i)

      const tempVariation = (Math.random() - 0.5) * 10
      const rainVariation = Math.random() * 20

      forecast.push({
        date: date.toISOString().split("T")[0],
        temperature: {
          min: Math.round(baseTemp + tempVariation - 5),
          max: Math.round(baseTemp + tempVariation + 5),
        },
        rainfall: Number((baseRain + rainVariation).toFixed(1)),
        humidity: Math.round(60 + Math.random() * 30),
        windSpeed: Number((Math.random() * 15).toFixed(1)),
        condition: Math.random() > 0.7 ? "rainy" : Math.random() > 0.5 ? "cloudy" : "sunny",
      })
    }

    return forecast
  } catch (error) {
    console.error("Error fetching weather forecast:", error)
    return []
  }
}
