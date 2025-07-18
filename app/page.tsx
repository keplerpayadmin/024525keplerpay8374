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
import { Gift, Coins, TrendingUp, LogOut, ExternalLink, Handshake } from "lucide-react"
import Image from "next/image"
import { createPublicClient, http, parseAbi, formatUnits, encodeFunctionData } from "viem"
import { defineChain } from "viem"
import { AnimatedBackground } from "@/components/animated-background"
import { BottomNavigation } from "@/components/bottom-navigation"
import { MiniKit } from "@worldcoin/minikit-js"
import { DebugConsole } from "@/components/debug-console"
import AirdropLoader from "./airdrop-loader"
import { Suspense } from "react"

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
  const [checkedIn, setCheckedIn] = useState(false)
  const [stakingRewards, setStakingRewards] = useState(12.34)
  const [timeLeft, setTimeLeft] = useState(86400) // Padrão 24 horas
  const [activeTab, setActiveTab] = useState("airdrop")
  const [isClaiming, setIsClaiming] = useState(false)
  const [claimError, setClaimError] = useState<string | null>(null)

  // Agora usando a World Chain Mainnet
  const publicClient = createPublicClient({
    chain: worldChainMainnet, // Usando a cadeia World Chain Mainnet
    transport: http(),
  })

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

  const updateCountdown = async () => {
    const lastClaim = await fetchLastClaimTime()
    const currentTime = Math.floor(Date.now() / 1000) // Tempo atual em segundos
    const CLAIM_INTERVAL_SECONDS = 24 * 60 * 60 // 1 dia em segundos

    const nextClaimAvailableTime = lastClaim + CLAIM_INTERVAL_SECONDS

    if (lastClaim === 0 || currentTime >= nextClaimAvailableTime) {
      setTimeLeft(0) // Disponível para reivindicar
      if (timeLeft !== 0) {
        addDebugLog("Claim available. timeLeft set to 0.")
      }
    } else {
      const remaining = nextClaimAvailableTime - currentTime
      setTimeLeft(remaining)
      if (Math.floor(remaining / 60) !== Math.floor(timeLeft / 60)) {
        addDebugLog(`Time left for claim: ${formatTime(remaining)} (${remaining} seconds)`)
      }
    }
  }

  useEffect(() => {
    addDebugLog("MainApp useEffect triggered. Fetching initial data...")
    fetchKPPBalance()
    updateCountdown()

    const interval = setInterval(() => {
      updateCountdown()
    }, 1000) // Atualiza a contagem regressiva a cada segundo

    return () => {
      clearInterval(interval)
      addDebugLog("MainApp useEffect cleanup. Interval cleared.")
    }
  }, [address, addDebugLog, timeLeft])

  // Incremento automático das recompensas de staking (simulado)
  useEffect(() => {
    const rewardTimer = setInterval(() => {
      setStakingRewards((prev) => prev + 0.001)
    }, 5000)
    return () => clearInterval(rewardTimer)
  }, [])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}.${secs.toString().padStart(2, "0")}`
  }

  const handleCheckIn = async () => {
    if (!address) {
      setClaimError("Please connect your wallet first.")
      addDebugLog("Attempted claim without connected wallet.")
      return
    }
    setIsClaiming(true)
    setClaimError(null)
    addDebugLog("Starting claim process...")

    const isButtonDisabled = checkedIn || isClaiming || timeLeft > 0
    addDebugLog(
      `Check-in button disabled state: ${isButtonDisabled} (checkedIn: ${checkedIn}, isClaiming: ${isClaiming}, timeLeft: ${timeLeft})`,
    )

    const lastClaimTimeOnCall = await fetchLastClaimTime()
    const currentTimeOnCall = Math.floor(Date.now() / 1000)
    const nextClaimAvailableTimeOnCall = lastClaimTimeOnCall + 24 * 60 * 60
    addDebugLog(`[Pre-Tx Check] lastClaimTime (from contract): ${lastClaimTimeOnCall}`)
    addDebugLog(`[Pre-Tx Check] currentTime (client): ${currentTimeOnCall}`)
    addDebugLog(`[Pre-Tx Check] nextClaimAvailableAt: ${nextClaimAvailableTimeOnCall}`)
    addDebugLog(`[Pre-Tx Check] Is claim available? ${currentTimeOnCall >= nextClaimAvailableTimeOnCall}`)

    const dailyAirdrop = await fetchDailyAirdropAmount()
    addDebugLog(`[Pre-Tx Check] Daily Airdrop Amount (from contract): ${dailyAirdrop} KPP`)

    try {
      if (typeof window === "undefined" || !MiniKit.isInstalled()) {
        throw new Error("MiniKit is not installed or not available in this browser environment.")
      }
      addDebugLog("MiniKit is installed.")

      if (!MiniKit.commandsAsync || typeof MiniKit.commandsAsync.sendTransaction !== "function") {
        throw new Error(
          "MiniKit.commandsAsync.sendTransaction is not available. MiniKit might not be fully initialized or supported.",
        )
      }
      addDebugLog("MiniKit.commandsAsync.sendTransaction is available.")

      const encodedData = encodeFunctionData({
        abi: AIRDROP_CONTRACT_ABI,
        functionName: "claimAirdrop",
      })

      addDebugLog(`Encoded data for claimAirdrop: ${encodedData}`)
      addDebugLog(`Target contract address: ${AIRDROP_CONTRACT_ADDRESS}`)

      addDebugLog("Calling MiniKit.commandsAsync.sendTransaction...")
      const { finalPayload } = await MiniKit.commandsAsync.sendTransaction({
        transaction: [
          {
            to: AIRDROP_CONTRACT_ADDRESS,
            data: encodedData,
            value: "0x0",
          },
        ],
      })

      if (finalPayload.status === "error") {
        const errorMessage = finalPayload.message || "Transaction failed from MiniKit (unknown reason)."
        addDebugLog(`ERROR: MiniKit transaction failed: ${errorMessage}`)
        console.error("MiniKit transaction error payload:", finalPayload)
        throw new Error(errorMessage)
      }

      addDebugLog(`Transaction sent successfully. Hash: ${finalPayload.transactionHash}`)
      console.log("Transaction sent successfully via MiniKit, hash:", finalPayload.transactionHash)

      setCheckedIn(true)
      addDebugLog("Transaction successful. Updating UI...")
      setTimeout(async () => {
        await fetchKPPBalance()
        await updateCountdown()
        setCheckedIn(false)
        addDebugLog("UI updated after successful claim.")
      }, 2000)
    } catch (error: any) {
      addDebugLog(`CRITICAL CLAIM ERROR: ${error.message}`)
      console.error("Error claiming airdrop:", error)
      setClaimError(error.message || "Failed to claim KPP. Please try again.")
    } finally {
      setIsClaiming(false)
      addDebugLog("Claim process finished.")
    }
  }

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

          {/* KPP Balance Card */}
          <Card className="mb-6 bg-black/40 border-white/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Gift className="h-5 w-5" />
                KPP Tokens
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-400 mb-2">{kppBalance.toFixed(2)} KPP</div>
              {/* Removido: <div className="text-sm text-white/60">Check-in Rewards</div> */}
            </CardContent>
          </Card>

          {/* Content based on active tab */}
          {activeTab === "airdrop" && (
            <Suspense
              fallback={
                <div className="min-h-screen bg-black flex items-center justify-center">
                  <div className="text-white">Loading...</div>
                </div>
              }
            >
              <AirdropLoader />
            </Suspense>
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
