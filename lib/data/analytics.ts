import { fetchDevices, fetchDeviceStats } from "./devices"
import { fetchLogs } from "./logs"
import { fetchWeatherData, fetchClimateData } from "./weather"

export interface AnalyticsData {
  overview: {
    totalDevices: number
    activeDevices: number
    totalAlerts: number
    dataPoints: number
  }
  trends: {
    deviceGrowth: number
    alertTrend: number
    uptimeTrend: number
    dataQuality: number
  }
  predictions: {
    floodRisk: "low" | "medium" | "high"
    weatherPattern: string
    maintenanceNeeded: string[]
    recommendations: string[]
  }
  performance: {
    systemUptime: number
    dataAccuracy: number
    responseTime: number
    alertEfficiency: number
  }
}

export interface PredictionModel {
  type: "flood" | "weather" | "maintenance"
  confidence: number
  timeframe: string
  factors: string[]
  recommendation: string
}

export interface RiskAssessment {
  overall: "low" | "medium" | "high" | "critical"
  factors: {
    waterLevel: number
    rainfall: number
    weather: number
    infrastructure: number
  }
  recommendations: string[]
  timeline: string
}

// Fetch comprehensive analytics data
export async function fetchAnalyticsData(userId: string): Promise<AnalyticsData> {
  try {
    const [devices, deviceStats, logs, weatherData, climateData] = await Promise.all([
      fetchDevices(userId),
      fetchDeviceStats(userId),
      fetchLogs(userId),
      fetchWeatherData(userId),
      fetchClimateData(userId),
    ])

    const activeDevices = devices.filter((d) => d.status === "online").length
    const totalAlerts = logs.filter((l) => l.type === "alert").length
    const recentLogs = logs.filter((l) => l.timestamp > Date.now() - 24 * 60 * 60 * 1000)

    // Calculate trends (mock calculations)
    const deviceGrowth = devices.length > 0 ? Math.random() * 20 - 5 : 0 // -5% to +15%
    const alertTrend = totalAlerts > 0 ? Math.random() * 30 - 15 : 0 // -15% to +15%
    const uptimeTrend = (activeDevices / Math.max(devices.length, 1)) * 100
    const dataQuality = Math.random() * 10 + 90 // 90-100%

    // Predict flood risk based on current conditions
    const avgWaterLevel = devices.reduce((sum, d) => sum + d.waterLevel.value, 0) / Math.max(devices.length, 1)
    const avgThreshold = devices.reduce((sum, d) => sum + d.threshold, 0) / Math.max(devices.length, 1)
    const waterLevelRatio = avgWaterLevel / avgThreshold

    let floodRisk: "low" | "medium" | "high" = "low"
    if (waterLevelRatio > 0.8) floodRisk = "high"
    else if (waterLevelRatio > 0.6) floodRisk = "medium"

    // Generate maintenance recommendations
    const maintenanceNeeded = devices.filter((d) => d.batteryLevel < 30 || d.status === "offline").map((d) => d.name)

    // Generate recommendations
    const recommendations = []
    if (floodRisk === "high") {
      recommendations.push("Immediate flood preparedness measures recommended")
    }
    if (maintenanceNeeded.length > 0) {
      recommendations.push(`${maintenanceNeeded.length} devices require maintenance`)
    }
    if (activeDevices / devices.length < 0.8) {
      recommendations.push("Consider adding backup devices for better coverage")
    }

    return {
      overview: {
        totalDevices: devices.length,
        activeDevices,
        totalAlerts,
        dataPoints: recentLogs.length,
      },
      trends: {
        deviceGrowth: Number(deviceGrowth.toFixed(1)),
        alertTrend: Number(alertTrend.toFixed(1)),
        uptimeTrend: Number(uptimeTrend.toFixed(1)),
        dataQuality: Number(dataQuality.toFixed(1)),
      },
      predictions: {
        floodRisk,
        weatherPattern: weatherData.current.condition,
        maintenanceNeeded,
        recommendations,
      },
      performance: {
        systemUptime: Number((Math.random() * 5 + 95).toFixed(1)), // 95-100%
        dataAccuracy: Number(dataQuality.toFixed(1)),
        responseTime: Number((Math.random() * 100 + 50).toFixed(0)), // 50-150ms
        alertEfficiency: Number((Math.random() * 10 + 90).toFixed(1)), // 90-100%
      },
    }
  } catch (error) {
    console.error("Error fetching analytics data:", error)
    throw new Error("Failed to fetch analytics data")
  }
}

