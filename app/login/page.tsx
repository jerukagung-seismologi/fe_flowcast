"use client"

import type React from "react"
import Image from "next/image"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, CheckCircle, XCircle, User, Mail, Lock, Loader2, AtSign } from "lucide-react"
import { signInWithEmail, signUpWithEmail } from "@/lib/FetchingAuth"

interface FormData {
  name: string
  username: string // Tambahan field Username
  email: string
  password: string
  confirmPassword: string
}

interface FormErrors {
  name?: string
  username?: string
  email?: string
  password?: string
  confirmPassword?: string
  general?: string
}

interface PasswordStrength {
  score: number
  feedback: string[]
  color: string
}

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const [formData, setFormData] = useState<FormData>({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  // Email validation
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Password strength validation
  const getPasswordStrength = (password: string): PasswordStrength => {
    let score = 0
    const feedback: string[] = []

    if (password.length >= 8) score += 1
    else feedback.push("Minimal 8 karakter")

    if (/[a-z]/.test(password)) score += 1
    else feedback.push("Satu huruf kecil")

    if (/[A-Z]/.test(password)) score += 1
    else feedback.push("Satu huruf kapital")

    if (/\d/.test(password)) score += 1
    else feedback.push("Satu angka")

    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1
    else feedback.push("Satu karakter spesial")

    let color = "text-red-500"
    if (score >= 4) color = "text-green-500"
    else if (score >= 3) color = "text-yellow-500"
    else if (score >= 2) color = "text-orange-500"

    return { score, feedback, color }
  }

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Name validation
    if (isSignUp && !formData.name.trim()) {
      newErrors.name = "Nama lengkap wajib diisi"
    }

    // Username validation
    if (isSignUp && !formData.username.trim()) {
      newErrors.username = "Username wajib diisi"
    }

    // Email/Username validation
    if (!formData.email.trim()) {
      newErrors.email = isSignUp ? "Email wajib diisi" : "Username atau email wajib diisi"
    } else if (isSignUp && !validateEmail(formData.email)) {
      newErrors.email = "Format email tidak valid"
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Kata sandi wajib diisi"
    } else if (isSignUp) {
      const strength = getPasswordStrength(formData.password)
      if (strength.score < 3) {
        newErrors.password = "Kata sandi terlalu lemah"
      }
    }

    // Confirm password validation
    if (isSignUp) {
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Konfirmasi kata sandi wajib diisi"
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Kata sandi tidak cocok"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const handleInputBlur = (field: keyof FormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
  }

  // Handle Submit (Login & Register)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)
    setErrors({})

    try {
      if (isSignUp) {
        // --- LOGIKA REGISTER ---
        const { user } = await signUpWithEmail(
          formData.email,
          formData.password,
          formData.name,
          formData.username
        )
        console.log("Register berhasil:", user)
        router.push("/dashboard") // Auto login setelah register
      } else {
        // --- LOGIKA LOGIN ---
        const { user } = await signInWithEmail(formData.email, formData.password)
        console.log("Login berhasil:", user)
        router.push("/dashboard")
      }
    } catch (error: any) {
      console.error("Auth Error:", error)
      const message = error.message || "Terjadi kesalahan pada server"
      setErrors({ general: message })
    } finally {
      setLoading(false)
    }
  }

  const toggleMode = () => {
    setIsSignUp(!isSignUp)
    setFormData({ name: "", username: "", email: "", password: "", confirmPassword: "" })
    setErrors({})
    setTouched({})
  }

  const passwordStrength = getPasswordStrength(formData.password)

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center items-center mb-4">
            <Image src="/web-app-manifest-512x512.png" alt="logo" width={80} height={80} className="rounded-full" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Flow Cast</CardTitle>
          <CardDescription className="text-gray-600">
            {isSignUp
              ? "Buat akun untuk memantau kondisi hidrometeorologi."
              : "Masuk ke akun Anda untuk mengakses dashboard."}
          </CardDescription>
        </CardHeader>

        {/* Toggle Buttons */}
        <div className="px-6 pb-4">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              type="button"
              onClick={() => !isSignUp && toggleMode()}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                !isSignUp ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Daftar
            </button>
            <button
              type="button"
              onClick={() => isSignUp && toggleMode()}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                isSignUp ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Masuk
            </button>
          </div>
        </div>

        <CardContent className="pt-0">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* General Error */}
            {errors.general && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>{errors.general}</AlertDescription>
              </Alert>
            )}

            {/* Field Nama Lengkap (Register Only) */}
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="name">Nama Lengkap</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="name"
                    placeholder="Nama Lengkap"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className={`pl-10 ${errors.name ? "border-red-500" : ""}`}
                  />
                </div>
                {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
              </div>
            )}

            {/* Field Username (Register Only) */}
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <AtSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="username"
                    placeholder="Username (tanpa spasi)"
                    value={formData.username}
                    onChange={(e) => handleInputChange("username", e.target.value)}
                    className={`pl-10 ${errors.username ? "border-red-500" : ""}`}
                  />
                </div>
                {errors.username && <p className="text-xs text-red-500">{errors.username}</p>}
              </div>
            )}

            {/* Field Email (Login & Register) */}
            <div className="space-y-2">
              <Label htmlFor="email">{isSignUp ? "Email" : "Email / Username"}</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type={isSignUp ? "email" : "text"}
                  placeholder={isSignUp ? "email@contoh.com" : "Email atau Username"}
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
                />
              </div>
              {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
            </div>

            {/* Field Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Kata Sandi</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="******"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className={`pl-10 pr-10 ${errors.password ? "border-red-500" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              
              {/* Strength Meter (Register Only) */}
              {isSignUp && formData.password && (
                <div className="flex items-center space-x-2 mt-1">
                  <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        passwordStrength.score >= 4 ? "bg-green-500" :
                        passwordStrength.score >= 3 ? "bg-yellow-500" : "bg-red-500"
                      }`}
                      style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                    />
                  </div>
                  <span className={`text-[10px] ${passwordStrength.color}`}>
                    {passwordStrength.score >= 4 ? "Kuat" : passwordStrength.score >= 3 ? "Baik" : "Lemah"}
                  </span>
                </div>
              )}
              
              {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
            </div>

            {/* Field Confirm Password (Register Only) */}
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Konfirmasi Kata Sandi</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="******"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    className={`pl-10 pr-10 ${errors.confirmPassword ? "border-red-500" : ""}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-gray-400"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword}</p>}
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center">
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                  Memproses...
                </div>
              ) : isSignUp ? "Buat Akun" : "Masuk"}
            </Button>
          </form>

          {/* Footer Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {isSignUp ? "Sudah punya akun? " : "Belum punya akun? "}
              <button
                type="button"
                onClick={toggleMode}
                className="text-blue-600 font-medium hover:underline"
              >
                {isSignUp ? "Masuk di sini" : "Daftar di sini"}
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}