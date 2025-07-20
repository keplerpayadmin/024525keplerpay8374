"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { BackgroundEffect } from "@/components/background-effect"
import { BottomNav } from "@/components/bottom-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw, Coins, Clock, TrendingUp } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTranslations } from "@/lib/i18n"
import {
  getUserStakingInfo,
  getKStakingContractStats,
  claimKStakingRewards,
  type UserStakingInfo,
  type ContractStakingStats,
} from "@/lib/kstakingService"

export default function KStakingPage() {
  const [userAddress, setUserAddress] = useState<string | null>(null)
  const [userStakingInfo, setUserStakingInfo] = useState<UserStakingInfo | null>(null)
  const [contractStats, setContractStats] = useState<ContractStakingStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isClaiming, setIsClaiming] = useState(false)
  const [claimSuccess, setClaimSuccess] = useState(false)
  const [claimError, setClaimError] = useState<string | null>(null)
  const [apiError, setApiError] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const { t } = useTranslations()
  const router = useRouter()

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

  const fetchData = async () => {
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
  }

  useEffect(() => {
    if (userAddress) {
      fetchData()
      const interval = setInterval(fetchData, 30000) // Atualiza a cada 30 segundos
      return () => clearInterval(interval)
    }
  }, [userAddress])

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
    setClaimSuccess(false)

    try {
      const result = await claimKStakingRewards(userAddress)
      if (result.success) {
        setClaimSuccess(true)
        // Atualizar dados após o claim
        setTimeout(() => {
          fetchData()
          setClaimSuccess(false)
        }, 3000)
      } else {
        setClaimError(result.error || t.kstaking?.claimError || "Failed to claim rewards.")
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
    <main className="relative flex min-h-screen flex-col items-center pt-6 pb-20 overflow-hidden">
      <BackgroundEffect />

      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-6 relative z-10"
      >
        <h1 className="text-3xl font-bold tracking-tighter">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-200 via-white to-gray-300">
            {t.kstaking?.title}
          </span>
        </h1>
        <p className="text-gray-400 text-sm mt-1">{t.kstaking?.subtitle}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="w-full max-w-md px-4 mb-4 relative z-10"
      >
        <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">{t.kstaking?.yourBalance}</CardTitle>
            <button
              onClick={fetchData}
              disabled={isRefreshing}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            </button>
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
        className="w-full max-w-md px-4 mb-4 relative z-10"
      >
        <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">{t.kstaking?.pendingRewards}</CardTitle>
            <Coins className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userStakingInfo?.pendingRewards
                ? Number.parseFloat(userStakingInfo.pendingRewards).toLocaleString()
                : "0.00"}{" "}
              KPP
            </div>
            <p className="text-xs text-gray-400 mt-1">
              {t.kstaking?.rewardsPerDay}:{" "}
              {userStakingInfo?.rewardsPerDay
                ? Number.parseFloat(userStakingInfo.rewardsPerDay).toLocaleString(undefined, {
                    maximumFractionDigits: 4,
                  })
                : "0.00"}{" "}
              KPP
            </p>
            <p className="text-xs text-gray-400">
              {t.kstaking?.rewardsPerYear}:{" "}
              {userStakingInfo?.rewardsPerYear
                ? Number.parseFloat(userStakingInfo.rewardsPerYear).toLocaleString(undefined, {
                    maximumFractionDigits: 4,
                  })
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
        className="w-full max-w-md px-4 mb-4 relative z-10"
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
        transition={{ duration: 0.5, delay: 0.4 }}
        className="w-full max-w-md px-4 mb-6 relative z-10"
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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mt-4 relative z-10"
      >
        <Button
          onClick={handleClaimRewards}
          disabled={
            isClaiming || !userStakingInfo?.pendingRewards || Number.parseFloat(userStakingInfo.pendingRewards) <= 0
          }
          className={`w-56 py-3 px-5 rounded-full ${
            userStakingInfo?.pendingRewards && Number.parseFloat(userStakingInfo.pendingRewards) > 0
              ? "bg-gradient-to-b from-gray-300 to-gray-400 text-gray-800"
              : "bg-gradient-to-b from-gray-700 to-gray-800 text-gray-400"
          } font-bold text-xs shadow-lg border border-gray-300/30 relative overflow-hidden hover:scale-105 active:scale-95 transition-transform`}
        >
          <div
            className={`absolute inset-0 bg-gradient-to-b ${
              userStakingInfo?.pendingRewards && Number.parseFloat(userStakingInfo.pendingRewards) > 0
                ? "from-white/30"
                : "from-white/10"
            } to-transparent opacity-70`}
          />
          <div
            className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent ${
              userStakingInfo?.pendingRewards && Number.parseFloat(userStakingInfo.pendingRewards) > 0
                ? "animate-shine"
                : ""
            }`}
          />
          <div className="relative flex items-center justify-center gap-2">
            {isClaiming ? (
              <>
                <div className="w-4 h-4 border-2 border-t-gray-800 border-gray-400 rounded-full animate-spin" />
                <span>{t.kstaking?.processingClaim}</span>
              </>
            ) : (
              <>
                <Coins className="w-4 h-4" />
                {t.kstaking?.claimRewardsButton}
              </>
            )}
          </div>
        </Button>
      </motion.div>

      {claimSuccess && (
        <div className="mt-4 p-2 bg-green-900/30 border border-green-500/30 rounded-lg text-center relative z-10">
          <div className="flex items-center justify-center">
            <Coins className="mr-1 text-green-400" size={16} />
            <span className="font-medium text-green-400">{t.kstaking?.claimSuccess}</span>
          </div>
        </div>
      )}

      {claimError && (
        <div className="mt-4 p-2 bg-red-900/30 border border-red-500/30 rounded-lg text-center relative z-10">
          <span className="text-red-400">{claimError}</span>
        </div>
      )}

      {apiError && (
        <div className="mt-4 p-2 bg-red-900/30 border border-red-500/30 rounded-lg text-center relative z-10">
          <span className="text-red-400">{apiError}</span>
        </div>
      )}

      <BottomNav activeTab="kstaking" />
    </main>
  )
}
