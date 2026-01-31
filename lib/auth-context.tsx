"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { Role, User } from "./types"
import { mockUsers } from "./mock-data"

interface AuthContextType {
  currentRole: Role
  currentUser: User | null
  isAuthenticated: boolean
  isLoading: boolean // Add loading state
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  setRole: (role: Role) => void
  selectedCenterId: string | null
  setSelectedCenterId: (centerId: string | null) => void
  selectedClassId: string | null
  setSelectedClassId: (classId: string | null) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true) // Start as loading
  const [currentRole, setCurrentRole] = useState<Role>("TA")
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [selectedCenterId, setSelectedCenterId] = useState<string | null>(null)
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null)

  // Load authentication state from localStorage on mount
  useEffect(() => {
    const authToken = localStorage.getItem("dcf_auth_token")
    const savedUserId = localStorage.getItem("dcf_user_id")
    const savedCenterId = localStorage.getItem("dcf_center_id")
    const savedClassId = localStorage.getItem("dcf_class_id")

    if (authToken && savedUserId) {
      const user = mockUsers.find((u) => u.id === savedUserId)
      if (user) {
        setCurrentUser(user)
        setCurrentRole(user.role)
        setIsAuthenticated(true)
      }
    }

    if (savedCenterId) {
      setSelectedCenterId(savedCenterId)
    }
    if (savedClassId) {
      setSelectedClassId(savedClassId)
    }

    // Mark loading as complete
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // For demo: password is "demo123" for all users
    if (password !== "demo123") {
      return false
    }

    const user = mockUsers.find((u) => u.email === email)
    if (user) {
      setCurrentUser(user)
      setCurrentRole(user.role)
      setIsAuthenticated(true)
      localStorage.setItem("dcf_auth_token", "demo_token_" + Date.now())
      localStorage.setItem("dcf_user_id", user.id)
      return true
    }

    return false
  }

  const logout = () => {
    setIsAuthenticated(false)
    setCurrentUser(null)
    setCurrentRole("TA")
    setSelectedCenterId(null)
    setSelectedClassId(null)
    localStorage.removeItem("dcf_auth_token")
    localStorage.removeItem("dcf_user_id")
    localStorage.removeItem("dcf_center_id")
    localStorage.removeItem("dcf_class_id")
    localStorage.removeItem("dcf_role")
  }

  const setRole = (role: Role) => {
    setCurrentRole(role)
    localStorage.setItem("dcf_role", role)
  }

  const handleSetSelectedCenterId = (centerId: string | null) => {
    setSelectedCenterId(centerId)
    if (centerId) {
      localStorage.setItem("dcf_center_id", centerId)
    } else {
      localStorage.removeItem("dcf_center_id")
    }
  }

  const handleSetSelectedClassId = (classId: string | null) => {
    setSelectedClassId(classId)
    if (classId) {
      localStorage.setItem("dcf_class_id", classId)
    } else {
      localStorage.removeItem("dcf_class_id")
    }
  }

  return (
    <AuthContext.Provider
      value={{
        currentRole,
        currentUser,
        isAuthenticated,
        isLoading, // Add to provider value
        login,
        logout,
        setRole,
        selectedCenterId,
        setSelectedCenterId: handleSetSelectedCenterId,
        selectedClassId,
        setSelectedClassId: handleSetSelectedClassId,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
