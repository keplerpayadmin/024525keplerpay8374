"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FingerAnimation } from "@/components/finger-animation"
import BottomNavbar from "@/components/bottom-navbar"
import Image from "next/image"
import Link from "next/link"

export default function PartnershipsPage() {
  return (
    <div className="relative min-h-screen bg-black text-white flex flex-col items-center p-4 sm:p-8 pb-20">
      {/* 3D Sphere as background */}
      <div className="absolute inset-0 z-0">
        <FingerAnimation />
      </div>

      {/* Main Partnerships Content */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-3xl min-h-[calc(100vh-64px)] justify-start pt-10">
        <h1 className="text-4xl font-bold mb-8 text-center drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
          Partnerships
        </h1>

        <Card className="bg-gray-900/70 backdrop-blur-sm text-white border-gray-700 w-full mb-8">
          <CardHeader className="flex flex-col items-center">
            <Image
              src="/images/logo-tpf.png"
              alt="TPulseFi Logo"
              width={100}
              height={100}
              className="mb-4 object-contain"
            />
            <CardTitle className="text-xl font-semibold text-center">TPulseFi</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-base mb-4">
              TPulseFi - DeFi project focused on long-term value, prioritizing community interests.
            </p>
            <Link
              href="https://worldcoin.org/mini-app?app_id=app_a3a55e132983350c67923dd57dc22c5e&app_mode=mini-app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:underline text-sm"
            >
              Learn more about TPulseFi
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/70 backdrop-blur-sm text-white border-gray-700 w-full mb-8">
          <CardHeader className="flex flex-col items-center">
            <Image
              src="/images/drop-wallet.jpeg"
              alt="DropWallet Logo"
              width={100}
              height={100}
              className="mb-4 object-contain rounded-full"
            />
            <CardTitle className="text-xl font-semibold text-center">DropWallet</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-base mb-4">
              Drop Wallet is your go-to app for easily claiming crypto airdrops on the World Chain. Access top airdrops
              like KPP, swap them for USDC or WLD, and earn HUB—Drop Wallet’s native token—via daily check-ins and
              swaps. Upcoming features include cross-chain, fiat on-ramps, staking, and crypto savings – making Web3
              earning simple for everyone.
            </p>
            <Link
              href="https://worldcoin.org/mini-app?app_id=app_459cd0d0d3125864ea42bd4c19d1986c&path=/dlink/KeplerPay"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:underline text-sm"
            >
              Learn more about DropWallet
            </Link>
          </CardContent>
        </Card>

        {/* Add more partnership cards here if needed */}
      </div>

      {/* Bottom Navigation Bar */}
      <BottomNavbar />
    </div>
  )
}
