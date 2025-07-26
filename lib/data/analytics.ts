import { fetchDevices } from "./FetchingDevice"
import { fetchLogs } from "./FetchingLogs"

export interface AnalyticsData {
  devicePerformance: DevicePerformance[]
  alertTrends: AlertTrend[]
  systemHealth: SystemHealth
  predictions: Prediction[]
}

export interface DevicePerformance {
  deviceId: string
  deviceName: string
  uptime: number
  dataQuality: number
  batteryHealth: number
  alertCount: number
}

export interface AlertTrend {
  date: string
  alertCount: number
  severity: "high" | "medium" | "low"
}

export interface SystemHealth {
  overallScore: number
  connectivity: number
  dataAccuracy: number
  responseTime: number
  maintenanceNeeded: string[]
}

export interface Prediction {
  parameter: string
  currentValue: number
  predictedValue: number
  confidence: number
  timeframe: string
  risk: "low" | "medium" | "high"
}

export async function fetchAnalyticsData(userId: string): Promise<AnalyticsData> {
  try {
    const devices = await fetchDevices(userId)
    const logs = await fetchLogs(userId, 200)

    if (devices.length === 0) {
      return {
        devicePerformance: [],
        alertTrends: [],
        systemHealth: {
          overallScore: 0,
          connectivity: 0,
          dataAccuracy: 0,
          responseTime: 0,
          maintenanceNeeded: [],
        },
        predictions: [],
      }
    }

    // Calculate device performance
    const devicePerformance: DevicePerformance[] = devices.map((device) => {
      const deviceLogs = logs.filter((log) => log.deviceId === device.id)
      const alertCount = deviceLogs.filter((log) => log.type === "alert").length

      return {
        deviceId: device.id,
        deviceName: device.name,
        uptime: device.status === "online" ? 95 + Math.random() * 5 : Math.random() * 50,
        dataQuality: 85 + Math.random() * 15,
        batteryHealth: device.batteryLevel,
        alertCount,
      }
    })

    // Calculate alert trends (last 7 days)
    const alertTrends: AlertTrend[] = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dayLogs = logs.filter((log) => {
        const logDate = new Date(log.timestamp)
        return logDate.toDateString() === date.toDateString()
      })

      alertTrends.push({
        date: date.toISOString().split("T")[0],
        alertCount: dayLogs.filter((log) => log.type === "alert").length,
        severity: dayLogs.some((log) => log.severity === "high")
          ? "high"
          : dayLogs.some((log) => log.severity === "medium")
            ? "medium"
            : "low",
      })
    }

    // Calculate system health
    const onlineDevices = devices.filter((d) => d.status === "online").length
    const connectivity = devices.length > 0 ? (onlineDevices / devices.length) * 100 : 0
    const avgBattery = devices.reduce((sum, d) => sum + d.batteryLevel, 0) / devices.length
    const maintenanceNeeded = devices
      .filter((d) => d.batteryLevel < 30 || d.status === "offline")
      .map((d) => `${d.name} needs maintenance`)

    const systemHealth: SystemHealth = {
      overallScore: Math.round((connectivity + avgBattery + 85) / 3), // 85 is base score
      connectivity: Math.round(connectivity),
      dataAccuracy: 90 + Math.random() * 10,
      responseTime: 150 + Math.random() * 100, // milliseconds
      maintenanceNeeded,
    }

    // Generate predictions
    const predictions: Prediction[] = devices.slice(0, 3).map((device) => ({
      parameter: "Water Level",
      currentValue: device.waterLevel.value,
      predictedValue: device.waterLevel.value + (Math.random() - 0.5) * 0.5,
      confidence: 75 + Math.random() * 20,
      timeframe: "Next 6 hours",
      risk:
        device.waterLevel.value > device.threshold * 0.8
          ? "high"
          : device.waterLevel.value > device.threshold * 0.6
            ? "medium"
            : "low",
    }))

    return {
      devicePerformance,
      alertTrends,
      systemHealth,
      predictions,
    }
  } catch (error) {
    console.error("Error fetching analytics data:", error)
    return {
      devicePerformance: [],
      alertTrends: [],
      systemHealth: {
        overallScore: 0,
        connectivity: 0,
        dataAccuracy: 0,
        responseTime: 0,
        maintenanceNeeded: [],
      },
      predictions: [],
    }
  }
}
