import Link from "next/link"
import { Calendar } from "lucide-react"
import getSession from "@/lib/getSession"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Reminders } from "./_components/reminder/reminders"
import { ButtonCopyLink } from "./_components/button-copy-link"
import { Appointments } from "./_components/appointments/appointments"

export default async function Dashboard() {
    const session = await getSession()

    if (!session) {
        redirect("/")
    }

    return (
        <TooltipProvider>
            <main className="mx-auto w-full max-w-[1600px]">
                {/* Header */}
                <section className="group relative mb-6 overflow-hidden rounded-2xl border border-border/60 bg-background/95 shadow-lg shadow-black/[0.04]">
                    {/* Linha gradiente superior */}
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-x-0 top-0 z-20 h-px"
                    >
                        <div className="smartclin-dashboard-line-top h-full bg-gradient-to-r from-emerald-400 via-[#252579] to-violet-500 blur-[0.5px]" />
                    </div>

                    {/* Linha gradiente inferior */}
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-px"
                    >
                        <div className="smartclin-dashboard-line-bottom ml-auto h-full bg-gradient-to-l from-emerald-400 via-[#252579] to-violet-500 blur-[0.5px]" />
                    </div>

                    {/* Gradiente interno */}
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_88%_8%,rgba(16,185,129,0.075),transparent_30%),radial-gradient(circle_at_8%_100%,rgba(37,37,121,0.055),transparent_34%),linear-gradient(135deg,rgba(16,185,129,0.025),transparent_42%,rgba(37,37,121,0.025))]"
                    />

                    {/* Glow superior */}
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute -right-24 -top-24 h-48 w-48 rounded-full bg-emerald-500/[0.055] blur-3xl"
                    />

                    {/* Glow inferior */}
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute -bottom-32 left-1/3 h-48 w-48 rounded-full bg-[#252579]/[0.045] blur-3xl"
                    />

                    {/* Conteúdo mantido numa única linha no mobile */}
                    <div className="relative z-10 flex flex-row items-center justify-between gap-2 p-4 sm:p-6">
                        <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 sm:gap-2.5">
                                <span
                                    aria-hidden="true"
                                    className="relative flex h-2 w-2 shrink-0 sm:h-2.5 sm:w-2.5"
                                >
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/40" />

                                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.28)] sm:h-2.5 sm:w-2.5" />
                                </span>

                                <span className="text-[10px] font-semibold tracking-[0.04em] text-emerald-700/80 sm:text-[11px]">
                                    Painel de
                                </span>
                            </div>

                            <h1 className="relative mt-1 w-fit max-w-full overflow-hidden text-lg font-bold tracking-tight sm:mt-2 sm:text-3xl">
                                <span className="relative z-10 inline-block bg-gradient-to-r from-[#252579] via-[#10b981] to-[#252579] bg-[length:300%_100%] bg-[position:0%_50%] bg-clip-text text-transparent transition-[background-position] duration-1000 ease-out group-hover:bg-[position:100%_50%]">
                                    Agendamentos
                                </span>

                                <span
                                    aria-hidden="true"
                                    className="pointer-events-none absolute inset-y-0 -left-1/2 z-20 w-1/3 skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/90 to-transparent opacity-0 blur-[2px] transition-[left,opacity] duration-[1400ms] ease-out group-hover:left-[120%] group-hover:opacity-100"
                                />
                            </h1>
                        </div>

                        {/* Botões alinhados na mesma linha */}
                        <div className="flex shrink-0 flex-row items-center gap-1.5 sm:gap-2.5">
                            <ButtonCopyLink userId={session.user.id} />

                            <Link
                                href={`/clinica/${session.user.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="shrink-0"
                            >
                                <Button
                                    className="group/appointment relative h-10 shrink-0 whitespace-nowrap rounded-lg border border-[#252579]/40 bg-gradient-to-r from-[#252579] via-[#2d2d8f] to-[#252579] bg-[length:200%_100%] bg-[position:0%_50%] px-2.5 text-xs font-semibold text-white shadow-[0_4px_16px_rgba(37,37,121,0.20)] transition-[background-position,border-color,box-shadow,transform] duration-500 ease-out hover:-translate-y-0.5 hover:border-[#2d2d8f]/60 hover:bg-[position:100%_50%] hover:shadow-[0_8px_22px_rgba(37,37,121,0.28)] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-[#252579]/30 focus-visible:ring-offset-2 sm:px-4 sm:text-sm"
                                >
                                    <span
                                        aria-hidden="true"
                                        className="pointer-events-none absolute inset-y-0 -left-1/2 z-0 w-1/3 skew-x-[-18deg] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 blur-[2px] transition-[left,opacity] duration-[800ms] ease-out group-hover/appointment:left-[120%] group-hover/appointment:opacity-100"
                                    />

                                    <span className="relative z-10 flex items-center gap-1.5 sm:gap-2">
                                        <Calendar className="h-3.5 w-3.5 shrink-0 text-white/90 transition-[transform] duration-300 ease-out group-hover/appointment:-translate-y-0.5 group-hover/appointment:rotate-[-4deg] sm:h-4 sm:w-4" />

                                        <span>
                                            Novo Agendamento
                                        </span>
                                    </span>
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Conteúdo */}
                <section className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                    <Appointments userId={session.user.id} />

                    <Reminders userId={session.user.id} />
                </section>
            </main>

            <style>{`
    .smartclin-dashboard-line-top,
    .smartclin-dashboard-line-bottom {
        width: 59%;
        opacity: 0.6;
        animation-duration: 10s;
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
        </TooltipProvider>
    )
}