"use client"

import { signOut, useSession } from "next-auth/react"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import clsx from "clsx"
import Link from "next/link"
import { useState } from "react"
import {
    Banknote,
    CalendarCheck2,
    ChevronLeft,
    Folder,
    List,
    LogOut,
    Settings,
    X,
} from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export function SidebarDashboard({
    children,
}: {
    children: React.ReactNode
}) {
    const router = useRouter()
    const pathname = usePathname()
    const [isCollapsed, setIsCollapsed] = useState(true)
    const [isSheetOpen, setIsSheetOpen] = useState(false)
    const { update } = useSession()

    async function handleLogout() {
        await signOut()
        await update()
        router.replace("/")
    }

    return (
        <div className="flex min-h-screen w-full bg-muted/30">
            <aside
                className={clsx(
                    "group/sidebar sticky top-0 z-30 hidden h-screen flex-col overflow-hidden border-r border-border/60 bg-background shadow-xl shadow-black/[0.035] transition-[width,box-shadow] duration-300 ease-out md:flex",
                    "before:pointer-events-none before:absolute before:inset-y-0 before:right-0 before:w-px before:bg-gradient-to-b before:from-emerald-500/20 before:via-[#252579]/10 before:to-transparent",
                    isCollapsed ? "w-20" : "w-64"
                )}
            >
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/70 to-transparent"
                />

                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-20 top-24 h-48 w-48 rounded-full bg-emerald-500/[0.035] blur-3xl transition-transform duration-700 ease-out group-hover/sidebar:translate-y-4"
                />

                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -left-24 bottom-32 h-56 w-56 rounded-full bg-[#252579]/[0.025] blur-3xl transition-transform duration-700 ease-out group-hover/sidebar:-translate-y-3"
                />

                <div
                    className={clsx(
                        "relative z-10 flex min-h-[76px] items-center border-b border-border/60 px-3",
                        isCollapsed
                            ? "justify-center"
                            : "justify-between gap-2"
                    )}
                >
                    {!isCollapsed && (
                        <TooltipProvider delayDuration={100}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Link
                                        href="/"
                                        aria-label="Ir para a página inicial"
                                        className="group/logo relative flex items-center rounded-xl px-1 py-1 text-xl font-bold tracking-tight transition-[transform,opacity] duration-300 ease-out hover:-translate-y-0.5 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#252579]/40 focus-visible:ring-offset-2"
                                    >
                                        <span className="text-[#17172f] transition-colors duration-500 group-hover/logo:text-[#11112a]">
                                            Smart
                                        </span>

                                        <span className="relative ml-0.5 bg-gradient-to-r from-emerald-500 via-[#252579] to-violet-500 bg-[length:200%_100%] bg-[position:0%_50%] bg-clip-text text-transparent transition-[background-position,filter,transform] duration-[1800ms] ease-out group-hover/logo:bg-[position:100%_50%] group-hover/logo:drop-shadow-[0_0_7px_rgba(16,185,129,0.22)]">
                                            Clin

                                            <span
                                                aria-hidden="true"
                                                className="absolute -bottom-0.5 left-0 h-px w-0 bg-gradient-to-r from-[#252579] via-emerald-500 to-violet-500 opacity-0 transition-[width,opacity] duration-[1800ms] ease-out group-hover/logo:w-full group-hover/logo:opacity-80"
                                            />

                                            <span
                                                aria-hidden="true"
                                                className="pointer-events-none absolute -inset-x-2 -inset-y-1 -z-10 rounded-full bg-gradient-to-r from-emerald-500/[0.025] via-[#252579]/[0.05] to-violet-500/[0.025] opacity-0 blur-xl transition-[opacity,transform] duration-[1600ms] ease-out group-hover/logo:scale-110 group-hover/logo:opacity-100"
                                            />
                                        </span>
                                    </Link>
                                </TooltipTrigger>

                                <TooltipContent
                                    side="bottom"
                                    className="rounded-md border-border/70 shadow-lg"
                                >
                                    Ir para a página inicial
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )}

                    <TooltipProvider delayDuration={100}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className={clsx(
                                        "shrink-0 cursor-pointer border bg-background/90 shadow-sm backdrop-blur-sm transition-[background-color,border-color,color,box-shadow,transform] duration-200 ease-out hover:shadow-md active:scale-95 focus-visible:ring-2 focus-visible:ring-offset-2",
                                        isCollapsed
                                            ? "h-11 w-11 rounded-md border-border/70 text-[#252579] hover:border-[#252579]/20 hover:bg-[#252579]/[0.045] hover:text-[#2d2d8f] focus-visible:ring-[#252579]/30"
                                            : "h-9 w-9 rounded-md border-[#252579]/15 text-[#252579] hover:border-[#252579]/25 hover:bg-[#252579]/5 hover:text-[#2d2d8f] focus-visible:ring-[#252579]/30"
                                    )}
                                    onClick={() =>
                                        setIsCollapsed(
                                            (collapsed) => !collapsed
                                        )
                                    }
                                    aria-label={
                                        isCollapsed
                                            ? "Expandir painel administrativo"
                                            : "Recolher painel administrativo"
                                    }
                                >
                                    {isCollapsed ? (
                                        <List className="h-5 w-5 transition-transform duration-300 group-hover/sidebar:scale-105" />
                                    ) : (
                                        <ChevronLeft className="h-4 w-4 transition-transform duration-300" />
                                    )}
                                </Button>
                            </TooltipTrigger>

                            <TooltipContent
                                side="right"
                                className="rounded-md border-border/70 shadow-lg"
                            >
                                {isCollapsed
                                    ? "Expandir painel"
                                    : "Recolher painel"}
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>

                <nav className="relative z-10 flex flex-1 flex-col gap-2 overflow-hidden px-3 py-6">
                    {!isCollapsed && (
                        <div className="mb-1 px-2">
                            <div className="flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-[#252579]/70" />

                                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/65">
                                    Gestão
                                </span>

                                <span className="h-px flex-1 bg-gradient-to-r from-border/80 to-transparent" />
                            </div>
                        </div>
                    )}

                    <SidebarLink
                        href="/dashboard"
                        label="Agendamentos"
                        pathname={pathname}
                        isCollapsed={isCollapsed}
                        icon={<CalendarCheck2 className="h-5 w-5" />}
                    />

                    <SidebarLink
                        href="/dashboard/services"
                        label="Serviços"
                        pathname={pathname}
                        isCollapsed={isCollapsed}
                        icon={<Folder className="h-5 w-5" />}
                    />

                    <SidebarLink
                        href="/dashboard/profile"
                        label="Meu Perfil"
                        pathname={pathname}
                        isCollapsed={isCollapsed}
                        icon={<Settings className="h-5 w-5" />}
                    />

                    <SidebarLink
                        href="/dashboard/plans"
                        label="Planos"
                        pathname={pathname}
                        isCollapsed={isCollapsed}
                        icon={<Banknote className="h-5 w-5" />}
                    />
                </nav>

                <div className="relative z-10 border-t border-border/60 p-3">
                    <TooltipProvider delayDuration={100}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    onClick={handleLogout}
                                    aria-label="Sair"
                                    className={clsx(
                                        "group/logout cursor-pointer text-muted-foreground transition-[background-color,border-color,color,box-shadow,transform] duration-200 ease-out hover:bg-red-500/[0.065] hover:text-red-600 hover:shadow-sm focus-visible:ring-2 focus-visible:ring-red-500/30 active:scale-[0.98]",
                                        isCollapsed
                                            ? "h-11 w-full rounded-xl p-0"
                                            : "h-10 w-full justify-start gap-3 rounded-xl px-3"
                                    )}
                                >
                                    <LogOut className="h-5 w-5 shrink-0 transition-transform duration-200 group-hover/logout:-translate-x-0.5" />

                                    {!isCollapsed && (
                                        <span className="font-medium">
                                            Sair
                                        </span>
                                    )}
                                </Button>
                            </TooltipTrigger>

                            <TooltipContent
                                side="right"
                                className="rounded-md border-border/70 shadow-lg"
                            >
                                Sair
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </aside>

            <div className="flex min-w-0 flex-1 flex-col">
                <header className="sticky top-0 z-20 flex h-16 items-center border-b border-border/60 bg-background/90 px-3 shadow-sm backdrop-blur-xl md:hidden">
                    <Sheet
                        open={isSheetOpen}
                        onOpenChange={setIsSheetOpen}
                    >
                        <div className="flex items-center">
                            <TooltipProvider delayDuration={100}>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-11 w-11 cursor-pointer rounded-md border border-border/70 bg-background/85 text-[#252579] shadow-sm backdrop-blur-sm transition-[background-color,border-color,color,box-shadow,transform] duration-200 hover:border-[#252579]/20 hover:bg-[#252579]/[0.045] hover:text-[#2d2d8f] hover:shadow-md focus-visible:ring-2 focus-visible:ring-[#252579]/30 focus-visible:ring-offset-2 active:scale-95"
                                            onClick={() => {
                                                setIsCollapsed(false)
                                                setIsSheetOpen(true)
                                            }}
                                            aria-label="Abrir painel administrativo"
                                        >
                                            <List className="h-5 w-5 transition-transform duration-200" />
                                        </Button>
                                    </TooltipTrigger>

                                    <TooltipContent
                                        side="bottom"
                                        className="rounded-md border-border/70 shadow-lg"
                                    >
                                        Painel Administrativo
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>

                        <SheetContent
                            side="right"
                            className="flex w-[88%] max-w-sm flex-col overflow-hidden border-l border-border/60 bg-background text-foreground shadow-2xl shadow-black/15 [&>button]:hidden"
                        >
                            <div className="relative flex h-full w-full flex-col overflow-hidden">
                                <div
                                    aria-hidden="true"
                                    className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent"
                                />

                                <div
                                    aria-hidden="true"
                                    className="pointer-events-none absolute -right-20 top-24 h-48 w-48 rounded-full bg-emerald-500/[0.045] blur-3xl"
                                />

                                <div
                                    aria-hidden="true"
                                    className="pointer-events-none absolute -left-24 bottom-20 h-56 w-56 rounded-full bg-[#252579]/[0.035] blur-3xl"
                                />

                                <div className="relative z-10 flex h-full flex-col">
                                    <div className="-mx-6 -mt-6 mb-6 flex min-h-[78px] items-center justify-between border-b border-border/60 bg-background/80 px-5 pt-1 backdrop-blur-md">
                                        <SheetHeader className="sr-only">
                                            <SheetTitle>
                                                SmartClin
                                            </SheetTitle>

                                            <SheetDescription>
                                                Painel Administrativo
                                            </SheetDescription>
                                        </SheetHeader>

                                        <TooltipProvider delayDuration={100}>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Link
                                                        href="/"
                                                        aria-label="Ir para a página inicial"
                                                        className="group/logo relative flex items-center rounded-xl px-1 py-1 text-xl font-bold tracking-tight transition-[transform,opacity] duration-300 hover:-translate-y-0.5 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#252579]/40 focus-visible:ring-offset-2"
                                                        onClick={() =>
                                                            setIsSheetOpen(false)
                                                        }
                                                    >
                                                        <span className="text-[#17172f] transition-colors duration-500 group-hover/logo:text-[#11112a]">
                                                            Smart
                                                        </span>

                                                        <span className="relative ml-0.5 bg-gradient-to-r from-emerald-500 via-[#252579] to-violet-500 bg-[length:200%_100%] bg-[position:0%_50%] bg-clip-text text-transparent transition-[background-position,filter,transform] duration-[1800ms] ease-out group-hover/logo:bg-[position:100%_50%] group-hover/logo:drop-shadow-[0_0_7px_rgba(16,185,129,0.22)]">
                                                            Clin

                                                            <span
                                                                aria-hidden="true"
                                                                className="absolute -bottom-0.5 left-0 h-px w-0 bg-gradient-to-r from-[#252579] via-emerald-500 to-violet-500 opacity-0 transition-[width,opacity] duration-[1800ms] ease-out group-hover/logo:w-full group-hover/logo:opacity-80"
                                                            />

                                                            <span
                                                                aria-hidden="true"
                                                                className="pointer-events-none absolute -inset-x-2 -inset-y-1 -z-10 rounded-full bg-gradient-to-r from-emerald-500/[0.025] via-[#252579]/[0.05] to-violet-500/[0.025] opacity-0 blur-xl transition-[opacity,transform] duration-[1600ms] ease-out group-hover/logo:scale-110 group-hover/logo:opacity-100"
                                                            />
                                                        </span>
                                                    </Link>
                                                </TooltipTrigger>

                                                <TooltipContent
                                                    side="bottom"
                                                    className="rounded-md border-border/70 shadow-lg"
                                                >
                                                    Ir para a página inicial
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>

                                        <TooltipProvider delayDuration={100}>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        aria-label="Fechar menu"
                                                        className="h-9 w-9 cursor-pointer rounded-md border border-border/70 bg-background text-muted-foreground shadow-sm transition-[background-color,border-color,color,box-shadow,transform] duration-200 hover:border-[#252579]/20 hover:bg-[#252579]/[0.045] hover:text-[#252579] hover:shadow-md focus-visible:ring-2 focus-visible:ring-[#252579]/30 active:scale-95"
                                                        onClick={() =>
                                                            setIsSheetOpen(false)
                                                        }
                                                    >
                                                        <X className="h-4 w-4 transition-transform duration-200 hover:rotate-90" />
                                                    </Button>
                                                </TooltipTrigger>

                                                <TooltipContent className="rounded-md border-border/70 shadow-lg">
                                                    Fechar
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>

                                    <nav className="flex flex-col gap-2">
                                        <div className="mb-1 px-2">
                                            <div className="flex items-center gap-2">
                                                <span className="h-1.5 w-1.5 rounded-full bg-[#252579]/70" />

                                                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/65">
                                                    Gestão
                                                </span>

                                                <span className="h-px flex-1 bg-gradient-to-r from-border/80 to-transparent" />
                                            </div>
                                        </div>

                                        <SidebarLink
                                            href="/dashboard"
                                            label="Agendamentos"
                                            pathname={pathname}
                                            isCollapsed={false}
                                            icon={
                                                <CalendarCheck2 className="h-5 w-5" />
                                            }
                                            onClick={() =>
                                                setIsSheetOpen(false)
                                            }
                                        />

                                        <SidebarLink
                                            href="/dashboard/services"
                                            label="Serviços"
                                            pathname={pathname}
                                            isCollapsed={false}
                                            icon={
                                                <Folder className="h-5 w-5" />
                                            }
                                            onClick={() =>
                                                setIsSheetOpen(false)
                                            }
                                        />

                                        <SidebarLink
                                            href="/dashboard/profile"
                                            label="Meu Perfil"
                                            pathname={pathname}
                                            isCollapsed={false}
                                            icon={
                                                <Settings className="h-5 w-5" />
                                            }
                                            onClick={() =>
                                                setIsSheetOpen(false)
                                            }
                                        />

                                        <SidebarLink
                                            href="/dashboard/plans"
                                            label="Planos"
                                            pathname={pathname}
                                            isCollapsed={false}
                                            icon={
                                                <Banknote className="h-5 w-5" />
                                            }
                                            onClick={() =>
                                                setIsSheetOpen(false)
                                            }
                                        />
                                    </nav>

                                    <div className="mt-auto border-t border-border/60 pt-4">
                                        <TooltipProvider delayDuration={100}>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        onClick={handleLogout}
                                                        className="group/logout h-10 w-full cursor-pointer justify-start gap-3 rounded-md px-3 text-muted-foreground transition-[background-color,border-color,color,box-shadow,transform] duration-200 ease-out hover:bg-red-500/[0.065] hover:text-red-600 hover:shadow-sm focus-visible:ring-2 focus-visible:ring-red-500/30 active:scale-[0.98]"
                                                    >
                                                        <LogOut className="h-5 w-5 shrink-0 transition-transform duration-200 group-hover/logout:-translate-x-0.5" />

                                                        <span className="font-medium">
                                                            Sair
                                                        </span>
                                                    </Button>
                                                </TooltipTrigger>

                                                <TooltipContent
                                                    side="left"
                                                    className="rounded-md border-border/70 shadow-lg"
                                                >
                                                    Sair
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </header>

                <main className="flex-1 px-3 py-5 sm:px-4 md:p-6 lg:p-7">
                    {children}
                </main>
            </div>
        </div>
    )
}

interface SidebarLinkProps {
    href: string
    icon: React.ReactNode
    label: string
    pathname: string
    isCollapsed: boolean
    onClick?: () => void
}

function SidebarLink({
    href,
    icon,
    isCollapsed,
    label,
    pathname,
    onClick,
}: SidebarLinkProps) {
    const isActive = pathname === href

    const content = (
        <Link
            href={href}
            onClick={onClick}
            className={clsx(
                "group block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#252579]/25 focus-visible:ring-offset-2",
                isCollapsed && "flex justify-center"
            )}
        >
            <div
                className={clsx(
                    "relative flex items-center overflow-hidden transition-[background-color,color,box-shadow,transform] duration-200 ease-out",
                    isCollapsed
                        ? "h-11 w-11 justify-center rounded-xl"
                        : "w-full gap-3 rounded-xl px-3 py-2.5",
                    isActive
                        ? "bg-[#252579]/[0.065] font-medium text-[#252579] shadow-sm shadow-[#252579]/[0.035]"
                        : "text-muted-foreground hover:bg-muted/70 hover:text-foreground hover:shadow-sm"
                )}
            >
                {isActive && !isCollapsed && (
                    <span
                        aria-hidden="true"
                        className="absolute right-2.5 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.25)]"
                    />
                )}

                <span
                    className={clsx(
                        "flex h-5 w-5 shrink-0 items-center justify-center transition-[color,transform] duration-200",
                        isActive
                            ? "text-[#252579]"
                            : "text-muted-foreground group-hover:-translate-y-px group-hover:text-[#252579]"
                    )}
                >
                    {icon}
                </span>

                {!isCollapsed && (
                    <span className="truncate text-sm">
                        {label}
                    </span>
                )}
            </div>
        </Link>
    )

    if (isCollapsed) {
        return (
            <TooltipProvider delayDuration={100}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        {content}
                    </TooltipTrigger>

                    <TooltipContent
                        side="right"
                        className="rounded-md border-border/70 shadow-lg"
                    >
                        {label}
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        )
    }
    return content
}