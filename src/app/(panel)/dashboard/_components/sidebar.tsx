"use client";

import {
    signOut,
    useSession
} from "next-auth/react";

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
import { LogOut, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SheetClose } from "@/components/ui/sheet";
import logoImg from "../../../../../public/nome-smart-clin.png";
import { Banknote, CalendarCheck2, ChevronLeft, Folder, List, Settings } from "lucide-react";

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
            })}>
                {/* Cabeçalho Desktop */}
                <div className="-mx-4 -mt-4 mb-6 bg-emerald-50 p-3 border-b border-gray-200/80 flex items-center justify-between min-h-[64px] gap-2">
                    {!isCollapsed && (
                        <Link
                            href="/"
                            aria-label="Ir para a página inicial"
                            title="Ir para a página inicial"
                            className="block max-w-[130px] shrink-0"
                        >
                            <Image
                                src={logoImg}
                                alt="Nome da SmartClin"
                                priority
                                quality={100}
                                className="w-full h-auto object-contain"
                            />
                        </Link>
                    )}

                    <TooltipProvider delayDuration={100}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className={clsx(
                                        "cursor-pointer transition-all rounded-md shrink-0 border shadow-xs active:scale-95",
                                        "bg-white text-emerald-700 border-emerald-200/80",
                                        "hover:bg-emerald-200 hover:text-emerald-700 hover:border-emerald-300 hover:shadow-md",
                                        {
                                            "ml-auto h-9 w-9": !isCollapsed,
                                            "mx-auto h-11 w-11": isCollapsed,
                                        }
                                    )}
                                    onClick={() => setIsCollapsed((collapsed) => !collapsed)}
                                    aria-label={isCollapsed ? "Painel Administrativo" : "Recolher"}
                                >
                                    {isCollapsed ? (
                                        <List className="h-6 w-6" />
                                    ) : (
                                        <ChevronLeft className="h-4 w-4" />
                                    )}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="right">
                                {isCollapsed ? "Painel Administrativo" : "Recolher"}
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>

                <nav className="flex flex-col gap-1 overflow-hidden">
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
                    {isCollapsed ? (
                        <TooltipProvider delayDuration={100}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        onClick={handleLogout}
                                        className="w-full flex items-center justify-center h-10 w-10 p-0 transition-colors cursor-pointer text-gray-700 hover:bg-gray-100"
                                    >
                                        <LogOut className="h-5 w-5 shrink-0" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="right">
                                    Sair
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    ) : (
                        <Button
                            variant="ghost"
                            onClick={handleLogout}
                            className="w-full flex items-center justify-start gap-2 px-3 py-2 transition-colors cursor-pointer text-gray-700 hover:bg-gray-100"
                        >
                            <LogOut className="h-5 w-5 shrink-0" />
                            <span>Sair</span>
                        </Button>
                    )}
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
                            <TooltipProvider delayDuration={100}>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <SheetTrigger asChild>
                                            <Button
                                                className="md:hidden transition-all cursor-pointer h-11 w-11 p-0 bg-white text-emerald-700 border border-emerald-200/80 hover:bg-emerald-200 hover:text-emerald-700 hover:border-emerald-300 hover:shadow-md active:scale-95 shadow-xs rounded-md"
                                                onClick={() => setIsCollapsed(false)}
                                                aria-label="Painel administrativo"
                                            >
                                                <List className="h-6 w-6" />
                                            </Button>
                                        </SheetTrigger>
                                    </TooltipTrigger>
                                    <TooltipContent side="bottom">
                                        Painel Administrativo
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                        <SheetContent side="right" className="sm:max-w-xs text-black flex flex-col [&>button]:hidden">
                            <div tabIndex={0} className="sr-only" />

                            {/* Cabeçalho do Mobile */}
                            <div className="-mx-6 -mt-6 mb-4 bg-emerald-50 p-4 border-b border-gray-200 flex items-center justify-between">
                                <SheetHeader className="sr-only">
                                    <SheetTitle>SmartClin</SheetTitle>
                                    <SheetDescription>Painel Administrativo</SheetDescription>
                                </SheetHeader>

                                <Link
                                    href="/"
                                    aria-label="Ir para a página inicial"
                                    title="Ir para a página inicial"
                                    className="block max-w-[130px]"
                                    onClick={() => setIsSheetOpen(false)}
                                >
                                    <Image
                                        src={logoImg}
                                        alt="Nome da SmartClin"
                                        priority
                                        quality={100}
                                        className="w-full h-auto object-contain"
                                    />
                                </Link>

                                <TooltipProvider delayDuration={100}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <SheetClose asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-9 w-9 bg-white text-emerald-700 border border-emerald-200/80 hover:bg-emerald-200 hover:text-emerald-700 hover:border-emerald-300 hover:shadow-md shadow-xs rounded-md transition-all cursor-pointer active:scale-95"
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

                            {/* Links de navegação Mobile */}
                            <div>
                                <nav className="grid gap-2 text-base pt-2">
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
                                    className="w-full flex items-center justify-start gap-2 px-3 py-2 transition-colors cursor-pointer text-gray-700 hover:bg-gray-100"
                                >
                                    <LogOut className="h-5 w-5 shrink-0" />
                                    <span>Sair</span>
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
    const isActive = pathname === href;

    const content = (
        <Link
            href={href}
            onClick={onClick}
            className={clsx("block", {
                "flex justify-center": isCollapsed,
            })}
        >
            <div
                className={clsx("flex items-center transition-colors", {
                    "bg-gray-100 text-gray-900 font-medium rounded-md": isActive,
                    "text-gray-600 hover:bg-gray-100/60 hover:text-gray-900 rounded-md": !isActive,
                    "h-10 w-10 justify-center items-center": isCollapsed,
                    "gap-2 px-3 py-2 w-full": !isCollapsed,
                })}
            >
                <span className="w-6 h-6 flex items-center justify-center">{icon}</span>
                {!isCollapsed && <span className="truncate">{label}</span>}
            </div>
        </Link>
    );

    if (isCollapsed) {
        return (
            <TooltipProvider delayDuration={100}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        {content}
                    </TooltipTrigger>
                    <TooltipContent side="right">
                        {label}
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );
    }

    return content;
}