"use client"

import { useState, useEffect, useCallback } from "react"
import { LandingScreen } from "@/components/landing-screen"
import { MiniKitProvider } from "@/minikit-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Gift, Coins, TrendingUp, LogOut, ExternalLink, Handshake, Clock, Flame } from "lucide-react"
import Image from "next/image"
import { createPublicClient, http, parseAbi, formatUnits, encodeFunctionData } from "viem"
import { defineChain } from "viem"
import { AnimatedBackground } from "@/components/animated-background"
import { BottomNavigation } from "@/components/bottom-navigation"
import { MiniKit } from "@worldcoin/minikit-js"
import { DebugConsole } from "@/components/debug-console"
import { motion, AnimatePresence } from "framer-motion" // Importar para animações

// Definir a cadeia World Chain Mainnet
const worldChainMainnet = defineChain({
  id: 480, // 0x1e0
  name: "World Chain Mainnet",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: {
      http: ["https://worldchain-mainnet.g.alchemy.com/public"],
    },
  },
  blockExplorers: {
    default: {
      name: "Worldscan",
      url: "https://worldscan.org",
    },
  },
  contracts: {
    // Adicione aqui os endereços de contratos importantes da World Chain, se necessário
    // Ex: multicall3: { address: '0x...', blockCreated: 0 },
  },
})

// ABI for contract001kpp
const AIRDROP_CONTRACT_ABI = parseAbi([
  "function claimAirdrop() external",
  "function lastClaimTime(address) view returns (uint256)",
  "function dailyAirdropAmount() view returns (uint256)",
  "event AirdropClaimed(address indexed user, uint256 amount)",
])

// ABI for IKPPToken (simplified for balanceOf and transfer)
const KPP_TOKEN_ABI = parseAbi([
  "function balanceOf(address account) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
])

// --- PLACEHOLDER CONTRACT ADDRESSES ---
// Substitua pelos seus endereços de contrato reais
const KPP_TOKEN_ADDRESS = "0x5fa570E9c8514cdFaD81DB6ce0A327D55251fBD4" as `0x${string}`
const AIRDROP_CONTRACT_ADDRESS = "0x8125d4634A0A58ad6bAFbb5d78Da3b735019E237" as `0x${string}`
// --- FIM PLACEHOLDER ---

function formatTime(seconds: number) {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  return {
    hours: hours.toString().padStart(2, "0"),
    minutes: minutes.toString().padStart(2, "0"),
    seconds: secs.toString().padStart(2, "0"),
  }
}

