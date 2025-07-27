"use client"

import { doSwap } from "@/services/swap-service"
import { walletService } from "@/services/wallet-service"
import { motion } from "framer-motion"
import { EyeOff, Wallet, X } from "lucide-react"
import { useCallback, useEffect, useState } from "react"

import { Client, Multicall3 } from "@holdstation/worldchain-ethers-v6"
import { config, HoldSo, inmemoryTokenStorage, SwapHelper, TokenProvider, ZeroX } from "@holdstation/worldchain-sdk"
import { ethers } from "ethers"

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

const USDC_TOKEN_INFO = TOKENS.find((token) => token.symbol === "USDC")
const USDC_ADDRESS = USDC_TOKEN_INFO?.address

// Configuração do SDK Holdstation (mantida aqui para a função de cotação)
const RPC_URL = "https://worldchain-mainnet.g.alchemy.com/public"
const provider = new ethers.JsonRpcProvider(RPC_URL, { chainId: 480, name: "worldchain" }, { staticNetwork: true })
const client = new Client(provider)
config.client = client
config.multicall3 = new Multicall3(provider)
const swapHelper = new SwapHelper(client, {
  tokenStorage: inmemoryTokenStorage,
})
const tokenProvider = new TokenProvider({
  client,
  multicall3: config.multicall3,
})
const zeroX = new ZeroX(tokenProvider, inmemoryTokenStorage)
const worldSwap = new HoldSo(tokenProvider, inmemoryTokenStorage)
swapHelper.load(zeroX)
swapHelper.load(worldSwap)

interface TokenBalance {
  symbol: string
  name: string
  address: string
  balance: string
  decimals: number
  icon?: string
  formattedBalance: string
}

interface Transaction {
  id: string
  type: "sent" | "received"
  token: string
  amount: string
  address: string
  status: "pending" | "confirmed" | "failed"
  timestamp: number
  hash: string
}

interface MiniWalletProps {
  walletAddress: string
  onMinimize: () => void
  onDisconnect: () => void
  onClick?: () => void // Novo prop para o clique na carteira
}

// Supported languages
const SUPPORTED_LANGUAGES = ["en", "pt", "es", "id"] as const

type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number]

