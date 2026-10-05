"use client"

import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

export const appointmentSchema = z.object({
    name: z.string().min(1, "O nome é obrigatório"),
    email: z.string().email("O e-mail é obrigatório"),
    phone: z.string().min(1, "O telefone é obrigatório"),

    gender: z.enum(
        ["MALE", "FEMALE", "OTHER"],
        {
            message: "O gênero é obrigatório",
        }
    ),

    date: z.date(),
    serviceId: z.string().min(1, "O serviço é obrigatório"),
})

export type AppointmentFormData = z.infer<typeof appointmentSchema>

export function useAppointmentForm() {
    return useForm<AppointmentFormData>({
        resolver: zodResolver(appointmentSchema),


        defaultValues: {
            name: "",
            email: "",
            phone: "",
            gender: undefined,
            serviceId: "",
            date: new Date(),
        },
    })
}
