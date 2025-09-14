"use client"

import type React from "react"

import { KeplerSphere } from "@/components/kepler-sphere"
import { Button } from "@/components/ui/button"
import { useState, useEffect, useRef } from "react"
import { MiniKit } from "@worldcoin/minikit-js"
import { ethers } from "ethers"
import { AIRDROP_CONTRACT_ABI, AIRDROP_CONTRACT_ADDRESS } from "@/lib/airdropContractABI"
import { BottomNavigation } from "@/components/bottom-navigation"
import { useI18n } from "@/lib/i18n/context"
import {
  Flame,
  Coins,
  Loader2,
  Gift,
  Wallet,
  ArrowLeft,
  ArrowUpDown,
  Send,
  ArrowDownToLine,
  History,
  Copy,
  QrCode,
  CheckCircle,
  RefreshCw,
  Crown,
} from "lucide-react"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { getQuote, validateBalance } from "@/services/swap-service"
import { swapLogger } from "@/services/swap-debug-logger"
import { walletService } from "@/services/wallet-service"
import { blockchainTransactionService } from "@/services/blockchain-transaction-service"
import { usePathname } from "next/navigation"

// ABI mínima para a função balanceOf de um token ERC-20
const ERC20_ABI = [
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function",
  },
] as const

// Token contracts configuration
const TOKENS = {
  KPP: {
    name: "KeplerPay",
    symbol: "KPP",
    address: "0x5fa570E9c8514cdFaD81DB6ce0A327D55251fBD4",
    image: "/images/keplerpay-logo-new.png",
    decimals: 18,
  },
  TPF: {
    name: "TPulseFi",
    symbol: "TPF",
    address: "0x834a73c0a83F3BCe349A116FFB2A4c2d1C651E45",
    image: "/tpf-logo.png",
    decimals: 18,
  },
  WDD: {
    name: "Drachma",
    symbol: "WDD",
    address: "0xEdE54d9c024ee80C85ec0a75eD2d8774c7Fbac9B",
    image: "/images/drachma-token.png",
    decimals: 18,
  },
  USDC: {
    name: "USD Coin",
    symbol: "USDC",
    address: "0x79A02482A880bCE3F13e09Da970dC34db4CD24d1",
    image: "/images/usdc.png",
    decimals: 6,
  },
  WLD: {
    name: "Worldcoin",
    symbol: "WLD",
    address: "0x2cFc85d8E48F8EAB294be644d9E25C3030863003",
    image: "/worldcoin-logo.jpeg",
    decimals: 18,
  },
}

const TOTAL_SUPPLY = 100000000 // 100 million KPP
const DEAD_ADDRESS = "0x000000000000000000000000000000000000dEaD"

const formatBalance = (balance: string): string => {
  const num = Number.parseFloat(balance)
  if (num === 0) return "0"
  if (num < 0.000001) return "<0.000001"
  if (num < 1) return num.toFixed(6)
  if (num < 1000) return num.toFixed(2)
  if (num < 1000000) return `${(num / 1000).toFixed(1)}K`
  return `${(num / 1000000).toFixed(1)}M`
}

// Staking contracts configuration
const STAKING_CONTRACTS = {
  KPP: {
    name: "KeplerPay",
    symbol: "KPP",
    address: "0x15bB53A800D6DCf0A5935850f65233Be62Bb405C",
    image: "/images/keplerpay-logo-new.png",
  },
}

// Membership tiers configuration
const MEMBERSHIP_TIERS = {
  BRONZE: {
    name: "Bronze",
    minKPP: 1000,
    benefits: ["Basic rewards", "Community access"],
    color: "#CD7F32",
    icon: "🥉",
  },
  SILVER: {
    name: "Silver",
    minKPP: 10000,
    benefits: ["Enhanced rewards", "Priority support", "Exclusive events"],
    color: "#C0C0C0",
    icon: "🥈",
  },
  GOLD: {
    name: "Gold",
    minKPP: 50000,
    benefits: ["Premium rewards", "VIP support", "Early access", "Special NFTs"],
    color: "#FFD700",
    icon: "🥇",
  },
  DIAMOND: {
    name: "Diamond",
    minKPP: 100000,
    benefits: ["Maximum rewards", "Personal advisor", "Governance voting", "Exclusive partnerships"],
    color: "#B9F2FF",
    icon: "💎",
  },
}

