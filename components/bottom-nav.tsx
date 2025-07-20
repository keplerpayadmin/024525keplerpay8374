"use client"

import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Home, Wallet, Star, User, Gift, Coins, Info, Handshake, Menu, X } from "lucide-react"
import { getCurrentLanguage, getTranslations } from "@/lib/i18n"

interface BottomNavProps {
  activeTab?:
    | "agenda"
    | "profile"
    | "about"
    | "airdrop"
    | "fipay"
    | "furnace"
    | "games"
    | "wallet"
    | "winners"
    | "news"
    | "learn"
    | "partnerships"
    | "kstaking" // Adicionado KStaking
}

export function BottomNav({ activeTab = "airdrop" }: BottomNavProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [translations, setTranslations] = useState(getTranslations(getCurrentLanguage()))

  useEffect(() => {
    const handleLanguageChange = () => {
      setTranslations(getTranslations(getCurrentLanguage()))
    }

    handleLanguageChange()
    window.addEventListener("languageChange", handleLanguageChange)

    return () => {
      window.removeEventListener("languageChange", handleLanguageChange)
    }
  }, [])

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  const menuItems = [
    { name: translations.airdrop?.title || "Airdrop", icon: Gift, path: "/airdrop" },
    { name: "KStaking", icon: Coins, path: "/kstaking" }, // Adicionado KStaking
    { name: translations.about?.title || "About", icon: Info, path: "/about" },
    { name: translations.partnerships?.title || "Partnerships", icon: Handshake, path: "/partnerships" },
  ]

  return (
    <>
      {/* Menu Panel */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed top-0 left-0 right-0 bg-black/95 backdrop-blur-md border-b border-gray-800 z-40 overflow-hidden"
            initial={{ height: 0 }}
            animate={{ height: "100%" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="max-w-md mx-auto p-6 h-full flex flex-col">
              {/* Menu header */}
              <div className="flex justify-between items-center mb-8">
                <div className="text-gray-300 text-sm font-medium">{translations.nav?.menu || "Menu"}</div>
                <motion.button
                  onClick={toggleMenu}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800"
                >
                  <X className="w-5 h-5 text-white" />
                </motion.button>
              </div>

              {/* Menu list */}
              <ul className="flex flex-col gap-4">
                {menuItems.map((item) => (
                  <li key={item.name}>
                    <Link href={item.path} onClick={toggleMenu}>
                      <motion.div
                        className="flex items-center p-4 rounded-lg cursor-pointer relative overflow-hidden group bg-gray-900 border border-gray-700"
                        whileHover={{ scale: 1.02, backgroundColor: "#1a1a1a" }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 * menuItems.indexOf(item) }}
                      >
                        <div className="relative w-8 h-8 bg-gray-800 rounded-md flex items-center justify-center mr-4 border border-gray-600">
                          <item.icon className="w-5 h-5 text-white" />
                        </div>
                        <span className="relative z-10 text-lg text-white font-medium">{item.name}</span>
                      </motion.div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Navigation Bar */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 h-16 z-50 px-4"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.3, duration: 0.5, type: "spring" }}
      >
        {/* Background preto sólido */}
        <div className="absolute inset-0 bg-black rounded-t-xl shadow-lg border-t border-gray-800 overflow-hidden" />

        {/* Menu Button */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-5 z-10">
          <motion.button
            onClick={toggleMenu}
            className="w-14 h-14 rounded-full bg-gray-900 flex items-center justify-center shadow-lg border border-gray-700 relative overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Menu className="w-8 h-8 text-white" />
          </motion.button>
        </div>

        {/* Navigation Items */}
        <div className="relative h-full flex items-center justify-around px-4">
          {/* Itens da navegação principal */}
          {[
            { name: "Home", icon: Home, path: "/home" },
            { name: "Wallet", icon: Wallet, path: "/wallet" },
            { name: "Airdrop", icon: Star, path: "/airdrop" }, // Usando Star para Airdrop na nav principal
            { name: "Profile", icon: User, path: "/profile" },
          ].map((item) => (
            <Link href={item.path} key={item.name}>
              <motion.div
                className={`flex flex-col items-center justify-center w-16 h-14 rounded-lg ${
                  activeTab === item.name.toLowerCase() ? "bg-gray-800/50" : "bg-transparent"
                } text-white hover:text-gray-300 transition-colors`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <item.icon
                  className={`h-6 w-6 ${activeTab === item.name.toLowerCase() ? "text-white" : "text-gray-400"}`}
                />
                <span className="text-xs mt-1">{item.name}</span>
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.div>
    </>
  )
}
