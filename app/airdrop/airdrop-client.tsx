"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Coins, Gift, ArrowLeft, Clock } from "lucide-react"
import { useI18n } from "@/lib/i18n/context" // Importar do novo contexto
import { airdropService } from "@/lib/airdropService" // Importar o serviço de airdrop

export default function AirdropClient() {
  const { t } = useI18n()

  const [isRevealTriggerActive, setIsRevealTriggerActive] = useState(false)
  const [isRevealing, setIsRevealing] = useState(false)
  const [showClaimButton, setShowClaimButton] = useState(false)

  const [isClaiming, setIsClaiming] = useState(false)
  const [claimSuccess, setClaimSuccess] = useState(false)
  const [claimError, setClaimError] = useState<string | null>(null)
  const [showCountdown, setShowCountdown] = useState(false)
  const [countdownTime, setCountdownTime] = useState(24 * 60 * 60) // 24 hours in seconds
  const [isInCooldown, setIsInCooldown] = useState(false)

  // Check localStorage for existing cooldown on component mount
  useEffect(() => {
    const checkCooldownStatus = async () => {
      // Para uma implementação real, você buscaria o status do airdrop do backend/contrato
      // Por enquanto, vamos usar o localStorage como mock
      const lastClaimTime = localStorage.getItem("airdrop_last_claim")
      if (lastClaimTime) {
        const lastClaimTimestamp = Number.parseInt(lastClaimTime)
        const now = Date.now()
        const timeDiff = now - lastClaimTimestamp
        const cooldownPeriod = 24 * 60 * 60 * 1000 // 24 hours in milliseconds

        if (timeDiff < cooldownPeriod) {
          const remainingTime = Math.ceil((cooldownPeriod - timeDiff) / 1000)
          setCountdownTime(remainingTime)
          setShowCountdown(true)
          setIsInCooldown(true)
        } else {
          localStorage.removeItem("airdrop_last_claim")
          setIsInCooldown(false)
          setShowCountdown(false)
          setIsRevealTriggerActive(true)
        }
      } else {
        setIsRevealTriggerActive(true) // Ready to reveal if no cooldown found
      }
    }

    checkCooldownStatus()
  }, [])

  // Reset state on component mount if not in cooldown
  useEffect(() => {
    if (!isInCooldown) {
      setIsRevealTriggerActive(true)
      setIsRevealing(false)
      setShowClaimButton(false)
    }
  }, [isInCooldown])

  // Countdown effect
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (showCountdown && countdownTime > 0) {
      interval = setInterval(() => {
        setCountdownTime((prev) => {
          if (prev <= 1) {
            setShowCountdown(false)
            setIsInCooldown(false)
            setIsRevealTriggerActive(true)
            setIsRevealing(false)
            setShowClaimButton(false)
            localStorage.removeItem("airdrop_last_claim")
            return 24 * 60 * 60
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [showCountdown, countdownTime])

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
    setCountdownTime(24 * 60 * 60) // 24 hours
    setShowCountdown(true)
    setIsInCooldown(true)
    setIsRevealTriggerActive(false)
    setIsRevealing(false)
    setShowClaimButton(false)
  }

  const handleRevealClick = () => {
    if (!isRevealTriggerActive || isRevealing || isInCooldown) return

    setIsRevealing(true)
    setIsRevealTriggerActive(false)

    setTimeout(() => {
      setShowClaimButton(true)
      setIsRevealing(false)
    }, 1500)
  }

  const handleClaim = async () => {
    if (!showClaimButton || isClaiming) return

    try {
      setIsClaiming(true)
      setClaimError(null)
      setClaimSuccess(false)

      console.log("Starting claim process...")

      // Usar o airdropService para a reivindicação
      const result = await airdropService.claimAirdrop("YOUR_WALLET_ADDRESS_HERE") // Substitua por um endereço real se necessário, ou remova se o serviço não precisar

      if (!result.success) {
        console.error("Error claiming airdrop:", result.error)

        if (
          result.error &&
          (result.error.includes("Wait 24h") ||
            result.error.includes("24h between claims") ||
            result.error.includes("already claimed"))
        ) {
          setTimeout(() => {
            setClaimSuccess(false)
            startCooldown()
          }, 2000)
          setClaimError(t.airdrop.alreadyClaimedError)
        } else {
          throw new Error(result.error || t.airdrop.claimFailed)
        }
        return
      }

      console.log("Airdrop claimed successfully:", result)

      setClaimSuccess(true)
      setShowClaimButton(false)

      setTimeout(() => {
        setClaimSuccess(false)
        startCooldown()
      }, 3000)
    } catch (error) {
      console.error("Error claiming airdrop:", error)
      const errorMessage = error instanceof Error ? error.message : "Unknown error"

      if (
        errorMessage.includes("Wait 24h") ||
        errorMessage.includes("24h between claims") ||
        errorMessage.includes("already claimed")
      ) {
        setTimeout(() => {
          setClaimSuccess(false)
          startCooldown()
        }, 2000)
        setClaimError(t.airdrop.alreadyClaimedError)
      } else {
        setClaimError(t.airdrop.claimFailed)
      }
    } finally {
      setIsClaiming(false)
    }
  }

  const timeDisplay = formatTime(countdownTime)

  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden flex flex-col">
      {/* Back Button */}
      <div className="absolute top-4 left-4 z-50">
        <Link
          href="/"
          className="flex items-center gap-2 px-4 py-2 bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-full text-white hover:bg-gray-800/80 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">{t.common.back}</span>
        </Link>
      </div>

      {/* Moving Light Lines Background - Matches presentation.tsx */}
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10 text-center px-4">
        {" "}
        {/* Removed pt-20 here */}
        {/* Title */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold tracking-tighter mb-2">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-200 via-white to-gray-300">
              {t.airdrop.title}
            </span>
          </h1>
        </motion.div>
        {/* Countdown Timer - Show if in cooldown */}
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
                  <span className="text-cyan-400 font-medium text-sm">{t.airdrop.nextClaimIn}</span>
                </div>

                <div className="flex items-center justify-center gap-4">
                  {/* Hours */}
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
                    <div className="text-xs text-gray-400 uppercase tracking-wider">{t.airdrop.hours}</div>
                  </div>

                  <div className="text-2xl text-white font-bold">:</div>

                  {/* Minutes */}
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
                    <div className="text-xs text-gray-400 uppercase tracking-wider">{t.airdrop.minutes}</div>
                  </div>

                  <div className="text-2xl text-white font-bold">:</div>

                  {/* Seconds */}
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
                    <div className="text-xs text-gray-400 uppercase tracking-wider">{t.airdrop.seconds}</div>
                  </div>
                </div>

                {/* Animated border */}
                <div className="absolute inset-0 rounded-2xl border border-cyan-400/30 animate-pulse" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Central Orb / Reveal Trigger */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8 relative"
        >
          <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
            <motion.div
              className={`relative w-48 h-48 rounded-full flex items-center justify-center
        ${isRevealTriggerActive && !isInCooldown ? "cursor-pointer" : "cursor-not-allowed opacity-50"}
        bg-gradient-to-br from-blue-600 via-cyan-500 to-blue-700 shadow-2xl border-4 border-cyan-400/50`}
              style={{
                boxShadow: `
          0 0 30px rgba(0, 255, 255, 0.5),
          inset 0 0 20px rgba(255, 255, 255, 0.2)
        `,
              }}
              onClick={handleRevealClick}
              whileHover={{ scale: isRevealTriggerActive && !isInCooldown ? 1.05 : 1 }}
              whileTap={{ scale: isRevealTriggerActive && !isInCooldown ? 0.95 : 1 }}
              animate={
                isRevealing
                  ? { scale: [1, 1.2, 0.8, 0], opacity: [1, 0.8, 0.5, 0] }
                  : isRevealTriggerActive && !isInCooldown
                    ? {
                        scale: [1, 1.02, 1],
                        boxShadow: [
                          "0 0 30px rgba(0, 255, 255, 0.5)",
                          "0 0 40px rgba(0, 255, 255, 0.8)",
                          "0 0 30px rgba(0, 255, 255, 0.5)",
                        ],
                      }
                    : {}
              }
              transition={{
                scale: {
                  duration: isRevealing ? 1.5 : 1.5,
                  repeat: isRevealing ? 0 : Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                },
                boxShadow: { duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
                opacity: { duration: isRevealing ? 1.5 : 0.5 },
              }}
            >
              {/* Orb Pattern / Icon */}
              <div className="absolute inset-2 border-2 border-cyan-300/30 rounded-full" />
              <motion.div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                animate={isRevealing ? { opacity: 0, scale: 0 } : { opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Gift className="w-12 h-12 text-cyan-200" />
              </motion.div>

              {/* Sparkles Effect during reveal */}
              <AnimatePresence>
                {isRevealing && (
                  <>
                    {[...Array(15)].map((_, i) => (
                      <motion.div
                        key={`sparkle-${i}`}
                        className="absolute w-2 h-2 bg-yellow-300 rounded-full"
                        initial={{
                          x: 0,
                          y: 0,
                          scale: 0,
                          opacity: 1,
                        }}
                        animate={{
                          x: Math.cos((i * Math.PI * 2) / 15) * (50 + Math.random() * 50),
                          y: Math.sin((i * Math.PI * 2) / 15) * (50 + Math.random() * 50),
                          scale: [0, 1, 0],
                          opacity: [1, 1, 0],
                        }}
                        transition={{
                          duration: 1.5,
                          delay: i * 0.05,
                          ease: "easeOut",
                        }}
                      />
                    ))}
                  </>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Instruction text */}
          {!isInCooldown && !isRevealing && isRevealTriggerActive && (
            <motion.p
              className="text-gray-400 text-sm mt-4"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            >
              {t.airdrop.clickToBreakChain}
            </motion.p>
          )}

          {isRevealing && (
            <motion.p
              className="text-yellow-400 text-sm mt-4 font-medium"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY }}
            >
              {t.airdrop.breakingChain}
            </motion.p>
          )}

          {isInCooldown && (
            <motion.p
              className="text-red-400 text-sm mt-4 font-medium"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            >
              {t.airdrop.waitCountdown}
            </motion.p>
          )}
        </motion.div>
        {/* Group for KeplerPay Logo and Claim Button */}
        <AnimatePresence>
          {showClaimButton && !showCountdown && !isInCooldown && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative z-10 flex flex-col items-center mt-[-150px]" // Added mt-[-150px]
            >
              {/* KeplerPay Logo */}
              <motion.div
                className="relative w-24 h-24 mb-12" // Changed mb-40 to mb-12
                initial={{ y: 50, opacity: 0, scale: 0.5 }}
                animate={{
                  y: 0,
                  opacity: 1,
                  scale: 1,
                  rotateY: [0, 360],
                }}
                transition={{
                  duration: 1,
                  rotateY: { duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
                }}
              >
                {/* Glow Effect */}
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
                <div className="relative z-10 w-full h-full rounded-full overflow-hidden bg-white p-1">
                  <Image
                    src="/keplerpay-logo.png"
                    alt="KeplerPay Logo"
                    width={88}
                    height={88}
                    className="w-full h-full object-contain"
                  />
                </div>
              </motion.div>

              {/* Claim Button */}
              <button
                className={`w-56 py-3 px-5 rounded-full ${
                  showClaimButton
                    ? "bg-gradient-to-b from-gray-300 to-gray-400 text-gray-800 hover:from-gray-200 hover:to-gray-300"
                    : "bg-gradient-to-b from-gray-700 to-gray-800 text-gray-400"
                } font-bold text-sm shadow-lg border border-gray-300/30 relative overflow-hidden hover:scale-105 active:scale-95 transition-all duration-200`}
                disabled={!showClaimButton || isClaiming}
                onClick={handleClaim}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-b ${showClaimButton ? "from-white/30" : "from-white/10"} to-transparent opacity-70`}
                />
                <div className="relative flex items-center justify-center gap-2">
                  {isClaiming ? (
                    <>
                      <div className="w-4 h-4 border-2 border-t-gray-800 border-gray-400 rounded-full animate-spin" />
                      <span>{t.airdrop.processing}</span>
                    </>
                  ) : (
                    <>
                      <Coins className="w-4 h-4" />
                      <span>{t.airdrop.claim}</span>
                    </>
                  )}
                </div>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Success/Error Messages */}
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
                <span className="font-medium text-green-400">{t.airdrop.claimSuccessful}!</span>
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

      {/* Floating Particles */}
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
      `}</style>
    </div>
  )
}
