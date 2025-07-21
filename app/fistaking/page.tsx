"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Gift, Loader2, CheckCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { MiniKit } from "@worldcoin/minikit-js"
import { useMiniKit } from "../../hooks/use-minikit"
import Image from "next/image"

// Supported languages
const SUPPORTED_LANGUAGES = ["en", "pt", "es", "id"] as const
type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number]

// Translations
const translations = {
  en: {
    title: "FiStaking", // This will be removed in JSX
    subtitle: "Passive earnings in KPP", // Updated subtitle
    back: "Back",
    claim: "Claim",
    claiming: "Claiming...",
    soon: "Soon",
    claimSuccess: "Claim Successful!",
    claimFailed: "Claim Failed",
    connectWalletFirst: "Connect your wallet first",
    pendingRewards: "Pending Rewards",
    dismiss: "Dismiss",
    powerActivated: "Power Activated",
    // rewardsPerSecond: "Rewards per second", // Removed
  },
  pt: {
    title: "FiStaking", // This will be removed in JSX
    subtitle: "Ganhos passivos em KPP", // Updated subtitle
    back: "Voltar",
    claim: "Reclamar",
    claiming: "Reclamando...",
    soon: "Em Breve",
    claimSuccess: "Reclamação Bem-sucedida!",
    claimFailed: "Reclamação Falhou",
    connectWalletFirst: "Conecte sua carteira primeiro",
    pendingRewards: "Recompensas Pendentes",
    dismiss: "Dispensar",
    powerActivated: "Energia Ativada",
    // rewardsPerSecond: "Recompensas por segundo", // Removed
  },
  es: {
    title: "FiStaking", // This will be removed in JSX
    subtitle: "Ganancias pasivas en KPP", // Updated subtitle
    back: "Volver",
    claim: "Reclamar",
    claiming: "Reclamando...",
    soon: "Pronto",
    claimSuccess: "¡Reclamación Exitosa!",
    claimFailed: "Reclamación Falló",
    connectWalletFirst: "Conecta tu billetera primero",
    pendingRewards: "Recompensas Pendientes",
    dismiss: "Descartar",
    powerActivated: "Energía Activada",
    // rewardsPerSecond: "Recompensas por segundo", // Removed
  },
  id: {
    title: "FiStaking", // This will be removed in JSX
    subtitle: "Penghasilan pasif di KPP", // Updated subtitle
    back: "Kembali",
    claim: "Klaim",
    claiming: "Mengklaim...",
    soon: "Segera",
    claimSuccess: "Klaim Berhasil!",
    claimFailed: "Klaim Gagal",
    connectWalletFirst: "Hubungkan dompet Anda terlebih dahulu",
    pendingRewards: "Hadiah Tertunda",
    dismiss: "Tutup",
    powerActivated: "Daya Diaktifkan",
    // rewardsPerSecond: "Hadiah per detik", // Removed
  },
}

// Staking contracts configuration
const STAKING_CONTRACTS = {
  KPP: {
    name: "KeplerPay",
    symbol: "KPP",
    address: "0x15bB53A800D6DCf0A5935850f65233Be62Bb405C",
    image: "/images/keplerpay-logo.png",
  },
}

