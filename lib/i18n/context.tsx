"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Supported languages
const SUPPORTED_LANGUAGES = ["en", "pt", "es", "id"] as const
type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number]

// Translations object (simplified for example, would be more extensive in a real app)
const translations = {
  en: {
    common: {
      back: "Back",
    },
    airdrop: {
      title: "Daily Airdrop",
      pressToReveal: "Press the orb to reveal your airdrop!",
      revealingAirdrop: "Revealing airdrop...",
      claim: "Claim Airdrop",
      processing: "Processing...",
      claimSuccessful: "Airdrop Claimed!",
      claimFailed: "Airdrop Claim Failed",
      alreadyClaimedError: "You have already claimed your airdrop for today. Please wait 24 hours.",
      nextClaimIn: "Next claim in:",
      hours: "Hours",
      minutes: "Minutes",
      seconds: "Seconds",
      waitCountdown: "Please wait for the countdown to finish.",
    },
    // Add other page translations here
  },
  pt: {
    common: {
      back: "Voltar",
    },
    airdrop: {
      title: "Airdrop Diário",
      pressToReveal: "Pressione o orbe para revelar seu airdrop!",
      revealingAirdrop: "Revelando airdrop...",
      claim: "Reclamar Airdrop",
      processing: "Processando...",
      claimSuccessful: "Airdrop Reclamado!",
      claimFailed: "Falha ao Reclamar Airdrop",
      alreadyClaimedError: "Você já reivindicou seu airdrop hoje. Por favor, aguarde 24 horas.",
      nextClaimIn: "Próxima reivindicação em:",
      hours: "Horas",
      minutes: "Minutos",
      seconds: "Segundos",
      waitCountdown: "Por favor, aguarde a contagem regressiva terminar.",
    },
    // Add other page translations here
  },
  es: {
    common: {
      back: "Volver",
    },
    airdrop: {
      title: "Airdrop Diario",
      pressToReveal: "¡Presiona el orbe para revelar tu airdrop!",
      revealingAirdrop: "Revelando airdrop...",
      claim: "Reclamar Airdrop",
      processing: "Procesando...",
      claimSuccessful: "¡Airdrop Reclamado!",
      claimFailed: "Fallo al Reclamar Airdrop",
      alreadyClaimedError: "Ya has reclamado tu airdrop por hoy. Por favor, espera 24 horas.",
      nextClaimIn: "Próximo reclamo en:",
      hours: "Horas",
      minutes: "Minutos",
      seconds: "Segundos",
      waitCountdown: "Por favor, espera a que termine la cuenta regresiva.",
    },
    // Add other page translations here
  },
  id: {
    common: {
      back: "Kembali",
    },
    airdrop: {
      title: "Airdrop Harian",
      pressToReveal: "Tekan bola untuk mengungkapkan airdrop Anda!",
      revealingAirdrop: "Mengungkap airdrop...",
      claim: "Klaim Airdrop",
      processing: "Memproses...",
      claimSuccessful: "Airdrop Berhasil Diklaim!",
      claimFailed: "Klaim Airdrop Gagal",
      alreadyClaimedError: "Anda sudah mengklaim airdrop Anda hari ini. Harap tunggu 24 jam.",
      nextClaimIn: "Klaim berikutnya dalam:",
      hours: "Jam",
      minutes: "Menit",
      seconds: "Detik",
      waitCountdown: "Harap tunggu hitungan mundur selesai.",
    },
    // Add other page translations here
  },
}

type Translations = typeof translations.en

interface I18nContextType {
  t: Translations
  currentLang: SupportedLanguage
  setLanguage: (lang: SupportedLanguage) => void
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>("en")

  useEffect(() => {
    // Attempt to load language from localStorage
    const savedLanguage = localStorage.getItem("preferred-language") as SupportedLanguage
    if (savedLanguage && SUPPORTED_LANGUAGES.includes(savedLanguage)) {
      setCurrentLang(savedLanguage)
    } else {
      // Fallback to browser language or default to 'en'
      const browserLang = navigator.language.split("-")[0] as SupportedLanguage
      if (SUPPORTED_LANGUAGES.includes(browserLang)) {
        setCurrentLang(browserLang)
      } else {
        setCurrentLang("en")
      }
    }
  }, [])

  const setLanguage = (lang: SupportedLanguage) => {
    setCurrentLang(lang)
    localStorage.setItem("preferred-language", lang)
  }

  const t = translations[currentLang] || translations.en

  return <I18nContext.Provider value={{ t, currentLang, setLanguage }}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (context === undefined) {
    throw new Error("useI18n must be used within an I18nProvider")
  }
  return context
}
