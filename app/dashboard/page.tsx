"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { FingerAnimation } from "@/components/finger-animation"
import { AnimatedText } from "@/components/animated-text"
import BottomNavbar from "@/components/bottom-navbar"

export default function DashboardPage() {
  return (
    <div className="relative min-h-screen bg-black text-white flex flex-col items-center p-4 sm:p-8 pb-20">
      {/* 3D Sphere as background */}
      <div className="absolute inset-0 z-0 flex items-center justify-center -top-48">
        {" "}
        {/* Moved sphere further up */}
        <FingerAnimation />
      </div>

      {/* Main Dashboard Content */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-6xl min-h-screen justify-center">
        {/* Top-left section: Balance Icon and Daily Check-in */}
        <div className="absolute top-4 left-4 flex flex-col space-y-4">
          {/* Balance Icon */}
          <div className="flex items-center space-x-2 bg-gray-900/50 backdrop-blur-sm p-2 rounded-lg border border-gray-700">
            <Image
              src="/images/keplerpay-rb.png"
              alt="Keplerpay Icon"
              width={30}
              height={30}
              className="object-contain"
            />
            <span className="text-xl font-bold text-white">0</span>
          </div>

          {/* Daily Check-in Card (simplified) */}
          <Card className="bg-gray-900 text-white border-gray-700 w-48 animate-pulse-subtle">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-center">Daily Check In</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center p-4 pt-0">
              <Button className="w-full bg-white text-black hover:bg-gray-200 text-sm py-2">Check In</Button>
            </CardContent>
          </Card>
        </div>
        {/* Animated title - positioned relative to the sphere */}
        <AnimatedText
          text="Kepler Pay"
          className="text-white font-extrabold text-5xl drop-shadow-[0_0_20px_rgba(255,255,255,0.8)] mt-40"
        />{" "}
        {/* Adjusted margin-top and added stronger text-shadow */}
      </div>

      {/* Bottom Navigation Bar */}
      <BottomNavbar />

      {/* Custom CSS for subtle pulse animation */}
      <style jsx global>{`
        @keyframes pulse-subtle {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 0 0px rgba(255, 255, 255, 0);
          }
          50% {
            transform: scale(1.01);
            box-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
          }
        }
        .animate-pulse-subtle {
          animation: pulse-subtle 2s infinite ease-in-out;
        }
      `}</style>
    </div>
  )
}
