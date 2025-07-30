"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Info, Handshake, Coins } from "lucide-react"
import { cn } from "@/lib/utils" // Importar cn
import { useI18n } from "@/lib/i18n/context" // Importar useI18n

export function BottomNavigation() {
  const pathname = usePathname()
  const { t } = useI18n()

  const navItems = [
    {
      name: t.navigation.about,
      href: "/about",
      icon: Info,
    },
    {
      name: t.navigation.partnerships,
      href: "/partnerships",
      icon: Handshake,
    },
    {
      name: t.navigation.staking,
      href: "/staking",
      icon: Coins,
    },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <nav className="bg-gray-800/70 backdrop-blur-md rounded-full shadow-lg max-w-md mx-auto border border-gray-700/50">
        <ul className="flex justify-around items-center h-16 px-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center justify-center text-sm font-medium transition-colors duration-200",
                    isActive ? "text-yellow-400" : "text-gray-400 hover:text-gray-200",
                  )}
                >
                  <item.icon className={cn("w-5 h-5 mb-1", isActive ? "text-yellow-400" : "text-gray-400")} />
                  <span>{item.name}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}
