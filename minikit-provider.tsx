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
    } catch (error) {
      console.error("Error installing MiniKit:", error)
    }
  }, [])

  // SIMULATED connect function to bypass "MiniKit.connect is not a function"
  const connect = async () => {
    console.log("Simulating MiniKit connection...")
    await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate async operation
    setIsConnected(true)
    setAddress("0xSimulatedWalletAddress123456789012345678901234567890" as `0x${string}`) // Placeholder address
    console.log("Simulated MiniKit connected.")
  }

  // SIMULATED disconnect function to bypass "MiniKit.disconnect is not a function"
  const disconnect = async () => {
    console.log("Simulating MiniKit disconnection...")
    await new Promise((resolve) => setTimeout(resolve, 300)) // Simulate async operation
    setIsConnected(false)
    setAddress(undefined)
    console.log("Simulated MiniKit disconnected.")
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
