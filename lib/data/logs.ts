import { ref, get } from "firebase/database"
import { realtimeDb } from "@/lib/firebase"

export interface LogEvent {
  id: string
  deviceId: string
  timestamp: number
  type:
    | "alert"
    | "connection"
    | "disconnection"
    | "configuration"
    | "threshold"
    | "sensor_data"
    | "device_created"
    | "device_updated"
    | "device_deleted"
  device: string
  message: string
  severity: "low" | "medium" | "high"
}

export interface LogFilters {
  searchTerm?: string
  type?: string
  severity?: string
  dateRange?: string
  deviceId?: string
}

// Convert timestamp to Date object
const convertTimestamp = (timestamp: number): Date => {
  return new Date(timestamp)
}

// Fetch all logs for a user
export async function fetchLogs(userId: string): Promise<LogEvent[]> {
  try {
    const logsRef = ref(realtimeDb, `logs/${userId}`)
    const snapshot = await get(logsRef)

    if (!snapshot.exists()) {
      return []
    }

    const logsData = snapshot.val()
    const logs: LogEvent[] = []

    Object.keys(logsData).forEach((key) => {
      const log = logsData[key]
      logs.push({
        ...log,
        id: key,
        timestamp: log.timestamp || Date.now(),
      })
    })

    // Sort by timestamp (newest first)
    return logs.sort((a, b) => b.timestamp - a.timestamp)
  } catch (error) {
    console.error("Error fetching logs:", error)
    throw new Error("Failed to fetch logs")
  }
}

// Fetch logs with filters
export async function fetchFilteredLogs(userId: string, filters: LogFilters): Promise<LogEvent[]> {
  try {
    let logs = await fetchLogs(userId)

    // Apply search filter
    if (filters.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase()
      logs = logs.filter(
        (log) => log.message.toLowerCase().includes(searchTerm) || log.device.toLowerCase().includes(searchTerm),
      )
    }

    // Apply type filter
    if (filters.type && filters.type !== "all") {
      logs = logs.filter((log) => log.type === filters.type)
    }

    // Apply severity filter
    if (filters.severity && filters.severity !== "all") {
      logs = logs.filter((log) => log.severity === filters.severity)
    }

    // Apply device filter
    if (filters.deviceId) {
      logs = logs.filter((log) => log.deviceId === filters.deviceId)
    }

    // Apply date range filter
    if (filters.dateRange && filters.dateRange !== "all") {
      const now = Date.now()
      let cutoffTime = 0

      switch (filters.dateRange) {
        case "today":
          const today = new Date()
          today.setHours(0, 0, 0, 0)
          cutoffTime = today.getTime()
          break
        case "week":
          cutoffTime = now - 7 * 24 * 60 * 60 * 1000
          break
        case "month":
          cutoffTime = now - 30 * 24 * 60 * 60 * 1000
          break
      }

      logs = logs.filter((log) => log.timestamp >= cutoffTime)
    }

    return logs
  } catch (error) {
    console.error("Error filtering logs:", error)
    throw new Error("Failed to filter logs")
  }
}

// Fetch logs by device
export async function fetchLogsByDevice(userId: string, deviceId: string): Promise<LogEvent[]> {
  try {
    const logs = await fetchLogs(userId)
    return logs.filter((log) => log.deviceId === deviceId)
  } catch (error) {
    console.error("Error fetching logs by device:", error)
    throw new Error("Failed to fetch device logs")
  }
}

// Fetch logs by severity
export async function fetchLogsBySeverity(userId: string, severity: LogEvent["severity"]): Promise<LogEvent[]> {
  try {
    const logs = await fetchLogs(userId)
    return logs.filter((log) => log.severity === severity)
  } catch (error) {
    console.error("Error fetching logs by severity:", error)
    throw new Error("Failed to fetch logs by severity")
  }
}

// Fetch recent alerts
export async function fetchRecentAlerts(userId: string, limit = 10): Promise<LogEvent[]> {
  try {
    const logs = await fetchLogs(userId)
    return logs.filter((log) => log.type === "alert").slice(0, limit)
  } catch (error) {
    console.error("Error fetching recent alerts:", error)
    throw new Error("Failed to fetch recent alerts")
  }
}

// Get log statistics
export async function fetchLogStats(userId: string): Promise<{
  totalLogs: number
  alertCount: number
  errorCount: number
  todayCount: number
}> {
  try {
    const logs = await fetchLogs(userId)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayTimestamp = today.getTime()

    return {
      totalLogs: logs.length,
      alertCount: logs.filter((log) => log.type === "alert").length,
      errorCount: logs.filter((log) => log.severity === "high").length,
      todayCount: logs.filter((log) => log.timestamp >= todayTimestamp).length,
    }
  } catch (error) {
    console.error("Error fetching log stats:", error)
    throw new Error("Failed to fetch log statistics")
  }
}

// Real-time log listener (for future implementation)
export function subscribeToLogs(userId: string, callback: (logs: LogEvent[]) => void): () => void {
  // This would implement real-time listeners using Firebase Realtime Database
  // For now, we'll return a dummy unsubscribe function
  return () => {
    console.log("Unsubscribed from logs")
  }
}
