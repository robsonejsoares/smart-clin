"use server"

import { z } from "zod"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"

const formSchema = z.object({
    name: z.string().min(1, { message: "O nome do serviço é obrigatório" }),
    price: z.number().min(1, { message: "O preço do serviço é obrigatório" }),
    duration: z.number()
})

type FormSchema = z.infer<typeof formSchema>

export async function createNewService(formData: FormSchema) {
    const session = await auth()

    if (!session?.user?.id) {
        return {
            error: "Falha ao cadastrar serviço. Usuário não autenticado.",
        }
    }

    const schema = formSchema.safeParse(formData)

    if (!schema.success) {
        return {
            error: schema.error.issues[0].message,
        }
    }

    try {
        const newService = await prisma.service.create({
            data: {
                name: formData.name,
                price: formData.price,
                duration: formData.duration,
                userId: session.user.id,
            },
        })

        return {
            data: newService,
        }

    } catch (error) {
        console.error(error)
        
        return {
            error: "Falha ao cadastrar serviço.",
        }
    }
}