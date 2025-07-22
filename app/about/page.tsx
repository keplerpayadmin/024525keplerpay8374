"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

// Supported languages
const SUPPORTED_LANGUAGES = ["en", "pt", "es", "id"] as const
type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number]

// Translations for about page
const translations = {
  en: {
    title: "About TPulseFi",
    subtitle: "Learn about the TPulseFi project",
    about: "About",
    roadmap: "Roadmap",
    tokenomics: "Tokenomics",
    description:
      "TPulseFi is a DeFi project designed for long-term market appreciation, rewarding its users with daily airdrops.",
    whyChoose: "Why choose TPulseFi?",
    dailyAirdrops: "Daily Airdrops",
    dailyAirdropsDesc: "Rewards for loyal holders",
    activeCommunity: "Active Community",
    activeCommunityDesc: "Exclusive events and rewards",
    utility: "Utility",
    utilityDesc: "Transfer, play, and earn in one ecosystem",
    longTermVision: "Long-term Vision",
    longTermVisionDesc: "Sustainable growth and innovation",
    // Roadmap
    phase1: "Phase 1",
    phase2: "Phase 2",
    phase3: "Phase 3",
    completed: "Completed",
    inDevelopment: "In Development",
    futureGoals: "Future Goals",
    tokenLaunch: "Token Launch",
    websiteAndDocs: "Website and Documentation",
    communityGrowth: "Community Growth",
    miniApp: "Mini-App (Worldcoin AppStore)",
    airdropCampaigns: "Airdrop Campaigns",
    fiGames: "Fi Games",
    fiStaking: "FiStaking (12% APY)",
    pulseGame: "Pulse Game",
    fiPay: "FiPay",
    enhancedSecurity: "Enhanced Security",
    exchangeListings: "Exchange Listings",
    ecosystemExpansion: "TPulseFi Ecosystem Expansion",
    partnerships: "Partnerships",
    mobileApp: "Mobile App",
    // Tokenomics
    tpfTokenomics: "TPF Tokenomics",
    totalSupply: "Total Supply: 1,000,000,000 (1 Billion)",
    liquidity: "Liquidity",
    staking: "Staking",
    team: "Team",
    marketing: "Marketing",
    reserve: "Reserve",
    tokenDetails: "Token Details",
    name: "Name",
    symbol: "Symbol",
    network: "Network",
    type: "Type",
    back: "Back",
  },
  pt: {
    title: "Sobre TPulseFi",
    subtitle: "Saiba mais sobre o projeto TPulseFi",
    about: "Sobre",
    roadmap: "Roteiro",
    tokenomics: "Tokenomics",
    description:
      "TPulseFi é um projeto DeFi projetado para valorização de mercado a longo prazo, recompensando seus usuários com airdrops diários.",
    whyChoose: "Por que escolher TPulseFi?",
    dailyAirdrops: "Airdrops Diários",
    dailyAirdropsDesc: "Recompensas para detentores leais",
    activeCommunity: "Comunidade Ativa",
    activeCommunityDesc: "Eventos exclusivos e recompensas",
    utility: "Utilidade",
    utilityDesc: "Transferir, jogar e ganhar em um ecossistema",
    longTermVision: "Visão de Longo Prazo",
    longTermVisionDesc: "Crescimento sustentável e inovação",
    // Roadmap
    phase1: "Fase 1",
    phase2: "Fase 2",
    phase3: "Fase 3",
    completed: "Concluído",
    inDevelopment: "Em Desenvolvimento",
    futureGoals: "Objetivos Futuros",
    tokenLaunch: "Lançamento do Token",
    websiteAndDocs: "Site e Documentação",
    communityGrowth: "Crescimento da Comunidade",
    miniApp: "Mini-App (Worldcoin AppStore)",
    airdropCampaigns: "Campanhas de Airdrop",
    fiGames: "Fi Games",
    fiStaking: "FiStaking (12% APY)",
    pulseGame: "Pulse Game",
    fiPay: "FiPay",
    enhancedSecurity: "Segurança Aprimorada",
    exchangeListings: "Listagens em Exchanges",
    ecosystemExpansion: "Expansão do Ecossistema TPulseFi",
    partnerships: "Parcerias",
    mobileApp: "Aplicativo Móvel",
    // Tokenomics
    tpfTokenomics: "Tokenomics TPF",
    totalSupply: "Fornecimento Total: 1.000.000.000 (1 Bilhão)",
    liquidity: "Liquidez",
    staking: "Staking",
    team: "Equipe",
    marketing: "Marketing",
    reserve: "Reserva",
    tokenDetails: "Detalhes do Token",
    name: "Nome",
    symbol: "Símbolo",
    network: "Rede",
    type: "Tipo",
    back: "Voltar",
  },
  es: {
    title: "Acerca de TPulseFi",
    subtitle: "Aprende sobre el proyecto TPulseFi",
    about: "Acerca de",
    roadmap: "Hoja de Ruta",
    tokenomics: "Tokenomics",
    description:
      "TPulseFi es un proyecto DeFi diseñado para la apreciación del mercado a largo plazo, recompensando a sus usuarios con airdrops diarios.",
    whyChoose: "¿Por qué elegir TPulseFi?",
    dailyAirdrops: "Airdrops Diarios",
    dailyAirdropsDesc: "Recompensas para holders leales",
    activeCommunity: "Comunidad Activa",
    activeCommunityDesc: "Eventos exclusivos y recompensas",
    utility: "Utilidad",
    utilityDesc: "Transferir, jugar y ganar en un ecosistema",
    longTermVision: "Visión a Largo Plazo",
    longTermVisionDesc: "Crecimiento sostenible e innovación",
    // Roadmap
    phase1: "Fase 1",
    phase2: "Fase 2",
    phase3: "Fase 3",
    completed: "Completado",
    inDevelopment: "En Desarrollo",
    futureGoals: "Objetivos Futuros",
    tokenLaunch: "Lanzamiento del Token",
    websiteAndDocs: "Sitio Web y Documentación",
    communityGrowth: "Crecimiento de la Comunidad",
    miniApp: "Mini-App (Worldcoin AppStore)",
    airdropCampaigns: "Campañas de Airdrop",
    fiGames: "Fi Games",
    fiStaking: "FiStaking (12% APY)",
    pulseGame: "Pulse Game",
    fiPay: "FiPay",
    enhancedSecurity: "Seguridad Mejorada",
    exchangeListings: "Listados en Exchanges",
    ecosystemExpansion: "Expansión del Ecosistema TPulseFi",
    partnerships: "Asociaciones",
    mobileApp: "Aplicación Móvil",
    // Tokenomics
    tpfTokenomics: "Tokenomics TPF",
    totalSupply: "Suministro Total: 1,000,000,000 (1 Mil Millones)",
    liquidity: "Liquidez",
    staking: "Staking",
    team: "Equipo",
    marketing: "Marketing",
    reserve: "Reserva",
    tokenDetails: "Detalles del Token",
    name: "Nombre",
    symbol: "Símbolo",
    network: "Red",
    type: "Tipo",
    back: "Volver",
  },
  id: {
    title: "Tentang TPulseFi",
    subtitle: "Pelajari tentang proyek TPulseFi",
    about: "Tentang",
    roadmap: "Peta Jalan",
    tokenomics: "Tokenomics",
    description:
      "TPulseFi adalah proyek DeFi yang dirancang untuk apresiasi pasar jangka panjang, memberikan reward kepada penggunanya dengan airdrop harian.",
    whyChoose: "Mengapa memilih TPulseFi?",
    dailyAirdrops: "Airdrop Harian",
    dailyAirdropsDesc: "Hadiah untuk pemegang setia",
    activeCommunity: "Komunitas Aktif",
    activeCommunityDesc: "Acara eksklusif dan hadiah",
    utility: "Utilitas",
    utilityDesc: "Transfer, bermain, dan dapatkan dalam satu ekosistem",
    longTermVision: "Visi Jangka Panjang",
    longTermVisionDesc: "Pertumbuhan berkelanjutan dan inovasi",
    // Roadmap
    phase1: "Fase 1",
    phase2: "Fase 2",
    phase3: "Fase 3",
    completed: "Selesai",
    inDevelopment: "Dalam Pengembangan",
    futureGoals: "Tujuan Masa Depan",
    tokenLaunch: "Peluncuran Token",
    websiteAndDocs: "Website dan Dokumentasi",
    communityGrowth: "Pertumbuhan Komunitas",
    miniApp: "Mini-App (Worldcoin AppStore)",
    airdropCampaigns: "Kampanye Airdrop",
    fiGames: "Fi Games",
    fiStaking: "FiStaking (12% APY)",
    pulseGame: "Pulse Game",
    fiPay: "FiPay",
    enhancedSecurity: "Keamanan Ditingkatkan",
    exchangeListings: "Listing Exchange",
    ecosystemExpansion: "Ekspansi Ekosistem TPulseFi",
    partnerships: "Kemitraan",
    mobileApp: "Aplikasi Mobile",
    // Tokenomics
    tpfTokenomics: "Tokenomics TPF",
    totalSupply: "Total Supply: 1,000,000,000 (1 Miliar)",
    liquidity: "Likuiditas",
    staking: "Staking",
    team: "Tim",
    marketing: "Marketing",
    reserve: "Cadangan",
    tokenDetails: "Detail Token",
    name: "Nama",
    symbol: "Simbol",
    network: "Jaringan",
    type: "Tipe",
    back: "Kembali",
  },
}

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState<"about" | "roadmap" | "tokenomics">("about")
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

  // Get tokenomics data with translations
  const getTokenomicsData = () => [
    { name: t.liquidity, value: 40, color: "#3b82f6" },
    { name: t.staking, value: 25, color: "#8b5cf6" },
    { name: t.team, value: 15, color: "#ec4899" },
    { name: t.marketing, value: 10, color: "#10b981" },
    { name: t.reserve, value: 10, color: "#f59e0b" },
  ]

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
              KeplerPay App – Start Your Journey into Real Utility
            </span>
          </h1>
          <p className="text-gray-400 text-md leading-relaxed">
            The KeplerPay App is your entry point into a transparent, reward-driven Web3 ecosystem.
          </p>
        </motion.div>

        {/* Current Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 shadow-2xl mb-6"
        >
          <h2 className="text-xl font-semibold text-white mb-4">Current Features:</h2>
          <p className="text-gray-300 text-sm mb-4 leading-relaxed">
            Right now, you can stake your KPP and earn up to 12% APY, plus receive daily login bonuses – simply for
            staying active.
          </p>
          <ul className="text-left space-y-3 text-gray-200">
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 text-lg">•</span>
              <span>KPP Staking with up to 12% annual rewards</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 text-lg">•</span>
              <span>Daily Login Bonus – get rewarded every day you log in</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 text-lg">•</span>
              <span>Real-time balance and earnings overview</span>
            </li>
          </ul>
        </motion.div>

        {/* Coming Soon Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 shadow-2xl mb-8"
        >
          <h2 className="text-xl font-semibold text-white mb-4">Coming Soon:</h2>
          <ul className="text-left space-y-3 text-gray-200">
            <li className="flex items-start gap-2">
              <span className="text-purple-400 text-lg">•</span>
              <span>In-app wallet & QR payments</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400 text-lg">•</span>
              <span>Stablecoin integration & token swap</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400 text-lg">•</span>
              <span>Institutional partnerships (hospitals, schools, NGOs)</span>
            </li>
          </ul>
        </motion.div>

        {/* Call to Action */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="text-white text-lg font-bold bg-gradient-to-r from-blue-500 to-purple-500 py-4 px-6 rounded-full shadow-lg"
        >
          Stake. Earn. Be part of something real.
        </motion.p>
      </motion.div>
    </main>
  )
}
