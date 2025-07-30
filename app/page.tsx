"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { MiniKit, type VerifyCommandInput, VerificationLevel, type ISuccessResult } from "@worldcoin/minikit-js"
import { useState } from "react"
import { redirect } from "next/navigation" // Import redirect

export default function HomePage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleVerify = async () => {
    setLoading(true)
    setError(null)

    if (!MiniKit.isInstalled()) {
      setError("World App (MiniKit) is not installed.")
      setLoading(false)
      return
    }

    const verifyPayload: VerifyCommandInput = {
      action: "welcome", // Updated to match the screenshot
      signal: "0x12345", // Optional additional data, can be dynamic
      verification_level: VerificationLevel.Orb, // Orb | Device
    }

    let verificationSuccessfulFromWorldApp = false // Flag to track success from World App

    try {
      // World App will open a drawer prompting the user to confirm the operation
      const { finalPayload } = await MiniKit.commandsAsync.verify(verifyPayload)

      if (finalPayload.status === "error") {
        setError(`Verification failed: ${finalPayload.code || "Unknown error"}`)
        console.error("Error payload from World App", finalPayload)
        setLoading(false)
        return
      }

      // If World App interaction is successful, consider it successful for redirection
      verificationSuccessfulFromWorldApp = true

      // --- Backend verification (will be ignored for redirection if it fails) ---
      try {
        const verifyResponse = await fetch("/api/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            payload: finalPayload as ISuccessResult,
            action: "welcome",
            signal: "0x12345",
          }),
        })

        const verifyResponseJson = await verifyResponse.json()

        if (verifyResponse.ok && verifyResponseJson.status === 200) {
          console.log("Backend verification successful!", verifyResponseJson)
        } else {
          console.warn("Backend verification failed, but proceeding as requested:", verifyResponseJson)
          // We don't set an error here because the user wants to ignore it for redirection
        }
      } catch (backendError) {
        console.warn("Error during backend verification, but proceeding as requested:", backendError)
        // We don't set an error here because the user wants to ignore it for redirection
      }
      // --- End of backend verification block ---
    } catch (err) {
      console.error("Error during World ID interaction:", err)
      setError(`An unexpected error occurred during World ID interaction: ${(err as Error).message}`)
    } finally {
      setLoading(false)
      // Perform redirect if World App interaction was successful, regardless of backend result
      if (verificationSuccessfulFromWorldApp) {
        redirect("/dashboard") // Redirect to the dashboard page
      }
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white p-4 bg-[url('/white-explosions-background.png')] bg-cover bg-center">
      <div className="flex flex-col items-center space-y-4">
        <Image src="/keplerpay-logo.png" alt="KeplerPay Logo" width={200} height={200} className="mb-4" />
        <p className="text-lg text-center text-gray-400">To continue, please verify your World ID</p>
        <Button
          onClick={handleVerify}
          disabled={loading}
          className="mt-8 px-8 py-3 text-lg font-semibold bg-white text-black hover:bg-gray-200 rounded-full shadow-lg"
        >
          {loading ? "Verifying..." : "Verify with World ID"}
        </Button>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  )
}
