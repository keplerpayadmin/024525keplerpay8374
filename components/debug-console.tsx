"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface DebugConsoleProps {
  logs: string[]
  title?: string
  onClear?: () => void
}

export function DebugConsole({ logs, title = "Debug Console", onClear }: DebugConsoleProps) {
  const [isOpen, setIsOpen] = useState(true)

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
        {onClear && logs.length > 0 && (
          <Button onClick={onClear} variant="ghost" size="sm" className="w-full mt-2 text-white/70 hover:bg-white/10">
            Clear Logs
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
