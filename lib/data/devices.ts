import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore"
import { ref, push, set } from "firebase/database"
import { db, realtimeDb } from "@/lib/firebase"

export interface Device {
  id: string
  userId: string
  name: string
  location: string
  status: "online" | "offline"
  registrationDate: string
  batteryLevel: number
  coordinates: { lat: number; lng: number }
  waterLevel: { value: number; trend: "up" | "down" | "stable"; change: number }
  rainfall: { value: number; trend: "up" | "down" | "stable"; change: number }
  temperature: { value: number; trend: "up" | "down" | "stable"; change: number }
  humidity: { value: number; trend: "up" | "down" | "stable"; change: number }
  windSpeed: { value: number; trend: "up" | "down" | "stable"; change: number }
  pressure: { value: number; trend: "up" | "down" | "stable"; change: number }
  lastUpdate: Date
  threshold: number
  trends: {
    waterLevel: "up" | "down" | "stable"
    temperature: "up" | "down" | "stable"
    rainfall: "up" | "down" | "stable"
  }
  deviceToken?: string
  createdAt: Date
  updatedAt: Date
}

export interface DeviceStats {
  totalDevices: number
  onlineDevices: number
  alertDevices: number
  avgBatteryLevel: number
}

export interface DeviceAuthToken {
  deviceId: string
  token: string
  createdAt: Date
  expiresAt: Date
}

// Convert Firestore timestamp to Date
const convertTimestamp = (timestamp: any): Date => {
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate()
  }
  if (timestamp?.seconds) {
    return new Date(timestamp.seconds * 1000)
  }
  return new Date(timestamp)
}

// Fetch all devices for a specific user
export async function fetchDevices(userId: string): Promise<Device[]> {
  try {
    const devicesRef = collection(db, "devices")
    const q = query(devicesRef, where("userId", "==", userId), orderBy("createdAt", "desc"))

    const querySnapshot = await getDocs(q)
    const devices: Device[] = []

    querySnapshot.forEach((doc) => {
      const data = doc.data()
      devices.push({
        id: doc.id,
        ...data,
        createdAt: convertTimestamp(data.createdAt),
        updatedAt: convertTimestamp(data.updatedAt),
        lastUpdate: convertTimestamp(data.lastUpdate),
      } as Device)
    })

    return devices
  } catch (error) {
    console.error("Error fetching devices:", error)
    throw new Error("Failed to fetch devices")
  }
}

// Fetch device by ID (with user verification)
export async function fetchDeviceById(deviceId: string, userId: string): Promise<Device | null> {
  try {
    const deviceRef = doc(db, "devices", deviceId)
    const deviceSnap = await getDoc(deviceRef)

    if (!deviceSnap.exists()) {
      return null
    }

    const data = deviceSnap.data()

    // Verify device belongs to user
    if (data.userId !== userId) {
      throw new Error("Unauthorized access to device")
    }

    return {
      id: deviceSnap.id,
      ...data,
      createdAt: convertTimestamp(data.createdAt),
      updatedAt: convertTimestamp(data.updatedAt),
      lastUpdate: convertTimestamp(data.lastUpdate),
    } as Device
  } catch (error) {
    console.error("Error fetching device:", error)
    throw new Error("Failed to fetch device")
  }
}

// Calculate device statistics for a user
export async function fetchDeviceStats(userId: string): Promise<DeviceStats> {
  try {
    const devices = await fetchDevices(userId)

    const onlineDevices = devices.filter((d) => d.status === "online").length
    const alertDevices = devices.filter((d) => d.waterLevel.value > d.threshold).length
    const avgBatteryLevel =
      devices.length > 0 ? devices.reduce((sum, d) => sum + d.batteryLevel, 0) / devices.length : 0

    return {
      totalDevices: devices.length,
      onlineDevices,
      alertDevices,
      avgBatteryLevel: Number(avgBatteryLevel.toFixed(1)),
    }
  } catch (error) {
    console.error("Error fetching device stats:", error)
    throw new Error("Failed to fetch device statistics")
  }
}

// Generate device authentication token
export async function generateDeviceToken(deviceId: string, userId: string): Promise<DeviceAuthToken> {
  try {
    // Verify device belongs to user
    const device = await fetchDeviceById(deviceId, userId)
    if (!device) {
      throw new Error("Device not found or unauthorized")
    }

    // Create custom claims for the device
    const customClaims = {
      deviceId,
      userId,
      type: "device",
      permissions: ["read_sensors", "write_data"],
    }

    // Generate custom token (Note: This should be done on the server side in production)
    const token = Math.random().toString(36).substring(2) + Date.now().toString(36)

    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 30) // 30 days expiry

    const deviceToken: DeviceAuthToken = {
      deviceId,
      token,
      createdAt: new Date(),
      expiresAt,
    }

    // Store token in Firestore
    const tokenRef = doc(db, "deviceTokens", deviceId)
    await set(tokenRef, {
      ...deviceToken,
      userId,
      createdAt: serverTimestamp(),
      expiresAt: Timestamp.fromDate(expiresAt),
    })

    // Update device with token reference
    const deviceRef = doc(db, "devices", deviceId)
    await updateDoc(deviceRef, {
      deviceToken: token,
      updatedAt: serverTimestamp(),
    })

    return deviceToken
  } catch (error) {
    console.error("Error generating device token:", error)
    throw new Error("Failed to generate device token")
  }
}

