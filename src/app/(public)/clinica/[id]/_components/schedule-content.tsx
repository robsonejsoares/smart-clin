"use client"

import { toast } from "sonner"
import Image from "next/image"
import { MapPin } from "lucide-react"
import { Input } from "@/components/ui/input"
import { DateTimePicker } from "./date-picker"
import { Button } from "@/components/ui/button"
import { formatPhone } from "@/utils/formatPhone"
import { Prisma } from "@/generated/prisma/client"
import "react-datepicker/dist/react-datepicker.css"
import { ScheduleTimeList } from "./schedule-time-list"
import logoImg from "../../../../../../public/logo-smart-clin.png"
import { createNewAppointment } from "../_actions/create-appointment"

import {
    useState,
    useEffect,
    useCallback,
    use,
} from "react"

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

type UserWithServiceAndSubscription = Prisma.UserGetPayload<{
    include: {
        subscription: true,
        services: true,
    },
}>

interface ScheduleContentProps {
    clinic: UserWithServiceAndSubscription
}

export interface TimeSlot {
    time: string
    available: boolean
}

export function ScheduleContent({ clinic }: ScheduleContentProps) {

    const form = useAppointmentForm()
    const { watch } = form

    const selectedDate = watch("date")
    const selectedServiceId = watch("serviceId")

    const [selectedTime, setSelectedTime] = useState("")
    const [loadingSlots, setLoadingSlots] = useState(false)
    const [blockedTimes, setBlockedTimes] = useState<string[]>([])
    const [availableTimesSlots, setAvailableTimesSlots] = useState<TimeSlot[]>([])

    const fetchBlockedTimes = useCallback(async (date: Date): Promise<string[]> => {
        try {
            const dateString = date.toISOString().split("T")[0]

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_URL}/api/schedule/get-appointments?userId=${clinic.id}&date=${dateString}`
            )

            const json = await response.json()

            if (!response.ok) {
                console.error("Erro na API:", json)
                return []
            }

            if (!Array.isArray(json)) {
                console.error("API não retornou um array:", json)
                return []
            }

            return json

        } catch (error) {
            console.error("Erro ao buscar horários bloqueados:", error)
            return []
        }
    }, [clinic.id])

    useEffect(() => {
        if (selectedDate) {
            fetchBlockedTimes(selectedDate).then((blocked) => {
                setBlockedTimes(blocked)

                const dateString = selectedDate.toISOString().split("T")[0]

                const dayOfWeek = selectedDate.getDay()

                const isSunday = dayOfWeek === 0
                const isSaturday = dayOfWeek === 6

                // Feriados nacionais fixos
                const holidays = [
                    `${selectedDate.getFullYear()}-01-01`, // Confraternização Universal
                    `${selectedDate.getFullYear()}-04-21`, // Tiradentes
                    `${selectedDate.getFullYear()}-05-01`, // Dia do Trabalho
                    `${selectedDate.getFullYear()}-09-07`, // Independência do Brasil
                    `${selectedDate.getFullYear()}-10-12`, // Nossa Senhora Aparecida
                    `${selectedDate.getFullYear()}-11-02`, // Finados
                    `${selectedDate.getFullYear()}-11-15`, // Proclamação da República
                    `${selectedDate.getFullYear()}-11-20`, // Consciência Negra
                    `${selectedDate.getFullYear()}-12-25`, // Natal
                ]

                const isHoliday = holidays.includes(dateString)

                const times = clinic.times || []

                const finalSlots = times.map((time) => {
                    const [hours, minutes] = time.split(":").map(Number)

                    const saturdayUnavailable =
                        isSaturday &&
                        (hours > 12 || (hours === 12 && minutes > 0))

                    return {
                        time,
                        available:
                            !isSunday &&
                            !isHoliday &&
                            !saturdayUnavailable &&
                            !blocked.includes(time)
                    }
                })

                setAvailableTimesSlots(finalSlots)

                const stillAvailable = finalSlots.find(
                    (slot) =>
                        slot.time === selectedTime &&
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
        selectedTime
    ])

    async function handleRegisterAppointment(formData: AppointmentFormData) {
        if (!selectedTime) {
            return
        }

        const response = await createNewAppointment({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            time: selectedTime,
            date: formData.date,
            serviceId: formData.serviceId,
            clinicId: clinic.id
        })

        if (response.error) {
            toast.error(response.error)
            return
        }

        toast.success("Agendamento realizado com sucesso!")
        form.reset()
        setSelectedTime("")
    }

    return (
        <div>
            <div className="h-32 bg-emerald-300" />

            <section className="container mx-auto px-4 -mt-16">
                <div className="max-w-2xl mx-auto">
                    <article className="flex flex-col items-center">
                        <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-white mb-8">
                            <Image
                                src={clinic.image ? clinic.image : logoImg}
                                alt="Foto da clínica"
                                className="object-cover"
                                fill
                            />
                        </div>
                        <h1 className="text-2xl font-bold mb-2" >
                            {clinic.name}
                        </h1>
                        <div className="flex items-center gap-1">
                            <MapPin className="w-5 h-5" />
                            <span>
                                {clinic.address ? clinic.address : "Endereço não informado"}
                            </span>
                        </div>
                    </article>
                </div>
            </section>

            {/* Formulário de agendamento */}
            <section className="max-w-2xl mx-auto w-full mt-6">
                <Form {...form}>
                    <form
                        className="mx-2 space-y-6 bg-white p-6 border rounded-md shadow-sm"
                        onSubmit={form.handleSubmit(handleRegisterAppointment)}
                    >
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem className="my-2">
                                    <FormLabel className="font-semibold">
                                        Nome Completo:
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            id="name"
                                            placeholder="Digite seu nome completo..."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem className="my-2">
                                    <FormLabel className="font-semibold">
                                        E-mail:
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            id="email"
                                            placeholder="Digite seu e-mail..."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem className="my-2">
                                    <FormLabel className="font-semibold">
                                        Telefone:
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            id="phone"
                                            placeholder="(00) 00000-0000"
                                            onChange={(e) => {
                                                const formattedValue = formatPhone(e.target.value);
                                                field.onChange(formattedValue);
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="date"
                            render={({ field }) => (
                                <FormItem className="flex items-center gap-2 space-y-1">
                                    <FormLabel className="font-semibold">
                                        Data do Agendamento:
                                    </FormLabel>
                                    <FormControl>
                                        <DateTimePicker
                                            initialDate={field.value}
                                            className="w-full rounded border p-2"
                                            onChange={(date) => {
                                                if (date) {
                                                    field.onChange(date)
                                                    setSelectedTime("")
                                                }
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="serviceId"
                            render={({ field }) => (
                                <FormItem className="">
                                    <FormLabel className="font-semibold">Serviço:</FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={(value) => {
                                                field.onChange(value)
                                                setSelectedTime("")
                                            }}
                                            defaultValue={field.value}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione um serviço..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {clinic.services.map((service) => (
                                                    <SelectItem key={service.id} value={service.id}>
                                                        {service.name} - R$ {service.price / 100} ({service.duration} min)
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {selectedServiceId && (
                            <div className="space-y-2">
                                <label className="font-semibold">
                                    Horários Disponíveis:
                                </label>
                                <div className="bg-gray-100 p-4 rounded-lg">
                                    {loadingSlots ? (
                                        <p>
                                            Carregando horários disponíveis...
                                        </p>
                                    ) : availableTimesSlots.length === 0 ? (
                                        <p>
                                            Nenhum horário disponível para a data selecionada.
                                        </p>
                                    ) : (
                                        <ScheduleTimeList
                                            onSelectTime={(time) => setSelectedTime(time)}
                                            clinicTimes={clinic.times}
                                            blockedTimes={blockedTimes}
                                            availableTimeSlots={availableTimesSlots}
                                            selectedTime={selectedTime}
                                            selectedDate={selectedDate}
                                            requiredSlots={
                                                clinic.services.find(service => service.id === selectedServiceId) ? Math.ceil(clinic.services.find(service =>
                                                    service.id === selectedServiceId)!.duration / 30) : 1
                                            }
                                        />
                                    )}
                                </div>
                            </div>

                        )}

                        {/* Botão Realizar Agendamento */}
                        {clinic.status ? (
                            <Button
                                className="w-full bg-emerald-500 enabled:hover:bg-emerald-400 disabled:bg-emerald-500 disabled:hover:bg-emerald-500 font-semibold"
                                type="submit"
                                disabled={
                                    !watch("name") ||
                                    !watch("email") ||
                                    !watch("phone") ||
                                    !watch("date") ||
                                    !watch("serviceId")
                                }
                            >
                                Realizar Agendamento
                            </Button>
                        ) : (
                            <p
                                className="text-red-600 bg-red-100 text-center px-4 py-2 rounded-md cursor-not-allowed">
                                Neste momento, a clínica está fechada.
                            </p>
                        )}
                    </form>
                </Form>
            </section>
        </div >
    )
}
