"use client"

import { useState, useEffect } from "react"
import { getUserProfile, isAuthenticated, type UserProfile } from "@/lib/FetchingAuth"

export interface AuthState {
  user: UserProfile | null
  profile: UserProfile | null
  loading: boolean
  error: string | null
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    profile: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    const checkAuth = async () => {
      console.log("useAuth - Checking authentication...")
      if (isAuthenticated()) {
        try {
          console.log("useAuth - User is authenticated, fetching profile...")
          const profile = await getUserProfile()
          console.log("useAuth - Profile loaded:", profile)
          setAuthState({
            user: profile,
            profile,
            loading: false,
            error: null,
          })
        } catch (error) {
          // Token invalid or expired, clear localStorage
          localStorage.removeItem("auth_token")
          localStorage.removeItem("user_info")
          setAuthState({
            user: null,
            profile: null,
            loading: false,
            error: "Session expired. Please login again.",
          })
        }
      } else {
        setAuthState({
          user: null,
          profile: null,
          loading: false,
          error: null,
        })
      }
    }

    checkAuth()
  }, [])

  return authState
}

export { UserProfile }

