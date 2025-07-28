"use client"

import { useState, useEffect, useCallback } from "react"

interface UserSession {
  walletAddress: string
  // Adicione outras propriedades do usuário conforme necessário
}

interface UseMiniKitResult {
  user: UserSession | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  refreshSession: () => Promise<void>
}

export function useMiniKit(): UseMiniKitResult {
  const [user, setUser] = useState<UserSession | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSession = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/auth/session")
      const data = await response.json()

      if (data.authenticated && data.user) {
        setUser(data.user)
        setIsAuthenticated(true)
      } else {
        setUser(null)
        setIsAuthenticated(false)
      }
    } catch (err) {
      console.error("Failed to fetch session:", err)
      setError("Failed to load session.")
      setUser(null)
      setIsAuthenticated(false)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSession()
  }, [fetchSession])

  return { user, isAuthenticated, isLoading, error, refreshSession: fetchSession }
}
