"use client"

import { useState, useEffect, useCallback } from "react"
import { MiniKit, type WalletAuthInput } from "@worldcoin/minikit-js"
import { useRouter } from "next/navigation"

interface User {
  walletAddress: string
  // Add other user properties if available from your session API
}

interface MiniKitHook {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
  error: string | null
}

// App ID para a integração com o MiniKit (usar o mesmo do connect-button.tsx)
const APP_ID = process.env.NEXT_PUBLIC_APP_ID || "app_4f5732a19eafedb1915f9a24198c5224" // Certifique-se de que esta variável de ambiente está definida

export function useMiniKit(): MiniKitHook {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const checkSession = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/auth/session")
      if (response.ok) {
        const data = await response.json()
        if (data.user && data.user.walletAddress) {
          setUser(data.user)
          setIsAuthenticated(true)
        } else {
          setUser(null)
          setIsAuthenticated(false)
        }
      } else {
        setUser(null)
        setIsAuthenticated(false)
      }
    } catch (err) {
      console.error("Error checking session:", err)
      setError("Failed to check session.")
      setUser(null)
      setIsAuthenticated(false)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    checkSession()
  }, [checkSession])

  const connectWallet = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      console.log("Starting wallet connection process...")

      if (typeof window !== "undefined" && !MiniKit.isInstalled()) {
        console.error("MiniKit is not installed")
        setError("Please install the Worldcoin App to connect your wallet.")
        setIsLoading(false)
        return
      }

      // Simulação de conexão para desenvolvimento/teste
      if (process.env.NODE_ENV === "development" || !MiniKit.isInstalled()) {
        console.log("Development mode or MiniKit not available - using mock wallet")
        const mockWalletAddress = "0x742d35Cc6634C0532925a3b844Bc454e4438f44e"
        setUser({ walletAddress: mockWalletAddress })
        setIsAuthenticated(true)
        setIsLoading(false)
        return
      }

      let nonce = ""
      try {
        console.log("Fetching nonce from API...")
        const res = await fetch(`/api/nonce`)
        const data = await res.json()
        nonce = data.nonce
        console.log("Got nonce:", nonce)
      } catch (fetchNonceError) {
        console.error("Error fetching nonce:", fetchNonceError)
        nonce = Math.random().toString(36).substring(2, 15) // Fallback nonce
        console.log("Using fallback nonce:", nonce)
      }

      const walletAuthInput: WalletAuthInput = {
        nonce,
        requestId: crypto.randomUUID(),
        expirationTime: new Date(Date.now() + 10 * 60 * 1000),
        notBefore: new Date(Date.now() - 60 * 1000),
        statement: "Connect your wallet to KeplerPay to access the token ecosystem on Worldchain.",
      }

      console.log("Wallet auth input:", walletAuthInput)

      const response = await MiniKit.commandsAsync.walletAuth(walletAuthInput)
      console.log("WalletAuth full response:", response)

      if (!response || !response.finalPayload) {
        throw new Error("No response received from wallet auth")
      }

      const { finalPayload } = response

      if (finalPayload.status === "error") {
        console.error("WalletAuth error:", finalPayload)
        throw new Error(finalPayload.errorMessage || "Wallet authentication failed")
      }

      if (finalPayload.status !== "success") {
        console.log("Auth status:", finalPayload.status)
        throw new Error("Authentication was cancelled or failed")
      }

      const walletAddress = finalPayload.address
      console.log("Wallet address from auth payload:", walletAddress)

      if (!walletAddress) {
        throw new Error("No wallet address received")
      }

      // Call API for login (optional, can fail)
      try {
        console.log("Verifying with server...")
        const loginResponse = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            payload: finalPayload,
            nonce,
            app_id: APP_ID,
          }),
        })

        if (loginResponse.status === 200) {
          const userData = await loginResponse.json()
          console.log("Login response:", userData)
        } else {
          console.warn("Server verification failed, but continuing with local auth")
        }
      } catch (loginError) {
        console.warn("Login API error (continuing anyway):", loginError)
      }

      setUser({ walletAddress })
      setIsAuthenticated(true)
      console.log("Connection completed successfully!")
    } catch (err) {
      console.error("Connection error:", err)
      setError(err instanceof Error ? err.message : "Unknown error occurred during connection.")
    } finally {
      setIsLoading(false)
    }
  }, [])

  const disconnectWallet = useCallback(() => {
    setUser(null)
    setIsAuthenticated(false)
    // Optionally clear session on server if you have a logout API
    fetch("/api/auth/logout", { method: "POST" }).catch(console.error)
    router.push("/") // Redirect to home or login page
  }, [router])

  return { user, isAuthenticated, isLoading, connectWallet, disconnectWallet, error }
}
