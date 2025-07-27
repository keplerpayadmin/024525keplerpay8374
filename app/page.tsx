"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { MiniKit, type VerifyCommandInput, VerificationLevel, type ISuccessResult } from "@worldcoin/minikit-js"
import { useState } from "react"

export default function WorldIdVerificationPage() {
  const [verificationStatus, setVerificationStatus] = useState<string | null>(null)

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
        // TODO: Handle success, e.g., redirect user or update UI
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
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className="relative z-10 flex flex-col items-center justify-center text-center">
        <div className="mb-8">
          <Image src="/images/keplerpay-logo.png" alt="KeplerPay Logo" width={120} height={120} className="mb-4" />
          <h1 className="text-5xl font-bold text-white">Kepler</h1>
        </div>

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
