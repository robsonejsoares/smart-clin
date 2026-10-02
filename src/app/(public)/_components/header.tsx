"use client"

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"

import Link from "next/link"
import { useState } from "react"
import { ArrowRight, LogIn, Menu } from "lucide-react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { LoadingLink } from "@/components/loading-link"
import { handRegister } from "../_actions/login"

export function Header() {
    const [isOpen, setIsOpen] = useState(false)
    const [isLoggingIn, setIsLoggingIn] = useState(false)
    const { data: session, status } = useSession()


    const navItems = [
        { href: "#profissionais", label: "Profissionais" },
    ]

    async function handleLogin() {
        setIsLoggingIn(true)

        try {
            await handRegister("google")
        } finally {
            setIsLoggingIn(false)
        }
    }

    return (
        <header className="group relative fixed left-0 right-0 top-0 z-[999] overflow-hidden border-b border-border/60 bg-background/90 px-4 py-3 shadow-sm shadow-black/[0.04] backdrop-blur-xl sm:px-6">
            {/* Linha gradiente superior com a animação idêntica ao painel */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 z-20 h-px"
            >
                <div className="smartclin-dashboard-line-top h-full bg-gradient-to-r from-emerald-400 via-[#252579] to-violet-500 blur-[0.5px]" />
            </div>

            {/* Linha gradiente inferior com a animação idêntica ao painel */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-px"
            >
                <div className="smartclin-dashboard-line-bottom ml-auto h-full bg-gradient-to-l from-emerald-400 via-[#252579] to-violet-500 blur-[0.5px]" />
            </div>

            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
            >
                <div className="absolute -inset-x-32 -inset-y-24 bg-[linear-gradient(110deg,rgba(16,185,129,0.018),rgba(37,37,121,0.035),rgba(139,92,246,0.018),rgba(16,185,129,0.025),rgba(37,37,121,0.018))] bg-[length:250%_250%] animate-[smartclin-shimmer_14s_linear_infinite]" />
            </div>

            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-[1600ms] ease-out group-hover:opacity-100"
            >
                <div className="absolute -left-24 -top-20 h-40 w-72 rounded-full bg-emerald-500/[0.035] blur-3xl transition-transform duration-[2200ms] ease-out group-hover:translate-x-10 group-hover:translate-y-4" />

                <div className="absolute left-1/3 -top-24 h-40 w-80 rounded-full bg-[#252579]/[0.035] blur-3xl transition-transform duration-[2400ms] ease-out group-hover:translate-y-6 group-hover:scale-110" />

                <div className="absolute right-[-5%] -top-20 h-40 w-72 rounded-full bg-violet-500/[0.025] blur-3xl transition-transform duration-[2200ms] ease-out group-hover:-translate-x-10 group-hover:translate-y-4" />
            </div>

            <div
                aria-hidden="true"
                className="pointer-events-none absolute left-[8%] top-0 h-16 w-56 -translate-y-8 rounded-full bg-gradient-to-r from-emerald-500/[0.025] via-[#252579]/[0.04] to-violet-500/[0.025] opacity-0 blur-3xl transition-all duration-[1800ms] ease-out group-hover:translate-y-0 group-hover:opacity-100"
            />

            <div
                aria-hidden="true"
                className="pointer-events-none absolute right-[8%] top-0 h-16 w-56 -translate-y-8 rounded-full bg-gradient-to-r from-violet-500/[0.02] via-[#252579]/[0.035] to-emerald-500/[0.025] opacity-0 blur-3xl transition-all duration-[1800ms] ease-out group-hover:translate-y-0 group-hover:opacity-100"
            />

            <div className="container relative mx-auto flex h-11 items-center justify-between">
                <Link
                    href="/"
                    aria-label="Ir para a página inicial"
                    className="group/logo relative flex items-center rounded-xl px-1 py-1 text-2xl font-bold tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#252579]/40 focus-visible:ring-offset-2 sm:text-3xl"
                >
                    <span className="text-[#17172f] transition-[color,transform] duration-500 ease-out group-hover/logo:-translate-y-0.5 group-hover/logo:text-[#11112a]">
                        Smart
                    </span>

                    <span className="relative ml-1 bg-gradient-to-r from-emerald-500 via-[#252579] to-violet-500 bg-[length:200%_100%] bg-[position:0%_50%] bg-clip-text text-transparent transition-[background-position,filter,transform] duration-[1800ms] ease-out group-hover/logo:-translate-y-0.5 group-hover/logo:bg-[position:100%_50%] group-hover/logo:drop-shadow-[0_0_7px_rgba(16,185,129,0.22)]">
                        Clin

                        <span
                            aria-hidden="true"
                            className="absolute -bottom-1 left-0 h-px w-0 bg-gradient-to-r from-[#252579] via-emerald-500 to-violet-500 opacity-0 transition-[width,opacity] duration-[1800ms] ease-out group-hover/logo:w-full group-hover/logo:opacity-80"
                        />

                        <span
                            aria-hidden="true"
                            className="pointer-events-none absolute -inset-x-3 -inset-y-2 -z-10 rounded-full bg-gradient-to-r from-emerald-500/[0.025] via-[#252579]/[0.05] to-violet-500/[0.025] opacity-0 blur-xl transition-[opacity,transform] duration-[1600ms] ease-out group-hover/logo:scale-110 group-hover/logo:opacity-100"
                        />
                    </span>
                </Link>

                <nav className="relative hidden items-center gap-2 md:flex">
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute -inset-x-4 -inset-y-3 rounded-2xl bg-gradient-to-r from-emerald-500/[0.015] via-[#252579]/[0.035] to-violet-500/[0.015] opacity-0 blur-xl transition-[opacity,transform] duration-[1600ms] ease-out group-hover:scale-105 group-hover:opacity-100"
                    />

                    {navItems.map((item) => (
                        <Button
                            key={item.href}
                            asChild
                            variant="ghost"
                            className="group relative h-10 rounded-xl px-4 text-sm font-medium text-zinc-700 transition-[background-color,color,transform] duration-200 ease-out hover:-translate-y-px hover:bg-white/75 hover:text-[#252579]"
                        >
                            <Link href={item.href}>
                                {item.label}

                                <span className="ml-2 h-px w-0 bg-emerald-400 transition-all duration-200 ease-out group-hover:w-3" />
                            </Link>
                        </Button>
                    ))}

                    {status === "loading" ? (
                        <div className="relative h-10 w-36 animate-pulse rounded-xl bg-[#252579]/10" />
                    ) : session ? (
                        <LoadingLink
                            href="/dashboard"
                            className="group relative inline-flex h-10 min-w-36 items-center justify-center gap-2 rounded-xl bg-[#252579] px-4 text-sm font-semibold text-white shadow-sm shadow-[#252579]/15 transition-[background-color,box-shadow,transform] duration-200 ease-out hover:-translate-y-px hover:bg-[#2d2d8f] hover:shadow-md hover:shadow-[#252579]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#252579]/40 focus-visible:ring-offset-2"
                        >
                            Acessar Clínica

                            <ArrowRight className="h-4 w-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5" />
                        </LoadingLink>
                    ) : (
                        <Button
                            onClick={handleLogin}
                            loading={isLoggingIn}
                            style={{ borderRadius: "0.75rem" }}
                            className="group relative h-10 min-w-36 bg-[#252579] px-4 text-sm font-semibold text-white shadow-sm shadow-[#252579]/15 transition-[background-color,box-shadow,transform] duration-200 ease-out hover:-translate-y-px hover:bg-[#2d2d8f] hover:shadow-md hover:shadow-[#252579]/20 focus-visible:ring-2 focus-visible:ring-[#252579]/40"
                        >
                            <LogIn className="h-4 w-4 transition-transform duration-200 ease-out group-hover:-translate-x-0.5" />
                            Portal da Clínica
                        </Button>
                    )}
                </nav>

                <Sheet
                    open={isOpen}
                    onOpenChange={setIsOpen}
                >
                    <SheetTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Abrir menu"
                            className="group h-11 w-11 cursor-pointer rounded-xl border border-border/70 bg-background/80 text-[#252579] shadow-sm shadow-black/[0.04] transition-[background-color,border-color,color,box-shadow,transform] duration-200 ease-out hover:-translate-y-px hover:border-[#252579]/25 hover:bg-background hover:text-[#2d2d8f] hover:shadow-md active:translate-y-0 md:hidden"
                        >
                            <Menu className="h-5 w-5 transition-transform duration-200 ease-out group-hover:scale-105" />
                        </Button>
                    </SheetTrigger>

                    <SheetContent
                        side="right"
                        className="z-[9999] flex w-[88%] max-w-sm flex-col border-l border-border/60 bg-background p-0 shadow-2xl shadow-black/15 sm:w-96"
                    >
                        <SheetHeader className="border-b border-border/60 px-6 pb-5 pt-6 text-left">
                            <SheetTitle className="text-xl font-semibold tracking-tight text-[#252579]">
                                Menu
                            </SheetTitle>

                            <SheetDescription className="text-sm leading-relaxed">
                                Acesse as principais áreas do SmartClin.
                            </SheetDescription>

                            <div
                                aria-hidden="true"
                                className="mt-3 h-px w-16 bg-gradient-to-r from-[#252579] via-emerald-500 to-transparent"
                            />
                        </SheetHeader>

                        <nav className="flex flex-1 flex-col gap-2 px-6 py-6">
                            {navItems.map((item) => (
                                <Button
                                    key={item.href}
                                    onClick={() => setIsOpen(false)}
                                    asChild
                                    variant="ghost"
                                    className="group h-11 justify-start rounded-xl px-4 text-sm font-medium text-muted-foreground transition-[background-color,color,transform] duration-200 ease-out hover:-translate-y-px hover:bg-[#252579]/[0.055] hover:text-[#252579]"
                                >
                                    <Link href={item.href}>
                                        {item.label}

                                        <ArrowRight className="ml-auto h-4 w-4 translate-x-0 opacity-0 transition-[transform,opacity] duration-200 ease-out group-hover:translate-x-0.5 group-hover:opacity-100" />
                                    </Link>
                                </Button>
                            ))}

                            {status === "loading" ? (
                                <div className="relative h-10 w-36 animate-pulse rounded-xl bg-[#252579]/10" />
                            ) : session ? (
                                <LoadingLink
                                    href="/dashboard"
                                    className="group relative inline-flex h-10 min-w-36 items-center justify-center gap-2 rounded-xl bg-[#252579] px-4 text-sm font-semibold text-white shadow-sm shadow-[#252579]/15 transition-[background-color,box-shadow,transform] duration-200 ease-out hover:-translate-y-px hover:bg-[#2d2d8f] hover:shadow-md hover:shadow-[#252579]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#252579]/40 focus-visible:ring-offset-2"
                                >
                                    Acessar Clínica

                                    <ArrowRight className="h-4 w-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5" />
                                </LoadingLink>
                            ) : (
                                <Button
                                    onClick={handleLogin}
                                    loading={isLoggingIn}
                                    style={{ borderRadius: "0.75rem" }}
                                    className="group relative h-10 min-w-36 bg-[#252579] px-4 text-sm font-semibold text-white shadow-sm shadow-[#252579]/15 transition-[background-color,box-shadow,transform] duration-200 ease-out hover:-translate-y-px hover:bg-[#2d2d8f] hover:shadow-md hover:shadow-[#252579]/20 focus-visible:ring-2 focus-visible:ring-[#252579]/40"
                                >
                                    <LogIn className="h-4 w-4 transition-transform duration-200 ease-out group-hover:-translate-x-0.5" />
                                    Portal da Clínica
                                </Button>
                            )}
                        </nav>

                        <div
                            aria-hidden="true"
                            className="mx-6 mb-6 h-px bg-gradient-to-r from-transparent via-emerald-300/50 to-transparent"
                        />
                    </SheetContent>
                </Sheet>
            </div>

            {/* Estilos e animações copiados para manter o mesmo efeito de pulsação/transição */}
            <style>{`
                .smartclin-dashboard-line-top,
                .smartclin-dashboard-line-bottom {
                    width: 59%;
                    opacity: 0.6;
                    animation-duration: 15s;
                    animation-timing-function: ease-in-out;
                    animation-iteration-count: infinite;
                    animation-fill-mode: both;
                }

                .smartclin-dashboard-line-top {
                    animation-name: smartclin-dashboard-line-top;
                }

                .smartclin-dashboard-line-bottom {
                    animation-name: smartclin-dashboard-line-bottom;
                }

                @keyframes smartclin-dashboard-line-top {
                    0% {
                        width: 59%;
                    }
                    50% {
                        width: 92%;
                    }
                    100% {
                        width: 59%;
                    }
                }

                @keyframes smartclin-dashboard-line-bottom {
                    0% {
                        width: 59%;
                    }
                    50% {
                        width: 92%;
                    }
                    100% {
                        width: 59%;
                    }
                }
            `}</style>
        </header>
    )
}