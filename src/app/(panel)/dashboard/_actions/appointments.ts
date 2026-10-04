"use server"

import { z } from "zod"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import type { ActionResult } from "@/lib/action-result"

const formSchema = z.object({
    name: z.string().min(1, "O nome é obrigatório"),
    email: z.string().email("O email é obrigatório"),
    phone: z.string().min(1, "O telefone é obrigatório"),
    gender: z.enum(["MALE", "FEMALE", "OTHER"], {
        message: "O gênero é obrigatório",
    }),
    date: z.date(),
    serviceId: z.string().min(1, "O serviço é obrigatório"),
    time: z.string().min(1, "O horário é obrigatório"),
})

type FormSchema = z.infer<typeof formSchema>

export async function createNewAppointment(
    formData: FormSchema
): Promise<ActionResult<{ id: string }>> {
    const session = await auth()
    const clinicId = session?.user?.id

    if (!clinicId) {
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
        const data = schema.data
        const selectedDate = new Date(data.date)
        const appointmentDate = new Date(Date.UTC(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            selectedDate.getDate(),
            0,
            0,
            0,
            0
        ))

        const newAppointment = await prisma.$transaction(async (transaction) => {
            const [clinic, service, existingAppointments] = await Promise.all([
                transaction.user.findUnique({
                    where: { id: clinicId },
                    select: { id: true, times: true },
                }),
                transaction.service.findFirst({
                    where: {
                        id: data.serviceId,
                        userId: clinicId,
                        status: true,
                    },
                    select: { id: true, duration: true },
                }),
                transaction.appointment.findMany({
                    where: {
                        userId: clinicId,
                        appointmentDate,
                    },
                    include: {
                        Service: {
                            select: { duration: true },
                        },
                    },
                }),
            ])

            if (!clinic) {
                throw new Error("CLINIC_NOT_FOUND")
            }

            if (!service) {
                throw new Error("SERVICE_NOT_FOUND")
            }

            const clinicTimes = clinic.times.filter((time) => time <= "21:30")
            const requiredSlots = Math.ceil(service.duration / 30)
            const startIndex = clinicTimes.indexOf(data.time)

            if (
                startIndex === -1 ||
                startIndex + requiredSlots > clinicTimes.length
            ) {
                throw new Error("TIME_UNAVAILABLE")
            }

            const requestedSlots = clinicTimes.slice(
                startIndex,
                startIndex + requiredSlots
            )
            const blockedSlots = new Set<string>()

            for (const appointment of existingAppointments) {
                const appointmentStartIndex = clinicTimes.indexOf(appointment.time)
                const appointmentSlots = Math.ceil(appointment.Service.duration / 30)

                if (appointmentStartIndex === -1) {
                    continue
                }

                for (const slot of clinicTimes.slice(
                    appointmentStartIndex,
                    appointmentStartIndex + appointmentSlots
                )) {
                    blockedSlots.add(slot)
                }
            }

            if (requestedSlots.some((slot) => blockedSlots.has(slot))) {
                throw new Error("TIME_UNAVAILABLE")
            }

            return transaction.appointment.create({
                data: {
                    name: data.name,
                    email: data.email,
                    phone: data.phone,
                    gender: data.gender,
                    time: data.time,
                    appointmentDate,
                    serviceId: service.id,
                    userId: clinicId,
                    updatedAt: new Date(),
                },
                select: { id: true },
            })
        })

        return {
            success: true,
            message: "Agendamento criado com sucesso.",
            data: newAppointment,
        }
    } catch (error) {
        if (error instanceof Error && error.message === "SERVICE_NOT_FOUND") {
            return {
                success: false,
                message: "Serviço não encontrado ou indisponível.",
            }
        }

        if (error instanceof Error && error.message === "TIME_UNAVAILABLE") {
            return {
                success: false,
                message: "O horário selecionado não está disponível.",
            }
        }

        console.error("Erro ao criar agendamento:", error)
        return {
            success: false,
            message: "Erro ao cadastrar agendamento.",
        }
    }
}
