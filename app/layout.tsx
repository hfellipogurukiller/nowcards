import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Suspense } from "react"
import { UserProvider } from "@/lib/user-context"

export const metadata: Metadata = {
  title: "nowcards - Sistema de Estudo MCQ",
  description: "Plataforma de estudo com cartões de múltipla escolha para múltiplos usuários",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <UserProvider>
          <Suspense>
            {children}
            <Analytics />
          </Suspense>
        </UserProvider>
      </body>
    </html>
  )
}
