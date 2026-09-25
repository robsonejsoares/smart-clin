// Backend meusite.com/api/schedule/get-appointements

import prisma from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    const { searchParams } = request.nextUrl;

    const userId = searchParams.get('userId')
    const dateParam = searchParams.get('date')

    if (!userId || userId === "null" || !dateParam || dateParam === "null") {
        return NextResponse.json({
            error: "Nenhum agendamento encotnrado"
        }, {
            status: 400
        })
    }

    try {
        // Converte a data recebida em um objeto Date
        const [year, month, day] = dateParam.split("-").map(Number)
        const startDate = new Date(year, month - 1, day, 0, 0, 0)
        const endDate = new Date(year, month - 1, day, 23, 59, 59, 999)

        const user = await prisma.user.findFirst({
            where: {
                id: userId
            }
        })

        if (!user) {
            return NextResponse.json({
                error: "Nenhum agendamento encotnrado"
            }, {
                status: 400
            })
        }

        const appointements = await prisma.appointement.findMany({
            where: {
                userId: userId,
                appointementDate: {
                    gte: startDate,
                    lte: endDate
                }
            },
            include: {
                service: true,
            }
        })

        // Montar com todos os (slots) ocupados
        const blockedSlots = new Set<string>()

        for (const apt of appointements) {
            // Ex: apt.time = "10:00", apt.service.duration = 60 (1h)
            const requiredSlots = Math.ceil(apt.service.duration / 30)
            const startIndex = user.times.indexOf(apt.time)

            if (startIndex !== -1) {
                for (let i = 0; i < requiredSlots; i++) {
                    const blockedSlot = user.times[startIndex + 1]
                    if (blockedSlot) {
                        blockedSlots.add(blockedSlot)
                    }
                }
            }

        }

        const blockedtimes = Array.from(blockedSlots);

        console.log("blockedtimes: ", blockedtimes)

        return NextResponse.json(blockedtimes)

    } catch (err) {
        console.log(err);
        return NextResponse.json({
            error: "Nenhum agendamento encotnrado"
        }, {
            status: 400
        })
    }

}