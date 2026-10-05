"use server"

import { z } from "zod"
import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import type { ActionResult } from "@/lib/action-result"

const formSchema = z.object({
    serviceId: z.string().min(1, "O ID do serviço é obrigatório"),
    name: z.string().min(1, { message: "O nome do serviço é obrigatório" }),
    price: z.number().min(1, { message: "O preço do serviço é obrigatório" }),
    duration: z.number()
})

type FormSchema = z.infer<typeof formSchema>

export async function updateService(formData: FormSchema): Promise<ActionResult> {
    const session = await auth()

    if (!session?.user?.id) {
        return {
            success: false,
            message: "Falha ao atualizar serviço.",
        }
    }

    const schema = formSchema.safeParse(formData)

    if (!schema.success) {
        return {
            success: false,
            message: schema.error.issues[0].message,
        }
    }

    if (schema.data.duration < 30) {
        return {
            success: false,
            message: "A duração mínima do serviço é de 30 minutos.",
        }
    }

    try {
        await prisma.service.update({
            where: {
                id: schema.data.serviceId,
                userId: session?.user?.id,
            },
            data: {
                name: schema.data.name,
                price: schema.data.price,
                duration: schema.data.duration,
            },
        })

        revalidatePath("/dashboard/services")
        revalidatePath("/dashboard")

        return {
            success: true,
            message: "Serviço atualizado com sucesso!",
        }
    } catch (error) {
        console.error(error)
        return {
            success: false,
            message: "Falha ao atualizar serviço.",
        }
    }

}