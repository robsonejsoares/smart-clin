import { Button } from "@/components/ui/button"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

export function Hero() {
    return (<section className="relative isolate overflow-hidden bg-background"> <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 -top-40 h-[480px] w-[480px] rounded-full bg-emerald-500/[0.06] blur-3xl smartclin-pulse"
    />


        <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-40 top-0 h-[520px] w-[520px] rounded-full bg-[#252579]/[0.06] blur-3xl smartclin-pulse"
            style={{ animationDelay: "700ms" }}
        />

        <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-[42%] h-80 w-80 -translate-x-1/2 rounded-full bg-emerald-500/[0.025] blur-3xl"
        />

        <div className="container relative mx-auto px-4 pb-20 pt-24 sm:px-6 lg:px-8 lg:pb-28 lg:pt-32">
            <main className="grid min-h-[540px] items-center gap-14 lg:grid-cols-[1.02fr_0.98fr] lg:gap-16">
                <article className="relative z-10 flex max-w-3xl flex-col justify-center">
                    <div
                        className="smartclin-fade-in relative mb-7 h-16 w-56"
                        style={{ animationDelay: "100ms" }}
                        aria-hidden="true"
                    >
                        <div
                            className="absolute left-0 top-1/2 h-px w-52 -translate-y-1/2 rotate-[-8deg] bg-gradient-to-r from-emerald-500/0 via-emerald-500/35 to-[#252579]/10"
                        />

                        <div
                            className="absolute left-8 top-[42%] h-8 w-40 -rotate-[8deg] rounded-full border-t border-emerald-500/[0.16] blur-[0.2px]"
                        />

                        <div
                            className="absolute left-14 top-[58%] h-12 w-44 rotate-[5deg] rounded-[50%] border-t border-[#252579]/[0.10]"
                        />

                        <div
                            className="absolute left-20 top-[35%] h-10 w-36 -rotate-[3deg] rounded-[50%] border-t border-emerald-500/[0.09]"
                        />

                        <div
                            className="absolute left-2 top-[44%] h-7 w-7 -translate-y-1/2 rounded-full border border-emerald-500/20 bg-emerald-500/[0.04] shadow-[0_0_24px_rgba(16,185,129,0.16)] smartclin-pulse"
                        />

                        <div
                            className="absolute left-[4.5rem] top-[38%] h-2 w-2 rounded-full bg-emerald-500/70 shadow-[0_0_14px_rgba(16,185,129,0.4)] smartclin-hero-dot"
                            style={{ animationDelay: "300ms" }}
                        />

                        <div
                            className="absolute left-[8.5rem] top-[58%] h-1.5 w-1.5 rounded-full bg-[#252579]/60 shadow-[0_0_12px_rgba(37,37,121,0.3)] smartclin-hero-dot"
                            style={{ animationDelay: "650ms" }}
                        />

                        <div
                            className="absolute left-[11.5rem] top-[32%] h-2 w-2 rounded-full bg-emerald-400/80 shadow-[0_0_15px_rgba(16,185,129,0.35)] smartclin-hero-dot"
                            style={{ animationDelay: "900ms" }}
                        />

                        <div
                            className="absolute left-[14.5rem] top-[55%] h-1.5 w-1.5 rounded-full bg-[#252579]/45 smartclin-hero-dot"
                            style={{ animationDelay: "1100ms" }}
                        />

                        <div
                            className="absolute left-[17.5rem] top-[38%] h-1 w-1 rounded-full bg-emerald-500/60 smartclin-hero-dot"
                            style={{ animationDelay: "500ms" }}
                        />

                        <div
                            className="absolute left-10 top-1/2 h-px w-32 origin-left -rotate-[18deg] bg-gradient-to-r from-emerald-500/25 to-transparent"
                        />

                        <div
                            className="absolute left-[7rem] top-[55%] h-px w-28 origin-left rotate-[13deg] bg-gradient-to-r from-[#252579]/20 to-transparent"
                        />

                        <div
                            className="absolute left-[11rem] top-[35%] h-px w-24 origin-left -rotate-[15deg] bg-gradient-to-r from-emerald-500/20 to-transparent"
                        />

                        <div
                            className="absolute left-[15rem] top-[50%] h-px w-20 origin-left rotate-[10deg] bg-gradient-to-r from-[#252579]/15 to-transparent"
                        />

                        <div
                            aria-hidden="true"
                            className="absolute left-1 top-[34%] h-20 w-20 rounded-full bg-emerald-500/[0.025] blur-2xl smartclin-pulse"
                            style={{ animationDelay: "500ms" }}
                        />
                    </div>

                    <h1
                        className="smartclin-fade-in max-w-3xl text-5xl font-bold leading-[1.02] tracking-[-0.045em] text-foreground sm:text-6xl lg:text-[4.5rem]"
                        style={{ animationDelay: "220ms" }}
                    >
                        Cuidar da sua saúde
                        <span className="relative mt-2 block w-fit bg-gradient-to-r from-[#252579] via-[#3535a0] to-emerald-500 bg-clip-text text-transparent">
                            ficou mais simples.

                            <span
                                aria-hidden="true"
                                className="smartclin-hero-line absolute -bottom-2 left-0 h-1.5 w-2/3 rounded-full bg-gradient-to-r from-[#252579] via-emerald-500 to-transparent opacity-80"
                            />
                        </span>
                    </h1>

                    <p
                        className="smartclin-fade-in mt-7 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8"
                        style={{ animationDelay: "360ms" }}
                    >
                        Encontre clínicas e profissionais de saúde em um só
                        lugar. Agende seu atendimento de forma simples,
                        rápida e organizada.
                    </p>

                    <div
                        className="smartclin-fade-in mt-9 flex items-center gap-4"
                        style={{ animationDelay: "500ms" }}
                    >
                        <Button
                            size="lg"
                            className="group relative h-12 overflow-hidden rounded-xl bg-[#252579] px-7 font-semibold text-white shadow-lg shadow-[#252579]/20 transition-[background-color,box-shadow,transform] duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#2d2d8f] hover:shadow-xl hover:shadow-[#252579]/25"
                        >
                            <span
                                aria-hidden="true"
                                className="absolute inset-y-0 -left-10 w-8 -skew-x-12 bg-white/10 opacity-0 transition-[left,opacity] duration-700 ease-out group-hover:left-[120%] group-hover:opacity-100"
                            />

                            <span className="relative">
                                Encontre uma clínica
                            </span>

                            <ArrowRight className="relative ml-2 h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-1" />
                        </Button>
                    </div>
                </article>

                <div className="relative hidden min-h-[500px] items-center justify-center lg:flex">
                    <div
                        aria-hidden="true"
                        className="absolute h-[470px] w-[470px] rounded-full bg-emerald-500/[0.065] blur-3xl smartclin-pulse"
                        style={{ animationDelay: "300ms" }}
                    />

                    <div
                        aria-hidden="true"
                        className="absolute h-[390px] w-[390px] rounded-full bg-[#252579]/[0.055] blur-3xl"
                    />

                    <div
                        aria-hidden="true"
                        className="absolute h-[490px] w-[490px] rotate-6 rounded-[4rem] border border-emerald-500/[0.06]"
                    />

                    <div
                        aria-hidden="true"
                        className="absolute h-[410px] w-[410px] -rotate-6 rounded-[3.5rem] border border-[#252579]/[0.055]"
                    />

                    <div
                        className="smartclin-fade-scale relative flex h-[430px] w-[430px] items-center justify-center"
                        style={{ animationDelay: "250ms" }}
                    >
                        <div
                            aria-hidden="true"
                            className="absolute inset-0 rounded-[3rem] border border-border/50 bg-gradient-to-br from-background/95 via-muted/20 to-emerald-500/[0.045] shadow-2xl shadow-[#252579]/[0.08]"
                        />

                        <div
                            aria-hidden="true"
                            className="absolute inset-5 rounded-[2.5rem] border border-emerald-500/10 bg-gradient-to-br from-emerald-500/[0.02] via-transparent to-[#252579]/[0.025]"
                        />

                        <div
                            aria-hidden="true"
                            className="absolute inset-14 rounded-[2rem] bg-gradient-to-br from-[#252579]/[0.035] via-transparent to-emerald-500/[0.05]"
                        />

                        <div
                            aria-hidden="true"
                            className="absolute inset-[4.5rem] rounded-[2.5rem] border border-white/[0.05] bg-gradient-to-br from-white/[0.025] to-transparent"
                        />

                        <div
                            aria-hidden="true"
                            className="absolute -inset-8 rounded-[3rem] border border-emerald-500/[0.08] opacity-60"
                        />

                        <div
                            aria-hidden="true"
                            className="absolute -inset-14 rounded-[3.5rem] border border-[#252579]/[0.05] opacity-70"
                        />

                        <div
                            aria-hidden="true"
                            className="absolute -inset-3 rounded-[3rem] border border-transparent bg-[conic-gradient(from_0deg,transparent,rgba(16,185,129,0.18),transparent,rgba(37,37,121,0.12),transparent)] opacity-0 transition-[opacity,transform] duration-1000 ease-out group-hover/logo:rotate-180 group-hover/logo:opacity-100"
                        />

                        <div className="group/logo relative z-10 flex h-72 w-72 items-center justify-center overflow-hidden rounded-[2.5rem] border border-border/60 bg-background/90 shadow-xl shadow-black/[0.07] backdrop-blur-md transition-[transform,border-color,box-shadow] duration-700 ease-out hover:scale-[1.035] hover:border-emerald-500/20 hover:shadow-2xl hover:shadow-[#252579]/[0.12]">
                            <div
                                aria-hidden="true"
                                className="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-500/[0.035] via-transparent to-[#252579]/[0.04] opacity-70 transition-opacity duration-700 group-hover/logo:opacity-100"
                            />

                            <div
                                aria-hidden="true"
                                className="pointer-events-none absolute -inset-24 -rotate-12 bg-gradient-to-r from-transparent via-white/[0.10] to-transparent opacity-0 transition-[transform,opacity] duration-[1400ms] ease-out group-hover/logo:translate-x-32 group-hover/logo:opacity-100"
                            />

                            <div
                                aria-hidden="true"
                                className="pointer-events-none absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-500/[0.08] transition-[transform,opacity] duration-700 group-hover/logo:scale-110 group-hover/logo:opacity-100"
                            />

                            <div
                                aria-hidden="true"
                                className="pointer-events-none absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#252579]/[0.055] transition-[transform,opacity] duration-1000 group-hover/logo:scale-90"
                            />

                            <Image
                                src="/logo-smart-clin.png"
                                alt="Logo SmartClin"
                                width={260}
                                height={360}
                                priority
                                className="relative z-10 h-auto w-56 object-contain drop-shadow-2xl transition-[transform,filter] duration-700 ease-out group-hover/logo:scale-[1.045] group-hover/logo:drop-shadow-[0_18px_30px_rgba(37,37,121,0.18)]"
                            />

                            <div
                                aria-hidden="true"
                                className="pointer-events-none absolute bottom-7 left-1/2 h-px w-20 -translate-x-1/2 bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent opacity-50 transition-[width,opacity] duration-700 group-hover/logo:w-32 group-hover/logo:opacity-100"
                            />
                        </div>

                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute -right-1 top-1/2 h-16 w-16 -translate-y-1/2 rounded-full border border-emerald-500/[0.08] transition-transform duration-[1400ms] ease-out group-hover/logo:rotate-180"
                        />

                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute -left-2 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full border border-[#252579]/[0.08] transition-transform duration-[1100ms] ease-out group-hover/logo:-rotate-180"
                        />

                        <div
                            aria-hidden="true"
                            className="absolute left-4 top-10 h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.5)] smartclin-hero-dot"
                        />

                        <div
                            aria-hidden="true"
                            className="absolute right-5 top-20 h-1.5 w-1.5 rounded-full bg-[#252579]/60 shadow-[0_0_14px_rgba(37,37,121,0.3)] smartclin-hero-dot"
                            style={{ animationDelay: "450ms" }}
                        />

                        <div
                            aria-hidden="true"
                            className="absolute bottom-10 right-6 h-2 w-2 rounded-full bg-[#252579]/60 shadow-[0_0_16px_rgba(37,37,121,0.3)] smartclin-hero-dot"
                            style={{ animationDelay: "700ms" }}
                        />

                        <div
                            aria-hidden="true"
                            className="absolute bottom-5 left-20 h-1.5 w-1.5 rounded-full bg-emerald-500/70 shadow-[0_0_12px_rgba(16,185,129,0.3)] smartclin-hero-dot"
                            style={{ animationDelay: "900ms" }}
                        />
                    </div>
                </div>
            </main>
        </div>
    </section>
    )
}
