<<<<<<< HEAD
import "./globals.css";
import type { Metadata } from "next";
import { Toaster } from 'sonner'
import { Geist, Geist_Mono } from "next/font/google";
import { SessionAuthProvider } from "@/components/session-auth";
=======
﻿import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { SessionAuthProvider } from "@/components/session-auth"
import { QueryClientContext } from "@/providers/queryclient"
import { Toaster } from "sonner"
>>>>>>> d21dfe2fc873b266a0a127c59f81f36621db9916

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "SmartClin",
  description: "Sua saúde de forma simples, rápida e organizada.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} min-h-full antialiased`}
    >
<<<<<<< HEAD
      <body className="min-h-full flex flex-col">
        <SessionAuthProvider>
          <Toaster
            duration={2500}
          />
          <Toaster
            duration={2500}
          />
          {children}
        </SessionAuthProvider>
=======
      <body className="min-h-screen bg-background font-sans text-foreground antialiased"><SessionAuthProvider><QueryClientContext>{children}</QueryClientContext>
        <Toaster
          position="bottom-right"
          richColors
          closeButton
          toastOptions={{
            classNames: {
              toast: "rounded-md border border-border/70 bg-background/95 text-foreground shadow-xl shadow-black/5 backdrop-blur-sm transition-all duration-300 ease-out",
              title: "font-semibold tracking-tight",
              description:
                "text-sm leading-5 text-muted-foreground",
              closeButton:
                "border-border/70 bg-background text-muted-foreground hover:border-[#252579]/25 hover:bg-[#252579]/5 hover:text-[#252579]",
              success:
                "border-emerald-500/20 bg-emerald-500/[0.05] text-foreground",
              error:
                "border-red-500/20 bg-red-500/[0.05] text-foreground",
            },
          }}
        />
      </SessionAuthProvider>
>>>>>>> d21dfe2fc873b266a0a127c59f81f36621db9916
      </body>
    </html>
  )
}
