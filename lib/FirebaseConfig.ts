// Laravel API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api"

// Log configuration for debugging
if (typeof window !== 'undefined') {
  console.log('API Base URL (Laravel):', API_BASE_URL)
  console.log('Using Laravel API for all data operations')
}

// Dummy exports for backward compatibility (will be removed later)
export const auth = {}
export const db = {}
export const storage = {}
export const rtdb = {}