// Translations for mini wallet
const translations = {
  en: {
    connected: "Connected",
    tokens: "Tokens",
    send: "Send",
    receive: "Receive",
    history: "History",
    swap: "Swap",
    back: "Back",
    sendTokens: "Send Tokens",
    receiveTokens: "Receive Tokens",
    swapTokens: "Swap Tokens",
    transactionHistory: "Transaction History",
    tokenDetails: "Token Details",
    currentPrice: "Current Price",
    priceChange24h: "24h Change",
    priceChart: "Price Chart",
    token: "Token",
    amount: "Amount",
    recipientAddress: "Recipient Address",
    sending: "Sending...",
    swapping: "Swapping...",
    loadingPrice: "Loading price...",
    yourWalletAddress: "Your Wallet Address:",
    networkWarning: "Only send Worldchain network supported tokens to this address.",
    sendWarning:
      "Only send assets supported by the Worldchain network, do not send to exchanges, your sending may result in loss of assets",
    sendSuccess: "Successfully sent",
    sendFailed: "Send failed",
    swapSuccess: "Successfully swapped",
    swapFailed: "Swap failed",
    copyAddress: "Copy Address",
    minimize: "Minimize",
    disconnect: "Disconnect",
    refreshBalances: "Refresh Balances",
    available: "Available",
    noTransactions: "No recent transactions",
    sent: "Sent",
    received: "Received",
    pending: "Pending",
    confirmed: "Confirmed",
    failed: "Failed",
    viewOnExplorer: "View on Explorer",
    loadMore: "Load More",
    loading: "Loading...",
    from: "From",
    to: "To",
    getQuote: "Get Quote",
    gettingQuote: "Getting Quote...",
    youWillReceive: "You will receive",
    priceImpact: "Price Impact",
    swapRate: "Swap Rate",
    selectToken: "Select Token",
    enterAmount: "Enter amount to see quote",
    quoteError: "Failed to get quote",
    insufficientBalance: "Insufficient balance",
    networkError: "Network error",
    tryAgain: "Try again",
    priceUnavailable: "Price data unavailable",
    refreshPrice: "Refresh Price",
  },
  pt: {
    connected: "Conectado",
    tokens: "Tokens",
    send: "Enviar",
    receive: "Receber",
    history: "Histórico",
    swap: "Trocar",
    back: "Voltar",
    sendTokens: "Enviar Tokens",
    receiveTokens: "Receber Tokens",
    swapTokens: "Trocar Tokens",
    transactionHistory: "Histórico de Transações",
    tokenDetails: "Detalhes do Token",
    currentPrice: "Preço Atual",
    priceChange24h: "Mudança 24h",
    priceChart: "Gráfico de Preço",
    token: "Token",
    amount: "Quantidade",
    recipientAddress: "Endereço do Destinatário",
    sending: "Enviando...",
    swapping: "Trocando...",
    loadingPrice: "Carregando preço...",
    yourWalletAddress: "Seu Endereço da Carteira:",
    networkWarning: "Apenas envie para o seu endereço tokens suportados da rede Worldchain.",
    sendWarning:
      "Apenas envia ativos suportados pela rede Worldchain, não envie para exchanges, o seu envio poderá significar a perda dos ativos",
    sendSuccess: "Enviado com sucesso",
    sendFailed: "Falha no envio",
    swapSuccess: "Trocado com sucesso",
    swapFailed: "Falha na troca",
    copyAddress: "Copiar Endereço",
    minimize: "Minimizar",
    disconnect: "Desconectar",
    refreshBalances: "Atualizar Saldos",
    available: "Disponível",
    noTransactions: "Sem transações recentes",
    sent: "Enviado",
    received: "Recibido",
    pending: "Pendente",
    confirmed: "Confirmado",
    failed: "Falhou",
    viewOnExplorer: "Ver no Explorer",
    loadMore: "Carregar Mais",
    loading: "Carregando...",
    from: "De",
    to: "Para",
    getQuote: "Obter Cotação",
    gettingQuote: "Obtendo Cotação...",
    youWillReceive: "Você receberá",
    priceImpact: "Impacto no Preço",
    swapRate: "Taxa de Troca",
    selectToken: "Selecionar Token",
    enterAmount: "Digite o valor para ver a cotação",
    quoteError: "Falha ao obter cotação",
    insufficientBalance: "Saldo insuficiente",
    networkError: "Erro de rede",
    tryAgain: "Tente novamente",
    priceUnavailable: "Dados de preço indisponíveis",
    refreshPrice: "Atualizar Preço",
  },
  es: {
    connected: "Conectado",
    tokens: "Tokens",
    send: "Enviar",
    receive: "Recibir",
    history: "Historial",
    swap: "Intercambiar",
    back: "Volver",
    sendTokens: "Enviar Tokens",
    receiveTokens: "Recibir Tokens",
    swapTokens: "Intercambiar Tokens",
    transactionHistory: "Historial de Transacciones",
    tokenDetails: "Detalles del Token",
    currentPrice: "Precio Actual",
    priceChange24h: "Cambio 24h",
    priceChart: "Gráfico de Precio",
    token: "Token",
    amount: "Cantidad",
    recipientAddress: "Dirección del Destinatario",
    sending: "Enviando...",
    swapping: "Intercambiando...",
    loadingPrice: "Cargando precio...",
    yourWalletAddress: "Tu Dirección de Billetera:",
    networkWarning: "Solo envía tokens soportados por la red Worldchain a esta dirección.",
    sendWarning:
      "Solo envía activos soportados por la red Worldchain, no envíes a exchanges, tu envío podría resultar en la pérdida de activos",
    sendSuccess: "Enviado exitosamente",
    sendFailed: "Envío fallido",
    swapSuccess: "Intercambiado exitosamente",
    swapFailed: "Intercambio fallido",
    copyAddress: "Copiar Dirección",
    minimize: "Minimizar",
    disconnect: "Desconectar",
    refreshBalances: "Actualizar Saldos",
    available: "Disponible",
    noTransactions: "Sin transacciones recientes",
    sent: "Enviado",
    received: "Recibido",
    pending: "Pendente",
    confirmed: "Confirmado",
    failed: "Falló",
    viewOnExplorer: "Ver en Explorer",
    loadMore: "Cargar Más",
    loading: "Cargando...",
    from: "Desde",
    to: "Hacia",
    getQuote: "Obtener Cotización",
    gettingQuote: "Obteniendo Cotización...",
    youWillReceive: "Recibirás",
    priceImpact: "Impacto en el Precio",
    swapRate: "Tasa de Intercambio",
    selectToken: "Seleccionar Token",
    enterAmount: "Ingresa cantidad para ver cotización",
    quoteError: "Error al obtener cotización",
    insufficientBalance: "Saldo insuficiente",
    networkError: "Error de red",
    tryAgain: "Intentar de nuevo",
    priceUnavailable: "Datos de precio no disponibles",
    refreshPrice: "Actualizar Precio",
  },
  id: {
    connected: "Terhubung",
    tokens: "Token",
    send: "Kirim",
    receive: "Terima",
    history: "Riwayat",
    swap: "Tukar",
    back: "Kembali",
    sendTokens: "Kirim Token",
    receiveTokens: "Terima Token",
    swapTokens: "Tukar Token",
    transactionHistory: "Riwayat Transaksi",
    tokenDetails: "Detail Token",
    currentPrice: "Harga Saat Ini",
    priceChange24h: "Perubahan 24j",
    priceChart: "Grafik Harga",
    token: "Token",
    amount: "Jumlah",
    recipientAddress: "Alamat Penerima",
    sending: "Mengirim...",
    swapping: "Menukar...",
    loadingPrice: "Memuat harga...",
    yourWalletAddress: "Alamat Dompet Anda:",
    networkWarning: "Hanya kirim token yang didukung jaringan Worldchain ke alamat ini.",
    sendWarning:
      "Hanya kirim aset yang didukung oleh jaringan Worldchain, jangan kirim ke exchange, pengiriman Anda dapat mengakibatkan kehilangan aset",
    sendSuccess: "Berhasil dikirim",
    sendFailed: "Pengiriman gagal",
    swapSuccess: "Berhasil ditukar",
    swapFailed: "Penukaran gagal",
    copyAddress: "Salin Alamat",
    minimize: "Minimalkan",
    disconnect: "Putuskan",
    refreshBalances: "Perbarui Saldo",
    available: "Tersedia",
    noTransactions: "Tidak ada transaksi terbaru",
    sent: "Dikirim",
    received: "Diterima",
    pending: "Tertunda",
    confirmed: "Dikonfirmasi",
    failed: "Gagal",
    viewOnExplorer: "Lihat di Explorer",
    loadMore: "Muat Lebih Banyak",
    loading: "Memuat...",
    from: "Dari",
    to: "Ke",
    getQuote: "Dapatkan Kutipan",
    gettingQuote: "Mendapatkan Kutipan...",
    youWillReceive: "Anda akan menerima",
    priceImpact: "Dampak Harga",
    swapRate: "Tingkat Tukar",
    selectToken: "Pilih Token",
    enterAmount: "Masukkan jumlah untuk melihat kutipan",
    quoteError: "Gagal mendapatkan kutipan",
    insufficientBalance: "Saldo tidak mencuciente",
    networkError: "Kesalahan jaringan",
    tryAgain: "Coba lagi",
    priceUnavailable: "Data harga tidak tersedia",
    refreshPrice: "Perbarui Harga",
  },
}

