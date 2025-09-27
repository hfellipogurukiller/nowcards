import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Suspense } from "react"
import { UserProvider } from "@/lib/user-context"
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "@/components/theme-provider"

export const metadata: Metadata = {
  title: "NowCards - Sistema de Estudo MCQ",
  description: "Plataforma de estudo com cartões de múltipla escolha para múltiplos usuários",
  generator: "Next.js",
  manifest: "/manifest.json",
  themeColor: "#1e3a8a",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "NowCards",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "NowCards",
    title: "NowCards - Sistema de Estudo MCQ",
    description: "Plataforma de estudo com cartões de múltipla escolha para múltiplos usuários",
  },
  icons: {
    icon: "/logo_botao.png",
    shortcut: "/logo_botao.png",
    apple: "/logo_botao.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          <UserProvider>
            <Suspense>
              {children}
              <Analytics />
            </Suspense>
            <Toaster />
          </UserProvider>
        </ThemeProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  )
}
