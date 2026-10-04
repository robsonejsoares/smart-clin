"use server"

import { z } from "zod"
import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import type { ActionResult } from "@/lib/action-result"

const formSchema = z.object({
    name: z.string().min(1, { message: "O nome do serviço é obrigatório" }),
    price: z.number().min(1, { message: "O preço do serviço é obrigatório" }),
    duration: z.number(),
})

type FormSchema = z.infer<typeof formSchema>

export async function createNewService(
    formData: FormSchema
): Promise<ActionResult<{ id: string }>> {
    const session = await auth()

    if (!session?.user?.id) {
        return {
            success: false,
            message: "Falha ao cadastrar serviço. Usuário não autenticado.",
        }
    }

    const schema = formSchema.safeParse(formData)

    if (!schema.success) {
        return {
            success: false,
            message: schema.error.issues[0].message,
        }
    }

    try {
        const newService = await prisma.service.create({
            data: {
                name: schema.data.name,
                price: schema.data.price,
                duration: schema.data.duration,
                userId: session.user.id,
            },
            select: { id: true },
        })

        revalidatePath("/dashboard/services")

        return {
            success: true,
            message: "Serviço cadastrado com sucesso.",
            data: newService,
        }
    } catch (error) {
        console.error("Erro ao cadastrar serviço:", error)
        return {
            success: false,
            message: "Falha ao cadastrar serviço.",
        }
    }
}