interface Token {
  symbol: string
  name: string
  address: string
  decimals: number
  logo: string
  color: string
}

type ViewMode = "main" | "send" | "receive" | "history" | "swap"

export default function MiniWallet({ walletAddress, onMinimize, onDisconnect, onClick }: MiniWalletProps) {
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>("en")
  const [viewMode, setViewMode] = useState<ViewMode>("main")
  const [copied, setCopied] = useState(false)
  const [balances, setBalances] = useState<TokenBalance[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([])
  const [displayedTransactions, setDisplayedTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingHistory, setLoadingHistory] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [showBalances, setShowBalances] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [hasMoreTransactions, setHasMoreTransactions] = useState(false)
  const [sendForm, setSendForm] = useState({
    token: "KPP", // Changed default token to KPP
    amount: "",
    recipient: "",
  })
  const [swapForm, setSwapForm] = useState({
    tokenFrom: "KPP", // Default to KPP
    tokenTo: "KPP", // Default to KPP (will be changed by user)
    amountFrom: "",
    amountTo: "",
  })
  const [sending, setSending] = useState(false)
  const [swapping, setSwapping] = useState(false)
  const [gettingQuote, setGettingQuote] = useState(false)
  const [swapQuote, setSwapQuote] = useState<any>(null)
  const [quoteError, setQuoteError] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isMinimized, setIsMinimized] = useState(false)

  const TRANSACTIONS_PER_PAGE = 5

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

  const loadBalances = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const tokenBalances = await walletService.getTokenBalances(walletAddress)
      setBalances(tokenBalances)
    } catch (error) {
      setError("Failed to load balances")
    } finally {
      setLoading(false)
    }
  }, [walletAddress])

  const loadTransactionHistory = useCallback(
    async (reset = false) => {
      try {
        if (reset) {
          setLoadingHistory(true)
          setCurrentPage(0)
          setDisplayedTransactions([])
        } else {
          setLoadingMore(true)
        }

        const limit = (currentPage + 1) * TRANSACTIONS_PER_PAGE + 5
        const history = await walletService.getTransactionHistory(walletAddress, limit)

        setAllTransactions(history)

        const newDisplayCount = (currentPage + 1) * TRANSACTIONS_PER_PAGE
        const newDisplayed = history.slice(0, Math.min(history.length, newDisplayCount))

        setDisplayedTransactions(newDisplayed)
        setHasMoreTransactions(allTransactions.length > newDisplayCount)
      } catch (error) {
        // console.error("❌ Error loading transaction history:", error) // Removed verbose log
      } finally {
        setLoadingHistory(false)
        setLoadingMore(false)
      }
    },
    [walletAddress, currentPage, allTransactions],
  )

  const loadMoreTransactions = useCallback(async () => {
    const nextPage = currentPage + 1
    setCurrentPage(nextPage)

    const newDisplayCount = (nextPage + 1) * TRANSACTIONS_PER_PAGE

    if (allTransactions.length >= newDisplayCount) {
      const newDisplayed = allTransactions.slice(0, newDisplayCount)
      setDisplayedTransactions(newDisplayed)
      setHasMoreTransactions(allTransactions.length > newDisplayCount)
    } else {
      await loadTransactionHistory(false)
    }
  }, [allTransactions, currentPage, loadTransactionHistory])

  const refreshBalances = useCallback(async () => {
    setRefreshing(true)
    await loadBalances()
    setRefreshing(false)
  }, [loadBalances])

  const handleSend = useCallback(async () => {
    if (!sendForm.amount || !sendForm.recipient) return

    setSending(true)
    try {
      const selectedToken = balances.find((t) => t.symbol === sendForm.token)
      const result = await walletService.sendToken({
        to: sendForm.recipient,
        amount: Number.parseFloat(sendForm.amount),
        tokenAddress: selectedToken?.address,
      })

      if (result.success) {
        alert(`✅ ${t.sendSuccess} ${sendForm.amount} ${sendForm.token}!`)
        setViewMode("main")
        setSendForm({ token: "KPP", amount: "", recipient: "" })
        await refreshBalances()
        await loadTransactionHistory(true)
      } else {
        alert(`❌ ${t.sendFailed}: ${result.error}`)
      }
    } catch (error) {
      console.error("❌ Send error:", error) // Kept for critical error
      alert(`❌ ${t.sendFailed}. ${t.tryAgain}`)
    } finally {
      setSending(false)
    }
  }, [sendForm, balances, t.sendSuccess, t.sendFailed, t.tryAgain, refreshBalances, loadTransactionHistory])

  const getSwapQuote = useCallback(
    async (amountFrom: string, tokenFromSymbol: string, tokenToSymbol: string) => {
      if (
        !amountFrom ||
        Number.parseFloat(amountFrom) <= 0 ||
        isNaN(Number.parseFloat(amountFrom)) ||
        tokenFromSymbol === tokenToSymbol
      ) {
        setSwapQuote(null)
        setSwapForm((prev) => ({ ...prev, amountTo: "" }))
        setQuoteError(null)
        return
      }

      setGettingQuote(true)
      setQuoteError(null)

      const tokenInObj = TOKENS.find((t) => t.symbol === tokenFromSymbol)
      const tokenOutObj = TOKENS.find((t) => t.symbol === tokenToSymbol)

      if (!tokenInObj || !tokenOutObj) {
        setQuoteError("Invalid token selection.")
        setGettingQuote(false)
        return
      }

      try {
        const cleanAmount = Number.parseFloat(amountFrom).toFixed(tokenInObj.decimals)

        const quote = await swapHelper.estimate.quote({
          tokenIn: tokenInObj.address,
          tokenOut: tokenOutObj.address,
          amountIn: cleanAmount,
          slippage: "0.3",

          fee: "0.2",
          feeReceiver: ethers.ZeroAddress,
        })

        if (!quote || !quote.data || !quote.to || (!quote.outAmount && !quote.addons?.outAmount)) {
          throw new Error("Invalid quote received from SDK: Missing data, to, or outAmount.")
        }

        setSwapQuote(quote)

        let outputAmountString = "0"
        if (quote.outAmount) {
          outputAmountString = quote.outAmount.toString()
        } else if (quote.addons?.outAmount) {
          outputAmountString = quote.addons.outAmount.toString()
        } else {
          throw new Error("Could not determine output amount from quote.")
        }

        const parsedAmount = Number.parseFloat(outputAmountString)

        const finalAmount = parsedAmount.toFixed(tokenOutObj.decimals > 6 ? 6 : tokenOutObj.decimals)

        setSwapForm((prev) => ({
          ...prev,
          amountTo: finalAmount,
        }))
      } catch (error) {
        let errorMessage = t.quoteError
        if (error instanceof Error) {
          if (error.message?.includes("timeout")) {
            errorMessage = `${t.networkError}. ${t.tryAgain}`
          } else if (error.message?.includes("Network")) {
            errorMessage = `${t.networkError}. ${t.tryAgain}`
          } else if (error.message?.includes("insufficient")) {
            errorMessage = t.insufficientBalance
          } else {
            errorMessage = `${t.quoteError}: ${error.message}`
          }
        }

        setQuoteError(errorMessage)
        setSwapQuote(null)
        setSwapForm((prev) => ({ ...prev, amountTo: "" }))
      } finally {
        setGettingQuote(false)
      }
    },
    [t.quoteError, t.networkError, t.tryAgain, t.insufficientBalance],
  )

  // Auto-quote effect with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (swapForm.amountFrom && swapForm.tokenFrom && swapForm.tokenTo) {
        getSwapQuote(swapForm.amountFrom, swapForm.tokenFrom, swapForm.tokenTo)
      }
    }, 1000)

    return () => clearTimeout(timeoutId)
  }, [swapForm.amountFrom, swapForm.tokenFrom, swapForm.tokenTo, getSwapQuote])

  const handleSwap = useCallback(async () => {
    if (!swapQuote || !swapForm.amountFrom || !swapForm.tokenFrom || !swapForm.tokenTo) return

    setSwapping(true)
    try {
      const tokenFromBalance = balances.find((t) => t.symbol === swapForm.tokenFrom)
      if (!tokenFromBalance || Number.parseFloat(tokenFromBalance.balance) < Number.parseFloat(swapForm.amountFrom)) {
        throw new Error(
          `${t.insufficientBalance}. Available: ${
            tokenFromBalance?.balance || "0"
          }, Required: ${swapForm.amountFrom} ${swapForm.tokenFrom}`,
        )
      }

      if (!swapQuote.data || !swapQuote.to) {
        throw new Error("Invalid swap quote")
      }

      const tokenInObj = TOKENS.find((t) => t.symbol === swapForm.tokenFrom)
      if (!tokenInObj) throw new Error("Input token not found.")

      const cleanAmount = Number.parseFloat(swapForm.amountFrom).toFixed(tokenInObj.decimals)

      const swapResult = await doSwap({
        walletAddress,
        quote: swapQuote,
        amountIn: cleanAmount,
        tokenInSymbol: swapForm.tokenFrom,
        tokenOutSymbol: swapForm.tokenTo,
      })

      if (swapResult && swapResult.success) {
        alert(
          `✅ ${t.swapSuccess} ${swapForm.amountFrom} ${swapForm.tokenFrom} for ${swapForm.amountTo} ${swapForm.tokenTo}!`,
        )
        setViewMode("main")
        setSwapForm({
          tokenFrom: "KPP",
          tokenTo: "KPP",
          amountFrom: "",
          amountTo: "",
        })
        setSwapQuote(null)
        await refreshBalances()
        await loadTransactionHistory(true)
      } else {
        let errorMessage = t.swapFailed
        if (swapResult && swapResult.errorCode) {
          errorMessage = `${t.swapFailed}: ${swapResult.errorCode}`
        } else if (swapResult && swapResult.error instanceof Error) {
          errorMessage = `${t.swapFailed}: ${swapResult.error.message}`
        } else if (!swapResult) {
          errorMessage = `${t.swapFailed}: ${t.tryAgain} (No result from swap service)`
        }
        throw new Error(errorMessage)
      }
    } catch (error) {
      console.error("❌ Swap error:", error) // Kept for critical error

      let errorMessage = t.swapFailed
      if (error instanceof Error) {
        if (error.message?.includes("Insufficient") || error.message?.includes("insuficiente")) {
          errorMessage = `${t.swapFailed}: ${t.insufficientBalance}`
        } else if (error.message?.includes("timeout")) {
          errorMessage = `${t.swapFailed}: ${t.networkError}. ${t.tryAgain}`
        } else if (error.message?.includes("Network")) {
          errorMessage = `${t.swapFailed}: ${t.networkError}. ${t.tryAgain}`
        } else if (error.message?.includes("simulation_failed")) {
          errorMessage = `${t.swapFailed}: Simulation failed. The quote might be invalid or expired.`
        } else {
          errorMessage = `${t.swapFailed}: ${error.message}`
        }
      }

      alert(`❌ ${errorMessage}`)
    } finally {
      setSwapping(false)
    }
  })

  const handleBackToMain = useCallback(() => {
    setViewMode("main")
    setSendForm({ token: "KPP", amount: "", recipient: "" })
    setSwapForm({
      tokenFrom: "KPP",
      tokenTo: "KPP",
      amountFrom: "",
      amountTo: "",
    })
    setSwapQuote(null)
    setQuoteError(null)
  }, [])

  const openTransactionInExplorer = useCallback((hash: string) => {
    const explorerUrl = walletService.getExplorerTransactionUrl(hash)
    window.open(explorerUrl, "_blank")
  }, [])

  const formatTimestamp = useCallback((timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60)
      return `${diffInMinutes}m ago`
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `${diffInDays}d ago`
    }
  }, [])

  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case "confirmed":
        return "text-green-400"
      case "pending":
        return "text-yellow-400"
      case "failed":
        return "text-red-400"
      default:
        return "text-gray-400"
    }
  }, [])

  useEffect(() => {
    if (walletAddress) {
      loadBalances()
      loadTransactionHistory(true)
    }
  }, [walletAddress, loadBalances, loadTransactionHistory])

  const formatBalance = useCallback((balance: string): string => {
    const num = Number.parseFloat(balance)
    if (num === 0) return "0"
    if (num < 0.000001) return "<0.000001" // Show more precision for very small amounts
    if (num < 1) return num.toFixed(6) // Show up to 6 decimal places for numbers less than 1
    if (num < 1000) return num.toFixed(2) // Keep 2 decimal places for numbers between 1 and 1000
    if (num < 1000000) return `${(num / 1000).toFixed(1)}K`
    return `${(num / 1000000).toFixed(1)}M`
  }, [])

  const getTokenIcon = useCallback((symbol: string) => {
    const token = TOKENS.find((t) => t.symbol === symbol)
    return token?.logo || "/placeholder.svg?height=32&width=32"
  }, [])

  const getTokenColor = useCallback((symbol: string) => {
    const token = TOKENS.find((t) => t.symbol === symbol)
    return token?.color || "#00D4FF"
  }, [])

  const handleSwapTokens = useCallback(() => {
    setSwapForm((prev) => ({
      ...prev,
      tokenFrom: prev.tokenTo,
      tokenTo: prev.tokenFrom,
      amountFrom: prev.amountTo, // Swap amounts too for better UX
      amountTo: prev.amountFrom,
    }))
    setSwapQuote(null) // Clear quote as tokens changed
    setQuoteError(null)
  }, [setSwapForm, setSwapQuote, setQuoteError])

  return (
    <motion.div
      className="relative bg-gray-800/90 backdrop-blur-xl border border-gray-700/50 rounded-xl p-4 shadow-2xl flex flex-col items-center justify-center w-48 h-20 cursor-pointer" // Dimensões retangulares
      onClick={onClick} // Aplica o onClick aqui
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
    >
      <button
        onClick={(e) => {
          e.stopPropagation()
          onMinimize()
        }}
        className="absolute top-1 right-1 p-1 rounded-full hover:bg-gray-700/50 transition-colors z-10" // Posição ajustada
      >
        <EyeOff className="w-4 h-4 text-gray-400" />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation()
          onDisconnect()
        }}
        className="absolute top-1 left-1 p-1 rounded-full hover:bg-gray-700/50 transition-colors z-10" // Posição ajustada
      >
        <X className="w-4 h-4 text-red-400" />
      </button>
      <Wallet className="w-8 h-8 text-blue-400" /> {/* Ícone */}
      <div className="text-white font-bold text-lg">Wallet</div> {/* Texto "Wallet" */}
    </motion.div>
  )
}
