"use client"

import { toast } from "sonner"
import { useState } from "react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import Link, { type LinkProps } from "next/link"
import { useSearchParams } from "next/navigation"
import { Prisma } from "@/generated/prisma/client"
import { ButtonPickerAppointment } from "./button-date"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DialogAppointment } from "./dialog-appointment"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { cancelAppointment } from "../../_actions/cancel-appointment"

import {
    X,
    Clock3,
    CalendarClock,
    CheckCircle2,
    CalendarPlus,
    MessageCircle,
    AlertTriangle,
    Loader2,
} from "lucide-react"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import {
    Tooltip,
    TooltipTrigger,
    TooltipContent,
} from "@/components/ui/tooltip"

import {
    Card,
    CardTitle,
    CardHeader,
    CardContent,
} from "@/components/ui/card"

export type AppointmentWithService = Prisma.AppointmentGetPayload<{
    include: {
        Service: true
    }
}>

interface AppointmentsListProps {
    times: string[]
    userId: string
}

export function AppointmentsList({
    times,
    userId,
}: AppointmentsListProps) {
    const searchParams = useSearchParams()
    const date = searchParams.get("date")
    const queryClient = useQueryClient()

    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [detailAppointment, setDetailAppointment] =
        useState<AppointmentWithService | null>(null)

    // Estado para controlar a modal de confirmação de cancelamento
    const [appointmentToCancel, setAppointmentToCancel] =
        useState<AppointmentWithService | null>(null)
    const [isCanceling, setIsCanceling] = useState(false)

    const { data, isLoading, refetch } = useQuery({
        queryKey: ["get-appointments", date],
        queryFn: async () => {
            let activeDate = date

            if (!activeDate) {
                const today = format(new Date(), "yyyy-MM-dd")
                activeDate = today
            }

            const url = `${process.env.NEXT_PUBLIC_URL}/api/clinic/appointments?date=${activeDate}`
            const response = await fetch(url)
            const json =
                (await response.json()) as AppointmentWithService[]

            if (!response.ok) {
                return []
            }

            return json
        },
        staleTime: 20000,
        refetchInterval: 60000,
    })

    const occupantMap: Record<string, AppointmentWithService> = {}

    if (data && data.length > 0) {
        for (const appointment of data) {
            const requiredSlots = Math.ceil(
                appointment.Service.duration / 30
            )

            const startIndex = times.indexOf(appointment.time)

            if (startIndex !== -1) {
                for (let i = 0; i < requiredSlots; i++) {
                    const slotIndex = startIndex + i

                    if (slotIndex < times.length) {
                        occupantMap[times[slotIndex]] = appointment
                    }
                }
            }
        }
    }

    async function handleConfirmCancel() {
        if (!appointmentToCancel) return

        setIsCanceling(true)

        const response = await cancelAppointment({
            appointmentId: appointmentToCancel.id,
        })

        setIsCanceling(false)

        if (response.error) {
            toast.error(response.error)
            return
        }

        queryClient.invalidateQueries({
            queryKey: ["get-appointments"],
        })

        await refetch()
        toast.success(response.data)
        setAppointmentToCancel(null)
    }

    function handleScheduleAppointment() {
        window.open(
            `${process.env.NEXT_PUBLIC_URL}/clinica/${userId}`,
            "_blank",
            "noopener,noreferrer"
        )
    }

    function handleWhatsApp(appointment: AppointmentWithService) {
        const phone = appointment.phone.replace(/\D/g, "")

        const whatsappPhone = phone.startsWith("55")
            ? phone
            : `55${phone}`

        const message = `Olá, ${appointment.name}! Tudo bem? Estamos entrando em contato sobre seu agendamento. Qualquer dúvida, estamos à disposição.`

        const url = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
            message
        )}`

        window.open(url, "_blank", "noopener,noreferrer")
    }

    return (
        <>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <Card className="group overflow-hidden border-border/60 bg-background shadow-sm shadow-black/[0.035]">
                    <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 border-b border-border/60 bg-gradient-to-r from-background via-background to-[#252579]/[0.025] px-5 py-4 md:px-6">
                        <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2.5">
                                <div className="group/calendar relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[#252579]/15 bg-[#252579]/10 text-[#252579]">
                                    <CalendarClock className="h-4 w-4 animate-[smartclin-fade-scale_700ms_cubic-bezier(0.22,1,0.36,1)_both] transition-[transform,color] duration-300 ease-out group-hover/calendar:scale-110 group-hover/calendar:-rotate-3 group-hover/calendar:text-[#252579]" />

                                    <span
                                        aria-hidden="true"
                                        className="pointer-events-none absolute inset-0 rounded-lg border border-[#252579]/0 transition-[border-color,box-shadow] duration-500 ease-out group-hover/calendar:border-[#252579]/20 group-hover/calendar:shadow-[inset_0_0_12px_rgba(37,37,121,0.08)]"
                                    />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <CardTitle className="relative w-full overflow-hidden text-lg font-bold tracking-tight md:text-xl">
                                        <span className="relative z-10 block truncate bg-gradient-to-r from-[#17172f] via-[#252579] to-[#17172f] bg-[length:250%_100%] bg-[position:0%_50%] bg-clip-text text-transparent transition-[background-position] duration-[1400ms] ease-out group-hover:bg-[position:100%_50%]">
                                            Agenda de hoje
                                        </span>

                                        <span
                                            aria-hidden="true"
                                            className="pointer-events-none absolute inset-y-0 -left-1/2 z-20 w-1/3 skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/90 to-transparent opacity-0 blur-[2px] transition-[left,opacity] duration-[1400ms] ease-out group-hover:left-[120%] group-hover:opacity-100"
                                        />
                                    </CardTitle>
                                </div>
                            </div>
                        </div>
                        <div className="shrink-0">
                            <ButtonPickerAppointment />
                        </div>
                    </CardHeader>

                    <CardContent className="p-0">
                        <ScrollArea className="h-[calc(100vh-20rem)] px-3 lg:h-[calc(100vh-15rem)] lg:px-5">
                            <div className="rounded-2xl bg-muted/[0.12] p-2.5 sm:p-3">
                                <div className="space-y-2.5">
                                    {isLoading ? (
                                        <div className="flex min-h-40 items-center justify-center">
                                            <div className="flex items-center gap-2.5 rounded-xl border border-border/60 bg-background/80 px-4 py-3 text-sm font-medium text-muted-foreground shadow-sm">
                                                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                                                Carregando agenda...
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            {times.map((slot) => {
                                                const occupant = occupantMap[slot]

                                                if (occupant) {
                                                    return (
                                                        <div
                                                            key={slot}
                                                            className="group flex min-h-14 items-center gap-3 rounded-xl border border-[#252579]/10 bg-background px-3.5 py-3.5 shadow-sm shadow-black/[0.025] transition-[background-color,border-color,box-shadow] duration-200 hover:border-[#252579]/15 hover:bg-[#252579]/[0.025] hover:shadow-md hover:shadow-[#252579]/[0.035]"
                                                        >
                                                            <div className="flex w-16 shrink-0 items-center">
                                                                <span className="rounded-lg border border-[#252579]/10 bg-[#252579]/[0.07] px-2.5 py-1 text-sm font-bold tabular-nums text-[#252579]">
                                                                    {slot}
                                                                </span>
                                                            </div>

                                                            <div className="grid min-w-0 flex-1 grid-cols-[auto_minmax(0,1fr)] items-center gap-2">
                                                                <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => handleWhatsApp(occupant)}
                                                                            aria-label={`Enviar mensagem para ${occupant.name} pelo WhatsApp`}
                                                                            className="group/whatsapp relative flex shrink-0 cursor-pointer items-center gap-1 rounded-lg px-1.5 py-1 text-xs font-medium text-muted-foreground transition-[background-color,box-shadow,transform] duration-250 ease-out hover:-translate-y-0.5 hover:bg-[#25D366]/[0.08] hover:shadow-[0_3px_10px_rgba(37,211,102,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366]/25 focus-visible:ring-offset-2"
                                                                        >
                                                                            <MessageCircle className="relative z-10 h-3.5 w-3.5 shrink-0 text-[#252579] transition-[transform,color,filter] duration-300 ease-out group-hover/whatsapp:translate-y-[-1px] group-hover/whatsapp:rotate-[-8deg] group-hover/whatsapp:scale-110 group-hover/whatsapp:text-[#25D366] group-hover/whatsapp:drop-shadow-[0_2px_4px_rgba(37,211,102,0.22)]" />

                                                                            <span className="relative z-10 shrink-0 tabular-nums">
                                                                                {occupant.phone}
                                                                            </span>

                                                                            <span
                                                                                aria-hidden="true"
                                                                                className="pointer-events-none absolute inset-y-0 -left-1/2 z-20 w-1/3 skew-x-[-18deg] bg-gradient-to-r from-transparent via-white/80 to-transparent opacity-0 blur-[1.5px] transition-[left,opacity] duration-[750ms] ease-out group-hover/whatsapp:left-[120%] group-hover/whatsapp:opacity-100"
                                                                            />
                                                                        </button>
                                                                    </TooltipTrigger>

                                                                    <TooltipContent
                                                                        side="top"
                                                                        className="rounded-lg border border-border/60 bg-foreground px-3 py-1.5 text-xs font-medium text-background shadow-lg"
                                                                    >
                                                                        Entrar em contato via WhatsApp
                                                                    </TooltipContent>
                                                                </Tooltip>

                                                                <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <DialogTrigger asChild>
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => setDetailAppointment(occupant)}
                                                                                aria-label={`Visualizar agendamento de ${occupant.name}`}
                                                                                className="group/name relative inline-flex min-w-0 max-w-full cursor-pointer overflow-hidden text-left text-sm font-medium tracking-tight text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#252579]/25 focus-visible:ring-offset-2"
                                                                            >
                                                                                <span className="relative inline-flex min-w-0 max-w-full overflow-hidden rounded-md px-1 py-0.5">
                                                                                    <span
                                                                                        aria-hidden="true"
                                                                                        className="pointer-events-none absolute inset-0 origin-left scale-x-0 rounded-md bg-[#252579]/[0.08] transition-transform duration-300 ease-out group-hover/name:scale-x-100"
                                                                                    />

                                                                                    <span className="relative z-10 inline-block min-w-0 truncate text-foreground transition-[color,transform] duration-250 ease-out group-hover/name:translate-y-[-2px] group-hover/name:text-[#252579]">
                                                                                        {occupant.name}
                                                                                    </span>

                                                                                    <span
                                                                                        aria-hidden="true"
                                                                                        className="pointer-events-none absolute inset-y-0 -left-1/2 z-20 w-1/3 skew-x-[-18deg] bg-gradient-to-r from-transparent via-white/75 to-transparent opacity-0 blur-[2px] transition-[left,opacity] duration-[700ms] ease-out group-hover/name:left-[115%] group-hover/name:opacity-100"
                                                                                    />
                                                                                </span>
                                                                            </button>
                                                                        </DialogTrigger>
                                                                    </TooltipTrigger>

                                                                    <TooltipContent
                                                                        side="top"
                                                                        className="rounded-lg border border-border/60 bg-foreground px-3 py-1.5 text-xs font-medium text-background shadow-lg"
                                                                    >
                                                                        Visualizar agendamento
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            </div>

                                                            <div className="ml-auto shrink-0">
                                                                <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            onClick={() => setAppointmentToCancel(occupant)}
                                                                            aria-label="Cancelar agendamento"
                                                                            className="group/action h-8 w-8 rounded-md text-red-500/75 transition-[background-color,color,transform] duration-200 hover:bg-red-500/[0.07] hover:text-red-600 active:scale-95 focus-visible:ring-2 focus-visible:ring-red-500/25 focus-visible:ring-offset-1 dark:text-red-400/75 dark:hover:text-red-300"
                                                                        >
                                                                            <X className="h-4 w-4 origin-center transition-[transform] duration-250 ease-out group-hover/action:rotate-12 group-hover/action:scale-110 group-active/action:rotate-90" />
                                                                        </Button>
                                                                    </TooltipTrigger>

                                                                    <TooltipContent
                                                                        side="top"
                                                                        className="rounded-lg border border-border/60 bg-foreground px-3 py-1.5 text-xs font-medium text-background shadow-lg"
                                                                    >
                                                                        Cancelar agendamento
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            </div>
                                                        </div>
                                                    )
                                                }

                                                return (
                                                    <div
                                                        key={slot}
                                                        className="group flex min-h-14 items-center gap-3 rounded-xl border border-border/50 bg-background px-3.5 py-3.5 shadow-sm shadow-black/[0.02] transition-[background-color,border-color,box-shadow] duration-200 hover:border-emerald-500/20 hover:bg-emerald-500/[0.02] hover:shadow-md hover:shadow-black/[0.025]"
                                                    >
                                                        <div className="flex w-16 shrink-0 items-center">
                                                            <span className="rounded-lg border border-border/60 bg-muted/50 px-2.5 py-1 text-sm font-semibold tabular-nums text-muted-foreground transition-[background-color,border-color,color] duration-200 group-hover:border-emerald-500/15 group-hover:bg-emerald-500/[0.035] group-hover:text-emerald-700">
                                                                {slot}
                                                            </span>
                                                        </div>

                                                        <div className="flex min-w-0 flex-1 items-center gap-2.5 text-sm text-muted-foreground">
                                                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-500/[0.07]">
                                                                <Clock3 className="h-3.5 w-3.5 text-emerald-600/75 transition-[transform,color] duration-300 ease-out group-hover:scale-110 group-hover:-rotate-6 group-hover:text-emerald-600" />
                                                            </span>

                                                            <span className="font-medium">
                                                                Disponível
                                                            </span>
                                                        </div>

                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Link
                                                                    href={`/clinica/${userId}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="shrink-0 inline-flex"
                                                                >
                                                                    <Button
                                                                        type="button"
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        aria-label="Novo agendamento"
                                                                        className="group/schedule h-8 w-8 cursor-pointer rounded-md text-[#252579]/70 transition-[background-color,color,transform] duration-200 hover:bg-[#252579]/[0.07] hover:text-[#252579] active:scale-95 focus-visible:ring-2 focus-visible:ring-[#252579]/25 focus-visible:ring-offset-1 dark:text-[#252579]/80 dark:hover:text-[#252579]"
                                                                    >
                                                                        <CalendarPlus className="h-4 w-4 origin-bottom transition-[transform,color] duration-300 ease-out group-hover/schedule:-translate-y-0.5 group-hover/schedule:rotate-[-3deg] group-hover/schedule:scale-110" />
                                                                    </Button>
                                                                </Link>
                                                            </TooltipTrigger>

                                                            <TooltipContent
                                                                side="top"
                                                                className="rounded-lg border border-border/60 bg-foreground px-3 py-1.5 text-xs font-medium text-background shadow-lg"
                                                            >
                                                                Novo agendamento
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </div>
                                                )
                                            })}

                                            <div className="flex items-center justify-center pt-3 pb-1">
                                                <div className="group/status flex items-center gap-2 rounded-full border border-emerald-500/10 bg-emerald-500/[0.035] px-3 py-1.5 text-[10px] font-medium tracking-wide text-muted-foreground/65">
                                                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500/70 transition-[transform,color] duration-300 ease-out group-hover/status:scale-110 group-hover/status:rotate-6 group-hover/status:text-emerald-500" />

                                                    <span>
                                                        Todos os horários do período foram exibidos
                                                    </span>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>

                <DialogAppointment appointment={detailAppointment} />
            </Dialog>

            {/* Modal de confirmação para cancelamento (Padronizada para o tom vermelho/rose) */}
            <Dialog
                open={!!appointmentToCancel}
                onOpenChange={(open) => !open && setAppointmentToCancel(null)}
            >
                <DialogContent className="group/modal max-w-md overflow-hidden rounded-2xl border-border/70 p-0">
                    <style jsx>{`
            @keyframes smartclin-alert-pulse {
                0%, 100% {
                    transform: scale(1) rotate(0deg);
                }
                15% {
                    transform: scale(1.15) rotate(-8deg);
                }
                30% {
                    transform: scale(1.15) rotate(8deg);
                }
                45% {
                    transform: scale(1.08) rotate(-4deg);
                }
                60% {
                    transform: scale(1) rotate(0deg);
                }
            }

            @media (prefers-reduced-motion: reduce) {
                .smartclin-alert-icon {
                    animation: none !important;
                }
            }
        `}</style>

                    <DialogHeader className="border-b border-border/60 bg-gradient-to-br from-background via-background to-rose-500/[0.03] px-6 py-5">
                        <DialogTitle className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-rose-500/20 bg-rose-500/10 text-rose-600 transition-all duration-300 group-hover/modal:scale-105 group-hover/modal:border-rose-500/30 group-hover/modal:bg-rose-500/15 group-hover/modal:shadow-[0_4px_12px_rgba(244,63,94,0.12)]">
                                <AlertTriangle
                                    className="smartclin-alert-icon h-4 w-4 text-rose-600"
                                    style={{
                                        animation: "smartclin-alert-pulse 3s ease-in-out infinite",
                                    }}
                                />
                            </div>
                            <span>Cancelar Agendamento</span>
                        </DialogTitle>
                    </DialogHeader>
                    <div className="px-6 py-5 space-y-4">
                        {/* Caixa de destaque principal ajustada para o tom rose */}
                        <div className="relative overflow-hidden rounded-2xl border border-rose-500/20 bg-gradient-to-br from-rose-500/[0.04] via-white to-rose-500/[0.02] p-4 shadow-lg backdrop-blur-xl transition-all duration-300 hover:border-rose-500/40 hover:shadow-xl">

                            {/* Detalhe de luz decorativa no fundo em tom rose */}
                            <div aria-hidden="true" className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-rose-500/10 blur-2xl pointer-events-none" />

                            <p className="text-sm leading-relaxed text-foreground/90 font-medium">
                                Tem certeza que deseja cancelar o agendamento vinculado a/o:
                            </p>

                            {/* Grid de Informações: Nome e Horário em cartões individuais atualizados para rose */}
                            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                {/* Card do Nome */}
                                <div className="group/card relative flex items-center gap-3 rounded-xl border border-rose-500/20 bg-white/90 p-2.5 shadow-xs transition-all duration-300 hover:scale-[1.01] hover:border-rose-500/40 hover:bg-white hover:shadow-md">
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-rose-500/25 bg-rose-500/10 text-rose-600 shadow-sm transition-transform duration-300 group-hover/card:rotate-6">
                                        <span className="text-xs font-bold">👤</span>
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <span className="block text-[10px] font-semibold uppercase tracking-wider text-rose-600/80">Paciente</span>
                                        <span className="block truncate text-xs font-bold text-[#17172f]">{appointmentToCancel?.name}</span>
                                    </div>
                                </div>

                                {/* Card do Horário */}
                                <div className="group/card-time relative flex items-center gap-3 rounded-xl border border-rose-500/20 bg-white/90 p-2.5 shadow-xs transition-all duration-300 hover:scale-[1.01] hover:border-rose-500/40 hover:bg-white hover:shadow-md">
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-rose-500/25 bg-rose-500/10 text-rose-600 shadow-sm transition-transform duration-300 group-hover/card-time:-rotate-6">
                                        <span className="text-xs font-bold">⏰</span>
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <span className="block text-[10px] font-semibold uppercase tracking-wider text-rose-600/80">Horário</span>
                                        <span className="block truncate text-xs font-bold text-[#17172f] tabular-nums">{appointmentToCancel?.time}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <p className="text-xs font-medium text-muted-foreground/80 px-1">
                            Esta ação não poderá ser desfeita.
                        </p>
                    </div>

                    <div className="border-t border-border/60 bg-muted/[0.16] px-6 py-4 flex items-center justify-end gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setAppointmentToCancel(null)}
                            disabled={isCanceling}
                            className="h-10 cursor-pointer rounded-lg border-border/70 bg-background px-4 text-xs font-semibold text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-all"
                        >
                            Cancelar
                        </Button>

                        <Button
                            type="button"
                            onClick={handleConfirmCancel}
                            disabled={isCanceling}
                            className="h-10 cursor-pointer rounded-lg bg-rose-600 px-4 text-xs font-semibold text-white hover:bg-rose-700 active:scale-[0.98] shadow-sm transition-all"
                        >
                            {isCanceling ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin text-white" />
                                    <span>Cancelando agendamento...</span>
                                </>
                            ) : (
                                "Confirmar Cancelamento"
                            )}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}