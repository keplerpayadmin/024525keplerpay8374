"use client"

import type React from "react"
import { useEffect, useState } from "react"
import Image from "next/image"
import {
  Menu,
  X,
  Globe,
  Gift,
  TrendingUp,
  Info,
  PresentationIcon as AnimatePresence,
  MoveIcon as motion,
} from "lucide-react"
import { useRouter } from "next/navigation"

// Simplified language support
const LANGUAGES = [
  { code: "en", name: "English", flag: "🇺🇸", nativeName: "English", gradient: "from-blue-400 to-blue-600" },
  { code: "pt", name: "Português", flag: "🇧🇷", nativeName: "Português", gradient: "from-green-400 to-green-600" },
  { code: "es", name: "Español", flag: "🇪🇸", nativeName: "Español", gradient: "from-red-400 to-red-600" },
  {
    code: "id",
    name: "Bahasa Indonesia",
    flag: "🇮🇩",
    nativeName: "Bahasa Indonesia",
    gradient: "from-red-400 to-white",
  },
]

// Translations
const translations = {
  en: {
    navigation: {
      airdrop: "Airdrop",
      fistaking: "Fi Staking",
      about: "About",
    },
    common: {
      language: "Language",
      close: "Close",
      back: "Back",
    },
  },
  pt: {
    navigation: {
      airdrop: "Airdrop",
      fistaking: "Fi Staking",
      about: "Sobre",
    },
    common: {
      language: "Idioma",
      close: "Fechar",
      back: "Voltar",
    },
  },
  es: {
    navigation: {
      airdrop: "Airdrop",
      fistaking: "Fi Staking",
      about: "Acerca de",
    },
    common: {
      language: "Idioma",
      close: "Cerrar",
      back: "Atrás",
    },
  },
  id: {
    navigation: {
      airdrop: "Airdrop",
      fistaking: "Fi Staking",
      about: "Tentang",
    },
    common: {
      language: "Bahasa",
      close: "Tutup",
      back: "Kembali",
    },
  },
}

interface NavItem {
  id: string
  labelKey: keyof typeof translations.en.navigation
  icon: React.ComponentType<any>
  href?: string
}

