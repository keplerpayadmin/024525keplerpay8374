"use client"

import { Button } from "@/components/ui/button"

import { useState, useEffect, useCallback } from "react"
import { ArrowLeft, TrendingUp, Gift, Loader2, CheckCircle, Clock } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { useMiniKit } from "@/hooks/use-minikit"
import { TransactionEffect } from "@/components/transaction-effects"
import { MiniKit } from "@worldcoin/minikit-js"
import { ethers } from "ethers"
import { STAKING_CONTRACTS, SOFT_STAKING_ABI } from "@/lib/constants/staking-contracts"
import { useTranslations } from "@/lib/i18n"
import Image from "next/image"
import { getRobustProvider } from "@/lib/utils/ethers-utils"
import { BottomNav } from "@/components/bottom-nav" // Importar BottomNav
import { BackgroundEffect } from "@/components/background-effect" // Importar BackgroundEffect

interface StakingInfo {
  pendingRewards: string
  canClaim: boolean
}

export default function FiStakingPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading: isAuthLoading } = useMiniKit()
  const { t } = useTranslations()

  const [stakingData, setStakingData] = useState<Record<string, StakingInfo>>({})
  const [loading, setLoading] = useState(true)
  const [claiming, setClaiming] = useState<string | null>(null)
  const [claimSuccess, setClaimSuccess] = useState<string | null>(null)
  const [claimError, setClaimError] = useState<string | null>(null)
  const [apiError, setApiError] = useState<string | null>(null)

  const [showClaimEffect, setShowClaimEffect] = useState(false)

  const loadStakingData = useCallback(async () => {
    if (!user?.walletAddress) {
      console.log("FiStaking: No wallet address, skipping data load.")
      setLoading(false)
      return
    }

    setLoading(true)
    setApiError(null)

    try {
      console.log("FiStaking: Attempting to get robust RPC provider...")
      const provider = await getRobustProvider()
      console.log("FiStaking: Robust RPC provider obtained.")

      const newStakingData: Record<string, StakingInfo> = {}

      for (const [key, contract] of Object.entries(STAKING_CONTRACTS)) {
        console.log(`FiStaking: Processing contract ${contract.symbol} at address ${contract.address || "N/A"}`)

        if (!contract.address) {
          console.log(`FiStaking: ${contract.symbol} has no contract address, setting default staking info.`)
          newStakingData[key] = {
            pendingRewards: "0",
            canClaim: false,
          }
          continue
        }

        try {
          const code = await provider.getCode(contract.address)
          if (code === "0x") {
            console.warn(`FiStaking: Contract code not found for ${contract.symbol} at ${contract.address}. Skipping.`)
            newStakingData[key] = {
              pendingRewards: "0",
              canClaim: false,
            }
            continue
          }
          console.log(`FiStaking: Contract code found for ${contract.symbol}.`)

          const stakingContract = new ethers.Contract(contract.address, SOFT_STAKING_ABI, provider)
          console.log(`FiStaking: Fetching pending rewards for ${contract.symbol} for user ${user.walletAddress}...`)
          const pendingRewards = await stakingContract.calculatePendingRewards(user.walletAddress)
          console.log(`FiStaking: Raw pending rewards for ${contract.symbol}: ${pendingRewards.toString()}`)

          const formattedPendingRewards = ethers.formatUnits(pendingRewards, 18)
          const canClaim = Number.parseFloat(formattedPendingRewards) > 0

          newStakingData[key] = {
            pendingRewards: formattedPendingRewards,
            canClaim: canClaim,
          }
          console.log(`FiStaking: ${contract.symbol} staking data loaded:`, newStakingData[key])
        } catch (error) {
          console.error(`FiStaking: Error loading ${contract.symbol} staking data:`, error)
          setApiError(
            `Failed to load ${contract.symbol} data: ${error instanceof Error ? error.message : String(error)}`,
          )
          newStakingData[key] = {
            pendingRewards: "0",
            canClaim: false,
          }
        }
      }

      setStakingData(newStakingData)
    } catch (error) {
      console.error("FiStaking: Error in loadStakingData (outer catch):", error)
      setApiError(error instanceof Error ? error.message : t.common?.unexpectedError || "An unexpected error occurred.")
    } finally {
      setLoading(false)
    }
  }, [user, t.common?.unexpectedError])

  useEffect(() => {
    if (!isAuthLoading && isAuthenticated && user?.walletAddress) {
      loadStakingData()
      const interval = setInterval(loadStakingData, 30000)
      return () => clearInterval(interval)
    } else if (!isAuthLoading && !isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, user, isAuthLoading, loadStakingData, router])

  const handleClaim = async (tokenKey: string) => {
    const contract = STAKING_CONTRACTS[tokenKey as keyof typeof STAKING_CONTRACTS]
    if (!contract.address || !user?.walletAddress) return

    setClaiming(tokenKey)
    setClaimError(null)
    setApiError(null)

    try {
      console.log(`FiStaking: 🎁 Claiming ${contract.symbol} rewards...`)

      if (!MiniKit.isInstalled()) {
        throw new Error("MiniKit not available. Please use World App.")
      }

      console.log("FiStaking: Calling MiniKit.commandsAsync.sendTransaction...")
      const { finalPayload } = await MiniKit.commandsAsync.sendTransaction({
        transaction: [
          {
            address: contract.address,
            abi: SOFT_STAKING_ABI,
            functionName: "claimRewards",
            args: [],
          },
        ],
      })

      console.log("FiStaking: MiniKit transaction final payload:", finalPayload)

      if (finalPayload.status === "error") {
        throw new Error(
          `Transaction failed: ${finalPayload.errorMessage || finalPayload.message || t.common?.unexpectedError || "Unknown error"}`,
        )
      }

      if (finalPayload.status === "success") {
        console.log(`FiStaking: ✅ ${contract.symbol} rewards claimed successfully!`)

        setShowClaimEffect(true)
        setClaimSuccess(tokenKey)

        setTimeout(() => {
          loadStakingData()
          setShowClaimEffect(false)
          setClaimSuccess(null)
        }, 3000)
      }
    } catch (error) {
      console.error(`FiStaking: ❌ ${contract.symbol} claim failed:`, error)
      let errorMessage = t.fistaking?.claimFailed || "Failed to claim rewards."

      if (error instanceof Error) {
        errorMessage = error.message
      }

      if (errorMessage.includes("simulation_failed")) {
        errorMessage = "Transaction simulation failed. You may not have enough tokens or rewards to claim."
      } else if (errorMessage.includes("user_rejected")) {
        errorMessage = "Transaction was rejected by user."
      } else if (errorMessage.includes("insufficient funds")) {
        errorMessage = "Insufficient funds for transaction (check gas or token balance)."
      }

      setClaimError(errorMessage)
    } finally {
      setClaiming(null)
    }
  }

  const formatAmount = (amount: string) => {
    const num = Number.parseFloat(amount)
    if (isNaN(num)) return "0.00"
    if (num < 0.0001 && num !== 0) return num.toFixed(8)
    if (num < 1 && num !== 0) return num.toFixed(4)
    return num.toLocaleString(undefined, { maximumFractionDigits: 4 })
  }

  if (isAuthLoading || loading) {
    return (
      <main className="relative flex min-h-screen flex-col items-center justify-center pt-6 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-black/80" />
        <div className="flex flex-col items-center text-white z-10">
          <Loader2 className="w-16 h-16 text-cyan-400 animate-spin" />
          <p className="mt-4 text-lg font-medium">{t.history?.loading || "Loading..."}</p>
        </div>
      </main>
    )
  }

  if (!isAuthenticated) {
    return (
      <main className="relative flex min-h-screen flex-col items-center justify-center pt-6 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-black/80" />
        <div className="text-center text-white z-10 p-4">
          <h2 className="text-2xl font-bold mb-4">
            {t.fistaking?.connectWalletToStake || "Connect your wallet to view staking details."}
          </h2>
          <Button onClick={() => router.push("/")}>{t.connectButton?.connect || "Connect Wallet"}</Button>
        </div>
        <BottomNav activeTab="fistaking" />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black relative overflow-hidden flex flex-col items-center pt-4 pb-6">
      <BackgroundEffect />

      <TransactionEffect
        isVisible={showClaimEffect}
        type="claim"
        message={t.fistaking?.claimSuccess || "Rewards Claimed!"}
        onComplete={() => setShowClaimEffect(false)}
      />

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute top-6 left-4 z-20"
      >
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 px-3 py-2 text-gray-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">{t.common?.back || "Back"}</span>
        </button>
      </motion.div>

      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-6 relative z-10"
      >
        <h1 className="text-3xl font-bold tracking-tighter flex items-center justify-center">
          <TrendingUp className="w-6 h-6 mr-2 text-purple-400" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-200 via-white to-gray-300">
            {t.fistaking?.title || "FiStaking"}
          </span>
        </h1>
        <p className="text-gray-400 text-sm mt-1 leading-relaxed">
          {t.fistaking?.subtitle || "Stake your tokens and earn passive rewards."}
          <br />
          {t.fistaking?.description || "The more you stake, the more you earn!"}
        </p>
      </motion.div>

      <div className="w-full max-w-md px-4 relative z-10 space-y-4">
        <AnimatePresence>
          {claimSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-green-500/10 border border-green-500/30 rounded-lg p-4"
            >
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-green-400 text-sm font-medium mb-1">{t.fistaking?.claimSuccess}</p>
                  <p className="text-green-300 text-xs">
                    {t.fistaking?.rewardsClaimedSuccess?.replace(
                      "{token}",
                      STAKING_CONTRACTS[claimSuccess as keyof typeof STAKING_CONTRACTS]?.symbol || "",
                    ) || `Rewards claimed for ${claimSuccess}!`}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {claimError && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-red-500/10 border border-red-500/30 rounded-lg p-4"
            >
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0">⚠️</div>
                <div>
                  <p className="text-red-400 text-sm font-medium mb-1">{t.fistaking?.claimFailed || "Claim Failed"}</p>
                  <p className="text-red-300 text-xs">{claimError}</p>
                  <button onClick={() => setClaimError(null)} className="mt-2 text-red-400 text-xs hover:text-red-300">
                    {t.fistaking?.dismiss || "Dismiss"}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {apiError && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-red-500/10 border border-red-500/30 rounded-lg p-4"
            >
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0">⚠️</div>
                <div>
                  <p className="text-red-400 text-sm font-medium mb-1">{t.common?.error || "Error"}</p>
                  <p className="text-red-300 text-xs">{apiError}</p>
                  <button onClick={() => setApiError(null)} className="mt-2 text-red-400 text-xs hover:text-red-300">
                    {t.fistaking?.dismiss || "Dismiss"}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {Object.entries(STAKING_CONTRACTS).map(([key, contract], index) => {
          const data = stakingData[key]
          const isClaimingThis = claiming === key
          const hasRewards = data && Number.parseFloat(data.pendingRewards) > 0

          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Image
                    src={contract.image || "/placeholder.svg"}
                    alt={contract.name}
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <h3 className="text-white font-medium text-lg">{contract.symbol}</h3>
                    {data && (
                      <p className="text-gray-400 text-xs">
                        {t.fistaking?.pendingRewards || "Pending Rewards"}: {formatAmount(data.pendingRewards)}{" "}
                        {contract.symbol}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleClaim(key)}
                  disabled={!contract.address || !data?.canClaim || isClaimingThis || !hasRewards}
                  className={`py-2 px-6 rounded-lg font-medium text-sm transition-all duration-300 flex items-center justify-center space-x-2 ${
                    !contract.address
                      ? "bg-gray-600/50 text-gray-400 cursor-not-allowed"
                      : data?.canClaim && hasRewards
                        ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                        : "bg-gray-600/50 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {isClaimingThis ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : !contract.address ? (
                    <Clock className="w-4 h-4" />
                  ) : (
                    <Gift className="w-4 h-4" />
                  )}
                  <span>
                    {isClaimingThis
                      ? t.fistaking?.claiming || "Claiming..."
                      : !contract.address
                        ? t.common?.comingSoon || "Coming Soon"
                        : t.fistaking?.claim || "Claim"}
                  </span>
                </button>
              </div>
            </motion.div>
          )
        })}
      </div>
      <BottomNav activeTab="fistaking" />
    </main>
  )
}
