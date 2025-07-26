import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore"
import { ref, push } from "firebase/database"
import { db, rtdb } from "@/lib/FirebaseConfig"

export interface Device {
  id: string
  name: string
  location: string
  status: "online" | "offline"
  waterLevel: {
    value: number
    trend: "up" | "down" | "stable"
    change: number
  }
  rainfall: {
    value: number
    trend: "up" | "down" | "stable"
    change: number
  }
  temperature: {
    value: number
    trend: "up" | "down" | "stable"
    change: number
  }
  humidity: {
    value: number
    trend: "up" | "down" | "stable"
    change: number
  }
  windSpeed: {
    value: number
    trend: "up" | "down" | "stable"
    change: number
  }
  pressure: {
    value: number
    trend: "up" | "down" | "stable"
    change: number
  }
  threshold: number
  lastUpdate: Date
  registrationDate: string
  batteryLevel: number
  coordinates: {
    lat: number
    lng: number
  }
  trends: {
    waterLevel: "up" | "down" | "stable"
    temperature: "up" | "down" | "stable"
    rainfall: "up" | "down" | "stable"
  }
  userId: string
  authToken?: string
}

export interface DeviceStats {
  totalDevices: number
  onlineDevices: number
  alertDevices: number
  avgBatteryLevel: number
}

export interface DeviceToken {
  token: string
  deviceId: string
  userId: string
  expiresAt: Date
  createdAt: Date
}

// Generate mock sensor data with trends
const generateSensorData = () => {
  const trends = ["up", "down", "stable"] as const
  return {
    waterLevel: {
      value: Math.random() * 5,
      trend: trends[Math.floor(Math.random() * trends.length)],
      change: (Math.random() - 0.5) * 0.5,
    },
    rainfall: {
      value: Math.random() * 50,
      trend: trends[Math.floor(Math.random() * trends.length)],
      change: (Math.random() - 0.5) * 10,
    },
    temperature: {
      value: 20 + Math.random() * 15,
      trend: trends[Math.floor(Math.random() * trends.length)],
      change: (Math.random() - 0.5) * 5,
    },
    humidity: {
      value: 40 + Math.random() * 40,
      trend: trends[Math.floor(Math.random() * trends.length)],
      change: (Math.random() - 0.5) * 10,
    },
    windSpeed: {
      value: Math.random() * 20,
      trend: trends[Math.floor(Math.random() * trends.length)],
      change: (Math.random() - 0.5) * 5,
    },
    pressure: {
      value: 1000 + Math.random() * 50,
      trend: trends[Math.floor(Math.random() * trends.length)],
      change: (Math.random() - 0.5) * 10,
    },
  }
}

export async function fetchDevices(userId: string): Promise<Device[]> {
  try {
    const devicesRef = collection(db, "devices")
    const q = query(devicesRef, where("userId", "==", userId), orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(q)

    const devices: Device[] = []
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      const sensorData = generateSensorData()

      devices.push({
        id: doc.id,
        name: data.name,
        location: data.location,
        status: Math.random() > 0.3 ? "online" : "offline",
        ...sensorData,
        threshold: data.threshold || 2.0,
        lastUpdate: new Date(Date.now() - Math.random() * 3600000), // Random time within last hour
        registrationDate: data.registrationDate || new Date().toISOString().split("T")[0],
        batteryLevel: data.batteryLevel || Math.floor(Math.random() * 100),
        coordinates: data.coordinates || { lat: -6.2088, lng: 106.8456 },
        trends: data.trends || {
          waterLevel: sensorData.waterLevel.trend,
          temperature: sensorData.temperature.trend,
          rainfall: sensorData.rainfall.trend,
        },
        userId: data.userId,
        authToken: data.authToken,
      })
    })

    return devices
  } catch (error) {
    console.error("Error fetching devices:", error)
    return []
  }
}

export async function fetchDeviceStats(userId: string): Promise<DeviceStats> {
  try {
    const devices = await fetchDevices(userId)
    const onlineDevices = devices.filter((d) => d.status === "online").length
    const alertDevices = devices.filter((d) => d.waterLevel.value > d.threshold).length
    const avgBatteryLevel =
      devices.length > 0 ? Math.round(devices.reduce((sum, d) => sum + d.batteryLevel, 0) / devices.length) : 0

    return {
      totalDevices: devices.length,
      onlineDevices,
      alertDevices,
      avgBatteryLevel,
    }
  } catch (error) {
    console.error("Error fetching device stats:", error)
    return {
      totalDevices: 0,
      onlineDevices: 0,
      alertDevices: 0,
      avgBatteryLevel: 0,
    }
  }
}

export async function addDevice(
  deviceData: Omit<
    Device,
    | "id"
    | "userId"
    | "status"
    | "lastUpdate"
    | "waterLevel"
    | "rainfall"
    | "temperature"
    | "humidity"
    | "windSpeed"
    | "pressure"
  >,
  userId: string,
): Promise<Device> {
  try {
    const sensorData = generateSensorData()
    const docRef = await addDoc(collection(db, "devices"), {
      ...deviceData,
      userId,
      status: "offline",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    const newDevice: Device = {
      id: docRef.id,
      ...deviceData,
      userId,
      status: "offline",
      lastUpdate: new Date(),
      ...sensorData,
    }

    // Log device creation
    await logDeviceEvent(userId, docRef.id, "configuration", "Device created", "low")

    return newDevice
  } catch (error) {
    console.error("Error adding device:", error)
    throw error
  }
}

export async function updateDevice(
  deviceId: string,
  deviceData: Partial<Device>,
  userId: string,
): Promise<Device | null> {
  try {
    const deviceRef = doc(db, "devices", deviceId)
    await updateDoc(deviceRef, {
      ...deviceData,
      updatedAt: serverTimestamp(),
    })

    // Log device update
    await logDeviceEvent(userId, deviceId, "configuration", "Device updated", "low")

    // Fetch updated device
    const devices = await fetchDevices(userId)
    return devices.find((d) => d.id === deviceId) || null
  } catch (error) {
    console.error("Error updating device:", error)
    return null
  }
}

export async function deleteDevice(deviceId: string, userId: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, "devices", deviceId))

    // Log device deletion
    await logDeviceEvent(userId, deviceId, "configuration", "Device deleted", "medium")

    return true
  } catch (error) {
    console.error("Error deleting device:", error)
    return false
  }
}

export async function generateDeviceToken(deviceId: string, userId: string): Promise<DeviceToken> {
  try {
    const token = `device_${deviceId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
    const createdAt = new Date()

    const tokenData: DeviceToken = {
      token,
      deviceId,
      userId,
      expiresAt,
      createdAt,
    }

    // Store token in Firestore
    await addDoc(collection(db, "deviceTokens"), {
      ...tokenData,
      createdAt: serverTimestamp(),
    })

    // Update device with token
    await updateDoc(doc(db, "devices", deviceId), {
      authToken: token,
      updatedAt: serverTimestamp(),
    })

    // Log token generation
    await logDeviceEvent(userId, deviceId, "configuration", "Authentication token generated", "low")

    return tokenData
  } catch (error) {
    console.error("Error generating device token:", error)
    throw error
  }
}

async function logDeviceEvent(userId: string, deviceId: string, type: string, message: string, severity: string) {
  try {
    const logsRef = ref(rtdb, `logs/${userId}`)
    await push(logsRef, {
      deviceId,
      type,
      message,
      severity,
      timestamp: Date.now(),
      device: `Device ${deviceId}`,
    })
  } catch (error) {
    console.error("Error logging device event:", error)
  }
}
