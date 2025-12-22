# Laravel API Endpoints (Controller Terbaru)

Base URL: gunakan env `NEXT_PUBLIC_API_URL` (default `http://127.0.0.1:8000/api`). Semua endpoint di bawah otomatis memakai header `Authorization: Bearer {token}` dari `auth_token` di localStorage.

## 🔐 Authentication

### POST `/api/login`

Login user.

```json
Request
{
  "username": "admin",
  "password": "password"
}

Response
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

### POST `/api/register`

Register user baru (opsional jika pendaftaran ditutup).

```json
Request
{
  "username": "newuser",
  "email": "user@example.com",
  "password": "password",
  "name": "New User"
}
```

Response sama seperti login (mengembalikan `access_token` + `user`).

### POST `/api/logout`

Logout user aktif. Wajib header Bearer.

```json
Response
{
  "success": true,
  "message": "Logged out successfully"
}
```

## 👤 User Profile

### GET `/api/user`

Ambil profil user saat ini.

```json
Response
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

Update nama/email.

```json
Request
{
  "name": "Updated Name",
  "email": "newemail@example.com"
}

Response
{
  "success": true,
  "message": "Profile updated successfully",
  "data": { ... }
}
```

### PUT `/api/user/password`

Ganti password.

```json
Request
{
  "current_password": "oldpassword",
  "new_password": "newpassword"
}
```

### DELETE `/api/user`

Hapus akun user.

```json
Response
{
  "success": true,
  "message": "Account deleted successfully"
}
```

## 📱 Devices

Semua endpoint memakai Bearer token. Backend sekarang memakai field dari tabel Laravel:

- `id_device`, `name`, `location`, `latitude`, `longitude`, `pengguna_id`, `setting.threshold`, `created_at`.

### GET `/api/devices`

List perangkat milik user.

```json
Response
{
  "success": true,
  "data": [
    {
      "id_device": 1,
      "name": "Stasiun Jakarta",
      "location": "Jakarta Utara",
      "latitude": "-6.138414",
      "longitude": "106.863956",
      "pengguna_id": 1,
      "setting": { "threshold": "2.5" },
      "created_at": "2025-01-01T00:00:00.000000Z"
    }
  ]
}
```

### POST `/api/devices`

Buat perangkat baru.

```json
Request
{
  "name": "Stasiun Baru",
  "location": "Bandung",
  "latitude": -6.917464,
  "longitude": 107.619123,
  "threshold": 3.0
}

Response
{
  "success": true,
  "message": "Device created successfully",
  "data": {
    "id_device": 4,
    "name": "Stasiun Baru",
    "location": "Bandung",
    "latitude": "-6.917464",
    "longitude": "107.619123",
    "pengguna_id": 1,
    "setting": { "threshold": "3.0" },
    "created_at": "2025-01-01T00:00:00.000000Z"
  }
}
```

### PUT `/api/devices/{id_device}`

Update perangkat.

```json
Request
{
  "name": "Updated Name",
  "location": "Updated Location",
  "latitude": -6.9,
  "longitude": 107.6,
  "threshold": 2.8
}

Response
{
  "success": true,
  "message": "Device updated successfully",
  "data": { ... }
}
```

### DELETE `/api/devices/{id_device}`

Hapus perangkat.

```json
Response
{
  "success": true,
  "message": "Device deleted successfully"
}
```

> Catatan: endpoint `/devices/{id}/token` tidak dipakai di controller terbaru/frontend.

## 🌊 Dashboard (Device + Sensor Terkini)

### GET `/api/dashboard`

Mengembalikan daftar perangkat beserta `latest_data` sensor. Frontend menilai status online jika `latest_data.created_at` < 60 menit dari sekarang.

```json
Response
{
  "success": true,
  "data": [
    {
      "id_device": 1,
      "name": "Stasiun Jakarta",
      "location": "Jakarta Utara",
      "updated_at": "2025-01-01T12:05:00.000000Z",
      "setting": { "threshold": "2.5" },
      "latest_data": {
        "water_level": "2.3",
        "rainrate": "12.5",
        "temp": "28.5",
        "humid": "75",
        "pressure": "1012",
        "created_at": "2025-01-01T12:00:00.000000Z"
      }
    }
  ]
}
```

## 📋 Logs & Alerts

### GET `/api/logs`

Ambil log. Gunakan query untuk filter/alert terbaru.

Query yang dipakai frontend: `type=alert`, `limit`, `search` (opsional).

```json
Response
{
  "success": true,
  "data": [
    {
      "id": 10,
      "device_id": 1,
      "user_id": 1,
      "type": "warning",
      "severity": "medium",
      "message": "Water level approaching threshold",
      "metadata": { "waterLevel": 2.3, "threshold": 2.5 },
      "created_at": "2025-01-01T12:00:00.000000Z"
    }
  ]
}
```

### Contoh recent alerts

`GET /api/logs?type=alert&limit=5`

> Endpoint `/logs/alerts` sudah digabung ke query `type=alert` pada `/logs`.

### (Jika route resource diaktifkan) POST `/api/logs`

Payload contoh:

```json
{
  "device_id": 1,
  "type": "warning",
  "severity": "medium",
  "message": "High rainfall detected",
  "metadata": { "rainfall": 45, "duration": "1h" }
}
```

### DELETE `/api/logs/{id}`

Menghapus log (opsional sesuai kebutuhan backend).

## 🔒 Catatan Keamanan

- Semua endpoint selain `/login` dan `/register` wajib Bearer token.
- Pastikan user hanya mengakses data miliknya (gunakan `pengguna_id` atau policy).
- Validasi input dan aktifkan CORS untuk domain Next.js.
- Rate limiting disarankan untuk mencegah abuse.

## 🚀 Implementasi singkat (routes/api.php)

```php
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/user', [UserController::class, 'profile']);
    Route::put('/user/profile', [UserController::class, 'updateProfile']);
    Route::put('/user/password', [UserController::class, 'updatePassword']);
    Route::delete('/user', [UserController::class, 'deleteAccount']);

    Route::apiResource('devices', DeviceController::class);
    Route::get('/dashboard', [DeviceController::class, 'dashboard']);

    Route::get('/logs', [LogController::class, 'index']);
    Route::post('/logs', [LogController::class, 'store']); // optional
    Route::delete('/logs/{log}', [LogController::class, 'destroy']); // optional
});
```
