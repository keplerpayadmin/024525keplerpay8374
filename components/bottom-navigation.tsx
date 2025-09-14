"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Info, Handshake, Gift } from "lucide-react"
import { cn } from "@/lib/utils"
import { useI18n } from "@/lib/i18n/context"

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
      name: "Earn",
      href: "/earn",
      icon: Gift,
    },
    {
      name: t.navigation.partnerships,
      href: "/partnerships",
      icon: Handshake,
    },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <nav className="bg-white/90 backdrop-blur-md rounded-full shadow-lg max-w-md mx-auto border border-gray-200/50">
        <ul className="flex justify-around items-center h-16 px-6">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.name} className="flex-1">
                <Link
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center justify-center text-sm font-medium transition-colors duration-200 py-2 px-3",
                    isActive ? "text-yellow-500" : "text-black hover:text-gray-700",
                  )}
                >
                  <item.icon className={cn("w-6 h-6 mb-1", isActive ? "text-yellow-500" : "text-black")} />
                  <span className="text-xs">{item.name}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}
