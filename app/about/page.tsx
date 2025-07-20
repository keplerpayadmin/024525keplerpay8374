"use client"

import { motion } from "framer-motion"
import { BackgroundEffect } from "@/components/background-effect"
import { BottomNav } from "@/components/bottom-nav"

export default function AboutPage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center pt-6 pb-20 overflow-hidden">
      {/* Background effects */}
      <BackgroundEffect />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 flex flex-col w-full max-w-md px-4"
      >
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-6"
        >
          <h1 className="text-3xl font-bold tracking-tighter">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-200 via-white to-gray-300">
              KeplerPay App – Start Your Journey into Real Utility
            </span>
          </h1>
        </motion.div>

        {/* About Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-gray-900/70 backdrop-blur-sm rounded-xl border border-gray-800/50 overflow-hidden p-6 text-white"
        >
          <p className="text-gray-300 text-sm leading-relaxed mb-4">
            The KeplerPay App is your entry point into a transparent, reward-driven Web3 ecosystem.
          </p>
          <p className="text-gray-300 text-sm leading-relaxed mb-6">
            Right now, you can stake your KPP and earn up to 12% APY, plus receive daily login bonuses – simply for
            staying active.
          </p>

          <h2 className="text-xl font-bold text-white mb-3">Current Features:</h2>
          <ul className="space-y-2 text-sm text-gray-300 mb-6">
            <li className="flex items-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5 text-green-500 mr-2 flex-shrink-0"
              >
                <path
                  fillRule="evenodd"
                  d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                  clipRule="evenodd"
                />
              </svg>
              <span>KPP Staking with up to 12% annual rewards</span>
            </li>
            <li className="flex items-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5 text-green-500 mr-2 flex-shrink-0"
              >
                <path
                  fillRule="evenodd"
                  d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Daily Login Bonus – get rewarded every day you log in</span>
            </li>
            <li className="flex items-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5 text-green-500 mr-2 flex-shrink-0"
              >
                <path
                  fillRule="evenodd"
                  d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Real-time balance and earnings overview</span>
            </li>
          </ul>

          <h2 className="text-xl font-bold text-white mb-3">Coming Soon:</h2>
          <ul className="space-y-2 text-sm text-gray-300 mb-6">
            <li className="flex items-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z"
                  clipRule="evenodd"
                />
              </svg>
              <span>In-app wallet & QR payments</span>
            </li>
            <li className="flex items-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Stablecoin integration & token swap</span>
            </li>
            <li className="flex items-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Institutional partnerships (hospitals, schools, NGOs)</span>
            </li>
          </ul>

          <p className="text-white font-bold text-lg text-center">Stake. Earn. Be part of something real.</p>
        </motion.div>
      </motion.div>

      {/* Bottom navigation */}
      <BottomNav activeTab="about" />
    </main>
  )
}
