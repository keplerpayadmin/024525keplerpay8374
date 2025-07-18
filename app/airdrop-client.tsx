"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Coins, ArrowLeft, Clock, Flame } from "lucide-react"
import { MiniKit } from "@worldcoin/minikit-js"

interface AirdropClientProps {
  addDebugLog: (message: string) => void
}

export default function AirdropClient({ addDebugLog }: AirdropClientProps) {
  /* --------------------------------------------------
   * Estados
   * -------------------------------------------------- */
  const [canClaim, setCanClaim] = useState(false)
  const [isClaiming, setIsClaiming] = useState(false)
  const [claimSuccess, setClaimSuccess] = useState(false)
  const [claimError, setClaimError] = useState<string | null>(null)

  const [countdownTime, setCountdownTime] = useState(24 * 60 * 60) // 24 h em s
  const [isInCooldown, setIsInCooldown] = useState(false)
  const [dailyStreak, setDailyStreak] = useState(0)

  /* --------------------------------------------------
   * Helpers
   * -------------------------------------------------- */
  const todayStr = () => new Date().toISOString().split("T")[0]

  const formatTime = (s: number) => ({
    hours: Math.floor(s / 3600)
      .toString()
      .padStart(2, "0"),
    minutes: Math.floor((s % 3600) / 60)
      .toString()
      .padStart(2, "0"),
    seconds: (s % 60).toString().padStart(2, "0"),
  })

  const startCooldown = () => {
    const now = Date.now()
    localStorage.setItem("airdrop_last_claim", String(now))
    localStorage.setItem("last_claim_date", todayStr())

    setCountdownTime(24 * 60 * 60)
    setIsInCooldown(true)
    setCanClaim(false)
    addDebugLog("Claim successful. Starting 24h cooldown.")

    setDailyStreak((prev) => {
      const next = prev + 1
      localStorage.setItem("daily_streak", String(next))
      return next
    })
  }

  /* --------------------------------------------------
   * Montagem: verifica cooldown + streak
   * -------------------------------------------------- */
  useEffect(() => {
    addDebugLog("Checking cooldown & daily streak…")

    // streak
    const streak = Number(localStorage.getItem("daily_streak") ?? "0")
    const lastClaimDate = localStorage.getItem("last_claim_date")
    const isYesterday = lastClaimDate === new Date(Date.now() - 86_400_000).toISOString().split("T")[0]

    if (lastClaimDate && lastClaimDate !== todayStr() && !isYesterday) {
      localStorage.setItem("daily_streak", "0")
      setDailyStreak(0)
      addDebugLog("Streak reset (missed a day).")
    } else {
      setDailyStreak(streak)
    }

    // cooldown
    const last = Number(localStorage.getItem("airdrop_last_claim") ?? "0")
    const diff = Date.now() - last
    const cooldownMs = 86_400_000

    if (diff < cooldownMs && last !== 0) {
      const remaining = Math.ceil((cooldownMs - diff) / 1000)
      setCountdownTime(remaining)
      setIsInCooldown(true)
      setCanClaim(false)
      addDebugLog(`Cooldown active. ${remaining}s left.`)
    } else {
      setIsInCooldown(false)
      setCanClaim(true)
    }
  }, [addDebugLog])

  /* --------------------------------------------------
   * Countdown interval
   * -------------------------------------------------- */
  useEffect(() => {
    if (!isInCooldown) return
    const id = setInterval(() => {
      setCountdownTime((prev) => {
        if (prev <= 1) {
          clearInterval(id)
          setIsInCooldown(false)
          setCanClaim(true)
          localStorage.removeItem("airdrop_last_claim")
          addDebugLog("Cooldown finished.")
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [isInCooldown, addDebugLog])

  /* --------------------------------------------------
   * Claim
   * -------------------------------------------------- */
  const handleClaim = async () => {
    if (!canClaim || isClaiming) return

    try {
      setIsClaiming(true)
      setClaimError(null)
      addDebugLog("Claiming KPP…")

      if (!MiniKit.isInstalled()) throw new Error("MiniKit not installed")

      const { finalPayload } = await MiniKit.commandsAsync.sendTransaction({
        transaction: [
          {
            to: "0x8125d4634A0A58ad6bAFbb5d78Da3b735019E237",
            data: "0x5b88349d",
            value: "0x0",
          },
        ],
      })

      if (finalPayload.status === "error") throw new Error(finalPayload.message)

      setClaimSuccess(true)
      setCanClaim(false)
      startCooldown()
      setTimeout(() => setClaimSuccess(false), 3000)
    } catch (e: any) {
      addDebugLog(`Claim error: ${e.message}`)
      setClaimError(e.message ?? "Claim failed")
    } finally {
      setIsClaiming(false)
    }
  }

  /* --------------------------------------------------
   * Render
   * -------------------------------------------------- */
  const t = formatTime(countdownTime)

  return (
    <div className="min-h-screen flex flex-col bg-black relative overflow-hidden">
      {/* Back */}
      <Link
        href="/"
        className="absolute top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 bg-gray-900/80 text-white rounded-full"
      >
        <ArrowLeft size={16} /> Back
      </Link>

      {/* Title */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-4 z-10">
        <h1 className="text-4xl font-bold mb-2 text-white">Daily Airdrop</h1>
        <p className="text-gray-400 mb-6">Claim your daily KPP tokens</p>

        {/* Streak */}
        {dailyStreak > 0 && (
          <div className="mb-6 inline-flex items-center gap-2 bg-purple-900/30 px-4 py-2 rounded-lg">
            <Flame className="text-purple-400" size={18} />
            <span className="text-purple-400 font-medium">
              Daily Streak: {dailyStreak} day{dailyStreak > 1 && "s"}
            </span>
          </div>
        )}

        {/* Countdown */}
        {isInCooldown && (
          <div className="mb-6 bg-gray-900/70 px-6 py-4 rounded-xl inline-flex items-center gap-3 text-cyan-400">
            <Clock size={18} />
            Next claim in {t.hours}:{t.minutes}:{t.seconds}
          </div>
        )}

        {/* Button */}
        <button
          disabled={!canClaim || isClaiming}
          onClick={handleClaim}
          className={`w-56 py-3 rounded-full font-semibold flex items-center justify-center gap-2 ${
            canClaim && !isClaiming
              ? "bg-gradient-to-b from-gray-300 to-gray-400 text-gray-800 hover:from-gray-200"
              : "bg-gradient-to-b from-gray-700 to-gray-800 text-gray-400"
          } transition`}
        >
          {isClaiming ? (
            <>
              <div className="h-4 w-4 border-2 border-t-gray-800 border-gray-400 rounded-full animate-spin" />
              Processing…
            </>
          ) : (
            <>
              <Coins size={16} /> Claim KPP
            </>
          )}
        </button>

        {/* Success / Error */}
        <AnimatePresence>
          {claimSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 text-green-400 font-medium"
            >
              Claim successful!
            </motion.div>
          )}
        </AnimatePresence>

        {claimError && <div className="mt-4 text-red-400 font-medium">{claimError}</div>}
      </div>
    </div>
  )
}
