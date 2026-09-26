"use client";

import {
    signOut,
    useSession
} from "next-auth/react"

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

import clsx from "clsx";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { X, LogOut } from "lucide-react";
import { useRouter } from "next/navigation"
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SheetClose } from "@/components/ui/sheet";
import logoImg from "../../../../../public/nome-smart-clin.png";
import { Banknote, CalendarCheck2, ChevronLeft, ChevronRight, Folder, List, Settings } from "lucide-react";


export function SidebarDashboard({ children }: { children: React.ReactNode }) {

    const router = useRouter();
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const { update } = useSession();

    async function handleLogout() {
        await signOut();
        await update();
        router.replace("/");
    }

    return (
        <div className="flex min-h-screen w-full">
            <aside className={clsx("flex flex-col border-r bg-background transition-all duration-300 p-4 h-screen sticky top-0", {
                "w-20": isCollapsed,
                "w-64": !isCollapsed,
                "hidden md:flex": true,
            })}
            >
                <div className="mb-6 mt-4">
                    {!isCollapsed && (
                        <Link
                            href="/"
                            aria-label="Ir para a página inicial"
                            title="Ir para a página inicial"
                        >
                            <Image
                                src={logoImg}
                                alt="Nome da SmartClin"
                                priority
                                quality={100}
                            />
                        </Link>
                    )}
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    className={clsx("mb-2 cursor-pointer bg-gray-100 hover:bg-gray-200 h-10 w-10", {
                        "self-end": !isCollapsed,
                        "self-center": isCollapsed,
                    })}
                    onClick={() => setIsCollapsed((collapsed) => !collapsed)}
                    aria-label={isCollapsed ? "Expandir menu" : "Recolher menu"}
                >
                    {isCollapsed ? (
                        <ChevronRight className="h-6 w-6" />
                    ) : (
                        <ChevronLeft className="h-6 w-6" />
                    )}
                </Button>

                <nav className="flex flex-col gap-1 overflow-hidden">
                    {!isCollapsed && (
                        <span className="mt-1 text-sm font-medium uppercase text-gray-400">
                            Painel
                        </span>
                    )}
                    <SidebarLink
                        href="/dashboard"
                        label="Agendamentos"
                        pathname={pathname}
                        isCollapsed={isCollapsed}
                        icon={<CalendarCheck2 className="h-6 w-6" />}
                    />
                    <SidebarLink
                        href="/dashboard/services"
                        label="Serviços"
                        pathname={pathname}
                        isCollapsed={isCollapsed}
                        icon={<Folder className="h-6 w-6" />}
                    />
                    {!isCollapsed && (
                        <span className="mt-3 text-sm font-medium uppercase text-gray-400">
                            Configurações
                        </span>
                    )}
                    <SidebarLink
                        href="/dashboard/profile"
                        label="Meu Perfil"
                        pathname={pathname}
                        isCollapsed={isCollapsed}
                        icon={<Settings className="h-6 w-6" />}
                    />
                    <SidebarLink
                        href="/dashboard/plans"
                        label="Planos"
                        pathname={pathname}
                        isCollapsed={isCollapsed}
                        icon={<Banknote className="h-6 w-6" />}
                    />
                </nav>

                {/* Botão Sair - Desktop */}
                <div className="mt-auto pt-4 border-t">
                    <Button
                        variant="ghost"
                        onClick={handleLogout}
                        className={clsx("w-full flex items-center transition-colors cursor-pointer", {
                            "justify-center h-10 w-10 p-0": isCollapsed,
                            "justify-start gap-2 px-3 py-2": !isCollapsed,
                        })}
                        title="Sair"
                    >
                        <LogOut className="h-5 w-5 shrink-0" />
                        {!isCollapsed && <span>Sair</span>}
                    </Button>
                </div>
            </aside>
            <div
                className={clsx("flex flex-1 flex-col transition-all duration-300", {
                    "md:ml-20": isCollapsed,
                    "md:ml-64": !isCollapsed,
                })}
            >
                <header className="md:hidden flex items-center justify-between border-b px-2 md:px-6 h-14 z-10 sticky top-0 bg-emerald-50">
                    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                        <div className="flex items-center gap-4">
                            <SheetTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="md:hidden hover:bg-emerald-200 cursor-pointer h-12 w-12 p-0 bg-transparent"
                                    onClick={() => setIsCollapsed(false)}>
                                    <List className="w-5 h-5" />
                                </Button>
                            </SheetTrigger>
                            <h1 className="text-base md:text-lg font-semibold">
                                Menu SmartClin
                            </h1>
                        </div>
                        <SheetContent side="right" className="sm:max-w-xs text-black flex flex-col [&>button]:hidden">
                            <div tabIndex={0} className="sr-only" />

                            {/* Botão Fechar */}
                            <div className="absolute right-4 top-4 z-50">
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <SheetClose asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-md"
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </SheetClose>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            Fechar
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>

                            <div>
                                <SheetHeader>
                                    <SheetTitle>SmartClin</SheetTitle>
                                    <SheetDescription>Menu Administrativo</SheetDescription>
                                </SheetHeader>
                                <nav className="grid gap-2 text-base pt-5">
                                    <SidebarLink
                                        href="/dashboard"
                                        label="Agendamentos"
                                        pathname={pathname}
                                        isCollapsed={false}
                                        icon={<CalendarCheck2 className="w-6 h-6" />}
                                        onClick={() => setIsSheetOpen(false)}
                                    />
                                    <SidebarLink
                                        href="/dashboard/services"
                                        label="Serviços"
                                        pathname={pathname}
                                        isCollapsed={false}
                                        icon={<Folder className="w-6 h-6" />}
                                        onClick={() => setIsSheetOpen(false)}
                                    />
                                    <SidebarLink
                                        href="/dashboard/profile"
                                        label="Meu Perfil"
                                        pathname={pathname}
                                        isCollapsed={false}
                                        icon={<Settings className="w-6 h-6" />}
                                        onClick={() => setIsSheetOpen(false)}
                                    />
                                    <SidebarLink
                                        href="/dashboard/plans"
                                        label="Planos"
                                        pathname={pathname}
                                        isCollapsed={false}
                                        icon={<Banknote className="w-6 h-6" />}
                                        onClick={() => setIsSheetOpen(false)}
                                    />
                                </nav>
                            </div>

                            {/* Botão Sair - Mobile */}
                            <div className="mt-auto pt-4 border-t mb-2">
                                <Button
                                    variant="ghost"
                                    onClick={handleLogout}
                                    className="w-full flex items-center justify-start gap-2 px-3 py-2 transition-colors cursor-pointer"
                                >
                                    <LogOut className="h-5 w-5 shrink-0" />
                                    <span >Sair</span>
                                </Button>
                            </div>
                        </SheetContent>
                    </Sheet>
                </header>
                <main className="flex-1 py-4 px-2 md:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}

interface SidebarLinkProps {
    href: string;
    icon: React.ReactNode;
    label: string;
    pathname: string;
    isCollapsed: boolean;
    onClick?: () => void;
}

function SidebarLink({ href, icon, isCollapsed, label, pathname, onClick }: SidebarLinkProps) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className={clsx("block", {
                "flex justify-center": isCollapsed,
            })}
        >
            <div
                className={clsx("flex items-center rounded-md transition-colors", {
                    "text-gray-900 bg-gray-200 font-medium": pathname === href,
                    "text-gray-700 hover:bg-gray-100": pathname !== href,
                    "h-10 w-10 justify-center items-center": isCollapsed,
                    "gap-2 px-3 py-2 w-full": !isCollapsed,
                })}
            >
                <span className="w-6 h-6 flex items-center justify-center">{icon}</span>
                {!isCollapsed && <span className="truncate">{label}</span>}
            </div>
        </Link>
    );
}