"use server"

import { z } from "zod"
import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import type { ActionResult } from "@/lib/action-result"

const formSchema = z.object({
    name: z.string().min(1, { message: "O campo nome é obrigatório." }),
    address: z.string().optional(),
    phone: z.string().optional(),
    status: z.boolean(),
    timeZone: z.string(),
    times: z.array(z.string()),
})

type FormSchema = z.infer<typeof formSchema>

export async function updateProfile(formData: FormSchema): Promise<ActionResult> {
    const session = await auth()

    if (!session?.user?.id) {
        return {
            success: false,
            message: "Usuário não autenticado.",
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
        await prisma.user.update({
            where: { id: session.user.id },
            data: schema.data,
        })

        revalidatePath("/dashboard/profile")

        return {
            success: true,
            message: "Alteração realizada com sucesso.",
        }
    } catch (error) {
        console.error("Erro ao atualizar perfil:", error)
        return {
            success: false,
            message: "Ocorreu um erro ao realizar a alteração.",
        }
    }
}
