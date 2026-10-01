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
    if (value) {
        setDisplayMonth(value)
    }
}, [value])

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
            className="group h-11 w-full justify-between gap-3 rounded-lg border-border/70 bg-background px-3.5 font-medium shadow-sm shadow-black/[0.025] transition-[border-color,background-color,box-shadow,transform] duration-300 hover:-translate-y-px hover:border-[#252579]/25 hover:bg-[#252579]/[0.025] hover:shadow-md hover:shadow-[#252579]/[0.05] active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-[#252579]/15 focus-visible:ring-offset-1"
        >
            <span className="flex min-w-0 items-center gap-2.5">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#252579]/[0.07] text-[#252579] transition-[background-color,transform] duration-200 group-hover:scale-105 group-hover:bg-[#252579]/[0.10]">
                    <CalendarDays className="h-3.5 w-3.5" />
                </span>

                <span className="truncate text-sm font-medium">
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
                className={`absolute left-0 z-[100] w-[318px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-border/70 bg-background shadow-2xl shadow-black/[0.10] animate-in fade-in-0 zoom-in-95 duration-150 ${
                    openUpward
                        ? "bottom-[calc(100%+8px)]"
                        : "top-[calc(100%+8px)]"
                }`}
            >
                <div className="border-b border-border/60 bg-gradient-to-r from-[#252579]/[0.035] via-background to-emerald-500/[0.035] px-4 py-3.5">
                    <div className="flex items-center gap-2.5">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#252579]/[0.07] text-[#252579]">
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
                                    className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-full border border-border/60 bg-background text-muted-foreground transition-[background-color,border-color,color,transform,box-shadow] duration-200 hover:border-[#252579]/20 hover:bg-[#252579]/[0.06] hover:text-[#252579] hover:shadow-sm active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#252579]/25 focus-visible:ring-offset-1"
                                >
                                    <ChevronLeft className="h-3.5 w-3.5" />
                                </button>
                            </TooltipTrigger>

                            <TooltipContent
                                side="top"
                                className="rounded-lg border border-border/60 bg-foreground px-3 py-1.5 text-xs font-medium text-background shadow-lg"
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
                                    className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-full border border-border/60 bg-background text-muted-foreground transition-[background-color,border-color,color,transform,box-shadow] duration-200 hover:border-[#252579]/20 hover:bg-[#252579]/[0.06] hover:text-[#252579] hover:shadow-sm active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#252579]/25 focus-visible:ring-offset-1"
                                >
                                    <ChevronRight className="h-3.5 w-3.5" />
                                </button>
                            </TooltipTrigger>

                            <TooltipContent
                                side="top"
                                className="rounded-lg border border-border/60 bg-foreground px-3 py-1.5 text-xs font-medium text-background shadow-lg"
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
                                "flex h-8 items-center justify-center text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60",
                            weeks: "space-y-1",
                            week: "grid grid-cols-7",
                            day: "relative flex h-10 items-center justify-center p-0 text-center",
                            day_button:
                                "relative flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-sm font-medium text-foreground transition-[background-color,color,box-shadow,transform] duration-150 hover:bg-[#252579]/[0.07] hover:text-[#252579] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#252579]/25 focus-visible:ring-offset-1",
                            selected:
                                "!rounded-full !bg-[#6b8ee8] !text-white !shadow-[0_2px_7px_rgba(107,142,232,0.20)] hover:!bg-[#7899ed] hover:!text-white",
                            today:
                                "font-bold text-emerald-600 after:absolute after:bottom-1 after:h-1 after:w-1 after:rounded-full after:bg-emerald-500",
                            outside:
                                "text-muted-foreground/25",
                            disabled:
                                "cursor-not-allowed text-muted-foreground/20 opacity-50",
                        }}
                    />
                </div>

                <div className="border-t border-border/60 bg-muted/[0.16] px-4 py-3">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.28)]" />

                            <span className="text-xs font-normal text-muted-foreground">
                                Hoje
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-[#6b8ee8] shadow-[0_0_6px_rgba(107,142,232,0.28)]" />

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
        <div className="min-h-screen bg-gradient-to-b from-muted/[0.18] via-background to-background">
            <style jsx>{`
            @keyframes smartclin-aurora-drift {
                0% {
                    transform: translate3d(-35%, 20%, 0) rotate(-14deg) scale(0.9);
                }

                25% {
                    transform: translate3d(5%, -8%, 0) rotate(4deg) scale(1.08);
                }

                50% {
                    transform: translate3d(35%, 12%, 0) rotate(15deg) scale(1.15);
                }

                75% {
                    transform: translate3d(-5%, -14%, 0) rotate(-3deg) scale(1.02);
                }

                100% {
                    transform: translate3d(-35%, 20%, 0) rotate(-14deg) scale(0.9);
                }
            }

            @keyframes smartclin-aurora-drift-reverse {
                0% {
                    transform: translate3d(35%, -10%, 0) rotate(12deg) scale(1);
                }

                25% {
                    transform: translate3d(-10%, 18%, 0) rotate(-8deg) scale(1.14);
                }

                50% {
                    transform: translate3d(-40%, -4%, 0) rotate(-17deg) scale(0.92);
                }

                75% {
                    transform: translate3d(0%, 15%, 0) rotate(5deg) scale(1.08);
                }

                100% {
                    transform: translate3d(35%, -10%, 0) rotate(12deg) scale(1);
                }
            }

            @keyframes smartclin-scan {
                0% {
                    transform: translateX(-180%) skewX(-18deg);
                    opacity: 0;
                }

                12% {
                    opacity: 0.75;
                }

                35% {
                    opacity: 0.25;
                }

                55% {
                    opacity: 0.65;
                }

                78% {
                    opacity: 0.15;
                }

                100% {
                    transform: translateX(180%) skewX(-18deg);
                    opacity: 0;
                }
            }

            @keyframes smartclin-particle-float {
                0%,
                100% {
                    transform: translate3d(0, 14px, 0) scale(0.8);
                    opacity: 0.15;
                }

                30% {
                    transform: translate3d(12px, -4px, 0) scale(1);
                    opacity: 0.75;
                }

                60% {
                    transform: translate3d(-8px, -20px, 0) scale(1.25);
                    opacity: 0.9;
                }

                80% {
                    transform: translate3d(8px, -6px, 0) scale(0.95);
                    opacity: 0.5;
                }
            }

            @keyframes smartclin-grid-shift {
                0% {
                    transform: translate3d(0, 0, 0) rotate(0deg);
                }

                50% {
                    transform: translate3d(28px, 18px, 0) rotate(1deg);
                }

                100% {
                    transform: translate3d(56px, 36px, 0) rotate(0deg);
                }
            }

            @keyframes smartclin-orbit {
                0% {
                    transform: rotate(0deg) translateX(-18px) rotate(0deg);
                }

                100% {
                    transform: rotate(360deg) translateX(-18px) rotate(-360deg);
                }
            }

            @keyframes smartclin-pulse-line {
                0%,
                100% {
                    transform: scaleX(0.35);
                    opacity: 0.15;
                }

                50% {
                    transform: scaleX(1);
                    opacity: 0.8;
                }
            }

            @keyframes smartclin-glow-pulse {
                0%,
                100% {
                    opacity: 0.25;
                    transform: scale(0.85);
                }

                50% {
                    opacity: 0.75;
                    transform: scale(1.15);
                }
            }

            @keyframes smartclin-calendar-float {
                0%,
                100% {
                    transform: translateY(0) rotate(0deg);
                }

                25% {
                    transform: translateY(-2px) rotate(-4deg);
                }

                50% {
                    transform: translateY(0) rotate(0deg);
                }

                75% {
                    transform: translateY(-2px) rotate(4deg);
                }
            }

            @media (prefers-reduced-motion: reduce) {
                .smartclin-hero-motion,
                .smartclin-hero-motion-reverse,
                .smartclin-hero-scan,
                .smartclin-hero-particle,
                .smartclin-hero-grid,
                .smartclin-hero-orbit,
                .smartclin-hero-line,
                .smartclin-hero-glow,
                .smartclin-calendar-icon {
                    animation: none !important;
                }
            }
        `}</style>

            <div className="group/hero relative h-36 overflow-hidden border-b border-[#252579]/20 bg-[#0c0c20] sm:h-40">
                <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-[linear-gradient(115deg,#0b0b1d_0%,#17173d_42%,#102f32_72%,#0b0b1d_100%)]"
                />

                <div
                    aria-hidden="true"
                    className="absolute inset-0 opacity-60"
                    style={{
                        background:
                            "radial-gradient(circle at 15% 50%, rgba(37,37,121,0.28), transparent 28%), radial-gradient(circle at 82% 30%, rgba(16,185,129,0.20), transparent 25%), radial-gradient(circle at 50% 100%, rgba(107,142,232,0.12), transparent 32%)",
                    }}
                />

                <div
                    aria-hidden="true"
                    className="smartclin-hero-motion absolute -left-[20%] -top-[80%] h-64 w-[90%] rotate-[-18deg] rounded-[999px] bg-gradient-to-r from-[#252579]/0 via-[#252579]/65 to-emerald-400/0 blur-3xl"
                    style={{
                        animation:
                            "smartclin-aurora-drift 7s ease-in-out infinite",
                    }}
                />

                <div
                    aria-hidden="true"
                    className="smartclin-hero-motion-reverse absolute -right-[25%] -bottom-[85%] h-64 w-[90%] rotate-[16deg] rounded-[999px] bg-gradient-to-r from-emerald-500/0 via-emerald-400/55 to-[#252579]/0 blur-3xl"
                    style={{
                        animation:
                            "smartclin-aurora-drift-reverse 8.5s ease-in-out infinite",
                    }}
                />

                <div
                    aria-hidden="true"
                    className="smartclin-hero-grid absolute -inset-16 opacity-[0.12]"
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(255,255,255,0.13) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.13) 1px, transparent 1px)",
                        backgroundSize: "30px 30px",
                        animation:
                            "smartclin-grid-shift 9s linear infinite",
                    }}
                />

                <div
                    aria-hidden="true"
                    className="smartclin-hero-scan absolute inset-y-[-30%] left-0 w-28 bg-gradient-to-r from-transparent via-white/[0.16] to-transparent blur-md"
                    style={{
                        animation:
                            "smartclin-scan 4.5s ease-in-out infinite",
                    }}
                />

                <div
                    aria-hidden="true"
                    className="smartclin-hero-line absolute left-[8%] top-[28%] h-px w-[84%] origin-center bg-gradient-to-r from-transparent via-emerald-300/50 to-transparent"
                    style={{
                        animation:
                            "smartclin-pulse-line 3.2s ease-in-out infinite",
                    }}
                />

                <div
                    aria-hidden="true"
                    className="smartclin-hero-line absolute left-[18%] top-[70%] h-px w-[64%] origin-center bg-gradient-to-r from-transparent via-[#6b8ee8]/45 to-transparent"
                    style={{
                        animation:
                            "smartclin-pulse-line 4.8s ease-in-out infinite 0.8s",
                    }}
                />

                <div
                    aria-hidden="true"
                    className="smartclin-hero-glow absolute left-[24%] top-[42%] h-24 w-24 rounded-full bg-[#252579]/25 blur-2xl"
                    style={{
                        animation:
                            "smartclin-glow-pulse 3.5s ease-in-out infinite",
                    }}
                />

                <div
                    aria-hidden="true"
                    className="smartclin-hero-glow absolute right-[22%] top-[25%] h-20 w-20 rounded-full bg-emerald-400/20 blur-2xl"
                    style={{
                        animation:
                            "smartclin-glow-pulse 4.2s ease-in-out infinite 0.6s",
                    }}
                />

                <div
                    aria-hidden="true"
                    className="smartclin-hero-orbit absolute left-[18%] top-[18%] h-8 w-8 rounded-full border border-emerald-300/30"
                    style={{
                        animation:
                            "smartclin-orbit 5s linear infinite",
                    }}
                >
                    <span className="absolute -right-1 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-emerald-300 shadow-[0_0_10px_rgba(110,231,183,0.8)]" />
                </div>

                <div
                    aria-hidden="true"
                    className="smartclin-hero-orbit absolute right-[18%] top-[55%] h-10 w-10 rounded-full border border-[#6b8ee8]/25"
                    style={{
                        animation:
                            "smartclin-orbit 7s linear infinite reverse",
                    }}
                >
                    <span className="absolute -left-1 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-blue-200/80 shadow-[0_0_10px_rgba(147,197,253,0.8)]" />
                </div>

                <span
                    aria-hidden="true"
                    className="smartclin-hero-particle absolute left-[12%] top-8 h-1 w-1 rounded-full bg-emerald-300/80 shadow-[0_0_10px_rgba(110,231,183,0.7)]"
                    style={{
                        animation:
                            "smartclin-particle-float 3.8s ease-in-out infinite",
                    }}
                />

                <span
                    aria-hidden="true"
                    className="smartclin-hero-particle absolute left-[31%] top-20 h-1.5 w-1.5 rounded-full bg-white/50 shadow-[0_0_12px_rgba(255,255,255,0.3)]"
                    style={{
                        animation:
                            "smartclin-particle-float 5s ease-in-out infinite 0.7s",
                    }}
                />

                <span
                    aria-hidden="true"
                    className="smartclin-hero-particle absolute left-[52%] top-9 h-1 w-1 rounded-full bg-emerald-200/70 shadow-[0_0_10px_rgba(167,243,208,0.6)]"
                    style={{
                        animation:
                            "smartclin-particle-float 4.4s ease-in-out infinite 1.1s",
                    }}
                />

                <span
                    aria-hidden="true"
                    className="smartclin-hero-particle absolute right-[29%] top-24 h-1.5 w-1.5 rounded-full bg-blue-200/70 shadow-[0_0_12px_rgba(147,197,253,0.6)]"
                    style={{
                        animation:
                            "smartclin-particle-float 4.6s ease-in-out infinite 1.5s",
                    }}
                />

                <span
                    aria-hidden="true"
                    className="smartclin-hero-particle absolute right-[12%] top-10 h-1 w-1 rounded-full bg-white/55 shadow-[0_0_10px_rgba(255,255,255,0.3)]"
                    style={{
                        animation:
                            "smartclin-particle-float 5.8s ease-in-out infinite 0.4s",
                    }}
                />

                <div
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-emerald-400/70 to-transparent"
                />

                <div
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#0c0c20]/65 to-transparent"
                />
            </div>

            <main className="container mx-auto -mt-16 px-4 pb-12">
                <div className="mx-auto w-full max-w-5xl">
                    <section className="relative z-10 flex flex-col items-center">
                        <div className="group/avatar relative h-40 w-40">
                            <div
                                aria-hidden="true"
                                className="absolute -inset-2 rounded-full bg-gradient-to-br from-[#252579]/30 via-emerald-500/25 to-transparent opacity-70 blur-md transition-opacity duration-500 group-hover/avatar:opacity-100"
                            />

                            <div className="relative h-40 w-40 overflow-hidden rounded-full border-4 border-background bg-muted shadow-xl ring-1 ring-border/70 transition-[transform,box-shadow] duration-500 group-hover/avatar:scale-[1.02] group-hover/avatar:shadow-2xl">
                                <Image
                                    src={
                                        clinic.image
                                            ? clinic.image
                                            : logoImg
                                    }
                                    alt="Foto da clínica"
                                    fill
                                    sizes="160px"
                                    className="object-cover transition-transform duration-700 group-hover/avatar:scale-105"
                                />
                            </div>
                        </div>

                        <div className="mt-5 text-center">
                            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                                <span className="bg-gradient-to-r from-[#252579] via-emerald-500 to-[#252579] bg-[length:250%_100%] bg-clip-text text-transparent">
                                    {clinic.name}
                                </span>
                            </h1>

                            {addressUrl ? (
                                <a
                                    href={addressUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group/address mt-2 inline-flex max-w-full items-center justify-center gap-1.5 rounded-md px-1.5 py-1 text-sm text-muted-foreground transition-[color,background-color,transform] duration-200 hover:-translate-y-px hover:bg-[#252579]/[0.04] hover:text-[#252579]"
                                >
                                    <MapPin className="h-4 w-4 shrink-0 text-[#252579] transition-transform duration-200 group-hover/address:-translate-y-px" />

                                    <span className="truncate underline-offset-4 group-hover/address:underline">
                                        {clinic.address}
                                    </span>

                                    <ExternalLink className="h-3.5 w-3.5 shrink-0 opacity-0 transition-opacity duration-200 group-hover/address:opacity-60" />
                                </a>
                            ) : (
                                <div className="mt-2 flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
                                    <MapPin className="h-4 w-4 shrink-0 text-[#252579]" />

                                    <span>
                                        Endereço não informado
                                    </span>
                                </div>
                            )}
                        </div>
                    </section>

                    <section className="mt-8">
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(
                                    handleRegisterAppointment
                                )}
                            >
                                <div className="group relative overflow-visible rounded-2xl border border-border/60 bg-background/95 shadow-lg shadow-black/[0.04]">
                                    <div
                                        aria-hidden="true"
                                        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_92%_5%,rgba(16,185,129,0.045),transparent_25%),radial-gradient(circle_at_5%_95%,rgba(37,37,121,0.035),transparent_30%)]"
                                    />

                                    <div className="relative z-10 border-b border-border/60 bg-gradient-to-br from-background via-background to-emerald-500/[0.02] px-5 py-5 sm:px-7">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#252579]/10 bg-[#252579]/[0.06] text-[#252579]">
                                                <CalendarDays
                                                    className="smartclin-calendar-icon h-5 w-5"
                                                    style={{
                                                        animation:
                                                            "smartclin-calendar-float 3s ease-in-out infinite",
                                                    }}
                                                />
                                            </div>

                                            <div>
                                                <p className="text-base font-semibold tracking-tight">
                                                    Agende seu atendimento
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="relative z-10 space-y-6 px-5 py-6 sm:px-7 sm:py-7">
                                        <FormField
                                            control={form.control}
                                            name="name"
                                            render={({
                                                field,
                                            }) => (
                                                <FormItem className="space-y-2">
                                                    <FormLabel className="text-sm font-semibold text-foreground">
                                                        Nome Completo
                                                    </FormLabel>

                                                    <FormControl>
                                                        <div className="group/field relative">
                                                            <UserRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-[color,transform] duration-200 group-focus-within/field:scale-105 group-focus-within/field:text-[#252579]" />

                                                            <Input
                                                                {...field}
                                                                id="name"
                                                                placeholder="Digite seu nome completo..."
                                                                className="h-11 rounded-lg border-border/70 bg-background pl-10 pr-3.5 shadow-sm transition-[border-color,background-color,box-shadow,transform] duration-300 hover:-translate-y-px hover:border-[#252579]/25 hover:bg-[#252579]/[0.025] hover:shadow-md hover:shadow-[#252579]/[0.05] focus:border-[#252579]/40 focus:bg-background focus:ring-[#252579]/15"
                                                            />
                                                        </div>
                                                    </FormControl>

                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({
                                                field,
                                            }) => (
                                                <FormItem className="space-y-2">
                                                    <FormLabel className="text-sm font-semibold text-foreground">
                                                        E-mail
                                                    </FormLabel>

                                                    <FormControl>
                                                        <div className="group/field relative">
                                                            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-[color,transform] duration-200 group-focus-within/field:scale-105 group-focus-within/field:text-[#252579]" />

                                                            <Input
                                                                {...field}
                                                                id="email"
                                                                type="email"
                                                                placeholder="Digite seu e-mail..."
                                                                className="h-11 rounded-lg border-border/70 bg-background pl-10 pr-3.5 shadow-sm transition-[border-color,background-color,box-shadow,transform] duration-300 hover:-translate-y-px hover:border-[#252579]/25 hover:bg-[#252579]/[0.025] hover:shadow-md hover:shadow-[#252579]/[0.05] focus:border-[#252579]/40 focus:bg-background focus:ring-[#252579]/15"
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
                                                <FormItem className="space-y-2">
                                                    <FormLabel className="text-sm font-semibold text-foreground">
                                                        Telefone
                                                    </FormLabel>

                                                    <FormControl>
                                                        <div className="group/field relative">
                                                            <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-[color,transform] duration-200 group-focus-within/field:scale-105 group-focus-within/field:text-[#252579]" />

                                                            <Input
                                                                {...field}
                                                                id="phone"
                                                                placeholder="(00) 00000-0000"
                                                                className="h-11 rounded-lg border-border/70 bg-background pl-10 pr-3.5 shadow-sm transition-[border-color,background-color,box-shadow,transform] duration-300 hover:-translate-y-px hover:border-[#252579]/25 hover:bg-[#252579]/[0.025] hover:shadow-md hover:shadow-[#252579]/[0.05] focus:border-[#252579]/40 focus:bg-background focus:ring-[#252579]/15"
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

                                        <FormField
                                            control={form.control}
                                            name="gender"
                                            render={({
                                                field,
                                            }) => (
                                                <FormItem className="space-y-2">
                                                    <FormLabel className="text-sm font-semibold text-foreground">
                                                        Gênero
                                                    </FormLabel>

                                                    <FormControl>
                                                        <div className="group/field relative">
                                                            <UserRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-[color,transform] duration-200 group-focus-within/field:scale-105 group-focus-within/field:text-[#252579]" />

                                                            <Select
                                                                onValueChange={
                                                                    field.onChange
                                                                }
                                                                value={
                                                                    field.value
                                                                }
                                                            >
                                                                <SelectTrigger className="h-11 cursor-pointer rounded-lg border-border/70 bg-background pl-10 pr-3.5 shadow-sm transition-[border-color,background-color,box-shadow,transform] duration-300 hover:-translate-y-px hover:border-[#252579]/25 hover:bg-[#252579]/[0.025] hover:shadow-md hover:shadow-[#252579]/[0.05] focus:border-[#252579]/40 focus:ring-[#252579]/15">
                                                                    <SelectValue placeholder="Selecione seu gênero..." />
                                                                </SelectTrigger>

                                                                <SelectContent>
                                                                    <SelectItem
                                                                        value="MALE"
                                                                        className="cursor-pointer"
                                                                    >
                                                                        Homem
                                                                    </SelectItem>

                                                                    <SelectItem
                                                                        value="FEMALE"
                                                                        className="cursor-pointer"
                                                                    >
                                                                        Mulher
                                                                    </SelectItem>

                                                                    <SelectItem
                                                                        value="OTHER"
                                                                        className="cursor-pointer"
                                                                    >
                                                                        Outro
                                                                    </SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
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
                                                <FormItem className="space-y-2">
                                                    <FormLabel className="text-sm font-semibold text-foreground">
                                                        Data do Agendamento
                                                    </FormLabel>

                                                    <FormControl>
                                                        <div className="group/field relative">
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
                                                        </div>
                                                    </FormControl>

                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="serviceId"
                                            render={({
                                                field,
                                            }) => (
                                                <FormItem className="space-y-2">
                                                    <FormLabel className="text-sm font-semibold text-foreground">
                                                        Serviço
                                                    </FormLabel>

                                                    <FormControl>
                                                        <div className="group/field relative">
                                                            <Stethoscope className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-[color,transform] duration-200 group-focus-within/field:scale-105 group-focus-within/field:text-[#252579]" />

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
                                                                <SelectTrigger className="h-11 w-full cursor-pointer rounded-lg border-border/70 bg-background pl-10 pr-3.5 shadow-sm transition-[border-color,background-color,box-shadow,transform] duration-300 hover:-translate-y-px hover:border-[#252579]/25 hover:bg-[#252579]/[0.025] hover:shadow-md hover:shadow-[#252579]/[0.05] focus:border-[#252579]/40 focus:ring-[#252579]/15">
                                                                    <SelectValue placeholder="Selecione um serviço..." />
                                                                </SelectTrigger>

                                                                <SelectContent>
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

                                                                                    <span className="truncate">
                                                                                        {
                                                                                            service.name
                                                                                        }{" "}
                                                                                        - R${" "}
                                                                                        {(
                                                                                            service.price /
                                                                                            100
                                                                                        ).toFixed(
                                                                                            2
                                                                                        )}{" "}
                                                                                        (
                                                                                        {
                                                                                            service.duration
                                                                                        }{" "}
                                                                                        min)
                                                                                    </span>
                                                                                </span>
                                                                            </SelectItem>
                                                                        )
                                                                    )}
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                    </FormControl>

                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {selectedServiceId && (
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between gap-3">
                                                    <div>
                                                        <label className="text-sm font-semibold tracking-tight">
                                                            Horários Disponíveis
                                                        </label>

                                                        <p className="mt-0.5 text-xs text-muted-foreground">
                                                            Selecione um horário para o atendimento.
                                                        </p>
                                                    </div>

                                                    {selectedTime && (
                                                        <div className="flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-500/15 bg-emerald-500/[0.06] px-2.5 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                                                            <CheckCircle2 className="h-3.5 w-3.5" />

                                                            {
                                                                selectedTime
                                                            }
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="overflow-hidden rounded-xl border border-border/60 bg-muted/[0.16] p-3 shadow-sm">
                                                    {availableTimesSlots.length ===
                                                        0 ? (
                                                        <div className="flex min-h-24 items-center justify-center text-center">
                                                            <div>
                                                                <Clock3 className="mx-auto mb-2 h-5 w-5 text-muted-foreground/60" />

                                                                <p className="text-sm font-medium text-muted-foreground">
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

                                        <div className="pt-1">
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
                                                                className="group/submit relative h-11 w-full cursor-pointer overflow-hidden rounded-lg border border-[#252579]/40 bg-gradient-to-r from-[#252579] via-[#2d2d8f] to-[#252579] bg-[length:200%_100%] font-semibold text-white shadow-[0_4px_16px_rgba(37,37,121,0.20)] transition-[background-position,border-color,box-shadow,transform,opacity] duration-500 ease-out hover:-translate-y-0.5 hover:border-[#2d2d8f]/60 hover:bg-[position:100%_50%] hover:shadow-[0_8px_22px_rgba(37,37,121,0.28)] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-[#252579]/30 focus-visible:ring-offset-2 disabled:pointer-events-auto disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
                                                                type="submit"
                                                                loading={
                                                                    form
                                                                        .formState
                                                                        .isSubmitting
                                                                }
                                                                disabled={
                                                                    isFormIncomplete
                                                                }
                                                            >
                                                                <span
                                                                    aria-hidden="true"
                                                                    className="pointer-events-none absolute inset-y-0 -left-1/2 z-0 w-1/3 skew-x-[-18deg] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 blur-[2px] transition-[left,opacity] duration-[800ms] ease-out group-hover/submit:left-[120%] group-hover/submit:opacity-100"
                                                                />

                                                                <span className="relative z-10 flex items-center justify-center gap-2">
                                                                    <CalendarDays className="h-4 w-4" />

                                                                    Realizar Agendamento
                                                                </span>
                                                            </Button>
                                                        </div>
                                                    </TooltipTrigger>

                                                    {isFormIncomplete && (
                                                        <TooltipContent
                                                            side="top"
                                                            className="rounded-lg border border-border/60 bg-foreground px-3 py-1.5 text-xs font-medium text-background shadow-lg"
                                                        >
                                                            Preencha todos os campos e selecione um horário.
                                                        </TooltipContent>
                                                    )}
                                                </Tooltip>
                                            ) : (
                                                <div className="flex items-center justify-center gap-2 rounded-lg border border-red-500/15 bg-red-500/[0.06] px-4 py-3 text-center text-sm font-medium text-red-600">
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