// Add new device
export async function addDevice(
  deviceData: Omit<
    Device,
    | "id"
    | "userId"
    | "lastUpdate"
    | "createdAt"
    | "updatedAt"
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
    const newDeviceData = {
      ...deviceData,
      userId,
      status: "offline" as const,
      waterLevel: { value: 0, trend: "stable" as const, change: 0 },
      rainfall: { value: 0, trend: "stable" as const, change: 0 },
      temperature: { value: 0, trend: "stable" as const, change: 0 },
      humidity: { value: 0, trend: "stable" as const, change: 0 },
      windSpeed: { value: 0, trend: "stable" as const, change: 0 },
      pressure: { value: 0, trend: "stable" as const, change: 0 },
      lastUpdate: serverTimestamp(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }

    const devicesRef = collection(db, "devices")
    const docRef = await addDoc(devicesRef, newDeviceData)

    // Log device creation
    await logDeviceEvent(docRef.id, userId, "device_created", "Device successfully created", "low")

    // Fetch the created device
    const createdDevice = await fetchDeviceById(docRef.id, userId)
    if (!createdDevice) {
      throw new Error("Failed to retrieve created device")
    }

    return createdDevice
  } catch (error) {
    console.error("Error adding device:", error)
    throw new Error("Failed to add device")
  }
}

// Update device
export async function updateDevice(deviceId: string, updates: Partial<Device>, userId: string): Promise<Device | null> {
  try {
    // Verify device belongs to user
    const existingDevice = await fetchDeviceById(deviceId, userId)
    if (!existingDevice) {
      throw new Error("Device not found or unauthorized")
    }

    const deviceRef = doc(db, "devices", deviceId)
    const updateData = {
      ...updates,
      updatedAt: serverTimestamp(),
    }

    // Remove fields that shouldn't be updated directly
    delete updateData.id
    delete updateData.userId
    delete updateData.createdAt

    await updateDoc(deviceRef, updateData)

    // Log device update
    await logDeviceEvent(deviceId, userId, "device_updated", "Device configuration updated", "low")

    // Return updated device
    return await fetchDeviceById(deviceId, userId)
  } catch (error) {
    console.error("Error updating device:", error)
    throw new Error("Failed to update device")
  }
}

// Delete device
export async function deleteDevice(deviceId: string, userId: string): Promise<boolean> {
  try {
    // Verify device belongs to user
    const device = await fetchDeviceById(deviceId, userId)
    if (!device) {
      throw new Error("Device not found or unauthorized")
    }

    // Delete device document
    const deviceRef = doc(db, "devices", deviceId)
    await deleteDoc(deviceRef)

    // Delete device token if exists
    const tokenRef = doc(db, "deviceTokens", deviceId)
    await deleteDoc(tokenRef)

    // Log device deletion
    await logDeviceEvent(deviceId, userId, "device_deleted", "Device removed from system", "medium")

    return true
  } catch (error) {
    console.error("Error deleting device:", error)
    throw new Error("Failed to delete device")
  }
}

