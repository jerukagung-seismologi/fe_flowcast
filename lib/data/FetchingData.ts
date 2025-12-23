import { fetchDevices, fetchDevice, type Device } from "./FetchingDevices"
import { fetchRecentAlerts } from "./FetchingLogs"
import { rtdb } from "@/lib/ApiConfig"
import { get, ref, query, orderByChild, limitToLast } from "firebase/database"

export interface SensorData {
  value: number
  trend: "up" | "down" | "stable"
  change: number
}

export interface DeviceWithSensors extends Device {
  status: "online" | "offline"
  lastUpdate: Date
  batteryLevel: number
  waterLevel: SensorData
  rainfall: SensorData
  temperature: SensorData
  humidity: SensorData
  windSpeed: SensorData
  pressure: SensorData
}

export interface DeviceStats {
  totalDevices: number
  onlineDevices: number
  offlineDevices: number
  alertDevices: number
  avgBatteryLevel: number
}

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

// Helper to calculate trend
const calculateTrend = (
  current: number,
  previous: number,
): { trend: "up" | "down" | "stable"; change: number } => {
  const change = current - previous
  let trend: "up" | "down" | "stable" = "stable"
  if (change > 0.01) trend = "up"
  if (change < -0.01) trend = "down"
  return { trend, change }
}

// Fetch dynamic data for a single device from RTDB
// NOTE: This function requires a Firebase Realtime Database rule to be set for indexing.
// Go to your Firebase Console -> Realtime Database -> Rules and add the .indexOn rule.
//
// {
//   "rules": {
//     "devices": {
//       "$deviceId": {
//         "data": {
//           ".indexOn": "timestamp"
//         }
//       }
//     }
//   }
// }
//
async function fetchDeviceDynamicData(deviceId: string): Promise<Partial<DeviceWithSensors>> {
  try {
    const dataRef = ref(rtdb, `devices/${deviceId}/data`)
    const dataQuery = query(dataRef, orderByChild("timestamp"), limitToLast(2))
    const snapshot = await get(dataQuery)

    if (!snapshot.exists()) {
      // Return default "offline" state if no data exists for the device.
      // This prevents errors on the website.
      return {
        status: "offline",
        lastUpdate: new Date(0),
        batteryLevel: 0,
        waterLevel: { value: 0, trend: "stable", change: 0 },
        rainfall: { value: 0, trend: "stable", change: 0 },
        temperature: { value: 0, trend: "stable", change: 0 },
        humidity: { value: 0, trend: "stable", change: 0 },
        windSpeed: { value: 0, trend: "stable", change: 0 },
        pressure: { value: 0, trend: "stable", change: 0 },
      }
    }

    const dataPoints: any[] = []
    snapshot.forEach((child) => {
      dataPoints.push(child.val())
    })

    const latest = dataPoints[dataPoints.length - 1]
    const previous = dataPoints.length > 1 ? dataPoints[0] : latest

    const lastUpdate = new Date(latest.timestamp)
    const isOnline = Date.now() - lastUpdate.getTime() < 5 * 60 * 1000 // 5 minutes threshold

    return {
      status: isOnline ? "online" : "offline",
      lastUpdate,
      batteryLevel: latest.battery || 0,
      waterLevel: { value: latest.water_level || 0, ...calculateTrend(latest.water_level, previous.water_level) },
      rainfall: { value: latest.rainfall || 0, ...calculateTrend(latest.rainfall, previous.rainfall) },
      temperature: { value: latest.temperature || 0, ...calculateTrend(latest.temperature, previous.temperature) },
      humidity: { value: latest.humidity || 0, ...calculateTrend(latest.humidity, previous.humidity) },
      windSpeed: { value: latest.wind_speed || 0, ...calculateTrend(latest.wind_speed, previous.wind_speed) },
      pressure: { value: latest.pressure || 0, ...calculateTrend(latest.pressure, previous.pressure) },
    }
  } catch (error) {
    console.error(`Error fetching dynamic data for ${deviceId}:`, error)
    return { status: "offline", lastUpdate: new Date(0), batteryLevel: 0 } as Partial<DeviceWithSensors>
  }
}

export async function fetchDeviceWithSensors(userId: string, deviceId: string): Promise<DeviceWithSensors | null> {
  const staticDevice = await fetchDevice(deviceId)
  if (!staticDevice || staticDevice.userId !== userId) return null

  const dynamicData = await fetchDeviceDynamicData(deviceId)
  return { ...staticDevice, ...dynamicData } as DeviceWithSensors
}

export async function fetchDevicesWithSensors(userId: string): Promise<DeviceWithSensors[]> {
  const staticDevices = await fetchDevices(userId)
  if (staticDevices.length === 0) return []

  const devicesWithSensors = await Promise.all(
    staticDevices.map(async (device) => {
      const dynamicData = await fetchDeviceDynamicData(device.id)
      return { ...device, ...dynamicData } as DeviceWithSensors
    }),
  )

  return devicesWithSensors
}

export async function fetchDeviceStats(userId: string): Promise<DeviceStats> {
  const devices = await fetchDevicesWithSensors(userId)
  if (devices.length === 0) {
    return { totalDevices: 0, onlineDevices: 0, offlineDevices: 0, alertDevices: 0, avgBatteryLevel: 0 }
  }

  const totalDevices = devices.length
  const onlineDevices = devices.filter((d) => d.status === "online").length
  const offlineDevices = totalDevices - onlineDevices
  const alertDevices = devices.filter((d) => d.waterLevel.value > d.threshold).length
  const totalBattery = devices.reduce((sum, d) => sum + (d.batteryLevel || 0), 0)
  const avgBatteryLevel = totalDevices > 0 ? Math.round(totalBattery / totalDevices) : 0

  return { totalDevices, onlineDevices, offlineDevices, alertDevices, avgBatteryLevel }
}

export async function fetchWeatherStats(userId: string): Promise<WeatherStats> {
  try {
    const devices = await fetchDevicesWithSensors(userId)
    const alerts = await fetchRecentAlerts(userId, 10)

    if (devices.length === 0) {
      return {
        averageTemperature: 0,
        totalRainfall: 0,
        activeAlerts: 0,
        extremeEvents: 0,
      }
    }

    const onlineDevices = devices.filter((d) => d.status === "online")
    if (onlineDevices.length === 0) {
      return { averageTemperature: 0, totalRainfall: 0, activeAlerts: 0, extremeEvents: 0 }
    }

    const avgTemperature = onlineDevices.reduce((sum, d) => sum + d.temperature.value, 0) / onlineDevices.length
    const totalRainfall = onlineDevices.reduce((sum, d) => sum + d.rainfall.value, 0)
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
    const devices = await fetchDevicesWithSensors(userId)

    if (devices.length === 0) {
      return []
    }
    const onlineDevices = devices.filter((d) => d.status === "online")
    if (onlineDevices.length === 0) return []

    const forecast: WeatherForecast[] = []
    const baseTemp = onlineDevices.reduce((sum, d) => sum + d.temperature.value, 0) / onlineDevices.length
    const baseRain = onlineDevices.reduce((sum, d) => sum + d.rainfall.value, 0) / onlineDevices.length

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
