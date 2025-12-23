import axios from "axios"
import { API_BASE_URL } from "@/lib/ApiConfig"

export interface UserProfile {
  id: number
  username: string
  email: string
  name?: string
  displayName?: string
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

// Sign up with email and password (Laravel)
export const signUpWithEmail = async (
  email: string,
  password: string,
  name: string,
  username: string,
): Promise<{ token: string; user: UserProfile }> => {
  try {
    const response = await axios.post<LoginResponse>(`${API_BASE_URL}/register`, {
      username,
      email,
      password,
      name,
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

// Sign in with email and password (Laravel)
export const signInWithEmail = async (
  username: string,
  password: string,
): Promise<{ token: string; user: UserProfile }> => {
  try {
    console.log("Attempting login to:", `${API_BASE_URL}/login`)
    console.log("With credentials:", { username })
    
    const response = await axios.post<LoginResponse>(`${API_BASE_URL}/login`, {
      username,
      password,
    })

    console.log("Login response:", response.data)

    const { access_token, user } = response.data.data
    
    // Save to localStorage
    localStorage.setItem("auth_token", access_token)
    localStorage.setItem("user_info", JSON.stringify(user))

    console.log("Token saved to localStorage")

    return { token: access_token, user }
  } catch (error: any) {
    console.error("Login error details:", error)
    console.error("Error response:", error.response)
    
    if (error.code === "ERR_NETWORK") {
      throw new Error("Tidak dapat terhubung ke server Laravel. Pastikan server Laravel berjalan di http://127.0.0.1:8000")
    }
    
    const message = error.response?.data?.message || error.message || "Login gagal"
    throw new Error(message)
  }
}

// Sign out (Laravel)
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
    // Clear local storage even if API call fails
    localStorage.removeItem("auth_token")
    localStorage.removeItem("user_info")
    throw new Error("Logout failed")
  }
}

// Get user profile (Laravel)
export const getUserProfile = async (): Promise<UserProfile | null> => {
  try {
    const token = localStorage.getItem("auth_token")
    const userInfo = localStorage.getItem("user_info")
    
    if (!token || !userInfo) return null

    // Parse user info from localStorage
    const user = JSON.parse(userInfo) as UserProfile
    
    // Optionally, verify token with API
    // const response = await axios.get<{ success: boolean; data: UserProfile }>(
    //   `${API_BASE_URL}/user`,
    //   { headers: { Authorization: `Bearer ${token}` } }
    // )
    // return response.data.data
    
    return user
  } catch (error) {
    console.error("Error getting user profile:", error)
    return null
  }
}

// Update user profile (Laravel)
export const updateUserProfileData = async (name: string, email?: string): Promise<void> => {
  try {
    const token = localStorage.getItem("auth_token")
    if (!token) throw new Error("User not authenticated")

    const response = await axios.put(
      `${API_BASE_URL}/user/profile`,
      { name, email },
      { headers: { Authorization: `Bearer ${token}` } }
    )

    // Update localStorage with new user info
    const userInfo = JSON.parse(localStorage.getItem("user_info") || "{}")
    localStorage.setItem("user_info", JSON.stringify({ ...userInfo, name, email: email || userInfo.email }))
  } catch (error: any) {
    const message = error.response?.data?.message || "Update profile failed"
    throw new Error(message)
  }
}

// Update user password (Laravel)
export const updateUserPassword = async (currentPassword: string, newPassword: string): Promise<void> => {
  try {
    const token = localStorage.getItem("auth_token")
    if (!token) throw new Error("User not authenticated")

    await axios.put(
      `${API_BASE_URL}/user/password`,
      { current_password: currentPassword, new_password: newPassword },
      { headers: { Authorization: `Bearer ${token}` } }
    )
  } catch (error: any) {
    const message = error.response?.data?.message || "Update password failed"
    throw new Error(message)
  }
}

// Delete user account (Laravel)
export const deleteUserAccount = async (): Promise<void> => {
  try {
    const token = localStorage.getItem("auth_token")
    if (!token) throw new Error("User not authenticated")

    await axios.delete(`${API_BASE_URL}/user`, {
      headers: { Authorization: `Bearer ${token}` }
    })

    localStorage.removeItem("auth_token")
    localStorage.removeItem("user_info")
  } catch (error: any) {
    const message = error.response?.data?.message || "Delete account failed"
    throw new Error(message)
  }
}

// Get current user from localStorage
export const getCurrentUser = (): UserProfile | null => {
  try {
    const userInfo = localStorage.getItem("user_info")
    return userInfo ? JSON.parse(userInfo) : null
  } catch (error) {
    return null
  }
}

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem("auth_token")
}
