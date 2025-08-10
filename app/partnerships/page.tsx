"use client" // Adicionar esta linha

import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"
import { useI18n } from "@/lib/i18n/context"

export default function PartnershipsPage() {
  const { t } = useI18n()

  const partners = [
    {
      title: t.partnerships.tPulseFiTitle,
      description: t.partnerships.tPulseFiDescription,
      image: "/logo-tpf.png",
      link: "https://worldcoin.org/mini-app?app_id=app_a3a55e132983350c67923dd57dc22c5e&app_mode=mini-app",
    },
    {
      title: t.partnerships.dropWalletTitle,
      description: t.partnerships.dropWalletDescription,
      image: "/drop-wallet.jpeg",
      link: "https://worldcoin.org/mini-app?app_id=app_459cd0d0d3125864ea42bd4c19d1986c&path=/dlink/KeplerPay",
    },
  ]

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-4 sm:p-8 relative">
      {/* Back Button */}
      <div className="absolute top-4 left-4 z-50">
        <Link
          href="/dashboard" // Link de volta para o dashboard
          className="flex items-center gap-2 px-4 py-2 bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-full text-white hover:bg-gray-800/80 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">{t.common.back}</span>
        </Link>
      </div>

      <div className="max-w-4xl mx-auto text-center mt-16 sm:mt-24">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-200 via-white to-gray-300">
          {t.partnerships.title}
        </h1>
        <p className="text-lg sm:text-xl text-gray-300 mb-10 leading-relaxed">{t.partnerships.subtitle}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {partners.map((partner, index) => (
            <div
              key={index}
              className="bg-gray-900/70 backdrop-blur-md rounded-xl p-6 sm:p-8 border border-gray-700/50 shadow-xl flex flex-col items-center text-center"
            >
              <div className="relative w-32 h-32 mb-6 rounded-full overflow-hidden border-2 border-yellow-400/50 shadow-lg">
                <Image
                  src={partner.image || "/placeholder.svg"}
                  alt={partner.title}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-full"
                />
              </div>
              <h2 className="text-2xl font-bold text-yellow-400 mb-3">{partner.title}</h2>
              <p className="text-md text-gray-300 mb-6 flex-grow">{partner.description}</p>
              <Link
                href={partner.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-semibold rounded-full shadow-lg hover:from-yellow-400 hover:to-orange-400 transition-all duration-200"
              >
                {t.partnerships.visitApp}
              </Link>
            </div>
          ))}
        </div>

        <div className="text-gray-500 text-sm mt-16">
          Developed By <span className="text-gray-400 font-medium">@PulseCode</span>
        </div>
      </div>
    </div>
  )
}
