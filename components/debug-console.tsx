"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, Copy } from "lucide-react" // Importar o ícone Copy

interface DebugConsoleProps {
  logs: string[]
  title?: string
  onClear?: () => void
}

export function DebugConsole({ logs, title = "Debug Console", onClear }: DebugConsoleProps) {
  const [isOpen, setIsOpen] = useState(true)
  const [copyStatus, setCopyStatus] = useState<string | null>(null) // Estado para feedback de cópia

  const handleCopyLogs = useCallback(async () => {
    try {
      const logsText = logs.join("\n")
      await navigator.clipboard.writeText(logsText)
      setCopyStatus("Copied!")
    } catch (err) {
      console.error("Failed to copy logs:", err)
      setCopyStatus("Failed to copy!")
    } finally {
      setTimeout(() => setCopyStatus(null), 2000) // Limpar feedback após 2 segundos
    }
  }, [logs])

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-28 right-4 bg-red-600 hover:bg-red-700 text-white z-50"
        size="sm"
      >
        Show Debug
      </Button>
    )
  }

  return (
    <Card className="fixed bottom-28 right-4 w-80 bg-black/70 border-white/20 backdrop-blur-lg text-white z-50">
      <CardHeader className="flex flex-row items-center justify-between p-3 pb-2">
        <CardTitle className="text-md font-semibold">{title}</CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(false)}
          className="h-6 w-6 text-white/80 hover:bg-white/10"
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <div className="h-40 overflow-y-auto text-xs font-mono bg-white/5 p-2 rounded-md border border-white/10">
          {logs.length === 0 ? (
            <p className="text-white/50">No debug messages yet.</p>
          ) : (
            logs.map((log, index) => (
              <p key={index} className="mb-1 last:mb-0 break-words">
                {log}
              </p>
            ))
          )}
        </div>
        <div className="flex gap-2 mt-2">
          {onClear && logs.length > 0 && (
            <Button onClick={onClear} variant="ghost" size="sm" className="flex-1 text-white/70 hover:bg-white/10">
              Clear Logs
            </Button>
          )}
          {logs.length > 0 && (
            <Button
              onClick={handleCopyLogs}
              variant="ghost"
              size="sm"
              className="flex-1 text-white/70 hover:bg-white/10"
              disabled={!!copyStatus} // Desabilitar enquanto o status de cópia estiver visível
            >
              {copyStatus ? (
                copyStatus
              ) : (
                <>
                  <Copy className="mr-2 h-3 w-3" /> Copy Logs
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
