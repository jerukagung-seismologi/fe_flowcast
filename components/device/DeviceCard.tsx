import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  MapPin,
  Wifi,
  WifiOff,
  Calendar,
  TrendingUp,
  TrendingDown,
  Minus,
  Key,
  Edit,
  Trash2,
} from "lucide-react"
import { type DeviceWithSensors } from "@/lib/data/FetchingDevice"

interface DeviceCardProps {
  device: DeviceWithSensors
  onEdit: (device: DeviceWithSensors) => void
  onDelete: (device: { id: string; name: string }) => void
  onGenerateToken: (id: string) => void
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

export function DeviceCard({ device, onEdit, onDelete, onGenerateToken }: DeviceCardProps) {
  return (
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
            {device.status === "online" ? <Wifi className="h-3 w-3 mr-1" /> : <WifiOff className="h-3 w-3 mr-1" />}
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
                <div className="flex items-center justify-center mb-1">{getTrendIcon(device.trends.waterLevel)}</div>
                <div className="text-xs text-blue-600">Air</div>
              </div>
            </div>
            <div className="flex items-center justify-center p-2 bg-gradient-to-br from-orange-100 to-red-100 rounded">
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">{getTrendIcon(device.trends.temperature)}</div>
                <div className="text-xs text-orange-600">Suhu</div>
              </div>
            </div>
            <div className="flex items-center justify-center p-2 bg-gradient-to-br from-green-100 to-emerald-100 rounded">
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">{getTrendIcon(device.trends.rainfall)}</div>
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
            onClick={() => onEdit(device)}
          >
            <Edit className="h-3 w-3 mr-1 text-blue-600" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 border-green-200"
            onClick={() => onGenerateToken(device.id)}
          >
            <Key className="h-3 w-3 mr-1 text-green-600" />
            Token
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-gradient-to-r from-red-50 to-pink-50 hover:from-red-100 hover:to-pink-100 border-red-200"
            onClick={() => onDelete({ id: device.id, name: device.name })}
          >
            <Trash2 className="h-3 w-3 mr-1 text-red-600" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}