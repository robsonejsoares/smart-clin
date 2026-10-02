"use client"

import { toast } from "sonner"
import { useState, useEffect, useCallback, useRef } from "react"
import { format, addMonths, subMonths } from "date-fns"
import { ptBR } from "date-fns/locale"
import { DayPicker } from "react-day-picker"
import {
    UserRound,
    Mail,
    Phone,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Clock3,
    CheckCircle2,
    CalendarDays,
    Stethoscope,
    MapPin,
    Calendar,
} from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { formatPhone } from "@/utils/formatPhone"
import { Prisma } from "@/generated/prisma/client"
import { ScheduleTimeList } from "@/app/(public)/clinica/[id]/_components/schedule-time-list"
import { createNewAppointment } from "@/app/(public)/clinica/[id]/_actions/create-appointment"
import {
    useAppointmentForm,
    AppointmentFormData,
} from "@/app/(public)/clinica/[id]/_components/schedule-form"
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
import { TooltipProvider } from "@/components/ui/tooltip"

type UserWithServiceAndSubscription = Prisma.UserGetPayload<{
    include: {
        subscription: true
        services: true
    }
}>

interface ScheduleModalProps {
    clinic: UserWithServiceAndSubscription
    onSuccess?: () => void
}

export interface TimeSlot {
    time: string
    available: boolean
}

function AppointmentDatePicker({
    value,
    onChange,
    openUpward = false,
}: {
    value?: Date
    onChange: (date: Date) => void
    openUpward?: boolean
}) {
    const containerRef = useRef<HTMLDivElement>(null)
    const selectedDate = value ?? new Date()
    const [displayMonth, setDisplayMonth] = useState(value ?? new Date())
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false)
            }
        }
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside)
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [isOpen])

    return (
        <div ref={containerRef} className="relative w-full">
            <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(current => !current)}
                className="h-9 w-full justify-between gap-3 rounded-md border-border/70 bg-background px-3.5 font-medium shadow-sm hover:bg-muted/50 text-xs"
            >
                <span className="flex items-center gap-2.5">
                    <CalendarDays className="h-4 w-4 text-[#252579]" />
                    <span className="text-xs font-medium">
                        {format(selectedDate, "dd/MM/yyyy")}
                    </span>
                </span>
                <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </Button>

            {isOpen && (
                <div className={`absolute left-0 z-[110] w-[318px] rounded-md border border-border/70 bg-background p-3 shadow-2xl ${openUpward ? "bottom-[calc(100%+8px)]" : "top-[calc(100%+8px)]"}`}>
                    <div className="mb-2 flex items-center justify-between px-1">
                        <button
                            type="button"
                            onClick={() => setDisplayMonth(m => subMonths(m, 1))}
                            className="flex h-7 w-7 items-center justify-center rounded border hover:bg-muted"
                        >
                            <ChevronLeft className="h-3.5 w-3.5" />
                        </button>
                        <span className="text-sm font-bold capitalize">
                            {format(displayMonth, "MMMM yyyy", { locale: ptBR })}
                        </span>
                        <button
                            type="button"
                            onClick={() => setDisplayMonth(m => addMonths(m, 1))}
                            className="flex h-7 w-7 items-center justify-center rounded border hover:bg-muted"
                        >
                            <ChevronRight className="h-3.5 w-3.5" />
                        </button>
                    </div>

                    <DayPicker
                        mode="single"
                        month={displayMonth}
                        onMonthChange={setDisplayMonth}
                        selected={selectedDate}
                        onSelect={date => {
                            if (date) {
                                onChange(date)
                                setDisplayMonth(date)
                                setIsOpen(false)
                            }
                        }}
                        locale={ptBR}
                        weekStartsOn={1}
                        className="w-full"
                    />
                </div>
            )}
        </div>
    )
}

