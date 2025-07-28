"use client"

import { useState, useEffect, useRef, useCallback } from "react"

interface LogEntry {
  timestamp: string
  type: "log" | "warn" | "error" | "info"
  message: string
}

export function useDebugLogs() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const originalConsole = useRef<{
    log: typeof console.log
    warn: typeof console.warn
    error: typeof console.error
    info: typeof console.info
  } | null>(null)

  const addLog = useCallback((type: LogEntry["type"], ...args: any[]) => {
    const message = args
      .map((arg) => {
        if (typeof arg === "object" && arg !== null) {
          try {
            return JSON.stringify(arg, null, 2)
          } catch (e) {
            return String(arg) // Fallback for circular structures
          }
        }
        return String(arg)
      })
      .join(" ")

    setLogs((prevLogs) => [
      ...prevLogs,
      {
        timestamp: new Date().toLocaleTimeString(),
        type,
        message,
      },
    ])
  }, [])

  useEffect(() => {
    if (!originalConsole.current) {
      originalConsole.current = {
        log: console.log,
        warn: console.warn,
        error: console.error,
        info: console.info,
      }

      console.log = (...args: any[]) => {
        addLog("log", ...args)
        originalConsole.current?.log(...args)
      }
      console.warn = (...args: any[]) => {
        addLog("warn", ...args)
        originalConsole.current?.warn(...args)
      }
      console.error = (...args: any[]) => {
        addLog("error", ...args)
        originalConsole.current?.error(...args)
      }
      console.info = (...args: any[]) => {
        addLog("info", ...args)
        originalConsole.current?.info(...args)
      }
    }

    // Cleanup function to restore original console methods
    return () => {
      if (originalConsole.current) {
        console.log = originalConsole.current.log
        console.warn = originalConsole.current.warn
        console.error = originalConsole.current.error
        console.info = originalConsole.current.info
      }
    }
  }, [addLog])

  const clearLogs = useCallback(() => {
    setLogs([])
  }, [])

  return { logs, clearLogs }
}
