"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { MiniKit, type VerifyCommandInput, VerificationLevel, type ISuccessResult } from "@worldcoin/minikit-js"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function WorldIdVerificationPage() {
  const [verificationStatus, setVerificationStatus] = useState<string | null>(null)
  const router = useRouter()

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
      const verifyResponse = await fetch("/api/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          payload: finalPayload as ISuccessResult, // Parses only the fields we need to verify
          action: "welcome",
          signal: undefined,
        }),
      })

      const verifyResponseJson = await verifyResponse.json()
      if (verifyResponseJson.status === 200) {
        console.log("Verification success!", verifyResponseJson)
        setVerificationStatus("Verification successful!")
        // Mark onboarding as completed
        localStorage.setItem("onboarding-completed", "true")
        // Redirect to presentation page
        router.push("/presentation")
      } else {
        console.error("Backend verification failed:", verifyResponseJson)
        setVerificationStatus(`Backend verification failed: ${verifyResponseJson.verifyRes?.code || "Unknown error"}`)
      }
    } catch (error) {
      console.error("Error during World ID verification:", error)
      setVerificationStatus(`An unexpected error occurred: ${(error as Error).message}`)
    }
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex flex-col items-center justify-center p-4">
      {/* Background white spots/blobs */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/5 rounded-full mix-blend-screen filter blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-white/5 rounded-full mix-blend-screen filter blur-3xl animate-pulse-slow animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full mix-blend-screen filter blur-3xl animate-pulse-slow animation-delay-4000" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center text-center">
        <div className="mb-8">
          <Image src="/images/keplerlogo.png" alt="KeplerPay Logo" width={240} height={240} className="mb-4" />
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