function MainApp({
  address,
  onLogout,
  addDebugLog, // Receber addDebugLog como prop
}: {
  address: `0x${string}`
  onLogout: () => void
  addDebugLog: (message: string) => void
}) {
  const [kppBalance, setKppBalance] = useState(0)
  const [balance, setBalance] = useState(1250.75) // Saldo WLD apenas para staking
  const [stakedAmount, setStakedAmount] = useState(500)
  const [stakeInput, setStakeInput] = useState("")
  const [checkedIn, setCheckedIn] = useState(false) // Manter para compatibilidade, mas a lógica será do airdrop
  const [stakingRewards, setStakingRewards] = useState(12.34)
  const [activeTab, setActiveTab] = useState("airdrop")

  // Estados e funções do Airdrop (movidos de airdrop-client.tsx)
  const [canClaim, setCanClaim] = useState(false)
  const [isClaiming, setIsClaiming] = useState(false)
  const [claimSuccess, setClaimSuccess] = useState(false)
  const [claimError, setClaimError] = useState<string | null>(null)
  const [countdownTime, setCountdownTime] = useState(24 * 60 * 60) // 24 horas em segundos
  const [isInCooldown, setIsInCooldown] = useState(false)
  const [dailyStreak, setDailyStreak] = useState(0) // Novo estado para a sequência diária

  // Agora usando a World Chain Mainnet
  const publicClient = createPublicClient({
    chain: worldChainMainnet, // Usando a cadeia World Chain Mainnet
    transport: http(),
  })

  // Função auxiliar para obter a string da data de hoje (YYYY-MM-DD)
  const getTodayDateString = () => {
    const today = new Date()
    return today.toISOString().split("T")[0]
  }

  const fetchKPPBalance = async () => {
    if (!address) {
      addDebugLog("KPP Balance: No address provided.")
      setKppBalance(0)
      return
    }

    try {
      addDebugLog(`Fetching KPP balance for address: ${address}...`)
      const kppAmount = await publicClient.readContract({
        address: KPP_TOKEN_ADDRESS,
        abi: KPP_TOKEN_ABI,
        functionName: "balanceOf",
        args: [address],
      })
      const formattedKpp = Number(formatUnits(kppAmount, 18))
      setKppBalance(formattedKpp)
      addDebugLog(`KPP Balance: ${formattedKpp.toFixed(2)} KPP (raw: ${kppAmount.toString()})`)
    } catch (error: any) {
      addDebugLog(`Error fetching KPP balance: ${error.message}`)
      console.error("Error fetching KPP balance:", error)
      setKppBalance(0)
    }
  }

  const fetchLastClaimTime = async () => {
    if (!address) {
      addDebugLog("Last Claim Time: No address provided.")
      return 0
    }

    try {
      const lastTime = await publicClient.readContract({
        address: AIRDROP_CONTRACT_ADDRESS,
        abi: AIRDROP_CONTRACT_ABI,
        functionName: "lastClaimTime",
        args: [address],
      })
      return Number(lastTime)
    } catch (error: any) {
      addDebugLog(`Error fetching last claim time: ${error.message}`)
      console.error("Error fetching last claim time:", error)
      return 0
    }
  }

  const fetchDailyAirdropAmount = async () => {
    try {
      const amount = await publicClient.readContract({
        address: AIRDROP_CONTRACT_ADDRESS,
        abi: AIRDROP_CONTRACT_ABI,
        functionName: "dailyAirdropAmount",
      })
      return Number(formatUnits(amount, 18))
    } catch (error: any) {
      addDebugLog(`Error fetching daily airdrop amount: ${error.message}`)
      console.error("Error fetching daily airdrop amount:", error)
      return 0 // Retorna 0 em caso de erro
    }
  }

  // Função de cooldown e streak (movida de airdrop-client.tsx)
  const startCooldown = () => {
    const now = Date.now()
    localStorage.setItem("airdrop_last_claim", now.toString())
    localStorage.setItem("last_claim_date", getTodayDateString()) // Armazena a data de hoje
    setCountdownTime(24 * 60 * 60) // 24 horas
    setIsInCooldown(true)
    setCanClaim(false) // Desabilita o botão de reivindicação
    addDebugLog("Claim successful. Starting 24h cooldown.")

    // Incrementa a sequência diária
    setDailyStreak((prev) => {
      const next = prev + 1
      localStorage.setItem("daily_streak", next.toString())
      return next
    })
    addDebugLog(`Daily streak incremented to: ${dailyStreak + 1}`)
  }

  // Lógica de verificação de cooldown e streak na montagem (movida de airdrop-client.tsx)
  useEffect(() => {
    addDebugLog("MainApp useEffect: Checking cooldown and streak status.")
    const checkStatus = async () => {
      // Lógica da sequência (streak)
      const storedStreak = localStorage.getItem("daily_streak")
      const lastClaimDate = localStorage.getItem("last_claim_date")
      const todayDate = getTodayDateString()

      if (storedStreak) {
        setDailyStreak(Number.parseInt(storedStreak))
      }

      if (lastClaimDate && lastClaimDate !== todayDate) {
        // Se a última reivindicação não foi hoje, verifica se foi ontem para continuar a sequência
        const yesterday = new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split("T")[0]
        if (lastClaimDate !== yesterday) {
          // Se não foi ontem, reinicia a sequência
          setDailyStreak(0)
          localStorage.setItem("daily_streak", "0")
          addDebugLog("Daily streak reset due to missed day.")
        }
      }

      // Lógica do cooldown
      const lastClaimTime = localStorage.getItem("airdrop_last_claim")
      if (lastClaimTime) {
        const lastClaimTimestamp = Number.parseInt(lastClaimTime)
        const now = Date.now()
        const timeDiff = now - lastClaimTimestamp
        const cooldownPeriod = 24 * 60 * 60 * 1000 // 24 horas em milissegundos

        if (timeDiff < cooldownPeriod) {
          // Ainda em cooldown
          const remainingTime = Math.ceil((cooldownPeriod - timeDiff) / 1000)
          setCountdownTime(remainingTime)
          setIsInCooldown(true)
          setCanClaim(false) // Não pode reivindicar se estiver em cooldown
          addDebugLog(
            `Cooldown active. Remaining: ${formatTime(remainingTime).hours}:${formatTime(remainingTime).minutes}:${formatTime(remainingTime).seconds}`,
          )
        } else {
          // Cooldown expirou, limpa o localStorage
          localStorage.removeItem("airdrop_last_claim")
          setIsInCooldown(false)
          setCanClaim(true) // Pode reivindicar se o cooldown expirou
          addDebugLog("Cooldown expired. Claim available.")
        }
      } else {
        setCanClaim(true) // Pode reivindicar se não houver reivindicação anterior
        addDebugLog("No previous claim found in localStorage. Claim available.")
      }
    }

    checkStatus()
  }, [addDebugLog])

  // Efeito de contagem regressiva (movido de airdrop-client.tsx)
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isInCooldown && countdownTime > 0) {
      interval = setInterval(() => {
        setCountdownTime((prev) => {
          if (prev <= 1) {
            // Contagem regressiva finalizada
            addDebugLog("Countdown finished. Resetting airdrop state.")
            setIsInCooldown(false)
            setCanClaim(true)
            localStorage.removeItem("airdrop_last_claim")
            return 0 // Define como 0, pois está disponível
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => {
      clearInterval(interval)
      addDebugLog("Countdown interval cleared.")
    }
  }, [isInCooldown, countdownTime, addDebugLog])

  const formatTimeDisplay = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return {
      hours: hours.toString().padStart(2, "0"),
      minutes: minutes.toString().padStart(2, "0"),
      seconds: secs.toString().padStart(2, "0"),
    }
  }

  // Função handleClaim (movida de airdrop-client.tsx)
  const handleClaim = async () => {
    if (!canClaim || isClaiming) {
      addDebugLog("Claim button disabled or already claiming. Ignoring click.")
      return
    }

    try {
      setIsClaiming(true)
      setClaimError(null)
      setClaimSuccess(false)

      addDebugLog("Starting claim process for KPP token.")

      if (!MiniKit.isInstalled()) {
        throw new Error("MiniKit is not installed.")
      }
      addDebugLog("MiniKit is installed.")

      const contractAddress = "0x8125d4634A0A58ad6bAFbb5d78Da3b735019E237" as `0x${string}`
      addDebugLog(`Using Airdrop Contract Address: ${contractAddress}`)

      const encodedData = encodeFunctionData({
        abi: AIRDROP_CONTRACT_ABI,
        functionName: "claimAirdrop",
      })

      addDebugLog("Calling MiniKit.commandsAsync.sendTransaction for claimAirdrop.")
      const { finalPayload } = await MiniKit.commandsAsync.sendTransaction({
        transaction: [
          {
            to: contractAddress,
            data: encodedData, // Dados codificados para claimAirdrop()
            value: "0x0", // Revertido para "0x0"
          },
        ],
      })

      addDebugLog(`MiniKit transaction response: ${JSON.stringify(finalPayload)}`)

      if (finalPayload.status === "error") {
        addDebugLog(`ERROR: MiniKit transaction failed: ${finalPayload.message || "Unknown error from MiniKit."}`)
        const errorMessage = finalPayload.message || "Failed to claim airdrop."

        if (
          errorMessage.includes("Wait 24h") ||
          errorMessage.includes("24h between claims") ||
          errorMessage.includes("already claimed")
        ) {
          addDebugLog("Transaction failed due to cooldown. Starting cooldown.")
          setTimeout(() => {
            setClaimSuccess(false)
            startCooldown()
          }, 2000)
          setClaimError("You have already claimed today. Please wait 24 hours.")
        } else {
          setClaimError("Transaction failed. Please check debug console for details.")
        }
        return
      }

      addDebugLog(`Airdrop claimed successfully. Transaction Hash: ${finalPayload.transactionHash}`)

      setClaimSuccess(true)
      setCanClaim(false) // Desabilita o botão de reivindicação imediatamente

      setTimeout(() => {
        setClaimSuccess(false)
        startCooldown() // Inicia o cooldown após um pequeno atraso para visibilidade da mensagem de sucesso
        fetchKPPBalance() // Atualiza o saldo KPP após o claim
      }, 3000)
    } catch (error: any) {
      addDebugLog(`CRITICAL CLAIM ERROR: ${error.message}`)
      const errorMessage = error instanceof Error ? error.message : "Unknown error"

      if (
        errorMessage.includes("Wait 24h") ||
        errorMessage.includes("24h between claims") ||
        errorMessage.includes("already claimed")
      ) {
        addDebugLog("Claim failed due to cooldown. Starting cooldown.")
        setTimeout(() => {
          setClaimSuccess(false)
          startCooldown()
        }, 2000)
        setClaimError("You have already claimed today. Please wait 24 hours.")
      } else {
        setClaimError("Failed to claim KPP. Please try again.")
      }
    } finally {
      setIsClaiming(false)
      addDebugLog("Claim process finished.")
    }
  }

  // Incremento automático das recompensas de staking (simulado)
  useEffect(() => {
    const rewardTimer = setInterval(() => {
      setStakingRewards((prev) => prev + 0.001)
    }, 5000)
    return () => clearInterval(rewardTimer)
  }, [])

  // Efeito para buscar o saldo KPP e o tempo de cooldown inicial
  useEffect(() => {
    addDebugLog("MainApp useEffect triggered. Fetching initial data...")
    fetchKPPBalance()
    // A lógica de cooldown e streak já está no useEffect de checkStatus
  }, [address, addDebugLog])

  const handleStake = () => {
    const amount = Number.parseFloat(stakeInput)
    if (amount > 0 && amount <= balance) {
      setBalance((prev) => prev - amount)
      setStakedAmount((prev) => prev + amount)
      setStakeInput("")
      addDebugLog(`Staked ${amount} WLD.`)
    } else {
      addDebugLog(`Failed to stake: Invalid amount or insufficient balance.`)
    }
  }

  const handleUnstake = () => {
    const amount = Number.parseFloat(stakeInput)
    if (amount > 0 && amount <= stakedAmount) {
      setStakedAmount((prev) => prev - amount)
      setBalance((prev) => prev + amount)
      setStakeInput("")
      addDebugLog(`Unstaked ${amount} WLD.`)
    } else {
      addDebugLog(`Failed to unstake: Invalid amount or insufficient staked amount.`)
    }
  }

  const handleClaimRewards = () => {
    setBalance((prev) => prev + stakingRewards)
    setStakingRewards(0)
    addDebugLog(`Claimed ${stakingRewards.toFixed(3)} WLD rewards.`)
  }

  const handleDisconnect = async () => {
    try {
      addDebugLog("Attempting to disconnect MiniKit...")
      if (typeof window !== "undefined" && MiniKit.isInstalled() && typeof MiniKit.disconnect === "function") {
        await MiniKit.disconnect()
        addDebugLog("MiniKit disconnected.")
      }
      onLogout()
      addDebugLog("Logged out successfully.")
    } catch (error: any) {
      addDebugLog(`Failed to disconnect MiniKit: ${error.message}`)
      console.error("Failed to disconnect MiniKit:", error)
    }
  }

  const timeDisplay = formatTimeDisplay(countdownTime)

  return (
    <div className="relative min-h-screen overflow-hidden">
      <AnimatedBackground />
      <div className="relative z-10 min-h-screen pb-24">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <Image
              src="/images/keplerpay-logo-light.png"
              alt="KeplerPay Logo"
              width={60}
              height={60}
              className="drop-shadow-lg"
            />
            <Button
              onClick={handleDisconnect}
              variant="outline"
              size="sm"
              className="border-white/20 text-white hover:bg-white/10 bg-black/20 backdrop-blur-sm"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Disconnect
            </Button>
          </div>

          {/* KPP Balance Card (visível em todas as abas) */}
          <Card className="mb-6 bg-black/40 border-white/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Gift className="h-5 w-5" />
                KPP Tokens
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-400 mb-2">{kppBalance.toFixed(2)} KPP</div>
            </CardContent>
          </Card>

          {/* Content based on active tab */}
          {activeTab === "airdrop" && (
            <div className="flex-1 flex flex-col items-center justify-center relative z-10 text-center px-4">
              {/* Daily Streak Display */}
              <AnimatePresence>
                {dailyStreak > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="mb-6 p-3 bg-purple-900/30 border border-purple-500/30 rounded-lg"
                  >
                    <div className="flex items-center justify-center gap-3">
                      <Flame className="w-5 h-5 text-purple-400" />
                      <span className="text-purple-400 font-medium">
                        Daily Streak: {dailyStreak} day{dailyStreak !== 1 ? "s" : ""}!
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Botão de Check-in */}
              <AnimatePresence>
                {!isInCooldown && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="relative z-10 mb-8" // Adicionado mb-8 para espaçamento
                  >
                    <button
                      className={`w-56 py-3 px-5 rounded-full ${
                        canClaim && !isClaiming
                          ? "bg-gradient-to-b from-gray-300 to-gray-400 text-gray-800 hover:from-gray-200 hover:to-gray-300"
                          : "bg-gradient-to-b from-gray-700 to-gray-800 text-gray-400"
                      } font-bold text-sm shadow-lg border border-gray-300/30 relative overflow-hidden hover:scale-105 active:scale-95 transition-all duration-200`}
                      onClick={handleClaim}
                      disabled={!canClaim || isClaiming}
                    >
                      <div
                        className={`absolute inset-0 bg-gradient-to-b ${canClaim && !isClaiming ? "from-white/30" : "from-white/10"} to-transparent opacity-70`}
                      />
                      <div className="relative flex items-center justify-center gap-2">
                        {isClaiming ? (
                          <>
                            <div className="w-4 h-4 border-2 border-t-gray-800 border-gray-400 rounded-full animate-spin" />
                            <span>Processing...</span>
                          </>
                        ) : (
                          <>
                            <span>Check-in</span>
                          </>
                        )}
                      </div>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Temporizador de Contagem Regressiva - Mostra se estiver em cooldown */}
              <AnimatePresence>
                {isInCooldown && (
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.8 }}
                    className="relative z-10" // Removido mb-8, pois já está abaixo do botão
                  >
                    <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 shadow-2xl">
                      <div className="flex items-center justify-center gap-3 mb-4">
                        <Clock className="w-5 h-5 text-cyan-400" />
                        <span className="text-cyan-400 font-medium text-sm">Next check-in in:</span>
                      </div>

                      <div className="flex items-center justify-center gap-4">
                        {/* Horas */}
                        <div className="text-center">
                          <motion.div
                            className="text-3xl font-bold text-white tabular-nums"
                            animate={{
                              textShadow: [
                                "0 0 10px rgba(255,255,255,0.5)",
                                "0 0 20px rgba(255,255,255,0.8)",
                                "0 0 10px rgba(255,255,255,0.5)",
                              ],
                            }}
                            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                          >
                            {timeDisplay.hours}
                          </motion.div>
                          <div className="text-xs text-gray-400 uppercase tracking-wider">Hours</div>
                        </div>

                        <div className="text-2xl text-white font-bold">:</div>

                        {/* Minutos */}
                        <div className="text-center">
                          <motion.div
                            className="text-3xl font-bold text-white tabular-nums"
                            animate={{
                              textShadow: [
                                "0 0 10px rgba(255,255,255,0.5)",
                                "0 0 20px rgba(255,255,255,0.8)",
                                "0 0 10px rgba(255,255,255,0.5)",
                              ],
                            }}
                            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 0.5 }}
                          >
                            {timeDisplay.minutes}
                          </motion.div>
                          <div className="text-xs text-gray-400 uppercase tracking-wider">Minutes</div>
                        </div>

                        <div className="text-2xl text-white font-bold">:</div>

                        {/* Segundos */}
                        <div className="text-center">
                          <motion.div
                            className="text-3xl font-bold text-white tabular-nums"
                            animate={{
                              textShadow: [
                                "0 0 10px rgba(255,255,255,0.5)",
                                "0 0 20px rgba(255,255,255,0.8)",
                                "0 0 10px rgba(255,255,255,0.5)",
                              ],
                            }}
                            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 1 }}
                          >
                            {timeDisplay.seconds}
                          </motion.div>
                          <div className="text-xs text-gray-400 uppercase tracking-wider">Seconds</div>
                        </div>
                      </div>

                      {/* Borda animada */}
                      <div className="absolute inset-0 rounded-2xl border border-cyan-400/30 animate-pulse" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Mensagens de Sucesso/Erro */}
              <AnimatePresence>
                {claimSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-4 p-3 bg-green-900/30 border border-green-500/30 rounded-lg text-center relative z-10"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Coins className="text-green-400" size={16} />
                      <span className="font-medium text-green-400">Claim Successful!</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {claimError && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-4 p-3 bg-red-900/30 border border-red-500/30 rounded-lg text-center relative z-10"
                  >
                    <span className="text-red-400">{claimError}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {activeTab === "staking" && (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {/* Staking Stats */}
                <Card className="bg-black/40 border-white/20 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <Coins className="h-5 w-5" />
                      Active Staking
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="text-2xl font-bold text-white">{stakedAmount.toFixed(2)} WLD</div>
                      <div className="text-sm text-white/60">Total staked</div>
                    </div>
                    <Separator className="bg-white/20" />
                    <div className="flex justify-between">
                      <span className="text-white/60">APY</span>
                      <span className="text-green-400 font-semibold">8.5%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Lock period</span>
                      <span className="text-white">Flexible</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Rewards */}
                <Card className="bg-black/40 border-white/20 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <TrendingUp className="h-5 w-5" />
                      Rewards
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="text-2xl font-bold text-green-400">{stakingRewards.toFixed(3)} WLD</div>
                      <div className="text-sm text-white/60">Accumulated rewards</div>
                    </div>
                    <Button
                      onClick={handleClaimRewards}
                      variant="outline"
                      className="w-full border-green-500 text-green-400 hover:bg-green-500/10 bg-transparent"
                      disabled={stakingRewards < 0.001}
                    >
                      <Coins className="mr-2 h-4 w-4" />
                      Claim Rewards
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Staking Actions */}
              <Card className="bg-black/40 border-white/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Manage Staking</CardTitle>
                  <CardDescription className="text-white/60">Stake or unstake your WLD tokens</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount" className="text-white">
                      Amount
                    </Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="0.00"
                      value={stakeInput}
                      onChange={(e) => setStakeInput(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/40 backdrop-blur-sm"
                    />
                    <div className="text-sm text-white/60">
                      Available: {balance.toFixed(2)} WLD | Staked: {stakedAmount.toFixed(2)} WLD
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      onClick={handleStake}
                      className="bg-blue-600 hover:bg-blue-700"
                      disabled={
                        !stakeInput || Number.parseFloat(stakeInput) <= 0 || Number.parseFloat(stakeInput) > balance
                      }
                    >
                      Stake
                    </Button>
                    <Button
                      onClick={handleUnstake}
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                      disabled={
                        !stakeInput ||
                        Number.parseFloat(stakeInput) <= 0 ||
                        Number.parseFloat(stakeInput) > stakedAmount
                      }
                    >
                      Unstake
                    </Button>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setStakeInput((balance * 0.25).toString())}
                      className="text-white/60 hover:text-white hover:bg-white/10"
                    >
                      25%
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setStakeInput((balance * 0.5).toString())}
                      className="text-white/60 hover:text-white hover:bg-white/10"
                    >
                      50%
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setStakeInput((balance * 0.75).toString())}
                      className="text-white/60 hover:text-white hover:bg-white/10"
                    >
                      75%
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setStakeInput(balance.toString())}
                      className="text-white/60 hover:text-white hover:bg-white/10"
                    >
                      MAX
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "partnerships" && (
            <div className="space-y-4">
              <Card className="bg-black/40 border-white/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Handshake className="h-5 w-5" />
                    Our Partners
                  </CardTitle>
                  <CardDescription className="text-white/60">
                    Companies and projects that support our ecosystem
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* TPulseFi Partner */}
                    <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10">
                      <div className="flex-shrink-0">
                        <Image
                          src="/images/tpulsefi-logo.png"
                          alt="TPulseFi Logo"
                          width={48}
                          height={48}
                          className="rounded-lg"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold text-white">TPulseFi</h3>
                          <Badge variant="outline" className="border-blue-400/50 text-blue-400 text-xs">
                            Development Partner
                          </Badge>
                        </div>
                        <p className="text-sm text-white/70 mb-3">
                          This partner was responsible for helping with the development of our application
                        </p>
                        <Button
                          onClick={() =>
                            window.open(
                              "https://worldcoin.org/mini-app?app_id=app_a3a55e132983350c67923dd57dc22c5e&app_mode=mini-app",
                              "_blank",
                            )
                          }
                          variant="outline"
                          size="sm"
                          className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                        >
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Visit Partner
                        </Button>
                      </div>
                    </div>

                    {/* Coming Soon */}
                    <div className="text-center py-8">
                      <div className="text-white/40 mb-2">
                        <Handshake className="h-12 w-12 mx-auto mb-3" />
                      </div>
                      <h3 className="text-lg font-medium text-white/60 mb-2">More Partners Coming Soon</h3>
                      <p className="text-sm text-white/40">
                        We're actively building partnerships to expand our ecosystem
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Partnership Benefits */}
              <Card className="bg-black/40 border-white/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Partnership Benefits</CardTitle>
                  <CardDescription className="text-white/60">What our partners bring to the ecosystem</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="text-white font-medium">Technical Expertise</h4>
                        <p className="text-sm text-white/60">Advanced development and blockchain integration</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="text-white font-medium">Ecosystem Growth</h4>
                        <p className="text-sm text-white/60">Expanding reach and user adoption</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="text-white font-medium">Innovation</h4>
                        <p className="text-sm text-white/60">Bringing new features and capabilities</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}

