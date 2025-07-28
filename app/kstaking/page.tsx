"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"
import { FingerAnimation } from "@/components/finger-animation"
import BottomNavbar from "@/components/bottom-navbar"

export default function KStakingPage() {
  return (
    <div className="relative min-h-screen bg-black text-white flex flex-col items-center p-4 sm:p-8 pb-20">
      {/* 3D Sphere as background */}
      <div className="absolute inset-0 z-0">
        <FingerAnimation />
      </div>

      {/* Main KStaking Content */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-6xl min-h-[calc(100vh-64px)] justify-center">
        <h1 className="text-3xl font-bold mb-8">KStaking</h1>

        {/* Passive Income Card */}
        <Card className="bg-gray-900 text-white border-gray-700 w-full max-w-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Passive Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0.00 KPP</div>
            <p className="text-xs text-gray-400">Automatically generated earnings.</p>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Navigation Bar */}
      <BottomNavbar />
    </div>
  )
}
