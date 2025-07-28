"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Bug, Copy, Trash2 } from "lucide-react"
import { useDebugLogs } from "@/hooks/use-debug-logs"
import { useToast } from "@/hooks/use-toast" // Assuming useToast is available

export function DebugConsole() {
  const { logs, clearLogs } = useDebugLogs()
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)

  const handleCopyLogs = () => {
    const logText = logs
      .map((entry) => `[${entry.timestamp}] [${entry.type.toUpperCase()}] ${entry.message}`)
      .join("\n")
    navigator.clipboard.writeText(logText)
    toast({
      title: "Logs Copiados",
      description: "Os logs do console foram copiados para a área de transferência.",
    })
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="fixed right-4 top-1/2 -translate-y-1/2 z-50 bg-gray-900 text-white border-gray-700 hover:bg-gray-800 hover:text-white shadow-lg"
            aria-label="Open Debug Console"
          >
            <Bug className="h-5 w-5" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[800px] h-[80vh] flex flex-col bg-gray-950 text-white border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">Console de Depuração (Cliente)</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto p-2 border border-gray-800 rounded-md bg-black text-xs font-mono">
            {logs.length === 0 ? (
              <p className="text-gray-500">Nenhum log do cliente ainda.</p>
            ) : (
              logs.map((entry, index) => (
                <div
                  key={index}
                  className={`mb-1 ${entry.type === "error" ? "text-red-400" : entry.type === "warn" ? "text-yellow-400" : "text-gray-300"}`}
                >
                  <span className="text-gray-500">[{entry.timestamp}]</span>{" "}
                  <span className="font-bold">{entry.type.toUpperCase()}:</span> {entry.message}
                </div>
              ))
            )}
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="secondary" onClick={handleCopyLogs} className="bg-gray-800 text-white hover:bg-gray-700">
              <Copy className="h-4 w-4 mr-2" /> Copiar Logs
            </Button>
            <Button variant="destructive" onClick={clearLogs} className="bg-red-600 text-white hover:bg-red-700">
              <Trash2 className="h-4 w-4 mr-2" /> Limpar Logs
            </Button>
          </div>
          <p className="text-gray-500 text-xs mt-2">
            *Logs do lado do servidor (APIs, Server Components) são visíveis apenas no dashboard de logs do Vercel.
          </p>
        </DialogContent>
      </Dialog>
    </>
  )
}
