"use client"

import { walletService } from "@/services/wallet-service"
import { motion } from "framer-motion"
import { Check, Copy, LogOut, Minimize2, RefreshCw, Wallet } from "lucide-react"
import { useCallback, useEffect, useState } from "react"

// Definindo TOKENS para corresponder ao serviço de swap
const TOKENS = [
  {
    address: "0x5fa570E9c8514cdFaD81DB6ce0A327D55251fBD4",
    symbol: "KPP", // Assuming KPP as symbol for KeplerPay
    name: "KeplerPay",
    decimals: 18, // Assuming 18 decimals
    logo: "/images/keplerpay-logo.png",
    color: "#6A0DAD", // Deep purple color
  },
]

interface TokenBalance {
  symbol: string
  name: string
  address: string
  balance: string
  decimals: number
  icon?: string
  formattedBalance: string
}

interface MiniWalletProps {
  walletAddress: string
  onMinimize: () => void
  onDisconnect: () => void
}

// Supported languages
const SUPPORTED_LANGUAGES = ["en", "pt", "es", "id"] as const

type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number]

// Translations for mini wallet
const translations = {
  en: {
    connected: "Connected",
    tokens: "Tokens",
    balance: "Balance",
    copyAddress: "Copy Address",
    minimize: "Minimize",
    disconnect: "Disconnect",
    refreshBalances: "Refresh Balance",
    loading: "Loading...",
    failedToLoad: "Failed to load balance",
    noKPP: "No KPP balance found",
  },
  pt: {
    connected: "Conectado",
    tokens: "Tokens",
    balance: "Saldo",
    copyAddress: "Copiar Endereço",
    minimize: "Minimizar",
    disconnect: "Desconectar",
    refreshBalances: "Atualizar Saldo",
    loading: "Carregando...",
    failedToLoad: "Falha ao carregar saldo",
    noKPP: "Nenhum saldo KPP encontrado",
  },
  es: {
    connected: "Conectado",
    tokens: "Tokens",
    balance: "Saldo",
    copyAddress: "Copiar Dirección",
    minimize: "Minimizar",
    disconnect: "Desconectar",
    refreshBalances: "Actualizar Saldo",
    loading: "Cargando...",
    failedToLoad: "Error al cargar el saldo",
    noKPP: "No se encontró saldo KPP",
  },
  id: {
    connected: "Terhubung",
    tokens: "Token",
    balance: "Saldo",
    copyAddress: "Salin Alamat",
    minimize: "Minimalkan",
    disconnect: "Putuskan",
    refreshBalances: "Perbarui Saldo",
    loading: "Memuat...",
    failedToLoad: "Gagal memuat saldo",
    noKPP: "Saldo KPP tidak ditemukan",
  },
}

export default function MiniWallet({ walletAddress, onMinimize, onDisconnect }: MiniWalletProps) {
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>("en")
  const [copied, setCopied] = useState(false)
  const [kppBalance, setKppBalance] = useState<TokenBalance | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load saved language
  useEffect(() => {
    const savedLanguage = localStorage.getItem("preferred-language") as SupportedLanguage
    if (savedLanguage && SUPPORTED_LANGUAGES.includes(savedLanguage)) {
      setCurrentLang(savedLanguage)
    }
  }, [])

  // Get translations for current language
  const t = translations[currentLang]

  const formatAddress = useCallback((address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }, [])

  const copyAddress = useCallback(() => {
    navigator.clipboard.writeText(walletAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [walletAddress])

  const loadKPPBalance = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const tokenBalances = await walletService.getTokenBalances(walletAddress)
      const kpp = tokenBalances.find((token) => token.symbol === "KPP")
      setKppBalance(kpp || null)
    } catch (err) {
      console.error("Error loading KPP balance:", err)
      setError(t.failedToLoad)
      setKppBalance(null)
    } finally {
      setLoading(false)
    }
  }, [walletAddress, t.failedToLoad])

  const refreshKPPBalance = useCallback(async () => {
    setRefreshing(true)
    await loadKPPBalance()
    setRefreshing(false)
  }, [loadKPPBalance])

  useEffect(() => {
    if (walletAddress) {
      loadKPPBalance()
    }
  }, [walletAddress, loadKPPBalance])

  const formatBalance = useCallback((balance: string): string => {
    const num = Number.parseFloat(balance)
    if (num === 0) return "0"
    if (num < 0.000001) return "<0.000001"
    if (num < 1) return num.toFixed(6)
    if (num < 1000) return num.toFixed(2)
    if (num < 1000000) return `${(num / 1000).toFixed(1)}K`
    return `${(num / 1000000).toFixed(1)}M`
  }, [])

  const getTokenIcon = useCallback((symbol: string) => {
    const token = TOKENS.find((t) => t.symbol === symbol)
    return token?.logo || "/placeholder.svg?height=32&width=32"
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      className="bg-gray-900/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl min-w-[280px] max-w-[320px] overflow-hidden"
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
              <Wallet className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">{t.connected}</p>
              <p className="text-gray-400 text-xs">{formatAddress(walletAddress)}</p>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={copyAddress}
              className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/10"
              title={t.copyAddress}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
            <button
              onClick={onMinimize}
              className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/10"
              title={t.minimize}
            >
              <Minimize2 className="w-4 h-4" />
            </button>
            <button
              onClick={onDisconnect}
              className="p-2 text-gray-400 hover:text-red-400 transition-colors rounded-lg hover:bg-white/10"
              title={t.disconnect}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* KPP Balance Section */}
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <img
                src={getTokenIcon("KPP") || "/placeholder.svg"}
                alt="KPP Logo"
                className="w-7 h-7 rounded-full"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg?height=28&width=28"
                }}
              />
              <p className="text-white font-medium text-base">
                {TOKENS[0].symbol} {t.balance}
              </p>
            </div>
            <button
              onClick={refreshKPPBalance}
              disabled={refreshing}
              className="p-1.5 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/10 disabled:opacity-50"
              title={t.refreshBalances}
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-2">
              <RefreshCw className="w-4 h-4 text-gray-400 animate-spin mr-2" />
              <span className="text-gray-400 text-sm">{t.loading}</span>
            </div>
          ) : error ? (
            <div className="text-red-400 text-sm text-center py-2">{error}</div>
          ) : kppBalance ? (
            <p className="text-white text-3xl font-bold text-center">{formatBalance(kppBalance.balance)}</p>
          ) : (
            <p className="text-gray-400 text-sm text-center py-2">{t.noKPP}</p>
          )}
        </div>
      </div>
    </motion.div>
  )
}
