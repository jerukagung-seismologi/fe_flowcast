import axios from "axios"
import { API_BASE_URL } from "@/lib/ApiConfig"

export interface UserProfile {
  id: number
  username: string
  email: string
  displayName?: string
  name?: string // Jaga-jaga jika backend kirim 'name'
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

// --- AUTHENTICATION ---

export const signUpWithEmail = async (
  email: string,
  password: string,
  displayName: string,
  username: string,
): Promise<{ token: string; user: UserProfile }> => {
  try {
    const response = await axios.post<LoginResponse>(`${API_BASE_URL}/register`, {
      username,
      email,
      password,
      displayName,
    })

    const { access_token, user } = response.data.data
    localStorage.setItem("auth_token", access_token)
    localStorage.setItem("user_info", JSON.stringify(user))

    return { token: access_token, user }
  } catch (error: any) {
    const message = error.response?.data?.message || "Registration failed"
    throw new Error(message)
  }
}

export const signInWithEmail = async (
  username: string,
  password: string,
): Promise<{ token: string; user: UserProfile }> => {
  try {
    const response = await axios.post<LoginResponse>(`${API_BASE_URL}/login`, {
      username,
      password,
    })

    const { access_token, user } = response.data.data
    localStorage.setItem("auth_token", access_token)
    localStorage.setItem("user_info", JSON.stringify(user))

    return { token: access_token, user }
  } catch (error: any) {
    if (error.code === "ERR_NETWORK") {
      throw new Error("Tidak dapat terhubung ke server Laravel.")
    }
    const message = error.response?.data?.message || error.message || "Login gagal"
    throw new Error(message)
  }
}

export const signOutUser = async (): Promise<void> => {
  try {
    const token = localStorage.getItem("auth_token")
    if (token) {
      await axios.post(`${API_BASE_URL}/logout`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
    }
  } catch (error) {
    console.error("Logout error", error)
  } finally {
    localStorage.removeItem("auth_token")
    localStorage.removeItem("user_info")
  }
}

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem("auth_token")
}

// --- USER PROFILE MANAGEMENT ---

// 1. Get Profile
export const getUserProfile = async (): Promise<UserProfile | null> => {
  try {
    const token = localStorage.getItem("auth_token")
    // Prioritaskan ambil dari API untuk data terbaru
    if (token) {
       try {
         const response = await axios.get(`${API_BASE_URL}/user`, {
           headers: { Authorization: `Bearer ${token}` }
         });
         // Update local storage dengan data terbaru
         localStorage.setItem("user_info", JSON.stringify(response.data));
         return response.data as UserProfile;
       } catch (e) {
         // Fallback ke local storage jika API gagal/offline
         console.warn("Failed to fetch fresh profile, using local data");
       }
    }

    const userInfo = localStorage.getItem("user_info")
    if (!userInfo) return null
    return JSON.parse(userInfo) as UserProfile
  } catch (error) {
    return null
  }
}

// 2. Update Profile Data (DisplayName & Email)
export const updateUserProfileData = async (displayName: string, email: string): Promise<void> => {
  const token = localStorage.getItem("auth_token")
  if (!token) throw new Error("Unauthorized")

  try {
    const response = await axios.put(
      `${API_BASE_URL}/user/profile`, 
      { displayName, email },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    
    // Update data di local storage agar UI langsung berubah
    const currentUser = JSON.parse(localStorage.getItem("user_info") || "{}")
    const updatedUser = { ...currentUser, displayName, email }
    localStorage.setItem("user_info", JSON.stringify(updatedUser))
    
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to update profile")
  }
}

// 3. Update Password
export const updateUserPassword = async (currentPassword: string, newPassword: string): Promise<void> => {
  const token = localStorage.getItem("auth_token")
  if (!token) throw new Error("Unauthorized")

  try {
    await axios.put(
      `${API_BASE_URL}/user/password`,
      { current_password: currentPassword, new_password: newPassword },
      { headers: { Authorization: `Bearer ${token}` } }
    )
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to update password")
  }
}

// 4. Delete Account
export const deleteUserAccount = async (): Promise<void> => {
  const token = localStorage.getItem("auth_token")
  if (!token) throw new Error("Unauthorized")

  try {
    await axios.delete(`${API_BASE_URL}/user/account`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    // Bersihkan sesi setelah hapus akun
    localStorage.removeItem("auth_token")
    localStorage.removeItem("user_info")
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to delete account")
  }
}