"use client"

import { useState } from "react"
import { toast } from "sonner"
import { format } from "date-fns"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Prisma } from "@/generated/prisma/client"
import { Loader2, UserRound, Mail, Phone, Stethoscope, Calendar, Clock, MapPin, Users, Info } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DatePicker } from "@/components/ui/date-picker"
import { useScheduleSlots } from "../_hooks/use-schedule-slots"
import { createNewAppointment } from "../../../_actions/appointments"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

type UserWithServiceAndSubscription = Prisma.UserGetPayload<{
    include: {
        subscription: true
        services: true
    }
}>

const appointmentSchema = z.object({
    name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
    email: z.string().email("Insira um endereço de e-mail válido"),
    phone: z.string().min(10, "Telefone inválido").regex(/^\d+$/, "Apenas números são permitidos no telefone"),
    gender: z.enum(["MALE", "FEMALE", "OTHER"], { message: "Selecione o gênero" }),
    serviceId: z.string().min(1, "Selecione um serviço"),
    date: z.date({ required_error: "Selecione uma data" }),
    time: z.string().min(1, "Selecione um horário"),
})

type AppointmentFormData = z.infer<typeof appointmentSchema>

interface DialogScheduleProps {
    clinic: UserWithServiceAndSubscription
    onSuccess?: () => void
}

const formatPhone = (value: string) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 11)
    if (cleaned.length === 0) return ""
    if (cleaned.length <= 2) return `(${cleaned}`
    if (cleaned.length <= 6) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`
    if (cleaned.length <= 10) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`
}

