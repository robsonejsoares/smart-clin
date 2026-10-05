"use server"

import { z } from "zod";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import type { ActionResult } from "@/lib/action-result"

const formSchema = z.object({
    reminderId: z.string({ errorMap: () => ({ message: "O id do lembrete é obrigatório" }) }).min(1, "O id do lembrete é obrigatório"),
})

type FormSchema = z.infer<typeof formSchema>

export async function deleteReminder(formData: FormSchema): Promise<ActionResult> {

    const schema = formSchema.safeParse(formData)

    if (!schema.success) {
        return {
            success: false,
            message: schema.error.issues[0].message,
        }
    }

    const session = await auth()
    const userId = session?.user?.id

    if (!userId) {
        return {
            success: false,
            message: "Usuário não autenticado.",
        }
    }

    try {

        const deletedReminder = await prisma.reminder.deleteMany({
            where: {
                id: schema.data.reminderId,
                userId,
            }
        })

        if (deletedReminder.count === 0) {
            return {
                success: false,
                message: "Lembrete não encontrado.",
            }
        }

        revalidatePath("/dashboard")

        return {
            success: true,
            message: "Lembrete excluído com sucesso.",
        }

    } catch (error) {
        console.error("Erro ao excluir lembrete:", error)
        return {
            success: false,
            message: "Não foi possível excluir o lembrete.",
        }
    }
}