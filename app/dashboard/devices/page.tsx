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
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Plus } from "lucide-react"

import {
  addDevice,
  updateDevice,
  deleteDevice,
  generateDeviceToken,
  type Device,
} from "@/lib/data/LaravelDevices"
import { fetchDevicesWithSensors, type DeviceWithSensors } from "@/lib/data/LaravelSensorData"
import { useAuth } from "@/hooks/useAuth"
import { EmptyState } from "@/components/empty-state"
import { DeviceCard } from "@/components/device/DeviceCard"
import { AddDeviceDialog } from "@/components/device/AddDeviceDialog"
import { EditDeviceDialog } from "@/components/device/EditDeviceDialog"
import { DeviceTokenDialog } from "@/components/device/DeviceTokenDialog"
import { DeleteConfirmationDialog } from "@/components/device/DeleteConfirmationDialog"
import LoadingSpinner from "@/components/LoadingSpinner"
import { useIsMobile } from "@/hooks/use-mobile"

export default function DevicesPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [devices, setDevices] = useState<DeviceWithSensors[]>([])
  const [loading, setLoading] = useState(true)

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isTokenDialogOpen, setIsTokenDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deviceToDelete, setDeviceToDelete] = useState<{ id: string; name: string } | null>(null)
  const [editingDevice, setEditingDevice] = useState<DeviceWithSensors | null>(null)
  const [deviceToken, setDeviceToken] = useState<string>("")
  const isMobile = useIsMobile()

  const loadDevices = async () => {
    if (!user?.id) return

    try {
      setLoading(true)
      const devicesData = await fetchDevicesWithSensors(String(user.id))
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
  }, [user?.id])

  const handleAddDevice = async (newDevice: Omit<Device, "id" | "authToken" | "registrationDate" | "userId">) => {
    if (!user?.uid) throw new Error("User not authenticated")

    try {
      const deviceData = {
        ...newDevice,
        userId: user.uid,
      }

      const newDeviceResult = await addDevice(deviceData)
      await loadDevices() // Reload devices to get the full DeviceWithSensors object
      setIsAddDialogOpen(false)

      toast({
        title: "Berhasil",
        description: "Perangkat berhasil ditambahkan!",
      })

      // Show token dialog for the new device
      if (newDeviceResult.authToken) {
        setDeviceToken(newDeviceResult.authToken)
        setIsTokenDialogOpen(true)
      }
      return newDeviceResult
    } catch (error) {
      console.error("Error adding device:", error)
      toast({
        title: "Error",
        description: "Gagal menambahkan perangkat. Silakan coba lagi.",
        variant: "destructive",
      })
      throw error
    }
  }

  const handleEditDevice = async () => {
    if (!editingDevice || !user?.id) return

    try {
      const { id, name, location, coordinates, threshold } = editingDevice
      const updateData = { name, location, coordinates, threshold }
      const updatedDevice = await updateDevice(id, updateData)
      if (updatedDevice) {
        await loadDevices() // Reload to get fresh data
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

  const handleDeleteDevice = async () => {
    if (!deviceToDelete || !user?.id) return

    try {
      const success = await deleteDevice(deviceToDelete.id)
      if (success) {
        setDevices(devices.filter((d) => d.id !== deviceToDelete.id))
        setIsDeleteDialogOpen(false)
        setDeviceToDelete(null)
        toast({
          title: "Berhasil",
          description: `Perangkat "${deviceToDelete.name}" berhasil dihapus!`,
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
    if (!user?.id) return

    try {
      const tokenData = await generateDeviceToken(deviceId)
      if (tokenData) {
        setDeviceToken(tokenData.token)
        setIsTokenDialogOpen(true)

        toast({
          title: "Berhasil",
          description: "Token autentikasi perangkat berhasil dibuat!",
        })
      } else {
        toast({
          title: "Gagal",
          description: "Tidak dapat membuat token. Perangkat tidak ditemukan atau Anda tidak memiliki izin.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error generating token:", error)
      toast({
        title: "Error",
        description: "Gagal membuat token perangkat. Silakan coba lagi.",
        variant: "destructive",
      })
    }
  }

  const openEditDialog = (device: DeviceWithSensors) => {
    setEditingDevice({ ...device })
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (device: { id: string; name: string }) => {
    setDeviceToDelete(device)
    setIsDeleteDialogOpen(true)
  }

  if (loading) {
    return <LoadingSpinner />
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
          {/* Tambahkan button di sini jika mobile */}
          {isMobile && (
            <AddDeviceDialog
              open={isAddDialogOpen}
              onOpenChange={setIsAddDialogOpen}
              onAddDevice={handleAddDevice}
              onTokenGenerated={setDeviceToken}
              trigger={
                <Button
                  className="w-full flex justify-center items-center bg-emerald-600 hover:bg-blue-600"
                  size="icon"
                >
                  <Plus className="h-5 w-5" />
                  <span className="sr-only">Tambah Perangkat</span>
                </Button>
              }
            />
          )}
        </div>
        <EmptyState type="devices" onAction={() => setIsAddDialogOpen(true)} />

        {/* Add Device Dialog */}
        {!isMobile && (
          <AddDeviceDialog
            open={isAddDialogOpen}
            onOpenChange={setIsAddDialogOpen}
            onAddDevice={handleAddDevice}
            onTokenGenerated={setDeviceToken}
            trigger={
              <Button className="bg-emerald-600 hover:bg-blue-600">
                <Plus className="h-4 w-4 mr-2" />
                Tambah Perangkat
              </Button>
            }
          />
        )}
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
        {/* Button responsif */}
        <AddDeviceDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onAddDevice={handleAddDevice}
          onTokenGenerated={setDeviceToken}
          trigger={
            isMobile ? (
              <Button
                className="w-12 h-12 p-0 rounded-full bg-emerald-600 hover:bg-blue-600"
                size="icon"
              >
                <Plus className="h-6 w-6" />
                <span className="sr-only">Tambah Perangkat</span>
              </Button>
            ) : (
              <Button className="bg-emerald-600 hover:bg-blue-600">
                <Plus className="h-4 w-4 mr-2" />
                Tambah Perangkat
              </Button>
            )
          }
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {devices.map((device) => (
          <DeviceCard
            key={device.id}
            device={device}
            onEdit={openEditDialog}
            onDelete={openDeleteDialog}
            onGenerateToken={handleGenerateToken}
          />
        ))}
      </div>

      {/* Edit Dialog */}
      <EditDeviceDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        device={editingDevice}
        onEditDevice={handleEditDevice}
        setEditingDevice={setEditingDevice}
      />

      {/* Device Token Dialog */}
      <DeviceTokenDialog open={isTokenDialogOpen} onOpenChange={setIsTokenDialogOpen} token={deviceToken} />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteDevice}
        deviceName={deviceToDelete?.name}
      />
    </div>
  )
}