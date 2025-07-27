"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { type DeviceWithSensors } from "@/lib/data/FetchingData"
import { fetchDeviceLocation } from "@/lib/data/FetchingLocation"

interface EditDeviceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  device: DeviceWithSensors | null
  onEditDevice: () => Promise<void>
  setEditingDevice: (device: DeviceWithSensors | null) => void
}

export function EditDeviceDialog({
  open,
  onOpenChange,
  device,
  onEditDevice,
  setEditingDevice,
}: EditDeviceDialogProps) {
  if (!device) return null

  const handleDetectLocation = async () => {
    try {
      const coords = await fetchDeviceLocation()
      setEditingDevice({
        ...device,
        coordinates: {
          ...device.coordinates,
          lat: coords.lat,
          lng: coords.lng,
        },
      })
    } catch (err) {
      alert("Gagal mengambil lokasi perangkat: " + (err as Error).message)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Perangkat</DialogTitle>
          <DialogDescription>Perbarui informasi perangkat, pengaturan, dan metadata</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="edit-name">Nama Stasiun</Label>
            <Input
              id="edit-name"
              value={device.name}
              onChange={(e) => setEditingDevice({ ...device, name: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-location">Lokasi</Label>
            <Input
              id="edit-location"
              value={device.location}
              onChange={(e) => setEditingDevice({ ...device, location: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-lat">Latitude</Label>
              <Input
                id="edit-lat"
                type="number"
                step="0.0001"
                value={device.coordinates.lat}
                onChange={(e) =>
                  setEditingDevice({
                    ...device,
                    coordinates: { ...device.coordinates, lat: Number.parseFloat(e.target.value) },
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
                value={device.coordinates.lng}
                onChange={(e) =>
                  setEditingDevice({
                    ...device,
                    coordinates: { ...device.coordinates, lng: Number.parseFloat(e.target.value) },
                  })
                }
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
            <Label htmlFor="edit-threshold">Ambang Batas Siaga (meter)</Label>
            <Input
              id="edit-threshold"
              type="number"
              step="0.1"
              value={device.threshold}
              onChange={(e) => setEditingDevice({ ...device, threshold: Number.parseFloat(e.target.value) })}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Batal
          </Button>
          <Button onClick={onEditDevice}>Simpan</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}