// Update device sensor data (called by IoT devices)
export async function updateDeviceSensorData(
  deviceId: string,
  sensorData: {
    waterLevel?: number
    rainfall?: number
    temperature?: number
    humidity?: number
    windSpeed?: number
    pressure?: number
    batteryLevel?: number
  },
  deviceToken: string,
): Promise<boolean> {
  try {
    // Verify device token
    const tokenRef = doc(db, "deviceTokens", deviceId)
    const tokenSnap = await getDoc(tokenRef)

    if (!tokenSnap.exists() || tokenSnap.data().token !== deviceToken) {
      throw new Error("Invalid device token")
    }

    const tokenData = tokenSnap.data()
    const expiresAt = convertTimestamp(tokenData.expiresAt)

    if (expiresAt < new Date()) {
      throw new Error("Device token expired")
    }

    // Calculate trends (simplified logic)
    const deviceRef = doc(db, "devices", deviceId)
    const deviceSnap = await getDoc(deviceRef)

    if (!deviceSnap.exists()) {
      throw new Error("Device not found")
    }

    const currentData = deviceSnap.data()
    const updates: any = {
      status: "online",
      lastUpdate: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }

    // Update sensor values with trend calculation
    if (sensorData.waterLevel !== undefined) {
      const change = sensorData.waterLevel - (currentData.waterLevel?.value || 0)
      updates.waterLevel = {
        value: sensorData.waterLevel,
        change,
        trend: Math.abs(change) < 0.1 ? "stable" : change > 0 ? "up" : "down",
      }
    }

    if (sensorData.temperature !== undefined) {
      const change = sensorData.temperature - (currentData.temperature?.value || 0)
      updates.temperature = {
        value: sensorData.temperature,
        change,
        trend: Math.abs(change) < 0.5 ? "stable" : change > 0 ? "up" : "down",
      }
    }

    if (sensorData.rainfall !== undefined) {
      const change = sensorData.rainfall - (currentData.rainfall?.value || 0)
      updates.rainfall = {
        value: sensorData.rainfall,
        change,
        trend: Math.abs(change) < 1 ? "stable" : change > 0 ? "up" : "down",
      }
    }

    if (sensorData.humidity !== undefined) {
      const change = sensorData.humidity - (currentData.humidity?.value || 0)
      updates.humidity = {
        value: sensorData.humidity,
        change,
        trend: Math.abs(change) < 2 ? "stable" : change > 0 ? "up" : "down",
      }
    }

    if (sensorData.windSpeed !== undefined) {
      const change = sensorData.windSpeed - (currentData.windSpeed?.value || 0)
      updates.windSpeed = {
        value: sensorData.windSpeed,
        change,
        trend: Math.abs(change) < 1 ? "stable" : change > 0 ? "up" : "down",
      }
    }

    if (sensorData.pressure !== undefined) {
      const change = sensorData.pressure - (currentData.pressure?.value || 0)
      updates.pressure = {
        value: sensorData.pressure,
        change,
        trend: Math.abs(change) < 2 ? "stable" : change > 0 ? "up" : "down",
      }
    }

    if (sensorData.batteryLevel !== undefined) {
      updates.batteryLevel = sensorData.batteryLevel
    }

    // Update trends summary
    updates.trends = {
      waterLevel: updates.waterLevel?.trend || currentData.trends?.waterLevel || "stable",
      temperature: updates.temperature?.trend || currentData.trends?.temperature || "stable",
      rainfall: updates.rainfall?.trend || currentData.trends?.rainfall || "stable",
    }

    await updateDoc(deviceRef, updates)

    // Log sensor data update
    await logDeviceEvent(
      deviceId,
      tokenData.userId,
      "sensor_data",
      `Sensor data updated: ${Object.keys(sensorData).join(", ")}`,
      "low",
    )

    // Check for alerts
    if (sensorData.waterLevel && sensorData.waterLevel > currentData.threshold) {
      await logDeviceEvent(
        deviceId,
        tokenData.userId,
        "alert",
        `Water level (${sensorData.waterLevel}m) exceeded threshold (${currentData.threshold}m)`,
        "high",
      )
    }

    return true
  } catch (error) {
    console.error("Error updating sensor data:", error)
    throw new Error("Failed to update sensor data")
  }
}

// Log device event to Realtime Database
export async function logDeviceEvent(
  deviceId: string,
  userId: string,
  eventType:
    | "alert"
    | "connection"
    | "disconnection"
    | "configuration"
    | "threshold"
    | "sensor_data"
    | "device_created"
    | "device_updated"
    | "device_deleted",
  message: string,
  severity: "low" | "medium" | "high",
): Promise<void> {
  try {
    const logsRef = ref(realtimeDb, `logs/${userId}`)
    const newLogRef = push(logsRef)

    const logEntry = {
      id: newLogRef.key,
      deviceId,
      timestamp: Date.now(),
      type: eventType,
      message,
      severity,
      device: `Device ${deviceId}`,
    }

    await set(newLogRef, logEntry)
  } catch (error) {
    console.error("Error logging device event:", error)
    // Don't throw error for logging failures to avoid breaking main functionality
  }
}

// Fetch devices with real-time updates (simulated)
export async function fetchDevicesRealtime(userId: string): Promise<Device[]> {
  const devices = await fetchDevices(userId)

  // In a real implementation, you would set up real-time listeners here
  return devices.map((device) => ({
    ...device,
    waterLevel: {
      ...device.waterLevel,
      value: Math.max(0, device.waterLevel.value + (Math.random() - 0.5) * 0.1),
    },
    temperature: {
      ...device.temperature,
      value: device.temperature.value + (Math.random() - 0.5) * 2,
    },
    rainfall: {
      ...device.rainfall,
      value: Math.max(0, device.rainfall.value + (Math.random() - 0.5) * 5),
    },
    lastUpdate: new Date(),
  }))
}
