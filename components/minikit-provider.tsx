"use client"

import { MiniKit } from "@worldcoin/minikit-js"
import { type ReactNode, useEffect } from "react"

export function MiniKitProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Verificar se estamos no lado do cliente
    if (typeof window === "undefined") return

    try {
      // Configurar o MiniKit apenas se não estiver já instalado
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

  return <>{children}</>
}
