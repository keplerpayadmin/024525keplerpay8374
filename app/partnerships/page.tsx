"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { ArrowLeft, LinkIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"

// Supported languages
const SUPPORTED_LANGUAGES = ["en", "pt", "es", "id"] as const
type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number]

// Translations for partnerships page
const translations = {
  en: {
    title: "Our Partnerships",
    tPulseFiTitle: "TPulseFi",
    tPulseFiDescription:
      "TPulseFi is a DeFi project focused on long-term value appreciation, and our main partner/developer.",
    dropWalletTitle: "DropWallet",
    dropWalletDescription:
      "Drop Wallet is your go-to app for easily claiming crypto airdrops on the World Chain. Access top airdrops like KPP, swap them for USDC or WLD, and earn HUB—Drop Wallet’s native token—via daily check-ins and swaps. Upcoming features include cross-chain, fiat on-ramps, staking, and crypto savings – making Web3 earning simple for everyone.",
    back: "Back",
    learnMore: "Learn More",
  },
  pt: {
    title: "Nossas Parcerias",
    tPulseFiTitle: "TPulseFi",
    tPulseFiDescription:
      "TPulseFi é um projeto DeFi focado na valorização a longo prazo, e nosso principal parceiro/desenvolvedor.",
    dropWalletTitle: "DropWallet",
    dropWalletDescription:
      "Drop Wallet é o seu aplicativo ideal para reivindicar facilmente airdrops de criptomoedas na World Chain. Acesse os melhores airdrops como KPP, troque-os por USDC ou WLD e ganhe HUB — o token nativo da Drop Wallet — através de check-ins diários e trocas. Os próximos recursos incluem cross-chain, on-ramps fiduciárias, staking e poupança de criptomoedas – tornando o ganho Web3 simples para todos.",
    back: "Voltar",
    learnMore: "Saber Mais",
  },
  es: {
    title: "Nuestras Asociaciones",
    tPulseFiTitle: "TPulseFi",
    tPulseFiDescription:
      "TPulseFi es un proyecto DeFi centrado en la apreciación del valor a largo plazo, y nuestro principal socio/desarrollador.",
    dropWalletTitle: "DropWallet",
    dropWalletDescription:
      "Drop Wallet es tu aplicación ideal para reclamar fácilmente airdrops de criptomonedas en World Chain. Accede a los mejores airdrops como KPP, intercámbialos por USDC o WLD, y gana HUB —el token nativo de Drop Wallet— a través de registros diarios e intercambios. Las próximas características incluyen cross-chain, rampas de acceso fiat, staking y ahorros de criptomonedas, haciendo que ganar en Web3 sea sencillo para todos.",
    back: "Volver",
    learnMore: "Aprender Más",
  },
  id: {
    title: "Kemitraan Kami",
    tPulseFiTitle: "TPulseFi",
    tPulseFiDescription:
      "TPulseFi adalah proyek DeFi yang berfokus pada apresiasi nilai jangka panjang, dan mitra/pengembang utama kami.",
    dropWalletTitle: "DropWallet",
    dropWalletDescription:
      "Drop Wallet adalah aplikasi pilihan Anda untuk dengan mudah mengklaim airdrop kripto di World Chain. Akses airdrop teratas seperti KPP, tukarkan dengan USDC atau WLD, dan dapatkan HUB—token asli Drop Wallet—melalui check-in harian dan pertukaran. Fitur mendatang termasuk cross-chain, fiat on-ramps, staking, dan tabungan kripto – membuat penghasilan Web3 sederhana untuk semua orang.",
    back: "Kembali",
    learnMore: "Pelajari Lebih Lanjut",
  },
}

