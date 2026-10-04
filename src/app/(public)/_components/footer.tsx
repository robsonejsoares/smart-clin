import Link from "next/link"

export function Footer() {
    return (<footer className="group relative overflow-hidden border-t border-border/60 bg-background"> <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
    > <div className="h-full w-0 bg-gradient-to-r from-emerald-400 via-[#252579] to-violet-500 opacity-0 blur-[0.5px] transition-[width,opacity] duration-[1800ms] ease-out group-hover:w-full group-hover:opacity-80" /> </div>


        <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-[1600ms] ease-out group-hover:opacity-100"
        >
            <div className="absolute -bottom-16 left-[5%] h-24 w-56 rounded-full bg-emerald-500/[0.06] blur-3xl transition-transform duration-[2200ms] ease-out group-hover:translate-x-12" />

            <div className="absolute -bottom-20 left-1/2 h-28 w-64 -translate-x-1/2 rounded-full bg-[#252579]/[0.055] blur-3xl transition-transform duration-[2400ms] ease-out group-hover:scale-125" />

            <div className="absolute -bottom-16 right-[5%] h-24 w-56 rounded-full bg-violet-500/[0.045] blur-3xl transition-transform duration-[2200ms] ease-out group-hover:-translate-x-12" />

            <div className="absolute inset-x-1/4 bottom-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent blur-sm" />
        </div>

        <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-0 h-20 w-80 -translate-x-1/2 -translate-y-10 rounded-full bg-gradient-to-r from-emerald-500/[0.02] via-[#252579]/[0.035] to-violet-500/[0.02] opacity-0 blur-3xl transition-all duration-[1800ms] ease-out group-hover:translate-y-0 group-hover:opacity-100"
        />

        <div className="container relative mx-auto flex min-h-12 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            <Link
                href="/"
                aria-label="Ir para a página inicial"
                className="group/logo relative rounded-lg px-1 py-0.5 text-sm font-semibold tracking-tight text-foreground transition-[transform,opacity] duration-300 ease-out hover:-translate-y-0.5 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#252579]/40 focus-visible:ring-offset-2"
            >
                <span className="transition-colors duration-500 group-hover/logo:text-[#252579]">
                    Smart
                </span>

                <span className="bg-gradient-to-r from-emerald-500 via-[#252579] to-violet-500 bg-clip-text text-transparent transition-[filter] duration-500 group-hover/logo:drop-shadow-[0_0_7px_rgba(16,185,129,0.22)]">
                    Clin
                </span>

                <span
                    aria-hidden="true"
                    className="absolute -bottom-0.5 left-1 h-px w-0 bg-gradient-to-r from-[#252579] via-emerald-500 to-violet-500 transition-[width] duration-700 ease-out group-hover/logo:w-full"
                />
            </Link>

            <div className="flex items-center gap-2 text-xs text-muted-foreground sm:text-sm">
                <span className="transition-colors duration-500 group-hover:text-foreground/80">
                    © {new Date().getFullYear()}
                </span>

                <span
                    aria-hidden="true"
                    className="relative flex h-2 w-2 items-center justify-center"
                >
                    <span className="absolute h-2 w-2 scale-50 rounded-full bg-gradient-to-r from-emerald-500 to-violet-500 opacity-0 transition-all duration-700 ease-out group-hover:scale-100 group-hover:opacity-20" />

                    <span className="relative h-1 w-1 rounded-full bg-emerald-500 transition-all duration-700 ease-out group-hover:scale-125 group-hover:bg-[#252579]" />
                </span>

                <a
                    href="https://www.linkedin.com/in/robson-soares-b22513170/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-xl font-medium text-[#252579]/80 transition-[color,transform] duration-500 ease-out hover:-translate-y-0.5 hover:text-[#252579] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#252579]/40 focus-visible:ring-offset-2"
                >
                    @oProgramadorAutonomo
                </a>
            </div>
        </div>
    </footer>
    )
}
