"use client"

import { useEffect, useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import {
  getUserProfile,
  signOutUser,
  updateUserProfileData,
  updateUserPassword,
  deleteUserAccount,
  isAuthenticated,
  type UserProfile,
} from "@/lib/FetchingAuth"
import LoadingSpinner from "@/components/LoadingSpinner"

const ProfilePage = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Form states
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  // UI states
  const [editStatus, setEditStatus] = useState<{ message: string; type: "success" | "error" } | null>(null)
  const [passwordStatus, setPasswordStatus] = useState<{ message: string; type: "success" | "error" } | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  useEffect(() => {
    const loadProfile = async () => {
      if (!isAuthenticated()) {
        router.push("/login")
        return
      }

      try {
        const profile = await getUserProfile()
        if (profile) {
          setUserProfile(profile)
          setName(profile.displayName || profile.name || profile.username)
          setEmail(profile.email)
        } else {
          setError("Could not find user profile.")
        }
      } catch (err) {
        setError("Failed to fetch user profile.")
        router.push("/login")
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [router])

  const handleProfileUpdate = async (e: FormEvent) => {
    e.preventDefault()
    if (!userProfile) return
    setEditStatus(null)
    if (name === userProfile.name && email === userProfile.email) {
      setEditStatus({ message: "No changes to save.", type: "error" })
      return
    }
    try {
      await updateUserProfileData(name, email)
      setEditStatus({ message: "Profile updated successfully!", type: "success" })
      setUserProfile((prev) => (prev ? { ...prev, name, email } : null))
    } catch (err: any) {
      setEditStatus({ message: err.message, type: "error" })
    }
  }

  const handlePasswordUpdate = async (e: FormEvent) => {
    e.preventDefault()
    setPasswordStatus(null)
    if (!currentPassword) {
      setPasswordStatus({ message: "Current password is required.", type: "error" })
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordStatus({ message: "Passwords do not match.", type: "error" })
      return
    }
    if (newPassword.length < 6) {
      setPasswordStatus({ message: "Password should be at least 6 characters.", type: "error" })
      return
    }
    try {
      await updateUserPassword(currentPassword, newPassword)
      setPasswordStatus({ message: "Password updated successfully!", type: "success" })
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (err: any) {
      setPasswordStatus({ message: err.message, type: "error" })
    }
  }

  const handleDeleteAccount = async () => {
    setDeleteError(null)
    if (window.confirm("Are you sure you want to delete your account? This action is irreversible.")) {
      try {
        await deleteUserAccount()
        router.push("/login?message=Account deleted successfully.")
      } catch (err: any) {
        setDeleteError(err.message)
      }
    }
  }

  const handleSignOut = async () => {
    await signOutUser()
    router.push("/login")
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString()
  }

  const formatDateTime = (date: string) => {
    return new Date(date).toLocaleString()
  }

  if (loading) {
    return <LoadingSpinner />
  }
  if (error) {
    return <div className="flex h-screen items-center justify-center text-red-500">Error: {error}</div>
  }
  if (!userProfile) {
    return null
  }

  return (
    <div className="container mx-auto max-w-4xl space-y-8 p-4">
      {/* Profile Info */}
      <div className="rounded-lg bg-white p-6 shadow-md">
        <h1 className="mb-4 text-2xl font-bold">User Profile</h1>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <p><strong>Name:</strong> {userProfile.displayName || userProfile.name || userProfile.username}</p>
          <p><strong>Username:</strong> {userProfile.username}</p>
          <p><strong>Email:</strong> {userProfile.email}</p>
          <p><strong>Role:</strong> <span className="rounded-full bg-blue-100 px-2 py-1 text-sm text-blue-800">{userProfile.role}</span></p>
          <p><strong>Member since:</strong> {formatDate(userProfile.created_at)}</p>
          <p><strong>Last updated:</strong> {formatDateTime(userProfile.updated_at)}</p>
        </div>
      </div>

      {/* GRID CONTAINER: Edit Profile & Change Password Bersebelahan */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Edit Profile */}
        <div className="rounded-lg bg-white p-6 shadow-md h-full">
          <h2 className="mb-4 text-xl font-bold">Edit Profile</h2>
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
              <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" />
            </div>
            {editStatus && <p className={`text-sm ${editStatus.type === "success" ? "text-green-600" : "text-red-600"}`}>{editStatus.message}</p>}
            <button type="submit" className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition-colors">Save Changes</button>
          </form>
        </div>

        {/* Change Password */}
        <div className="rounded-lg bg-white p-6 shadow-md h-full">
          <h2 className="mb-4 text-xl font-bold">Change Password</h2>
          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            <div>
              <label htmlFor="currentPassword">Current Password</label>
              <input type="password" id="currentPassword" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" />
            </div>
            <div>
              <label htmlFor="newPassword">New Password</label>
              <input type="password" id="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" />
            </div>
            <div>
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" />
            </div>
            {passwordStatus && <p className={`text-sm ${passwordStatus.type === "success" ? "text-green-600" : "text-red-600"}`}>{passwordStatus.message}</p>}
            <button type="submit" className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition-colors">Update Password</button>
          </form>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rounded-lg border-2 border-dashed border-red-500 bg-white p-6 shadow-md">
        <h2 className="mb-4 text-xl font-bold text-red-600">Danger Zone</h2>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="font-semibold">Delete this account</p>
            <p className="text-sm text-gray-600">Once you delete your account, there is no going back.</p>
          </div>
          <button onClick={handleDeleteAccount} className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700 transition-colors">Delete Account</button>
        </div>
        {deleteError && <p className="mt-2 text-sm text-red-600">{deleteError}</p>}
      </div>

      <button onClick={handleSignOut} className="w-full rounded-md bg-gray-500 px-4 py-2 text-white hover:bg-gray-600 transition-colors">Sign Out</button>
    </div>
  )
}

export default ProfilePage