"use client"

import { useState } from "react"
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
} from "lucide-react"

interface Device {
  id: number
  name: string
  location: string
  status: "online" | "offline"
  threshold: number
  registrationDate: string
  batteryLevel: number
  coordinates: { lat: number; lng: number }
  trends: {
    waterLevel: "up" | "down" | "stable"
    temperature: "up" | "down" | "stable"
    rainfall: "up" | "down" | "stable"
  }
}

export default function DevicesPage() {
  const [devices, setDevices] = useState<Device[]>([
    {
      id: 1,
      name: "Weather Station Jakarta Utara",
      location: "Kelapa Gading",
      status: "online",
      threshold: 3.0,
      registrationDate: "2023-03-15",
      batteryLevel: 87,
      coordinates: { lat: -6.1588, lng: 106.9056 },
      trends: {
        waterLevel: "up",
        temperature: "up",
        rainfall: "down",
      },
    },
    {
      id: 2,
      name: "Weather Station Jakarta Barat",
      location: "Cengkareng",
      status: "online",
      threshold: 2.5,
      registrationDate: "2023-01-22",
      batteryLevel: 92,
      coordinates: { lat: -6.1373, lng: 106.7395 },
      trends: {
        waterLevel: "stable",
        temperature: "down",
        rainfall: "up",
      },
    },
    {
      id: 3,
      name: "Weather Station Jakarta Selatan",
      location: "Kemang",
      status: "offline",
      threshold: 2.0,
      registrationDate: "2022-11-08",
      batteryLevel: 23,
      coordinates: { lat: -6.2615, lng: 106.8106 },
      trends: {
        waterLevel: "stable",
        temperature: "stable",
        rainfall: "stable",
      },
    },
  ])

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingDevice, setEditingDevice] = useState<Device | null>(null)
  const [newDevice, setNewDevice] = useState({
    name: "",
    location: "",
    threshold: 2.0,
    latitude: "",
    longitude: "",
    batteryLevel: 100,
  })

  const handleAddDevice = () => {
    const device: Device = {
      id: Date.now(),
      name: newDevice.name,
      location: newDevice.location,
      status: "offline",
      threshold: newDevice.threshold,
      registrationDate: new Date().toISOString().split("T")[0],
      batteryLevel: newDevice.batteryLevel,
      coordinates: {
        lat: newDevice.latitude ? Number.parseFloat(newDevice.latitude) : 0,
        lng: newDevice.longitude ? Number.parseFloat(newDevice.longitude) : 0,
      },
      trends: {
        waterLevel: "stable",
        temperature: "stable",
        rainfall: "stable",
      },
    }

    setDevices([...devices, device])
    setNewDevice({ name: "", location: "", threshold: 2.0, latitude: "", longitude: "", batteryLevel: 100 })
    setIsAddDialogOpen(false)
  }

  const handleEditDevice = () => {
    if (!editingDevice) return

    setDevices(devices.map((d) => (d.id === editingDevice.id ? editingDevice : d)))
    setIsEditDialogOpen(false)
    setEditingDevice(null)
  }

  const handleDeleteDevice = (id: number) => {
    setDevices(devices.filter((d) => d.id !== id))
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manajemen Perangkat Cerdas</h1>
          <p className="text-muted-foreground">Kelola stasiun cuaca dengan metadata komprehensif dan analisis tren</p>
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
              <DialogDescription>Add a new hydrometeorological monitoring station to your network.</DialogDescription>
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
                Cancel
              </Button>
              <Button onClick={handleAddDevice}>Add Device</Button>
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
                  {device.status}
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
                    <div className="font-medium text-gray-800">Registered</div>
                    <div className="text-xs text-gray-600">{device.registrationDate}</div>
                  </div>
                </div>
                <div className="flex items-center text-sm">
                  <Battery className={`h-4 w-4 mr-2 ${getBatteryColor(device.batteryLevel).split(" ")[0]}`} />
                  <div>
                    <div className="font-medium text-gray-800">Battery</div>
                    <div className={`text-xs font-medium ${getBatteryColor(device.batteryLevel).split(" ")[0]}`}>
                      {device.batteryLevel}%
                    </div>
                  </div>
                </div>
                <div className="col-span-2 flex items-center text-sm">
                  <MapPin className="h-4 w-4 mr-2 text-blue-600" />
                  <div>
                    <div className="font-medium text-gray-800">Coordinates</div>
                    <div className="text-xs text-gray-600">
                      {device.coordinates.lat.toFixed(4)}, {device.coordinates.lng.toFixed(4)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Trend Indicators */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Current Trends</h4>
                <div className="grid grid-cols-3 gap-2">
                  <div className="flex items-center justify-center p-2 bg-gradient-to-br from-blue-100 to-cyan-100 rounded">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        {getTrendIcon(device.trends.waterLevel)}
                      </div>
                      <div className="text-xs text-blue-600">Water</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center p-2 bg-gradient-to-br from-orange-100 to-red-100 rounded">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        {getTrendIcon(device.trends.temperature)}
                      </div>
                      <div className="text-xs text-orange-600">Temp</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center p-2 bg-gradient-to-br from-green-100 to-emerald-100 rounded">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        {getTrendIcon(device.trends.rainfall)}
                      </div>
                      <div className="text-xs text-green-600">Rain</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Device Settings */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Alert Threshold:</span>
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
                  className="flex-1 bg-gradient-to-r from-red-50 to-pink-50 hover:from-red-100 hover:to-pink-100 border-red-200"
                  onClick={() => handleDeleteDevice(device.id)}
                >
                  <Trash2 className="h-3 w-3 mr-1 text-red-600" />
                  Delete
                </Button>
              </div>

              {/* Status Alerts */}
              {device.batteryLevel < 30 && (
                <div className="flex items-center text-xs text-orange-700 bg-gradient-to-r from-orange-100 to-yellow-100 p-2 rounded border border-orange-200">
                  <Battery className="h-3 w-3 mr-1" />
                  Low battery - maintenance required
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
            <DialogTitle>Edit Weather Station</DialogTitle>
            <DialogDescription>Update device information, settings, and metadata.</DialogDescription>
          </DialogHeader>
          {editingDevice && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Station Name</Label>
                <Input
                  id="edit-name"
                  value={editingDevice.name}
                  onChange={(e) => setEditingDevice({ ...editingDevice, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-location">Location</Label>
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
                  <Label htmlFor="edit-battery">Battery Level (%)</Label>
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
                <Label htmlFor="edit-threshold">Alert Threshold (meters)</Label>
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
              Cancel
            </Button>
            <Button onClick={handleEditDevice}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
