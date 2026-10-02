"use client"

import { useQuery } from "@tanstack/react-query"
import { Loader2, AlertCircle } from "lucide-react"
import { Prisma } from "@/generated/prisma/client"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

import { ScheduleModal } from "./schedule-modal"

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
            {/* Removido o overflow-y-auto e reduzido o padding vertical para eliminar a barra de rolagem */}
            <DialogContent className="sm:max-w-[1120px] w-full p-5 overflow-visible [&>button]:text-[#6866ad] [&>button]:bg-[#f0effa] [&>button]:opacity-100 [&>button]:hover:bg-[#e2e0f7] [&>button]:hover:text-[#4b4591] [&>button]:transition-colors">
                <DialogHeader className="mb-2">
                    <DialogTitle className="text-base font-bold text-[#252579]">
                        Novo Agendamento
                    </DialogTitle>
                </DialogHeader>

                {isLoading && !clinic ? (
                    <div className="flex min-h-[220px] w-full items-center justify-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="h-6 w-6 animate-spin text-[#252579]" />
                        <span>Carregando dados...</span>
                    </div>
                ) : clinic ? (
                    <ScheduleModal
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