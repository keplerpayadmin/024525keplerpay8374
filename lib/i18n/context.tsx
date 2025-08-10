"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export type Language = "en" | "pt" | "es" | "id"

const translations = {
  en: {
    common: {
      back: "Back",
      loading: "Loading...",
      error: "Error",
      success: "Success",
      confirm: "Confirm",
      cancel: "Cancel",
      processing: "Processing", // Adicionado para consistência
    },
    navigation: {
      home: "Home",
      wallet: "Wallet",
      staking: "Staking",
      membership: "Membership",
      news: "News",
      about: "About",
      airdrop: "Airdrop",
      partnerships: "Partnerships",
    },
    airdrop: {
      title: "Daily Airdrop",
      everyDayReward: "Every day you have TPF waiting for you, see what you earn today",
      verifying: "Verifying World ID...",
      verified: "World ID Verified!",
      verificationFailed: "World ID Not Verified",
      clickToBreakChain: "Click the box to break the chain",
      breakingChain: "Breaking chain...",
      processing: "Processing...",
      claim: "Claim",
      claimed: "Claimed",
      claimSuccessful: "Tokens claimed successfully",
      claimFailed: "An error occurred during the claim. Please try again.",
      nextClaimIn: "Next claim available in",
      hours: "Hours",
      minutes: "Minutes",
      seconds: "Seconds",
    },
    partnerships: {
      title: "Partnerships",
      subtitle: "Our strategic partners",
      ourPartners: "Our Partners",
      holdstationTitle: "HoldStation",
      holdstationDescription: "Advanced trading and swap platform for WorldChain",
      axoDescription: "Claim cute free tokens everyday!",
      dropWalletTitle: "DropWallet",
      dropWalletDescription:
        "Drop Wallet is your go-to app for easily claiming crypto airdrops on the World Chain.Access top airdrops like KPP, swap them for USDC or WLD, and earn HUB—Drop Wallet’s native token—via daily check-ins and swaps.Upcoming features include cross-chain, fiat on-ramps, staking, and crypto savings – making Web3 earning simple for everyone.",
      tPulseFiTitle: "TPulseFi",
      tPulseFiDescription:
        "TPulseFi is a DeFi project whose main focus is long-term appreciation, giving utility to the token and value to users.",
      humanTapDescription: "Invite friends - For real humans only",
      visitApp: "Visit App",
      claimNow: "Claim Now",
      morePartnerships: "More partnerships",
      comingSoon: "Coming soon...",
    },
    staking: {
      // Nova seção para staking
      title: "FiStaking",
      subtitle: "Passive earnings in KPP",
      claim: "Claim",
      claiming: "Claiming...",
      soon: "Soon",
      claimSuccess: "Claim Successful!",
      claimFailed: "Claim Failed",
      connectWalletFirst: "Connect your wallet first",
      pendingRewards: "Pending Rewards",
      dismiss: "Dismiss",
      powerActivated: "Power Activated",
    },
  },
  pt: {
    common: {
      back: "Voltar",
      loading: "Carregando...",
      error: "Erro",
      success: "Sucesso",
      confirm: "Confirmar",
      cancel: "Cancelar",
      processing: "Processando", // Adicionado para consistência
    },
    navigation: {
      home: "Início",
      wallet: "Carteira",
      staking: "Staking",
      membership: "Membros",
      news: "Notícias",
      about: "Sobre",
      airdrop: "Airdrop",
      partnerships: "Parcerias",
    },
    airdrop: {
      title: "Airdrop Diário",
      everyDayReward: "Todos os dias tens TPF à tua espera, vê o que ganhas hoje",
      verifying: "Verificando World ID...",
      verified: "World ID Verificado!",
      verificationFailed: "World ID Não Verificado",
      clickToBreakChain: "Clica na caixa para partir a corrente",
      breakingChain: "Partindo corrente...",
      processing: "Processando...",
      claim: "Reclamar",
      claimed: "Reclamado",
      claimSuccessful: "Tokens reclamados com sucesso",
      claimFailed: "Ocorreu um erro durante a reclamação. Tenta novamente.",
      nextClaimIn: "Próxima reclamação disponível em",
      hours: "Horas",
      minutes: "Minutos",
      seconds: "Segundos",
    },
    partnerships: {
      title: "Parcerias",
      subtitle: "Nossos parceiros estratégicos",
      ourPartners: "Nossos Parceiros",
      holdstationTitle: "HoldStation",
      holdstationDescription: "Plataforma avançada de trading e swap para WorldChain",
      axoDescription: "Reclama tokens fofos grátis todos os dias!",
      dropWalletTitle: "DropWallet",
      dropWalletDescription:
        "Drop Wallet é o seu aplicativo ideal para reivindicar facilmente airdrops de criptomoedas na World Chain. Acesse os principais airdrops como KPP, troque-os por USDC ou WLD e ganhe HUB – o token nativo da Drop Wallet – através de check-ins diários e swaps. Os próximos recursos incluem cross-chain, fiat on-ramps, staking e poupança de criptomoedas – tornando o ganho Web3 simples para todos.",
      tPulseFiTitle: "TPulseFi",
      tPulseFiDescription:
        "TPulseFi é um projeto DeFi que o principal foco é a valorização a longo prazo, dando utilidade ao token e dar valor aos usuários.",
      humanTapDescription: "Convida amigos - Apenas para humanos reais",
      visitApp: "Visitar App",
      claimNow: "Reclamar Agora",
      morePartnerships: "Mais parcerias",
      comingSoon: "Em breve...",
    },
    staking: {
      // Nova seção para staking
      title: "FiStaking",
      subtitle: "Ganhos passivos em KPP",
      claim: "Reclamar",
      claiming: "Reclamando...",
      soon: "Em Breve",
      claimSuccess: "Reclamação Bem-sucedida!",
      claimFailed: "Reclamação Falhou",
      connectWalletFirst: "Conecte sua carteira primeiro",
      pendingRewards: "Recompensas Pendentes",
      dismiss: "Dispensar",
      powerActivated: "Energia Ativada",
    },
  },
  es: {
    common: {
      back: "Volver",
      loading: "Cargando...",
      error: "Error",
      success: "Éxito",
      confirm: "Confirmar",
      cancel: "Cancelar",
      processing: "Procesando", // Adicionado para consistência
    },
    navigation: {
      home: "Inicio",
      wallet: "Billetera",
      staking: "Staking",
      membership: "Membresía",
      news: "Noticias",
      about: "Acerca de",
      airdrop: "Airdrop",
      partnerships: "Asociaciones",
    },
    airdrop: {
      title: "Airdrop Diario",
      everyDayReward: "Todos los días tienes TPF esperándote, ve lo que ganas hoy",
      verifying: "Verificando World ID...",
      verified: "¡World ID Verificado!",
      verificationFailed: "World ID No Verificado",
      clickToBreakChain: "Haz clic en la caja para romper la cadena",
      breakingChain: "Rompiendo cadena...",
      processing: "Procesando...",
      claim: "Reclamar",
      claimed: "Reclamado",
      claimSuccessful: "Tokens reclamados exitosamente",
      claimFailed: "Ocurrió un error durante la reclamación. Inténtalo de nuevo.",
      nextClaimIn: "Próximo reclamo disponible en",
      hours: "Horas",
      minutes: "Minutos",
      seconds: "Segundos",
    },
    partnerships: {
      title: "Asociaciones",
      subtitle: "Nuestros socios estratégicos",
      ourPartners: "Nuestros Socios",
      holdstationTitle: "HoldStation",
      holdstationDescription: "Plataforma avanzada de trading e intercambio para WorldChain",
      axoDescription: "¡Reclama tokens lindos gratis todos los días!",
      dropWalletTitle: "DropWallet",
      dropWalletDescription:
        "Drop Wallet es tu aplicación ideal para reclamar fácilmente airdrops de criptomonedas en la World Chain. Accede a los principales airdrops como KPP, intercámbialos por USDC o WLD, y gana HUB – el token nativo de Drop Wallet – a través de check-ins diarios e intercambios. Las próximas características incluyen cross-chain, fiat on-ramps, staking y ahorro de criptomonedas – haciendo que ganar en Web3 sea simple para todos.",
      tPulseFiTitle: "TPulseFi",
      tPulseFiDescription:
        "TPulseFi es un proyecto DeFi cuyo principal enfoque es la valorización a largo plazo, dando utilidad al token y valor a los usuarios.",
      humanTapDescription: "Invita amigos - Solo para humanos reales",
      visitApp: "Visitar App",
      claimNow: "Reclamar Ahora",
      morePartnerships: "Más asociaciones",
      comingSoon: "Próximamente...",
    },
    staking: {
      // Nova seção para staking
      title: "FiStaking",
      subtitle: "Ganancias pasivas en KPP",
      claim: "Reclamar",
      claiming: "Reclamando...",
      soon: "Pronto",
      claimSuccess: "¡Reclamación Exitosa!",
      claimFailed: "Reclamación Falló",
      connectWalletFirst: "Conecta tu billetera primero",
      pendingRewards: "Recompensas Pendientes",
      dismiss: "Descartar",
      powerActivated: "Energía Activada",
    },
  },
  id: {
    common: {
      back: "Kembali",
      loading: "Memuat...",
      error: "Kesalahan",
      success: "Berhasil",
      confirm: "Konfirmasi",
      cancel: "Batal",
      processing: "Memproses", // Adicionado para consistência
    },
    navigation: {
      home: "Beranda",
      wallet: "Dompet",
      staking: "Staking",
      membership: "Keanggotaan",
      news: "Berita",
      about: "Tentang",
      airdrop: "Airdrop",
      partnerships: "Kemitraan",
    },
    airdrop: {
      title: "Airdrop Harian",
      everyDayReward: "Setiap hari Anda memiliki TPF yang menunggu, lihat apa yang Anda dapatkan hari ini",
      verifying: "Memverifikasi World ID...",
      verified: "World ID Terverifikasi!",
      verificationFailed: "World ID Tidak Terverifikasi",
      clickToBreakChain: "Klik kotak untuk memutus rantai",
      breakingChain: "Memutus rantai...",
      processing: "Memproses...",
      claim: "Klaim",
      claimed: "Diklaim",
      claimSuccessful: "Token berhasil diklaim",
      claimFailed: "Terjadi kesalahan saat klaim. Silakan coba lagi.",
      nextClaimIn: "Klaim berikutnya tersedia dalam",
      hours: "Jam",
      minutes: "Menit",
      seconds: "Detik",
    },
    partnerships: {
      title: "Kemitraan",
      subtitle: "Mitra strategis kami",
      ourPartners: "Mitra Kami",
      holdstationTitle: "HoldStation",
      holdstationDescription: "Platform trading dan swap canggih untuk WorldChain",
      axoDescription: "Klaim token lucu gratis setiap hari!",
      dropWalletTitle: "DropWallet",
      dropWalletDescription:
        "Drop Wallet adalah aplikasi pilihan Anda untuk dengan mudah mengklaim airdrop kripto di World Chain. Akses airdrop teratas seperti KPP, tukarkan dengan USDC atau WLD, dan dapatkan HUB—token asli Drop Wallet—melalui check-in harian dan swap. Fitur mendatang termasuk cross-chain, fiat on-ramps, staking, dan tabungan kripto – membuat penghasilan Web3 sederhana untuk semua orang.",
      tPulseFiTitle: "TPulseFi",
      tPulseFiDescription:
        "TPulseFi adalah proyek DeFi yang fokus utamanya adalah apresiasi jangka panjang, memberikan utilitas pada token dan nilai kepada pengguna.",
      humanTapDescription: "Undang teman - Hanya untuk manusia asli",
      visitApp: "Kunjungi App",
      claimNow: "Klaim Sekarang",
      morePartnerships: "Lebih banyak kemitraan",
      comingSoon: "Segera hadir...",
    },
    staking: {
      // Nova seção para staking
      title: "FiStaking",
      subtitle: "Penghasilan pasif di KPP",
      claim: "Klaim",
      claiming: "Mengklaim...",
      soon: "Segera",
      claimSuccess: "Klaim Berhasil!",
      claimFailed: "Klaim Gagal",
      connectWalletFirst: "Hubungkan dompet Anda terlebih dahulu",
      pendingRewards: "Hadiah Tertunda",
      dismiss: "Tutup",
      powerActivated: "Daya Diaktifkan",
    },
  },
}

interface I18nContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: typeof translations.en
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  useEffect(() => {
    const stored = localStorage.getItem("preferred-language") as Language
    if (stored && stored in translations) {
      setLanguage(stored)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("preferred-language", language)
  }, [language])

  const value = {
    language,
    setLanguage,
    t: translations[language],
  }

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider")
  }
  return context
}
