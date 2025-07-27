"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"
import { Device } from "@/lib/data/FetchingDevices"
import { fetchDeviceLocation } from "@/lib/data/FetchingLocation"

type NewDeviceData = Omit<Device, "id" | "authToken" | "registrationDate" | "userId">

interface AddDeviceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddDevice: (newDevice: NewDeviceData) => Promise<Device>
  onTokenGenerated: (token: string) => void
  trigger?: React.ReactNode
}

export function AddDeviceDialog({
  open,
  onOpenChange,
  onAddDevice,
  onTokenGenerated,
  trigger,
}: AddDeviceDialogProps) {
  const [newDevice, setNewDevice] = useState({
    name: "",
    location: "",
    latitude: "",
    longitude: "",
    threshold: "2.0",
  })

  const handleAdd = async () => {
    const deviceToAdd = {
      name: newDevice.name,
      location: newDevice.location,
      coordinates: {
        lat: parseFloat(newDevice.latitude) || 0,
        lng: parseFloat(newDevice.longitude) || 0,
      },
      threshold: parseFloat(newDevice.threshold) || 2.0,
    }
    const addedDevice = await onAddDevice(deviceToAdd)
    if (addedDevice && addedDevice.authToken) {
      onTokenGenerated(addedDevice.authToken)
    }
    // Reset form after successful addition is handled in parent
  }

  const handleDetectLocation = async () => {
    try {
      const coords = await fetchDeviceLocation()
      setNewDevice({
        ...newDevice,
        latitude: coords.lat.toString(),
        longitude: coords.lng.toString(),
      })
    } catch (err) {
      alert("Gagal mengambil lokasi perangkat: " + (err as Error).message)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
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
                type="number"
                value={newDevice.latitude}
                onChange={(e) => setNewDevice({ ...newDevice, latitude: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                id="longitude"
                placeholder="106.8456"
                type="number"
                value={newDevice.longitude}
                onChange={(e) => setNewDevice({ ...newDevice, longitude: e.target.value })}
              />
            </div>
          </div>
          <Button
            type="button"
            variant="secondary"
            className="w-full mb-2"
            onClick={handleDetectLocation}
          >
            Deteksi Lokasi Otomatis
          </Button>
          <div className="grid gap-2">
            <Label htmlFor="threshold">Ambang Batas Siaga (meter)</Label>
            <Input
              id="threshold"
              placeholder="e.g., 2.0"
              type="number"
              step="0.1"
              value={newDevice.threshold}
              onChange={(e) => setNewDevice({ ...newDevice, threshold: e.target.value })}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Batal
          </Button>
          <Button onClick={handleAdd}>Tambah Perangkat</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
