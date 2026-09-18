"use server";

import { z } from "zod";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const formSchema = z.object({
    name: z.string().min(1, { message: "O campo nome é obrigatório." }),
    address: z.string().optional(),
    phone: z.string().optional(),
    status: z.boolean(),
    timeZone: z.string(),
    times: z.array(z.string())
})

type FormSchema = z.infer<typeof formSchema>;

export async function updateProfile(formData: FormSchema) {

    const session = await auth();
    if (!session) {
        return {
            error: "Usuário não autenticado.",
        };
    }

    const schema = formSchema.safeParse(formData);
    if (!schema.success) {
        return {
            error: "Preencha todos os campos.",
        };
    }

    try {
        await prisma.user.update({
            where: {
                id: session.user.id
            },
            data: {
                name: formData.name,
                adress: formData.address,
                phone: formData.phone,
                status: formData.status,
                timeZone: formData.timeZone,
                times: formData.times
            }
        });

        revalidatePath("/dashboard/profile");

        return {
            data: "Clínica atualizada com sucesso.",
        }

    } catch {
        return {
            error: "Ocorreu um erro ao atualizar a clínica.",
        };
    }
}