const Presentation: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showLanguageMenu, setShowLanguageMenu] = useState(false)
  const [currentLang, setCurrentLang] = useState<keyof typeof translations>("en")
  const router = useRouter()

  // Get translations for current language
  const t = translations[currentLang]

  // Load saved language
  useEffect(() => {
    const savedLanguage = localStorage.getItem("preferred-language") as keyof typeof translations
    if (savedLanguage && translations[savedLanguage]) {
      setCurrentLang(savedLanguage)
    }
  }, [])

  const navigationItems: NavItem[] = [
    {
      id: "airdrop",
      labelKey: "airdrop",
      icon: Gift,
      href: "/airdrop",
    },
    {
      id: "fistaking",
      labelKey: "fistaking",
      icon: TrendingUp,
      href: "/fistaking",
    },
    {
      id: "about",
      labelKey: "about",
      icon: Info,
      href: "/about",
    },
  ]

  const handleLanguageChange = (newLanguage: keyof typeof translations) => {
    console.log("Changing language from", currentLang, "to", newLanguage)
    setCurrentLang(newLanguage)
    localStorage.setItem("preferred-language", newLanguage)
    setShowLanguageMenu(false)
    setIsMenuOpen(false)
  }

  const currentLanguage = LANGUAGES.find((lang) => lang.code === currentLang)

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center bg-gray-900">
      {/* Right Side - Language Selector */}
      <div className="absolute top-6 right-6 z-50">
        <div className="relative">
          <button onClick={() => setShowLanguageMenu(!showLanguageMenu)} className="relative group">
            <div className="px-3 py-2 bg-black/20 backdrop-blur-md border border-white/10 rounded-full flex items-center space-x-2 hover:bg-white/10 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <Globe className="w-4 h-4 text-purple-300 relative z-10" />
              <span className="text-purple-300 text-sm font-medium relative z-10">
                {currentLanguage?.flag} {currentLanguage?.code.toUpperCase()}
              </span>
            </div>
          </button>

          {/* Language Dropdown */}
          <AnimatePresence>
            {showLanguageMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="absolute top-12 right-0 bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl p-2 min-w-[200px] shadow-2xl"
              >
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code as keyof typeof translations)}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                      currentLang === lang.code
                        ? `bg-gradient-to-r ${lang.gradient} bg-opacity-20 text-white`
                        : "hover:bg-white/5 text-gray-300 hover:text-white"
                    }`}
                  >
                    <span className="text-lg">{lang.flag}</span>
                    <div className="text-left">
                      <div className="text-sm font-medium">{lang.nativeName}</div>
                      <div className="text-xs opacity-70">{lang.name}</div>
                    </div>
                    {currentLang === lang.code && <div className="ml-auto text-green-400">✓</div>}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Navigation Bar with Wallet Icon + Menu Button */}
      <div className="fixed bottom-6 left-6 right-6 z-50">
        {/* Futuristic Bottom Bar */}
        <div className="relative">
          {/* Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-700/20 via-gray-600/10 to-transparent blur-lg" />
          {/* Main Bar */}
          <div className="relative bg-gray-800/70 backdrop-blur-xl border border-gray-700/50 rounded-xl">
            <div className="flex items-center justify-center py-2 px-4 space-x-4">
              {/* Central Menu Button */}
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="relative group">
                <div className="w-8 h-8 bg-gray-700/50 backdrop-blur-md border border-gray-600/50 rounded-full flex items-center justify-center hover:bg-gray-700/70 transition-all duration-300 shadow-xl">
                  {/* Pulsing Ring */}
                  <div className="bg-gray-600/70 rounded-full animate-ping opacity-75" />
                  {/* Inner Glow */}
                  <div className="absolute inset-1 bg-gray-700/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {/* Icon */}
                  {isMenuOpen ? (
                    <X className="w-4 h-4 text-gray-300 relative z-10 transition-transform duration-300 rotate-90" />
                  ) : (
                    <Menu className="w-4 h-4 text-gray-300 relative z-10 transition-transform duration-300" />
                  )}
                </div>
                {/* Button Glow */}
                <div className="absolute inset-0 bg-gray-700/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sliding Menu from Bottom */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-6 left-6 right-6 z-40"
          >
            <div className="bg-gray-800/70 backdrop-blur-xl border border-gray-700/50 rounded-2xl mb-12">
              {/* Menu Handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-8 h-0.5 bg-white/30 rounded-full" />
              </div>
              {/* Menu Content */}
              <div className="p-4 pb-4">
                {/* Menu Glow Effect */}
                <div className="absolute inset-0 bg-gray-700/10 rounded-2xl" />
                {/* Menu Items Grid */}
                <div className="relative z-10 grid grid-cols-2 gap-3 mb-4">
                  {navigationItems.map((item, index) => (
                    <motion.button
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => {
                        if (item.href) {
                          router.push(item.href)
                          setIsMenuOpen(false)
                        }
                      }}
                      className="group p-2 bg-gray-700/30 backdrop-blur-sm border border-gray-600/50 rounded-lg hover:bg-gray-700/50 transition-all duration-300"
                    >
                      <div className="flex flex-col items-center space-y-1">
                        <div className="w-6 h-6 bg-gray-700/50 rounded-full flex items-center justify-center group-hover:bg-gray-700/70 transition-all duration-300">
                          <item.icon className="w-3 h-3 text-gray-400 group-hover:text-white transition-colors" />
                        </div>
                        <span className="text-gray-300 group-hover:text-white font-medium text-xs tracking-wide">
                          {t.navigation?.[item.labelKey] || item.labelKey}
                        </span>
                      </div>
                    </motion.button>
                  ))}
                </div>
                {/* Menu Bottom Glow */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-0.5 bg-gray-600/50 rounded-full" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Moving Light Lines Background */}
      <div className="absolute inset-0 bg-gray-900">
        {/* Horizontal Moving Lines */}
        {[...Array(12)].map((_, i) => (
          <div
            key={`h-line-${i}`}
            className="absolute h-px bg-gradient-to-r from-transparent via-white/60 to-transparent animate-pulse"
            style={{
              top: `${8 + i * 8}%`,
              left: "-100%",
              width: "200%",
              animation: `moveRight 4s linear infinite`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}

        {/* Vertical Moving Lines */}
        {[...Array(10)].map((_, i) => (
          <div
            key={`v-line-${i}`}
            className="absolute w-px bg-gradient-to-b from-transparent via-white/50 to-transparent"
            style={{
              left: `${10 + i * 10}%`,
              top: "-100%",
              height: "200%",
              animation: `moveDown 5s linear infinite`,
              animationDelay: `${i * 0.4}s`,
            }}
          />
        ))}

        {/* Diagonal Moving Lines */}
        {[...Array(8)].map((_, i) => (
          <div
            key={`d-line-${i}`}
            className="absolute h-px bg-gradient-to-r from-transparent via-white/30 to-transparent rotate-45"
            style={{
              top: `${15 + i * 12}%`,
              left: "-100%",
              width: "200%",
              animation: `moveRight 6s linear infinite`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center">
        {/* Logo with Ultra Vibrant Auras and Vibration */}
        <div className="relative w-32 h-32 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-white rounded-full shadow-2xl"
            style={{
              boxShadow: `
                0 0 50px rgba(255,255,255,0.8),
                0 0 100px rgba(229,231,235,0.6),
                0 0 150px rgba(209,213,219,0.4)
              `,
              animation: "pulseWhite 1.5s ease-in-out infinite alternate",
            }}
          />
          <div className="relative z-10 w-28 h-28 rounded-full overflow-hidden bg-white p-2">
            <Image
              src="/images/keplerpay-rb.png"
              alt="KeplerPay Logo"
              width={112}
              height={112}
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes moveRight {
          0% {
            transform: translateX(-100%);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateX(100vw);
            opacity: 0;
          }
        }

        @keyframes moveDown {
          0% {
            transform: translateY(-100%);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(100vh);
            opacity: 0;
          }
        }

        @keyframes pulseWhite {
          0% {
            box-shadow: 0 0 50px rgba(255,255,255,0.8), 0 0 100px rgba(229,231,235,0.6), 0 0 150px rgba(209,213,219,0.4);
          }
          100% {
            box-shadow: 0 0 60px rgba(255,255,255,1), 0 0 120px rgba(229,231,235,0.8), 0 0 180px rgba(209,213,219,0.6);
          }
        }
      `}</style>
    </div>
  )
}

export default Presentation
