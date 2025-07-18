"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Coins, Gift, ArrowLeft, Clock } from "lucide-react" // Removidos Lock, Shield, CheckCircle, X
import { MiniKit } from "@worldcoin/minikit-js" // Removidos VerifyCommandInput, VerificationLevel, ISuccessResult

interface AirdropClientProps {
  addDebugLog: (message: string) => void
}

export default function AirdropClient({ addDebugLog }: AirdropClientProps) {
  // Estados relacionados à quebra de corrente, World ID e abertura da caixa removidos
  // const [chainsBreaking, setChainsBreaking] = useState(false)
  // const [chainsBroken, setChainsBroken] = useState(false)
  // const [worldIdVerifying, setWorldIdVerifying] = useState(false)
  // const [worldIdVerified, setWorldIdVerified] = useState(false)
  // const [worldIdFailed, setWorldIdFailed] = useState(false)
  // const [boxOpened, setBoxOpened] = useState(false)
  // const [showReward, setShowReward] = useState(false) // Isso será implicitamente verdadeiro se não estiver em cooldown

  const [canClaim, setCanClaim] = useState(false) // Isso será derivado do cooldown
  const [isClaiming, setIsClaiming] = useState(false)
  const [claimSuccess, setClaimSuccess] = useState(false)
  const [claimError, setClaimError] = useState<string | null>(null)
  const [showCountdown, setShowCountdown] = useState(false)
  const [countdownTime, setCountdownTime] = useState(24 * 60 * 60) // 24 horas em segundos
  const [isInCooldown, setIsInCooldown] = useState(false)

  // Verifica o localStorage para cooldown existente na montagem do componente
  useEffect(() => {
    addDebugLog("AirdropClient useEffect: Checking cooldown status.")
    const checkCooldownStatus = () => {
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
          setShowCountdown(true)
          setIsInCooldown(true)
          setCanClaim(false) // Não pode reivindicar se estiver em cooldown
          addDebugLog(
            `Cooldown active. Remaining: ${formatTime(remainingTime).hours}:${formatTime(remainingTime).minutes}:${formatTime(remainingTime).seconds}`,
          )
        } else {
          // Cooldown expirou, limpa o localStorage
          localStorage.removeItem("airdrop_last_claim")
          setIsInCooldown(false)
          setShowCountdown(false)
          setCanClaim(true) // Pode reivindicar se o cooldown expirou
          addDebugLog("Cooldown expired. Claim available.")
        }
      } else {
        setCanClaim(true) // Pode reivindicar se não houver reivindicação anterior
        addDebugLog("No previous claim found in localStorage. Claim available.")
      }
    }

    checkCooldownStatus()
  }, [addDebugLog])

  // Efeito de contagem regressiva
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (showCountdown && countdownTime > 0) {
      interval = setInterval(() => {
        setCountdownTime((prev) => {
          if (prev <= 1) {
            // Contagem regressiva finalizada
            addDebugLog("Countdown finished. Resetting airdrop state.")
            setShowCountdown(false)
            setIsInCooldown(false)
            setCanClaim(true) // Habilita o botão de reivindicação
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
  }, [showCountdown, countdownTime, addDebugLog])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return {
      hours: hours.toString().padStart(2, "0"),
      minutes: minutes.toString().padStart(2, "0"),
      seconds: secs.toString().padStart(2, "0"),
    }
  }

  const startCooldown = () => {
    const now = Date.now()
    localStorage.setItem("airdrop_last_claim", now.toString())
    setCountdownTime(24 * 60 * 60) // 24 horas
    setShowCountdown(true)
    setIsInCooldown(true)
    setCanClaim(false) // Desabilita o botão de reivindicação
    addDebugLog("Claim successful. Starting 24h cooldown.")
  }

  // Funções handleBoxClick, proceedAfterVerification, failVerification, handleWorldIdVerification removidas

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

      const contractABI = [
        {
          inputs: [],
          name: "claimAirdrop",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "dailyAirdropAmount",
          outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [{ internalType: "address", name: "", type: "address" }],
          name: "lastClaimTime",
          outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
          stateMutability: "view",
          type: "function",
        },
      ]

      addDebugLog("Calling MiniKit.commandsAsync.sendTransaction for claimAirdrop.")
      const { finalPayload } = await MiniKit.commandsAsync.sendTransaction({
        transaction: [
          {
            to: contractAddress,
            data: "0x5b88349d", // Dados codificados para claimAirdrop()
            value: "0x0",
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
          throw new Error(errorMessage)
        }
        return
      }

      addDebugLog(`Airdrop claimed successfully. Transaction Hash: ${finalPayload.transactionHash}`)

      setClaimSuccess(true)
      setCanClaim(false) // Desabilita o botão de reivindicação imediatamente

      setTimeout(() => {
        setClaimSuccess(false)
        startCooldown() // Inicia o cooldown após um pequeno atraso para visibilidade da mensagem de sucesso
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

  const timeDisplay = formatTime(countdownTime)

  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex flex-col">
      {/* Botão Voltar */}
      <div className="absolute top-4 left-4 z-50">
        <Link
          href="/"
          className="flex items-center gap-2 px-4 py-2 bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-full text-white hover:bg-gray-800/80 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back</span>
        </Link>
      </div>

      {/* Fundo de Linhas de Luz em Movimento - Igual ao presentation.tsx */}
      <div className="absolute inset-0">
        {/* Linhas Horizontais em Movimento */}
        {[...Array(12)].map((_, i) => (
          <div
            key={`h-line-${i}`}
            className="absolute h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent animate-pulse"
            style={{
              top: `${8 + i * 8}%`,
              left: "-100%",
              width: "200%",
              animation: `moveRight 4s linear infinite`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}

        {/* Linhas Verticais em Movimento */}
        {[...Array(10)].map((_, i) => (
          <div
            key={`v-line-${i}`}
            className="absolute w-px bg-gradient-to-b from-transparent via-blue-400/50 to-transparent"
            style={{
              left: `${10 + i * 10}%`,
              top: "-100%",
              height: "200%",
              animation: `moveDown 5s linear infinite`,
              animationDelay: `${i * 0.4}s`,
            }}
          />
        ))}

        {/* Linhas Diagonais em Movimento */}
        {[...Array(8)].map((_, i) => (
          <div
            key={`d-line-${i}`}
            className="absolute h-px bg-gradient-to-r from-transparent via-white/30 to-transparent rotate-45"
            style={{
              top: `${15 + i * 12}%`,
              left: "-100%",
              width: "200%",
              animation: `moveRight 6s linear infinite`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
      </div>

      {/* Grade Estática */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(34,211,238,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34,211,238,0.3) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Efeito de Brilho Central */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute w-80 h-80 bg-cyan-400/10 rounded-full blur-2xl animate-pulse"
          style={{ animationDelay: "0.5s" }}
        />
        <div
          className="absolute w-64 h-64 bg-blue-400/15 rounded-full blur-xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      {/* Anéis Rotativos */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="w-72 h-72 border border-white/10 rounded-full animate-spin"
          style={{ animationDuration: "20s" }}
        />
        <div
          className="absolute w-80 h-80 border border-cyan-400/15 rounded-full animate-spin"
          style={{ animationDuration: "25s", animationDirection: "reverse" }}
        />
      </div>

      {/* Conteúdo Principal */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10 text-center px-4">
        {/* Título */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold tracking-tighter mb-2">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-200 via-white to-gray-300">
              Daily Airdrop
            </span>
          </h1>
          <p className="text-gray-400 text-sm">Claim your daily KPP tokens</p>
        </motion.div>

        {/* Temporizador de Contagem Regressiva - Mostra se estiver em cooldown */}
        <AnimatePresence>
          {showCountdown && isInCooldown && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.8 }}
              className="mb-8 relative z-10"
            >
              <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Clock className="w-5 h-5 text-cyan-400" />
                  <span className="text-cyan-400 font-medium text-sm">Next claim in:</span>
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

        {/* Conteúdo Principal do Airdrop - Simplificado */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8 relative"
        >
          <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
            {/* Ícone de Presente Central */}
            <div className="relative w-48 h-48 flex items-center justify-center bg-gradient-to-br from-yellow-500 to-amber-600 rounded-full shadow-2xl border-4 border-yellow-400/50">
              <Gift className="w-24 h-24 text-yellow-200" />
              {/* Efeito de Brilho */}
              <div
                className="absolute inset-0 bg-white rounded-full"
                style={{
                  boxShadow: `
                    0 0 40px rgba(255, 255, 255, 0.8),
                    0 0 80px rgba(255, 255, 255, 0.6),
                    0 0 120px rgba(255, 255, 255, 0.4)
                  `,
                  animation: "pulse 1s ease-in-out infinite",
                }}
              />
            </div>
          </div>

          {isInCooldown && (
            <motion.p
              className="text-red-400 text-sm mt-4 font-medium"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            >
              Wait for the countdown to finish
            </motion.p>
          )}
        </motion.div>

        {/* Botão de Reivindicação */}
        <AnimatePresence>
          {!isInCooldown && ( // Mostra o botão se não estiver em cooldown
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative z-10"
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
                      <Coins className="w-4 h-4" />
                      <span>Claim KPP</span>
                    </>
                  )}
                </div>
              </button>
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

      {/* Partículas Flutuantes */}
      {[...Array(25)].map((_, i) => (
        <div
          key={`particle-${i}`}
          className="absolute rounded-full animate-ping"
          style={{
            width: `${2 + Math.random() * 4}px`,
            height: `${2 + Math.random() * 4}px`,
            backgroundColor:
              i % 3 === 0 ? "rgba(255,255,255,0.8)" : i % 3 === 1 ? "rgba(34,211,238,0.6)" : "rgba(59,130,246,0.4)",
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 4}s`,
            animationDuration: `${1 + Math.random() * 3}s`,
          }}
        />
      ))}
    </div>
  )
}
