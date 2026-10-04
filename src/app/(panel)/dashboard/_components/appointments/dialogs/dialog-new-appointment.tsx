"use client"

import { useQuery } from "@tanstack/react-query"
import { Prisma } from "@/generated/prisma/client"
import { Loader2, AlertCircle, CalendarPlus } from "lucide-react"
import { DatePicker } from "@/components/ui/date-picker"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

import { DialogSchedule } from "./dialog-schedule"

type UserWithServiceAndSubscription = Prisma.UserGetPayload<{
    include: {
        subscription: true
        services: true
    }
}>

interface DialogNewAppointmentProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    userId: string
    clinic?: UserWithServiceAndSubscription
    onSuccess?: () => void
}

export function DialogNewAppointment({
    isOpen,
    onOpenChange,
    userId,
    clinic: clinicProp,
    onSuccess,
}: DialogNewAppointmentProps) {
    const { data: fetchedClinic, isLoading } = useQuery({
        queryKey: ["get-clinic-details", userId],
        queryFn: async () => {
            const response = await fetch(`/api/clinic/${userId}`)
            if (!response.ok) return null
            return (await response.json()) as UserWithServiceAndSubscription
        },
        enabled: !clinicProp && !!userId && isOpen,
    })

    const clinic = clinicProp || fetchedClinic

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
                <DialogContent className="w-[calc(100%-2rem)] sm:w-[95vw] sm:max-w-[1320px] overflow-hidden p-4 sm:p-6 [&>button]:text-slate-400 [&>button]:bg-transparent [&>button]:hover:bg-rose-50 [&>button]:hover:text-rose-600 [&>button]:transition-colors">
                <DialogHeader className="group/header -mx-4 -mt-4 mb-2 border-b border-border/60 bg-gradient-to-br from-background via-background to-[#252579]/[0.025] px-4 py-4 sm:-mx-6 sm:-mt-6 sm:px-6 sm:py-5">
                    <DialogTitle className="flex items-center gap-3 text-base font-bold">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-[#252579]/10 bg-[#252579]/[0.06] text-[#252579] transition-[background-color,border-color,transform,box-shadow] duration-300 ease-out group-hover/header:scale-105 group-hover/header:border-[#252579]/20 group-hover/header:bg-[#252579]/[0.09] group-hover/header:shadow-[0_4px_12px_rgba(37,37,121,0.08)]">
                            <CalendarPlus className="h-4 w-4 transition-transform duration-300 ease-out group-hover/header:scale-110 group-hover/header:-rotate-3" />
                        </div>
                        <span className="bg-gradient-to-r from-[#252579] via-[#2d2d8f] to-[#252579] bg-clip-text text-transparent">
                            Novo Agendamento
                        </span>
                    </DialogTitle>
                </DialogHeader>

                {isLoading && !clinic ? (
                    <div className="flex min-h-[220px] w-full items-center justify-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="h-6 w-6 animate-spin text-[#252579]" />
                        <span>Carregando dados...</span>
                    </div>
                ) : clinic ? (
                    <DialogSchedule
                        clinic={clinic}
                        onSuccess={() => {
                            onSuccess?.()
                            onOpenChange(false)
                        }}
                    />
                ) : (
                    <div className="flex min-h-[200px] w-full flex-col items-center justify-center gap-2 text-center text-sm text-muted-foreground">
                        <AlertCircle className="h-8 w-8 text-amber-500/80" />
                        <p className="font-medium text-foreground">Não foi possível carregar os dados da clínica.</p>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}