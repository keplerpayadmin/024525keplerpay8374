"use client"

import { Button } from "@/components/ui/button"
import { Info, Handshake, Coins } from "lucide-react"
import { usePathname, useRouter } from "next/navigation" // Import usePathname
import { cn } from "@/lib/utils" // Import cn for conditional class joining

export default function BottomNavbar() {
  const router = useRouter()
  const pathname = usePathname() // Use usePathname to get the current path

  const navItems = [
    { name: "About", icon: Info, path: "/about" },
    { name: "Partnerships", icon: Handshake, path: "/partnerships" },
    { name: "KStaking", icon: Coins, path: "/kstaking" },
  ]

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-md bg-gray-950 py-3 px-6 flex justify-around items-center rounded-full shadow-2xl shadow-cyan-500/20 z-50">
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.path // Check if current path matches item path

        return (
          <Button
            key={item.name}
            variant="ghost"
            className={cn(
              "flex flex-col items-center text-white hover:bg-gray-800 transition-colors duration-200",
              isActive && "text-cyan-400", // Highlight active item
            )}
            onClick={() => router.push(item.path)}
          >
            <Icon className="h-6 w-6 mb-1" />
            <span className="text-xs">{item.name}</span>
          </Button>
        )
      })}
    </div>
  )
}
