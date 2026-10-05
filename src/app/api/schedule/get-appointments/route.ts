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

        const [year, month, day] = dateParam.split("-").map(Number)
        const startDate = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0))
        const endDate = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999))

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

        const appointments = await prisma.appointment.findMany({
            where: {
                userId: userId,
                appointmentDate: {
                    gte: startDate,
                    lte: endDate
                }
            },
            include: {
                Service: true,
            }
        })

        const defaultTimes = [
            "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
            "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
            "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
            "17:00", "17:30", "18:00", "18:30", "19:00", "19:30",
            "20:00", "20:30", "21:00", "21:30",
        ]
        const clinicTimes = user.times.length > 0 ? user.times : defaultTimes
        const blockedSlots = new Set<string>()

        for (const apt of appointments) {

            const durationInMinutes = Number(apt.Service.duration)
            const requiredSlots = Math.max(1, Math.ceil(durationInMinutes / 30))
            const startIndex = clinicTimes.indexOf(apt.time)

            if (startIndex !== -1) {
                for (let i = 0; i < requiredSlots; i++) {
                    const blockedSlot = clinicTimes[startIndex + i]
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