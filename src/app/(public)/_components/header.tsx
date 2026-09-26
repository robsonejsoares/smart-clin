"use client";

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

import Link from "next/link";
import { useState } from "react";
import { LogIn, Menu } from "lucide-react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { handRegister } from "../_actions/login";


export function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const { data: session, status } = useSession();

    const navItems = [
        { href: "#profissionais", label: "Profissionais" },
    ];

    async function handleLogin() {
        await handRegister("google");
    }

    return (
        <header className="fixed top-0 right-0 left-0 z-999 py-4 px-6 bg-emerald-50">
            <div className="container mx-auto flex items-center justify-between">
                <Link href="/" className="text-3xl font-bold text-zinc-900">
                    Smart<span className="text-emerald-500">Clin</span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center space-x-4">
                    {navItems.map((item) => (
                        <Button
                            key={item.href}
                            asChild
                            className="bg-transparent hover:bg-transparent text-black shadow-none"
                        >
                            <Link href={item.href} className="text-base">
                                {item.label}
                            </Link>
                        </Button>
                    ))}

                    {status === "loading" ? (
                        <></>
                    ) : session ? (
                        <Button
                            asChild
                            className="w-38 bg-indigo-900 hover:bg-indigo-800 text-white shadow-sm"
                        >
                            <Link href="/dashboard">
                                Acessar Clínica
                            </Link>
                        </Button>
                    ) : (
                        <Button
                            onClick={handleLogin}
                            className="w-38 bg-indigo-900 hover:bg-indigo-800 text-white shadow-sm"
                        >
                            <LogIn />
                            Portal da Clínica
                        </Button>
                    )}
                </nav>

                {/* Mobile Nav */}
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild className="md:hidden">
                        <Button
                            className="text-black hover:bg-emerald-200 cursor-pointer h-12 w-12 p-0"
                            variant="ghost"
                            size="icon"
                        >
                            <Menu className="w-6 h-6" />
                        </Button>
                    </SheetTrigger>

                    <SheetContent
                        side="right"
                        className="w-60 sm:w-75 z-9999 [&>button]:cursor-pointer [&>button]:hover:bg-gray-200 [&>button]:rounded-lg [&>button]:p-2 [&>button]:transition-colors"
                    >
                        <SheetHeader>
                            <SheetTitle>Menu</SheetTitle>
                            <SheetDescription>Veja nossos links</SheetDescription>
                        </SheetHeader>

                        <nav className="flex flex-col space-y-4 mt-6">
                            {navItems.map((item) => (
                                <Button
                                    key={item.href}
                                    onClick={() => setIsOpen(false)}
                                    asChild
                                    className="bg-transparent hover:bg-transparent text-black shadow-none justify-start"
                                >
                                    <Link href={item.href} className="text-base">
                                        {item.label}
                                    </Link>
                                </Button>
                            ))}

                            {status === "loading" ? (
                                <></>
                            ) : session ? (
                                <Button
                                    asChild
                                    className="w-full bg-indigo-900 hover:bg-indigo-800 text-white shadow-sm"
                                >
                                    <Link
                                        href="/dashboard"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Acessar Clínica
                                    </Link>
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleLogin}
                                    className="w-full bg-indigo-900 hover:bg-indigo-800 text-white cursor-pointer shadow-sm"
                                >
                                    <LogIn />
                                    Portal da Clínica
                                </Button>
                            )}
                        </nav>
                    </SheetContent>
                </Sheet>
            </div>
        </header>
    );
}
