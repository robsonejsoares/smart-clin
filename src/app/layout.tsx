import "./globals.css";
import type { Metadata } from "next";
import { Toaster } from 'sonner'
import { Geist, Geist_Mono } from "next/font/google";
import { SessionAuthProvider } from "@/components/session-auth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SmartClin",
  description: "Sistema de gestão para clínicas.",
  icons: {
    icon: "/logo-smart-clin.svg?v=2",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
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
      </body>
    </html>
  );
}