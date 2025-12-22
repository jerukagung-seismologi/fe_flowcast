# Troubleshooting Login Issue

## Langkah-langkah untuk memperbaiki masalah login:

### 1. **Restart Next.js Development Server**

Environment variable (.env.local) hanya dibaca saat server pertama kali start.

```bash
# Stop server yang sedang berjalan (Ctrl+C)
# Kemudian jalankan ulang:
npm run dev
```

### 2. **Cek Console Browser (F12)**

Buka browser console dan perhatikan log berikut:

- `API Base URL: http://127.0.0.1:8000/api` - Ini harus muncul
- `Attempting login to: ...` - Menunjukkan API endpoint yang dipanggil
- Cek jika ada error CORS atau Network Error

### 3. **Pastikan Laravel Server Berjalan**

Buka terminal baru dan jalankan:

```bash
cd path/to/laravel/project
php artisan serve
```

Server harus berjalan di: http://127.0.0.1:8000

### 4. **Test API Connection**

Buka file `test-api.html` di browser untuk test koneksi langsung ke Laravel API.

### 5. **Cek CORS Configuration di Laravel**

Pastikan file `config/cors.php` memiliki konfigurasi:

```php
'paths' => ['api/*', 'sanctum/csrf-cookie'],

'allowed_methods' => ['*'],

'allowed_origins' => ['*'], // Untuk development
// Atau spesifik: ['http://localhost:3000']

'allowed_origins_patterns' => [],

'allowed_headers' => ['*'],

'exposed_headers' => [],

'max_age' => 0,

'supports_credentials' => false,
```

### 6. **Test Login dengan Credentials Laravel**

Gunakan username dan password yang ada di database Laravel:

- Username: `admin` (atau sesuai yang ada di database)
- Password: password yang sudah di-hash di Laravel

### 7. **Cek Error Message**

Jika muncul error, perhatikan pesan errornya:

- "Tidak dapat terhubung ke server Laravel" → Server Laravel belum jalan
- "401 Unauthorized" → Username/password salah
- "CORS policy" → Masalah CORS di Laravel

### 8. **Clear Browser Cache & LocalStorage**

```javascript
// Buka console browser dan jalankan:
localStorage.clear();
// Kemudian refresh halaman
```

## Common Issues:

### Issue 1: "ERR_NETWORK"

**Solusi:** Laravel server belum jalan. Jalankan `php artisan serve`

### Issue 2: "CORS policy error"

**Solusi:** Install dan configure Laravel CORS:

```bash
composer require fruitcake/laravel-cors
```

### Issue 3: Login berhasil tapi tidak redirect

**Solusi:** Cek di console browser apakah token tersimpan:

```javascript
console.log(localStorage.getItem("auth_token"));
```

## Test Manual di Browser Console:

```javascript
// Test API directly
fetch("http://127.0.0.1:8000/api/login", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    username: "admin",
    password: "password",
  }),
})
  .then((res) => res.json())
  .then((data) => console.log(data))
  .catch((err) => console.error(err));
```

## Debugging Steps:

1. ✅ Stop Next.js server (Ctrl+C)
2. ✅ Restart: `npm run dev`
3. ✅ Buka http://localhost:3000/login
4. ✅ Buka Console Browser (F12)
5. ✅ Isi form login
6. ✅ Perhatikan log di console
7. ✅ Cek Network tab untuk melihat request/response

## Jika masih bermasalah:

Kirim screenshot dari:

1. Browser Console (F12 → Console tab)
2. Network tab saat submit login
3. Terminal Laravel (jika ada error)
