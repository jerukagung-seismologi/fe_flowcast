import axios from "axios"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

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
  threshold: number
  authToken?: string
}

// Helper Auth Header
const getAuthHeaders = () => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem("auth_token");
    if (token) return { Authorization: `Bearer ${token}` };
  }
  return {};
};

// 1. FETCH ALL DEVICES (GET /api/devices)
export async function fetchDevices(userId: string): Promise<Device[]> {
  try {
    const response = await axios.get(`${API_BASE_URL}/devices`, {
        headers: getAuthHeaders()
    });
    
    // Pastikan mengambil array dari response.data.data
    const rawData = response.data.data || [];

    return rawData.map((item: any) => ({
      // MAPPING PENTING: id_device dari Laravel -> id di Frontend
      id: String(item.id_device), 
      name: item.name,
      location: item.location,
      registrationDate: item.created_at || new Date().toISOString(),
      coordinates: {
        lat: parseFloat(item.latitude) || 0,
        lng: parseFloat(item.longitude) || 0
      },
      userId: String(item.pengguna_id),
      // Ambil threshold dari relasi setting (jika diload) atau default
      threshold: item.setting ? parseFloat(item.setting.threshold) : 100,
      authToken: "" 
    }));

  } catch (error) {
    console.error("❌ Error fetching devices:", error)
    return []
  }
}

// 2. ADD DEVICE (POST /api/devices)
export async function addDevice(device: Omit<Device, "id" | "registrationDate">): Promise<Device> {
  try {
    // Sesuaikan payload dengan yang diminta Controller Laravel
    const payload = {
        name: device.name,
        location: device.location,
        latitude: device.coordinates.lat,
        longitude: device.coordinates.lng,
        threshold: device.threshold
    };

    const response = await axios.post(`${API_BASE_URL}/devices`, payload, {
        headers: getAuthHeaders()
    });
    
    const item = response.data.data;

    // Kembalikan format Frontend
    return {
      id: String(item.id_device),
      name: item.name,
      location: item.location,
      registrationDate: item.created_at || new Date().toISOString(),
      coordinates: {
        lat: parseFloat(item.latitude),
        lng: parseFloat(item.longitude)
      },
      userId: String(item.pengguna_id),
      threshold: parseFloat(item.setting?.threshold || device.threshold),
    };

  } catch (error) {
    console.error("❌ Error adding device:", error)
    throw error
  }
}

// 3. UPDATE DEVICE (PUT /api/devices/{id})
export async function updateDevice(device: Device): Promise<Device> {
  try {
    const payload = {
        name: device.name,
        location: device.location,
        latitude: device.coordinates.lat,
        longitude: device.coordinates.lng,
        threshold: device.threshold
    };

    // Kirim ID ke URL
    const response = await axios.put(`${API_BASE_URL}/devices/${device.id}`, payload, {
        headers: getAuthHeaders()
    });

    return device; // Return data yang sudah diupdate (optimistic)
  } catch (error) {
    console.error("❌ Error updating device:", error)
    throw error
  }
}

// 4. DELETE DEVICE (DELETE /api/devices/{id})
export async function deleteDevice(deviceId: string): Promise<boolean> {
  try {
    await axios.delete(`${API_BASE_URL}/devices/${deviceId}`, {
        headers: getAuthHeaders()
    });
    return true;
  } catch (error) {
    console.error("❌ Error deleting device:", error)
    return false;
  }
}