export function ScheduleModal({ clinic, onSuccess }: ScheduleModalProps) {
    const form = useAppointmentForm()
    const { watch } = form

    const selectedDate = watch("date")
    const selectedServiceId = watch("serviceId")

    const [selectedTime, setSelectedTime] = useState("")
    const [blockedTimes, setBlockedTimes] = useState<string[]>([])
    const [availableTimesSlots, setAvailableTimesSlots] = useState<TimeSlot[]>([])

    const fetchBlockedTimes = useCallback(
        async (date: Date): Promise<string[]> => {
            try {
                const dateString = date.toISOString().split("T")[0]
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_URL || ""}/api/schedule/get-appointments?userId=${clinic.id}&date=${dateString}`
                )
                const json = await response.json()
                return Array.isArray(json) ? json : []
            } catch {
                return []
            }
        },
        [clinic.id]
    )

    useEffect(() => {
        if (selectedDate) {
            fetchBlockedTimes(selectedDate).then(blocked => {
                setBlockedTimes(blocked)
                const dayOfWeek = selectedDate.getDay()
                const isSunday = dayOfWeek === 0
                const isSaturday = dayOfWeek === 6

                const times = clinic.times || []
                const finalSlots = times.map(time => {
                    const [hours, minutes] = time.split(":").map(Number)
                    const saturdayUnavailable = isSaturday && (hours > 12 || (hours === 12 && minutes > 0))

                    return {
                        time,
                        available: !isSunday && !saturdayUnavailable && !blocked.includes(time),
                    }
                })

                setAvailableTimesSlots(finalSlots)
            })
        }
    }, [selectedDate, clinic.times, fetchBlockedTimes])

    async function handleRegisterAppointment(formData: AppointmentFormData) {
        if (!selectedTime) return

        try {
            const response = await createNewAppointment({
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                gender: formData.gender,
                time: selectedTime,
                date: formData.date,
                serviceId: formData.serviceId,
                clinicId: clinic.id,
            })

            if (response.error) {
                toast.error(response.error)
                return
            }

            toast.success("Agendamento realizado com sucesso!")
            form.reset()
            setSelectedTime("")
            onSuccess?.()
        } catch {
            toast.error("Ocorreu um erro ao realizar o agendamento.")
        }
    }

    const selectedService = clinic.services.find(s => s.id === selectedServiceId)
    const requiredSlots = selectedService ? Math.ceil(selectedService.duration / 30) : 1
    const isFormIncomplete = !watch("name") || !watch("email") || !watch("phone") || !watch("gender") || !watch("date") || !watch("serviceId") || !selectedTime

    return (
        <TooltipProvider>
            <div className="w-full space-y-3">
                
                {/* Cabeçalho da Clínica */}
                <div className="flex flex-col sm:flex-row items-center sm:items-center justify-between gap-4 rounded-md border border-border/70 bg-card p-4 shadow-sm">
                    <div className="flex items-center gap-3.5">
                        {clinic.image ? (
                            <img
                                src={clinic.image}
                                alt={clinic.name ?? "Clínica"}
                                className="h-11 w-11 rounded-md object-cover border border-[#252579]/20 shadow-sm"
                            />
                        ) : (
                            <div className="flex h-11 w-11 items-center justify-center rounded-md bg-[#252579]/10 text-[#252579] font-bold text-sm">
                                {clinic.name ? clinic.name.substring(0, 2).toUpperCase() : "CL"}
                            </div>
                        )}
                        <div>
                            <h2 className="text-sm font-bold text-foreground">{clinic.name ?? "Clínica"}</h2>
                            {clinic.address && (
                                <p className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                                    <MapPin className="h-3.5 w-3.5 text-[#252579]" />
                                    {clinic.address}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="inline-flex items-center gap-1.5 rounded-md bg-[#252579]/10 px-3 py-1 text-xs font-semibold text-[#252579]">
                        <Calendar className="h-3.5 w-3.5" />
                        Agendamento Online
                    </div>
                </div>

                {/* Subtítulo */}
                <div className="flex items-center gap-2 rounded-md border border-border/50 bg-muted/40 px-3.5 py-2 text-xs text-muted-foreground">
                    <CalendarDays className="h-4 w-4 text-[#252579]" />
                    <span>Preencha os dados abaixo para agendar seu horário</span>
                </div>

                {/* Formulário Principal */}
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleRegisterAppointment)}>
                        {/* Adicionado items-stretch para forçar ambas as colunas a terem exatamente a mesma altura */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
                            
                            {/* Coluna Esquerda: Dados Pessoais e Serviço */}
                            <div className="flex flex-col justify-between space-y-3.5 rounded-md border border-border/60 bg-card/40 p-4 shadow-sm">
                                <div className="space-y-3.5">
                                    <div className="border-b pb-2.5">
                                        <h3 className="text-xs font-bold text-[#252579] flex items-center gap-2">
                                            <UserRound className="h-4 w-4" /> 1. Dados Pessoais e Serviço
                                        </h3>
                                        <p className="text-[11px] text-muted-foreground mt-0.5">Preencha os seus dados para efetuar a marcação.</p>
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs font-semibold">Nome Completo</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <UserRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                                        <Input {...field} placeholder="Digite o seu nome completo..." className="pl-9 h-9 text-xs rounded-md" />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs font-semibold">E-mail</FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                                            <Input {...field} type="email" placeholder="seu@email.com" className="pl-9 h-9 text-xs rounded-md" />
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="phone"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs font-semibold">Telefone / WhatsApp</FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                                            <Input
                                                                {...field}
                                                                placeholder="(00) 00000-0000"
                                                                className="pl-9 h-9 text-xs rounded-md"
                                                                onChange={e => field.onChange(formatPhone(e.target.value))}
                                                            />
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <FormField
                                            control={form.control}
                                            name="gender"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs font-semibold">Gênero</FormLabel>
                                                    <Select onValueChange={field.onChange} value={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger className="h-9 text-xs rounded-md">
                                                                <SelectValue placeholder="Selecione..." />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent className="rounded-md">
                                                            <SelectItem value="MALE">Homem</SelectItem>
                                                            <SelectItem value="FEMALE">Mulher</SelectItem>
                                                            <SelectItem value="OTHER">Outro</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="date"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs font-semibold">Data do Agendamento</FormLabel>
                                                    <FormControl>
                                                        <AppointmentDatePicker
                                                            value={field.value}
                                                            onChange={date => {
                                                                field.onChange(date)
                                                                setSelectedTime("")
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
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs font-semibold">Serviço Doutor / Especialidade</FormLabel>
                                                <Select
                                                    onValueChange={value => {
                                                        field.onChange(value)
                                                        setSelectedTime("")
                                                    }}
                                                    value={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger className="h-9 text-xs rounded-md">
                                                            <SelectValue placeholder="Selecione o serviço..." />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent className="rounded-md">
                                                        {clinic.services.map(service => (
                                                            <SelectItem key={service.id} value={service.id}>
                                                                {service.name} - R$ {(service.price / 100).toFixed(2)} ({service.duration} min)
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                {/* Espaçador invisível apenas para igualar perfeitamente o alinhamento inferior caso necessário */}
                                <div className="pt-2" />
                            </div>

                            {/* Coluna Direita: Horários Disponíveis */}
                            <div className="flex flex-col justify-between space-y-3.5 rounded-md border border-border/60 bg-card/40 p-4 shadow-sm">
                                <div className="space-y-3.5">
                                    <div className="border-b pb-2.5 flex items-center justify-between">
                                        <div>
                                            <h3 className="text-xs font-bold text-[#252579] flex items-center gap-2">
                                                <Clock3 className="h-4 w-4" /> 2. Horários Disponíveis
                                            </h3>
                                            <p className="text-[11px] text-muted-foreground mt-0.5">Escolha um horário para atendimento na data selecionada.</p>
                                        </div>
                                        {selectedTime && (
                                            <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                                <CheckCircle2 className="h-3 w-3" /> {selectedTime}
                                            </span>
                                        )}
                                    </div>

                                    <div className="min-h-[260px] rounded-md border bg-background p-3 flex flex-col justify-between">
                                        {!selectedServiceId ? (
                                            <div className="flex flex-col items-center justify-center py-16 text-center text-xs text-muted-foreground">
                                                <Stethoscope className="mb-2 h-8 w-8 opacity-40 text-[#252579]" />
                                                <p className="font-medium text-foreground">Selecione um serviço primeiro</p>
                                                <p className="text-[11px] opacity-80 mt-0.5">Os horários disponíveis serão carregados aqui.</p>
                                            </div>
                                        ) : availableTimesSlots.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center py-16 text-center text-xs text-muted-foreground">
                                                <Clock3 className="mb-2 h-6 w-6 opacity-40" />
                                                <p className="font-medium text-foreground">Nenhum horário disponível</p>
                                                <p className="text-[11px] opacity-80 mt-0.5">Tente selecionar outra data.</p>
                                            </div>
                                        ) : (
                                            <ScheduleTimeList
                                                onSelectTime={setSelectedTime}
                                                clinicTimes={clinic.times}
                                                blockedTimes={blockedTimes}
                                                availableTimeSlots={availableTimesSlots}
                                                selectedTime={selectedTime}
                                                selectedDate={selectedDate}
                                                requiredSlots={requiredSlots}
                                            />
                                        )}
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isFormIncomplete || form.formState.isSubmitting}
                                    className="w-full bg-[#252579] hover:bg-[#1d1d60] text-white font-medium h-9 text-xs rounded-md shadow-sm transition-all mt-4"
                                >
                                    <CalendarDays className="mr-2 h-4 w-4" />
                                    {form.formState.isSubmitting ? "A agendar..." : "Confirmar Agendamento"}
                                </Button>
                            </div>

                        </div>
                    </form>
                </Form>
            </div>
        </TooltipProvider>
    )
}