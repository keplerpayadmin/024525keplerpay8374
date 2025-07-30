"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Gift, Loader2, ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"
import { MiniKit } from "@worldcoin/minikit-js"
import { useMiniKit } from "../../hooks/use-minikit"
import Image from "next/image"
import { useI18n } from "@/lib/i18n/context"
import { ethers } from "ethers"

// Staking contracts configuration
const STAKING_CONTRACTS = {
  KPP: {
    name: "KeplerPay",
    symbol: "KPP",
    address: "0x15bB53A800D6DCf0A5935850f65233Be62Bb405C",
    image: "/keplerpay-logo.png",
  },
}

// ABI completa do contrato de staking fornecida pelo usuário
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
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
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

export default function FiStakingPage() {
  const { user, isAuthenticated, loading: authLoading } = useMiniKit()
  const { t } = useI18n()
  const [claiming, setClaiming] = useState<string | null>(null)
  const [pendingRewards, setPendingRewards] = useState<string | null>(null)
  const [rewardsLoading, setRewardsLoading] = useState(false)
  const [rewardsError, setRewardsError] = useState<string | null>(null)

  const fetchPendingRewards = async (walletAddress: string) => {
    setRewardsLoading(true)
    setRewardsError(null)
    try {
      const provider = new ethers.JsonRpcProvider(
        process.env.NEXT_PUBLIC_RPC_URL || "https://worldchain-mainnet.g.alchemy.com/public",
      )
      const stakingContract = new ethers.Contract(STAKING_CONTRACTS.KPP.address, STAKING_ABI, provider)
      const rewards = await stakingContract.calculatePendingRewards(walletAddress)
      setPendingRewards(ethers.formatUnits(rewards, 18)) // Assumindo 18 decimais para KPP
    } catch (error) {
      console.error("Error fetching pending rewards:", error)
      setRewardsError("Failed to fetch pending rewards.")
      setPendingRewards("0.00")
    } finally {
      setRewardsLoading(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated && user?.walletAddress) {
      fetchPendingRewards(user.walletAddress)
      // Atualizar recompensas a cada 1 segundo
      const interval = setInterval(() => {
        fetchPendingRewards(user.walletAddress!)
      }, 1000) // A cada 1 segundo
      return () => clearInterval(interval)
    } else {
      setPendingRewards("0.00")
      setRewardsError(null)
    }
  }, [isAuthenticated, user?.walletAddress])

  const handleClaim = async (tokenKey: string) => {
    const contract = STAKING_CONTRACTS[tokenKey as keyof typeof STAKING_CONTRACTS]
    if (!contract.address || !user?.walletAddress) {
      console.error("Wallet not connected or contract address missing.")
      return
    }

    setClaiming(tokenKey)

    try {
      console.log(`🎁 Claiming ${contract.symbol} rewards...`)
      console.log(`Contract address: ${contract.address}`)
      console.log(`User wallet: ${user.walletAddress}`)

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
        // Após o sucesso, buscar as recompensas novamente para atualizar o display
        if (user?.walletAddress) {
          fetchPendingRewards(user.walletAddress)
        }
      }
    } catch (error) {
      console.error(`❌ ${contract.symbol} claim failed:`, error)
    } finally {
      setClaiming(null)
    }
  }

  const kppContract = STAKING_CONTRACTS.KPP
  const isClaimingKPP = claiming === "KPP"

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <style jsx>{`
        @keyframes glow-light {
          0%, 100% { box-shadow: 0 0 10px rgba(255, 255, 255, 0.5), 0 0 20px rgba(255, 255, 255, 0.3); } /* Brilho branco */
          50% { box-shadow: 0 0 20px rgba(255, 255, 255, 0.8), 0 0 40px rgba(255, 255, 255, 0.6); } /* Brilho branco */
        }
      `}</style>

      {/* Back Button */}
      <div className="absolute top-4 left-4 z-50">
        <Link
          href="/dashboard" // Link de volta para o dashboard
          className="flex items-center gap-2 px-4 py-2 bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-full text-white hover:bg-gray-800/80 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">{t.common.back}</span>
        </Link>
      </div>

      <div className="flex flex-col items-center justify-center flex-grow">
        {/* KPP Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center mb-8"
        >
          <Image
            src={kppContract.image || "/placeholder.svg"}
            alt={kppContract.name}
            width={128}
            height={128}
            className="rounded-full border-4 border-white/50 shadow-lg shadow-white/30 animate-[glow-light_2s_ease-in-out_infinite]" // Brilho branco
          />
          <h3 className="text-white font-bold text-2xl mt-4">{kppContract.symbol}</h3>
          <p className="text-gray-400 text-sm">{kppContract.name}</p>
        </motion.div>

        {/* Pending Rewards Display */}
        {authLoading ? (
          <p className="text-gray-400 text-sm mb-4">Loading wallet status...</p>
        ) : !isAuthenticated ? (
          <p className="text-gray-400 text-sm mb-4">{t.staking.connectWalletFirst}</p>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-center mb-6"
          >
            <p className="text-gray-400 text-sm font-medium">{t.staking.pendingRewards}</p>
            {rewardsLoading ? (
              <p className="text-white text-xl font-bold mt-1">Loading...</p>
            ) : rewardsError ? (
              <p className="text-red-500 text-xl font-bold mt-1">{pendingRewards}</p>
            ) : (
              <p className="text-white text-xl font-bold mt-1">
                {pendingRewards || "0.00"} {kppContract.symbol}
              </p>
            )}
          </motion.div>
        )}

        {/* Claim Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-xs"
        >
          <button
            onClick={() => handleClaim("KPP")}
            disabled={isClaimingKPP || !isAuthenticated} // Removido rewardsLoading daqui
            className={`w-full py-3 rounded-lg font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-2 ${
              isClaimingKPP || !isAuthenticated
                ? "bg-gray-600/50 text-gray-400 cursor-not-allowed"
                : "bg-white text-black hover:bg-gray-200 shadow-lg shadow-white/30" // Botão branco, texto preto, brilho branco
            }`}
          >
            {isClaimingKPP ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>{t.staking.claiming}</span>
              </>
            ) : (
              <>
                <Gift className="w-5 h-5" />
                <span>Claim Pending Rewards</span>
              </>
            )}
          </button>
        </motion.div>
      </div>

      {/* Developed By @PulseCode */}
      <div className="text-gray-500 text-sm mt-16">
        Developed By <span className="text-gray-400 font-medium">@PulseCode</span>
      </div>
    </div>
  )
}
