// Laravel API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

// Log configuration for debugging
if (typeof window !== 'undefined') {
  console.log('API Base URL (Laravel):', API_BASE_URL)
  console.log('Using Laravel API for all data operations')
}
