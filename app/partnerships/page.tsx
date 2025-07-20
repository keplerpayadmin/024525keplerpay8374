"use client"

import { motion } from "framer-motion"
import { BackgroundEffect } from "@/components/background-effect"
import { BottomNav } from "@/components/bottom-nav"
import Image from "next/image"
import { useTranslations } from "@/lib/i18n" // Import useTranslations

export default function PartnershipsPage() {
  const { t } = useTranslations() // Use the hook to get translations

  return (
    <main className="relative flex min-h-screen flex-col items-center pt-6 pb-20 overflow-hidden">
      <BackgroundEffect />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 flex flex-col items-center gap-6 max-w-md w-full px-4"
      >
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold tracking-tighter">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-200 via-white to-gray-300">
              {t.partnerships?.title || "Partnerships"}
            </span>
          </h1>
          <p className="text-gray-400 text-sm mt-2">{t.partnerships?.subtitle || "Our strategic partners"}</p>
        </motion.div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="w-full space-y-4">
          <h2 className="text-xl font-semibold text-white mb-4 text-center">
            {t.partnerships?.ourPartners || "Our Partners"}
          </h2>

          {/* Partnership Nº1 - TPulseFi */}
          <motion.div
            className="relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-800/80 to-blue-800/80 border border-purple-700/50 p-6 shadow-lg"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 opacity-100 transition-opacity duration-300" />

            <div className="relative z-10">
              <div className="flex items-center justify-center mb-4">
                <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-white/20">
                  <Image src="/logo-tpf.png" alt="TPulseFi Logo" fill className="object-cover" />
                </div>
              </div>

              <div className="text-center">
                <h3 className="text-lg font-semibold text-white mb-2">Partnership Nº1</h3>
                <h4 className="text-xl font-bold text-white mb-3">TPulseFi</h4>
                <p className="text-gray-300 text-sm leading-relaxed">
                  TPulseFi is a DeFi project focused on long-term appreciation, including various areas under
                  development such as FiGames and FiStaking. It also features development partnerships within the
                  Worldchain network.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      <BottomNav activeTab="partnerships" />
    </main>
  )
}
