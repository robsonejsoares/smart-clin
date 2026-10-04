import Image from "next/image"
import { ArrowRight, MapPin } from "lucide-react"
import { LoadingLink } from "@/components/loading-link"
import fotoImg from "../../../../public/logo-smart-clin.png"

import {
    Card,
    CardContent,
} from "@/components/ui/card"
import { User } from "@/generated/prisma/client"

const clinics = [
    {
        name: "Clínica Smart Saúde",
        address: "Rua 3, CH 82, Vicente Pires - DF",
        image: fotoImg,
        available: true,
    },
    {
        name: "Centro Médico Brasília",
        address: "Águas Claras, Brasília - DF",
        image: fotoImg,
        available: true,
    },
    {
        name: "Clínica Vida",
        address: "Asa Sul, Brasília - DF",
        image: fotoImg,
        available: false,
    },
    {
        name: "Espaço Saúde",
        address: "Taguatinga, Brasília - DF",
        image: fotoImg,
        available: true,
    },
]

interface ProfessionalsProps {
    professionals: User[]
}

export function Professionals({ professionals }: ProfessionalsProps) {
    return (<section className="relative overflow-hidden border-y border-border/50 bg-muted/20 py-20 sm:py-24"> <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-48 top-20 h-96 w-96 rounded-full bg-emerald-500/[0.04] blur-3xl"
    />


        <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-48 bottom-0 h-96 w-96 rounded-full bg-[#252579]/[0.04] blur-3xl"
        />

        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto mb-12 max-w-2xl text-center sm:mb-14">
                <h2 className="text-3xl font-bold tracking-[-0.025em] text-foreground sm:text-4xl lg:text-5xl">
                    Clínicas Disponíveis
                </h2>

                <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
                    Encontre uma clínica próxima e agende seu atendimento de forma simples e rápida.
                </p>
            </div>

            <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {professionals.map((clinic, index) => (
                    <Card
                        key={clinic.id}
                        className="group flex h-full overflow-hidden rounded-xl border-border/60 bg-background shadow-sm transition-[transform,border-color,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:border-[#252579]/20 hover:shadow-lg hover:shadow-[#252579]/[0.05]"
                    >
                        <CardContent className="flex h-full w-full flex-col p-0">
                            <div className="relative h-48 shrink-0 overflow-hidden bg-muted">
                                <Image
                                    src={clinic.image ?? fotoImg}
                                    alt={`Imagem da ${clinic.name}`}
                                    fill
                                    priority={index === 0}
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                                />

                                <div
                                    aria-hidden="true"
                                    className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent"
                                />

                                <div
                                    className={`absolute right-3 top-3 flex h-6 items-center overflow-hidden rounded-full border bg-white/80 shadow-sm backdrop-blur-sm transition-[width,box-shadow,border-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${clinic.status
                                        ? "w-6 border-emerald-500/15"
                                        : "w-6 border-red-500/15"
                                        } group-hover:w-[82px]`}
                                >
                                    <span
                                        className={`mx-[7px] h-1.5 w-1.5 shrink-0 rounded-full transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110 ${clinic.status
                                            ? "bg-emerald-500 shadow-[0_0_0_3px_rgba(16,185,129,0.08)]"
                                            : "bg-red-500 shadow-[0_0_0_3px_rgba(239,68,68,0.08)]"
                                            }`}
                                    />

                                    <span
                                        className={`min-w-0 truncate pr-2 text-[9px] font-medium opacity-0 transition-[opacity,transform] delay-75 duration-250 ease-out group-hover:translate-x-0 group-hover:opacity-100 ${clinic.status
                                            ? "text-emerald-600"
                                            : "text-red-600"
                                            }`}
                                    >
                                        {clinic.status ? "Disponível" : "Indisponível"}
                                    </span>
                                </div>
                            </div>

                            <div className="flex min-h-[210px] flex-1 flex-col p-5">
                                <div>
                                    <h3 className="truncate text-lg font-semibold tracking-tight text-foreground transition-colors duration-200 group-hover:text-[#252579]">
                                        {clinic.name}
                                    </h3>

                                    <div className="mt-3 flex min-h-[48px] items-start gap-2.5">
                                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#252579]" />

                                        <p className="text-sm leading-6 text-muted-foreground">
                                            {clinic.address ?? "Endereço não informado."}
                                        </p>
                                    </div>
                                </div>

                                <LoadingLink
                                    href={`/clinica/${clinic.id}`}
                                    target="_blank"
                                    className="mt-auto flex h-11 w-full items-center justify-center gap-2 rounded-md bg-[#252579] px-4 text-sm font-semibold text-white shadow-sm shadow-[#252579]/15 transition-[background-color,box-shadow,transform] duration-200 ease-out hover:-translate-y-0.5 hover:bg-[#2d2d8f] hover:shadow-md hover:shadow-[#252579]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#252579]/40 focus-visible:ring-offset-2"
                                >
                                    Agendar horário

                                    <ArrowRight className="h-4 w-4 transition-transform duration-200 ease-out group-hover:translate-x-1" />
                                </LoadingLink>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </section>
        </div>
    </section>
    )
}
