import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import { MiniKitProvider } from "@/components/minikit-provider"
import { DebugConsole } from "@/components/debug-console" // Import DebugConsole
import { Toaster } from "@/components/ui/toaster" // Import Toaster for useToast

export const metadata: Metadata = {
  title: "v0 App",
  description: "Created with v0",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body className={GeistSans.className}>
        <MiniKitProvider>{children}</MiniKitProvider>
        <DebugConsole /> {/* Adicione o DebugConsole aqui */}
        <Toaster /> {/* Certifique-se de que o Toaster também está presente para as notificações */}
      </body>
    </html>
  )
}
