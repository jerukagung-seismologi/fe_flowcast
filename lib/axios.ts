import axios from 'axios';

// Membuat instance axios dengan settingan default
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// INTERCEPTOR (PENTING!)
// Ini tugasnya otomatis menempelkan Token "Bearer ..." kalau user sudah login
api.interceptors.request.use((config) => {
    // Cek apakah ada token di penyimpanan browser (localStorage)
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;