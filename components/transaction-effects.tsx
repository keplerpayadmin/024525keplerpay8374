"use client"

import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, XCircle, Gift, Send } from "lucide-react"
import { useEffect, useState } from "react"

interface TransactionEffectProps {
  isVisible: boolean
  type: "claim" | "send" | "success" | "error"
  message: string
  onComplete: () => void
  simplified?: boolean // New prop for simplified version
}

export function TransactionEffect({
  isVisible,
  type,
  message,
  onComplete,
  simplified = false,
}: TransactionEffectProps) {
  const [displayMessage, setDisplayMessage] = useState(message)

  useEffect(() => {
    if (isVisible) {
      setDisplayMessage(message)
      const timer = setTimeout(() => {
        onComplete()
      }, 3000) // Display for 3 seconds
      return () => clearTimeout(timer)
    }
  }, [isVisible, message, onComplete])

  if (!isVisible) return null

  let icon
  let bgColor
  let textColor
  let defaultMessage = ""

  switch (type) {
    case "claim":
      icon = <Gift className="w-8 h-8 text-green-400" />
      bgColor = "bg-green-900/70"
      textColor = "text-green-200"
      defaultMessage = "Rewards Claimed!"
      break
    case "send":
      icon = <Send className="w-8 h-8 text-blue-400" />
      bgColor = "bg-blue-900/70"
      textColor = "text-blue-200"
      defaultMessage = "Transaction Sent!"
      break
    case "success":
      icon = <CheckCircle className="w-8 h-8 text-green-400" />
      bgColor = "bg-green-900/70"
      textColor = "text-green-200"
      defaultMessage = "Success!"
      break
    case "error":
      icon = <XCircle className="w-8 h-8 text-red-400" />
      bgColor = "bg-red-900/70"
      textColor = "text-red-200"
      defaultMessage = "Error!"
      break
    default:
      icon = <CheckCircle className="w-8 h-8 text-gray-400" />
      bgColor = "bg-gray-900/70"
      textColor = "text-gray-200"
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm`}
        >
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className={`flex flex-col items-center p-6 rounded-lg shadow-xl border border-white/10 ${bgColor}`}
          >
            {icon}
            <p className={`mt-4 text-lg font-semibold ${textColor}`}>
              {simplified ? defaultMessage : displayMessage || defaultMessage}
            </p>
            {!simplified && displayMessage && message !== defaultMessage && (
              <p className={`mt-2 text-sm text-center ${textColor.replace("200", "300")}`}>{displayMessage}</p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
