"use client"

import { useEffect, useState } from "react"
import { SessionUser } from "@/lib/auth"

export function useAuth() {
  const [user, setUser] = useState<SessionUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/me")
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      }
    } catch (error) {
      console.error("Auth check failed:", error)
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    await fetch("/api/auth/me", { method: "DELETE" })
    setUser(null)
    window.location.href = "/login"
  }

  return { user, loading, logout, checkAuth }
}
