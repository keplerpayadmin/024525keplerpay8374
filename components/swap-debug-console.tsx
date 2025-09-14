"use client"

import { useEffect, useState, useMemo } from "react"
import { Bug, Copy, Trash2, X, ChevronDown, ChevronRight } from "lucide-react"
import { swapLogger, type SwapLog } from "@/services/swap-debug-logger"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function SwapDebugConsole() {
  const [open, setOpen] = useState(false)
  const [logs, setLogs] = useState<SwapLog[]>([])
  const [expandedLogs, setExpandedLogs] = useState<Set<string>>(new Set())
  const [filterLevel, setFilterLevel] = useState<"all" | "info" | "warn" | "error">("all")

  useEffect(() => {
    const unsub = swapLogger.subscribe(setLogs)
    return () => unsub()
  }, [])

  const copyAll = async () => {
    const text = JSON.stringify(logs, null, 2)
    try {
      await navigator.clipboard.writeText(text)
    } catch (e) {
      console.error("Failed to copy logs", e)
    }
  }

  const copyLog = async (log: SwapLog) => {
    const text = JSON.stringify(log, null, 2)
    try {
      await navigator.clipboard.writeText(text)
    } catch (e) {
      console.error("Failed to copy log", e)
    }
  }

  const toggleLogExpansion = (logId: string) => {
    setExpandedLogs((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(logId)) {
        newSet.delete(logId)
      } else {
        newSet.add(logId)
      }
      return newSet
    })
  }

  const filteredLogs = useMemo(() => {
    let filtered = logs.slice().reverse() // mais recentes em cima
    if (filterLevel !== "all") {
      filtered = filtered.filter((log) => log.level === filterLevel)
    }
    return filtered
  }, [logs, filterLevel])

  const formatJsonData = (data: unknown) => {
    if (!data) return null
    try {
      return JSON.stringify(data, null, 2)
    } catch {
      return String(data)
    }
  }

  const getLogIcon = (level: string) => {
    switch (level) {
      case "error":
        return "🔴"
      case "warn":
        return "🟡"
      case "info":
        return "🔵"
      default:
        return "⚪"
    }
  }

  const getLogBgColor = (level: string) => {
    switch (level) {
      case "error":
        return "bg-red-50 border-red-200"
      case "warn":
        return "bg-yellow-50 border-yellow-200"
      case "info":
        return "bg-blue-50 border-blue-200"
      default:
        return "bg-gray-50 border-gray-200"
    }
  }

  const getLogTextColor = (level: string) => {
    switch (level) {
      case "error":
        return "text-red-800"
      case "warn":
        return "text-yellow-800"
      case "info":
        return "text-blue-800"
      default:
        return "text-gray-800"
    }
  }

  const logCounts = useMemo(() => {
    return logs.reduce(
      (acc, log) => {
        acc[log.level] = (acc[log.level] || 0) + 1
        acc.total = (acc.total || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )
  }, [logs])

  return (
    <>
      {/* Floating toggle with badge */}
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "fixed bottom-20 right-4 z-50 rounded-full shadow-lg relative",
          "bg-white text-black hover:bg-gray-100",
          "border border-gray-200 p-3",
        )}
        title="Swap Debug Console"
      >
        <Bug className="w-5 h-5" />
        {logs.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {logs.length > 99 ? "99+" : logs.length}
          </span>
        )}
      </button>

      {/* Panel */}
      <div
        className={cn(
          "fixed right-4 bottom-4 z-50 w-[420px] max-h-[60vh] overflow-hidden rounded-xl border bg-white text-black shadow-xl",
          open ? "opacity-100 translate-y-0" : "pointer-events-none opacity-0 translate-y-2",
          "transition-all duration-200",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2 border-b bg-gray-50">
          <div className="flex items-center space-x-2">
            <div className="font-medium text-sm">Swap Debug Console</div>
            <div className="text-xs text-gray-500">({logCounts.total || 0} logs)</div>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => swapLogger.clear()} title="Clear">
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={copyAll} title="Copy All">
              <Copy className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setOpen(false)} title="Close">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center justify-between px-3 py-2 border-b bg-gray-25">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-600">Filter:</span>
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value as any)}
              className="text-xs border rounded px-2 py-1"
            >
              <option value="all">All ({logCounts.total || 0})</option>
              <option value="info">Info ({logCounts.info || 0})</option>
              <option value="warn">Warn ({logCounts.warn || 0})</option>
              <option value="error">Error ({logCounts.error || 0})</option>
            </select>
          </div>
          <div className="flex items-center space-x-1 text-xs">
            <span className="text-red-600">🔴 {logCounts.error || 0}</span>
            <span className="text-yellow-600">🟡 {logCounts.warn || 0}</span>
            <span className="text-blue-600">🔵 {logCounts.info || 0}</span>
          </div>
        </div>

        {/* Logs Container */}
        <div className="px-3 py-2 max-h-[45vh] overflow-auto text-xs">
          {filteredLogs.length === 0 ? (
            <div className="text-gray-500 text-center py-8">
              {filterLevel === "all"
                ? "No logs yet. Perform a quote or swap to see detailed debug information."
                : `No ${filterLevel} logs found.`}
            </div>
          ) : (
            <ul className="space-y-2">
              {filteredLogs.map((log) => {
                const isExpanded = expandedLogs.has(log.id)
                const hasData = log.data !== undefined && log.data !== null

                return (
                  <li key={log.id} className={cn("rounded-md border p-3", getLogBgColor(log.level))}>
                    {/* Log Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2 flex-1">
                        <span className="text-sm">{getLogIcon(log.level)}</span>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className={cn("font-mono text-xs font-semibold", getLogTextColor(log.level))}>
                              {log.tag}
                            </span>
                            <span className="text-[10px] text-gray-500">
                              {new Date(log.ts).toLocaleTimeString()}.{String(log.ts % 1000).padStart(3, "0")}
                            </span>
                          </div>
                          <div className={cn("text-sm mt-1", getLogTextColor(log.level))}>{log.message}</div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1 ml-2">
                        {hasData && (
                          <button
                            onClick={() => toggleLogExpansion(log.id)}
                            className="p-1 hover:bg-gray-200 rounded transition-colors"
                            title={isExpanded ? "Collapse data" : "Expand data"}
                          >
                            {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                          </button>
                        )}
                        <button
                          onClick={() => copyLog(log)}
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                          title="Copy log"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Expanded Data */}
                    {hasData && isExpanded && (
                      <div className="mt-3 border-t pt-2">
                        <div className="text-xs text-gray-600 mb-1 font-medium">Debug Data:</div>
                        <pre className="bg-gray-100 border rounded p-2 overflow-auto max-h-60 text-[10px] font-mono leading-relaxed">
                          {formatJsonData(log.data)}
                        </pre>
                      </div>
                    )}

                    {/* Quick Data Preview for important logs */}
                    {hasData && !isExpanded && (log.tag === "QUOTE_SUCCESS" || log.tag === "SWAP_RESPONSE") && (
                      <div className="mt-2 text-[10px] text-gray-600">
                        {log.tag === "QUOTE_SUCCESS" &&
                          log.data &&
                          typeof log.data === "object" &&
                          "amountOut" in log.data && (
                            <span>
                              Output: {String(log.data.amountOut)} • Impact:{" "}
                              {String((log.data as any).priceImpact || "N/A")}%
                            </span>
                          )}
                        {log.tag === "SWAP_RESPONSE" &&
                          log.data &&
                          typeof log.data === "object" &&
                          "status" in log.data && (
                            <span>
                              Status: {String(log.data.status)} • TX:{" "}
                              {String((log.data as any).transaction_id || "N/A").slice(0, 10)}...
                            </span>
                          )}
                      </div>
                    )}
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {/* Footer */}
        {logs.length > 0 && (
          <div className="px-3 py-2 border-t bg-gray-50 text-xs text-gray-600">
            Last updated: {new Date(Math.max(...logs.map((l) => l.ts))).toLocaleTimeString()}
          </div>
        )}
      </div>
    </>
  )
}
