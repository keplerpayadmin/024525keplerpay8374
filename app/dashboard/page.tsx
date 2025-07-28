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
      <div className="absolute top-0 left-0 w-full h-full z-0 flex items-center justify-center -top-24">
        {" "}
        {/* Adjusted to h-full */}
        <FingerAnimation />
      </div>

      {/* Main Dashboard Content */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-6xl min-h-screen justify-center">
        {/* Top-left section: Balance Icon and Daily Check-in */}
        <div className="absolute top-4 left-4 flex flex-col space-y-2">
          {" "}
          {/* Reduced space-y */}
          {/* Balance Icon */}
          <div className="flex items-center space-x-1 bg-gray-900/50 backdrop-blur-sm p-1.5 rounded-md border border-gray-700">
            {" "}
            {/* Reduced padding and rounded */}
            <Image
              src="/images/keplerpay-rb.png"
              alt="Keplerpay Icon"
              width={20}
              height={20}
              className="object-contain"
            />
            <span className="text-base font-bold text-white">0</span> {/* Reduced font size */}
          </div>
          {/* Daily Check-in Card (simplified) */}
          <Card className="bg-gray-900 text-white border-gray-700 w-36 animate-pulse-subtle">
            {" "}
            {/* Reduced width */}
            <CardHeader className="pb-1">
              {" "}
              {/* Reduced padding */}
              <CardTitle className="text-xs font-medium text-center">Daily Check In</CardTitle>{" "}
              {/* Reduced font size */}
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center p-2 pt-0">
              {" "}
              {/* Reduced padding */}
              <Button className="w-full bg-white text-black hover:bg-gray-200 text-xs py-1">
                {" "}
                {/* Reduced font size and padding */}
                Check In
              </Button>
            </CardContent>
          </Card>
        </div>
        {/* Animated title - positioned relative to the sphere */}
        <AnimatedText
          text="Kepler Pay"
          className="text-white font-extrabold text-3xl drop-shadow-[0_0_15px_rgba(255,255,255,0.8)] mt-60"
        />{" "}
        {/* Adjusted margin-top to move it further down */}
      </div>
      {/* Bottom Navigation Bar */}
      <BottomNavbar />
      {/* Custom CSS for subtle pulse animation */}
      <style jsx global>{`
        @keyframes pulse-subtle {
          0%,
          100% {
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