// Standard ABI for all contracts (including RCC)
const STAKING_ABI = [
  {
    inputs: [
      { internalType: "address", name: "_tpfToken", type: "address" },
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
      { indexed: false, internalType: "uint256", name: "tpfBalance", type: "uint256" },
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
      { internalType: "uint256", name: "tpfBalance", type: "uint256" },
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
      { internalType: "address", name: "tpfTokenAddress", type: "address" },
      { internalType: "address", name: "rewardTokenAddress", type: "address" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_user", type: "address" }],
    name: "getUserInfo",
    outputs: [
      { internalType: "uint256", name: "tpfBalance", type: "uint256" },
      { internalType: "uint256", name: "pendingRewards", type: "uint256" },
      { internalType: "uint256", name: "lastClaimTime", type: "uint256" },
      { internalType: "uint256", name: "totalClaimed", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "uint256" }],
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
    inputs: [],
    name: "tpfToken",
    outputs: [{ internalType: "contract IERC20", name: "", type: "address" }],
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

interface StakingInfo {
  pendingRewards: string
  canClaim: boolean
}

// Removed BatteryIndicator component

export default function FiStakingPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useMiniKit()
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>("en")
  const [claiming, setClaiming] = useState<string | null>(null)
  const [claimSuccess, setClaimSuccess] = useState<string | null>(null)
  const [claimError, setClaimError] = useState<string | null>(null)

  // Load saved language
  useEffect(() => {
    const savedLanguage = localStorage.getItem("preferred-language") as SupportedLanguage
    if (savedLanguage && SUPPORTED_LANGUAGES.includes(savedLanguage)) {
      setCurrentLang(savedLanguage)
    }
  }, [])

  // Get translations for current language
  const t = translations[currentLang]

  const handleClaim = async (tokenKey: string) => {
    const contract = STAKING_CONTRACTS[tokenKey as keyof typeof STAKING_CONTRACTS]
    if (!contract.address || !user?.walletAddress) return

    setClaiming(tokenKey)
    setClaimError(null)

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
        throw new Error(`Transaction failed: ${finalPayload.message || "Unknown error"}`)
      }

      if (finalPayload.status === "success") {
        console.log(`✅ ${contract.symbol} rewards claimed successfully!`)
        setClaimSuccess(tokenKey)

        // Reset success message after 3 seconds
        setTimeout(() => {
          setClaimSuccess(null)
        }, 3000)
      }
    } catch (error) {
      console.error(`❌ ${contract.symbol} claim failed:`, error)
      let errorMessage = t.claimFailed

      if (error instanceof Error) {
        errorMessage = error.message
      }

      if (errorMessage.includes("simulation_failed")) {
        errorMessage = "Transaction simulation failed. You may not have enough tokens or rewards to claim."
      } else if (errorMessage.includes("user_rejected")) {
        errorMessage = "Transaction was rejected by user."
      } else if (errorMessage.includes("No TPF tokens")) {
        errorMessage = "You need TPF tokens in your wallet to claim rewards."
      } else if (errorMessage.includes("No rewards to claim")) {
        errorMessage = "No rewards available to claim at this time."
      } else if (errorMessage.includes("Insufficient reward balance")) {
        errorMessage = "Contract has insufficient reward balance. Please try again later."
      }

      setClaimError(errorMessage)
    } finally {
      setClaiming(null)
    }
  }

  const kppContract = STAKING_CONTRACTS.KPP
  const isClaimingKPP = claiming === "KPP"

  return (
    <main className="min-h-screen relative overflow-hidden flex flex-col items-center pt-4 pb-6 bg-gray-900">
      {/* Moving Light Lines Background (from presentation.tsx) */}
      <div className="absolute inset-0 bg-gray-900">
        {/* Horizontal Moving Lines */}
        {[...Array(12)].map((_, i) => (
          <div
            key={`h-line-${i}`}
            className="absolute h-px bg-gradient-to-r from-transparent via-white/60 to-transparent animate-pulse"
            style={{
              top: `${8 + i * 8}%`,
              left: "-100%",
              width: "200%",
              animation: `moveRight 4s linear infinite`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes moveRight {
          0% {
            transform: translateX(-100%);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateX(100vw);
            opacity: 0;
          }
        }

        @keyframes glow-light {
          0%, 100% { box-shadow: 0 0 10px rgba(59, 130, 246, 0.5), 0 0 20px rgba(34, 211, 238, 0.3); }
          50% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.8), 0 0 40px rgba(34, 211, 238, 0.6); }
        }
      `}</style>

      {/* Removed Battery Indicator */}

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
          <span className="text-xs">{t.back}</span>
        </button>
      </motion.div>

      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-4 relative z-10"
      >
        {/* Removed h1 title */}
        <p className="text-gray-400 text-xs mt-1 leading-relaxed px-4">{t.subtitle}</p>
      </motion.div>

      <div className="w-full max-w-sm px-4 relative z-10 space-y-3 flex flex-col items-center justify-center flex-grow">
        {/* Success Message */}
        <AnimatePresence>
          {claimSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 w-full"
            >
              <div className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-green-400 text-xs font-medium mb-1">{t.claimSuccess}</p>
                  <p className="text-green-300 text-[10px]">
                    {STAKING_CONTRACTS[claimSuccess as keyof typeof STAKING_CONTRACTS]?.symbol} rewards claimed
                    successfully
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
              className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 w-full"
            >
              <div className="flex items-start space-x-2">
                <div className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0">⚠️</div>
                <div>
                  <p className="text-red-400 text-xs font-medium mb-1">{t.claimFailed}</p>
                  <p className="text-red-300 text-[10px]">{claimError}</p>
                  <button
                    onClick={() => setClaimError(null)}
                    className="mt-1 text-red-400 text-[10px] hover:text-red-300"
                  >
                    {t.dismiss}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!isAuthenticated ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-center w-full"
          >
            <p className="text-blue-400 text-xs">{t.connectWalletFirst}</p>
          </motion.div>
        ) : (
          <>
            {/* KPP Logo in the middle with light effect */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col items-center justify-center my-8"
            >
              <Image
                src={kppContract.image || "/placeholder.svg"}
                alt={kppContract.name}
                width={128}
                height={128}
                className="rounded-full border-4 border-cyan-400/50 shadow-lg shadow-cyan-500/30 animate-[glow-light_2s_ease-in-out_infinite]" // Added glow-light animation
              />
              <h3 className="text-white font-bold text-2xl mt-4">{kppContract.symbol}</h3>
              <p className="text-gray-400 text-sm">{kppContract.name}</p>
            </motion.div>

            {/* APY Display */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col items-center justify-center my-4 p-2 bg-gray-800/50 border border-gray-700/50 rounded-lg w-full max-w-[250px]"
            >
              <p className="text-gray-400 text-xs font-medium mb-1">APY</p>
              <p className="text-xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-400">
                12%
              </p>
            </motion.div>

            {/* Claim Button below the logo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="w-full mt-8"
            >
              <button
                onClick={() => handleClaim("KPP")}
                disabled={isClaimingKPP} // Disabled state simplified
                className={`w-full py-3 rounded-lg font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-2 ${
                  isClaimingKPP
                    ? "bg-gray-600/50 text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg shadow-green-500/30"
                }`}
              >
                {isClaimingKPP ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>{t.claiming}</span>
                  </>
                ) : (
                  <>
                    <Gift className="w-5 h-5" />
                    <span>
                      {t.claim} {kppContract.symbol}
                    </span>
                  </>
                )}
              </button>
            </motion.div>
          </>
        )}
      </div>
    </main>
  )
}