export function DialogSchedule({ clinic, onSuccess }: DialogScheduleProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<AppointmentFormData>({
        resolver: zodResolver(appointmentSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            gender: undefined,
            serviceId: "",
            date: undefined,
            time: "",
        },
        mode: "onChange",
    })

    const selectedDate = useWatch({
        control: form.control,
        name: "date",
    })

    const selectedServiceId = useWatch({
        control: form.control,
        name: "serviceId",
    })

    const name = useWatch({ control: form.control, name: "name" })
    const email = useWatch({ control: form.control, name: "email" })
    const phone = useWatch({ control: form.control, name: "phone" })
    const gender = useWatch({ control: form.control, name: "gender" })
    const selectedTime = useWatch({ control: form.control, name: "time" })
    const isFormComplete = Boolean(
        name?.trim() &&
        email?.trim() &&
        phone?.trim() &&
        gender &&
        selectedServiceId &&
        selectedDate &&
        selectedTime
    )

    const formattedDate = selectedDate ? format(selectedDate, "yyyy-MM-dd") : ""

    const { slots = [], isLoading: isLoadingSlots } = useScheduleSlots({
        clinicId: clinic.id,
        date: formattedDate,
        serviceId: selectedServiceId,
    }) as { slots: Array<{ time: string; available: boolean }>; isLoading: boolean }

    const googleMapsUrl = clinic.address
        ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(clinic.address)}`
        : "#"

    async function onSubmit(data: AppointmentFormData) {
        const whatsappWindow = window.open("about:blank", "_blank")

        try {
            setIsSubmitting(true)

            const result = await createNewAppointment({
                ...data,
            })

            if (!result.success) {
                whatsappWindow?.close()
                toast.error(result.message)
                return
            }

            const service = clinic.services.find((item) => item.id === data.serviceId)
            const appointmentDate = format(data.date, "dd/MM/yyyy")
            const message = [
                `*Olá, ${data.name}!*`,
                "",
                "Seu agendamento foi confirmado.",
                "",
                `*Serviço:* _${service?.name ?? "Atendimento"}_`,
                `*Data:* _${appointmentDate}_`,
                `*Horário:* _${data.time}_`,
                `*Clínica:* _${clinic.name ?? "SmartClin"}_`,
                clinic.address ? `*Endereço:* _${clinic.address}_\n${googleMapsUrl}` : "",
            ].filter(Boolean).join("\n")

            const whatsappPhone = data.phone.replace(/\D/g, "")
            if (whatsappPhone) {
                const normalizedPhone = whatsappPhone.startsWith("55")
                    ? whatsappPhone
                    : `55${whatsappPhone}`
                const whatsappUrl = `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(message)}`
                if (whatsappWindow) {
                    whatsappWindow.location.href = whatsappUrl
                } else {
                    window.open(whatsappUrl, "_blank", "noopener,noreferrer")
                }
            } else {
                whatsappWindow?.close()
            }

            let emailSent = false
            try {
                const emailResponse = await fetch("/api/notifications/appointment-confirmation", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        name: data.name,
                        email: data.email,
                        date: appointmentDate,
                        time: data.time,
                        service: service?.name ?? "Atendimento",
                        clinic: clinic.name ?? "SmartClin",
                        address: clinic.address ?? "",
                    }),
                })
                emailSent = emailResponse.ok
            } catch (error) {
                console.error("Erro ao solicitar e-mail de confirmação:", error)
            }

            if (!emailSent) {
                toast.warning("Agendamento confirmado, mas o e-mail ainda não foi enviado.")
            }

            toast.success(result.message)
            onSuccess?.()
        } catch {
            whatsappWindow?.close()
            toast.error("Ocorreu um erro inesperado ao realizar agendamento.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="group space-y-3 sm:space-y-4 px-1">

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-md border border-border/70 bg-card p-3 sm:p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        {clinic.image ? (
                            <img
                                src={clinic.image}
                                alt={clinic.name ?? "Clínica"}
                                className="h-10 w-10 sm:h-12 sm:w-12 rounded-md object-cover border border-[#252579]/20 shadow-sm shrink-0"
                            />
                        ) : (
                            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-md bg-[#252579]/10 text-[#252579] font-bold text-sm shrink-0">
                                {clinic.name ? clinic.name.substring(0, 2).toUpperCase() : "CL"}
                            </div>
                        )}
                        <div className="min-w-0">
                            <h2 className="text-sm sm:text-base font-bold text-foreground truncate">{clinic.name ?? "Clínica"}</h2>
                            {clinic.address && (
                                <a
                                    href={googleMapsUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground mt-0.5 truncate"
                                >
                                    <MapPin className="h-3.5 w-3.5 text-[#252579] shrink-0" />
                                    <span className="truncate">{clinic.address}</span>
                                </a>
                            )}
                        </div>
                    </div>
                    <div className="inline-flex items-center gap-1.5 rounded-md bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-700 shrink-0 self-start sm:self-auto">
                        <Calendar className="h-3.5 w-3.5 text-emerald-600" />
                        Agendamento online
                    </div>
                </div>

                <div className="flex w-full items-center gap-2 rounded-lg border border-[#252579]/15 bg-[#252579]/[0.035] px-3 py-1.5 shadow-sm transition-colors duration-200 group-hover:border-[#252579]/25">
                    <Info className="h-4 w-4 shrink-0 text-[#252579] transition-transform duration-500 ease-out group-hover:rotate-[18deg] group-hover:scale-110" />
                    <p className="text-xs text-muted-foreground">
                        Preencha os dados abaixo para agendar seu horário
                    </p>
                </div>

                <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-2">

                    <div className="group flex h-full flex-col space-y-3 rounded-md border bg-card p-3 shadow-sm sm:space-y-4 sm:p-5">
                        <div>
                            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-[#252579]/10 bg-[#252579]/[0.06] text-[#252579] transition-[background-color,border-color,transform,box-shadow] duration-300 group-hover:scale-105 group-hover:border-[#252579]/20 group-hover:bg-[#252579]/[0.09] group-hover:shadow-[0_4px_12px_rgba(37,37,121,0.08)]">
                                    <UserRound className="h-3.5 w-3.5 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3" />
                                </span>
                                Dados Pessoais e Serviço
                            </h3>
                            <p className="text-xs text-muted-foreground mt-0.5">Preencha os seus dados para efetuar a marcação.</p>
                        </div>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-medium text-foreground">Nome Completo</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <UserRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                placeholder="Digite o seu nome completo..."
                                                style={{ backgroundColor: 'var(--background)' }}
                                                className="pl-9 h-9 sm:h-10 text-xs sm:text-sm rounded-md text-foreground border-input focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-input"
                                                {...field}
                                            />
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
                                        <FormLabel className="text-xs font-medium text-foreground">E-mail</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    type="email"
                                                    placeholder="seu@email.com"
                                                    style={{ backgroundColor: 'var(--background)' }}
                                                    className="pl-9 h-9 sm:h-10 text-xs sm:text-sm rounded-md text-foreground border-input focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-input"
                                                    {...field}
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
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs font-medium text-foreground">Telefone / WhatsApp</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    type="text"
                                                    inputMode="numeric"
                                                    placeholder="(61) 99999-9999"
                                                    style={{ backgroundColor: 'var(--background)' }}
                                                    className="pl-9 h-9 sm:h-10 text-xs sm:text-sm rounded-md text-foreground border-input focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-input"
                                                    value={formatPhone(field.value || "")}
                                                    onChange={(e) => {
                                                        const numbersOnly = e.target.value.replace(/\D/g, "").slice(0, 11)
                                                        field.onChange(numbersOnly)
                                                    }}
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
                                        <FormLabel className="text-xs font-medium text-foreground">Gênero</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="relative h-9 sm:h-10 w-full rounded-lg border-border/80 bg-background px-3 pl-9 text-xs sm:text-sm font-normal text-foreground shadow-sm focus:ring-0 focus:ring-offset-0 focus:border-input cursor-pointer">
                                                    <Users className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none z-10" />
                                                    <SelectValue placeholder="Selecione..." />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem className="cursor-pointer text-xs sm:text-sm" value="MALE">Masculino</SelectItem>
                                                <SelectItem className="cursor-pointer text-xs sm:text-sm" value="FEMALE">Feminino</SelectItem>
                                                <SelectItem className="cursor-pointer text-xs sm:text-sm" value="OTHER">Outro</SelectItem>
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
                                        <FormLabel className="text-xs font-medium text-foreground">Data do Agendamento</FormLabel>
                                        <FormControl>
                                            <DatePicker
                                                value={field.value}
                                                onChange={(date) => {
                                                    field.onChange(date)
                                                    form.setValue("time", "")
                                                }}
                                                openUpward
                                                align="left"
                                                disablePastDates
                                                placeholder="Selecione a data..."
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
                                    <FormLabel className="text-xs font-medium text-foreground">Serviço / Especialidade</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="h-9 sm:h-10 text-xs sm:text-sm rounded-md bg-background text-foreground border-input focus:ring-0 focus:ring-offset-0 focus:border-input cursor-pointer">
                                                <div className="flex items-center gap-2 truncate">
                                                    <Stethoscope className="h-4 w-4 text-muted-foreground shrink-0" />
                                                    <SelectValue placeholder="Selecione o serviço..." />
                                                </div>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {clinic.services?.map((service) => (
                                                <SelectItem key={service.id} value={service.id} className="cursor-pointer text-xs sm:text-sm">
                                                    {service.name} - R$ {Number(service.price).toFixed(2)} ({service.duration} min)
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="group border rounded-md p-3 sm:p-5 flex flex-col justify-between bg-card shadow-sm h-full space-y-4">
                        <div>
                            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-[#252579]/10 bg-[#252579]/[0.06] text-[#252579] transition-[background-color,border-color,transform,box-shadow] duration-300 ease-out group-hover:scale-105 group-hover:border-[#252579]/20 group-hover:bg-[#252579]/[0.09] group-hover:shadow-[0_4px_12px_rgba(37,37,121,0.08)]">
                                    <Clock className="h-3.5 w-3.5 transition-transform duration-300 ease-out group-hover:scale-110 group-hover:-rotate-3" />
                                </span>
                                Horários Disponíveis
                            </h3>
                            <p className="text-xs text-muted-foreground mt-0.5">Escolha um horário para atendimento na data selecionada.</p>

                            <div className="mt-4">
                                {(!selectedServiceId || !selectedDate) ? (
                                    <div className="text-center py-8 sm:py-12 text-muted-foreground text-xs sm:text-sm border border-dashed rounded-md p-4">
                                        Selecione um serviço e uma data para ver os horários disponíveis.
                                    </div>
                                ) : isLoadingSlots ? (
                                    <div className="flex items-center justify-center py-8 sm:py-12 text-muted-foreground text-xs sm:text-sm">
                                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                                        Carregando horários...
                                    </div>
                                ) : slots.length === 0 ? (
                                    <div className="text-center py-8 sm:py-12 text-muted-foreground text-xs sm:text-sm border border-dashed rounded-md p-4">
                                        Nenhum horário disponível para esta data.
                                    </div>
                                ) : (
                                    <TooltipProvider delayDuration={150}>
                                        <div className="grid min-w-0 grid-cols-2 gap-2 sm:grid-cols-4">
                                        {slots.map((slot) => {
                                            const isSelected = selectedTime === slot.time
                                            return (
                                                <Tooltip key={slot.time}>
                                                    <TooltipTrigger asChild>
                                                        <span className={`block ${!slot.available ? "cursor-not-allowed" : ""}`}>
                                                            <button
                                                                type="button"
                                                                disabled={!slot.available}
                                                                title={!slot.available ? "Horário indisponível" : undefined}
                                                                aria-label={slot.available ? `Selecionar ${slot.time}` : `${slot.time}: horário indisponível`}
                                                                onClick={() => form.setValue("time", slot.time, { shouldValidate: true })}
                                                                className={`w-full py-2 text-xs font-medium rounded-md border transition-all ${!slot.available
                                                                    ? "pointer-events-none bg-muted text-muted-foreground border-border/60 cursor-not-allowed line-through opacity-60"
                                                                    : isSelected
                                                                        ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/40 shadow-sm cursor-pointer font-semibold"
                                                                        : "bg-background text-foreground border-border hover:bg-[#252579]/10 hover:text-[#252579] hover:border-[#252579]/40 cursor-pointer"
                                                                    }`}
                                                            >
                                                                {slot.time}
                                                            </button>
                                                        </span>
                                                    </TooltipTrigger>
                                                    {!slot.available && (
                                                        <TooltipContent side="top">
                                                            Horário indisponível
                                                        </TooltipContent>
                                                    )}
                                                </Tooltip>
                                            )
                                        })}
                                        </div>
                                    </TooltipProvider>
                                )}
                                <FormField
                                    control={form.control}
                                    name="time"
                                    render={() => (
                                        <FormItem>
                                            <FormMessage className="mt-2 text-xs sm:text-sm" />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={!isFormComplete || isSubmitting}
                            className="w-full bg-[#252579] hover:bg-[#1f1f63] text-white h-9 sm:h-10 text-xs sm:text-sm font-semibold rounded-md mt-4 focus-visible:ring-2 focus-visible:ring-[#252579]/30 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Confirmando Agendamento...
                                </>
                            ) : (
                                "Confirmar Agendamento"
                            )}
                        </Button>
                    </div>

                </div>
            </form>
        </Form>
    )
}
