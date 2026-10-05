"use client"

import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

const formSchema = z.object({
    name: z.string().min(1, { message: "O nome do serviço é obrigatório" }),
    price: z.string().min(0, { message: "O preço do serviço é obrigatório" }),
    hours: z.string(),
    minutes: z.string(),
}).superRefine((values, context) => {
    const duration = (Number(values.hours) || 0) * 60 + (Number(values.minutes) || 0)

    if (duration < 30) {
        context.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["minutes"],
            message: "A duração mínima do serviço é de 30 minutos",
        })
    }
})

export interface UseDialogServiceFormProps {
    initialValues?: {
        name?: string
        price?: string
        hours?: string
        minutes?: string
    }
}

export type DialogServiceFormData = z.infer<typeof formSchema>

export function useDialogServiceForm({ initialValues }: UseDialogServiceFormProps) {
    return useForm<DialogServiceFormData>({
        resolver: zodResolver(formSchema),
        defaultValues: initialValues || {
            name: "",
            price: "",
            hours: "0",
            minutes: "0",
        },
    })
}