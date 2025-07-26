"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  Filter,
  AlertTriangle,
  CheckCircle,
  Settings,
  Wifi,
  WifiOff,
  Calendar,
  Clock,
  Trash2,
} from "lucide-react"
import { fetchLogs, fetchFilteredLogs, deleteLogEvent, type LogEvent, type LogFilters } from "@/lib/data/FetchingLogs"
import { useAuth } from "@/hooks/useAuth"
import { EmptyState } from "@/components/empty-state"
import LoadingSpinner from "@/components/LoadingSpinner"

export default function LogsPage() {
  const { user } = useAuth()
  const [logs, setLogs] = useState<LogEvent[]>([])
  const [filteredLogs, setFilteredLogs] = useState<LogEvent[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [severityFilter, setSeverityFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")
  const [loading, setLoading] = useState(true)

  // Load initial data
  useEffect(() => {
    const loadLogs = async () => {
      if (!user?.uid) return

      try {
        setLoading(true)
        const logsData = await fetchLogs(user.uid)
        setLogs(logsData)
        setFilteredLogs(logsData)
      } catch (error) {
        console.error("Error loading logs:", error)
      } finally {
        setLoading(false)
      }
    }

    loadLogs()
  }, [user?.uid])

  // Filter logs based on search and filters
  useEffect(() => {
    const applyFilters = async () => {
      if (!user?.uid) return

      try {
        const filters: LogFilters = {
          searchTerm: searchTerm || undefined,
          type: typeFilter !== "all" ? typeFilter : undefined,
          severity: severityFilter !== "all" ? severityFilter : undefined,
          dateRange: dateFilter !== "all" ? dateFilter : undefined,
        }

        const filtered = await fetchFilteredLogs(user.uid, filters)
        setFilteredLogs(filtered)
      } catch (error) {
        console.error("Error filtering logs:", error)
      }
    }

    applyFilters()
  }, [searchTerm, typeFilter, severityFilter, dateFilter, user?.uid])

  const handleDeleteLog = async (logId: string) => {
    if (!user?.uid) return

    if (window.confirm("Apakah Anda yakin ingin menghapus log ini?")) {
      try {
        await deleteLogEvent(user.uid, logId)
        setLogs((prevLogs) => prevLogs.filter((log) => log.id !== logId))
        setFilteredLogs((prevLogs) => prevLogs.filter((log) => log.id !== logId))
      } catch (error) {
        console.error("Error deleting log:", error)
        // Optionally, show an error message to the user
      }
    }
  }

  const getTypeIcon = (type: LogEvent["type"]) => {
    switch (type) {
      case "alert":
        return <AlertTriangle className="h-4 w-4" />
      case "connection":
        return <Wifi className="h-4 w-4" />
      case "disconnection":
        return <WifiOff className="h-4 w-4" />
      case "configuration":
        return <Settings className="h-4 w-4" />
      case "threshold":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: LogEvent["type"]) => {
    switch (type) {
      case "alert":
        return "destructive"
      case "connection":
        return "default"
      case "disconnection":
        return "secondary"
      case "configuration":
        return "outline"
      case "threshold":
        return "default"
      default:
        return "outline"
    }
  }

  const getSeverityColor = (severity: LogEvent["severity"]) => {
    switch (severity) {
      case "high":
        return "destructive"
      case "medium":
        return "secondary"
      case "low":
        return "outline"
      default:
        return "outline"
    }
  }

  const clearFilters = () => {
    setSearchTerm("")
    setTypeFilter("all")
    setSeverityFilter("all")
    setDateFilter("all")
  }

  if (loading) {
    return <LoadingSpinner />
  }

  // Show empty state if no logs
  if (!logs || logs.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Log Kejadian</h1>
          <p className="text-muted-foreground">Monitor aktivitas sistem dan kejadian perangkat</p>
        </div>
        <EmptyState type="logs" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Log Kejadian</h1>
        <p className="text-muted-foreground">Monitor aktivitas sistem dan kejadian perangkat</p>
      </div>

      {/* Filters */}
      <Card className="shadow-lg border-l-4 border-l-indigo-500">
        <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
          <CardTitle className="flex items-center text-indigo-800">
            <Filter className="h-5 w-5 mr-2 text-indigo-600" />
            Filter & Pencarian
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari log..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-blue-200 focus:border-blue-500"
                />
              </div>
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Jenis Kejadian" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Jenis</SelectItem>
                <SelectItem value="alert">Peringatan</SelectItem>
                <SelectItem value="connection">Koneksi</SelectItem>
                <SelectItem value="disconnection">Pemutusan</SelectItem>
                <SelectItem value="configuration">Konfigurasi</SelectItem>
                <SelectItem value="threshold">Ambang Batas</SelectItem>
              </SelectContent>
            </Select>
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Tingkat Keparahan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Tingkat</SelectItem>
                <SelectItem value="high">Tinggi</SelectItem>
                <SelectItem value="medium">Sedang</SelectItem>
                <SelectItem value="low">Rendah</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Periode Waktu" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Waktu</SelectItem>
                <SelectItem value="today">Hari Ini</SelectItem>
                <SelectItem value="week">Minggu Lalu</SelectItem>
                <SelectItem value="month">Bulan Lalu</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-muted-foreground">
              Menampilkan {filteredLogs.length} dari {logs.length} kejadian
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="bg-gradient-to-r from-gray-50 to-blue-50 hover:from-gray-100 hover:to-blue-100 border-blue-200"
            >
              Bersihkan Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Log Entries */}
      <Card className="shadow-lg border-l-4 border-l-green-500">
        <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50">
          <CardTitle className="text-green-800">Kejadian Terbaru</CardTitle>
          <CardDescription className="text-green-600">Aktivitas sistem dan peringatan terbaru</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredLogs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Tidak ada kejadian yang sesuai dengan kriteria Anda
              </div>
            ) : (
              filteredLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-start space-x-4 p-4 border rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 border-l-4 border-l-blue-300"
                >
                  <div className="flex-shrink-0 mt-1">{getTypeIcon(log.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-gray-900">{log.message}</p>
                      <div className="flex items-center space-x-2">
                        <Badge variant={getTypeColor(log.type)}>{log.type}</Badge>
                        <Badge variant={getSeverityColor(log.severity)}>{log.severity}</Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-muted-foreground hover:text-destructive"
                          onClick={() => handleDeleteLog(log.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(log.timestamp).toLocaleDateString()} pada {new Date(log.timestamp).toLocaleTimeString()}
                      <span className="mx-2">•</span>
                      {log.device}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}