// Generate prediction models
export async function generatePredictionModels(userId: string): Promise<PredictionModel[]> {
  try {
    const devices = await fetchDevices(userId)
    const logs = await fetchLogs(userId)

    const models: PredictionModel[] = []

    // Flood prediction model
    const avgWaterLevel = devices.reduce((sum, d) => sum + d.waterLevel.value, 0) / Math.max(devices.length, 1)
    const floodAlerts = logs.filter((l) => l.type === "alert" && l.message.includes("water level")).length

    models.push({
      type: "flood",
      confidence: Math.min(95, 60 + floodAlerts * 5), // Higher confidence with more historical data
      timeframe: "Next 24 hours",
      factors: ["Current water levels", "Rainfall forecast", "Historical patterns"],
      recommendation: avgWaterLevel > 2 ? "Monitor closely and prepare flood defenses" : "Continue regular monitoring",
    })

    // Weather prediction model
    models.push({
      type: "weather",
      confidence: Math.random() * 20 + 70, // 70-90%
      timeframe: "Next 7 days",
      factors: ["Atmospheric pressure", "Temperature trends", "Humidity levels"],
      recommendation: "Expect variable weather conditions with possible precipitation",
    })

    // Maintenance prediction model
    const lowBatteryDevices = devices.filter((d) => d.batteryLevel < 50).length
    models.push({
      type: "maintenance",
      confidence: lowBatteryDevices > 0 ? 90 : 60,
      timeframe: "Next 30 days",
      factors: ["Battery levels", "Device uptime", "Error frequency"],
      recommendation:
        lowBatteryDevices > 0
          ? `${lowBatteryDevices} devices need battery replacement soon`
          : "All devices operating within normal parameters",
    })

    return models
  } catch (error) {
    console.error("Error generating prediction models:", error)
    throw new Error("Failed to generate prediction models")
  }
}

// Assess flood risk
export async function assessFloodRisk(userId: string): Promise<RiskAssessment> {
  try {
    const devices = await fetchDevices(userId)
    const logs = await fetchLogs(userId)
    const weatherData = await fetchWeatherData(userId)

    // Calculate risk factors (0-100 scale)
    const avgWaterLevel = devices.reduce((sum, d) => sum + d.waterLevel.value, 0) / Math.max(devices.length, 1)
    const avgThreshold = devices.reduce((sum, d) => sum + d.threshold, 0) / Math.max(devices.length, 1)
    const waterLevelFactor = Math.min(100, (avgWaterLevel / avgThreshold) * 100)

    const avgRainfall = devices.reduce((sum, d) => sum + d.rainfall.value, 0) / Math.max(devices.length, 1)
    const rainfallFactor = Math.min(100, avgRainfall * 2) // Assume 50mm is high risk

    const weatherFactor = weatherData.alerts.length * 25 // Each alert adds 25 points

    const recentAlerts = logs.filter((l) => l.type === "alert" && l.timestamp > Date.now() - 24 * 60 * 60 * 1000).length
    const infrastructureFactor = Math.min(100, recentAlerts * 20)

    // Calculate overall risk
    const overallScore = (waterLevelFactor + rainfallFactor + weatherFactor + infrastructureFactor) / 4

    let overall: RiskAssessment["overall"] = "low"
    if (overallScore > 75) overall = "critical"
    else if (overallScore > 50) overall = "high"
    else if (overallScore > 25) overall = "medium"

    // Generate recommendations
    const recommendations = []
    if (waterLevelFactor > 60) {
      recommendations.push("Monitor water levels closely - approaching critical thresholds")
    }
    if (rainfallFactor > 40) {
      recommendations.push("Heavy rainfall detected - prepare drainage systems")
    }
    if (weatherFactor > 0) {
      recommendations.push("Weather alerts active - follow official guidance")
    }
    if (infrastructureFactor > 30) {
      recommendations.push("Multiple system alerts - check device status")
    }
    if (recommendations.length === 0) {
      recommendations.push("Continue routine monitoring and maintenance")
    }

    return {
      overall,
      factors: {
        waterLevel: Number(waterLevelFactor.toFixed(1)),
        rainfall: Number(rainfallFactor.toFixed(1)),
        weather: Number(weatherFactor.toFixed(1)),
        infrastructure: Number(infrastructureFactor.toFixed(1)),
      },
      recommendations,
      timeline:
        overall === "critical"
          ? "Immediate action required"
          : overall === "high"
            ? "Next 6-12 hours"
            : overall === "medium"
              ? "Next 24 hours"
              : "Routine monitoring",
    }
  } catch (error) {
    console.error("Error assessing flood risk:", error)
    throw new Error("Failed to assess flood risk")
  }
}

