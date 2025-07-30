"use client"

import { KeplerSphere } from "@/components/kepler-sphere"
import { Button } from "@/components/ui/button"
import { useState, useEffect, useRef } from "react"
import { MiniKit } from "@worldcoin/minikit-js"
import Image from "next/image"
import { ethers } from "ethers"
import { AIRDROP_CONTRACT_ABI, AIRDROP_CONTRACT_ADDRESS } from "@/lib/airdropContractABI"
import { BottomNavigation } from "@/components/bottom-navigation"
import { useI18n } from "@/lib/i18n/context"

// ABI mínima para a função balanceOf de um token ERC-20
const KPP_ABI = [
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function",
  },
] as const

// Endereço do contrato KPP
const KPP_CONTRACT_ADDRESS = "0x5fa570E9c8514cdFaD81DB6ce0A327D55251fBD4"

export default function DashboardPage() {
  const { t } = useI18n()

  const [isConnected, setIsConnected] = useState(false)
  const [connectLoading, setConnectLoading] = useState(false)
  const [connectError, setConnectError] = useState<string | null>(null)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)

  const [kppBalance, setKppBalance] = useState<string | null>(null)
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

  const fetchKPPBalance = async (address: string) => {
    setBalanceLoading(true)
    setBalanceError(null)
    try {
      const provider = new ethers.JsonRpcProvider(
        process.env.NEXT_PUBLIC_RPC_URL || "https://worldchain-mainnet.g.alchemy.com/public",
      )
      const kppContract = new ethers.Contract(KPP_CONTRACT_ADDRESS, KPP_ABI, provider)
      const balance = await kppContract.balanceOf(address)
      setKppBalance(ethers.formatUnits(balance, 18))
    } catch (error) {
      console.error("Erro ao buscar saldo KPP:", error)
      setBalanceError("Failed to fetch KPP balance.")
      setKppBalance("N/A")
    } finally {
      setBalanceLoading(false)
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
      fetchKPPBalance(finalPayload.address)
      console.log("Wallet connected and session established!")
    } catch (error) {
      console.error("Erro ao conectar carteira:", error)
      setConnectError(error instanceof Error ? error.message : "An unknown error occurred during wallet connection.")
    } finally {
      setConnectLoading(false)
    }
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
        setTimeout(() => fetchKPPBalance(walletAddress), 2000)
      }

      // Não resetar loadingProgress, isLoaded, etc. aqui, o countdown fará isso.
    } catch (error) {
      console.error("Error claiming KPP:", error)
      setClaimError(error instanceof Error ? error.message : "An unknown error occurred during claim.")
    } finally {
      setIsClaiming(false)
    }
  }

  const timeDisplay = formatTime(remainingTime)

  // Determine if the sphere should be animating fast
  // It should animate fast if progress is 100% OR if a countdown is active
  const isSphereAnimatingFast = isLoaded || (nextClaimTimestamp !== null && remainingTime > 0)

  return (
    <div className="relative flex h-screen flex-col items-center justify-center bg-black text-white overflow-hidden">
      <div className="absolute inset-0 z-0">
        <KeplerSphere isLoaded={isSphereAnimatingFast} />
      </div>
      {isConnected && (
        <div className="absolute top-4 left-4 z-20 bg-gray-800 bg-opacity-70 rounded-lg p-3 flex items-center space-x-2 shadow-lg">
          <Image src="/keplerpay-rb.png" alt="KeplerPay Logo" width={30} height={30} />
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-300">KPP Balance:</span>
            {balanceLoading ? (
              <span className="text-lg font-bold text-yellow-400">Loading...</span>
            ) : balanceError ? (
              <span className="text-lg font-bold text-red-500">{kppBalance}</span>
            ) : (
              <span className="text-lg font-bold text-yellow-400">{kppBalance || "0.00"}</span>
            )}
          </div>
        </div>
      )}
      <div className="relative z-10 flex flex-col items-center justify-center h-full w-full px-4">
        {" "}
        {/* Added px-4 here */}
        {!isConnected ? (
          <div className="mt-[350px] w-full max-w-xs text-center">
            <Button
              onClick={handleConnectWallet}
              disabled={connectLoading}
              className="w-full px-8 py-3 text-lg font-semibold bg-white text-black hover:bg-gray-200 rounded-full shadow-lg"
            >
              {connectLoading ? "Connecting..." : "Connect Wallet"}
            </Button>
            {connectError && <p className="text-red-500 mt-4">{connectError}</p>}
          </div>
        ) : (
          <>
            <div className="mt-[350px] w-full max-w-xs text-center">
              {nextClaimTimestamp !== null && remainingTime > 0 ? (
                <div className="mt-4 w-full px-8 py-3 text-lg font-semibold bg-gray-700 text-white rounded-full shadow-lg flex flex-col items-center justify-center">
                  <span className="text-sm text-gray-300">{t.airdrop.nextClaimIn}</span>
                  <div className="flex gap-2 text-yellow-400 font-bold text-xl tabular-nums">
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
                    <div className="w-full bg-gray-700 rounded-full h-6 relative">
                      <div
                        className="bg-yellow-500 h-6 rounded-full transition-all duration-100 ease-out"
                        style={{ width: `${loadingProgress}%` }}
                        role="progressbar"
                        aria-valuenow={loadingProgress}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      ></div>
                      <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-black">
                        {Math.round(loadingProgress)}%
                      </span>
                    </div>
                  ) : (
                    <Button
                      onClick={handleClaimKPP}
                      disabled={isClaiming}
                      className="mt-4 w-full px-8 py-3 text-lg font-semibold bg-yellow-500 text-black hover:bg-yellow-600 rounded-full shadow-lg"
                    >
                      {isClaiming ? t.common.processing : "Claim 1 KPP"}
                    </Button>
                  )}
                </>
              )}
            </div>

            {!isLoaded && (
              <div className="mt-4 w-full max-w-xs relative h-10 bg-gray-800 rounded-full flex items-center px-1">
                <Button
                  onClick={handleMoveButtonClick}
                  className={`absolute w-1/2 h-8 rounded-full bg-white text-black transition-all duration-200 ease-in-out ${
                    buttonPosition === "right" ? "right-1" : "left-1"
                  }`}
                >
                  Click
                </Button>
              </div>
            )}

            {claimError && <div className="mt-4 text-red-500 text-center">Error: {claimError}</div>}
          </>
        )}
      </div>
      <BottomNavigation />
    </div>
  )
}
