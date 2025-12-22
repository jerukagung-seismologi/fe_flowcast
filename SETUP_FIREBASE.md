# Setup Firebase untuk HydroMeteo Sense Dashboard

## Arsitektur Hybrid: Laravel + Firebase

Proyek ini menggunakan **arsitektur hybrid**:

### 🔐 Laravel Backend (Autentikasi)

- **Login/Logout** → Laravel API
- **User Management** → Laravel Database
- **Token Authentication** → Laravel Sanctum/JWT

### 📊 Firebase (Data Real-time)

- **Devices (Perangkat)** → Firebase Firestore
- **Sensor Data (Real-time)** → Firebase Realtime Database
- **Logs/Events** → Firebase Firestore
- **File Storage** → Firebase Storage

## Langkah Setup Firebase

### 1. Buat Project Firebase

1. Buka [Firebase Console](https://console.firebase.google.com/)
2. Klik **"Add project"** atau **"Create a project"**
3. Beri nama project: `hydrometeo-sense` (atau sesuai keinginan)
4. Enable Google Analytics (optional)
5. Klik **"Create project"**

### 2. Tambahkan Web App ke Firebase

1. Di Firebase Console, klik icon **</>** (Web)
2. Beri nama app: `HydroMeteo Dashboard`
3. Centang **"Also set up Firebase Hosting"** (optional)
4. Klik **"Register app"**

### 3. Salin Firebase Configuration

Setelah register app, Anda akan mendapat konfigurasi seperti ini:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyAbc123...",
  authDomain: "hydrometeo-sense.firebaseapp.com",
  databaseURL: "https://hydrometeo-sense-default-rtdb.firebaseio.com",
  projectId: "hydrometeo-sense",
  storageBucket: "hydrometeo-sense.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123...",
  measurementId: "G-ABC123...",
};
```

### 4. Update File .env.local

Buka file `.env.local` dan isi dengan kredensial Firebase Anda:

```env
# Laravel API Configuration (untuk autentikasi)
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api

# Firebase Configuration (untuk data devices, logs, dan sensor real-time)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAbc123...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=hydrometeo-sense.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://hydrometeo-sense-default-rtdb.firebaseio.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=hydrometeo-sense
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=hydrometeo-sense.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123...
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-ABC123...
```

### 5. Enable Firebase Services

#### A. Firestore Database

1. Di Firebase Console, buka **"Firestore Database"**
2. Klik **"Create database"**
3. Pilih **"Start in production mode"** (atau test mode untuk development)
4. Pilih location: `asia-southeast1` (Singapore) atau terdekat
5. Klik **"Enable"**

#### B. Realtime Database

1. Di Firebase Console, buka **"Realtime Database"**
2. Klik **"Create database"**
3. Pilih location: `asia-southeast1`
4. Pilih **"Start in locked mode"** (atau test mode)
5. Klik **"Enable"**

#### C. Storage (Optional)

1. Di Firebase Console, buka **"Storage"**
2. Klik **"Get started"**
3. Pilih security rules (test mode untuk development)
4. Pilih location: `asia-southeast1`
5. Klik **"Done"**

### 6. Setup Firestore Rules

Di **Firestore Database → Rules**, paste rules ini:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Devices collection
    match /devices/{deviceId} {
      allow read, write: if true; // Ganti dengan auth rules nanti
    }

    // Logs collection
    match /logs/{logId} {
      allow read, write: if true;
    }

    // Users collection (optional)
    match /users/{userId} {
      allow read, write: if true;
    }
  }
}
```

### 7. Setup Realtime Database Rules

Di **Realtime Database → Rules**, paste rules ini:

```json
{
  "rules": {
    "devices": {
      "$deviceId": {
        ".read": true,
        ".write": true,
        "data": {
          ".indexOn": "timestamp"
        }
      }
    }
  }
}
```

### 8. Restart Next.js Server

Setelah mengisi `.env.local`:

```bash
# Stop server (Ctrl+C)
npm run dev
```

### 9. Test Firebase Connection

1. Login ke dashboard
2. Buka Console Browser (F12)
3. Seharusnya muncul: `Firebase initialized for data storage`
4. Tidak ada error Firebase lagi

## Struktur Data Firebase

### Firestore Collections:

#### 1. **devices** Collection

```
devices/{deviceId}
  - id: string
  - name: string
  - location: string
  - coordinates: { lat: number, lng: number }
  - userId: string (dari Laravel)
  - threshold: number
  - registrationDate: timestamp
  - authToken: string (optional)
```

#### 2. **logs** Collection

```
logs/{logId}
  - id: string
  - deviceId: string
  - userId: string
  - type: "info" | "warning" | "error" | "alert"
  - severity: "low" | "medium" | "high" | "critical"
  - message: string
  - timestamp: timestamp
  - metadata: object
```

### Realtime Database Structure:

```
devices/
  {deviceId}/
    data/
      {timestamp}/
        waterLevel: number
        rainfall: number
        temperature: number
        humidity: number
        windSpeed: number
        pressure: number
        batteryLevel: number
        timestamp: number
```

## Troubleshooting

### Error: "Firebase not initialized"

- Pastikan file `.env.local` sudah diisi dengan benar
- Restart Next.js server
- Clear browser cache

### Error: "Permission denied"

- Cek Firestore Rules dan Realtime Database Rules
- Untuk development, bisa set `allow read, write: if true;`

### Error: "Invalid Firebase config"

- Cek semua kredensial di `.env.local`
- Pastikan tidak ada typo
- Cek di Firebase Console apakah project sudah dibuat

## Alternative: Jika Tidak Ingin Pakai Firebase

Jika Anda ingin **semua data di Laravel** (tidak pakai Firebase sama sekali), kita perlu:

1. Buat API endpoint di Laravel untuk:

   - GET/POST/PUT/DELETE devices
   - GET/POST logs
   - GET sensor data real-time (via WebSocket atau polling)

2. Update semua file di `lib/data/`:
   - `FetchingDevices.ts` → pakai Laravel API
   - `FetchingLogs.ts` → pakai Laravel API
   - `FetchingData.ts` → pakai Laravel API

Beri tahu saya jika mau implementasi ini!
