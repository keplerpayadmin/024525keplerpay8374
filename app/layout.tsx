import type React from "react"
import type { Metadata } from "next/types"
import { Inter } from "next/font/google"
import "./globals.css"
import { MiniKitProvider } from "@/components/minikit-provider"
import { I18nProvider } from "@/lib/i18n/context" // Importar I18nProvider

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Kepler App",
  description: "Kepler app with World ID verification",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <MiniKitProvider>
          <I18nProvider>
            {" "}
            {/* Adicionar I18nProvider aqui */}
            {children}
          </I18nProvider>
        </MiniKitProvider>
      </body>
    </html>
  )
}
