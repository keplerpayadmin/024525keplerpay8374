"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FingerAnimation } from "@/components/finger-animation"
import BottomNavbar from "@/components/bottom-navbar"
import { BackButton } from "@/components/back-button" // Import BackButton

export default function AboutPage() {
  return (
    <div className="relative min-h-screen bg-black text-white flex flex-col items-center p-4 sm:p-8 pb-20">
      {/* Back Button */}
      <BackButton />

      {/* 3D Sphere as background */}
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <FingerAnimation />
      </div>

      {/* Main About Content */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-3xl min-h-[calc(100vh-64px)] justify-start pt-10">
        <h1 className="text-4xl font-bold mb-8 text-center drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
          KeplerPay App – Start Your Journey into Real Utility
        </h1>

        <p className="text-lg text-center mb-6 max-w-prose">
          The KeplerPay App is your entry point into a transparent, reward-driven Web3 ecosystem.
        </p>

        <p className="text-lg text-center mb-8 max-w-prose">
          Right now, you can stake your KPP and earn up to 12% APY, plus receive daily login bonuses – simply for
          staying active.
        </p>

        <Card className="bg-gray-900/70 backdrop-blur-sm text-white border-gray-700 w-full mb-8">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Current Features:</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-base">
              <li>KPP Staking with up to 12% annual rewards</li>
              <li>Daily Login Bonus – get rewarded every day you log in</li>
              <li>Real-time balance and earnings overview</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/70 backdrop-blur-sm text-white border-gray-700 w-full mb-8">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Coming Soon:</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-base">
              <li>In-app wallet & QR payments</li>
              <li>Stablecoin integration & token swap</li>
              <li>Institutional partnerships (hospitals, schools, NGOs)</li>
            </ul>
          </CardContent>
        </Card>

        <p className="text-2xl font-bold text-center mt-2 mb-4 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
          Stake. Earn. Be part of something real.
        </p>
        <p className="text-sm text-gray-400 text-center mb-10">Developed by @pulsecode</p>
      </div>

      {/* Bottom Navigation Bar */}
      <BottomNavbar />
    </div>
  )
}
