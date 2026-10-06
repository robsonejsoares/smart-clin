import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

export function Footer() {
    return (
        <footer className="group relative overflow-hidden border-t border-border/60 bg-background">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                <div className="smartclin-footer-orb-a absolute -bottom-10 left-[8%] h-16 w-60 rounded-full bg-emerald-500/[0.10] blur-3xl" />
                <div className="smartclin-footer-orb-b absolute -bottom-10 left-1/2 h-16 w-72 rounded-full bg-[#252579]/[0.09] blur-3xl" />
                <div className="smartclin-footer-orb-c absolute -bottom-10 right-[8%] h-16 w-60 rounded-full bg-violet-500/[0.09] blur-3xl" />
            </div>

            <div className="container relative mx-auto flex min-h-0 flex-row items-center justify-between gap-2 px-4 py-1.5 sm:flex-row sm:px-6 lg:px-8">
                <Link
                    href="/"
                    aria-label="Ir para a página inicial"
                    className="group/logo relative flex items-center gap-2 rounded-lg px-1 py-0.5 text-base font-bold tracking-tight text-foreground transition-all duration-700 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#252579]/40 focus-visible:ring-offset-2"
                >
                    <img src="/logo-smart-clin.png" alt="" aria-hidden="true" className="h-6 w-6 rounded-full object-contain ring-1 ring-[#252579]/15 transition-transform duration-[1400ms] ease-in-out group-hover/logo:rotate-[360deg]" />
                    <span>
                        Smart
                        <span className="smartclin-footer-gradient-text">Clin</span>
                    </span>
                    <span
                        aria-hidden="true"
                        className="absolute -bottom-0.5 left-1 h-px w-0 bg-gradient-to-r from-[#252579] via-emerald-500 to-violet-500 transition-[width] duration-1000 ease-out group-hover/logo:w-[calc(100%-0.5rem)]"
                    />
                </Link>

                <div className="flex items-center gap-3 text-xs text-muted-foreground sm:text-sm">
                    <span className="smartclin-footer-year inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-background/70 px-2.5 py-0.5 font-medium tabular-nums backdrop-blur transition-all duration-700 hover:-translate-y-0.5 hover:border-[#252579]/40 hover:shadow-md"><span className="smartclin-footer-gradient-text">©</span>{new Date().getFullYear()}</span>

                    <a
                        href="https://www.linkedin.com/in/robson-soares-b22513170/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="smartclin-footer-badge group/dev relative inline-flex items-center overflow-hidden rounded-full p-px transition-all duration-700 hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#252579]/40 focus-visible:ring-offset-2"
                    >
                        <span aria-hidden="true" className="smartclin-footer-badge-border absolute inset-[-100%]" />
                        <span className="relative flex items-center gap-1.5 overflow-hidden rounded-full bg-background px-3 py-0.5 font-medium">
                            <span className="smartclin-footer-gradient-text">@oProgramadorAutonomo</span>
                            <ArrowUpRight className="h-3.5 w-3.5 text-[#252579] transition-transform duration-700 ease-out group-hover/dev:-translate-y-px group-hover/dev:translate-x-px" />
                            <span
                                aria-hidden="true"
                                className="smartclin-footer-sheen pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/80 to-transparent"
                            />
                        </span>
                    </a>
                </div>
            </div>

            <style>{`
                .smartclin-footer-gradient-text {
                    background-image: linear-gradient(90deg, #10b981, #252579, #8b5cf6, #10b981);
                    background-size: 250% 100%;
                    -webkit-background-clip: text;
                    background-clip: text;
                    color: transparent;
                    animation: smartclin-footer-flow 16s linear infinite;
                }
                .smartclin-footer-badge-border {
                    background: conic-gradient(from 0deg, transparent 0 60%, #10b981, #252579, #8b5cf6, transparent);
                    animation: smartclin-footer-spin 10s linear infinite;
                    opacity: 0.55;
                    transition: opacity 0.8s ease;
                }
                .smartclin-footer-badge:hover .smartclin-footer-badge-border {
                    opacity: 0.8;
                    animation-duration: 8s;
                }
                .smartclin-footer-sheen { animation: smartclin-footer-sheen 8s ease-in-out infinite; }
                .smartclin-footer-orb-a { animation: smartclin-footer-drift-a 12s ease-in-out infinite; }
                .smartclin-footer-orb-b { animation: smartclin-footer-drift-b 14s ease-in-out infinite; }
                .smartclin-footer-orb-c { animation: smartclin-footer-drift-c 12s ease-in-out infinite; }
                @keyframes smartclin-footer-flow { to { background-position: 250% 0; } }
                @keyframes smartclin-footer-spin { to { transform: rotate(360deg); } }
                @keyframes smartclin-footer-sheen { 0% { left: -50%; } 45%, 100% { left: 130%; } }
                @keyframes smartclin-footer-drift-a { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(60px); } }
                @keyframes smartclin-footer-drift-b { 0%, 100% { transform: translateX(-50%) scale(1); } 50% { transform: translateX(-50%) scale(1.25); } }
                @keyframes smartclin-footer-drift-c { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(-60px); } }
                @media (prefers-reduced-motion: reduce) {
                    .smartclin-footer-gradient-text, .smartclin-footer-badge-border,
                    .smartclin-footer-sheen, .smartclin-footer-orb-a, .smartclin-footer-orb-b, .smartclin-footer-orb-c { animation: none; }
                }
            `}</style>
        </footer>
    )
}
