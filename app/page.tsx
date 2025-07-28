"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { MiniKit, VerificationLevel, type ISuccessResult } from "@worldcoin/minikit-js" // Import MiniKit and types

export default function Component() {
  const router = useRouter()
  const { toast } = useToast() // Initialize toast

  // Function to handle World ID verification and navigation
  const handleProceed = async () => {
    if (!MiniKit.isInstalled()) {
      toast({
        title: "Erro",
        description: "World App não está disponível. Por favor, use o World App para verificar.",
        variant: "destructive",
      })
      return
    }

    try {
      // Define the verification payload
      const verifyPayload = {
        action: "welcome", // Action ID from Worldcoin Developer Portal (from screenshot)
        signal: "keplerpay-dashboard-access", // Optional additional data
        verification_level: VerificationLevel.Orb, // Orb or Device
      }

      toast({
        title: "Verificação World ID",
        description: "Abrindo World App para verificação...",
      })

      // Open World App drawer for verification
      const { finalPayload } = await MiniKit.commandsAsync.verify(verifyPayload)

      if (finalPayload.status === "error") {
        console.error("World ID verification error payload:", finalPayload)
        let errorMessage = "Verificação World ID falhou."
        if (finalPayload.message?.includes("user_rejected")) {
          errorMessage = "Verificação cancelada pelo usuário."
        } else if (finalPayload.message?.includes("already_verified")) {
          errorMessage = "Você já verificou seu World ID para esta ação."
        }
        toast({
          title: "Erro de Verificação",
          description: errorMessage,
          variant: "destructive",
        })
        return
      }

      // Verify the proof in the backend
      const verifyResponse = await fetch("/api/world-id/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          payload: finalPayload as ISuccessResult, // Pass the full success payload
          action: verifyPayload.action,
          signal: verifyPayload.signal,
        }),
      })

      const verifyResponseJson = await verifyResponse.json()

      if (verifyResponseJson.status === 200 && verifyResponseJson.verified) {
        console.log("World ID verification successful!")
        toast({
          title: "Sucesso!",
          description: "World ID verificado com sucesso. Redirecionando...",
        })
        router.push("/dashboard")
      } else {
        console.error("Backend verification failed:", verifyResponseJson)
        toast({
          title: "Erro de Verificação",
          description: verifyResponseJson.message || "Falha na verificação do backend.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erro durante a verificação do World ID:", error)
      toast({
        title: "Erro Inesperado",
        description: "Ocorreu um erro inesperado durante a verificação.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-black text-white overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Subtle background gradient */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-900 via-black to-gray-950 opacity-70"></div>
        {/* Explosion effects */}
        <div
          className="absolute top-[10%] left-[15%] w-48 h-48 explosion-effect"
          style={{ animationDelay: "0s" }}
        ></div>
        <div
          className="absolute top-[40%] right-[10%] w-64 h-64 explosion-effect"
          style={{ animationDelay: "1.5s" }}
        ></div>
        <div
          className="absolute bottom-[20%] left-[30%] w-32 h-32 explosion-effect"
          style={{ animationDelay: "3s" }}
        ></div>
        <div
          className="absolute top-[25%] left-[60%] w-40 h-40 explosion-effect"
          style={{ animationDelay: "0.7s" }}
        ></div>
        <div
          className="absolute bottom-[5%] right-[40%] w-56 h-56 explosion-effect"
          style={{ animationDelay: "2.2s" }}
        ></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center p-4 text-center">
        <Image
          src="/images/keplerpay-rb.png"
          alt="Keplerpay Logo"
          width={250}
          height={250}
          className="mb-8 animate-fade-in"
        />
        <h1 className="mb-6 text-lg font-semibold md:text-xl lg:text-2xl animate-slide-up">
          To proceed, you must verify your World ID
        </h1>
      </div>

      {/* Fixed Button */}
      <div className="fixed bottom-16 left-1/2 -translate-x-1/2 z-50">
        <Button
          className="px-8 py-3 text-lg font-medium rounded-full bg-white text-black hover:bg-gray-200 transition-colors duration-300 shadow-lg"
          onClick={handleProceed}
        >
          Proceed to Dashboard
        </Button>
      </div>

      {/* Tailwind CSS for custom effects */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        /* Removed bounceIn animation for the button to ensure immediate visibility */

        .animate-fade-in {
          animation: fadeIn 1s ease-out forwards;
        }
        .animate-slide-up {
          animation: slideUp 0.8s ease-out 0.3s forwards;
          opacity: 0; /* Start hidden */
        }

        .explosion-effect {
          background: radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, transparent 70%);
          border-radius: 50%;
          animation: explode 4s infinite ease-out;
          pointer-events: none; /* Ensure it doesn't block clicks */
        }

        @keyframes explode {
          0% {
            transform: scale(0);
            opacity: 1;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}
