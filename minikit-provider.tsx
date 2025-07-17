"use client"

import { MiniKit } from "@worldcoin/minikit-js"
import { type ReactNode, useEffect, useState, createContext, useContext } from "react"

interface MiniKitContextType {
  isConnected: boolean
  address: `0x${string}` | undefined
  connect: () => Promise<void>
  disconnect: () => Promise<void>
}

const MiniKitContext = createContext<MiniKitContextType | undefined>(undefined)

export function MiniKitProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState<`0x${string}` | undefined>(undefined)

  useEffect(() => {
    if (typeof window === "undefined") return

    try {
      if (!MiniKit.isInstalled()) {
        MiniKit.install({
          appId: process.env.NEXT_PUBLIC_APP_ID || "app_a3a55e132983350c67923dd57dc22c5e",
          enableTelemetry: true,
        })
        console.log("MiniKit installed successfully")
      } else {
        console.log("MiniKit already installed")
      }

      // Check initial connection status
      const checkConnection = async () => {
        const session = await MiniKit.getSession()
        if (session && session.address) {
          setIsConnected(true)
          setAddress(session.address as `0x${string}`)
        } else {
          setIsConnected(false)
          setAddress(undefined)
        }
      }
      checkConnection()

      // Listen for session changes
      MiniKit.on("session_changed", (session) => {
        if (session && session.address) {
          setIsConnected(true)
          setAddress(session.address as `0x${string}`)
        } else {
          setIsConnected(false)
          setAddress(undefined)
        }
      })
    } catch (error) {
      console.error("Error initializing MiniKit:", error)
    }
  }, [])

  const connect = async () => {
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
  }

  const disconnect = async () => {
    try {
      await MiniKit.disconnect()
      setIsConnected(false)
      setAddress(undefined)
    } catch (error) {
      console.error("Failed to disconnect MiniKit:", error)
    }
  }

  return (
    <MiniKitContext.Provider value={{ isConnected, address, connect, disconnect }}>{children}</MiniKitContext.Provider>
  )
}

export function useMiniKit() {
  const context = useContext(MiniKitContext)
  if (context === undefined) {
    throw new Error("useMiniKit must be used within a MiniKitProvider")
  }
  return context
}
