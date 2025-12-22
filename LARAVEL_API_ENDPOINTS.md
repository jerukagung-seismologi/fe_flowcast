# Laravel API Endpoints Documentation

Dokumentasi lengkap untuk API endpoints Laravel yang perlu dibuat untuk HydroMeteo Sense Dashboard.

## 🔐 Authentication Endpoints

### POST `/api/login`

**Login user**

```json
Request:
{
  "username": "admin",
  "password": "password"
}

Response:
{
  "success": true,
  "message": "Login successful",
  "data": {
    "access_token": "eyJ0eXAiOiJKV1...",
    "token_type": "Bearer",
    "user": {
      "id": 1,
      "username": "admin",
      "email": "admin@example.com",
      "displayName": "Admin User",
      "role": "admin",
      "created_at": "2025-01-01T00:00:00.000000Z",
      "updated_at": "2025-01-01T00:00:00.000000Z"
    }
  }
}
```

### POST `/api/logout`

**Logout user**

```
Headers:
  Authorization: Bearer {token}

Response:
{
  "success": true,
  "message": "Logged out successfully"
}
```

### POST `/api/register` (Optional)

**Register new user**

```json
Request:
{
  "username": "newuser",
  "email": "user@example.com",
  "password": "password",
  "name": "New User"
}

Response:
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "access_token": "eyJ0eXAiOiJKV1...",
    "token_type": "Bearer",
    "user": { ... }
  }
}
```

---

## 📱 Devices Endpoints

### GET `/api/devices`

**Get all devices untuk user yang login**

```
Headers:
  Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": [
    {
      "id": "device001",
      "name": "Stasiun Jakarta",
      "location": "Jakarta Utara",
      "coordinates": {
        "lat": -6.138414,
        "lng": 106.863956
      },
      "userId": "1",
      "threshold": 2.5,
      "authToken": "device_token_xxx",
      "registrationDate": "2025-01-01T00:00:00.000000Z"
    }
  ]
}
```

### GET `/api/devices/{deviceId}`

**Get single device by ID**

```
Headers:
  Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": {
    "id": "device001",
    "name": "Stasiun Jakarta",
    ...
  }
}
```

### POST `/api/devices`

**Create new device**

```json
Headers:
  Authorization: Bearer {token}

Request:
{
  "name": "Stasiun Baru",
  "location": "Bandung",
  "coordinates": {
    "lat": -6.917464,
    "lng": 107.619123
  },
  "threshold": 3.0
}

Response:
{
  "success": true,
  "message": "Device created successfully",
  "data": {
    "id": "device004",
    "name": "Stasiun Baru",
    ...
  }
}
```

### PUT `/api/devices/{deviceId}`

**Update device**

```json
Headers:
  Authorization: Bearer {token}

Request:
{
  "name": "Updated Name",
  "location": "Updated Location",
  "threshold": 2.8
}

Response:
{
  "success": true,
  "message": "Device updated successfully",
  "data": { ... }
}
```

### DELETE `/api/devices/{deviceId}`

**Delete device**

```
Headers:
  Authorization: Bearer {token}

Response:
{
  "success": true,
  "message": "Device deleted successfully"
}
```

### POST `/api/devices/{deviceId}/token`

**Generate auth token untuk device**

```
Headers:
  Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": {
    "token": "HydroMeteo_abc123_1234567890",
    "deviceId": "device001"
  }
}
```

---

## 📊 Sensor Data Endpoints

### GET `/api/devices/sensors`

**Get semua devices dengan data sensor terkini**

```
Headers:
  Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": [
    {
      "id": "device001",
      "name": "Stasiun Jakarta",
      "status": "online",
      "lastUpdate": "2025-01-01T12:00:00.000000Z",
      "batteryLevel": 85,
      "waterLevel": {
        "value": 2.3,
        "trend": "up",
        "change": 0.15
      },
      "rainfall": {
        "value": 12.5,
        "trend": "stable",
        "change": 0.0
      },
      "temperature": {
        "value": 28.5,
        "trend": "down",
        "change": -1.2
      },
      "humidity": {
        "value": 75,
        "trend": "up",
        "change": 5
      },
      "windSpeed": {
        "value": 15.3,
        "trend": "stable",
        "change": 0.5
      },
      "pressure": {
        "value": 1012,
        "trend": "up",
        "change": 2
      }
    }
  ]
}
```

### GET `/api/devices/{deviceId}/sensors`

**Get sensor data untuk device tertentu**

```
Headers:
  Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": {
    "deviceId": "device001",
    "timestamp": "2025-01-01T12:00:00.000000Z",
    "waterLevel": 2.3,
    "rainfall": 12.5,
    "temperature": 28.5,
    "humidity": 75,
    "windSpeed": 15.3,
    "pressure": 1012,
    "batteryLevel": 85
  }
}
```

### GET `/api/devices/{deviceId}/sensors/history`

**Get historical sensor data**

