"use client"

import { MiniKit } from "@worldcoin/minikit-js"
import { type ReactNode, useEffect } from "react"

interface MiniKitProviderProps {
  children: ReactNode
  addDebugLog: (message: string) => void // Adicionar prop para logging
}

export function MiniKitProvider({ children, addDebugLog }: MiniKitProviderProps) {
  useEffect(() => {
    addDebugLog("MiniKitProvider useEffect triggered.")
    // Verificar se estamos no lado do cliente
    if (typeof window === "undefined") {
      addDebugLog("MiniKitProvider: Not in browser environment. Skipping MiniKit install.")
      return
    }

    try {
      // Configurar o MiniKit apenas se não estiver já instalado
      if (!MiniKit.isInstalled()) {
        addDebugLog("MiniKit not installed. Attempting to install...")
        MiniKit.install({
          appId: process.env.NEXT_PUBLIC_APP_ID || "app_a3a55e132983350c67923dd57dc22c5e",
          enableTelemetry: true,
        })
        addDebugLog("MiniKit installed successfully.")
      } else {
        addDebugLog("MiniKit already installed.")
      }
    } catch (error: any) {
      addDebugLog(`Error installing MiniKit: ${error.message}`)
      console.error("Error installing MiniKit:", error) // Manter console.error para visibilidade no terminal
    }
  }, [addDebugLog]) // Adicionar addDebugLog como dependência

  return <>{children}</>
}
