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
  getDoc,
  setDoc,
  Timestamp,
} from "firebase/firestore"
import { ref, set } from "firebase/database"
import { db, rtdb } from "@/lib/FirebaseConfig"

export interface Device {
  id: string
  name: string
  location: string
  registrationDate: string
  coordinates: {
    lat: number
    lng: number
  }
  userId: string
  authToken?: string
}

export interface DeviceWithSensors extends Device {
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
  trends: {
    waterLevel: "up" | "down" | "stable"
    temperature: "up" | "down" | "stable"
    rainfall: "up" | "down" | "stable"
  }
}

export interface DeviceToken {
  token: string
  deviceId: string
}

// Generate a unique 10-character ID
const generateUniqueId = () => {
  return Math.random().toString(36).substring(2, 12)
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

export async function fetchDevices(userId: string): Promise<DeviceWithSensors[]> {
  try {
    const devicesRef = collection(db, "devices")
    const q = query(devicesRef, where("userId", "==", userId))
    const querySnapshot = await getDocs(q)

    const devices: DeviceWithSensors[] = []
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      const sensorData = generateSensorData()

      const lastUpdateTimestamp = data.lastUpdate || data.updatedAt
      const lastUpdate =
        lastUpdateTimestamp instanceof Timestamp
          ? lastUpdateTimestamp.toDate()
          : new Date(Date.now() - Math.random() * 3600000)

      const registrationDateTimestamp = data.registrationDate || data.createdAt
      const registrationDate =
        registrationDateTimestamp instanceof Timestamp
          ? registrationDateTimestamp.toDate().toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0]

      devices.push({
        id: doc.id,
        name: data.name,
        location: data.location,
        registrationDate: registrationDate,
        coordinates: data.coordinates || { lat: -6.2088, lng: 106.8456 },
        userId: data.userId,
        authToken: data.authToken,
        // Dynamic data
        status: Math.random() > 0.3 ? "online" : "offline",
        ...sensorData,
        threshold: data.threshold || 2.0,
        lastUpdate: lastUpdate,
        trends: {
          waterLevel: sensorData.waterLevel.trend,
          temperature: sensorData.temperature.trend,
          rainfall: sensorData.rainfall.trend,
        },
      })
    })

    return devices
  } catch (error) {
    console.error("Error fetching devices:", error)
    return []
  }
}

export async function fetchDevice(deviceId: string): Promise<DeviceWithSensors | null> {
  try {
    const deviceRef = doc(db, "devices", deviceId)
    const docSnap = await getDoc(deviceRef)

    if (!docSnap.exists()) {
      console.warn(`Device ${deviceId} not found.`)
      return null
    }

    const data = docSnap.data()
    const sensorData = generateSensorData() // Using mock data for now

    const lastUpdateTimestamp = data.lastUpdate || data.updatedAt
    const lastUpdate =
      lastUpdateTimestamp instanceof Timestamp
        ? lastUpdateTimestamp.toDate()
        : new Date(Date.now() - Math.random() * 3600000)

    const registrationDateTimestamp = data.registrationDate || data.createdAt
    const registrationDate =
      registrationDateTimestamp instanceof Timestamp
        ? registrationDateTimestamp.toDate().toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0]

    return {
      id: docSnap.id,
      name: data.name,
      location: data.location,
      registrationDate: registrationDate,
      coordinates: data.coordinates || { lat: -6.2088, lng: 106.8456 },
      userId: data.userId,
      authToken: data.authToken,
      // Dynamic data
      status: Math.random() > 0.3 ? "online" : "offline",
      ...sensorData,
      threshold: data.threshold || 2.0,
      lastUpdate: lastUpdate,
      trends: {
        waterLevel: sensorData.waterLevel.trend,
        temperature: sensorData.temperature.trend,
        rainfall: sensorData.rainfall.trend,
      },
    }
  } catch (error) {
    console.error(`Error fetching device ${deviceId}:`, error)
    return null
  }
}

export async function addDevice(
  deviceData: Omit<Device, "id" | "authToken" | "registrationDate">,
): Promise<Device> {
  try {
    const timestamp = serverTimestamp()
    const newId = generateUniqueId()

    const deviceRef = doc(db, "devices", newId)

    const newDeviceData = {
      ...deviceData,
      id: newId,
      createdAt: timestamp,
      updatedAt: timestamp,
      registrationDate: new Date().toISOString().split("T")[0],
      authToken: newId, // The ID is the token
    }

    // Use setDoc with the custom ID
    await setDoc(deviceRef, newDeviceData)

    const newDevice: Device = {
      id: newId,
      ...deviceData,
      registrationDate: newDeviceData.registrationDate,
      authToken: newId,
    }

    // Log device creation
    await logDeviceEvent(deviceData.userId, newId, "configuration", "Device created", "low", newDevice.name)

    return newDevice
  } catch (error) {
    console.error("Error adding device:", error)
    throw error
  }
}

export async function updateDevice(
  deviceId: string,
  deviceData: Partial<Omit<Device, "id">>,
): Promise<Device | null> {
  try {
    const deviceRef = doc(db, "devices", deviceId)
    await updateDoc(deviceRef, {
      ...deviceData,
      updatedAt: serverTimestamp(),
    })

    const docSnap = await getDoc(deviceRef)
    if (!docSnap.exists()) {
      return null
    }
    const updatedData = docSnap.data() as Device

    // Log device update
    await logDeviceEvent(
      updatedData.userId,
      deviceId,
      "configuration",
      "Device updated",
      "low",
      updatedData.name,
    )

    return { ...updatedData, id: deviceId }
  } catch (error) {
    console.error("Error updating device:", error)
    return null
  }
}

export async function deleteDevice(deviceId: string): Promise<boolean> {
  try {
    const deviceRef = doc(db, "devices", deviceId)
    const deviceSnap = await getDoc(deviceRef)
    if (!deviceSnap.exists()) {
      return false
    }
    const device = deviceSnap.data() as Device

    await deleteDoc(deviceRef)

    // Log device deletion
    await logDeviceEvent(device.userId, deviceId, "configuration", "Device deleted", "medium", device.name)

    return true
  } catch (error) {
    console.error("Error deleting device:", error)
    return false
  }
}

export async function generateDeviceToken(deviceId: string): Promise<DeviceToken | null> {
  try {
    const deviceRef = doc(db, "devices", deviceId)
    const deviceSnap = await getDoc(deviceRef)
    if (!deviceSnap.exists()) {
      return null
    }
    const device = deviceSnap.data() as Device

    // For simplicity, we'll just return the existing token (which is the device ID).
    // If a new token is needed, generate it and update the document.
    const token = device.authToken || device.id

    // Log token generation
    await logDeviceEvent(device.userId, deviceId, "configuration", "Authentication token retrieved", "low", device.name)

    return { token, deviceId }
  } catch (error) {
    console.error("Error generating device token:", error)
    throw error
  }
}

async function logDeviceEvent(
  userId: string,
  deviceId: string,
  type: string,
  message: string,
  severity: string,
  deviceName: string,
) {
  try {
    const timestamp = Date.now()
    const logRef = ref(rtdb, `logs/${userId}/${timestamp}`)
    await set(logRef, {
      deviceId,
      type,
      message,
      severity,
      timestamp: timestamp,
      device: deviceName,
    })
  } catch (error) {
    console.error("Error logging device event:", error)
  }
}

