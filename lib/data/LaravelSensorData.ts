import axios from "axios"
// Kita import alert dari LaravelLogs jika butuh data history, 
// tapi untuk stats dashboard kita hitung manual dari data sensor saat ini.
import { fetchRecentAlerts } from "./LaravelLogs"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

// --- INTERFACES ---

export interface SensorData {
  value: number
  trend: "up" | "down" | "stable"
  change: number
}

export interface DeviceWithSensors {
  id: string | number
  name: string
  location: string
  status: "online" | "offline"
  lastUpdate: Date
  batteryLevel: number
  threshold: number
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

// --- HELPER AUTH ---
const getAuthHeaders = () => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem("auth_token");
    if (token) return { Authorization: `Bearer ${token}` };
  }
  return {};
};

// ------------------------------------------------------------------
// 1. FETCH DEVICES WITH SENSORS (Main Data)
// ------------------------------------------------------------------
export async function fetchDevicesWithSensors(userId: string): Promise<DeviceWithSensors[]> {
  try {
    const response = await axios.get(`${API_BASE_URL}/dashboard`, {
      headers: getAuthHeaders()
    });
    
    const rawData = response.data.data || [];

    return rawData.map((item: any) => {
      const data = item.latest_data || {};
      const setting = item.setting || {};

      const lastUpdate = data.created_at ? new Date(data.created_at) : new Date(item.updated_at || new Date());
      
      // Logic: Dianggap Online jika update terakhir kurang dari 60 menit yang lalu
      const isOnline = (new Date().getTime() - lastUpdate.getTime()) < (60 * 60 * 1000); 

      return {
        id: item.id_device, // Mapping ID
        name: item.name,
        location: item.location,
        status: isOnline ? "online" : "offline",
        lastUpdate: lastUpdate,
        batteryLevel: 100, // Hardcode 100 jika belum ada sensor baterai
        threshold: parseFloat(setting.threshold) || 100,
        
        // Data Sensor
        waterLevel: { value: parseFloat(data.water_level) || 0, trend: "stable", change: 0 },
        rainfall: { value: parseFloat(data.rainrate) || 0, trend: "stable", change: 0 },
        temperature: { value: parseFloat(data.temp) || 0, trend: "stable", change: 0 },
        humidity: { value: parseFloat(data.humid) || 0, trend: "stable", change: 0 },
        pressure: { value: parseFloat(data.pressure) || 0, trend: "stable", change: 0 },
        windSpeed: { value: 0, trend: "stable", change: 0 }
      };
    });

  } catch (error) {
    console.error("❌ Gagal ambil data dashboard:", error);
    return [];
  }
}

// ------------------------------------------------------------------
// 2. FETCH DEVICE STATS (Hitung Statistik Alat)
// ------------------------------------------------------------------
// Ini fungsi yang tadi ERROR karena hilang
export async function fetchDeviceStats(userId: string): Promise<DeviceStats> {
  try {
    // Kita panggil fungsi utama di atas, lalu kita hitung statistiknya di sini
    const devices = await fetchDevicesWithSensors(userId);

    const totalDevices = devices.length;
    const onlineDevices = devices.filter(d => d.status === "online").length;
    const offlineDevices = totalDevices - onlineDevices;
    
    // Hitung device yang level airnya melebihi threshold
    const alertDevices = devices.filter(d => d.waterLevel.value >= d.threshold).length;

    // Hitung rata-rata baterai
    const totalBattery = devices.reduce((sum, d) => sum + d.batteryLevel, 0);
    const avgBatteryLevel = totalDevices > 0 ? Math.round(totalBattery / totalDevices) : 0;

    return {
      totalDevices,
      onlineDevices,
      offlineDevices,
      alertDevices,
      avgBatteryLevel
    };
  } catch (error) {
    console.error("Error calculating device stats:", error);
    return {
      totalDevices: 0,
      onlineDevices: 0,
      offlineDevices: 0,
      alertDevices: 0,
      avgBatteryLevel: 0
    };
  }
}

// ------------------------------------------------------------------
// 3. FETCH WEATHER STATS (Hitung Statistik Cuaca)
// ------------------------------------------------------------------
export async function fetchWeatherStats(userId: string): Promise<WeatherStats> {
  try {
    const devices = await fetchDevicesWithSensors(userId);
    const totalDevices = devices.length;

    if (totalDevices === 0) {
      return { averageTemperature: 0, totalRainfall: 0, activeAlerts: 0, extremeEvents: 0 };
    }

    // Rata-rata suhu dari semua device
    const totalTemp = devices.reduce((sum, d) => sum + d.temperature.value, 0);
    const averageTemperature = parseFloat((totalTemp / totalDevices).toFixed(1));

    // Curah hujan rata-rata atau max (tergantung kebutuhan, di sini kita ambil rata-rata)
    const totalRain = devices.reduce((sum, d) => sum + d.rainfall.value, 0);
    const avgRainfall = parseFloat((totalRain / totalDevices).toFixed(1));

    // Hitung jumlah alert aktif (air tinggi)
    const activeAlerts = devices.filter(d => d.waterLevel.value >= d.threshold).length;

    return {
      averageTemperature,
      totalRainfall: avgRainfall,
      activeAlerts,
      extremeEvents: activeAlerts // Bisa disesuaikan logikanya
    };
  } catch (error) {
    console.error("Error calculating weather stats:", error);
    return { averageTemperature: 0, totalRainfall: 0, activeAlerts: 0, extremeEvents: 0 };
  }
}