export default function PartnershipsPage() {
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>("en")
  const router = useRouter()

  // Load saved language
  useEffect(() => {
    const savedLanguage = localStorage.getItem("preferred-language") as SupportedLanguage
    if (savedLanguage && SUPPORTED_LANGUAGES.includes(savedLanguage)) {
      setCurrentLang(savedLanguage)
    }
  }, [])

  // Get translations for current language
  const t = translations[currentLang]

  const handleBack = () => {
    router.back()
  }

  return (
    <main className="min-h-screen bg-gray-900 relative overflow-hidden flex flex-col items-center pt-6 pb-8">
      {/* Moving Light Lines Background - Matches airdrop-client.tsx */}
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

      {/* Static Grid for Reference */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
          linear-gradient(rgba(34,211,238,0.3) 1px, transparent 1px),
          linear-gradient(90deg, rgba(34,211,238,0.3) 1px, transparent 1px)
        `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Central Glow Effect */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute w-80 h-80 bg-cyan-400/10 rounded-full blur-2xl animate-pulse"
          style={{ animationDelay: "0.5s" }}
        />
        <div
          className="absolute w-64 h-64 bg-blue-400/15 rounded-full blur-xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute w-48 h-48 bg-white/20 rounded-full blur-lg animate-pulse"
          style={{ animationDelay: "1.5s" }}
        />
      </div>

      {/* Floating Particles - Matches airdrop-client.tsx */}
      {[...Array(25)].map((_, i) => (
        <div
          key={`particle-${i}`}
          className="absolute rounded-full animate-ping"
          style={{
            width: `${2 + Math.random() * 4}px`,
            height: `${2 + Math.random() * 4}px`,
            backgroundColor:
              i % 3 === 0 ? "rgba(255,255,255,0.8)" : i % 3 === 1 ? "rgba(34,211,238,0.6)" : "rgba(59,130,246,0.4)",
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 4}s`,
            animationDuration: `${1 + Math.random() * 3}s`,
          }}
        />
      ))}

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

      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute top-6 left-4 z-20"
      >
        <button
          onClick={handleBack}
          className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
        >
          <div className="w-10 h-10 bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-full flex items-center justify-center hover:bg-gray-800/80 transition-all duration-300">
            <ArrowLeft className="w-5 h-5" />
          </div>
          <span className="text-sm font-medium">{t.back}</span>
        </button>
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 flex flex-col w-full max-w-md px-4 text-center"
      >
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 mt-12"
        >
          <h1 className="text-3xl font-bold tracking-tighter mb-2">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-200 via-white to-gray-300">
              {t.title}
            </span>
          </h1>
        </motion.div>

        {/* TPulseFi Partnership */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 shadow-2xl mb-6 flex flex-col items-center"
        >
          <Image src="/images/logo-tpf.png" alt="TPulseFi Logo" width={80} height={80} className="mb-4 rounded-full" />
          <h2 className="text-xl font-semibold text-white mb-2">{t.tPulseFiTitle}</h2>
          <p className="text-gray-300 text-sm mb-4 leading-relaxed">{t.tPulseFiDescription}</p>
          <a
            href="https://worldcoin.org/mini-app?app_id=app_a3a55e132983350c67923dd57dc22c5e&app_mode=mini-app"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <LinkIcon className="w-4 h-4" />
            {t.learnMore}
          </a>
        </motion.div>

        {/* DropWallet Partnership */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 shadow-2xl mb-8 flex flex-col items-center"
        >
          <Image src="/images/HUB.png" alt="DropWallet HUB Logo" width={80} height={80} className="mb-4 rounded-full" />
          <h2 className="text-xl font-semibold text-white mb-2">{t.dropWalletTitle}</h2>
          <p className="text-gray-300 text-sm mb-4 leading-relaxed">{t.dropWalletDescription}</p>
          <a
            href="https://worldcoin.org/mini-app?app_id=app_459cd0d0d3125864ea42bd4c19d1986c&path=/dlink/KeplerPay"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-full text-sm font-medium hover:bg-purple-700 transition-colors"
          >
            <LinkIcon className="w-4 h-4" />
            {t.learnMore}
          </a>
        </motion.div>
      </motion.div>
    </main>
  )
}
