import axios from "axios"
import { API_BASE_URL } from "@/lib/ApiConfig"

export interface UserProfile {
  id: number
  username: string
  email: string
  displayName?: string // Kita konsisten pakai displayName
  role: "admin" | "user"
  signed_in?: string | null
  created_at: string
  updated_at: string
}

export interface LoginResponse {
  success: boolean
  message: string
  data: {
    access_token: string
    token_type: string
    user: UserProfile
  }
}

// REGISTER: Sign up with email, password, username, and displayName
export const signUpWithEmail = async (
  email: string,
  password: string,
  displayName: string,
  username: string,
): Promise<{ token: string; user: UserProfile }> => {
  try {
    // Kirim data sesuai yang diminta ApiAuthController Laravel
    const response = await axios.post<LoginResponse>(`${API_BASE_URL}/register`, {
      username,
      email,
      password,
      displayName, // <-- Kirim sebagai displayName
    })

    const { access_token, user } = response.data.data
    
    // Save to localStorage
    localStorage.setItem("auth_token", access_token)
    localStorage.setItem("user_info", JSON.stringify(user))

    return { token: access_token, user }
  } catch (error: any) {
    const message = error.response?.data?.message || "Registration failed"
    throw new Error(message)
  }
}

// LOGIN: Sign in with email/username and password
export const signInWithEmail = async (
  username: string,
  password: string,
): Promise<{ token: string; user: UserProfile }> => {
  try {
    console.log("Attempting login to:", `${API_BASE_URL}/login`)
    
    const response = await axios.post<LoginResponse>(`${API_BASE_URL}/login`, {
      username, // Backend kita mengharapkan key 'username' (meski isinya email)
      password,
    })

    const { access_token, user } = response.data.data
    
    // Save to localStorage
    localStorage.setItem("auth_token", access_token)
    localStorage.setItem("user_info", JSON.stringify(user))

    return { token: access_token, user }
  } catch (error: any) {
    console.error("Login error details:", error)
    
    if (error.code === "ERR_NETWORK") {
      throw new Error("Tidak dapat terhubung ke server Laravel. Pastikan server berjalan.")
    }
    
    const message = error.response?.data?.message || error.message || "Login gagal"
    throw new Error(message)
  }
}

// Sign out
export const signOutUser = async (): Promise<void> => {
  try {
    const token = localStorage.getItem("auth_token")
    if (token) {
      await axios.post(`${API_BASE_URL}/logout`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
    }
    localStorage.removeItem("auth_token")
    localStorage.removeItem("user_info")
  } catch (error: any) {
    localStorage.removeItem("auth_token")
    localStorage.removeItem("user_info")
    throw new Error("Logout failed")
  }
}

// Get user profile
export const getUserProfile = async (): Promise<UserProfile | null> => {
  try {
    const token = localStorage.getItem("auth_token")
    const userInfo = localStorage.getItem("user_info")
    
    if (!token || !userInfo) return null
    return JSON.parse(userInfo) as UserProfile
  } catch (error) {
    console.error("Error getting user profile:", error)
    return null
  }
}

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem("auth_token")
}