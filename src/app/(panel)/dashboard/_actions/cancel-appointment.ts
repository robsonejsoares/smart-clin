"use server"

import { z } from "zod"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import type { ActionResult } from "@/lib/action-result"

const formSchema = z.object({
    appointmentId: z.string().min(1, "Você precisa fornecer um agendamento"),
})

type FormSchema = z.infer<typeof formSchema>

export async function cancelAppointment(formData: FormSchema): Promise<ActionResult> {
    const schema = formSchema.safeParse(formData)

    if (!schema.success) {
        return {
            success: false,
            message: schema.error.issues[0].message,
        }
    }

    const session = await auth()

    if (!session?.user?.id) {
        return {
            success: false,
            message: "Usuário não encontrado.",
        }
    }

    try {
        await prisma.appointment.delete({
            where: {
                id: schema.data.appointmentId,
                userId: session.user.id,
            },
        })

        revalidatePath("/dashboard")

        return {
            success: true,
            message: "Agendamento cancelado com sucesso.",
        }
    } catch (error) {
        console.error("Erro ao cancelar agendamento:", error)
        return {
            success: false,
            message: "Ocorreu um erro ao deletar este agendamento.",
        }
    }
}
