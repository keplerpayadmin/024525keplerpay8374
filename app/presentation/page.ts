"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Wallet, Globe, Gift, TrendingUp, Eye } from "lucide-react"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { useMiniKit } from "../../hooks/use-minikit"
import MiniWallet from "../../components/mini-wallet"

export default function PresentationPage() {
  const t = useTranslations(["PresentationPage", "common"])
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const miniKitContext = useMiniKit()
  const {
    user = null,
    isAuthenticated = false,
    isLoading = false,
    connectWallet = async () => {},
    disconnectWallet = async () => {},
  } = miniKitContext || {}

  const [showMiniWallet, setShowMiniWallet] = useState(false) // State for MiniWallet visibility

  // Show mini wallet when authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      setShowMiniWallet(true)
    } else {
      setShowMiniWallet(false)
    }
  }, [isAuthenticated, user])

  // Handle disconnect
  const handleWalletDisconnect = async () => {
    console.log("🔌 Disconnect button clicked")
    try {
      await disconnectWallet()
      setShowMiniWallet(false)
      console.log("✅ Wallet disconnected and mini wallet hidden")
    } catch (error) {
      console.error("❌ Error during disconnect:", error)
    }
  }

  // Handle minimize wallet
  const handleMinimizeWallet = () => {
    setShowMiniWallet(false)
  }

  // Handle show wallet again
  const handleShowWallet = () => {
    if (isAuthenticated) {
      setShowMiniWallet(true)
    }
  }

  return (
    <div className="relative min-h-screen bg-gray-900 text-white">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-30 bg-gray-900/80 backdrop-blur-md p-4 lg:px-8 flex items-center justify-between">
        <Link href="/" className="text-lg font-semibold flex items-center space-x-2">
          <TrendingUp className="w-6 h-6 text-cyan-400" />
          <span>MiniKit</span>
        </Link>

        {/* Mobile Menu Button */}
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden">
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Desktop Menu & Wallet */}
        <div className="hidden lg:flex items-center space-x-6">
          <Link href="/about" className="hover:text-gray-300 transition-colors">
            {t.common?.about || "About"}
          </Link>
          <Link href="/features" className="hover:text-gray-300 transition-colors">
            {t.common?.features || "Features"}
          </Link>
          <Link href="/pricing" className="hover:text-gray-300 transition-colors">
            {t.common?.pricing || "Pricing"}
          </Link>

          {/* Left Side - Connect Wallet Button / Mini Wallet Toggle */}
          <div className="flex items-center space-x-3">
            {/* Connect Wallet Button (only when not connected) */}
            {!isAuthenticated && (
              <button onClick={connectWallet} disabled={isLoading} className="relative group">
                <div className="px-6 py-3 bg-gray-800/70 backdrop-blur-md border border-gray-700/50 rounded-full flex items-center space-x-2 hover:bg-gray-700/80 transition-all duration-300 disabled:opacity-50">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-blue-400/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <Wallet className="w-5 h-5 text-cyan-300 relative z-10" />
                  <span className="text-white font-medium relative z-10">
                    {isLoading ? t.common?.loading || "Loading..." : t.presentation?.connectWallet || "Connect Wallet"}
                  </span>
                </div>
              </button>
            )}

            {/* Wallet Button (when wallet is connected but hidden) */}
            {isAuthenticated && !showMiniWallet && (
              <button onClick={handleShowWallet} className="relative group">
                <div className="px-3 py-2 bg-gray-800/70 backdrop-blur-md border border-gray-700/50 rounded-full flex items-center space-x-2 hover:bg-gray-700/80 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 to-emerald-400/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <Eye className="w-4 h-4 text-green-300 relative z-10" />
                  <span className="text-green-300 text-sm font-medium relative z-10">
                    {t.common?.wallet || "Wallet"}
                  </span>
                </div>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Menu (Hidden by default) */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 w-full bg-gray-900/90 backdrop-blur-md flex flex-col items-center py-4 space-y-3"
            >
              <Link href="/about" className="hover:text-gray-300 transition-colors">
                {t.common?.about || "About"}
              </Link>
              <Link href="/features" className="hover:text-gray-300 transition-colors">
                {t.common?.features || "Features"}
              </Link>
              <Link href="/pricing" className="hover:text-gray-300 transition-colors">
                {t.common?.pricing || "Pricing"}
              </Link>
              {/* Mobile Connect Wallet Button */}
              {!isAuthenticated && (
                <button onClick={connectWallet} disabled={isLoading} className="relative group">
                  <div className="px-6 py-3 bg-gray-800/70 backdrop-blur-md border border-gray-700/50 rounded-full flex items-center space-x-2 hover:bg-gray-700/80 transition-all duration-300 disabled:opacity-50">
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-blue-400/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <Wallet className="w-5 h-5 text-cyan-300 relative z-10" />
                    <span className="text-white font-medium relative z-10">
                      {isLoading
                        ? t.common?.loading || "Loading..."
                        : t.presentation?.connectWallet || "Connect Wallet"}
                    </span>
                  </div>
                </button>
              )}
              {/* Mobile Wallet Button (when wallet is connected but hidden) */}
              {isAuthenticated && !showMiniWallet && (
                <button onClick={handleShowWallet} className="relative group">
                  <div className="px-3 py-2 bg-gray-800/70 backdrop-blur-md border border-gray-700/50 rounded-full flex items-center space-x-2 hover:bg-gray-700/80 transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 to-emerald-400/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <Eye className="w-4 h-4 text-green-300 relative z-10" />
                    <span className="text-green-300 text-sm font-medium relative z-10">
                      {t.common?.wallet || "Wallet"}
                    </span>
                  </div>
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Mini Wallet - Positioned with safe spacing from top navigation */}
      <AnimatePresence>
        {showMiniWallet && user && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-24 left-6 z-40" // Adjusted top position
          >
            <MiniWallet
              walletAddress={user.walletAddress}
              onMinimize={handleMinimizeWallet}
              onDisconnect={handleWalletDisconnect}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative py-24 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="lg:w-2/3 mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              {t.presentation?.heroTitle || "Unlock the Future of Decentralized Applications"}
            </h1>
            <p className="text-lg text-gray-300 mb-12">
              {t.presentation?.heroSubtitle ||
                "Experience seamless integration and enhanced user engagement with our cutting-edge MiniKit."}
            </p>
            <div className="flex justify-center space-x-4">
              <button className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-3 px-8 rounded-full transition-colors">
                {t.presentation?.getStarted || "Get Started"}
              </button>
              <button className="bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 px-8 rounded-full transition-colors">
                {t.presentation?.learnMore || "Learn More"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold text-center mb-8">{t.presentation?.featuresTitle || "Key Features"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Card 1 */}
            <div className="bg-gray-900 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <Globe className="w-8 h-8 text-cyan-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {t.presentation?.feature1Title || "Cross-Platform Compatibility"}
              </h3>
              <p className="text-gray-300">
                {t.presentation?.feature1Description ||
                  "Our MiniKit seamlessly integrates with various platforms, ensuring a consistent user experience across all devices."}
              </p>
            </div>

            {/* Feature Card 2 */}
            <div className="bg-gray-900 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <Gift className="w-8 h-8 text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">{t.presentation?.feature2Title || "Easy Integration"}</h3>
              <p className="text-gray-300">
                {t.presentation?.feature2Description ||
                  "With our simple and intuitive API, integrating our MiniKit into your existing application is a breeze."}
              </p>
            </div>

            {/* Feature Card 3 */}
            <div className="bg-gray-900 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <Wallet className="w-8 h-8 text-green-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">{t.presentation?.feature3Title || "Secure Transactions"}</h3>
              <p className="text-gray-300">
                {t.presentation?.feature3Description ||
                  "We prioritize the security of your users' transactions, employing state-of-the-art encryption and security protocols."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-semibold mb-8">{t.presentation?.ctaTitle || "Ready to Get Started?"}</h2>
          <p className="text-lg text-gray-300 mb-12">
            {t.presentation?.ctaSubtitle ||
              "Join the thousands of developers already using our MiniKit to revolutionize their applications."}
          </p>
          <button className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-3 px-8 rounded-full transition-colors">
            {t.presentation?.signUp || "Sign Up Now"}
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 py-8">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <p className="text-gray-400">© 2024 MiniKit. All rights reserved.</p>
          <div className="flex space-x-4">
            <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
              {t.common?.terms || "Terms"}
            </Link>
            <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
              {t.common?.privacy || "Privacy"}
            </Link>
            <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
              {t.common?.contact || "Contact"}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
