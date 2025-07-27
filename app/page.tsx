"use client"

import type React from "react"
import { useEffect, useState } from "react"
import Image from "next/image" // Re-importing Image
import { Menu, X, Wallet, Globe, Gift, TrendingUp, Info, Eye, Users } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { useMiniKit } from "../../hooks/use-minikit" // Corrected path
import MiniWallet from "../../components/mini-wallet" // Corrected path

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
    presentation: {
      connectWallet: "Connect Wallet",
      heroTitle: "Unlock the Future of Decentralized Applications",
      heroSubtitle: "Experience seamless integration and enhanced user engagement with our cutting-edge MiniKit.",
      getStarted: "Get Started",
      learnMore: "Learn More",
      featuresTitle: "Key Features",
      feature1Title: "Cross-Platform Compatibility",
      feature1Description:
        "Our MiniKit seamlessly integrates with various platforms, ensuring a consistent user experience across all devices.",
      feature2Title: "Easy Integration",
      feature2Description:
        "With our simple and intuitive API, integrating our MiniKit into your existing application is a breeze.",
      feature3Title: "Secure Transactions",
      feature3Description:
        "We prioritize the security of your users' transactions, employing state-of-the-art encryption and security protocols.",
      ctaTitle: "Ready to Get Started?",
      ctaSubtitle: "Join the thousands of developers already using our MiniKit to revolutionize their applications.",
      signUp: "Sign Up Now",
    },
    navigation: {
      airdrop: "Airdrop",
      fistaking: "KStaking", // Changed from Fi Staking to KStaking
      about: "About",
      partnerships: "Partnerships",
    },
    partnerships: {
      title: "Our Partnerships",
      tPulseFiTitle: "TPulseFi",
      tPulseFiDescription:
        "TPulseFi is a DeFi project focused on long-term value appreciation, and our main partner/developer.",
      dropWalletTitle: "DropWallet",
      dropWalletDescription:
        "Drop Wallet is your go-to app for easily claiming crypto airdrops on the World Chain. Access top airdrops like KPP, swap them for USDC or WLD, and earn HUB—Drop Wallet’s native token—via daily check-ins and swaps. Upcoming features include cross-chain, fiat on-ramps, staking, and crypto savings – making Web3 earning simple for everyone.",
    },
    common: {
      loading: "Loading...",
      language: "Language",
      close: "Close",
      back: "Back",
      wallet: "Wallet",
      features: "Features",
      pricing: "Pricing",
      terms: "Terms",
      privacy: "Privacy",
      contact: "Contact",
    },
  },
  pt: {
    presentation: {
      connectWallet: "Conectar Carteira",
      heroTitle: "Desbloqueie o Futuro das Aplicações Descentralizadas",
      heroSubtitle: "Experimente integração perfeita e engajamento aprimorado do usuário com nosso MiniKit de ponta.",
      getStarted: "Começar",
      learnMore: "Saber Mais",
      featuresTitle: "Principais Recursos",
      feature1Title: "Compatibilidade Multiplataforma",
      feature1Description:
        "Nosso MiniKit integra-se perfeitamente com várias plataformas, garantindo uma experiência de usuário consistente em todos os dispositivos.",
      feature2Title: "Fácil Integração",
      feature2Description:
        "Com nossa API simples e intuitiva, integrar nosso MiniKit em seu aplicativo existente é muito fácil.",
      feature3Title: "Transações Seguras",
      feature3Description:
        "Priorizamos a segurança das transações de seus usuários, empregando criptografia e protocolos de segurança de última geração.",
      ctaTitle: "Pronto para Começar?",
      ctaSubtitle:
        "Junte-se aos milhares de desenvolvedores que já usam nosso MiniKit para revolucionar seus aplicativos.",
      signUp: "Inscreva-se Agora",
    },
    navigation: {
      airdrop: "Airdrop",
      fistaking: "KStaking", // Changed from Fi Staking to KStaking
      about: "Sobre",
      partnerships: "Parcerias",
    },
    partnerships: {
      title: "Nossas Parcerias",
      tPulseFiTitle: "TPulseFi",
      tPulseFiDescription:
        "TPulseFi é um projeto DeFi focado na valorização a longo prazo, e nosso principal parceiro/desenvolvedor.",
      dropWalletTitle: "DropWallet",
      dropWalletDescription:
        "Drop Wallet é o seu aplicativo ideal para reivindicar facilmente airdrops de criptomoedas na World Chain. Acesse os melhores airdrops como KPP, troque-os por USDC ou WLD e ganhe HUB — o token nativo da Drop Wallet — através de check-ins diários e trocas. Os próximos recursos incluem cross-chain, on-ramps fiduciárias, staking e poupança de criptomoedas – tornando o ganho Web3 simples para todos.",
    },
    common: {
      loading: "Carregando...",
      language: "Idioma",
      close: "Fechar",
      back: "Voltar",
      wallet: "Carteira",
      features: "Recursos",
      pricing: "Preços",
      terms: "Termos",
      privacy: "Privacidade",
      contact: "Contato",
    },
  },
  es: {
    presentation: {
      connectWallet: "Conectar Billetera",
      heroTitle: "Desbloquea el Futuro de las Aplicaciones Descentralizadas",
      heroSubtitle:
        "Experimenta una integración perfecta y una mayor participación del usuario con nuestro MiniKit de vanguardia.",
      getStarted: "Empezar",
      learnMore: "Aprender Más",
      featuresTitle: "Características Clave",
      feature1Title: "Compatibilidad Multiplataforma",
      feature1Description:
        "Nuestro MiniKit se integra perfectamente con varias plataformas, asegurando una experiencia de usuario consistente en todos los dispositivos.",
      feature2Title: "Fácil Integración",
      feature2Description:
        "Con nuestra API simple e intuitiva, integrar nuestro MiniKit en tu aplicación existente es muy fácil.",
      feature3Title: "Transacciones Seguras",
      feature3Description:
        "Priorizamos la seguridad de las transacciones de tus usuarios, empleando cifrado y protocolos de seguridad de última generación.",
      ctaTitle: "¿Listo para Empezar?",
      ctaSubtitle:
        "Únete a los miles de desarrolladores que ya usan nuestro MiniKit para revolucionar sus aplicaciones.",
      signUp: "Regístrate Ahora",
    },
    navigation: {
      airdrop: "Airdrop",
      fistaking: "KStaking", // Changed from Fi Staking to KStaking
      about: "Acerca de",
      partnerships: "Asociaciones",
    },
    partnerships: {
      title: "Nuestras Asociaciones",
      tPulseFiTitle: "TPulseFi",
      tPulseFiDescription:
        "TPulseFi é um projeto DeFi centrado na apreciação do valor a longo prazo, e nosso principal socio/desenvolvedor.",
      dropWalletTitle: "DropWallet",
      dropWalletDescription:
        "Drop Wallet es tu aplicación ideal para reclamar fácilmente airdrops de criptomoedas na World Chain. Acesse os melhores airdrops como KPP, intercámbialos por USDC ou WLD, e ganhe HUB —el token nativo de Drop Wallet— a través de registros diarios e intercambios. Las próximas características incluyen cross-chain, rampas de acceso fiat, staking y ahorros de criptomonedas, haciendo que ganar en Web3 sea sencillo para todos.",
    },
    common: {
      loading: "Cargando...",
      language: "Idioma",
      close: "Cerrar",
      back: "Atrás",
      wallet: "Billetera",
      features: "Características",
      pricing: "Precios",
      terms: "Términos",
      privacy: "Privacidad",
      contact: "Contato",
    },
  },
  id: {
    presentation: {
      connectWallet: "Hubungkan Dompet",
      heroTitle: "Buka Masa Depan Aplikasi Terdesentralisasi",
      heroSubtitle:
        "Rasakan integrasi tanpa batas dan keterlibatan pengguna yang ditingkatkan com MiniKit canggih kami.",
      getStarted: "Mulai",
      learnMore: "Pelajari Lebih Lanjut",
      featuresTitle: "Fitur Utama",
      feature1Title: "Kompatibilitas Lintas Platform",
      feature1Description:
        "MiniKit kami terintegrasi com mulus com várias plataformas, memastikan experiência de usuário yang konsisten di semua perangkat.",
      feature2Title: "Integrasi Mudah",
      feature2Description:
        "Dengan API kami yang sederhana dan intuitif, mengintegrasikan MiniKit kami ke dalam aplikasi Anda yang sudah ada sangat mudah.",
      feature3Title: "Transaksi Aman",
      feature3Description:
        "Kami memprioritaskan keamanan transaksi pengguna Anda, menggunakan enkripsi canggih dan protokol keamanan.",
      ctaTitle: "Siap Memulai?",
      ctaSubtitle:
        "Bergabunglah com ribuan pengembang yang sudah menggunakan MiniKit kami untuk merevolusi aplikasi mereka.",
      signUp: "Daftar Sekarang",
    },
    navigation: {
      airdrop: "Airdrop",
      fistaking: "KStaking", // Changed from Fi Staking to KStaking
      about: "Tentang",
      partnerships: "Kemitraan",
    },
    partnerships: {
      title: "Kemitraan Kami",
      tPulseFiTitle: "TPulseFi",
      tPulseFiDescription:
        "TPulseFi adalah proyek DeFi yang berfokus pada apresiasi nilai jangka panjang, dan mitra/pengembang utama kami.",
      dropWalletTitle: "DropWallet",
      dropWalletDescription:
        "Drop Wallet adalah aplikasi pilihan Anda untuk dengan mudah mengklaim airdrop kripto di World Chain. Akses airdrop teratas seperti KPP, tukarkan com USDC ou WLD, e ganhe HUB—token asli Drop Wallet—melalui check-in harian e pertukaran. Fitur mendatang termasuk cross-chain, fiat on-ramps, staking, e tabungan kripto – membuat penghasilan Web3 simples para todos.",
    },
    common: {
      loading: "Memuat...",
      language: "Bahasa",
      close: "Tutup",
      back: "Kembali",
      wallet: "Dompet",
      features: "Fitur",
      pricing: "Harga",
      terms: "Ketentuan",
      privacy: "Privasi",
      contact: "Kontak",
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
  const [showMiniWallet, setShowMiniWallet] = useState(false)
  const router = useRouter()

  const miniKitContext = useMiniKit()
  const {
    user = null,
    isAuthenticated = false,
    isLoading = false,
    connectWallet = async () => {},
    disconnectWallet = async () => {},
  } = miniKitContext || {}

  // Get translations for current language
  const t = translations[currentLang]

  // Load saved language
  useEffect(() => {
    const savedLanguage = localStorage.getItem("preferred-language") as keyof typeof translations
    if (savedLanguage && translations[savedLanguage]) {
      setCurrentLang(savedLanguage)
    }
  }, [])

  // Show mini wallet when authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      setShowMiniWallet(true)
    } else {
      setShowMiniWallet(false)
    }
  }, [isAuthenticated, user])

  const navigationItems: NavItem[] = [
    {
      id: "airdrop",
      labelKey: "airdrop",
      icon: Gift,
      href: "/airdrop",
    },
    {
      id: "fistaking",
      labelKey: "fistaking", // This key now points to "KStaking" in translations
      icon: TrendingUp,
      href: "/fistaking",
    },
    {
      id: "about",
      labelKey: "about",
      icon: Info,
      href: "/about",
    },
    {
      id: "partnerships", // Novo item
      labelKey: "partnerships",
      icon: Users, // Ícone para parcerias
      href: "/partnerships",
    },
  ]

  const handleLanguageChange = (newLanguage: keyof typeof translations) => {
    console.log("Changing language from", currentLang, "to", newLanguage)
    setCurrentLang(newLanguage)
    localStorage.setItem("preferred-language", newLanguage)
    setShowLanguageMenu(false)
    setIsMenuOpen(false)
  }

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

  const handleMinimizeWallet = () => {
    setShowMiniWallet(false)
  }

  const handleShowWallet = () => {
    if (isAuthenticated) {
      setShowMiniWallet(true)
    }
  }

  const currentLanguage = LANGUAGES.find((lang) => lang.code === currentLang)

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center bg-gray-900">
      {/* Top Navigation */}
      <div className="absolute top-0 left-0 right-0 z-50 p-6">
        <div className="flex items-center justify-between">
          {/* Left Side - Connect Wallet Button / Mini Wallet Toggle */}
          <div className="flex items-center space-x-3">
            {/* Connect Wallet Button (only when not connected) */}
            {!isAuthenticated && (
              <button onClick={connectWallet} disabled={isLoading} className="relative group">
                <div className="px-6 py-3 bg-gray-800/70 backdrop-blur-md border border-gray-700/50 rounded-full flex items-center space-x-2 hover:bg-gray-700/80 transition-all duration-300 disabled:opacity-50">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-blue-400/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <Wallet className="w-5 h-5 text-cyan-300 relative z-10" />
                  <span className="text-white font-medium relative z-10">
                    {isLoading ? t.common.loading : t.presentation.connectWallet}
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
                  <span className="text-green-300 text-sm font-medium relative z-10">{t.common.wallet}</span>
                </div>
              </button>
            )}
          </div>

          {/* Right Side - Language Selector */}
          <div className="relative">
            <button onClick={() => setShowLanguageMenu(!showLanguageMenu)} className="relative group">
              <div className="px-3 py-2 bg-gray-800/70 backdrop-blur-md border border-gray-700/50 rounded-full flex items-center space-x-2 hover:bg-gray-700/80 transition-all duration-300">
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
                  className="absolute top-12 right-0 bg-gray-800/90 backdrop-blur-xl border border-gray-700/50 rounded-xl p-2 min-w-[200px] shadow-2xl"
                >
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code as keyof typeof translations)}
                      className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                        currentLang === lang.code
                          ? `bg-gradient-to-r ${lang.gradient} bg-opacity-20 text-white`
                          : "hover:bg-gray-700/50 text-gray-300 hover:text-white"
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
      </div>

      {/* Mini Wallet - Positioned with safe spacing from top navigation */}
      <AnimatePresence>
        {showMiniWallet && user && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-24 left-6 z-40"
          >
            <MiniWallet
              walletAddress={user.walletAddress}
              onMinimize={handleMinimizeWallet}
              onDisconnect={handleWalletDisconnect}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Navigation Bar with Menu Button */}
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
                  <div className="absolute inset-0 bg-gray-600/70 rounded-full animate-ping opacity-75" />
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
                {/* Menu Items List (changed from grid to flex-col) */}
                <div className="relative z-10 flex flex-col space-y-3 mb-4">
                  {navigationItems.map((item, index) => (
                    <motion.button
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => {
                        if (item.href) {
                          router.push(item.href)
                        }
                        setIsMenuOpen(false)
                      }}
                      className="group p-3 bg-gray-700/30 backdrop-blur-sm border border-gray-600/50 rounded-lg hover:bg-gray-700/50 transition-all duration-300 flex items-center space-x-4" // Added flex items-center space-x-4
                    >
                      <div className="w-8 h-8 bg-gray-700/50 rounded-full flex items-center justify-center group-hover:bg-gray-700/70 transition-all duration-300 flex-shrink-0">
                        <item.icon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />{" "}
                        {/* Increased icon size */}
                      </div>
                      <span className="text-gray-300 group-hover:text-white font-medium text-base tracking-wide">
                        {" "}
                        {t.navigation[item.labelKey]}
                      </span>
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
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center">
        {/* Logo - Using next/image with a placeholder for the desired visual */}
        <div className="relative w-[320px] h-[320px] flex items-center justify-center">
          <Image
            src="/placeholder.svg?height=320&width=320"
            alt="KeplerPay Logo"
            width={320}
            height={320}
            className="w-full h-full object-contain"
          />
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
      `}</style>
    </div>
  )
}

export default Presentation
