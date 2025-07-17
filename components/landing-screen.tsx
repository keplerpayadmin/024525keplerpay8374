"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Wallet } from "lucide-react"
import { AnimatedBackground } from "./animated-background"
import Image from "next/image"
import { useMiniKit } from "@/hooks/use-minikit" // Import from new hook file

interface LandingScreenProps {
  onConnect: () => void
}

export function LandingScreen({ onConnect }: LandingScreenProps) {
  const { connect, isConnected } = useMiniKit()
  const [isConnecting, setIsConnecting] = useState(false)

  const handleConnectWallet = async () => {
    setIsConnecting(true)
    try {
      await connect() // This will trigger the MiniKit connection flow
      // The isConnected state in useMiniKit will update automatically via the session_changed listener
      onConnect() // Signal to parent that connection attempt was made (optional)
    } catch (error) {
      console.error("Error connecting wallet:", error)
      // Handle connection error, e.g., show a toast
    } finally {
      setIsConnecting(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <AnimatedBackground />

      {/* Content overlay */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        {/* Logo */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex justify-center mb-8">
            <Image
              src="/images/keplerpay-logo-light.png"
              alt="KeplerPay Logo"
              width={200}
              height={200}
              className="drop-shadow-2xl"
            />
          </div>
        </div>

        {/* Connect Button */}
        <div className="text-center">
          <Button
            onClick={handleConnectWallet}
            disabled={isConnecting}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-4 text-lg font-semibold rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isConnecting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                Connecting...
              </>
            ) : (
              <>
                <Wallet className="mr-3 h-5 w-5" />
                Connect Wallet
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
