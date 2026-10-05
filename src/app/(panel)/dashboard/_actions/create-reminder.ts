"use server"

import { z } from "zod"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import type { ActionResult } from "@/lib/action-result"

const formSchema = z.object({
    description: z.string().min(1, "A descrição do lembrete é obrigatória"),
})

type FormSchema = z.infer<typeof formSchema>

export async function createReminder(formData: FormSchema): Promise<ActionResult> {
    const session = await auth()

    if (!session?.user?.id) {
        return { success: false, message: "Falha ao cadastrar lembrete" }
    }

    const schema = formSchema.safeParse(formData)

    if (!schema.success) {
        return { success: false, message: schema.error.issues[0].message }
    }

    try {
        await prisma.reminder.create({
            data: {
                description: schema.data.description,
                userId: session.user.id,
            },
        })

        revalidatePath("/dashboard")

        return {
            success: true,
            message: "Lembrete cadastrado com sucesso!",
        }
    } catch (error) {
        console.error("Erro ao cadastrar lembrete:", error)
        return {
            success: false,
            message: "Falha ao cadastrar lembrete",
        }
    }
}
