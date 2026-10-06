'use client';

import { Loader2, type LucideIcon } from "lucide-react";

export type AgendaLoaderTone = "primary" | "danger" | "warning";

const TONES: Record<AgendaLoaderTone, { text: string; box: string; ping: string; dots: [string, string, string]; shimmer: string; chip: string }> = {
    primary: {
        text: "text-[#252579]",
        box: "border-[#252579]/15 bg-[#252579]/[0.07] text-[#252579]",
        ping: "bg-[#252579]/10",
        dots: ["bg-[#252579]", "bg-indigo-500", "bg-violet-400"],
        shimmer: "via-[#252579]/10",
        chip: "bg-[#252579]/[0.07]",
    },
    danger: {
        text: "text-red-600",
        box: "border-red-500/20 bg-red-500/[0.07] text-red-600",
        ping: "bg-red-500/10",
        dots: ["bg-red-600", "bg-red-500", "bg-rose-400"],
        shimmer: "via-red-500/10",
        chip: "bg-red-500/[0.07]",
    },
    warning: {
        text: "text-amber-600",
        box: "border-amber-400/30 bg-amber-400/[0.12] text-amber-500",
        ping: "bg-amber-400/15",
        dots: ["bg-amber-500", "bg-amber-400", "bg-yellow-300"],
        shimmer: "via-amber-400/15",
        chip: "bg-amber-400/[0.12]",
    },
};

interface AgendaLoaderProps {
    message?: string;
    icon?: LucideIcon;
    tone?: AgendaLoaderTone;
    rows?: number;
    variant?: "list" | "grid";
}

export default function AgendaLoader({ message = "Carregando agenda...", icon: Icon = Loader2, tone = "primary", rows = 6, variant = "list" }: AgendaLoaderProps) {
    const c = TONES[tone];
    const spin = Icon === Loader2 ? " animate-spin" : " animate-pulse";

    return (
        <div role="status" aria-live="polite" aria-label={message} className="flex flex-col gap-4 py-2">
            <div className="flex items-center justify-center gap-3 pt-2">
                <span className="relative flex h-10 w-10 items-center justify-center">
                    <span className={`absolute inset-0 animate-ping rounded-md ${c.ping} [animation-duration:2s]`} />
                    <span className={`relative flex h-10 w-10 items-center justify-center rounded-md border ${c.box}`}>
                        <Icon className={`h-5 w-5${spin}`} />
                    </span>
                </span>
                <div className="flex flex-col">
                    <span className={`text-sm font-semibold ${c.text}`}>{message}</span>
                    <span className="mt-1 flex items-center gap-1" aria-hidden="true">
                        <span className={`h-1.5 w-1.5 animate-bounce rounded-full ${c.dots[0]}`} />
                        <span className={`h-1.5 w-1.5 animate-bounce rounded-full ${c.dots[1]} [animation-delay:150ms]`} />
                        <span className={`h-1.5 w-1.5 animate-bounce rounded-full ${c.dots[2]} [animation-delay:300ms]`} />
                    </span>
                </div>
            </div>

            {variant === "grid" ? (
                <div aria-hidden="true" className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                    {Array.from({ length: 12 }).map((_, i) => (
                        <div key={i} className="relative h-10 overflow-hidden rounded-md border border-border/60 bg-muted/40">
                            <div
                                className={`pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent ${c.shimmer} to-transparent`}
                                style={{ animation: `agendaShimmer 1.8s ease-in-out ${(i % 4) * 150 + Math.floor(i / 4) * 100}ms infinite` }}
                            />
                        </div>
                    ))}
                </div>
            ) : (
            <div aria-hidden="true" className="space-y-2.5">
                {Array.from({ length: rows }).map((_, i) => (
                    <div
                        key={i}
                        className="relative flex min-h-14 items-center gap-3 overflow-hidden rounded-md border border-border/60 bg-background px-3.5 py-3.5"
                    >
                        <div className={`h-7 w-14 shrink-0 rounded-md ${c.chip}`} />
                        <div className="flex-1 space-y-2">
                            <div className="h-3 rounded bg-muted" style={{ width: `${70 - (i % 3) * 15}%` }} />
                            <div className="h-2.5 w-1/3 rounded bg-muted/70" />
                        </div>
                        <div
                            className={`pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent ${c.shimmer} to-transparent`}
                            style={{ animation: `agendaShimmer 1.8s ease-in-out ${i * 120}ms infinite` }}
                        />
                    </div>
                ))}
            </div>
            )}

            <style jsx>{`
                @keyframes agendaShimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(250%); }
                }
            `}</style>
        </div>
    );
}