// Generate system health report
export async function generateSystemHealthReport(userId: string): Promise<{
  score: number
  status: "excellent" | "good" | "fair" | "poor"
  issues: string[]
  recommendations: string[]
  lastUpdated: Date
}> {
  try {
    const devices = await fetchDevices(userId)
    const deviceStats = await fetchDeviceStats(userId)
    const logs = await fetchLogs(userId)

    let score = 100
    const issues: string[] = []
    const recommendations: string[] = []

    // Check device connectivity
    const connectivityRatio = deviceStats.onlineDevices / Math.max(deviceStats.totalDevices, 1)
    if (connectivityRatio < 0.8) {
      score -= 20
      issues.push(`${deviceStats.totalDevices - deviceStats.onlineDevices} devices offline`)
      recommendations.push("Check network connectivity and device power status")
    }

    // Check battery levels
    const lowBatteryDevices = devices.filter((d) => d.batteryLevel < 30).length
    if (lowBatteryDevices > 0) {
      score -= lowBatteryDevices * 10
      issues.push(`${lowBatteryDevices} devices with low battery`)
      recommendations.push("Schedule battery replacement for affected devices")
    }

    // Check recent errors
    const recentErrors = logs.filter(
      (l) => l.severity === "high" && l.timestamp > Date.now() - 24 * 60 * 60 * 1000,
    ).length
    if (recentErrors > 0) {
      score -= recentErrors * 5
      issues.push(`${recentErrors} high-severity errors in last 24 hours`)
      recommendations.push("Investigate and resolve system errors")
    }

    // Check data freshness
    const staleDevices = devices.filter(
      (d) => d.lastUpdate.getTime() < Date.now() - 60 * 60 * 1000, // 1 hour
    ).length
    if (staleDevices > 0) {
      score -= staleDevices * 5
      issues.push(`${staleDevices} devices with stale data`)
      recommendations.push("Check data transmission and device sensors")
    }

    score = Math.max(0, score)

    let status: "excellent" | "good" | "fair" | "poor" = "excellent"
    if (score < 60) status = "poor"
    else if (score < 75) status = "fair"
    else if (score < 90) status = "good"

    if (issues.length === 0) {
      recommendations.push("System operating optimally - continue regular monitoring")
    }

    return {
      score,
      status,
      issues,
      recommendations,
      lastUpdated: new Date(),
    }
  } catch (error) {
    console.error("Error generating system health report:", error)
    throw new Error("Failed to generate system health report")
  }
}