```
Headers:
  Authorization: Bearer {token}

Query Parameters:
  ?from=2025-01-01&to=2025-01-31&limit=100

Response:
{
  "success": true,
  "data": [
    {
      "timestamp": "2025-01-01T12:00:00.000000Z",
      "waterLevel": 2.3,
      "rainfall": 12.5,
      ...
    }
  ]
}
```

---

## 📋 Logs Endpoints

### GET `/api/logs`

**Get all logs untuk user**

```
Headers:
  Authorization: Bearer {token}

Query Parameters (optional):
  ?search=keyword
  &type=info|warning|error|alert
  &severity=low|medium|high|critical
  &from=2025-01-01

Response:
{
  "success": true,
  "data": [
    {
      "id": "log001",
      "deviceId": "device001",
      "userId": "1",
      "type": "warning",
      "severity": "medium",
      "message": "Water level approaching threshold",
      "timestamp": "2025-01-01T12:00:00.000000Z",
      "metadata": {
        "waterLevel": 2.3,
        "threshold": 2.5
      }
    }
  ]
}
```

### GET `/api/logs/alerts`

**Get recent alerts**

```
Headers:
  Authorization: Bearer {token}

Query Parameters:
  ?limit=5

Response:
{
  "success": true,
  "data": [ ... ] // Array of log events
}
```

### POST `/api/logs`

**Create new log event**

```json
Headers:
  Authorization: Bearer {token}

Request:
{
  "deviceId": "device001",
  "type": "warning",
  "severity": "medium",
  "message": "High rainfall detected",
  "metadata": {
    "rainfall": 45,
    "duration": "1hr"
  }
}

Response:
{
  "success": true,
  "message": "Log created successfully",
  "data": { ... }
}
```

### DELETE `/api/logs/{logId}`

**Delete log**

```
Headers:
  Authorization: Bearer {token}

Response:
{
  "success": true,
  "message": "Log deleted successfully"
}
```

---

## 👤 User Profile Endpoints

### GET `/api/user`

**Get current user profile**

```
Headers:
  Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": {
    "id": 1,
    "username": "admin",
    "email": "admin@example.com",
    "displayName": "Admin User",
    "role": "admin",
    "created_at": "2025-01-01T00:00:00.000000Z",
    "updated_at": "2025-01-01T00:00:00.000000Z"
  }
}
```

### PUT `/api/user/profile`

**Update user profile**

```json
Headers:
  Authorization: Bearer {token}

Request:
{
  "name": "Updated Name",
  "email": "newemail@example.com"
}

Response:
{
  "success": true,
  "message": "Profile updated successfully",
  "data": { ... }
}
```

### PUT `/api/user/password`

**Update password**

```json
Headers:
  Authorization: Bearer {token}

Request:
{
  "current_password": "oldpassword",
  "new_password": "newpassword"
}

Response:
{
  "success": true,
  "message": "Password updated successfully"
}
```

### DELETE `/api/user`

**Delete account**

```
Headers:
  Authorization: Bearer {token}

Response:
{
  "success": true,
  "message": "Account deleted successfully"
}
```

---

## 📊 Charts/Analytics Endpoints (Optional)

### GET `/api/analytics/water-level`

**Get water level data untuk charts**

```
Headers:
  Authorization: Bearer {token}

Query Parameters:
  ?deviceId=device001 (optional, untuk specific device)
  &period=7d|30d|90d

Response:
{
  "success": true,
  "data": [
    {
      "date": "2025-01-01",
      "value": 2.3,
      "deviceName": "Stasiun Jakarta"
    }
  ]
}
```

### GET `/api/analytics/rainfall`

**Get rainfall data**

```
Similar to water-level endpoint
```

---

## 🔒 Security Notes

1. **Authentication**: Semua endpoint (kecuali `/login` dan `/register`) harus menggunakan Bearer Token
2. **Authorization**: User hanya bisa akses data miliknya sendiri (checked via `userId`)
3. **Validation**: Validasi semua input di backend
4. **Rate Limiting**: Implement rate limiting untuk mencegah abuse
5. **CORS**: Configure CORS untuk allow Next.js domain

---

## 📦 Laravel Implementation Example

```php
// routes/api.php
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [UserController::class, 'profile']);

    Route::apiResource('devices', DeviceController::class);
    Route::post('/devices/{device}/token', [DeviceController::class, 'generateToken']);
    Route::get('/devices/sensors', [DeviceController::class, 'sensorsData']);

    Route::apiResource('logs', LogController::class);
    Route::get('/logs/alerts', [LogController::class, 'alerts']);

    Route::put('/user/profile', [UserController::class, 'updateProfile']);
    Route::put('/user/password', [UserController::class, 'updatePassword']);
    Route::delete('/user', [UserController::class, 'deleteAccount']);
});
```

## 🚀 Next Steps

1. Buat migrations untuk tables: `devices`, `logs`, `sensor_data`
2. Buat Models: `Device`, `Log`, `SensorData`
3. Buat Controllers sesuai endpoints di atas
4. Setup authentication (Laravel Sanctum atau JWT)
5. Test dengan Postman/Insomnia
6. Update `useMockData = false` di Next.js services
