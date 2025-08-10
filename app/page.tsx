"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { MiniKit, type VerifyCommandInput, VerificationLevel, type ISuccessResult } from "@worldcoin/minikit-js"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function WorldIdVerificationPage() {
  const [verificationStatus, setVerificationStatus] = useState<string | null>(null)
  const [visibleLetters, setVisibleLetters] = useState(0)
  const router = useRouter()

  // Animation for KEPLER letters
  useEffect(() => {
    const timer = setInterval(() => {
      setVisibleLetters((prev) => {
        if (prev < 6) {
          return prev + 1
        }
        return prev
      })
    }, 300) // Each letter appears after 300ms

    return () => clearInterval(timer)
  }, [])

  const handleVerify = async () => {
    setVerificationStatus("Verifying...")
    if (!MiniKit.isInstalled()) {
      setVerificationStatus("World App not installed.")
      return
    }

    const verifyPayload: VerifyCommandInput = {
      action: "welcome", // This is your action ID from the Developer Portal, based on the provided image
      signal: undefined, // Optional additional data
      verification_level: VerificationLevel.Orb, // Orb | Device
    }

    try {
      // World App will open a drawer prompting the user to confirm the operation
      const { finalPayload } = await MiniKit.commandsAsync.verify(verifyPayload)
      if (finalPayload.status === "error") {
        console.error("Error payload", finalPayload)
        setVerificationStatus(`Verification failed: ${finalPayload.code || "Unknown error"}`)
        return
      }

      // Verify the proof in the backend
      try {
        const verifyResponse = await fetch("/api/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            payload: finalPayload as ISuccessResult,
            action: "welcome",
            signal: undefined,
          }),
        })

        const verifyResponseJson = await verifyResponse.json()
        if (verifyResponseJson.status === 200) {
          console.log("Backend verification successful!", verifyResponseJson)
        } else {
          console.warn("Backend verification failed, but proceeding as requested:", verifyResponseJson)
        }
      } catch (backendError) {
        console.warn("Error during backend verification, but proceeding as requested:", backendError)
      }

      // Always proceed if World ID verification was successful
      console.log("World ID verification successful, proceeding to dashboard")
      setVerificationStatus("Verification successful!")
      localStorage.setItem("onboarding-completed", "true")
      router.push("/dashboard")
    } catch (error) {
      console.error("Error during World ID verification:", error)
      setVerificationStatus(`An unexpected error occurred: ${(error as Error).message}`)
    }
  }

  const letters = ["K", "E", "P", "L", "E", "R"]

  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex flex-col items-center justify-center p-4">
      {/* Background white spots/blobs */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/5 rounded-full mix-blend-screen filter blur-3xl animate-pulse-slow" />
        <div
          className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-white/5 rounded-full mix-blend-screen filter blur-3xl animate-pulse-slow"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full mix-blend-screen filter blur-3xl animate-pulse-slow"
          style={{ animationDelay: "4s" }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center text-center">
        <div className="mb-8">
          <Image src="/keplerlogo.png" alt="KeplerPay Logo" width={240} height={240} className="mb-4" />
        </div>

        {/* KEPLER title with white color */}
        <div className="mb-6 flex space-x-2">
          {letters.map((letter, index) => (
            <span
              key={index}
              className={`text-6xl font-bold transition-all duration-500 ${
                index < visibleLetters ? "opacity-100 text-white" : "opacity-0"
              }`}
              style={{
                textShadow:
                  index < visibleLetters
                    ? "0 0 20px rgba(255, 255, 255, 0.8), 0 0 40px rgba(255, 255, 255, 0.6), 0 0 60px rgba(255, 255, 255, 0.4)"
                    : "none",
                filter: index < visibleLetters ? "drop-shadow(0 0 10px rgba(255, 255, 255, 0.9))" : "none",
              }}
            >
              {letter}
            </span>
          ))}
        </div>

        <p className="text-white text-lg mb-6">Login with World ID to continue</p>
        <Button
          onClick={handleVerify}
          className="bg-gradient-to-r from-cyan-600 to-blue-500 text-white font-semibold py-3 px-8 rounded-lg hover:from-cyan-700 hover:to-blue-600 transition-all duration-200 shadow-lg text-lg"
        >
          Verify World ID
        </Button>
        {verificationStatus && <p className="mt-4 text-white text-sm">{verificationStatus}</p>}
      </div>
    </div>
  )
}
