"use client"

import { toast } from "sonner"
import { useState } from "react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { useSearchParams } from "next/navigation"
import { Prisma } from "@/generated/prisma/client"
import { ButtonPickerAppointment } from "./button-date"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DialogNewAppointment } from "./dialog-new-appointment"
import { ModalAppointmentDetails } from "./modals/modal-appointment-details"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { cancelAppointment } from "../../_actions/cancel-appointment"
import { ModalCancelAppointment } from "../modals/modal-cancel-appointment"

import {
    X,
    Clock3,
    CalendarClock,
    CheckCircle2,
    CalendarPlus,
    MessageCircle,
} from "lucide-react"

import { Dialog } from "@/components/ui/dialog"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card"

export type AppointmentWithService = Prisma.AppointmentGetPayload<{
    include: {
        Service: true
    }
}>

type UserWithServiceAndSubscription = Prisma.UserGetPayload<{
    include: {
        subscription: true
        services: true
    }
}>

interface AppointmentsListProps {
    times: string[]
    userId: string
    clinic?: UserWithServiceAndSubscription
}

export function AppointmentsList({
    times,
    userId,
    clinic,
}: AppointmentsListProps) {
    const searchParams = useSearchParams()
    const date = searchParams.get("date")
    const queryClient = useQueryClient()

    const [isDetailOpen, setIsDetailOpen] = useState(false)
    const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false)
    const [detailAppointment, setDetailAppointment] =
        useState<AppointmentWithService | null>(null)

    const [appointmentToCancel, setAppointmentToCancel] =
        useState<AppointmentWithService | null>(null)
    const [isCanceling, setIsCanceling] = useState(false)

    const { data, isLoading, refetch } = useQuery({
        queryKey: ["get-appointments", date],
        queryFn: async () => {
            let activeDate = date
            if (!activeDate) {
                activeDate = format(new Date(), "yyyy-MM-dd")
            }

            const url = `${process.env.NEXT_PUBLIC_URL}/api/clinic/appointments?date=${activeDate}`
            const response = await fetch(url)
            const json = (await response.json()) as AppointmentWithService[]

            if (!response.ok) return []
            return json
        },
        staleTime: 20000,
        refetchInterval: 60000,
    })

    const occupantMap: Record<string, AppointmentWithService> = {}

    if (data && data.length > 0) {
        for (const appointment of data) {
            const requiredSlots = Math.ceil(appointment.Service.duration / 30)
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

        queryClient.invalidateQueries({ queryKey: ["get-appointments"] })
        await refetch()
        toast.success(response.data)
        setAppointmentToCancel(null)
    }

    function handleWhatsApp(appointment: AppointmentWithService) {
        const phone = appointment.phone.replace(/\D/g, "")
        const whatsappPhone = phone.startsWith("55") ? phone : `55${phone}`
        const message = `Olá, ${appointment.name}! Tudo bem? Estamos entrando em contato sobre seu agendamento. Qualquer dúvida, estamos à disposição.`
        const url = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(message)}`
        window.open(url, "_blank", "noopener,noreferrer")
    }

    function handleAppointmentCreated() {
        queryClient.invalidateQueries({ queryKey: ["get-appointments"] })
    }

    return (
        <>
            <Card className="group overflow-hidden border-border/60 bg-background shadow-sm shadow-black/[0.035]">
                <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 border-b border-border/60 bg-gradient-to-r from-background via-background to-[#252579]/[0.025] px-5 py-4 md:px-6">
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2.5">
                            <div className="group/calendar relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[#252579]/15 bg-[#252579]/10 text-[#252579]">
                                <CalendarClock className="h-4 w-4 transition-transform duration-300 group-hover/calendar:scale-110 group-hover/calendar:-rotate-3" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <CardTitle className="text-lg font-bold tracking-tight md:text-xl text-[#252579]">
                                    Agenda de hoje
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
                                                    <OccupiedSlotItem
                                                        key={slot}
                                                        slot={slot}
                                                        occupant={occupant}
                                                        onWhatsApp={() => handleWhatsApp(occupant)}
                                                        onViewDetails={() => {
                                                            setDetailAppointment(occupant)
                                                            setIsDetailOpen(true)
                                                        }}
                                                        onCancel={() => setAppointmentToCancel(occupant)}
                                                    />
                                                )
                                            }

                                            return (
                                                <AvailableSlotItem
                                                    key={slot}
                                                    slot={slot}
                                                    onNewAppointment={() => setIsNewAppointmentOpen(true)}
                                                />
                                            )
                                        })}

                                        <div className="flex items-center justify-center pt-3 pb-1">
                                            <div className="flex items-center gap-2 rounded-full border border-emerald-500/10 bg-emerald-500/[0.035] px-3 py-1.5 text-[10px] font-medium tracking-wide text-muted-foreground/65">
                                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500/70" />
                                                <span>Todos os horários do período foram exibidos</span>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>

            <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <ModalAppointmentDetails
                    appointment={detailAppointment}
                    isOpen={isDetailOpen}
                    onClose={() => setIsDetailOpen(false)}
                />
            </Dialog>

            <DialogNewAppointment
                isOpen={isNewAppointmentOpen}
                onOpenChange={setIsNewAppointmentOpen}
                userId={userId}
                clinic={clinic}
                onSuccess={handleAppointmentCreated}
            />

            <ModalCancelAppointment
                appointment={appointmentToCancel}
                onClose={() => setAppointmentToCancel(null)}
                onConfirm={handleConfirmCancel}
                isCanceling={isCanceling}
            />
        </>
    )
}

// Subcomponente para horários ocupados
function OccupiedSlotItem({
    slot,
    occupant,
    onWhatsApp,
    onViewDetails,
    onCancel,
}: {
    slot: string
    occupant: AppointmentWithService
    onWhatsApp: () => void
    onViewDetails: () => void
    onCancel: () => void
}) {
    return (
        <div className="group flex min-h-14 items-center gap-3 rounded-xl border border-[#252579]/10 bg-background px-3.5 py-3.5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#252579]/25 hover:bg-[#252579]/[0.035]">
            <div className="flex w-16 shrink-0 items-center">
                <span className="rounded-lg border border-[#252579]/15 bg-[#252579]/[0.05] px-2.5 py-1 text-sm font-bold tabular-nums text-[#252579]/90">
                    {slot}
                </span>
            </div>

            <div className="grid min-w-0 flex-1 grid-cols-[auto_minmax(0,1fr)] items-center gap-2">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <button
                            type="button"
                            onClick={onWhatsApp}
                            className="flex shrink-0 cursor-pointer items-center gap-1 rounded-lg px-1.5 py-1 text-xs font-medium text-muted-foreground hover:bg-[#25D366]/[0.08]"
                        >
                            <MessageCircle className="h-3.5 w-3.5 shrink-0 text-[#252579] hover:text-[#25D366]" />
                            <span className="tabular-nums">{occupant.phone}</span>
                        </button>
                    </TooltipTrigger>
                    <TooltipContent side="top">Entrar em contato via WhatsApp</TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <button
                            type="button"
                            onClick={onViewDetails}
                            className="inline-flex min-w-0 max-w-full cursor-pointer text-left text-sm font-medium text-foreground truncate hover:text-[#252579]"
                        >
                            <span className="truncate">{occupant.name}</span>
                        </button>
                    </TooltipTrigger>
                    <TooltipContent side="top">Visualizar agendamento</TooltipContent>
                </Tooltip>
            </div>

            <div className="ml-auto shrink-0">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onCancel}
                            className="h-8 w-8 rounded-md text-red-500/75 hover:bg-red-500/[0.07] hover:text-red-600"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="left">Cancelar agendamento</TooltipContent>
                </Tooltip>
            </div>
        </div>
    )
}

// Subcomponente para horários disponíveis
function AvailableSlotItem({
    slot,
    onNewAppointment,
}: {
    slot: string
    onNewAppointment: () => void
}) {
    return (
        <div className="group flex min-h-14 items-center gap-3 rounded-xl border border-border/50 bg-background px-3.5 py-3.5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-500/20 hover:bg-emerald-500/[0.02]">
            <div className="flex w-16 shrink-0 items-center">
                <span className="rounded-lg border border-emerald-500/15 bg-emerald-500/[0.06] px-2.5 py-1 text-sm font-bold tabular-nums text-emerald-600">
                    {slot}
                </span>
            </div>

            <div className="flex min-w-0 flex-1 items-center gap-2.5 text-sm text-muted-foreground">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-500/[0.07]">
                    <Clock3 className="h-3.5 w-3.5 text-emerald-600/75" />
                </span>
                <span className="font-medium">Disponível</span>
            </div>

            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={onNewAppointment}
                        className="h-8 w-8 cursor-pointer rounded-md text-[#252579]/70 hover:bg-[#252579]/[0.07] hover:text-[#252579]"
                    >
                        <CalendarPlus className="h-4 w-4" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="left">Novo agendamento</TooltipContent>
            </Tooltip>
        </div>
    )
}