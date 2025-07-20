"use client"

import { useState, useEffect, useCallback } from "react"
import { ArrowLeft, TrendingUp, Gift, Loader2, CheckCircle, RefreshCw, Clock } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { BackgroundEffect } from "@/components/background-effect"
import { BottomNav } from "@/components/bottom-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useTranslations } from "@/lib/i18n"
import {
  getUserStakingInfo,
  getKStakingContractStats,
  claimKStakingRewards,
  type UserStakingInfo,
  type ContractStakingStats,
} from "@/lib/kstakingService"
import { KSTAKING_CONTRACT_ADDRESS } from "@/lib/kstakingContractABI" // Importar o endereço do contrato KStaking

// Configuração do contrato KPP para staking
const KPP_STAKING_CONTRACT = {
  name: "KeplerPay",
  symbol: "KPP",
  address: KSTAKING_CONTRACT_ADDRESS, // Usar o endereço do contrato KStaking existente
  image: "/keplerpay-logo.png", // Usar o logo KeplerPay
}

// Battery Component (mantido do ficheiro fornecido)
function BatteryIndicator({ currentLang }: { currentLang: "en" | "pt" | "es" | "id" }) {
  const [batteryLevel, setBatteryLevel] = useState(0)
  const t = useTranslations().t.kstaking // Usar o hook de tradução existente

  useEffect(() => {
    const interval = setInterval(() => {
      setBatteryLevel((prev) => {
        if (prev >= 100) return 0
        return prev + 2
      })
    }, 100)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col items-center">
      {/* Battery */}
      <div className="relative w-8 h-4 border border-green-400 rounded-sm bg-black/50">
        {/* Battery tip */}
        <div className="absolute -right-1 top-1 w-1 h-2 bg-green-400 rounded-r-sm"></div>
        {/* Battery fill */}
        <div
          className="h-full bg-gradient-to-r from-green-500 to-green-300 rounded-sm transition-all duration-100"
          style={{ width: `${batteryLevel}%` }}
        ></div>
        {/* Battery percentage text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[6px] font-bold text-white drop-shadow-sm">{batteryLevel}%</span>
        </div>
      </div>
      {/* Power Activated text */}
      <div className="text-green-400 text-[8px] font-medium mt-1 text-center">
        {t?.powerActivated || "Power Activated"}
      </div>
    </div>
  )
}

export default function KStakingPage() {
  const router = useRouter()
  const { t, language } = useTranslations() // Obter o idioma também

  const [userAddress, setUserAddress] = useState<string | null>(null)
  const [userStakingInfo, setUserStakingInfo] = useState<UserStakingInfo | null>(null)
  const [contractStats, setContractStats] = useState<ContractStakingStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isClaiming, setIsClaiming] = useState(false)
  const [claimSuccess, setClaimSuccess] = useState<string | null>(null)
  const [claimError, setClaimError] = useState<string | null>(null)
  const [apiError, setApiError] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      try {
        const response = await fetch("/api/auth/session")
        if (response.ok) {
          const data = await response.json()
          if (data.user && data.user.walletAddress) {
            setUserAddress(data.user.walletAddress)
          } else {
            router.push("/") // Redirecionar para login se não estiver autenticado
          }
        } else {
          router.push("/") // Redirecionar para login se a sessão não for válida
        }
      } catch (error) {
        console.error("Error checking authentication:", error)
        router.push("/")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuthAndFetchData()
  }, [router])

  const fetchData = useCallback(async () => {
    if (!userAddress) return

    setIsRefreshing(true)
    setApiError(null)

    try {
      const [userInfoResult, contractStatsResult] = await Promise.all([
        getUserStakingInfo(userAddress),
        getKStakingContractStats(),
      ])

      if (userInfoResult.success && userInfoResult.data) {
        setUserStakingInfo(userInfoResult.data)
      } else {
        setApiError(userInfoResult.error || t.kstaking?.claimError || "Failed to fetch user staking info.")
      }

      if (contractStatsResult.success && contractStatsResult.data) {
        setContractStats(contractStatsResult.data)
      } else {
        setApiError(contractStatsResult.error || t.kstaking?.claimError || "Failed to fetch contract stats.")
      }
    } catch (error) {
      console.error("Error fetching staking data:", error)
      setApiError(error instanceof Error ? error.message : t.kstaking?.claimError || "An unexpected error occurred.")
    } finally {
      setIsRefreshing(false)
    }
  }, [userAddress, t])

  useEffect(() => {
    if (userAddress) {
      fetchData()
      const interval = setInterval(fetchData, 30000) // Atualiza a cada 30 segundos
      return () => clearInterval(interval)
    }
  }, [userAddress, fetchData])

  const handleClaimRewards = async () => {
    if (
      !userAddress ||
      !userStakingInfo?.pendingRewards ||
      Number.parseFloat(userStakingInfo.pendingRewards) <= 0 ||
      isClaiming
    )
      return

    setIsClaiming(true)
    setClaimError(null)
    setClaimSuccess(null)

    try {
      const result = await claimKStakingRewards(userAddress)
      if (result.success) {
        setClaimSuccess(KPP_STAKING_CONTRACT.symbol)
        // Atualizar dados após o claim
        setTimeout(() => {
          fetchData()
          setClaimSuccess(null)
        }, 3000)
      } else {
        let errorMessage = result.error || t.kstaking?.claimError || "Failed to claim rewards."
        if (errorMessage.includes("simulation_failed")) {
          errorMessage = "Transaction simulation failed. You may not have enough tokens or rewards to claim."
        } else if (errorMessage.includes("user_rejected")) {
          errorMessage = "Transaction was rejected by user."
        } else if (errorMessage.includes("No KPP tokens")) {
          errorMessage = "You need KPP tokens in your wallet to claim rewards."
        } else if (errorMessage.includes("No rewards to claim")) {
          errorMessage = "No rewards available to claim at this time."
        } else if (errorMessage.includes("Insufficient reward balance")) {
          errorMessage = "Contract has insufficient reward balance. Please try again later."
        }
        setClaimError(errorMessage)
      }
    } catch (error) {
      console.error("Error claiming rewards:", error)
      setClaimError(
        error instanceof Error ? error.message : t.kstaking?.claimError || "An unexpected error occurred during claim.",
      )
    } finally {
      setIsClaiming(false)
    }
  }

  const formatTimestamp = (timestamp: number) => {
    if (timestamp === 0) return t.kstaking?.notClaimedYet || "Not claimed yet"
    const date = new Date(timestamp * 1000)
    return date.toLocaleString()
  }

  if (isLoading) {
    return (
      <main className="relative flex min-h-screen flex-col items-center justify-center pt-6 pb-20 overflow-hidden">
        <BackgroundEffect />
        <div className="flex flex-col items-center text-white z-10">
          <div className="w-16 h-16 border-4 border-t-blue-500 border-b-blue-700 border-l-transparent border-r-transparent rounded-full animate-spin" />
          <p className="mt-4 text-lg font-medium">{t.history?.loading || "Loading..."}</p>
        </div>
      </main>
    )
  }

  if (!userAddress) {
    return (
      <main className="relative flex min-h-screen flex-col items-center justify-center pt-6 pb-20 overflow-hidden">
        <BackgroundEffect />
        <div className="text-center text-white z-10 p-4">
          <h2 className="text-2xl font-bold mb-4">
            {t.kstaking?.connectWalletToStake || "Connect your wallet to view staking details."}
          </h2>
          <Button onClick={() => router.push("/")}>{t.connectButton?.connect || "Connect Wallet"}</Button>
        </div>
        <BottomNav activeTab="kstaking" />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black relative overflow-hidden flex flex-col items-center pt-4 pb-6">
      <BackgroundEffect /> {/* Usar o componente de fundo existente */}
      {/* Battery Indicator - Top Right */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute top-4 right-4 z-20"
      >
        <BatteryIndicator currentLang={language} />
      </motion.div>
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute top-4 left-4 z-20"
      >
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 px-2 py-1 text-gray-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3 h-3" />
          <span className="text-xs">{t.back || "Back"}</span>
        </button>
      </motion.div>
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-4 relative z-10"
      >
        <h1 className="text-2xl font-bold tracking-tighter flex items-center justify-center">
          <TrendingUp className="w-5 h-5 mr-2 text-purple-400" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-200 via-white to-gray-300">
            {t.kstaking?.title}
          </span>
        </h1>
        <p className="text-gray-400 text-xs mt-1 leading-relaxed px-4">{t.kstaking?.subtitle}</p>
      </motion.div>
      <div className="w-full max-w-sm px-4 relative z-10 space-y-3">
        {/* Success Message */}
        <AnimatePresence>
          {claimSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-green-500/10 border border-green-500/30 rounded-lg p-3"
            >
              <div className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-green-400 text-xs font-medium mb-1">{t.kstaking?.claimSuccess}</p>
                  <p className="text-green-300 text-[10px]">
                    {claimSuccess} {t.kstaking?.claimSuccess}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Message */}
        <AnimatePresence>
          {claimError && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-red-500/10 border border-red-500/30 rounded-lg p-3"
            >
              <div className="flex items-start space-x-2">
                <div className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0">⚠️</div>
                <div>
                  <p className="text-red-400 text-xs font-medium mb-1">{t.kstaking?.claimError}</p>
                  <p className="text-red-300 text-[10px]">{claimError}</p>
                  <button
                    onClick={() => setClaimError(null)}
                    className="mt-1 text-red-400 text-[10px] hover:text-red-300"
                  >
                    {t.kstaking?.dismiss || "Dismiss"}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Staking Card for KPP */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-3"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Image
                src={KPP_STAKING_CONTRACT.image || "/placeholder.svg"}
                alt={KPP_STAKING_CONTRACT.name}
                width={32}
                height={32}
                className="w-8 h-8 rounded-full"
              />
              <div>
                <h3 className="text-white font-medium text-sm">{KPP_STAKING_CONTRACT.symbol}</h3>
                <p className="text-gray-400 text-[10px]">{KPP_STAKING_CONTRACT.name}</p>
              </div>
            </div>

            {/* Claim Button */}
            <button
              onClick={handleClaimRewards}
              disabled={
                isClaiming || !userStakingInfo?.pendingRewards || Number.parseFloat(userStakingInfo.pendingRewards) <= 0
              }
              className={`py-1.5 px-4 rounded-md font-medium text-xs transition-all duration-300 flex items-center justify-center space-x-1 ${
                userStakingInfo?.pendingRewards && Number.parseFloat(userStakingInfo.pendingRewards) > 0
                  ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                  : "bg-gray-600/50 text-gray-400 cursor-not-allowed"
              }`}
            >
              {isClaiming ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span>{t.kstaking?.processingClaim}</span>
                </>
              ) : (
                <>
                  <Gift className="w-3 h-3" />
                  <span>{t.kstaking?.claimRewardsButton}</span>
                </>
              )}
            </button>
          </div>
          <div className="mt-2 text-right text-gray-400 text-[10px]">
            {t.kstaking?.pendingRewards}:{" "}
            <span className="text-white font-medium">
              {userStakingInfo?.pendingRewards
                ? Number.parseFloat(userStakingInfo.pendingRewards).toLocaleString(undefined, {
                    maximumFractionDigits: 4,
                  })
                : "0.00"}{" "}
              KPP
            </span>
          </div>
        </motion.div>

        {/* Additional Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full max-w-md relative z-10"
        >
          <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">{t.kstaking?.yourBalance}</CardTitle>
              <RefreshCw
                className={`h-4 w-4 text-gray-400 cursor-pointer ${isRefreshing ? "animate-spin" : ""}`}
                onClick={fetchData}
              />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {userStakingInfo?.kppBalance ? Number.parseFloat(userStakingInfo.kppBalance).toLocaleString() : "0.00"}{" "}
                KPP
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-md relative z-10"
        >
          <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">{t.kstaking?.lastClaim}</CardTitle>
              <Clock className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">
                {userStakingInfo?.lastClaimTime
                  ? formatTimestamp(userStakingInfo.lastClaimTime)
                  : t.kstaking?.notClaimedYet || "Not claimed yet"}
              </div>
              <p className="text-sm text-gray-400 mt-1">
                {t.kstaking?.totalClaimed}:{" "}
                {userStakingInfo?.totalClaimed
                  ? Number.parseFloat(userStakingInfo.totalClaimed).toLocaleString()
                  : "0.00"}{" "}
                KPP
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="w-full max-w-md relative z-10"
        >
          <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">{t.kstaking?.contractAPY}</CardTitle>
              <TrendingUp className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {contractStats?.currentAPY ? `${contractStats.currentAPY}%` : "N/A"}
              </div>
              <p className="text-sm text-gray-400 mt-1">
                {t.kstaking?.contractBalance}:{" "}
                {contractStats?.contractRewardBalance
                  ? Number.parseFloat(contractStats.contractRewardBalance).toLocaleString()
                  : "0.00"}{" "}
                KPP
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      <BottomNav activeTab="kstaking" />
      {/* API Error Message - Made more prominent */}
      <AnimatePresence>
        {apiError && (
          <motion.div
            initial={{ opacity: 0, y: -50 }} // Start higher
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 p-6 bg-red-900/80 border border-red-500 rounded-lg text-center shadow-xl max-w-xs w-full" // Fixed position, larger, darker background
          >
            <div className="flex flex-col items-center space-y-3">
              <div className="w-8 h-8 text-red-400 flex items-center justify-center text-2xl">⚠️</div>
              <p className="text-red-200 text-sm font-medium">{t.kstaking?.claimError || "Error"}</p>
              <p className="text-red-100 text-xs">{apiError}</p>
              <Button
                onClick={() => setApiError(null)}
                className="mt-3 bg-red-600 hover:bg-red-700 text-white text-xs py-1.5 px-4 rounded-full"
              >
                {t.kstaking?.dismiss || "Dismiss"}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
