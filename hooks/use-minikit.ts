"use client"

import { useState, useEffect } from "react"

interface User {
  walletAddress: string | null
}

interface UseMiniKitResult {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}

export function useMiniKit(): UseMiniKitResult {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSession = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/auth/session")
        if (response.ok) {
          const data = await response.json()
          if (data.address) {
            setUser({ walletAddress: data.address })
            setIsAuthenticated(true)
          } else {
            setUser(null)
            setIsAuthenticated(false)
          }
        } else {
          // If session API returns an error or not ok, assume not authenticated
          setUser(null)
          setIsAuthenticated(false)
          console.warn("Failed to fetch session:", response.status, await response.text())
        }
      } catch (err) {
        console.error("Error fetching session:", err)
        setError("Failed to load session data.")
        setUser(null)
        setIsAuthenticated(false)
      } finally {
        setLoading(false)
      }
    }

    fetchSession()
  }, [])

  return { user, isAuthenticated, loading, error }
}
