"use client"

import { Gift, TrendingUp, Handshake } from "lucide-react"

interface BottomNavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="bg-black/60 backdrop-blur-lg border-t border-white/20">
        <div className="flex items-center justify-center space-x-16 py-3 px-4 max-w-md mx-auto">
          {/* Check-in Tab */}
          <button
            onClick={() => onTabChange("airdrop")}
            className={`flex flex-col items-center space-y-1 transition-all duration-200 ${
              activeTab === "airdrop" ? "text-blue-400 scale-110" : "text-white/60 hover:text-white/80"
            }`}
          >
            <Gift className="h-5 w-5" />
            <span className="text-xs font-medium">Check-in</span>
          </button>

          {/* Partnerships Tab */}
          <button
            onClick={() => onTabChange("partnerships")}
            className={`flex flex-col items-center space-y-1 transition-all duration-200 ${
              activeTab === "partnerships" ? "text-green-400 scale-110" : "text-white/60 hover:text-white/80"
            }`}
          >
            <Handshake className="h-5 w-5" />
            <span className="text-xs font-medium">Partners</span>
          </button>

          {/* Staking Tab */}
          <button
            onClick={() => onTabChange("staking")}
            className={`flex flex-col items-center space-y-1 transition-all duration-200 ${
              activeTab === "staking" ? "text-purple-400 scale-110" : "text-white/60 hover:text-white/80"
            }`}
          >
            <TrendingUp className="h-5 w-5" />
            <span className="text-xs font-medium">Staking</span>
          </button>
        </div>
      </div>
    </div>
  )
}
