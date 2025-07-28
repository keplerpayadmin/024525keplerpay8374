"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function Component() {
  const router = useRouter()
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-black text-white overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Subtle background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-950 opacity-70"></div>
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
        {" "}
        {/* Adjusted bottom position to move it slightly down */}
        <Button
          className="px-8 py-3 text-lg font-medium rounded-full bg-white text-black hover:bg-gray-200 transition-colors duration-300 shadow-lg"
          onClick={() => router.push("/dashboard")} // Added onClick to navigate
        >
          World ID
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
