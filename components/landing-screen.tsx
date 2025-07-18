"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Wallet } from "lucide-react"
import { AnimatedBackground } from "./animated-background"
import Image from "next/image"
import { MiniKit, type WalletAuthInput } from "@worldcoin/minikit-js" // Importa MiniKit diretamente

interface LandingScreenProps {
  onLoginSuccess: (address: `0x${string}`) => void
}

export function LandingScreen({ onLoginSuccess }: LandingScreenProps) {
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleConnectWallet = async () => {
    setError(null)
    setIsConnecting(true)

    if (typeof window === "undefined" || !MiniKit.isInstalled()) {
      setError("MiniKit is not installed or not available in this environment.")
      setIsConnecting(false)
      return
    }

    try {
      // 1. Obter o nonce do backend
      const nonceRes = await fetch(`/api/auth/nonce`)
      if (!nonceRes.ok) {
        throw new Error(`Failed to fetch nonce: ${nonceRes.statusText}`)
      }
      const { nonce } = await nonceRes.json()

      // 2. Chamar walletAuth do MiniKit
      const walletAuthInput: WalletAuthInput = {
        nonce: nonce,
        requestId: "0", // Optional
        expirationTime: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        notBefore: new Date(new Date().getTime() - 24 * 60 * 60 * 1000), // 24 hours ago
        statement: "Sign in to KeplerPay to access your account.",
      }

      const { finalPayload } = await MiniKit.commandsAsync.walletAuth(walletAuthInput)

      if (finalPayload.status === "error") {
        throw new Error(finalPayload.message || "Wallet authentication failed.")
      }

      // 3. Enviar o payload final para o backend para verificação SIWE
      const verifyRes = await fetch("/api/auth/complete-siwe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          payload: finalPayload,
          nonce,
        }),
      })

      const verifyData = await verifyRes.json()

      if (!verifyRes.ok || !verifyData.isValid) {
        throw new Error(verifyData.message || "Backend SIWE verification failed.")
      }

      // Se tudo correr bem, notificar o componente pai com o endereço da carteira
      const walletAddress = MiniKit.walletAddress || finalPayload.address
      if (walletAddress) {
        onLoginSuccess(walletAddress as `0x${string}`)
      } else {
        throw new Error("Wallet address not found after successful login.")
      }
    } catch (err: any) {
      console.error("Error connecting wallet:", err)
      setError(err.message || "Failed to connect wallet. Please try again.")
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
            disabled={isConnecting || (typeof window !== "undefined" && !MiniKit.isInstalled())}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-4 text-lg font-semibold rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isConnecting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                Connecting...
              </>
            ) : typeof window !== "undefined" && !MiniKit.isInstalled() ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                Loading Wallet...
              </>
            ) : (
              <>
                <Wallet className="mr-3 h-5 w-5" />
                Connect Wallet
              </>
            )}
          </Button>
          {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
        </div>
      </div>
    </div>
  )
}
