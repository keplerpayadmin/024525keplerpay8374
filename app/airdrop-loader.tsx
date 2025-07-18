"use client"

import { useEffect, useState, useCallback } from "react"
import dynamic from "next/dynamic"
import { DebugConsole } from "@/components/debug-console"

const AirdropClient = dynamic(() => import("./airdrop-client"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-white">Loading airdrop...</div>
    </div>
  ),
})

export default function AirdropLoader() {
  const [mounted, setMounted] = useState(false)
  const [debugLogs, setDebugLogs] = useState<string[]>([])

  const addDebugLog = useCallback((message: string) => {
    setDebugLogs((prevLogs) => {
      const newLogs = [...prevLogs, `${new Date().toLocaleTimeString()}: ${message}`]
      return newLogs.slice(-50)
    })
  }, [])

  const clearDebugLogs = useCallback(() => {
    setDebugLogs([])
  }, [])

  useEffect(() => {
    setMounted(true)
    addDebugLog("AirdropLoader mounted.")
  }, [addDebugLog])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
        <DebugConsole logs={debugLogs} onClear={clearDebugLogs} />
      </div>
    )
  }

  return (
    <div>
      <AirdropClient addDebugLog={addDebugLog} />
      <DebugConsole logs={debugLogs} onClear={clearDebugLogs} />
    </div>
  )
}
