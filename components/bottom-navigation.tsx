"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Info, Handshake } from "lucide-react"
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
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <nav className="bg-white/90 backdrop-blur-md rounded-full shadow-lg max-w-md mx-auto border border-gray-200/50">
        <ul className="flex justify-around items-center h-16 px-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center justify-center text-sm font-medium transition-colors duration-200",
                    isActive ? "text-yellow-500" : "text-black hover:text-gray-700",
                  )}
                >
                  <item.icon className={cn("w-5 h-5 mb-1", isActive ? "text-yellow-500" : "text-black")} />
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
