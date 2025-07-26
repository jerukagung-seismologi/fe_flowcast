"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import {
  Plus,
  Edit,
  Trash2,
  MapPin,
  Wifi,
  WifiOff,
  Battery,
  Calendar,
  TrendingUp,
  TrendingDown,
  Minus,
  Key,
  Copy,
} from "lucide-react"

import {
  fetchDevices,
  addDevice,
  updateDevice,
  deleteDevice,
  generateDeviceToken,
  type Device,
} from "@/lib/data/devices"
import { useAuth } from "@/hooks/useAuth"
import { EmptyState } from "@/components/empty-state"

export default function DevicesPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [devices, setDevices] = useState<Device[]>([])
  const [loading, setLoading] = useState(true)

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isTokenDialogOpen, setIsTokenDialogOpen] = useState(false)
  const [editingDevice, setEditingDevice] = useState<Device | null>(null)
  const [deviceToken, setDeviceToken] = useState<string>("")
  const [newDevice, setNewDevice] = useState({
    name: "",
    location: "",
    threshold: 2.0,
    latitude: "",
    longitude: "",
    batteryLevel: 100,
  })

  const loadDevices = async () => {
    if (!user?.uid) return

    try {
      setLoading(true)
      const devicesData = await fetchDevices(user.uid)
      setDevices(devicesData)
    } catch (error) {
      console.error("Error loading devices:", error)
      toast({
        title: "Error",
        description: "Gagal memuat perangkat. Silakan coba lagi.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDevices()
  }, [user?.uid])

  const handleAddDevice = async () => {
    if (!user?.uid) return

    try {
      const deviceData = {
        name: newDevice.name,
        location: newDevice.location,
        threshold: newDevice.threshold,
        registrationDate: new Date().toISOString().split("T")[0],
        batteryLevel: newDevice.batteryLevel,
        coordinates: {
          lat: newDevice.latitude ? Number.parseFloat(newDevice.latitude) : 0,
          lng: newDevice.longitude ? Number.parseFloat(newDevice.longitude) : 0,
        },
        trends: {
          waterLevel: "stable" as const,
          temperature: "stable" as const,
          rainfall: "stable" as const,
        },
      }

      const newDeviceResult = await addDevice(deviceData, user.uid)
      setDevices([...devices, newDeviceResult])
      setNewDevice({ name: "", location: "", threshold: 2.0, latitude: "", longitude: "", batteryLevel: 100 })
      setIsAddDialogOpen(false)

      toast({
        title: "Berhasil",
        description: "Perangkat berhasil ditambahkan!",
      })
    } catch (error) {
      console.error("Error adding device:", error)
      toast({
        title: "Error",
        description: "Gagal menambahkan perangkat. Silakan coba lagi.",
        variant: "destructive",
      })
    }
  }

  const handleEditDevice = async () => {
    if (!editingDevice || !user?.uid) return

    try {
      const updatedDevice = await updateDevice(editingDevice.id, editingDevice, user.uid)
      if (updatedDevice) {
        setDevices(devices.map((d) => (d.id === editingDevice.id ? updatedDevice : d)))
        toast({
          title: "Berhasil",
          description: "Perangkat berhasil diperbarui!",
        })
      }
      setIsEditDialogOpen(false)
      setEditingDevice(null)
    } catch (error) {
      console.error("Error updating device:", error)
      toast({
        title: "Error",
        description: "Gagal memperbarui perangkat. Silakan coba lagi.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteDevice = async (id: string) => {
    if (!user?.uid) return

    try {
      const success = await deleteDevice(id, user.uid)
      if (success) {
        setDevices(devices.filter((d) => d.id !== id))
        toast({
          title: "Berhasil",
          description: "Perangkat berhasil dihapus!",
        })
      }
    } catch (error) {
      console.error("Error deleting device:", error)
      toast({
        title: "Error",
        description: "Gagal menghapus perangkat. Silakan coba lagi.",
        variant: "destructive",
      })
    }
  }

  const handleGenerateToken = async (deviceId: string) => {
    if (!user?.uid) return

    try {
      const tokenData = await generateDeviceToken(deviceId, user.uid)
      setDeviceToken(tokenData.token)
      setIsTokenDialogOpen(true)

      toast({
        title: "Berhasil",
        description: "Token autentikasi perangkat berhasil dibuat!",
      })
    } catch (error) {
      console.error("Error generating token:", error)
      toast({
        title: "Error",
        description: "Gagal membuat token perangkat. Silakan coba lagi.",
        variant: "destructive",
      })
    }
  }

  const copyTokenToClipboard = () => {
    navigator.clipboard.writeText(deviceToken)
    toast({
      title: "Disalin",
      description: "Token perangkat disalin ke clipboard!",
    })
  }

  const openEditDialog = (device: Device) => {
    setEditingDevice({ ...device })
    setIsEditDialogOpen(true)
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-3 w-3 text-green-600" />
      case "down":
        return <TrendingDown className="h-3 w-3 text-red-600" />
      default:
        return <Minus className="h-3 w-3 text-gray-600" />
    }
  }

  const getBatteryColor = (level: number) => {
    if (level > 60) return "text-green-600 bg-green-100"
    if (level > 30) return "text-orange-600 bg-orange-100"
    return "text-red-600 bg-red-100"
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Show empty state if no devices
  if (!devices || devices.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Manajemen Perangkat</h1>
            <p className="text-muted-foreground">Kelola stasiun cuaca dengan metadata komprehensif</p>
          </div>
        </div>
        <EmptyState type="devices" onAction={() => setIsAddDialogOpen(true)} />

        {/* Add Device Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Stasiun Cuaca Baru</DialogTitle>
              <DialogDescription>Tambahkan stasiun monitoring hidrometeorologi baru ke jaringan Anda</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nama Stasiun</Label>
                <Input
                  id="name"
                  placeholder="e.g., Weather Station Jakarta Timur"
                  value={newDevice.name}
                  onChange={(e) => setNewDevice({ ...newDevice, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="location">Lokasi</Label>
                <Input
                  id="location"
                  placeholder="e.g., Menteng"
                  value={newDevice.location}
                  onChange={(e) => setNewDevice({ ...newDevice, location: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input
                    id="latitude"
                    placeholder="-6.2088"
                    value={newDevice.latitude}
                    onChange={(e) => setNewDevice({ ...newDevice, latitude: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input
                    id="longitude"
                    placeholder="106.8456"
                    value={newDevice.longitude}
                    onChange={(e) => setNewDevice({ ...newDevice, longitude: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="threshold">Ambang Batas Siaga (meter)</Label>
                  <Input
                    id="threshold"
                    type="number"
                    step="0.1"
                    value={newDevice.threshold}
                    onChange={(e) => setNewDevice({ ...newDevice, threshold: Number.parseFloat(e.target.value) })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="battery">Level Baterai Awal (%)</Label>
                  <Input
                    id="battery"
                    type="number"
                    min="0"
                    max="100"
                    value={newDevice.batteryLevel}
                    onChange={(e) => setNewDevice({ ...newDevice, batteryLevel: Number.parseInt(e.target.value) })}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Batal
              </Button>
              <Button onClick={handleAddDevice}>Tambah Perangkat</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manajemen Perangkat</h1>
          <p className="text-muted-foreground">Kelola stasiun cuaca dengan metadata komprehensif</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              Tambah Perangkat
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Stasiun Cuaca Baru</DialogTitle>
              <DialogDescription>Tambahkan stasiun monitoring hidrometeorologi baru ke jaringan Anda</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nama Stasiun</Label>
                <Input
                  id="name"
                  placeholder="e.g., Weather Station Jakarta Timur"
                  value={newDevice.name}
                  onChange={(e) => setNewDevice({ ...newDevice, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="location">Lokasi</Label>
                <Input
                  id="location"
                  placeholder="e.g., Menteng"
                  value={newDevice.location}
                  onChange={(e) => setNewDevice({ ...newDevice, location: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input
                    id="latitude"
                    placeholder="-6.2088"
                    value={newDevice.latitude}
                    onChange={(e) => setNewDevice({ ...newDevice, latitude: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input
                    id="longitude"
                    placeholder="106.8456"
                    value={newDevice.longitude}
                    onChange={(e) => setNewDevice({ ...newDevice, longitude: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="threshold">Ambang Batas Siaga (meter)</Label>
                  <Input
                    id="threshold"
                    type="number"
                    step="0.1"
                    value={newDevice.threshold}
                    onChange={(e) => setNewDevice({ ...newDevice, threshold: Number.parseFloat(e.target.value) })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="battery">Level Baterai Awal (%)</Label>
                  <Input
                    id="battery"
                    type="number"
                    min="0"
                    max="100"
                    value={newDevice.batteryLevel}
                    onChange={(e) => setNewDevice({ ...newDevice, batteryLevel: Number.parseInt(e.target.value) })}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Batal
              </Button>
              <Button onClick={handleAddDevice}>Tambah Perangkat</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {devices.map((device) => (
          <Card
            key={device.id}
            className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500 bg-gradient-to-br from-white to-blue-50"
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-gray-800">{device.name}</CardTitle>
                <Badge
                  variant={device.status === "online" ? "default" : "destructive"}
                  className={
                    device.status === "online"
                      ? "bg-gradient-to-r from-green-500 to-emerald-500"
                      : "bg-gradient-to-r from-red-500 to-pink-500"
                  }
                >
                  {device.status === "online" ? (
                    <Wifi className="h-3 w-3 mr-1" />
                  ) : (
                    <WifiOff className="h-3 w-3 mr-1" />
                  )}
                  {device.status === "online" ? "Online" : "Offline"}
                </Badge>
              </div>
              <CardDescription className="flex items-center text-gray-600">
                <MapPin className="h-4 w-4 mr-1 text-blue-500" />
                {device.location}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Device Metadata */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg">
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-2 text-purple-600" />
                  <div>
                    <div className="font-medium text-gray-800">Terdaftar</div>
                    <div className="text-xs text-gray-600">{device.registrationDate}</div>
                  </div>
                </div>
                <div className="flex items-center text-sm">
                  <Battery className={`h-4 w-4 mr-2 ${getBatteryColor(device.batteryLevel).split(" ")[0]}`} />
                  <div>
                    <div className="font-medium text-gray-800">Baterai</div>
                    <div className={`text-xs font-medium ${getBatteryColor(device.batteryLevel).split(" ")[0]}`}>
                      {device.batteryLevel}%
                    </div>
                  </div>
                </div>
                <div className="col-span-2 flex items-center text-sm">
                  <MapPin className="h-4 w-4 mr-2 text-blue-600" />
                  <div>
                    <div className="font-medium text-gray-800">Koordinat</div>
                    <div className="text-xs text-gray-600">
                      {device.coordinates.lat.toFixed(4)}, {device.coordinates.lng.toFixed(4)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Trend Indicators */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Tren Saat Ini</h4>
                <div className="grid grid-cols-3 gap-2">
                  <div className="flex items-center justify-center p-2 bg-gradient-to-br from-blue-100 to-cyan-100 rounded">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        {getTrendIcon(device.trends.waterLevel)}
                      </div>
                      <div className="text-xs text-blue-600">Air</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center p-2 bg-gradient-to-br from-orange-100 to-red-100 rounded">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        {getTrendIcon(device.trends.temperature)}
                      </div>
                      <div className="text-xs text-orange-600">Suhu</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center p-2 bg-gradient-to-br from-green-100 to-emerald-100 rounded">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        {getTrendIcon(device.trends.rainfall)}
                      </div>
                      <div className="text-xs text-green-600">Hujan</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Device Settings */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Ambang Batas Siaga:</span>
                  <span className="font-medium text-purple-600">{device.threshold}m</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 border-blue-200"
                  onClick={() => openEditDialog(device)}
                >
                  <Edit className="h-3 w-3 mr-1 text-blue-600" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 border-green-200"
                  onClick={() => handleGenerateToken(device.id)}
                >
                  <Key className="h-3 w-3 mr-1 text-green-600" />
                  Token
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-gradient-to-r from-red-50 to-pink-50 hover:from-red-100 hover:to-pink-100 border-red-200"
                  onClick={() => handleDeleteDevice(device.id)}
                >
                  <Trash2 className="h-3 w-3 text-red-600" />
                </Button>
              </div>

              {/* Status Alerts */}
              {device.batteryLevel < 30 && (
                <div className="flex items-center text-xs text-orange-700 bg-gradient-to-r from-orange-100 to-yellow-100 p-2 rounded border border-orange-200">
                  <Battery className="h-3 w-3 mr-1" />
                  Baterai lemah - perlu perawatan
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Perangkat</DialogTitle>
            <DialogDescription>Perbarui informasi perangkat, pengaturan, dan metadata</DialogDescription>
          </DialogHeader>
          {editingDevice && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Nama Stasiun</Label>
                <Input
                  id="edit-name"
                  value={editingDevice.name}
                  onChange={(e) => setEditingDevice({ ...editingDevice, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-location">Lokasi</Label>
                <Input
                  id="edit-location"
                  value={editingDevice.location}
                  onChange={(e) => setEditingDevice({ ...editingDevice, location: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select
                    value={editingDevice.status}
                    onValueChange={(value: "online" | "offline") =>
                      setEditingDevice({ ...editingDevice, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="online">Online</SelectItem>
                      <SelectItem value="offline">Offline</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-battery">Level Baterai (%)</Label>
                  <Input
                    id="edit-battery"
                    type="number"
                    min="0"
                    max="100"
                    value={editingDevice.batteryLevel}
                    onChange={(e) =>
                      setEditingDevice({ ...editingDevice, batteryLevel: Number.parseInt(e.target.value) })
                    }
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-threshold">Ambang Batas Siaga</Label>
                <Input
                  id="edit-threshold"
                  type="number"
                  step="0.1"
                  value={editingDevice.threshold}
                  onChange={(e) => setEditingDevice({ ...editingDevice, threshold: Number.parseFloat(e.target.value) })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-lat">Latitude</Label>
                  <Input
                    id="edit-lat"
                    type="number"
                    step="0.0001"
                    value={editingDevice.coordinates.lat}
                    onChange={(e) =>
                      setEditingDevice({
                        ...editingDevice,
                        coordinates: { ...editingDevice.coordinates, lat: Number.parseFloat(e.target.value) },
                      })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-lng">Longitude</Label>
                  <Input
                    id="edit-lng"
                    type="number"
                    step="0.0001"
                    value={editingDevice.coordinates.lng}
                    onChange={(e) =>
                      setEditingDevice({
                        ...editingDevice,
                        coordinates: { ...editingDevice.coordinates, lng: Number.parseFloat(e.target.value) },
                      })
                    }
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleEditDevice}>Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Device Token Dialog */}
      <Dialog open={isTokenDialogOpen} onOpenChange={setIsTokenDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Token Perangkat</DialogTitle>
            <DialogDescription>Gunakan token ini untuk mengautentikasi perangkat IoT Anda</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-gray-100 rounded-lg">
              <div className="flex items-center justify-between">
                <code className="text-sm font-mono break-all">{deviceToken}</code>
                <Button variant="outline" size="sm" onClick={copyTokenToClipboard} className="ml-2 bg-transparent">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              <p>Simpan token ini dengan aman. Token akan kedaluwarsa dalam 30 hari.</p>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsTokenDialogOpen(false)}>Tutup</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
