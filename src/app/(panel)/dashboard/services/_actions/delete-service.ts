"use server"

import { z } from "zod"
import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import type { ActionResult } from "@/lib/action-result"

const formSchema = z.object({
    serviceId: z.string().min(1, { message: "O ID do serviço é obrigatório" }),
})

type FormSchema = z.infer<typeof formSchema>

export async function deleteService(formData: FormSchema): Promise<ActionResult> {
    const session = await auth()

    if (!session?.user?.id) {
        return {
            success: false,
            message: "Falha ao deletar serviço.",
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
        const appointmentCount = await prisma.appointment.count({
            where: {
                serviceId: schema.data.serviceId,
                userId: session.user.id,
            },
        })

        if (appointmentCount > 0) {
            return {
                success: false,
                message: "Este serviço não pode ser excluído porque possui agendamentos cadastrados.",
            }
        }

        await prisma.service.update({
            where: {
                id: schema.data.serviceId,
                userId: session.user.id,
            },
            data: { status: false },
        })

        revalidatePath("/dashboard/services")
        revalidatePath("/dashboard")

        return {
            success: true,
            message: "Serviço excluído com sucesso.",
        }
    } catch (error) {
        console.error("Erro ao excluir serviço:", error)
        return {
            success: false,
            message: "Falha ao excluir serviço.",
        }
    }
}
