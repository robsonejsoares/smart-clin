"use client"

import { toast } from "sonner"
import Image from "next/image"
import {
    addMonths,
    format,
    subMonths,
} from "date-fns"
import { ptBR } from "date-fns/locale"
import { DayPicker } from "react-day-picker"
import {
    MapPin,
    UserRound,
    Mail,
    Phone,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Stethoscope,
    Clock3,
    CheckCircle2,
    CalendarDays,
    ExternalLink,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { formatPhone } from "@/utils/formatPhone"
import { Prisma } from "@/generated/prisma/client"
import { ScheduleTimeList } from "./schedule-time-list"
import logoImg from "../../../../../../public/logo-smart-clin.png"
import { createNewAppointment } from "../_actions/create-appointment"
import { useState, useEffect, useCallback, useRef } from "react"
import {
    useAppointmentForm,
    AppointmentFormData,
} from "../_components/schedule-form"
import {
    Select,
    SelectItem,
    SelectValue,
    SelectTrigger,
    SelectContent,
} from "@/components/ui/select"
import {
    Form,
    FormItem,
    FormField,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

type UserWithServiceAndSubscription = Prisma.UserGetPayload<{
    include: {
        subscription: true
        services: true
    }
}>

interface ScheduleContentProps {
    clinic: UserWithServiceAndSubscription
}

export interface TimeSlot {
    time: string
    available: boolean
}

interface AppointmentDatePickerProps {
    value?: Date
    onChange: (date: Date) => void
    openUpward?: boolean
}

function AppointmentDatePicker({
    value,
    onChange,
    openUpward = false,
}: AppointmentDatePickerProps) {
    const containerRef = useRef<HTMLDivElement>(null)

    const selectedDate = value ?? new Date()

    const [displayMonth, setDisplayMonth] =
        useState(value ?? new Date())

    const [isOpen, setIsOpen] =
        useState(false)

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                containerRef.current &&
                !containerRef.current.contains(
                    event.target as Node
                )
            ) {
                setIsOpen(false)
            }
        }

        if (isOpen) {
            document.addEventListener(
                "mousedown",
                handleClickOutside
            )
        }

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            )
        }
    }, [isOpen])

    function handleChangeDate(date: Date | undefined) {
        if (!date) {
            return
        }

        onChange(date)
        setDisplayMonth(date)
        setIsOpen(false)
    }

    function handlePreviousMonth() {
        setDisplayMonth(month =>
            subMonths(month, 1)
        )
    }

    function handleNextMonth() {
        setDisplayMonth(month =>
            addMonths(month, 1)
        )
    }

    return (
        <div
            ref={containerRef}
            className="relative w-full"
        >
            <Button
                type="button"
                variant="outline"
                onClick={() =>
                    setIsOpen(current => !current)
                }
                aria-expanded={isOpen}
                aria-haspopup="dialog"
                className="group h-10 w-full justify-between gap-3 rounded-lg border-border/80 bg-background/60 px-3.5 font-medium shadow-sm transition-all duration-200 hover:border-[#252579]/30 hover:bg-background hover:shadow-md active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-[#252579]/20"
            >
                <span className="flex min-w-0 items-center gap-2.5">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#252579]/[0.08] text-[#252579] transition-transform duration-200 group-hover:scale-105">
                        <CalendarDays className="h-3.5 w-3.5" />
                    </span>

                    <span className="truncate text-sm font-medium text-foreground">
                        {format(
                            selectedDate,
                            "dd/MM/yyyy"
                        )}
                    </span>
                </span>

                <ChevronDown
                    className={`ml-auto h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${
                        isOpen
                            ? "rotate-180 text-[#252579]"
                            : ""
                    }`}
                />
            </Button>

            {isOpen && (
                <div
                    role="dialog"
                    aria-label="Selecionar data"
                    className={`absolute left-0 z-[9999] w-[318px] max-w-[calc(100vw-2rem)] overflow-visible rounded-xl border border-border/80 bg-background/95 backdrop-blur-xl shadow-2xl shadow-black/[0.15] animate-in fade-in-0 zoom-in-95 duration-150 ${
                        openUpward
                            ? "bottom-[calc(100%+8px)]"
                            : "top-[calc(100%+8px)]"
                    }`}
                >
                    <div className="border-b border-border/60 bg-gradient-to-r from-[#252579]/[0.03] via-background to-emerald-500/[0.03] px-4 py-3 rounded-t-xl">
                        <div className="flex items-center gap-2.5">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#252579]/[0.08] text-[#252579]">
                                <CalendarDays className="h-4 w-4" />
                            </div>

                            <div className="min-w-0">
                                <p className="text-sm font-semibold tracking-tight">
                                    Selecionar data
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="px-3 py-3">
                        <div className="mb-2 flex h-10 items-center justify-between px-1">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button
                                        type="button"
                                        onClick={
                                            handlePreviousMonth
                                        }
                                        aria-label="Mês anterior"
                                        className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-border/70 bg-background text-muted-foreground transition-all duration-200 hover:border-[#252579]/30 hover:bg-[#252579]/[0.06] hover:text-[#252579] hover:shadow-sm active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#252579]/25"
                                    >
                                        <ChevronLeft className="h-3.5 w-3.5" />
                                    </button>
                                </TooltipTrigger>

                                <TooltipContent
                                    side="top"
                                    sideOffset={6}
                                    className="z-[99999] rounded-md border border-border/80 bg-foreground px-3 py-1.5 text-xs font-medium text-background shadow-xl"
                                >
                                    Mês anterior
                                </TooltipContent>
                            </Tooltip>

                            <span className="text-sm font-bold capitalize tracking-tight text-foreground">
                                {format(
                                    displayMonth,
                                    "MMMM yyyy",
                                    {
                                        locale: ptBR,
                                    }
                                )}
                            </span>

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button
                                        type="button"
                                        onClick={
                                            handleNextMonth
                                        }
                                        aria-label="Próximo mês"
                                        className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-border/70 bg-background text-muted-foreground transition-all duration-200 hover:border-[#252579]/30 hover:bg-[#252579]/[0.06] hover:text-[#252579] hover:shadow-sm active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#252579]/25"
                                    >
                                        <ChevronRight className="h-3.5 w-3.5" />
                                    </button>
                                </TooltipTrigger>

                                <TooltipContent
                                    side="top"
                                    sideOffset={6}
                                    className="z-[99999] rounded-md border border-border/80 bg-foreground px-3 py-1.5 text-xs font-medium text-background shadow-xl"
                                >
                                    Próximo mês
                                </TooltipContent>
                            </Tooltip>
                        </div>

                        <DayPicker
                            mode="single"
                            month={displayMonth}
                            onMonthChange={
                                setDisplayMonth
                            }
                            selected={selectedDate}
                            onSelect={
                                handleChangeDate
                            }
                            locale={ptBR}
                            weekStartsOn={1}
                            showOutsideDays
                            fixedWeeks
                            hideNavigation
                            className="w-full"
                            classNames={{
                                root: "w-full",
                                months: "w-full",
                                month: "w-full",
                                month_caption:
                                    "hidden",
                                nav: "hidden",
                                caption_label:
                                    "hidden",
                                month_grid:
                                    "w-full border-collapse",
                                weekdays:
                                    "mb-2 grid grid-cols-7",
                                weekday:
                                    "flex h-8 items-center justify-center text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70",
                                weeks: "space-y-1",
                                week: "grid grid-cols-7",
                                day: "relative flex h-10 items-center justify-center p-0 text-center",
                                day_button:
                                    "relative flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-sm font-medium text-foreground transition-all duration-150 hover:bg-[#252579]/[0.08] hover:text-[#252579] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#252579]/25",
                                selected:
                                    "!rounded-lg !bg-[#252579]/15 !text-[#252579] font-bold !shadow-sm hover:!bg-[#252579]/20 hover:!text-[#252579]",
                                today:
                                    "font-bold text-emerald-600 after:absolute after:bottom-1 after:h-1 after:w-1 after:rounded-full after:bg-emerald-400",
                                outside:
                                    "text-muted-foreground/30",
                                disabled:
                                    "cursor-not-allowed text-muted-foreground/20 opacity-40",
                            }}
                        />
                    </div>

                    <div className="border-t border-border/60 bg-muted/[0.15] px-4 py-3 rounded-b-xl">
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-emerald-500" />

                                <span className="text-xs font-normal text-muted-foreground">
                                    Hoje
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-[#252579]/70" />

                                <span className="text-xs font-normal tabular-nums text-muted-foreground">
                                    {format(
                                        selectedDate,
                                        "dd 'de' MMMM",
                                        {
                                            locale: ptBR,
                                        }
                                    )}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export function ScheduleContent({
    clinic,
}: ScheduleContentProps) {
    const form = useAppointmentForm()
    const { watch } = form

    const selectedDate = watch("date")
    const selectedServiceId = watch("serviceId")

    const [selectedTime, setSelectedTime] =
        useState("")

    const [blockedTimes, setBlockedTimes] =
        useState<string[]>([])

    const [availableTimesSlots, setAvailableTimesSlots] =
        useState<TimeSlot[]>([])

    const fetchBlockedTimes = useCallback(
        async (date: Date): Promise<string[]> => {
            try {
                const dateString = date
                    .toISOString()
                    .split("T")[0]

                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_URL}/api/schedule/get-appointments?userId=${clinic.id}&date=${dateString}`
                )

                const json =
                    await response.json()

                if (!response.ok) {
                    console.error(
                        "Erro na API:",
                        json
                    )

                    return []
                }

                if (!Array.isArray(json)) {
                    console.error(
                        "API não retornou um array:",
                        json
                    )

                    return []
                }

                return json
            } catch (error) {
                console.error(
                    "Erro ao buscar horários bloqueados:",
                    error
                )

                return []
            }
        },
        [clinic.id]
    )

    useEffect(() => {
        if (selectedDate) {
            fetchBlockedTimes(
                selectedDate
            ).then(blocked => {
                setBlockedTimes(blocked)

                const dateString =
                    selectedDate
                        .toISOString()
                        .split("T")[0]

                const dayOfWeek =
                    selectedDate.getDay()

                const isSunday =
                    dayOfWeek === 0

                const isSaturday =
                    dayOfWeek === 6

                const holidays = [
                    `${selectedDate.getFullYear()}-01-01`,
                    `${selectedDate.getFullYear()}-04-21`,
                    `${selectedDate.getFullYear()}-05-01`,
                    `${selectedDate.getFullYear()}-09-07`,
                    `${selectedDate.getFullYear()}-10-12`,
                    `${selectedDate.getFullYear()}-11-02`,
                    `${selectedDate.getFullYear()}-11-15`,
                    `${selectedDate.getFullYear()}-11-20`,
                    `${selectedDate.getFullYear()}-12-25`,
                ]

                const isHoliday =
                    holidays.includes(
                        dateString
                    )

                const times =
                    clinic.times || []

                const finalSlots =
                    times.map(time => {
                        const [
                            hours,
                            minutes,
                        ] = time
                            .split(":")
                            .map(Number)

                        const saturdayUnavailable =
                            isSaturday &&
                            (hours > 12 ||
                                (hours === 12 &&
                                    minutes > 0))

                        return {
                            time,
                            available:
                                !isSunday &&
                                !isHoliday &&
                                !saturdayUnavailable &&
                                !blocked.includes(
                                    time
                                ),
                        }
                    })

                setAvailableTimesSlots(
                    finalSlots
                )

                const stillAvailable =
                    finalSlots.find(
                        slot =>
                            slot.time ===
                            selectedTime &&
                            slot.available
                    )

                if (!stillAvailable) {
                    setSelectedTime("")
                }
            })
        }
    }, [
        selectedDate,
        clinic.times,
        fetchBlockedTimes,
        selectedTime,
    ])

    async function handleRegisterAppointment(
        formData: AppointmentFormData
    ) {
        if (!selectedTime) {
            return
        }

        try {
            const response =
                await createNewAppointment({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    gender: formData.gender,
                    time: selectedTime,
                    date: formData.date,
                    serviceId:
                        formData.serviceId,
                    clinicId: clinic.id,
                })

            await new Promise(resolve =>
                setTimeout(resolve, 1000)
            )

            if (response.error) {
                toast.error(response.error)
                return
            }

            toast.success(
                "Agendamento realizado com sucesso!"
            )

            form.reset()
            setSelectedTime("")
        } catch (error) {
            console.error(error)

            toast.error(
                "Ocorreu um erro ao realizar o agendamento."
            )
        }
    }

    const selectedService =
        clinic.services.find(
            service =>
                service.id ===
                selectedServiceId
        )

    const requiredSlots = selectedService
        ? Math.ceil(
            selectedService.duration / 30
        )
        : 1

    const isFormIncomplete =
        !watch("name") ||
        !watch("email") ||
        !watch("phone") ||
        !watch("gender") ||
        !watch("date") ||
        !watch("serviceId") ||
        !selectedTime

    const addressUrl = clinic.address
        ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            clinic.address
        )}`
        : null

    return (
        <TooltipProvider>
            {/* Página inteira com fundo claro, limpo e suave contendo aurora e as bolinhas ascendendo e apagando */}
            <div className="relative min-h-screen overflow-hidden bg-[#f8fafc] text-foreground">
                <style jsx>{`
                    @keyframes smartclin-aurora-drift {
                        0% {
                            transform: translate3d(-10%, 10%, 0) rotate(0deg) scale(1);
                        }
                        50% {
                            transform: translate3d(15%, -15%, 0) rotate(8deg) scale(1.1);
                        }
                        100% {
                            transform: translate3d(-10%, 10%, 0) rotate(0deg) scale(1);
                        }
                    }

                    @keyframes smartclin-aurora-drift-reverse {
                        0% {
                            transform: translate3d(10%, -10%, 0) rotate(0deg) scale(1);
                        }
                        50% {
                            transform: translate3d(-15%, 15%, 0) rotate(-8deg) scale(1.12);
                        }
                        100% {
                            transform: translate3d(10%, -10%, 0) rotate(0deg) scale(1);
                        }
                    }

                    /* Animação original das bolinhas ascendendo e apagando suavemente */
                    @keyframes smartclin-particle-fade-float {
                        0% {
                            transform: translateY(40px) scale(0.5);
                            opacity: 0;
                        }
                        30% {
                            opacity: 0.6;
                        }
                        70% {
                            opacity: 0.6;
                        }
                        100% {
                            transform: translateY(-400px) scale(1.2);
                            opacity: 0;
                        }
                    }

                    @media (prefers-reduced-motion: reduce) {
                        .animate-aurora,
                        .animate-bubble {
                            animation: none !important;
                        }
                    }
                `}</style>

                {/* Camada de Gradientes Aurora Suaves e Claros de Fundo */}
                <div
                    aria-hidden="true"
                    className="animate-aurora absolute -top-[10%] -left-[10%] h-[55vw] w-[55vw] rounded-full bg-gradient-to-br from-blue-200/40 via-indigo-100/30 to-transparent blur-3xl pointer-events-none"
                    style={{ animation: "smartclin-aurora-drift 14s ease-in-out infinite" }}
                />
                <div
                    aria-hidden="true"
                    className="animate-aurora absolute top-[30%] -right-[15%] h-[60vw] w-[60vw] rounded-full bg-gradient-to-bl from-emerald-100/40 via-teal-100/20 to-transparent blur-3xl pointer-events-none"
                    style={{ animation: "smartclin-aurora-drift-reverse 18s ease-in-out infinite" }}
                />

                {/* Partículas / Bolinhas originais que sobem, acendem e apagam suavemente espalhadas pela tela */}
                <div aria-hidden="true" className="absolute inset-0 pointer-events-none overflow-hidden">
                    <span className="absolute bottom-[-10%] left-[12%] h-3 w-3 rounded-full bg-blue-500/30 blur-[0.5px]" style={{ animation: "smartclin-particle-fade-float 7s ease-in-out infinite" }} />
                    <span className="absolute bottom-[-10%] left-[28%] h-2 w-2 rounded-full bg-emerald-500/30 blur-[0.5px]" style={{ animation: "smartclin-particle-fade-float 9s ease-in-out infinite 2s" }} />
                    <span className="absolute bottom-[-10%] left-[45%] h-3.5 w-3.5 rounded-full bg-indigo-500/25 blur-[0.5px]" style={{ animation: "smartclin-particle-fade-float 6s ease-in-out infinite 1s" }} />
                    <span className="absolute bottom-[-10%] left-[65%] h-2.5 w-2.5 rounded-full bg-teal-500/30 blur-[0.5px]" style={{ animation: "smartclin-particle-fade-float 10s ease-in-out infinite 3.5s" }} />
                    <span className="absolute bottom-[-10%] left-[82%] h-3 w-3 rounded-full bg-blue-400/30 blur-[0.5px]" style={{ animation: "smartclin-particle-fade-float 8s ease-in-out infinite 1.5s" }} />
                    <span className="absolute bottom-[-10%] left-[90%] h-2 w-2 rounded-full bg-emerald-400/35 blur-[0.5px]" style={{ animation: "smartclin-particle-fade-float 11s ease-in-out infinite 4s" }} />
                </div>

                {/* Conteúdo Principal com Container Estilo Glassmorphism Limpo */}
                <main className="relative z-10 container mx-auto px-4 py-12 sm:py-16">
                    <div className="mx-auto w-full max-w-3xl">
                        
                        {/* Seção da Clínica / Perfil */}
                        <section className="flex flex-col items-center mb-8 transition-all duration-300">
                            <div className="group/avatar relative h-32 w-32 sm:h-36 sm:w-36">
                                <div
                                    aria-hidden="true"
                                    className="absolute -inset-2 rounded-full bg-gradient-to-br from-[#252579]/20 via-emerald-500/20 to-transparent opacity-75 blur-lg transition-opacity duration-500 group-hover/avatar:opacity-100"
                                />

                                <div className="relative h-full w-full overflow-hidden rounded-full border-4 border-white bg-white shadow-lg ring-1 ring-border/50 transition-transform duration-500 group-hover/avatar:scale-105">
                                    <Image
                                        src={
                                            clinic.image
                                                ? clinic.image
                                                : logoImg
                                        }
                                        alt="Foto da clínica"
                                        fill
                                        sizes="144px"
                                        className="object-cover"
                                    />
                                </div>
                            </div>

                            <div className="mt-4 text-center">
                                <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                                    {clinic.name}
                                </h1>

                                {addressUrl ? (
                                    <a
                                        href={addressUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group/address mt-1.5 inline-flex max-w-full items-center justify-center gap-1.5 rounded-md px-2 py-1 text-sm text-muted-foreground transition-colors hover:text-[#252579]"
                                    >
                                        <MapPin className="h-4 w-4 shrink-0 text-[#252579]" />
                                        <span className="truncate underline-offset-4 group-hover/address:underline">
                                            {clinic.address}
                                        </span>
                                        <ExternalLink className="h-3.5 w-3.5 shrink-0 opacity-60" />
                                    </a>
                                ) : (
                                    <div className="mt-1.5 flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
                                        <MapPin className="h-4 w-4 shrink-0 text-[#252579]" />
                                        <span>Endereço não informado</span>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Formulário com transição suave e bordas padrões */}
                        <section className="transition-all duration-300">
                            <Form {...form}>
                                <form
                                    onSubmit={form.handleSubmit(
                                        handleRegisterAppointment
                                    )}
                                >
                                    <div className="relative rounded-xl border border-border/80 bg-white/90 backdrop-blur-xl shadow-xl shadow-black/[0.04] transition-all duration-300 hover:shadow-2xl">
                                        
                                        {/* Cabeçalho do Card */}
                                        <div className="border-b border-border/60 bg-gradient-to-r from-[#252579]/[0.02] via-white to-emerald-500/[0.02] px-6 py-4 rounded-t-xl">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#252579]/10 bg-[#252579]/[0.06] text-[#252579] transition-transform duration-200 hover:scale-105">
                                                    <CalendarDays className="h-4 w-4" />
                                                </div>
                                                <div>
                                                    <h2 className="text-sm font-bold text-foreground">
                                                        Agende seu atendimento
                                                    </h2>
                                                    <p className="text-xs text-muted-foreground mt-0.5">
                                                        Preencha os campos abaixo para marcar sua consulta.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Campos do Formulário */}
                                        <div className="space-y-4 p-6 sm:p-7">
                                            <FormField
                                                control={form.control}
                                                name="name"
                                                render={({
                                                    field,
                                                }) => (
                                                    <FormItem className="space-y-1.5">
                                                        <FormLabel className="text-xs font-medium text-foreground">
                                                            Nome completo
                                                        </FormLabel>

                                                        <FormControl>
                                                            <div className="relative transition-transform duration-200 focus-within:-translate-y-px">
                                                                <UserRound className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/80" />

                                                                <Input
                                                                    {...field}
                                                                    id="name"
                                                                    placeholder="Digite seu nome completo..."
                                                                    className="h-10 rounded-lg border-border/80 bg-background/60 pl-10 pr-3.5 text-sm shadow-sm transition-all duration-200 focus:bg-background focus:ring-2 focus:ring-[#252579]/20"
                                                                />
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <FormField
                                                    control={form.control}
                                                    name="email"
                                                    render={({
                                                        field,
                                                    }) => (
                                                        <FormItem className="space-y-1.5">
                                                            <FormLabel className="text-xs font-medium text-foreground">
                                                                E-mail
                                                            </FormLabel>

                                                            <FormControl>
                                                                <div className="relative transition-transform duration-200 focus-within:-translate-y-px">
                                                                    <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/80" />

                                                                    <Input
                                                                        {...field}
                                                                        id="email"
                                                                        type="email"
                                                                        placeholder="seu@email.com"
                                                                        className="h-10 rounded-lg border-border/80 bg-background/60 pl-10 pr-3.5 text-sm shadow-sm transition-all duration-200 focus:bg-background focus:ring-2 focus:ring-[#252579]/20"
                                                                    />
                                                                </div>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={form.control}
                                                    name="phone"
                                                    render={({
                                                        field,
                                                    }) => (
                                                        <FormItem className="space-y-1.5">
                                                            <FormLabel className="text-xs font-medium text-foreground">
                                                                Telefone / WhatsApp
                                                            </FormLabel>

                                                            <FormControl>
                                                                <div className="relative transition-transform duration-200 focus-within:-translate-y-px">
                                                                    <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/80" />

                                                                    <Input
                                                                        {...field}
                                                                        id="phone"
                                                                        placeholder="(00) 00000-0000"
                                                                        className="h-10 rounded-lg border-border/80 bg-background/60 pl-10 pr-3.5 text-sm shadow-sm transition-all duration-200 focus:bg-background focus:ring-2 focus:ring-[#252579]/20"
                                                                        onChange={event => {
                                                                            const formattedValue =
                                                                                formatPhone(
                                                                                    event
                                                                                        .target
                                                                                        .value
                                                                                )

                                                                            field.onChange(
                                                                                formattedValue
                                                                            )
                                                                        }}
                                                                    />
                                                                </div>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <FormField
                                                    control={form.control}
                                                    name="gender"
                                                    render={({
                                                        field,
                                                    }) => (
                                                        <FormItem className="space-y-1.5">
                                                            <FormLabel className="text-xs font-medium text-foreground">
                                                                Gênero
                                                            </FormLabel>

                                                            <FormControl>
                                                                <Select
                                                                    onValueChange={
                                                                        field.onChange
                                                                    }
                                                                    value={
                                                                        field.value
                                                                    }
                                                                >
                                                                    <SelectTrigger className="h-10 cursor-pointer rounded-lg border-border/80 bg-background/60 px-3.5 text-sm shadow-sm transition-all duration-200 hover:border-[#252579]/30 focus:ring-2 focus:ring-[#252579]/20">
                                                                        <SelectValue placeholder="Selecione..." />
                                                                    </SelectTrigger>

                                                                    <SelectContent className="rounded-lg border-border/80 shadow-xl">
                                                                        <SelectItem value="MALE" className="cursor-pointer">
                                                                            Homem
                                                                        </SelectItem>
                                                                        <SelectItem value="FEMALE" className="cursor-pointer">
                                                                            Mulher
                                                                        </SelectItem>
                                                                        <SelectItem value="OTHER" className="cursor-pointer">
                                                                            Outro
                                                                        </SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={form.control}
                                                    name="date"
                                                    render={({
                                                        field,
                                                    }) => (
                                                        <FormItem className="space-y-1.5">
                                                            <FormLabel className="text-xs font-medium text-foreground">
                                                                Data do agendamento
                                                            </FormLabel>

                                                            <FormControl>
                                                                <AppointmentDatePicker
                                                                    value={
                                                                        field.value
                                                                    }
                                                                    openUpward={
                                                                        !selectedServiceId
                                                                    }
                                                                    onChange={date => {
                                                                        field.onChange(
                                                                            date
                                                                        )

                                                                        setSelectedTime(
                                                                            ""
                                                                        )
                                                                    }}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            <FormField
                                                control={form.control}
                                                name="serviceId"
                                                render={({
                                                    field,
                                                }) => (
                                                    <FormItem className="space-y-1.5">
                                                        <FormLabel className="text-xs font-medium text-foreground">
                                                            Serviço / Especialidade
                                                        </FormLabel>

                                                        <FormControl>
                                                            <Select
                                                                onValueChange={value => {
                                                                    field.onChange(
                                                                        value
                                                                    )

                                                                    setSelectedTime(
                                                                        ""
                                                                    )
                                                                }}
                                                                value={
                                                                    field.value
                                                                }
                                                            >
                                                                <SelectTrigger className="h-10 w-full cursor-pointer rounded-lg border-border/80 bg-background/60 px-3.5 text-sm shadow-sm transition-all duration-200 hover:border-[#252579]/30 focus:ring-2 focus:ring-[#252579]/20">
                                                                    <SelectValue placeholder="Selecione um serviço..." />
                                                                </SelectTrigger>

                                                                <SelectContent className="rounded-lg border-border/80 shadow-xl">
                                                                    {clinic.services.map(
                                                                        service => (
                                                                            <SelectItem
                                                                                key={
                                                                                    service.id
                                                                                }
                                                                                value={
                                                                                    service.id
                                                                                }
                                                                                className="cursor-pointer"
                                                                            >
                                                                                <span className="flex items-center gap-2">
                                                                                    <Stethoscope className="h-3.5 w-3.5 shrink-0 text-[#252579]" />
                                                                                    <span className="truncate font-medium">
                                                                                        {service.name} - R$ {(service.price / 100).toFixed(2)} ({service.duration} min)
                                                                                    </span>
                                                                                </span>
                                                                            </SelectItem>
                                                                        )
                                                                    )}
                                                                </SelectContent>
                                                            </Select>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            {selectedServiceId && (
                                                <div className="space-y-2 pt-1 animate-in fade-in-50 duration-200">
                                                    <div className="flex items-center justify-between gap-3">
                                                        <label className="text-xs font-medium text-foreground">
                                                            Horários disponíveis
                                                        </label>

                                                        {selectedTime && (
                                                            <div className="flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/[0.08] px-2.5 py-0.5 text-xs font-medium text-emerald-700 animate-in zoom-in-95 duration-150">
                                                                <CheckCircle2 className="h-3.5 w-3.5" />
                                                                {selectedTime}
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="overflow-hidden rounded-lg border border-border/80 bg-background/60 p-3 shadow-sm transition-all duration-200">
                                                        {availableTimesSlots.length ===
                                                            0 ? (
                                                            <div className="flex min-h-24 items-center justify-center text-center">
                                                                <div>
                                                                    <Clock3 className="mx-auto mb-2 h-5 w-5 text-muted-foreground/60" />
                                                                    <p className="text-xs font-medium text-muted-foreground">
                                                                        Nenhum horário disponível para a data selecionada.
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <ScheduleTimeList
                                                                onSelectTime={time =>
                                                                    setSelectedTime(
                                                                        time
                                                                    )
                                                                }
                                                                clinicTimes={
                                                                    clinic.times
                                                                }
                                                                blockedTimes={
                                                                    blockedTimes
                                                                }
                                                                availableTimeSlots={
                                                                    availableTimesSlots
                                                                }
                                                                selectedTime={
                                                                    selectedTime
                                                                }
                                                                selectedDate={
                                                                    selectedDate
                                                                }
                                                                requiredSlots={
                                                                    requiredSlots
                                                                }
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            <div className="pt-2">
                                                {clinic.status ? (
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <div
                                                                className={`w-full ${
                                                                    isFormIncomplete
                                                                        ? "cursor-not-allowed"
                                                                        : ""
                                                                }`}
                                                            >
                                                                <Button
                                                                    className="h-10 w-full cursor-pointer rounded-lg bg-[#252579] font-medium text-white shadow-md shadow-[#252579]/20 transition-all duration-200 hover:bg-[#1d1d60] hover:shadow-lg active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
                                                                    type="submit"
                                                                    disabled={
                                                                        isFormIncomplete ||
                                                                        form.formState.isSubmitting
                                                                    }
                                                                >
                                                                    <CalendarDays className="mr-2 h-4 w-4" />
                                                                    {form.formState.isSubmitting
                                                                        ? "A agendar..."
                                                                        : "Realizar agendamento"}
                                                                </Button>
                                                            </div>
                                                        </TooltipTrigger>

                                                        {isFormIncomplete && (
                                                            <TooltipContent
                                                                side="top"
                                                                className="rounded-lg border border-border/80 bg-foreground px-3 py-1.5 text-xs font-medium text-background shadow-xl"
                                                            >
                                                                Preencha todos os campos e selecione um horário.
                                                            </TooltipContent>
                                                        )}
                                                    </Tooltip>
                                                ) : (
                                                    <div className="flex items-center justify-center gap-2 rounded-lg border border-red-500/20 bg-red-500/[0.06] px-4 py-3 text-center text-xs font-medium text-red-600">
                                                        <span className="h-2 w-2 shrink-0 rounded-full bg-red-500 shadow-[0_0_7px_rgba(239,68,68,0.25)]" />
                                                        Neste momento, a clínica está fechada.
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </Form>
                        </section>
                    </div>
                </main>
            </div>
        </TooltipProvider>
    )
}