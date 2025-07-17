"use client"

import { MiniKit } from "@worldcoin/minikit-js"
import { useState, useEffect, useCallback } from "react"

interface MiniKitHookType {
  isConnected: boolean
  address: `0x${string}` | undefined
  connect: () => Promise<void>
  disconnect: () => Promise<void>
}

export function useMiniKit(): MiniKitHookType {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState<`0x${string}` | undefined>(undefined)

  const updateConnectionStatus = useCallback(async () => {
    if (typeof window === "undefined" || !MiniKit.isInstalled()) {
      setIsConnected(false)
      setAddress(undefined)
      return
    }
    try {
      const session = await MiniKit.getSession()
      if (session && session.address) {
        setIsConnected(true)
        setAddress(session.address as `0x${string}`)
      } else {
        setIsConnected(false)
        setAddress(undefined)
      }
    } catch (error) {
      console.error("Error getting MiniKit session:", error)
      setIsConnected(false)
      setAddress(undefined)
    }
  }, [])

  useEffect(() => {
    // Initial check and setup listener
    updateConnectionStatus()

    if (typeof window !== "undefined" && MiniKit.isInstalled()) {
      // Listen for session changes
      const handleSessionChange = (session: any) => {
        if (session && session.address) {
          setIsConnected(true)
          setAddress(session.address as `0x${string}`)
        } else {
          setIsConnected(false)
          setAddress(undefined)
        }
      }
      MiniKit.on("session_changed", handleSessionChange)

      // Note: MiniKit.js does not provide an explicit 'off' method for listeners.
      // The listener will persist for the lifetime of the MiniKit instance.
      // If this causes issues in a complex app, consider a more robust state management.
    }
  }, [updateConnectionStatus])

  const connect = useCallback(async () => {
    if (typeof window === "undefined" || !MiniKit.isInstalled()) {
      console.warn("MiniKit not installed or not in browser environment.")
      // Optionally, throw an error or return a rejected promise here
      return
    }
    try {
      const session = await MiniKit.connect()
      if (session && session.address) {
        setIsConnected(true)
        setAddress(session.address as `0x${string}`)
      }
    } catch (error) {
      console.error("Failed to connect MiniKit:", error)
      setIsConnected(false)
      setAddress(undefined)
      throw error // Re-throw to allow calling component to handle
    }
  }, [])

  const disconnect = useCallback(async () => {
    if (typeof window === "undefined" || !MiniKit.isInstalled()) {
      console.warn("MiniKit not installed or not in browser environment.")
      return
    }
    try {
      await MiniKit.disconnect()
      setIsConnected(false)
      setAddress(undefined)
    } catch (error) {
      console.error("Failed to disconnect MiniKit:", error)
    }
  }, [])

  return { isConnected, address, connect, disconnect }
}
