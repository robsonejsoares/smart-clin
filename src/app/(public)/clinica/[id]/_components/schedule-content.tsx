"use client"

import {
    useAppointmentForm,
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

import Image from "next/image"
import { MapPin } from "lucide-react"
import { Input } from "@/components/ui/input"
import { DateTimePicker } from "./date-picker"
import { formatPhone } from "@/utils/formatPhone"
import { Prisma } from "@/generated/prisma/client"
import "react-datepicker/dist/react-datepicker.css"
import logoImg from "../../../../../../public/logo-smart-clin.png"


type UserWithServiceAndSubscription = Prisma.UserGetPayload<{
    include: {
        subscription: true,
        services: true,
    },
}>

interface ScheduleContentProps {
    clinic: UserWithServiceAndSubscription
}

export function ScheduleContent({ clinic }: ScheduleContentProps) {

    const form = useAppointmentForm()

    return (
        <div>
            <div className="h-32 bg-emerald-300" />

            <section className="container max-auto px-4 -mt-16">
                <div className="max-w-2x1 max-auto">
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
            <section className="max-w-2xl mx-auto w-full mt-6">
                <Form {...form}>
                    <form className="mx-2 space-y-6 bg-white p-6 border rounded-md shadow-sm">
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
                                            placeholder="Digite seu telefone..."
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
                                        <Select onValueChange={field.onChange}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione um serviço..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {clinic.services.map((service) => (
                                                    <SelectItem key={service.id} value={service.id}>
                                                        {service.name} - {Math.floor(service.duration / 60)}h {service.duration % 60}min
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </form>
                </Form>
            </section>
        </div>
    )
}