// ABI completa do contrato de staking
const STAKING_ABI = [
  {
    inputs: [
      { internalType: "address", name: "_kppToken", type: "address" },
      { internalType: "address", name: "_rewardToken", type: "address" },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      { internalType: "uint256", name: "oldAPY", type: "uint256" },
      { internalType: "uint256", name: "newAPY", type: "uint256" },
    ],
    name: "APYUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "user", type: "address" },
      { indexed: false, internalType: "uint256", name: "amount", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "kppBalance", type: "uint256" },
    ],
    name: "RewardsClaimed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "owner", type: "address" },
      { indexed: false, internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "RewardsDeposited",
    type: "event",
  },
  {
    inputs: [],
    name: "BASIS_POINTS",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "SECONDS_PER_YEAR",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "apyRate",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_user", type: "address" }],
    name: "calculatePendingRewards",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_user", type: "address" }],
    name: "calculateRewardsPerDay",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_user", type: "address" }],
    name: "calculateRewardsPerSecond",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_user", type: "address" }],
    name: "canClaim",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "claimRewards",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_amount", type: "uint256" }],
    name: "depositRewards",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "emergencyWithdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_user", type: "address" }],
    name: "getCalculationDetails",
    outputs: [
      { internalType: "uint256", name: "kppBalance", type: "uint256" },
      { internalType: "uint256", name: "timeStaked", type: "uint256" },
      { internalType: "uint256", name: "apyRateUsed", type: "uint256" },
      { internalType: "uint256", name: "basisPoints", type: "uint256" },
      { internalType: "uint256", name: "secondsPerYear", type: "uint256" },
      { internalType: "uint256", name: "calculatedRewards", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getCurrentAPY",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getRewardBalance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getStats",
    outputs: [
      { internalType: "uint256", name: "totalUsers", type: "uint256" },
      { internalType: "uint256", name: "totalRewards", type: "uint256" },
      { internalType: "uint256", name: "contractRewardBalance", type: "uint256" },
      { internalType: "uint256", name: "currentAPY", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_user", type: "address" }],
    name: "getTimeToNextClaim",
    outputs: [{ internalType: "uint256", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getTokenAddresses",
    outputs: [
      { internalType: "address", name: "kppTokenAddress", type: "address" },
      { internalType: "address", name: "rewardTokenAddress", type: "address" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_user", type: "address" }],
    name: "getUserInfo",
    outputs: [
      { internalType: "uint256", name: "kppBalance", type: "uint256" },
      { internalType: "uint256", name: "pendingRewards", type: "uint256" },
      { internalType: "uint256", name: "lastClaimTime", type: "uint256" },
      { internalType: "uint256", name: "totalClaimed", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "kppToken",
    outputs: [{ internalType: "contract IERC20", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "rewardToken",
    outputs: [{ internalType: "contract IERC20", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_newAPY", type: "uint256" }],
    name: "setAPY",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_user", type: "address" },
      { internalType: "uint256", name: "_days", type: "uint256" },
    ],
    name: "simulateRewards",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalRewardsClaimed",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "users",
    outputs: [
      { internalType: "uint256", name: "lastClaimTime", type: "uint256" },
      { internalType: "uint256", name: "totalClaimed", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const

export default function DashboardPage() {
  const { t } = useI18n()
  const pathname = usePathname()

  const [isConnected, setIsConnected] = useState(false)
  const [connectLoading, setConnectLoading] = useState(false)
  const [connectError, setConnectError] = useState<string | null>(null)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)

  const [tokenBalances, setTokenBalances] = useState<Record<string, string>>({})
  const [balanceLoading, setBalanceLoading] = useState(false)
  const [balanceError, setBalanceError] = useState<string | null>(null)

  const [loadingProgress, setLoadingProgress] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false) // Indica se a barra de progresso chegou a 100%
  const [buttonPosition, setButtonPosition] = useState<"left" | "right">("left")
  const [expectedClickDirection, setExpectedClickDirection] = useState<"left" | "right">("left")
  const [isClaiming, setIsClaiming] = useState(false)
  const [claimError, setClaimError] = useState<string | null>(null)
  const [claimSuccess, setClaimSuccess] = useState(false)

  const [nextClaimTimestamp, setNextClaimTimestamp] = useState<number | null>(null)
  const [remainingTime, setRemainingTime] = useState<number>(0)
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Sidebar expansion state
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false)
  const [isBurnMode, setIsBurnMode] = useState(false)
  const [isStakingMode, setIsStakingMode] = useState(false)
  const [isMembershipMode, setIsMembershipMode] = useState(false)

  // Burn page states
  const [burnedTokens, setBurnedTokens] = useState<string>("0")
  const [burnPercentage, setBurnPercentage] = useState<number>(0)
  const [burnLoading, setBurnLoading] = useState(false)
  const [burnAmount, setBurnAmount] = useState("")
  const [burnTokensLoading, setBurnTokensLoading] = useState(false)

  const [stakingClaiming, setStakingClaiming] = useState<string | null>(null)
  const [pendingRewards, setPendingRewards] = useState<string | null>(null)
  const [rewardsLoading, setRewardsLoading] = useState<string | null>(null)
  const [rewardsError, setRewardsError] = useState<string | null>(null)

  const [walletCurrentPage, setWalletCurrentPage] = useState<"main" | "send" | "receive" | "swap" | "history">("main")

  // Send page states
  const [sendToken, setSendToken] = useState<keyof typeof TOKENS>("KPP")
  const [sendAmount, setSendAmount] = useState("")
  const [sendAddress, setSendAddress] = useState("")
  const [sendLoading, setSendLoading] = useState(false)

  // Swap page states
  const [swapFromToken, setSwapFromToken] = useState<keyof typeof TOKENS>("KPP")
  const [swapToToken, setSwapToToken] = useState<keyof typeof TOKENS>("WLD")
  const [swapAmount, setSwapAmount] = useState("")
  const [swapToAmount, setSwapToAmount] = useState("")
  const [swapLoading, setSwapLoading] = useState(false)

  // Swap page states - enhanced
  const [swapQuote, setSwapQuote] = useState<any>(null)
  const [swapQuoteLoading, setSwapQuoteLoading] = useState(false)
  const [swapQuoteError, setSwapQuoteError] = useState<string | null>(null)
  const [swapEstimatedOutput, setSwapEstimatedOutput] = useState("")

  const [swapSlippage, setSwapSlippage] = useState("0.3")
  const [swapPriceImpact, setSwapPriceImpact] = useState("")
  const [balanceValidation, setBalanceValidation] = useState<{
    hasBalance: boolean
    available: string
    required: string
    token: string
  } | null>(null)

  // Receive page states
  const [copiedAddress, setCopiedAddress] = useState(false)

  // History page states - REAL BLOCKCHAIN DATA
  const [historyTransactions, setHistoryTransactions] = useState<any[]>([])
  const [historyLoading, setHistoryLoading] = useState(false)
  const [historyOffset, setHistoryOffset] = useState(0)
  const [historyHasMore, setHistoryHasMore] = useState(true)
  const [historyRefreshing, setHistoryRefreshing] = useState(false)

  // Ref para o container de scroll do histórico
  const historyScrollRef = useRef<HTMLDivElement>(null)

  // Function to get current membership tier
  const getCurrentMembershipTier = () => {
    if (!isConnected || !tokenBalances.KPP) return null

    const kppBalance = Number.parseFloat(tokenBalances.KPP || "0")

    if (kppBalance >= MEMBERSHIP_TIERS.DIAMOND.minKPP) return MEMBERSHIP_TIERS.DIAMOND
    if (kppBalance >= MEMBERSHIP_TIERS.GOLD.minKPP) return MEMBERSHIP_TIERS.GOLD
    if (kppBalance >= MEMBERSHIP_TIERS.SILVER.minKPP) return MEMBERSHIP_TIERS.GOLD
    if (kppBalance >= MEMBERSHIP_TIERS.BRONZE.minKPP) return MEMBERSHIP_TIERS.BRONZE

    return null
  }

  const [membershipLoading, setMembershipLoading] = useState(false)

  // iOS gesture prevention
  useEffect(() => {
    const preventGestures = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault()
      }
    }

    const preventZoom = (e: Event) => {
      e.preventDefault()
    }

    document.addEventListener("touchstart", preventGestures, { passive: false })
    document.addEventListener("touchmove", preventGestures, { passive: false })
    document.addEventListener("gesturestart", preventZoom, { passive: false })
    document.addEventListener("gesturechange", preventZoom, { passive: false })
    document.addEventListener("gestureend", preventZoom, { passive: false })

    return () => {
      document.removeEventListener("touchstart", preventGestures)
      document.removeEventListener("touchmove", preventGestures)
      document.removeEventListener("gesturestart", preventZoom)
      document.removeEventListener("gesturechange", preventZoom)
      document.removeEventListener("gestureend", preventZoom)
    }
  }, [])

  const fetchTokenBalances = async (address: string) => {
    console.log("🔍 Fetching token balances for:", address)
    setBalanceLoading(true)
    setBalanceError(null)
    try {
      const provider = new ethers.JsonRpcProvider(
        process.env.NEXT_PUBLIC_RPC_URL || "https://worldchain-mainnet.g.alchemy.com/public",
      )

      const balances: Record<string, string> = {}

      for (const [key, token] of Object.entries(TOKENS)) {
        try {
          console.log(`📊 Fetching ${token.symbol} balance...`)
          const contract = new ethers.Contract(token.address, ERC20_ABI, provider)
          const balance = await contract.balanceOf(address)
          balances[key] = ethers.formatUnits(balance, token.decimals)
          console.log(`✅ ${token.symbol} balance:`, balances[key])
        } catch (error) {
          console.error(`❌ Error fetching ${token.symbol} balance:`, error)
          balances[key] = "0.00"
        }
      }

      console.log("📈 All balances:", balances)
      setTokenBalances(balances)
    } catch (error) {
      console.error("❌ Error fetching token balances:", error)
      setBalanceError("Failed to fetch token balances.")
      // Set default balances
      setTokenBalances({
        TPF: "0.00",
        KPP: "0.00",
        WLD: "0.00",
        WDD: "0.00",
        USDC: "0.00",
      })
    } finally {
      setBalanceLoading(false)
    }
  }

  const fetchPendingRewards = async (walletAddress: string) => {
    setRewardsLoading(true)
    setRewardsError(null)
    try {
      const provider = new ethers.JsonRpcProvider(
        process.env.NEXT_PUBLIC_RPC_URL || "https://worldchain-mainnet.g.alchemy.com/public",
      )
      const stakingContract = new ethers.Contract(STAKING_CONTRACTS.KPP.address, STAKING_ABI, provider)
      const rewards = await stakingContract.calculatePendingRewards(walletAddress)
      setPendingRewards(ethers.formatUnits(rewards, 18))
    } catch (error) {
      console.error("Error fetching pending rewards:", error)
      setRewardsError("Failed to fetch pending rewards.")
      setPendingRewards("0.00")
    } finally {
      setRewardsLoading(false)
    }
  }

  const fetchBurnedTokens = async () => {
    setBurnLoading(true)
    try {
      const provider = new ethers.JsonRpcProvider(
        process.env.NEXT_PUBLIC_RPC_URL || "https://worldchain-mainnet.g.alchemy.com/public",
      )

      const kppContract = new ethers.Contract(TOKENS.KPP.address, ERC20_ABI, provider)
      const burnedBalance = await kppContract.balanceOf(DEAD_ADDRESS)
      const burnedAmount = ethers.formatUnits(burnedBalance, TOKENS.KPP.decimals)

      setBurnedTokens(burnedAmount)
      const percentage = (Number.parseFloat(burnedAmount) / TOTAL_SUPPLY) * 100
      setBurnPercentage(percentage)

      console.log(`🔥 Burned tokens: ${burnedAmount} KPP (${percentage.toFixed(2)}%)`)
    } catch (error) {
      console.error("❌ Error fetching burned tokens:", error)
      setBurnedTokens("0")
      setBurnPercentage(0)
    } finally {
      setBurnLoading(false)
    }
  }

  const handleBurnTokens = async () => {
    if (burnTokensLoading || !isConnected || !walletAddress || !burnAmount) return

    const amountNum = Number.parseFloat(burnAmount)
    if (isNaN(amountNum) || amountNum <= 0) {
      console.error("Invalid burn amount")
      return
    }

    setBurnTokensLoading(true)

    try {
      console.log(`🔥 Burning ${burnAmount} KPP tokens to dead address...`)

      if (!MiniKit.isInstalled()) {
        throw new Error("MiniKit not available. Please use World App.")
      }

      const result = await walletService.sendToken({
        to: DEAD_ADDRESS,
        amount: amountNum,
        tokenAddress: TOKENS.KPP.address,
      })

      if (result.success) {
        console.log("✅ Burn successful!", result)
        setBurnAmount("")

        // Refresh balances and burn data
        if (walletAddress) {
          setTimeout(() => {
            fetchTokenBalances(walletAddress)
            fetchBurnedTokens()
            // Refresh transaction history to show burn transaction
            fetchTransactionHistory(true)
          }, 2000)
        }
      } else {
        console.error("❌ Burn failed:", result.error)
        throw new Error(result.error || "Burn transaction failed")
      }
    } catch (error) {
      console.error("❌ Error burning tokens:", error)
      // You could add a toast notification here for better UX
    } finally {
      setBurnTokensLoading(false)
    }
  }

  // FUNÇÃO REAL PARA BUSCAR TRANSAÇÕES DA BLOCKCHAIN - CORRIGIDA
  const fetchTransactionHistory = async (refresh = false) => {
    if (!walletAddress) return

    if (refresh) {
      setHistoryRefreshing(true)
      setHistoryOffset(0)
      setHistoryTransactions([])
      setHistoryHasMore(true)
      // Limpar cache para forçar nova busca
      blockchainTransactionService.clearCache()
    } else {
      setHistoryLoading(true)
    }

    try {
      console.log(`📜 Buscando transações REAIS da blockchain (offset: ${refresh ? 0 : historyOffset})`)

      // Buscar transações reais da blockchain
      const transactions = await blockchainTransactionService.getTransactionHistory(
        walletAddress,
        5, // Sempre buscar 5 por vez
        refresh ? 0 : historyOffset,
      )

      console.log(`✅ Encontradas ${transactions.length} transações REAIS da blockchain`)

      if (refresh) {
        setHistoryTransactions(transactions)
        setHistoryOffset(5)
      } else {
        // Adicionar as novas transações ao final da lista
        setHistoryTransactions((prev) => {
          const newTransactions = [...prev, ...transactions]
          console.log(`📊 Total de transações após Load More: ${newTransactions.length}`)
          return newTransactions
        })
        setHistoryOffset((prev) => prev + 5)

        // CORREÇÃO: Forçar scroll para mostrar as novas transações
        setTimeout(() => {
          if (historyScrollRef.current) {
            // Scroll suave para o final para mostrar as novas transações
            historyScrollRef.current.scrollTo({
              top: historyScrollRef.current.scrollHeight,
              behavior: "smooth",
            })
            console.log("📜 Auto-scroll aplicado para mostrar novas transações")
          }
        }, 100)
      }

      // Se retornou menos de 5, não há mais transações
      setHistoryHasMore(transactions.length === 5)

      // Log das transações encontradas
      if (transactions.length > 0) {
        console.log("🔍 TRANSAÇÕES REAIS ENCONTRADAS:")
        transactions.forEach((tx, index) => {
          console.log(`${index + 1}. ${tx.type.toUpperCase()} - ${tx.amount} ${tx.tokenSymbol} - Hash: ${tx.hash}`)
        })
      } else {
        console.log("⚠️ Nenhuma transação real encontrada para este endereço")
      }
    } catch (error) {
      console.error("❌ Erro ao buscar transações reais:", error)
    } finally {
      setHistoryLoading(false)
      setHistoryRefreshing(false)
    }
  }

  const handleWalletAction = (action: string) => {
    console.log(`Wallet action: ${action}`)
    if (action === "swap") {
      setWalletCurrentPage("swap")
    } else if (action === "send") {
      setWalletCurrentPage("send")
    } else if (action === "receive") {
      setWalletCurrentPage("receive")
    } else if (action === "history") {
      setWalletCurrentPage("history")
      // Carregar histórico REAL quando abrir a página
      if (historyTransactions.length === 0) {
        fetchTransactionHistory(true)
      }
    }
  }

  const handleSendToken = async () => {
    if (sendLoading) return
    try {
      if (!isConnected || !walletAddress) {
        console.error("Wallet not connected")
        return
      }
      if (!sendAddress || !ethers.isAddress(sendAddress)) {
        console.error("Invalid recipient address")
        return
      }
      const amountNum = Number.parseFloat(sendAmount)
      if (!sendAmount || isNaN(amountNum) || amountNum <= 0) {
        console.error("Invalid amount")
        return
      }

      setSendLoading(true)

      const tokenCfg = TOKENS[sendToken]
      const result = await walletService.sendToken({
        to: sendAddress,
        amount: amountNum,
        tokenAddress: tokenCfg.address, // envio ERC20, usar contrato do token
      })

      if (result.success) {
        console.log("✅ Send success", result)
        setSendAmount("")
        setSendAddress("")
        setWalletCurrentPage("main")
        if (walletAddress) {
          // atualizar saldos e histórico após alguns segundos
          setTimeout(() => fetchTokenBalances(walletAddress), 2000)
          // Refresh do histórico para mostrar a nova transação
          setTimeout(() => fetchTransactionHistory(true), 3000)
        }
      } else {
        console.error("❌ Send failed:", result.error)
      }
    } catch (err) {
      console.error("❌ Error sending token:", err)
    } finally {
      setSendLoading(false)
    }
  }

  const handleCopyAddress = async () => {
    if (walletAddress) {
      try {
        await navigator.clipboard.writeText(walletAddress)
        setCopiedAddress(true)
        setTimeout(() => setCopiedAddress(false), 2000)
      } catch (error) {
        console.error("Failed to copy address:", error)
      }
    }
  }

  // Efeito para carregar o estado do countdown do localStorage
  useEffect(() => {
    const storedTimestamp = localStorage.getItem("nextClaimTimestamp")
    if (storedTimestamp) {
      const timestamp = Number.parseInt(storedTimestamp, 10)
      if (Date.now() < timestamp) {
        setNextClaimTimestamp(timestamp)
        setRemainingTime(Math.floor((timestamp - Date.now()) / 1000))
        setClaimSuccess(true) // Para exibir o countdown ao invés do botão de claim
        setIsLoaded(true) // Manter a esfera animando rápido
      } else {
        // Se o timestamp estiver no passado, limpar o localStorage
        localStorage.removeItem("nextClaimTimestamp")
      }
    }
  }, [])

  // Countdown logic
  useEffect(() => {
    if (nextClaimTimestamp) {
      countdownIntervalRef.current = setInterval(() => {
        const now = Date.now()
        const timeLeft = Math.max(0, nextClaimTimestamp - now)
        setRemainingTime(Math.floor(timeLeft / 1000))

        if (timeLeft <= 0) {
          clearInterval(countdownIntervalRef.current!)
          setNextClaimTimestamp(null)
          localStorage.removeItem("nextClaimTimestamp") // Limpar do localStorage
          setClaimSuccess(false) // Reset claim success to allow new claim
          setLoadingProgress(0) // Reset progress bar
          setIsLoaded(false) // Reset loaded state, sphere will slow down
          setButtonPosition("left") // Reset button position
          setExpectedClickDirection("left") // Reset expected click direction
        }
      }, 1000)
    }

    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current)
      }
    }
  }, [nextClaimTimestamp])

  useEffect(() => {
    if (isConnected && walletAddress) {
      fetchPendingRewards(walletAddress)
      const interval = setInterval(() => {
        fetchPendingRewards(walletAddress!)
      }, 1000)
      return () => clearInterval(interval)
    } else {
      setPendingRewards("0.00")
      setRewardsError(null)
    }
  }, [isConnected, walletAddress])

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60
    return {
      hours: hours.toString().padStart(2, "0"),
      minutes: minutes.toString().padStart(2, "0"),
      seconds: seconds.toString().padStart(2, "0"),
    }
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
    const diffInDays = Math.floor(diffInHours / 24)

    if (diffInDays > 0) {
      return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`
    } else if (diffInHours > 0) {
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`
    } else {
      return "Less than 1 hour ago"
    }
  }

  const handleConnectWallet = async () => {
    setConnectLoading(true)
    setConnectError(null)
    try {
      if (!MiniKit.isInstalled()) {
        throw new Error("World App (MiniKit) is not installed.")
      }

      const nonceResponse = await fetch("/api/auth/nonce")
      if (!nonceResponse.ok) {
        throw new Error("Failed to get nonce from server.")
      }
      const { nonce } = await nonceResponse.json()
      if (!nonce) {
        throw new Error("Nonce not received from server.")
      }

      console.log("Calling MiniKit.commandsAsync.walletAuth...")
      const { finalPayload } = await MiniKit.commandsAsync.walletAuth({
        nonce,
      })

      if (finalPayload.status === "error") {
        throw new Error(finalPayload.message || "Wallet authentication failed.")
      }

      const siweVerifyResponse = await fetch("/api/auth/siwe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ payload: finalPayload, nonce }),
      })

      const siweVerifyData = await siweVerifyResponse.json()

      if (!siweVerifyResponse.ok || !siweVerifyData.isValid) {
        throw new Error(siweVerifyData.message || "SIWE verification failed on backend.")
      }

      setIsConnected(true)
      setWalletAddress(finalPayload.address)
      fetchTokenBalances(finalPayload.address)
      fetchPendingRewards(finalPayload.address)
      console.log("Wallet connected and session established!")
    } catch (error) {
      console.error("Erro ao conectar carteira:", error)
      setConnectError(error instanceof Error ? error.message : "An unknown error occurred during wallet connection.")
    } finally {
      setConnectLoading(false)
    }
  }

  const handleSwipeProgress = (clientX: number, rect: DOMRect) => {
    if (isLoaded) return

    const progress = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100))
    setLoadingProgress(progress)

    if (progress >= 100 && !isLoaded) {
      setIsLoaded(true)
    }
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isLoaded) return

    const rect = e.currentTarget.getBoundingClientRect()
    handleSwipeProgress(e.clientX, rect)

    const handleMouseMove = (moveEvent: MouseEvent) => {
      handleSwipeProgress(moveEvent.clientX, rect)
    }

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
  }

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (isLoaded) return

    const rect = e.currentTarget.getBoundingClientRect()
    const touch = e.touches[0]
    handleSwipeProgress(touch.clientX, rect)

    const handleTouchMove = (moveEvent: TouchEvent) => {
      const touch = moveEvent.touches[0]
      handleSwipeProgress(touch.clientX, rect)
    }

    const handleTouchEnd = () => {
      document.removeEventListener("touchmove", handleTouchMove)
      document.removeEventListener("touchend", handleTouchEnd)
    }

    document.addEventListener("touchmove", handleTouchMove)
    document.addEventListener("touchend", handleTouchEnd)
  }

  const handleMoveButtonClick = () => {
    if (isLoaded) return

    const isCorrectClick = buttonPosition === expectedClickDirection

    if (isCorrectClick) {
      setLoadingProgress((prev) => {
        const newProgress = Math.min(100, prev + 15)
        if (newProgress >= 100 && !isLoaded) {
          setIsLoaded(true) // Set isLoaded to true when progress reaches 100%
        }
        return newProgress
      })

      setButtonPosition((prev) => (prev === "left" ? "right" : "left"))
      setExpectedClickDirection((prev) => (prev === "left" ? "right" : "left"))
    }
  }

  const handleClaimKPP = async () => {
    if (isClaiming) return

    setIsClaiming(true)
    setClaimError(null)
    setClaimSuccess(false)

    try {
      if (!MiniKit.isInstalled()) {
        throw new Error("World App (MiniKit) is not installed.")
      }

      const contractAddress = AIRDROP_CONTRACT_ADDRESS
      const contractABI = AIRDROP_CONTRACT_ABI

      console.log("Calling MiniKit.commandsAsync.sendTransaction...")
      const { finalPayload } = await MiniKit.commandsAsync.sendTransaction({
        transaction: [
          {
            address: contractAddress,
            abi: contractABI,
            functionName: "claimAirdrop",
            args: [],
          },
        ],
      })

      console.log("MiniKit transaction response:", finalPayload)

      if (finalPayload.status === "error") {
        if (
          finalPayload.message &&
          (finalPayload.message.includes("Wait 24h") ||
            finalPayload.message.includes("24h between claims") ||
            finalPayload.message.includes("already claimed"))
        ) {
          setClaimError("You have already claimed your airdrop for today. Please wait 24 hours.")
        } else {
          throw new Error(finalPayload.message || "Failed to claim KPP via MiniKit.")
        }
        return
      }

      console.log("Transaction ID from MiniKit:", finalPayload.transaction_id)
      const verifyTxResponse = await fetch("/api/transaction-verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ transaction_id: finalPayload.transaction_id }),
      })

      if (!verifyTxResponse.ok) {
        const errorData = await verifyTxResponse.json()
        console.warn("Backend transaction verification failed:", errorData)
      } else {
        console.log("Backend transaction verification successful!")
      }

      setClaimSuccess(true)
      const newNextClaimTimestamp = Date.now() + 24 * 60 * 60 * 1000 // 24 hours from now
      setNextClaimTimestamp(newNextClaimTimestamp)
      localStorage.setItem("nextClaimTimestamp", newNextClaimTimestamp.toString()) // Salvar no localStorage
      setRemainingTime(24 * 60 * 60) // Set initial remaining time

      if (walletAddress) {
        setTimeout(() => fetchTokenBalances(walletAddress), 2000)
        // Refresh do histórico para mostrar a nova transação de claim
        setTimeout(() => fetchTransactionHistory(true), 3000)
      }

      // Não resetar loadingProgress, isLoaded, etc. aqui, o countdown fará isso.
    } catch (error) {
      console.error("Error claiming KPP:", error)
      setClaimError(error instanceof Error ? error.message : "An unknown error occurred during claim.")
    } finally {
      setIsClaiming(false)
    }
  }

  const handleStakingClaim = async (tokenKey: string) => {
    const contract = STAKING_CONTRACTS[tokenKey as keyof typeof STAKING_CONTRACTS]
    if (!contract.address || !walletAddress) {
      console.error("Wallet not connected or contract address missing.")
      return
    }

    setStakingClaiming(tokenKey)

    try {
      console.log(`🎁 Claiming ${contract.symbol} rewards...`)
      console.log(`Contract address: ${contract.address}`)
      console.log(`User wallet: ${walletAddress}`)

      if (!MiniKit.isInstalled()) {
        throw new Error("MiniKit not available. Please use World App.")
      }

      const { finalPayload } = await MiniKit.commandsAsync.sendTransaction({
        transaction: [
          {
            address: contract.address,
            abi: STAKING_ABI,
            functionName: "claimRewards",
            args: [],
          },
        ],
      })

      console.log("Final payload:", finalPayload)

      if (finalPayload.status === "error") {
        console.error(`Transaction failed: ${finalPayload.message || "Unknown error"}`)
      } else if (finalPayload.status === "success") {
        console.log(`✅ ${contract.symbol} rewards claimed successfully!`)
        if (walletAddress) {
          fetchPendingRewards(walletAddress)
          // Refresh do histórico para mostrar a nova transação de claim
          setTimeout(() => fetchTransactionHistory(true), 3000)
        }
      }
    } catch (error) {
      console.error(`❌ ${contract.symbol} claim failed:`, error)
    } finally {
      setStakingClaiming(null)
    }
  }

  const handleSidebarToggle = () => {
    setIsSidebarExpanded(!isSidebarExpanded)
    setIsBurnMode(false)
    setIsStakingMode(false)
    setIsMembershipMode(false)
    setWalletCurrentPage("main") // Reset wallet page when toggling
  }

  const handleBurnAction = () => {
    console.log("Burn action clicked")
    setIsSidebarExpanded(true)
    setIsBurnMode(true)
    setIsStakingMode(false)
    setIsMembershipMode(false)
    fetchBurnedTokens()
  }

  const handleStakingAction = () => {
    console.log("Staking action clicked")
    setIsSidebarExpanded(true)
    setIsStakingMode(true)
    setIsBurnMode(false)
    setIsMembershipMode(false)
  }

  const handleMembershipAction = () => {
    console.log("Membership action clicked")
    setIsSidebarExpanded(true)
    setIsMembershipMode(true)
    setIsBurnMode(false)
    setIsStakingMode(false)
  }

  const handleGetMembership = async () => {
    if (membershipLoading || !isConnected || !walletAddress) return

    setMembershipLoading(true)

    try {
      console.log("💎 Processing Platinum Membership payment...")
      console.log("💰 Sending 25 WLD to membership address...")

      if (!MiniKit.isInstalled()) {
        throw new Error("MiniKit not available. Please use World App.")
      }

      const result = await walletService.sendToken({
        to: "0x615115a2770577b1f89e552d1846e2ba92809580",
        amount: 25,
        tokenAddress: TOKENS.WLD.address,
      })

      if (result.success) {
        console.log("✅ Membership payment successful!", result)

        // Refresh balances after payment
        if (walletAddress) {
          setTimeout(() => {
            fetchTokenBalances(walletAddress)
            // Refresh transaction history to show membership payment
            fetchTransactionHistory(true)
          }, 2000)
        }

        // You could add a success message or notification here
        console.log("🎉 Welcome to Platinum Membership!")
      } else {
        console.error("❌ Membership payment failed:", result.error)
        throw new Error(result.error || "Membership payment failed")
      }
    } catch (error) {
      console.error("❌ Error processing membership payment:", error)
      // You could add error handling/notification here
    } finally {
      setMembershipLoading(false)
    }
  }

  const timeDisplay = formatTime(remainingTime)

  // Sphere should animate at maximum speed during countdown or when loaded
  const isSphereAnimatingFast =
    loadingProgress >= 100 || isLoaded || claimSuccess || (nextClaimTimestamp !== null && remainingTime > 0)

  const letters = ["K", "E", "P", "L", "E", "R"]

  const handleSwapAmountChange = (value: string) => {
    setSwapAmount(value)
    setSwapEstimatedOutput("")
    setSwapQuote(null)
    setSwapQuoteError(null)
    if (value && !isNaN(Number(value))) {
      getSwapQuote(value)
    } else if (value === "") {
      setSwapEstimatedOutput("")
    }
  }

  const handleSwapDirection = () => {
    setSwapFromToken((prev) => {
      const temp = swapToToken
      setSwapToToken(prev)
      return temp
    })
    setSwapAmount("")
    setSwapEstimatedOutput("")
    setSwapQuote(null)
    setSwapQuoteError(null)
  }

  const handleSwapTokens = async () => {
    if (!swapAmount || !swapFromToken || !swapToToken || swapLoading || !swapQuote || !walletAddress) return

    setSwapLoading(true)
    try {
      console.log(`🔄 Starting swap: ${swapAmount} ${swapFromToken} to ${swapToToken}`)

      if (!MiniKit.isInstalled()) {
        throw new Error("MiniKit is not installed")
      }

      // Log detalhado do início do swap
      swapLogger.swapSubmit(swapFromToken, swapToToken, swapAmount, {
        fromToken: TOKENS[swapFromToken],
        toToken: TOKENS[swapToToken],
        amount: swapAmount,
        walletAddress,
        quote: swapQuote,
        timestamp: new Date().toISOString(),
      })

      // Usar os dados do quote para construir a transação
      const transactionConfig = {
        transaction: [
          {
            address: swapQuote.data.to,
            abi: [], // Para raw transaction não precisamos de ABI
            functionName: "swap", // Nome simbólico
            args: [],
            data: swapQuote.data.data, // Raw transaction data do quote
            value: swapQuote.data.value || "0", // Value em wei se necessário
          },
        ],
      }

      // Log da configuração da transação
      swapLogger.transactionPrepared(swapQuote.data.to, swapQuote.data.value || "0", {
        transactionConfig,
        rawData: swapQuote.data.data,
        contractAddress: swapQuote.data.to,
        value: swapQuote.data.value,
        estimatedGas: swapQuote.data.addons?.estimatedGas,
        priceImpact: swapQuote.data.priceImpact,
      })

      console.log("📋 Swap transaction config:", transactionConfig)
      console.log("🔄 Calling MiniKit.commandsAsync.sendTransaction...")

      const { finalPayload } = await MiniKit.commandsAsync.sendTransaction(transactionConfig)

      // Log detalhado da resposta do MiniKit
      swapLogger.info("MINIKIT_RESPONSE", "MiniKit transaction response received", {
        status: finalPayload.status,
        transaction_id: finalPayload.transaction_id,
        message: finalPayload.message,
        fullPayload: finalPayload,
        timestamp: new Date().toISOString(),
      })

      console.log("📦 Swap transaction response:", finalPayload)

      if (finalPayload.status === "error") {
        console.error("❌ Swap transaction failed:", finalPayload.message)
        swapLogger.swapFailed(finalPayload.message || "Unknown error", {
          finalPayload,
          transactionConfig,
          swapDetails: {
            from: swapFromToken,
            to: swapToToken,
            amount: swapAmount,
          },
        })
        throw new Error(finalPayload.message || "Swap transaction failed")
      }

      console.log("✅ Swap transaction sent successfully!")
      console.log(`Transaction ID: ${finalPayload.transaction_id}`)

      // Log de sucesso
      swapLogger.swapSuccess(finalPayload.transaction_id || "unknown", {
        transactionId: finalPayload.transaction_id,
        swapDetails: {
          fromToken: swapFromToken,
          toToken: swapToToken,
          amount: swapAmount,
          estimatedOutput: swapEstimatedOutput,
          priceImpact: swapPriceImpact,
        },
        finalPayload,
        timestamp: new Date().toISOString(),
      })

      // Limpar os campos após sucesso
      setSwapAmount("")
      setSwapEstimatedOutput("")
      setSwapQuote(null)
      setSwapQuoteError(null)

      // Recarregar balances após alguns segundos
      setTimeout(() => {
        if (walletAddress) {
          fetchTokenBalances(walletAddress)
          // Refresh do histórico para mostrar a nova transação de swap
          fetchTransactionHistory(true)
        }
      }, 3000)

      // Voltar para a tela principal da wallet
      setWalletCurrentPage("main")
    } catch (error) {
      console.error("❌ Error swapping tokens:", error)
      swapLogger.swapFailed(error instanceof Error ? error.message : "Unknown swap error", {
        error,
        swapDetails: {
          fromToken: swapFromToken,
          toToken: swapToToken,
          amount: swapAmount,
        },
        quote: swapQuote,
        timestamp: new Date().toISOString(),
      })
      setSwapQuoteError(error instanceof Error ? error.message : "Swap failed")
    } finally {
      setSwapLoading(false)
    }
  }

  const getSwapQuote = async (amount: string) => {
    setSwapQuoteLoading(true)
    setSwapQuoteError(null)
    setSwapQuote(null)
    setSwapEstimatedOutput("")

    try {
      // Log detalhado do início da busca por quote
      const fromTokenInfo = TOKENS[swapFromToken]
      const toTokenInfo = TOKENS[swapToToken]

      swapLogger.tokenInfo("FROM_TOKEN", fromTokenInfo)
      swapLogger.tokenInfo("TO_TOKEN", toTokenInfo)

      // CORREÇÃO DO ERRO BIGINT: Converter corretamente para wei
      const amountIn = ethers.parseUnits(amount, TOKENS[swapFromToken].decimals).toString()
      console.log(`Getting quote for amount: ${amount}, amountIn (wei): ${amountIn}`)

      // Log detalhado da requisição de quote
      swapLogger.quoteRequest(swapFromToken, swapToToken, amount, {
        tokenIn: fromTokenInfo,
        tokenOut: toTokenInfo,
        amountHuman: amount,
        amountWei: amountIn,
        slippage: swapSlippage,
        walletAddress,
        timestamp: new Date().toISOString(),
        conversionDetails: {
          originalAmount: amount,
          decimals: fromTokenInfo.decimals,
          weiAmount: amountIn,
        },
      })

      const quote = await getQuote(TOKENS[swapFromToken].address, TOKENS[swapToToken].address, amountIn, swapSlippage)

      if (quote.success) {
        setSwapQuote(quote)
        setSwapEstimatedOutput(quote.data.amountOut)
        setSwapPriceImpact(quote.data.priceImpact)

        // Log detalhado do sucesso do quote
        swapLogger.quoteSuccess(quote.data.amountOut, quote.data.priceImpact, {
          quote: quote.data,
          contractAddress: quote.data.to,
          transactionData: quote.data.data,
          value: quote.data.value,
          priceImpact: quote.data.priceImpact,
          amountOut: quote.data.amountOut,
          addons: quote.data.addons,
          slippage: swapSlippage,
          timestamp: new Date().toISOString(),
          gasEstimate: quote.data.addons?.estimatedGas,
          route: quote.data.addons?.route,
        })

        // Validação de saldo com log detalhado
        const validation = await validateBalance(
          amount,
          TOKENS[swapFromToken].address,
          walletAddress!,
          TOKENS[swapFromToken].decimals,
        )
        setBalanceValidation(validation)

        swapLogger.balanceCheck(fromTokenInfo.symbol, validation.available, validation.required, validation.hasBalance)
      } else {
        swapLogger.quoteFailed(quote.error || "Unknown quote failure", {
          error: quote.error,
          fromToken: fromTokenInfo,
          toToken: toTokenInfo,
          amount,
          amountWei: amountIn,
          slippage: swapSlippage,
          timestamp: new Date().toISOString(),
        })
        setSwapQuoteError(quote.error || "Could not get quote")
      }
    } catch (error: any) {
      console.error("Error getting swap quote:", error)
      swapLogger.error("QUOTE_ERROR", error?.message || "Quote request threw exception", {
        error,
        errorMessage: error?.message,
        errorStack: error?.stack,
        swapDetails: {
          fromToken: swapFromToken,
          toToken: swapToToken,
          amount,
        },
        timestamp: new Date().toISOString(),
      })
      setSwapQuoteError(error?.message || "Could not get quote")
    } finally {
      setSwapQuoteLoading(false)
    }
  }

  return (
    <div
      className="relative flex h-screen flex-col items-center justify-center bg-black text-white overflow-hidden"
      style={{
        position: "fixed",
        width: "100%",
        height: "100vh",
        height: "-webkit-fill-available",
        overscrollBehavior: "none",
        touchAction: "manipulation",
        WebkitUserSelect: "none",
        userSelect: "none",
        WebkitTouchCallout: "none",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      {/* KEPLER title with glow effect - same as World ID page */}
      <div className="absolute top-16 left-1/2 transform -translate-x-1/2 z-30">
        <div className="mb-6 flex space-x-2">
          {letters.map((letter, index) => (
            <span
              key={index}
              className="text-4xl font-bold text-white opacity-100"
              style={{
                textShadow:
                  "0 0 20px rgba(255, 255, 255, 0.8), 0 0 40px rgba(255, 255, 255, 0.6), 0 0 60px rgba(255, 255, 255, 0.4)",
                filter: "drop-shadow(0 0 10px rgba(255, 255, 255, 0.9))",
              }}
            >
              {letter}
            </span>
          ))}
        </div>
      </div>
      <div className="absolute inset-0 z-0">
        <KeplerSphere isSphereAnimatingFast={isSphereAnimatingFast} />
      </div>

      {/* Expandable sidebar */}
      <div className="absolute right-0 top-[calc(10%)] h-2/3 z-30 flex flex-col items-end justify-center">
        {/* Expandable bar with glow effect */}
        <div
          className={`relative h-full bg-white flex items-center justify-center transition-all duration-300 ease-in-out ${
            isSidebarExpanded ? "w-96" : "w-10"
          }`}
          style={{
            borderRadius: isSidebarExpanded ? "40px 0 0 40px" : "40px 0 0 40px",
          }}
        >
          {/* Icons - only show when sidebar is NOT expanded */}
          {!isSidebarExpanded && (
            <div className="flex flex-col items-center space-y-3">
              {/* Wallet Icon */}
              <button
                onClick={handleSidebarToggle}
                className="relative z-10 p-2 hover:bg-gray-300 rounded-full transition-colors"
              >
                <Wallet className="w-6 h-6 text-black" />
              </button>

              {/* Staking Icon */}
              <button
                onClick={handleStakingAction}
                className="relative z-10 p-2 hover:bg-gray-300 rounded-full transition-colors"
              >
                <Coins className="w-6 h-6 text-black" />
              </button>

              {/* Membership Icon */}
              <button
                onClick={handleMembershipAction}
                className="relative z-10 p-2 hover:bg-gray-300 rounded-full transition-colors"
              >
                <Crown className="w-6 h-6 text-black" />
              </button>

              {/* Burn Icon */}
              <button
                onClick={handleBurnAction}
                className="relative z-10 p-2 hover:bg-gray-300 rounded-full transition-colors"
              >
                <Flame className="w-6 h-6 text-black" />
              </button>
            </div>
          )}

          {/* Expanded content */}
          {isSidebarExpanded && (
            <div className="absolute inset-0 flex flex-col text-black p-4">
              {/* Back arrow button in top left corner */}
              <button
                onClick={() => {
                  if (walletCurrentPage !== "main") {
                    setWalletCurrentPage("main")
                  } else {
                    handleSidebarToggle()
                  }
                }}
                className="absolute top-2 left-2 p-2 hover:bg-gray-300 rounded-full transition-colors z-10"
              >
                <ArrowLeft className="w-5 h-5 text-black" />
              </button>

              {isBurnMode ? (
                /* Burn Content - KPP Burn Tracker with Circle */
                <div className="flex-1 flex flex-col items-center justify-center mt-4 space-y-6">
                  <div className="flex items-center justify-between w-full">
                    <h3 className="text-xs font-semibold text-black">🔥 KPP Burn Tracker</h3>
                    <button
                      onClick={() => fetchBurnedTokens()}
                      disabled={burnLoading}
                      className="text-xs text-gray-600 hover:text-black transition-colors"
                    >
                      {burnLoading ? "Updating..." : "Refresh"}
                    </button>
                  </div>

                  {/* Burn Circle Visualization - REDESIGNED LAYOUT */}
                  <div className="flex items-center space-x-6 w-full">
                    {/* Left side - Smaller Circle */}
                    <div className="flex flex-col items-center space-y-2">
                      <div className="relative w-24 h-24">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                          {/* Background circle */}
                          <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                          {/* Burned progress circle */}
                          <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke="#ef4444"
                            strokeWidth="8"
                            strokeDasharray={`${burnPercentage * 2.827} 282.7`}
                            strokeLinecap="round"
                            className="transition-all duration-1000 ease-out"
                          />
                        </svg>

                        {/* Center content */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <div className="text-xs font-bold text-red-500">{burnPercentage.toFixed(2)}%</div>
                          <div className="text-[8px] text-gray-600">Burned</div>
                        </div>
                      </div>
                    </div>

                    {/* Right side - Statistics and Controls */}
                    <div className="flex-1 space-y-3">
                      {/* Burn Statistics */}
                      <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] text-gray-600">Total Supply</span>
                          <span className="font-semibold text-[10px] text-black">
                            {TOTAL_SUPPLY.toLocaleString()} KPP
                          </span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-[9px] text-gray-600">Burned Tokens</span>
                          <span className="font-semibold text-[10px] text-red-500">
                            {Number.parseFloat(burnedTokens).toLocaleString()} KPP
                          </span>
                        </div>
                      </div>

                      {/* Burn Input and Button */}
                      <div className="space-y-2">
                        <div className="w-full">
                          <Input
                            type="number"
                            placeholder="Amount to burn"
                            value={burnAmount}
                            onChange={(e) => setBurnAmount(e.target.value)}
                            className="text-[9px] h-8"
                            style={{ fontSize: "16px" }}
                          />
                          {isConnected && (
                            <p className="text-[7px] text-gray-600 mt-1">
                              Available: {Number.parseFloat(tokenBalances.KPP || "0").toFixed(4)} KPP
                            </p>
                          )}
                        </div>

                        <Button
                          onClick={handleBurnTokens}
                          disabled={
                            burnTokensLoading || !isConnected || !burnAmount || Number.parseFloat(burnAmount) <= 0
                          }
                          className="w-full px-3 py-1.5 text-[9px] font-semibold bg-red-500 text-white hover:bg-red-600 rounded-lg shadow-lg disabled:opacity-50"
                        >
                          {burnTokensLoading ? (
                            <div className="flex items-center justify-center space-x-1">
                              <Loader2 className="w-3 h-3 animate-spin" />
                              <span>Burning...</span>
                            </div>
                          ) : (
                            <>
                              <Flame className="w-3 h-3 mr-1" />
                              <span>Burn KPP</span>
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : isStakingMode ? (
                /* Staking Content - Full staking interface */
                <div className="flex-1 flex flex-col items-center justify-center mt-4 space-y-6">
                  <style jsx>{`
                    @keyframes glow-light {
                      0%, 100% { box-shadow: 0 0 10px rgba(255, 255, 255, 0.5), 0 0 20px rgba(255, 255, 255, 0.3); }
                      50% { box-shadow: 0 0 20px rgba(255, 255, 255, 0.8), 0 0 40px rgba(255, 255, 255, 0.6); }
                    }
                  `}</style>

                  {/* KPP Logo */}
                  <div className="flex flex-col items-center justify-center">
                    <Image
                      src={STAKING_CONTRACTS.KPP.image || "/placeholder.svg"}
                      alt={STAKING_CONTRACTS.KPP.name}
                      width={80}
                      height={80}
                      className="rounded-full border-2 border-black/20 shadow-lg animate-[glow-light_2s_ease-in-out_infinite]"
                    />
                    <h3 className="text-black font-bold text-sm mt-2">{STAKING_CONTRACTS.KPP.symbol}</h3>
                    <p className="text-gray-600 text-[10px]">{STAKING_CONTRACTS.KPP.name}</p>
                  </div>

                  {/* Pending Rewards Display */}
                  {!isConnected ? (
                    <p className="text-gray-600 text-[10px]">Connect wallet to see rewards</p>
                  ) : (
                    <div className="text-center">
                      <p className="text-gray-600 text-[10px] font-medium">Pending Rewards</p>
                      {rewardsLoading ? (
                        <p className="text-black text-xs font-bold mt-1 min-w-[80px] tabular-nums">Loading...</p>
                      ) : rewardsError ? (
                        <p className="text-red-600 text-xs font-bold mt-1 min-w-[80px] tabular-nums">
                          {pendingRewards}
                        </p>
                      ) : (
                        <p className="text-black text-xs font-bold mt-1 min-w-[80px] tabular-nums">
                          {pendingRewards || "0.00"} {STAKING_CONTRACTS.KPP.symbol}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Claim Button */}
                  <div className="w-full max-w-[200px]">
                    <button
                      onClick={() => handleStakingClaim("KPP")}
                      disabled={stakingClaiming === "KPP" || !isConnected}
                      className={`w-full py-2 px-4 rounded-lg font-bold text-xs transition-all duration-300 flex items-center justify-center space-x-2 ${
                        stakingClaiming === "KPP" || !isConnected
                          ? "bg-gray-400/50 text-gray-600 cursor-not-allowed"
                          : "bg-black text-white hover:bg-gray-800 shadow-lg"
                      }`}
                    >
                      {stakingClaiming === "KPP" ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Claiming...</span>
                        </>
                      ) : (
                        <>
                          <Gift className="w-4 h-4" />
                          <span>Claim Rewards</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : isMembershipMode ? (
                /* Membership Content - Platinum Membership */
                <div className="flex-1 flex flex-col items-center justify-start mt-4 space-y-4 overflow-y-auto">
                  {/* Platinum Membership Card */}
                  <div className="w-full bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg p-4 border-2 border-purple-300 space-y-3">
                    {/* Header */}
                    <div className="text-center">
                      <div className="text-2xl mb-2">👑</div>
                      <div className="flex items-center justify-center space-x-2">
                        <span className="text-lg">💎</span>
                        <h4 className="text-sm font-bold text-purple-800">Platinum Membership</h4>
                        <span className="text-lg">💎</span>
                      </div>
                      <p className="text-xs font-semibold text-purple-600">One time payment: 25 WLD</p>
                    </div>

                    {/* Benefits */}
                    <div className="space-y-2">
                      <div className="bg-white/50 rounded-lg p-2">
                        <h5 className="text-[9px] font-bold text-gray-800 mb-1">💰 Liquidity Support</h5>
                        <p className="text-[8px] text-gray-700">
                          5 WLD from each Platinum membership goes directly into the KeplerPay liquidity pool
                        </p>
                      </div>

                      <div className="bg-white/50 rounded-lg p-2">
                        <h5 className="text-[9px] font-bold text-gray-800 mb-1">🎁 Monthly Benefit</h5>
                        <p className="text-[8px] text-gray-700">
                          Receive 5,000 KPP directly to your wallet every month
                        </p>
                      </div>

                      <div className="bg-white/50 rounded-lg p-2">
                        <h5 className="text-[9px] font-bold text-gray-800 mb-1">🎲 Raffle</h5>
                        <p className="text-[8px] text-gray-700">
                          Each Platinum Membership payment of 25 WLD = 25 raffle tickets
                        </p>
                      </div>

                      <div className="bg-white/50 rounded-lg p-2">
                        <h5 className="text-[9px] font-bold text-gray-800 mb-1">🔥 Access</h5>
                        <p className="text-[8px] text-gray-700">
                          Direct contact with the KeplerPay team, VIP calls, early access to new features, and exclusive
                          ecosystem perks
                        </p>
                      </div>
                    </div>

                    {/* Get Membership Button */}
                    <Button
                      onClick={handleGetMembership}
                      disabled={membershipLoading || !isConnected}
                      className="w-full px-4 py-2 text-xs font-semibold bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 rounded-lg shadow-lg transition-all duration-300 disabled:opacity-50"
                    >
                      {membershipLoading ? (
                        <div className="flex items-center justify-center space-x-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Processing...</span>
                        </div>
                      ) : (
                        <>
                          <Crown className="w-4 h-4 mr-2" />
                          Get Membership
                        </>
                      )}
                    </Button>

                    {!isConnected && (
                      <p className="text-[7px] text-gray-500 text-center">Connect wallet to purchase membership</p>
                    )}

                    {isConnected && (
                      <p className="text-[7px] text-gray-500 text-center">
                        Sends 25 WLD • Balance: {formatBalance(tokenBalances.WLD || "0")} WLD
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                /* Wallet Content - simplified */
                <>
                  {walletCurrentPage === "main" ? (
                    <>
                      {/* Token Balances */}
                      {isConnected ? (
                        <div className="flex-1 overflow-y-auto space-y-3 mb-4 mt-8">
                          <h3 className="text-xs font-semibold text-gray-900 mb-2">Token Balances</h3>
                          {Object.entries(TOKENS).map(([key, token]) => {
                            return (
                              <div key={key} className="flex items-center justify-between p-2 bg-gray-200 rounded-lg">
                                <div className="flex items-center space-x-2">
                                  <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                                    <Image
                                      src={token.image || "/placeholder.svg"}
                                      alt={token.name}
                                      width={32}
                                      height={32}
                                      className="w-full h-full object-cover rounded-full"
                                      onError={(e) => {
                                        console.error(`❌ Failed to load image for ${token.symbol}:`, token.image)
                                        e.currentTarget.src = "/placeholder.svg?height=32&width=32&text=" + token.symbol
                                      }}
                                    />
                                  </div>
                                  <div>
                                    <div className="text-xs font-medium text-black">{token.symbol}</div>
                                    <div className="text-[10px] text-gray-800">{token.name}</div>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-xs font-medium text-black">
                                    {balanceLoading ? "..." : Number.parseFloat(tokenBalances[key] || "0").toFixed(2)}
                                  </div>
                                  <div className="text-[10px] text-gray-800">{token.symbol}</div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      ) : (
                        <div className="flex-1 flex items-center justify-center">
                          <p className="text-gray-900 text-xs">Connect wallet to see balances</p>
                        </div>
                      )}

                      {/* Wallet Actions */}
                      <div className="flex justify-around w-full mt-auto mb-2">
                        <button
                          onClick={() => handleWalletAction("send")}
                          className="p-2 hover:bg-gray-300 rounded-full transition-colors"
                        >
                          <Send className="w-5 h-5 text-black" />
                        </button>
                        <button
                          onClick={() => handleWalletAction("receive")}
                          className="p-2 hover:bg-gray-300 rounded-full transition-colors"
                        >
                          <ArrowDownToLine className="w-5 h-5 text-black" />
                        </button>
                        <button
                          onClick={() => handleWalletAction("swap")}
                          className="p-2 hover:bg-gray-300 rounded-full transition-colors"
                        >
                          <ArrowUpDown className="w-5 h-5 text-black" />
                        </button>
                        <button
                          onClick={() => handleWalletAction("history")}
                          className="p-2 hover:bg-gray-300 rounded-full transition-colors"
                        >
                          <History className="w-5 h-5 text-black" />
                        </button>
                      </div>
                    </>
                  ) : walletCurrentPage === "send" ? (
                    /* Send Page */
                    <div className="flex-1 flex flex-col items-center justify-start mt-4 space-y-4">
                      <h3 className="text-sm font-semibold text-gray-900">Send Tokens</h3>
                      <div className="w-full">
                        <Input
                          type="text"
                          placeholder="Recipient Address"
                          value={sendAddress}
                          onChange={(e) => setSendAddress(e.target.value)}
                          className="text-xs"
                          style={{ fontSize: "16px" }}
                        />
                      </div>
                      <div className="w-full">
                        <Input
                          type="number"
                          placeholder="Amount"
                          value={sendAmount}
                          onChange={(e) => setSendAmount(e.target.value)}
                          className="text-xs"
                          style={{ fontSize: "16px" }}
                        />
                        {isConnected && (
                          <p className="text-[8px] text-gray-600 mt-1">
                            Balance: {Number.parseFloat(tokenBalances[sendToken] || "0").toFixed(4)}{" "}
                            {TOKENS[sendToken].symbol}
                          </p>
                        )}
                      </div>
                      <select
                        value={sendToken}
                        onChange={(e) => setSendToken(e.target.value as keyof typeof TOKENS)}
                        className="w-full p-2 bg-gray-200 text-xs text-black rounded-lg"
                        style={{ fontSize: "16px" }}
                      >
                        {Object.entries(TOKENS).map(([key, token]) => (
                          <option key={key} value={key}>
                            {token.symbol}
                          </option>
                        ))}
                      </select>
                      <Button
                        onClick={handleSendToken}
                        disabled={sendLoading}
                        className="w-full px-4 py-2 text-xs font-semibold bg-black text-white hover:bg-gray-800 rounded-lg shadow-lg"
                      >
                        {sendLoading ? "Sending..." : "Send"}
                      </Button>
                      <button
                        onClick={() => setWalletCurrentPage("main")}
                        className="text-gray-600 text-xs hover:text-gray-900"
                      >
                        Back to Wallet
                      </button>
                    </div>
                  ) : walletCurrentPage === "receive" ? (
                    /* Receive Page */
                    <div className="flex-1 flex flex-col items-center justify-start mt-4 space-y-4">
                      <h3 className="text-sm font-semibold text-gray-900">Receive Tokens</h3>
                      {walletAddress ? (
                        <>
                          <div className="relative w-full">
                            <Input
                              type="text"
                              value={walletAddress}
                              readOnly
                              className="text-xs"
                              style={{ fontSize: "16px" }}
                            />
                            <button
                              onClick={handleCopyAddress}
                              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-300 rounded-full transition-colors"
                            >
                              {copiedAddress ? (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              ) : (
                                <Copy className="w-4 h-4 text-black" />
                              )}
                            </button>
                          </div>
                          <QrCode className="w-20 h-20 text-black" />
                        </>
                      ) : (
                        <p className="text-gray-900 text-xs">Connect wallet to see address</p>
                      )}
                      <button
                        onClick={() => setWalletCurrentPage("main")}
                        className="text-gray-600 text-xs hover:text-gray-900"
                      >
                        Back to Wallet
                      </button>
                    </div>
                  ) : walletCurrentPage === "swap" ? (
                    /* Swap Page */
                    <div className="flex-1 flex flex-col items-center justify-start mt-4 space-y-4">
                      <h3 className="text-sm font-semibold text-gray-900">Swap Tokens</h3>

                      {/* From Token */}
                      <div className="w-full">
                        <Input
                          type="number"
                          placeholder="Amount"
                          value={swapAmount}
                          onChange={(e) => handleSwapAmountChange(e.target.value)}
                          className="text-xs"
                          style={{ fontSize: "16px" }}
                        />
                        {isConnected && (
                          <div className="flex justify-between items-center mt-1">
                            <p className="text-[8px] text-gray-600">
                              Balance: {formatBalance(tokenBalances[swapFromToken] || "0")}{" "}
                              {TOKENS[swapFromToken].symbol}
                            </p>
                            {balanceValidation && !balanceValidation.hasBalance && (
                              <p className="text-[8px] text-red-600">Insufficient balance</p>
                            )}
                          </div>
                        )}
                      </div>

                      <select
                        value={swapFromToken}
                        onChange={(e) => setSwapFromToken(e.target.value as keyof typeof TOKENS)}
                        className="w-full p-2 bg-gray-200 text-xs text-black rounded-lg"
                        style={{ fontSize: "16px" }}
                      >
                        {Object.entries(TOKENS).map(([key, token]) => (
                          <option key={key} value={key}>
                            {token.symbol}
                          </option>
                        ))}
                      </select>

                      <button
                        onClick={handleSwapDirection}
                        className="p-2 hover:bg-gray-300 rounded-full transition-colors"
                        title="Swap direction"
                      >
                        <ArrowUpDown className="w-5 h-5 text-black" />
                      </button>

                      <select
                        value={swapToToken}
                        onChange={(e) => setSwapToToken(e.target.value as keyof typeof TOKENS)}
                        className="w-full p-2 bg-gray-200 text-xs text-black rounded-lg"
                        style={{ fontSize: "16px" }}
                      >
                        {Object.entries(TOKENS).map(([key, token]) => (
                          <option key={key} value={key}>
                            {token.symbol}
                          </option>
                        ))}
                      </select>

                      {/* To Token Output */}
                      <div className="w-full">
                        <Input
                          type="number"
                          placeholder={swapQuoteLoading ? "Getting quote..." : "Estimated output"}
                          value={swapEstimatedOutput}
                          readOnly
                          className="text-xs"
                          style={{ fontSize: "16px" }}
                        />
                        {swapPriceImpact && Number.parseFloat(swapPriceImpact) > 0 && (
                          <p className="text-[8px] text-yellow-600 mt-1">
                            Price Impact: {Number.parseFloat(swapPriceImpact).toFixed(2)}%
                          </p>
                        )}
                        {swapQuoteError && <p className="text-[8px] text-red-600 mt-1">{swapQuoteError}</p>}
                      </div>

                      <Button
                        onClick={handleSwapTokens}
                        disabled={
                          swapLoading ||
                          !swapQuote ||
                          swapQuoteLoading ||
                          (balanceValidation && !balanceValidation.hasBalance)
                        }
                        className="w-full px-4 py-2 text-xs font-semibold bg-black text-white hover:bg-gray-800 rounded-lg shadow-lg disabled:opacity-50"
                      >
                        {swapLoading
                          ? "Swapping..."
                          : swapQuoteLoading
                            ? "Getting Quote..."
                            : !swapQuote
                              ? "Enter Amount"
                              : balanceValidation && !balanceValidation.hasBalance
                                ? "Insufficient Balance"
                                : "Swap"}
                      </Button>

                      <button
                        onClick={() => setWalletCurrentPage("main")}
                        className="text-gray-600 text-xs hover:text-gray-900"
                      >
                        Back to Wallet
                      </button>
                    </div>
                  ) : walletCurrentPage === "history" ? (
                    /* History Page - REAL BLOCKCHAIN DATA - CORRIGIDO PARA MOSTRAR NOVAS TRANSAÇÕES */
                    <div className="flex-1 flex flex-col items-center justify-start mt-4 space-y-4">
                      {/* Header with refresh button */}
                      <div className="flex items-center justify-between w-full">
                        <h3 className="text-sm font-semibold text-gray-900">Transaction History</h3>
                        <button
                          onClick={() => fetchTransactionHistory(true)}
                          disabled={historyRefreshing}
                          className="p-2 hover:bg-gray-300 rounded-full transition-colors disabled:opacity-50"
                          title="Refresh real blockchain transactions"
                        >
                          <RefreshCw className={`w-4 h-4 text-black ${historyRefreshing ? "animate-spin" : ""}`} />
                        </button>
                      </div>

                      {/* Transaction List - REAL DATA FROM BLOCKCHAIN - CORRIGIDO SCROLL */}
                      <div
                        ref={historyScrollRef}
                        className="w-full flex-1 overflow-y-auto space-y-2 max-h-[300px]"
                        style={{
                          scrollBehavior: "smooth",
                        }}
                      >
                        {historyRefreshing ? (
                          <div className="flex items-center justify-center py-8">
                            <Loader2 className="w-6 h-6 animate-spin text-gray-600" />
                            <span className="ml-2 text-xs text-gray-600">Fetching real transactions...</span>
                          </div>
                        ) : historyTransactions.length === 0 ? (
                          <div className="text-center py-8">
                            <p className="text-gray-600 text-xs">No real transactions found</p>
                            <p className="text-gray-500 text-[10px] mt-1">
                              Make transactions with KPP, TPF, WDD, USDC or WLD to see them here
                            </p>
                          </div>
                        ) : (
                          <>
                            {historyTransactions.map((transaction, index) => (
                              <div
                                key={`${transaction.id}-${index}`}
                                className="flex items-center justify-between p-2 bg-gray-200 rounded-lg min-h-[60px]"
                              >
                                <div className="flex items-center space-x-2">
                                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-300">
                                    {transaction.type === "send" ? (
                                      <Send className="w-3 h-3 text-gray-700" />
                                    ) : (
                                      <ArrowDownToLine className="w-3 h-3 text-gray-700" />
                                    )}
                                  </div>
                                  <div>
                                    <div className="text-xs font-medium text-black">
                                      {transaction.type === "send" ? "Sent" : "Received"}
                                    </div>
                                    <div className="text-[10px] text-gray-800">
                                      {formatTimeAgo(transaction.timestamp)}
                                    </div>
                                    <div className="text-[8px] text-gray-600">
                                      {transaction.hash.slice(0, 10)}...{transaction.hash.slice(-6)}
                                    </div>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-xs font-medium text-black">
                                    {Number.parseFloat(transaction.amount).toFixed(4)} {transaction.tokenSymbol}
                                  </div>
                                  <div className="text-[10px] text-gray-800">
                                    <span className="flex items-center space-x-1 text-green-500">
                                      <CheckCircle className="w-3 h-3" />
                                      <span>Confirmed</span>
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}

                            {/* Load More Button - CORRIGIDO PARA MOSTRAR NOVAS TRANSAÇÕES */}
                            {historyHasMore && (
                              <div className="flex justify-center pt-2 pb-2">
                                <button
                                  onClick={() => fetchTransactionHistory(false)}
                                  disabled={historyLoading}
                                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-black text-xs rounded-lg transition-colors disabled:opacity-50"
                                >
                                  {historyLoading ? (
                                    <div className="flex items-center space-x-2">
                                      <Loader2 className="w-3 h-3 animate-spin" />
                                      <span>Loading more...</span>
                                    </div>
                                  ) : (
                                    "Load More (5)"
                                  )}
                                </button>
                              </div>
                            )}
                          </>
                        )}
                      </div>

                      <button
                        onClick={() => setWalletCurrentPage("main")}
                        className="text-gray-600 text-xs hover:text-gray-900"
                      >
                        Back to Wallet
                      </button>
                    </div>
                  ) : null}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center h-full w-full px-4">
        {!isConnected ? (
          <div className="mt-[350px] w-full max-w-xs text-center">
            <Button
              onClick={handleConnectWallet}
              disabled={connectLoading}
              className="w-full px-6 py-2 text-base font-semibold bg-white text-black hover:bg-gray-200 rounded-full shadow-lg"
            >
              {connectLoading ? "Connecting..." : "Connect Wallet"}
            </Button>
            {connectError && <p className="text-red-500 mt-4">{connectError}</p>}
          </div>
        ) : (
          <>
            <div className="mt-[350px] w-full max-w-xs text-center">
              {nextClaimTimestamp !== null && remainingTime > 0 ? (
                <div className="mt-4 w-full px-3 py-1 text-sm font-semibold bg-gray-700 text-white rounded-full shadow-lg flex flex-col items-center justify-center">
                  <span className="text-sm text-gray-300">{t.airdrop.nextClaimIn}</span>
                  <div className="flex gap-2 text-yellow-400 font-bold text-sm tabular-nums">
                    <span>
                      {timeDisplay.hours}
                      {t.airdrop.hours[0].toLowerCase()}
                    </span>
                    :
                    <span>
                      {timeDisplay.minutes}
                      {t.airdrop.minutes[0].toLowerCase()}
                    </span>
                    :
                    <span>
                      {timeDisplay.seconds}
                      {t.airdrop.seconds[0].toLowerCase()}
                    </span>
                  </div>
                </div>
              ) : (
                <>
                  {!isLoaded ? (
                    <div className="w-full text-center">
                      <p className="text-white text-sm mb-4">Swipe for claim 1 KPP</p>
                      <div
                        className="w-full h-12 bg-gray-800 rounded-full relative cursor-pointer select-none overflow-hidden"
                        onMouseDown={handleMouseDown}
                        onTouchStart={handleTouchStart}
                      >
                        {/* Progress fill */}
                        <div
                          className="h-full bg-yellow-500 rounded-full transition-all duration-100 ease-out"
                          style={{ width: `${loadingProgress}%` }}
                        />

                        {/* Swipe indicator */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <span className="text-sm font-bold text-black mix-blend-difference">Swipe →</span>
                        </div>

                        {/* Drag handle - starts at the beginning */}
                        <div
                          className="absolute top-1 left-1 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-100"
                          style={{
                            transform: `translateX(${loadingProgress * 2.8}px)`,
                            opacity: loadingProgress < 95 ? 1 : 0,
                          }}
                        >
                          <span className="text-xs">→</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Button
                      onClick={handleClaimKPP}
                      disabled={isClaiming}
                      className="mt-4 w-full px-4 py-1.5 text-sm font-semibold bg-yellow-500 text-black hover:bg-yellow-600 rounded-full shadow-lg"
                    >
                      {isClaiming ? t.common.processing : "Claim 1 KPP"}
                    </Button>
                  )}
                </>
              )}
            </div>

            {claimError && <div className="mt-4 text-red-500 text-center">Error: {claimError}</div>}
          </>
        )}
      </div>
      {pathname === "/dashboard" && <BottomNavigation />}
    </div>
  )
}
