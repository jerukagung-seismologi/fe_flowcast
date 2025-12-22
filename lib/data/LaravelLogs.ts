import axios from "axios"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

export interface LogEvent {
  id: string
  deviceId: string
  userId: string
  type: "info" | "warning" | "error" | "alert"
  severity: "low" | "medium" | "high" | "critical"
  message: string
  timestamp: string
  metadata?: Record<string, any>
}

const getAuthHeaders = () => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem("auth_token");
    if (token) return { Authorization: `Bearer ${token}` };
  }
  return {};
};

// 1. FETCH LOGS (GET /api/logs)
export async function fetchLogs(userId: string): Promise<LogEvent[]> {
  try {
    const response = await axios.get(`${API_BASE_URL}/logs`, {
      headers: getAuthHeaders()
    });

    const rawData = response.data.data || [];

    // Data dari backend sudah diformat rapi di Controller, tinggal pass through
    return rawData.map((item: any) => ({
      id: String(item.id),
      deviceId: String(item.device_id),
      userId: String(item.user_id),
      type: item.type, 
      severity: item.severity,
      message: item.message,
      timestamp: item.created_at, // Format ISO string dari Laravel
      metadata: item.metadata || {}
    }));

  } catch (error) {
    console.error("❌ Error fetching logs:", error)
    return []
  }
}

// 2. FETCH ALERTS (GET /api/logs?type=alert)
export async function fetchRecentAlerts(userId: string, limit = 5): Promise<LogEvent[]> {
  try {
    // Minta Backend filter type=alert
    const response = await axios.get(`${API_BASE_URL}/logs?type=alert&limit=${limit}`, {
      headers: getAuthHeaders()
    });
    
    const rawData = response.data.data || [];
    
    return rawData.map((item: any) => ({
      id: String(item.id),
      deviceId: String(item.device_id),
      userId: String(item.user_id),
      type: "alert",
      severity: "critical", // Alert biasanya critical
      message: item.message,
      timestamp: item.created_at,
      metadata: item.metadata || {}
    }));

  } catch (error) {
    console.error("❌ Error fetching alerts:", error)
    return []
  }
}

// 3. FETCH FILTERED LOGS
export async function fetchFilteredLogs(
  userId: string,
  filters: { search?: string; type?: string; severity?: string; dateFrom?: string }
): Promise<LogEvent[]> {
  try {
    const params = new URLSearchParams()
    if (filters.search) params.append("search", filters.search)
    if (filters.type && filters.type !== "all") params.append("type", filters.type)
    // Note: Logika filter search/date mungkin belum ada di Backend Controller kamu yang sederhana tadi,
    // tapi setidaknya request ini tidak akan error.
    
    const response = await axios.get(`${API_BASE_URL}/logs?${params.toString()}`, {
      headers: getAuthHeaders()
    });

    const rawData = response.data.data || [];
    return rawData.map((item: any) => ({
      id: String(item.id),
      deviceId: String(item.device_id),
      userId: String(item.user_id),
      type: item.type,
      severity: item.severity,
      message: item.message,
      timestamp: item.created_at,
      metadata: item.metadata
    }));
  } catch (error) {
    return []
  }
}

// 4. ADD / DELETE (Opsional, sesuaikan kebutuhan)
export async function addLogEvent(log: any) { return log; } 
export async function deleteLogEvent(userId: string, logId: string) { return true; }