export default function WorldcoinAppWrapper() {
  const [debugLogs, setDebugLogs] = useState<string[]>([])

  const addDebugLog = useCallback((message: string) => {
    setDebugLogs((prevLogs) => {
      const newLogs = [...prevLogs, `${new Date().toLocaleTimeString()}: ${message}`]
      return newLogs.slice(-50)
    })
  }, [])

  const clearDebugLogs = useCallback(() => {
    setDebugLogs([])
  }, [])

  return (
    <MiniKitProvider addDebugLog={addDebugLog}>
      <WorldcoinAppContent addDebugLog={addDebugLog} clearDebugLogs={clearDebugLogs} debugLogs={debugLogs} />
    </MiniKitProvider>
  )
}

function WorldcoinAppContent({
  addDebugLog,
  clearDebugLogs,
  debugLogs,
}: {
  addDebugLog: (message: string) => void
  clearDebugLogs: () => void
  debugLogs: string[]
}) {
  const [isConnected, setIsConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState<`0x${string}` | undefined>(undefined)
  const [isLoadingSession, setIsLoadingSession] = useState(true)

  useEffect(() => {
    addDebugLog("WorldcoinAppContent useEffect triggered. Checking session...")
    const checkSession = async () => {
      try {
        const res = await fetch("/api/auth/session")
        const data = await res.json()
        if (data.authenticated && data.user?.walletAddress) {
          setIsConnected(true)
          setWalletAddress(data.user.walletAddress as `0x${string}`)
          addDebugLog(`Session found. Wallet address: ${data.user.walletAddress}`)
        } else {
          setIsConnected(false)
          setWalletAddress(undefined)
          addDebugLog("No active session found.")
        }
      } catch (error: any) {
        addDebugLog(`Error checking session: ${error.message}`)
        console.error("Error checking session:", error)
        setIsConnected(false)
        setWalletAddress(undefined)
      } finally {
        setIsLoadingSession(false)
        addDebugLog("Finished checking session.")
      }
    }
    checkSession()

    if (typeof window !== "undefined" && MiniKit.isInstalled() && typeof MiniKit.on === "function") {
      addDebugLog("MiniKit.on listeners registered for session changes.")
      const handleSessionChange = (session: any) => {
        if (session && session.address) {
          setIsConnected(true)
          setWalletAddress(session.address as `0x${string}`)
          addDebugLog(`MiniKit session_changed: Connected to ${session.address}`)
        } else {
          setIsConnected(false)
          setWalletAddress(undefined)
          addDebugLog("MiniKit session_changed: Disconnected or no address.")
        }
      }
      const handleDisconnected = () => {
        setIsConnected(false)
        setWalletAddress(undefined)
        addDebugLog("MiniKit disconnected event received.")
      }

      MiniKit.on("session_changed", handleSessionChange)
      MiniKit.on("disconnected", handleDisconnected)
    } else {
      addDebugLog("MiniKit.on not available or MiniKit not installed. Skipping session change listeners.")
    }
  }, [addDebugLog])

  const handleLoginSuccess = useCallback(
    (address: `0x${string}`) => {
      setIsConnected(true)
      setWalletAddress(address)
      addDebugLog(`Login successful. Wallet address: ${address}`)
    },
    [addDebugLog],
  )

  const handleLogout = useCallback(async () => {
    try {
      addDebugLog("Attempting to logout...")
      const res = await fetch("/api/auth/logout", { method: "POST" })
      if (res.ok) {
        setIsConnected(false)
        setWalletAddress(undefined)
        addDebugLog("Logout successful.")
      } else {
        const errorText = await res.text()
        addDebugLog(`Failed to logout: ${errorText}`)
        console.error("Failed to logout:", errorText)
      }
    } catch (error: any) {
      addDebugLog(`Error during logout: ${error.message}`)
      console.error("Error during logout:", error)
    }
  }, [addDebugLog])

  if (isLoadingSession) {
    addDebugLog("App is loading session...")
    return (
      <div className="relative min-h-screen overflow-hidden flex items-center justify-center">
        <AnimatedBackground />
        <div className="relative z-10 text-white text-xl flex items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mr-3"></div>
          Loading app...
        </div>
        <DebugConsole logs={debugLogs} onClear={clearDebugLogs} />
      </div>
    )
  }

  return (
    <>
      {!isConnected || !walletAddress ? (
        <LandingScreen onLoginSuccess={handleLoginSuccess} />
      ) : (
        <MainApp address={walletAddress} onLogout={handleLogout} addDebugLog={addDebugLog} />
      )}
      <DebugConsole logs={debugLogs} onClear={clearDebugLogs} />
    </>
  )
}
